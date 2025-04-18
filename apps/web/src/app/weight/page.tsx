import { requireUser } from '@/utils/next-server/getUser';
import { Stack, Title } from '@mantine/core';
import Weight from './Weight';

const WeightPage = async () => {
  const user = await requireUser();

  return (
    <Stack>
      <Title order={1}>Weight</Title>
      <Weight user={user} />
    </Stack>
  );
};

export default WeightPage;
