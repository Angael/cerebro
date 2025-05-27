import { clientEnv } from '@/utils/clientEnv';

type Callbacks = {
  onProgress: (percentage: number) => void;
};

export function uploadFile(formData: FormData, { onProgress }: Callbacks) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const uploadUrl = `${clientEnv.API_URL}/items/upload/file`;

    xhr.withCredentials = true;
    xhr.open('POST', uploadUrl, true);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        console.log(`Upload Progress: ${percentage.toFixed(2)}%`);
        onProgress(percentage);
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('File uploaded successfully');
        resolve();
      } else {
        console.error('File upload failed. Status:', xhr.status);
        reject();
      }
    };

    xhr.onerror = function () {
      console.error('File upload failed. Network error.');
      reject();
    };

    xhr.send(formData);
  });
}
