import { AreaChart } from '@mantine/charts';
import { Skeleton, Stack, Title } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Title order={1}>Weight</Title>

      <Skeleton width="100%" height={200} />
    </Stack>
  );
}
