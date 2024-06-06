'use client';
import React from 'react';
import { useShowDrawer } from '@/lib/navbar/drawer/useShowDrawer';
import MyDrawerContents from '@/lib/navbar/drawer/MyDrawerContents';

const LayoutDrawer = () => {
  const showDrawer = useShowDrawer();

  if (!showDrawer) {
    return null;
  }

  return <MyDrawerContents />;
};

export default LayoutDrawer;
