import { UpdateResult } from "@/lib/types";

export default function ResultsTable({ results }: { results: UpdateResult[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-moxo border border-moxo-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-[#F9F8F8] text-moxo-heading">
          <tr>
            <th className="border-b border-moxo-border px-5 py-3.5 text-left font-medium">Workspace ID</th>
            <th className="border-b border-moxo-border px-5 py-3.5 text-left font-medium">Workspace Name</th>
            <th className="border-b border-moxo-border px-5 py-3.5 text-left font-medium">Status</th>
            <th className="border-b border-moxo-border px-5 py-3.5 text-left font-medium">Message</th>
          </tr>
        </thead>
        <tbody className="text-moxo-body">
          {results.map((result, index) => (
            <tr key={`${result.workspaceId}-${index}`} className="group hover:bg-[#FDFDFD] transition-colors">
              <td className="border-b border-moxo-border px-5 py-3.5 group-last:border-b-0">{result.workspaceId}</td>
              <td className="border-b border-moxo-border px-5 py-3.5 group-last:border-b-0">{result.workspaceName || "-"}</td>
              <td className="border-b border-moxo-border px-5 py-3.5 group-last:border-b-0">
                <span className={result.success ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                  {result.success ? "Success" : "Failed"}
                </span>
              </td>
              <td className="border-b border-moxo-border px-5 py-3.5 group-last:border-b-0">{result.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
