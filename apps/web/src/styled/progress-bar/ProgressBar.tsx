import React from 'react';
import css from './ProgressBar.module.scss';
import clsx from 'clsx';

type Props = {
  id: string;
  label: string;
  value: number;
  max: number;
  isLoading?: boolean;
};

const ProgressBar = (props: Props) => {
  const { id, label, value, max, isLoading } = props;
  const percentage = (100 * value) / max;

  return (
    <div className={clsx(css.progressBar, isLoading && css.isLoading)}>
      <p className={css.label} id={id}>
        {label}
      </p>
      <div className={css.bar} role="progressbar" aria-labelledby={id} aria-valuenow={value}>
        <div className={css.progress} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
