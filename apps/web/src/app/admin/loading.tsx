import { Skeleton, Stack } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Skeleton width={200} height={40} />
    </Stack>
  );
}
