'use client';
import React, { Suspense, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import PQueue from 'p-queue';

import { ExtendedFile, UPLOAD_STATUS } from '@/app/upload/files/uploadTypes';
import FilesStats from '@/lib/files-preview/FilesStats';

import FilesPreview from '@/lib/files-preview/FilesPreview';
import { Btn, BtnLink } from '@/styled/btn/Btn';
import { uploadFileToBackend } from '@/app/upload/files/uploadFileToBackend';
import { preventLeave } from '@/client/preventLeave';
import { QUERY_KEYS } from '@/utils/consts';
import { useQueryClient } from '@tanstack/react-query';

const UploadFilesPage = () => {
  const [files, setFiles] = useState<ExtendedFile[]>([]);

  const queryClient = useQueryClient();
  const uploadQueue = useRef(new PQueue({ concurrency: 1 }));

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

  const upload = () => {
    preventLeave(true);
    files.forEach((file) => {
      uploadQueue.current.add(async () =>
        uploadFileToBackend({
          file,
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

    uploadQueue.current.onIdle().then(async () => {
      preventLeave(false);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.uploadLimits] });
    });
  };

  return (
    <>
      <div className="flex gap-1">
        <Btn disabled={files.length <= 0} onClick={upload}>
          Upload
        </Btn>

        <BtnLink href={'/upload-from-link'}>Import from link</BtnLink>
      </div>
      <Suspense fallback={null}>
        <FilesPreview files={files} onDelete={removeFile} onAddFiles={addFiles} />
      </Suspense>

      <FilesStats files={files} />
    </>
  );
};

export default UploadFilesPage;
