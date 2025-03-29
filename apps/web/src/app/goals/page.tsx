'use client';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useFoodGoals } from '@/utils/hooks/useFoodGoals';
import { Alert, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import GoalsForm from './GoalsForm';

const GoalsPage = () => {
  const user = useCurrentUser();
  const currentGoals = useFoodGoals(user);

  return (
    <Stack>
      <Title order={1}>Goals</Title>
      <Paper p="md">
        <Stack gap="sm">
          {!user.data && <Text>Please log in to see your food</Text>}

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

export default GoalsPage;
