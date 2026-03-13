export type CsvRow = {
  binder_id: string;
  [key: string]: string | undefined;
};

export type WorkspaceTag = {
  name: string;
  value: string;
};

export type UpdateResult = {
  rowNumber: number;
  binderId: string;
  tags: WorkspaceTag[];
  success: boolean;
  message: string;
};

export type UploadResponse = {
  total: number;
  successCount: number;
  failureCount: number;
  results: UpdateResult[];
};
