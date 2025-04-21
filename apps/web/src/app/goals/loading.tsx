import { Skeleton, Stack, Title } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Title order={1}>Goals</Title>

      <Skeleton width="100%" height={220} />
    </Stack>
  );
}
