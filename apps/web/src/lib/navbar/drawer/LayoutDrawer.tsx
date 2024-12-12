'use client';
import React from 'react';
import MyDrawerContents from '@/lib/navbar/drawer/MyDrawerContents';
import css from './LayoutDrawer.module.css';

const LayoutDrawer = () => {
  return (
    <div className={css.staticDrawerMediaQuery}>
      <MyDrawerContents />
    </div>
  );
};

export default LayoutDrawer;
