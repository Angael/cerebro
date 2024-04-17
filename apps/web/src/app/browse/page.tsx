import React, { Suspense } from 'react';
import Browse from '@/app/browse/Browse';

const BrowsePage = () => {
  return (
    <Suspense>
      <Browse />
    </Suspense>
  );
};

export default BrowsePage;
