"use client";
import React, { Suspense, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { useAuth } from "@clerk/nextjs";
import PQueue from "p-queue";

import { ExtendedFile, UPLOAD_STATUS } from "@/app/upload/files/uploadTypes";
import FilesStats from "@/lib/files-preview/FilesStats";

import FilesPreview from "@/lib/files-preview/FilesPreview";
import { Btn, BtnLink } from "@/styled/btn/Btn";
import { uploadFileToBackend } from "@/app/upload/files/uploadFileToBackend";
import { preventLeave } from "@/client/preventLeave";

const UploadFilesPage = () => {
  const [tags, setTags] = useState<string[]>(["test"]);
  const [files, setFiles] = useState<ExtendedFile[]>([]);

  // TODO: Not sure if queue in ref is a good idea
  const uploadQueue = useRef(new PQueue({ concurrency: 1 }));
  const { getToken } = useAuth();

  const addFiles = (acceptedFiles: File[]) => {
    const files: ExtendedFile[] = acceptedFiles.map((file) => ({
      file,
      id: nanoid(),
      previewSrc: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: UPLOAD_STATUS.notStarted,
    }));

    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const updateFile = (id: string, data: Partial<ExtendedFile>) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => (file.id === id ? { ...file, ...data } : file)),
    );
  };

  const onInputFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    addFiles(Array.from(event.target.files));
  };

  const upload = () => {
    preventLeave(true);
    files.forEach((file) => {
      uploadQueue.current.add(async () =>
        uploadFileToBackend({
          token: (await getToken()) as string, // page is guarded, token is always present
          file,
          dir: "",
          private: false,
          tags,
          onProgress: (progress) => {
            updateFile(file.id, {
              uploadProgress: progress,
              uploadStatus: UPLOAD_STATUS.started,
            });
          },
        })
          .then(() => {
            updateFile(file.id, { uploadStatus: UPLOAD_STATUS.success });
          })
          .catch((error) => {
            updateFile(file.id, { uploadStatus: UPLOAD_STATUS.failed });
            console.error(error);
          }),
      );
    });

    uploadQueue.current.onIdle().then(() => preventLeave(false));
  };

  return (
    <>
      <div className="flex gap-1">
        <Btn disabled={files.length <= 0} onClick={upload}>
          Upload
        </Btn>

        <BtnLink href={"/upload-from-link"}>Import from link</BtnLink>
      </div>
      <Suspense fallback={null}>
        <FilesPreview
          files={files}
          onDelete={removeFile}
          onAddFiles={addFiles}
        />
      </Suspense>

      <FilesStats files={files} />
    </>
  );
};

export default UploadFilesPage;
