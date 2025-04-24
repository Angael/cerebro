import { Skeleton, Stack, Title } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Skeleton width="100%" height={64} />

      <Skeleton width="100%" height={150} />
    </Stack>
  );
}
