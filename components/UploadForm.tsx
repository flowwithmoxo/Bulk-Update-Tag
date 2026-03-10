"use client";

import { useState, useRef, useCallback } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError("");

    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function getFileIcon(name: string) {
    if (name.endsWith(".csv")) {
      return (
        <div className="w-10 h-10 rounded-moxo bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D9D78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 2v6h6" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-moxo bg-blue-50 flex items-center justify-center flex-shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3AA9E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
          <path d="M14 2v6h6" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* ─── Drop Zone ─── */}
        <div
          className={`drop-zone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
          }}
        >
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {!file ? (
              <>
                <div className="w-14 h-14 rounded-full bg-moxo-cyan/10 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3AA9E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-moxo-heading">
                  Drop your file here, or{" "}
                  <span className="text-moxo-cyan">browse</span>
                </p>
                <p className="text-xs text-moxo-body-light mt-1.5">
                  Supports CSV and Excel files up to {MAX_FILE_SIZE_MB}MB
                </p>
              </>
            ) : (
              <div className="flex items-center gap-4 animate-scale-in">
                {getFileIcon(file.name)}
                <div className="text-left">
                  <p className="text-sm font-medium text-moxo-heading truncate max-w-[280px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-moxo-body-light mt-0.5">
                    {formatFileSize(file.size)} — Ready to upload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setError("");
                    setSummary(null);
                    setResults([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-auto w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors text-moxo-body-light hover:text-red-500"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Action Row ─── */}
        <div className="flex items-center justify-between mt-5">
          <div className="text-xs text-moxo-body-light">
            {file
              ? "File selected. Click submit to start processing."
              : "No file selected yet."}
          </div>
          <button
            type="submit"
            disabled={loading || !file}
            className="inline-flex items-center gap-2.5 rounded-moxo bg-moxo-btn px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-moxo-btn-hover hover:shadow-moxo-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Processing…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                Submit &amp; Update
              </>
            )}
          </button>
        </div>
      </form>

      {/* ─── Loading Progress ─── */}
      {loading && (
        <div className="animate-fade-in">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: "60%", transition: "width 2s ease" }}
            />
          </div>
          <p className="text-xs text-moxo-body-light mt-2">
            Processing your file… This may take a moment.
          </p>
        </div>
      )}

      {/* ─── Error State ─── */}
      {error && (
        <div className="flex items-start gap-3 rounded-moxo bg-moxo-error-bg border border-red-100 p-4 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E5484D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Upload Error</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ─── Summary Cards ─── */}
      {summary && (
        <div className="stagger-children grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label="Total Processed"
            value={summary.total}
            color="cyan"
          />
          <SummaryCard
            label="Successful"
            value={summary.successCount}
            color="success"
          />
          <SummaryCard
            label="Failed"
            value={summary.failureCount}
            color="error"
          />
        </div>
      )}

      {/* ─── Results Table ─── */}
      {results.length > 0 && <ResultsTable results={results} />}
    </div>
  );
}

/* ─── Summary Card ─── */
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "cyan" | "success" | "error";
}) {
  const styles = {
    cyan: {
      bg: "bg-moxo-cyan-light",
      accent: "text-moxo-cyan",
      ring: "bg-moxo-cyan/10",
    },
    success: {
      bg: "bg-moxo-success-bg",
      accent: "text-moxo-success",
      ring: "bg-moxo-success/10",
    },
    error: {
      bg: "bg-moxo-error-bg",
      accent: "text-moxo-error",
      ring: "bg-moxo-error/10",
    },
  };

  const icons = {
    cyan: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    success: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };

  const s = styles[color];

  return (
    <div className={`rounded-moxo-lg border border-moxo-border-light ${s.bg} p-5 shadow-moxo`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-moxo-body uppercase tracking-wider">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-full ${s.ring} ${s.accent} flex items-center justify-center`}>
          {icons[color]}
        </div>
      </div>
      <p className={`text-3xl font-bold tracking-tight ${s.accent}`}>{value}</p>
    </div>
  );
}