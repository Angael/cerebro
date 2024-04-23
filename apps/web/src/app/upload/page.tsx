import React from 'react';
import UploadFiles from '@/app/upload/files/UploadFiles';
import UsedSpace from '@/app/upload/used-space/UsedSpace';
import { Stack } from '@mantine/core';

const page = () => {
  return (
    <Stack gap="md">
      <UsedSpace />
      <UploadFiles />
    </Stack>
  );
};

export default page;
