import { NEXT_PUBLIC_API_URL } from "@/utils/env";

type Callbacks = {
  onProgress: (percentage: number) => void;
};

export function uploadFile(
  token: string,
  formData: FormData,
  { onProgress }: Callbacks,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const uploadUrl = `${NEXT_PUBLIC_API_URL}/items/upload/file`;

    xhr.open("POST", uploadUrl, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        console.log(`Upload Progress: ${percentage.toFixed(2)}%`);
        onProgress(percentage);
      }
    };

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("File uploaded successfully");
        resolve();
      } else {
        console.error("File upload failed. Status:", xhr.status);
        reject();
      }
    };

    xhr.onerror = function () {
      console.error("File upload failed. Network error.");
      reject();
    };

    xhr.send(formData);
  });
}
