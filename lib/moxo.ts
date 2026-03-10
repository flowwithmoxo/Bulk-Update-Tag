import { UpdateResult, WorkspaceTag } from "./types";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    baseUrl: getRequiredEnv("MOXO_BASE_URL"),
    orgId: getRequiredEnv("MOXO_ORG_ID"),
    clientId: getRequiredEnv("MOXO_CLIENT_ID"),
    clientSecret: getRequiredEnv("MOXO_CLIENT_SECRET"),
    email: getRequiredEnv("MOXO_EMAIL"),
  };
}

export async function getAccessToken(): Promise<string> {
  const { baseUrl, orgId, clientId, clientSecret, email } = getConfig();

  const response = await fetch(`${baseUrl}/v1/core/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      org_id: orgId,
      email,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  console.log("Token API status:", response.status);
  console.log("Token API raw response:", rawText);

  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Token API did not return JSON. Response: ${rawText}`);
  }

  const accessToken =
    data?.access_token ||
    data?.data?.access_token ||
    data?.token;

  if (!response.ok || !accessToken) {
    throw new Error(
      data?.description ||
      data?.message ||
      data?.code ||
      `Failed to generate access token. Status: ${response.status}`
    );
  }

  return accessToken;
}

export async function updateWorkspaceTags(params: {
  accessToken: string;
  workspaceId: string;
  workspaceName: string;
  tags: WorkspaceTag[];
}): Promise<UpdateResult> {
  const { baseUrl, orgId } = getConfig();
  const { accessToken, workspaceId, workspaceName, tags } = params;

  try {
    const payload = {
      workspace_tags: tags,
    };

    console.log("Updating workspace:", workspaceId);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${baseUrl}/v1/${orgId}/binders/${workspaceId}?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const rawText = await response.text();
    console.log("Update status:", response.status);
    console.log("Update response:", rawText);

    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = rawText;
    }

    if (!response.ok) {
      return {
        workspaceId,
        workspaceName,
        success: false,
        message:
          data?.description ||
          data?.message ||
          `Request failed with status ${response.status}`,
      };
    }

    return {
      workspaceId,
      workspaceName,
      success: true,
      message: "Updated successfully",
    };
  } catch (error) {
    return {
      workspaceId,
      workspaceName,
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}