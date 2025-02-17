'use client';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { useCurrentUser } from '@/utils/hooks/useCurrentUser';
import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import { Button, Group, Loader, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import FoodList from './FoodList';
import ScannerModal from './scanner/ScannerModal';
import AddProductModal from './add-product-modal/AddProductModal';

const FoodPage = () => {
  const user = useCurrentUser();
  const todaysFood = useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.todaysFood],
    queryFn: () => API.get<QueryFoodToday>('/food/today').then((r) => r.data),
  });

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [scannerOpened, setScannerOpened] = useState(false);

  const kcalToday = useMemo(() => {
    if (!todaysFood.data) return 0;
    return todaysFood.data.reduce((acc, food) => acc + food.kcal, 0);
  }, [todaysFood.data]);

  // TODO: get this from server
  const targetToday = 2100;

  return (
    <Stack>
      <Title>Food</Title>
      <Group>
        <Paper p="md" flex={1}>
          <Text>Today: {kcalToday} kcal</Text>
          <Progress value={(kcalToday / targetToday) * 100} />
        </Paper>

        <Paper p="md" flex={1}>
          Week: 12090/21000 kcal
          <Progress value={10} />
        </Paper>
      </Group>

      <Paper p="md">
        <Stack gap="sm">
          <Title order={2}>Today</Title>
          {todaysFood.data ? <FoodList foods={todaysFood.data} /> : <Loader />}

          <Group justify="flex-end">
            {/* TODO: different onClicks and modals */}
            <Button onClick={() => setAddProductOpen(true)}>Add product</Button>
            <Button onClick={() => setScannerOpened(true)}>Add calories</Button>
          </Group>
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

      <AddProductModal open={addProductOpen} onClose={() => setAddProductOpen(false)} />
      <ScannerModal open={scannerOpened} onClose={() => setScannerOpened(false)} />
    </Stack>
  );
};

export default FoodPage;
