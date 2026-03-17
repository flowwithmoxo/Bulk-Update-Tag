"use client";

import { useState } from "react";
import { UpdateResult } from "@/lib/types";

export default function ResultsTable({ results }: { results: UpdateResult[] }) {
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  const filtered = results.filter((r) => {
    if (filter === "success") return r.success;
    if (filter === "failed") return !r.success;
    return true;
  });

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="animate-fade-in">
      {/* ─── Table Header ─── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-moxo-heading">
          Update Results
        </h3>
        <div className="flex items-center gap-1 bg-moxo-bg rounded-moxo p-1 border border-moxo-border-light">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            count={results.length}
          >
            All
          </FilterPill>
          <FilterPill
            active={filter === "success"}
            onClick={() => setFilter("success")}
            count={successCount}
            color="success"
          >
            Success
          </FilterPill>
          <FilterPill
            active={filter === "failed"}
            onClick={() => setFilter("failed")}
            count={failCount}
            color="error"
          >
            Failed
          </FilterPill>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="overflow-hidden rounded-moxo-lg border border-moxo-border bg-white shadow-moxo">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAF9]">
                <th className="border-b border-moxo-border px-4 py-3 text-left text-xs font-semibold text-moxo-body uppercase tracking-wider w-16">
                  Row
                </th>
                <th className="border-b border-moxo-border px-4 py-3 text-left text-xs font-semibold text-moxo-body uppercase tracking-wider">
                  Binder ID
                </th>
                <th className="border-b border-moxo-border px-4 py-3 text-left text-xs font-semibold text-moxo-body uppercase tracking-wider">
                  Tags
                </th>
                <th className="border-b border-moxo-border px-4 py-3 text-left text-xs font-semibold text-moxo-body uppercase tracking-wider w-24">
                  Status
                </th>
                <th className="border-b border-moxo-border px-4 py-3 text-left text-xs font-semibold text-moxo-body uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-moxo-border-light">
              {filtered.map((result, index) => (
                <tr
                  key={`${result.binderId}-${result.rowNumber}-${index}`}
                  className="group hover:bg-moxo-bg/50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-moxo-body-light text-xs tabular-nums w-16">
                    {result.rowNumber}
                  </td>
                  <td className="px-4 py-3 text-moxo-heading font-medium whitespace-nowrap min-w-[120px]">
                    <code className="text-xs bg-moxo-bg px-2 py-0.5 rounded font-mono text-moxo-body">
                      {result.binderId}
                    </code>
                  </td>
                  <td className="px-4 py-3 min-w-[150px]">
                    {result.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {result.tags.map((tag, tagIdx) => (
                          <span
                            key={`${tag.name}-${tagIdx}`}
                            className="inline-flex items-center rounded bg-moxo-bg px-2 py-0.5 text-2xs text-moxo-body border border-moxo-border-light"
                            title={`${tag.name}: ${tag.value || "(empty)"}`}
                          >
                            <span className="font-medium text-moxo-heading">{tag.name}</span>
                            {tag.value ? (
                              <>
                                <span className="mx-1 text-moxo-body-light">:</span>
                                <span>{tag.value}</span>
                              </>
                            ) : (
                              <span className="ml-1 text-moxo-body-light italic">(clear)</span>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-moxo-body-light">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 w-28">
                    <StatusBadge success={result.success} />
                  </td>
                  <td className="px-4 py-3 text-moxo-body text-xs break-words min-w-[200px] leading-relaxed">
                    {result.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Empty state ─── */}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-moxo-body-light">
            No results match the current filter.
          </div>
        )}

        {/* ─── Table footer ─── */}
        <div className="border-t border-moxo-border bg-[#FAFAF9] px-5 py-3 flex items-center justify-between text-xs text-moxo-body-light">
          <span>
            Showing {filtered.length} of {results.length} rows
          </span>
          <span>
            {successCount} succeeded · {failCount} failed
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ success }: { success: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        success
          ? "bg-moxo-success-bg text-moxo-success"
          : "bg-moxo-error-bg text-moxo-error"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          success ? "bg-moxo-success" : "bg-moxo-error"
        }`}
      />
      {success ? "Success" : "Failed"}
    </span>
  );
}

/* ─── Filter Pill ─── */
function FilterPill({
  children,
  active,
  onClick,
  count,
  color,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  count: number;
  color?: "success" | "error";
}) {
  let countColor = "text-moxo-body-light";
  if (active && color === "success") countColor = "text-moxo-success";
  if (active && color === "error") countColor = "text-moxo-error";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-white text-moxo-heading shadow-moxo"
          : "text-moxo-body hover:text-moxo-heading"
      }`}
    >
      {children}
      <span className={`text-2xs ${countColor}`}>({count})</span>
    </button>
  );
}
