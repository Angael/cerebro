import React from 'react';
import { Paper, Stack, Title } from '@mantine/core';
import UsedSpace from '@/lib/used-space/UsedSpace';

const AccountPage = () => {
  return (
    <Stack gap="md">
      <Title order={1}>Account</Title>
      <Paper>
        <UsedSpace />
      </Paper>
    </Stack>
  );
};

export default AccountPage;
