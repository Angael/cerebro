import React from "react";
import css from "./ProgressBar.module.scss";

type Props = {
  id: string;
  label: string;
  value: number;
  max: number;
};

const ProgressBar = (props: Props) => {
  const { id, label, value, max } = props;
  const percentage = (100 * value) / max;

  return (
    <div className={css.progressBar}>
      <p className={css.label} id={id}>
        {label}
      </p>
      <div
        className={css.bar}
        role="progressbar"
        aria-labelledby={id}
        aria-valuenow={value}
      >
        <div className={css.progress} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
