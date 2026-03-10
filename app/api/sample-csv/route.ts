export async function GET() {
  const csv = [
    "workspace_id,workspace_name,workspace_tag_1_key,workspace_tag_1_value,workspace_tag_2_key,workspace_tag_2_value",
    "abc123,Client Workspace,priority,high,region,us",
    "def456,Onboarding Workspace,status,active,owner_team,success",
  ].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sample_workspace_tags.csv"',
    },
  });
}
