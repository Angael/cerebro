'use client';
import { useFoodGoals } from '@/utils/hooks/useFoodGoals';
import { Alert, Center, Loader, Paper, Stack, Title } from '@mantine/core';
import GoalsForm from './GoalsForm';

const Goals = () => {
  const currentGoals = useFoodGoals();

  return (
    <Stack>
      <Title order={1}>Goals</Title>
      <Paper p="md">
        <Stack gap="sm">
          {currentGoals.isFetching && !currentGoals.data && (
            <Center>
              <Loader />
            </Center>
          )}
          {currentGoals.status === 'error' && (
            <Alert title="Error" color="red">
              Fetching goals failed. Please try again later.
            </Alert>
          )}
          {currentGoals.status === 'success' && <GoalsForm goals={currentGoals.data} />}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Goals;
