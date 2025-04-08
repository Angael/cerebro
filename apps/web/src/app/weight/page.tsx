'use client';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';
import { Stack, Title } from '@mantine/core';
import Weight from './Weight';

const WeightPage = () => {
  const user = useRequireAccount();

  return (
    <Stack>
      <Title order={1}>Weight</Title>
      <Weight />
    </Stack>
  );
};

export default WeightPage;
