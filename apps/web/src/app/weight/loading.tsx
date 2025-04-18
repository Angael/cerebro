import { Skeleton, Stack, Title } from '@mantine/core';

export default function Loading() {
  return (
    <Stack>
      <Title order={1}>Weight</Title>

      <Skeleton width="100%" height={200} />
      <Skeleton width={40} height={30} style={{ marginLeft: 'auto' }} />
      <Skeleton width="100%" height={50} />
      <Skeleton width="100%" height={50} />
    </Stack>
  );
}
