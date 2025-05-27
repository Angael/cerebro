import { getGoals } from '@/server/getGoals';
import { requireUser } from '@/server/auth/getUser';
import { db } from '@cerebro/db';
import { Stack, Title } from '@mantine/core';
import Weight from './Weight';

const WeightPage = async () => {
  const user = await requireUser();
  const weight = db
    .selectFrom('user_weight')
    .select(['date', 'weight_kg'])
    .where('user_id', '=', user.id)
    .orderBy('date', 'asc')
    .execute();

  const goals = getGoals(user.id);

  return (
    <Stack>
      <Title order={1}>Weight</Title>
      <Weight user={user} weight={await weight} goals={await goals} />
    </Stack>
  );
};

export default WeightPage;
