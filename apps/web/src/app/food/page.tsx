'use client';
import { Button, Divider, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import FoodList from './FoodList';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { useState } from 'react';
import ScannerModal from './scanner/ScannerModal';

const FoodPage = () => {
  const user = useCurrentUser();
  const todaysFood = useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.todaysFood],
    queryFn: () => API.get<any>('/food/today').then((r) => r.data),
  });

  const [scannerOpened, setScannerOpened] = useState(false);

  return (
    <Stack>
      <Title>Food</Title>
      <Group>
        <Paper p="md" flex={1}>
          <Text>Today: 2100 kcal</Text>
          <Progress value={10} />
        </Paper>

        <Paper p="md" flex={1}>
          Week: 12090/21000 kcal
          <Progress value={10} />
        </Paper>
      </Group>

      <Paper p="md">
        <Title order={2}>Today</Title>
        <Stack gap="sm">
          <Divider />
          <Text>Entries:</Text>
          <FoodList />
          <pre>{JSON.stringify(todaysFood.data, null, 2)}</pre>
          <Button onClick={() => setScannerOpened(true)}>Log food</Button>
        </Stack>
      </Paper>

      <Group align="flex-start">
        <Stack>
          <Title>Today</Title>
          <Paper p="md">Breakfast: 500 kcal</Paper>
          <Paper p="md">Lunch: 700 kcal</Paper>
          <Paper p="md">Dinner: 900 kcal</Paper>
        </Stack>

        <Stack>
          <Title>Week</Title>
          <Paper p="md">Monday: 2100 kcal</Paper>
          <Paper p="md">Tuesday: 1090 kcal</Paper>
          <Paper p="md">Wednesday: 300 kcal</Paper>
          <Paper p="md">Thursday: 400 kcal</Paper>
        </Stack>
      </Group>

      <ScannerModal open={scannerOpened} onClose={() => setScannerOpened(false)} />
    </Stack>
  );
};

export default FoodPage;
