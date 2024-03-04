import React from 'react';
import css from './ProgressOverlay.module.scss';
import clsx from 'clsx';
import { UPLOAD_STATUS } from '@/app/upload/files/uploadTypes';

type Props = {
  status: keyof typeof UPLOAD_STATUS;
  progress: number;
};

const ProgressOverlay = ({ status, progress }: Props) => {
  return (
    <div
      className={clsx(css.ProgressOverlay, {
        [css.notStarted]: status === UPLOAD_STATUS.notStarted,
        [css.started]: status === UPLOAD_STATUS.started,
        [css.success]: status === UPLOAD_STATUS.success,
        [css.failed]: status === UPLOAD_STATUS.failed,
      })}
      style={
        {
          '--progress': `${100 - progress}%`,
        } as React.CSSProperties
      }
    >
      {Math.round(progress * 100) / 100}%
    </div>
  );
};

export default React.memo(ProgressOverlay);
