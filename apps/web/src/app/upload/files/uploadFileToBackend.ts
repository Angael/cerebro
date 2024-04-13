import { uploadFile } from '@/app/upload/files/uploadFile';
import { ExtendedFile } from '@/app/upload/files/uploadTypes';

interface IOptions {
  file: ExtendedFile;
  onProgress: (progress: number) => void;
}

export const uploadFileToBackend = ({ file, onProgress }: IOptions) => {
  const formData = new FormData();
  formData.append('file', file.file);

  // TODO: Ugly parameter passing
  return uploadFile(formData, {
    onProgress,
  });
};
