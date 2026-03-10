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
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href="/api/sample-csv"
          className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Download Sample CSV
        </a>

        <a
          href="/api/sample-excel"
          className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Download Sample Excel
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-slate-50 p-6"
      >
        <label htmlFor="file-upload" className="mb-3 block text-sm font-medium">
          Upload CSV or Excel file
        </label>

        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full text-sm"
        />

        {file ? (
          <p className="mt-2 text-sm text-slate-600">
            Selected file: {file.name}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !file}
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {summary ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <p><strong>Total:</strong> {summary.total}</p>
          <p><strong>Success:</strong> {summary.successCount}</p>
          <p><strong>Failed:</strong> {summary.failureCount}</p>
        </div>
      ) : null}

      {results.length > 0 ? <ResultsTable results={results} /> : null}
    </div>
  );
}