export type CsvRow = {
  workspace_id: string;
  workspace_name?: string;
  [key: string]: string | undefined;
};

export type WorkspaceTag = {
  name: string;
  value: string;
};

export type UpdateResult = {
  workspaceId: string;
  workspaceName?: string;
  success: boolean;
  message: string;
};

export type UploadResponse = {
  total: number;
  successCount: number;
  failureCount: number;
  results: UpdateResult[];
};
