import React, { useCallback } from 'react';
import FilePreview from './FilePreview';
import css from './FilesPreview.module.scss';
import { useDropzone } from 'react-dropzone';
import { mdiFileMultiple } from '@mdi/js';
import { Icon } from '@mdi/react';
import clsx from 'clsx';
import { ExtendedFile } from '@/app/upload/files/uploadTypes';

interface IProps {
  files: ExtendedFile[];
  onDelete: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  disabled?: boolean;
}

const FilesPreview = ({ files, onDelete, onAddFiles, disabled }: IProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAddFiles,
    noClick: files.length > 0,
    disabled,
  });

  return (
    <section
      {...getRootProps()}
      className={clsx(
        css.MyGrid,
        isDragActive && css.onDrag,
        files.length === 0 && css.canClick,
        disabled && css.disabled,
      )}
    >
      {files.length === 0 && (
        <div className={css.dragWatermark}>
          <Icon path={mdiFileMultiple} size={3} />
          {disabled ? <p>No space left</p> : <p>Drag & drop files</p>}
        </div>
      )}
      {files.map((file) => (
        <FilePreview file={file} key={file.id} onDelete={onDelete} />
      ))}
      <input {...getInputProps()} />
    </section>
  );
};

export default React.memo(FilesPreview);
