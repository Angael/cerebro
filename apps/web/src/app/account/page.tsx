'use client';
import React from 'react';
import { Stack, Title } from '@mantine/core';
import UsedSpace from '@/lib/used-space/UsedSpace';
import UpgradeAccount from '@/app/account/UpgradeAccount';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';

const AccountPage = () => {
  useRequireAccount();

  return (
    <Stack gap="md">
      <Title order={1}>Account</Title>

      <UsedSpace />
      <UpgradeAccount />
    </Stack>
  );
};

export default AccountPage;
