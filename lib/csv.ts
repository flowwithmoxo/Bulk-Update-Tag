import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CsvRow, WorkspaceTag } from "./types";

export function cleanValue(value: string | undefined): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

/**
 * Parse CSV text into rows.
 */
export function parseCsvText(text: string): CsvRow[] {
  const result = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  const realErrors = result.errors.filter(
    (err) => err.code !== "TooFewFields"
  );

  if (realErrors.length > 0) {
    const firstError = realErrors[0];
    throw new Error(`Invalid CSV: ${firstError.message}`);
  }

  return result.data;
}

/**
 * Parse Excel file buffer into rows.
 */
export function parseExcelFile(buffer: ArrayBuffer): CsvRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: CsvRow[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });

  return rows;
}

/**
 * Check if the parsed file has any tag columns
 * (workspace_tag_N_key / workspace_tag_N_value).
 */
export function hasTagColumns(headers: string[]): boolean {
  return headers.some(
    (h) => /^workspace_tag_\d+_key$/i.test(h) || /^workspace_tag_\d+_value$/i.test(h)
  );
}

/**
 * Get headers from a row object.
 */
export function getHeaders(row: CsvRow): string[] {
  return Object.keys(row);
}

/**
 * Extract tags from a single row.
 * Empty tag values are allowed (treated as clearing the tag).
 * Returns tags for any tag slot where a key is present.
 */
export function extractTags(row: CsvRow): WorkspaceTag[] {
  const tags: WorkspaceTag[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const keyField = `workspace_tag_${i}_key`;
    const valueField = `workspace_tag_${i}_value`;

    const rawKey = cleanValue(row[keyField]);
    const rawValue = cleanValue(row[valueField]);

    // If the key is present, include the tag (even if value is empty)
    if (rawKey) {
      tags.push({
        name: rawKey,
        value: rawValue, // empty string = clear/delete tag value
      });
    }
  }

  return tags;
}