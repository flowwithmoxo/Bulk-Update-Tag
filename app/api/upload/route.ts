import {
  extractTags,
  parseCsvText,
  parseExcelFile,
  getHeaders,
  hasTagColumns,
  cleanValue,
} from "@/lib/csv";
import { delay, getAccessToken, validateBinder, updateWorkspaceTags } from "@/lib/moxo";
import { UpdateResult, MoxoConfig } from "@/lib/types";

const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || "500");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const configStr = formData.get("config");

    if (!(file instanceof File)) {
      return Response.json({ error: "A CSV or Excel file is required." }, { status: 400 });
    }

    if (!configStr || typeof configStr !== "string") {
      return Response.json({ error: "Moxo configuration is required." }, { status: 400 });
    }

    let config: MoxoConfig;
    try {
      config = JSON.parse(configStr);
    } catch {
      return Response.json({ error: "Invalid Moxo configuration format." }, { status: 400 });
    }

    // ─── Parse rows ───
    let rows;
    if (file.name.endsWith(".xlsx")) {
      const buffer = await file.arrayBuffer();
      rows = parseExcelFile(buffer);
    } else {
      const text = await file.text();
      rows = parseCsvText(text);
    }

    if (!rows.length) {
      return Response.json({ error: "The uploaded file is empty." }, { status: 400 });
    }

    // ─── Check if tag columns exist in the template ───
    const headers = getHeaders(rows[0]);
    const templateHasTags = hasTagColumns(headers);

    // ─── Get access token once ───
    const accessToken = await getAccessToken(config);

    // ─── Process each row independently ───
    const results: UpdateResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; 
      const binderId = cleanValue(row.binder_id);
      const tags = extractTags(row);

      // Step 1: Validate required field
      if (!binderId) {
        results.push({
          rowNumber,
          binderId: binderId || "(empty)",
          tags,
          success: false,
          message: "Missing required field: binder_id",
        });
        continue;
      }

      // Step 2: Validate tag fields
      if (!templateHasTags) {
        results.push({
          rowNumber,
          binderId,
          tags,
          success: false,
          message: "Missing required tag fields",
        });
        continue;
      }

      // Step 3: Validate binder
      const validation = await validateBinder({ config, accessToken, binderId });
      if (!validation.valid) {
        results.push({
          rowNumber,
          binderId,
          tags,
          success: false,
          message: validation.reason || "Invalid binder_id",
        });
        await delay(REQUEST_DELAY_MS);
        continue;
      }

      // Step 4: Update tags
      const updateResult = await updateWorkspaceTags({
        config,
        accessToken,
        binderId,
        tags,
      });

      results.push({
        rowNumber,
        binderId,
        tags,
        success: updateResult.success,
        message: updateResult.message,
      });

      await delay(REQUEST_DELAY_MS);
    }

    return Response.json({
      total: results.length,
      successCount: results.filter((r) => r.success).length,
      failureCount: results.filter((r) => !r.success).length,
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
