# Bulk Workspace Tag Updater

Minimal Next.js POC for:
- downloading a sample CSV
- uploading a CSV
- generating a Moxo access token on the backend
- updating workspace tags row by row
- showing per-workspace results

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000

## Sample CSV

```csv
workspace_id,workspace_name,workspace_tag_1_key,workspace_tag_1_value,workspace_tag_2_key,workspace_tag_2_value
abc123,Client Workspace,priority,high,region,us
def456,Onboarding Workspace,status,active,owner_team,success
```
