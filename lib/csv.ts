import Papa from "papaparse";
import * as XLSX from "xlsx";
import { CsvRow, WorkspaceTag } from "./types";

export function cleanValue(value: string | undefined) {
  if (!value) return "";
  return value.trim();
}

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

export function parseExcelFile(buffer: ArrayBuffer): CsvRow[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows: CsvRow[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });

  return rows;
}

export function validateRows(rows: CsvRow[]): void {
  if (!rows.length) {
    throw new Error("CSV or Excel file is empty.");
  }

  rows.forEach((row, index) => {
    if (!cleanValue(row.workspace_id)) {
      throw new Error(`Row ${index + 2}: Missing workspace_id`);
    }
  });
}

export function extractTags(row: CsvRow): WorkspaceTag[] {
  const tags: WorkspaceTag[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const keyField = `workspace_tag_${i}_key`;
    const valueField = `workspace_tag_${i}_value`;

    const rawKey = cleanValue(row[keyField]);
    const rawValue = cleanValue(row[valueField]);

    if (rawKey) {
      tags.push({
        name: rawKey,
        value: rawValue,
      });
    }
  }

  return tags;
}