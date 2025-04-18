import { AreaChart } from '@mantine/charts';
import { Skeleton, Stack } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Skeleton width={140} height={40} />

      <Skeleton width="100%" height={200} />
    </Stack>
  );
}
