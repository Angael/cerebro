import React from 'react';
import { Stack, Title } from '@mantine/core';
import UsedSpace from '@/lib/used-space/UsedSpace';
import UpgradeAccount from '@/app/account/UpgradeAccount';

const AccountPage = () => {
  return (
    <Stack gap="md">
      <Title order={1}>Account</Title>

      <UsedSpace />
      <UpgradeAccount />
    </Stack>
  );
};

export default AccountPage;
