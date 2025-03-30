'use client';
import { useFoodGoals } from '@/utils/hooks/useFoodGoals';
import { useRequireAccount } from '@/utils/hooks/useRequireAccount';
import { Alert, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import GoalsForm from './GoalsForm';
import PleaseLogIn from '@/lib/please-log-in/PleaseLogIn';

const GoalsPage = () => {
  const user = useRequireAccount();
  const currentGoals = useFoodGoals(user);

  if (!user.data) {
    return <PleaseLogIn title="Log in to see food goals" />;
  }

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

export default GoalsPage;
