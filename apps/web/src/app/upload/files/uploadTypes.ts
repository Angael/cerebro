export const UPLOAD_STATUS = {
  notStarted: "notStarted",
  started: "started",
  success: "success",
  failed: "failed",
} as const;

export interface ExtendedFile {
  previewSrc: string;
  id: string;
  file: File;
  uploadStatus: keyof typeof UPLOAD_STATUS;
  uploadProgress: number;
}
