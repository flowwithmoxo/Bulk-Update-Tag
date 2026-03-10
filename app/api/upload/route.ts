import { extractTags, parseCsvText, validateRows } from "@/lib/csv";
import { delay, getAccessToken, updateWorkspaceTags } from "@/lib/moxo";
import { UpdateResult } from "@/lib/types";
import { parseExcelFile } from "@/lib/csv";

const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || "500");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "CSV file is required." }, { status: 400 });
    }

let rows;

if (file.name.endsWith(".xlsx")) {
  const buffer = await file.arrayBuffer();
  rows = parseExcelFile(buffer);
} else {
  const text = await file.text();
  rows = parseCsvText(text);
}
    validateRows(rows);

    const accessToken = await getAccessToken();
    const results: UpdateResult[] = [];

    for (const row of rows) {
      const workspaceId = row.workspace_id.trim();
      const workspaceName = (row.workspace_name || row.workspace_id).trim();
      const tags = extractTags(row);

      if (!tags.length) {
        results.push({
          workspaceId,
          workspaceName,
          success: false,
          message: "No valid workspace tags found in row.",
        });
        continue;
      }

      const result = await updateWorkspaceTags({
        accessToken,
        workspaceId,
        workspaceName,
        tags,
      });

      results.push(result);
      await delay(REQUEST_DELAY_MS);
    }

    return Response.json({
      total: results.length,
      successCount: results.filter((item) => item.success).length,
      failureCount: results.filter((item) => !item.success).length,
      results,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}
