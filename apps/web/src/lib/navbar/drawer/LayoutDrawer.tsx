import React from 'react';
import MyDrawerContents from '@/lib/navbar/drawer/MyDrawerContents';
import css from './LayoutDrawer.module.css';
import { getUser } from '@/utils/next-server/getUser';

const LayoutDrawer = async () => {
  const user = await getUser();
  return (
    <div className={css.staticDrawerMediaQuery}>
      <MyDrawerContents user={user} />
    </div>
  );
};

export default LayoutDrawer;
