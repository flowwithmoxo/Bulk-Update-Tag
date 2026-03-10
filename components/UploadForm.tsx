"use client";

import { useState } from "react";
import ResultsTable from "@/components/ResultsTable";
import { UpdateResult, UploadResponse } from "@/lib/types";

const ALLOWED_EXTENSIONS = [".csv", ".xlsx"];
const MAX_FILE_SIZE_MB = 10;

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<UpdateResult[]>([]);
  const [summary, setSummary] = useState<UploadResponse | null>(null);

  function validateFile(selectedFile: File | null) {
    if (!selectedFile) {
      return "Please select a CSV or Excel file.";
    }

    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );

    if (!hasValidExtension) {
      return "Only .csv and .xlsx files are allowed.";
    }

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      return `File size must be under ${MAX_FILE_SIZE_MB} MB.`;
    }

    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResults([]);
    setSummary(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", file as File);

    setLoading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data: UploadResponse & { error?: string };

      try {
        data = await response.json();
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setSummary(data);
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null;
    setError("");
    setFile(selectedFile);
  }

  return (
    <div className="mt-10">
      <div className="mb-8 flex flex-wrap gap-4">
        <a
          href="/api/sample-csv"
          className="inline-flex rounded-moxo border border-moxo-border px-5 py-2.5 text-sm font-medium text-moxo-heading hover:bg-[#F9F8F8] transition-colors"
        >
          Download Sample CSV
        </a>

        <a
          href="/api/sample-excel"
          className="inline-flex rounded-moxo border border-moxo-border px-5 py-2.5 text-sm font-medium text-moxo-heading hover:bg-[#F9F8F8] transition-colors"
        >
          Download Sample Excel
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-moxo border border-moxo-border bg-[#FCFAFA] p-8 shadow-sm"
      >
        <label htmlFor="file-upload" className="mb-4 block text-sm font-medium text-moxo-heading">
          Select CSV or Excel file to upload
        </label>

        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm text-moxo-body file:mr-5 file:py-2.5 file:px-5 file:rounded-moxo file:border-0 file:text-sm file:font-medium file:bg-[#EAE8E6] file:text-moxo-heading hover:file:bg-[#DFDDDB] hover:file:cursor-pointer transition-colors"
        />

        {file ? (
          <p className="mt-2 text-sm text-slate-600">
            Selected file: {file.name}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !file}
          className="mt-6 inline-flex rounded-moxo bg-moxo-btn px-6 py-2.5 text-sm font-medium text-white hover:bg-moxo-btn-hover transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error ? <p className="mt-5 text-sm text-rose-600 font-medium">{error}</p> : null}

      {summary ? (
        <div className="mt-8 rounded-moxo border border-moxo-border bg-white p-6 shadow-sm text-sm text-moxo-body">
          <p className="mb-1"><strong className="text-moxo-heading">Total Processed:</strong> {summary.total}</p>
          <p className="mb-1"><strong className="text-moxo-heading">Success:</strong> <span className="text-emerald-600 font-medium">{summary.successCount}</span></p>
          <p><strong className="text-moxo-heading">Failed:</strong> <span className="text-rose-600 font-medium">{summary.failureCount}</span></p>
        </div>
      ) : null}

      {results.length > 0 ? <ResultsTable results={results} /> : null}
    </div>
  );
}