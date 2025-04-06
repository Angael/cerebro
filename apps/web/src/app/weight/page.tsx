'use client';
import PleaseLogIn from '@/lib/please-log-in/PleaseLogIn';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';
import { Stack, Title } from '@mantine/core';
import Weight from './Weight';

const WeightPage = () => {
  const user = useRequireAccount();

  if (!user.data) {
    return <PleaseLogIn />;
  }

  return (
    <Stack>
      <Title order={1}>Weight</Title>
      <Weight />
    </Stack>
  );
};

export default WeightPage;
