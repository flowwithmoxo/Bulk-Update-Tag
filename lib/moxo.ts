import { WorkspaceTag } from "./types";

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

/**
 * Get an access token from the Moxo OAuth API.
 */
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

/**
 * Validate a binder exists using the Get Flow Workspace API.
 * GET https://{{moxo_domain}}/v1/flow/binders/{{binder_id}}
 * Uses Bearer token auth.
 *
 * Returns { valid: true } on success, or { valid: false, reason: "..." } on failure.
 */
export async function validateBinder(params: {
  accessToken: string;
  binderId: string;
}): Promise<{ valid: boolean; reason?: string }> {
  const { baseUrl } = getConfig();
  const { accessToken, binderId } = params;

  try {
    const response = await fetch(
      `${baseUrl}/v1/flow/binders/${binderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const rawText = await response.text();
    console.log(`Validate binder ${binderId} status:`, response.status);
    console.log(`Validate binder ${binderId} response:`, rawText);

    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = rawText;
    }

    // Check for success response
    if (response.ok && (data?.code === "RESPONSE_SUCCESS" || response.status === 200)) {
      return { valid: true };
    }

    // Determine error reason
    const reason =
      data?.description ||
      data?.message ||
      (response.status === 404 ? "Workspace not found" : `Binder validation failed (status ${response.status})`);

    return { valid: false, reason };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "Binder validation failed",
    };
  }
}

/**
 * Update workspace tags for a given binder.
 */
export async function updateWorkspaceTags(params: {
  accessToken: string;
  binderId: string;
  tags: WorkspaceTag[];
}): Promise<{ success: boolean; message: string }> {
  const { baseUrl, orgId } = getConfig();
  const { accessToken, binderId, tags } = params;

  try {
    const payload = {
      workspace_tags: tags,
    };

    console.log("Updating binder:", binderId);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${baseUrl}/v1/${orgId}/binders/${binderId}?access_token=${encodeURIComponent(accessToken)}`,
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
        success: false,
        message:
          data?.description ||
          data?.message ||
          `Tag update failed (status ${response.status})`,
      };
    }

    return {
      success: true,
      message: "Success",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Tag update failed",
    };
  }
}

export async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}