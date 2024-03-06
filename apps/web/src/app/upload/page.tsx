import React from 'react';
import UploadFiles from '@/app/upload/files/UploadFiles';
import UsedSpace from '@/app/upload/used-space/UsedSpace';

const page = () => {
  return (
    <div className="flex col gap-2">
      <UsedSpace />
      <UploadFiles />
    </div>
  );
};

export default page;
