import { uploadFile } from '@/app/upload/files/uploadFile';
import { ExtendedFile } from '@/app/upload/files/uploadTypes';

interface IOptions {
  token: string;
  file: ExtendedFile;
  dir?: string;
  private?: boolean;
  onProgress: (progress: number) => void;
}

export const uploadFileToBackend = ({ token, file, onProgress }: IOptions) => {
  const formData = new FormData();
  formData.append('file', file.file);

  // TODO: Ugly parameter passing
  return uploadFile(token, formData, {
    onProgress,
  });
};
