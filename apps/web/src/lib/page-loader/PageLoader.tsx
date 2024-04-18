import React from 'react';
import css from './PageLoader.module.scss';

const PageLoader = () => {
  return (
    <div className={css.pageLoaderCenter}>
      <div className={css.loader}></div>
    </div>
  );
};

export default PageLoader;
