'use client';
import React from 'react';
import UploadFiles from '@/app/upload/files/UploadFiles';
import UsedSpace from '@/lib/used-space/UsedSpace';
import { Stack } from '@mantine/core';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';

const UploadPage = () => {
  useRequireAccount();
  return (
    <Stack gap="md">
      <UsedSpace />
      <UploadFiles />
    </Stack>
  );
};

export default UploadPage;
