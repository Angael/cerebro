import { requireUser } from '@/server/getUser';
import { getGoals } from '@/server/getGoals';
import { Paper, Stack, Title } from '@mantine/core';
import GoalsForm from './GoalsForm';

const GoalsPage = async () => {
  const user = await requireUser();
  const goals = await getGoals(user.id);

  return (
    <Stack>
      <Title order={1}>Goals</Title>
      <Paper p="md">
        <GoalsForm goals={goals} />
      </Paper>
    </Stack>
  );
};

export default GoalsPage;
