'use client';
import PleaseLogIn from '@/lib/please-log-in/PleaseLogIn';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';
import { Paper, Stack, Text, Title } from '@mantine/core';

const WeightPage = () => {
  const user = useRequireAccount();

  if (!user.data) {
    return <PleaseLogIn />;
  }

  return (
    <Stack>
      <Title order={1}>Weight</Title>
      <Paper p="md">
        <Stack gap="sm">{!user.data && <Text>Please log in to see your food</Text>}</Stack>
      </Paper>
    </Stack>
  );
};

export default WeightPage;
