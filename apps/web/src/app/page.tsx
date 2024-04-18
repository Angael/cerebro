import React, { Suspense } from 'react';
import Browse from '@/app/browse/Browse';
import PageLoader from '@/lib/page-loader/PageLoader';

const IndexPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Browse />
    </Suspense>
  );
};

export default IndexPage;
