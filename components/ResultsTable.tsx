import { UpdateResult } from "@/lib/types";

export default function ResultsTable({ results }: { results: UpdateResult[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">Workspace ID</th>
            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">Workspace Name</th>
            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">Status</th>
            <th className="border-b border-slate-200 px-4 py-3 text-left font-medium">Message</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={`${result.workspaceId}-${index}`} className="bg-white">
              <td className="border-b border-slate-200 px-4 py-3">{result.workspaceId}</td>
              <td className="border-b border-slate-200 px-4 py-3">{result.workspaceName || "-"}</td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.success ? "Success" : "Failed"}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">{result.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
