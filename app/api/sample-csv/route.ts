export async function GET() {
  const csv = [
    "binder_id,workspace_tag_1_key,workspace_tag_1_value,workspace_tag_2_key,workspace_tag_2_value",
    "abc123,priority,high,region,us",
    "def456,status,active,owner_team,success",
  ].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sample_workspace_tags.csv"',
    },
  });
}
