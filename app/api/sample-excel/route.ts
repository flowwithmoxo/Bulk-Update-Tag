import * as XLSX from "xlsx";

export async function GET() {
  const rows = [
    {
      workspace_id: "abc123",
      workspace_name: "Client Workspace",
      workspace_tag_1_key: "Priority",
      workspace_tag_1_value: "High",
      workspace_tag_2_key: "Department",
      workspace_tag_2_value: "Insurance",
    },
    {
      workspace_id: "def456",
      workspace_name: "Finance Workspace",
      workspace_tag_1_key: "Priority",
      workspace_tag_1_value: "Medium",
      workspace_tag_2_key: "Department",
      workspace_tag_2_value: "Finance",
    },
    {
      workspace_id: "ghi789",
      workspace_name: "Operations Workspace",
      workspace_tag_1_key: "Priority",
      workspace_tag_1_value: "Low",
      workspace_tag_2_key: "Department",
      workspace_tag_2_value: "Operations",
    },
  ];

  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, sheet, "Sample");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="sample_workspace_tags.xlsx"',
    },
  });
}