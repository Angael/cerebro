'use client';
import { fetchFoodHistory, FoodHistoryType } from '@/server/getFoodHistory';
import { GoalsType } from '@/server/getGoals';
import { QUERY_KEYS } from '@/utils/consts';
import { FoodProduct } from '@cerebro/db';
import { Button, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { mdiFire, mdiPlusCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import AddProductModal from './add-product-modal/AddProductModal';
import CreateProductDialog from './create-product/CreateProductDialog';
import FindProductDialog from './find-product/FindProductDialog';
import FoodList from './FoodList';
import History from './history/History';
import css from './page.module.css';
import ScannerModal from './scanner/ScannerModal';

const splitFoodHistoryOnToday = (foodHistory: FoodHistoryType) => {
  const todaysDate = new Date().toISOString().split('T')[0];

  const todaysFood: FoodHistoryType = [];
  const notTodaysFood: FoodHistoryType = [];

  foodHistory.forEach((foodLog) => {
    if (foodLog.dayDate === todaysDate) {
      todaysFood.push(foodLog);
    } else {
      notTodaysFood.push(foodLog);
    }
  });

  return [todaysFood, notTodaysFood] as const;
};

interface Props {
  goals: GoalsType;
  foodHistoryInit: FoodHistoryType;
}

const Food = ({ goals, foodHistoryInit }: Props) => {
  const foodHistory = useQuery({
    queryKey: [QUERY_KEYS.todaysFood],
    queryFn: fetchFoodHistory,
    initialData: foodHistoryInit,
  });

  const [todaysFood, notTodaysFood] = useMemo(
    () => splitFoodHistoryOnToday(foodHistory.data),
    [foodHistory.data],
  );

  const [findOpen, setFindOpen] = useState(false);
  const [foodProduct, setFoodProduct] = useState<FoodProduct | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [scannerOpened, setScannerOpened] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState<{
    code: string | null;
    name: string | null;
    open: boolean;
  }>({
    code: null,
    name: null,
    open: false,
  });

  const kcalToday = useMemo(() => {
    if (!todaysFood) return 0;
    return todaysFood.reduce((acc, food) => acc + food.kcal, 0);
  }, [todaysFood]);

  const targetToday = goals?.kcal;

  return (
    <Stack>
      {targetToday ? (
        <Group>
          <Paper p="md" flex={1}>
            <Text>
              Today: {Math.ceil(kcalToday)} kcal / {targetToday}
            </Text>
            <Progress value={(kcalToday / targetToday) * 100} />
          </Paper>
        </Group>
      ) : null}

      <Paper p="md">
        <Stack gap="sm">
          <Title order={2}>Today</Title>
          <FoodList foods={todaysFood} />

          <Group justify="flex-end" className={css.foodActions}>
            <Button
              onClick={() => setFindOpen(true)}
              leftSection={<Icon path={mdiPlusCircleOutline} size={1} />}
            >
              Add product
            </Button>
            <Button
              disabled
              onClick={() => setScannerOpened(true)}
              leftSection={<Icon path={mdiFire} size={1} />}
            >
              Add calories
            </Button>
          </Group>
        </Stack>
      </Paper>

      <History foodHistory={notTodaysFood} />

      <FindProductDialog
        open={findOpen}
        onClose={() => setFindOpen(false)}
        onOpenScanner={() => {
          setFoodProduct(null);
          setFindOpen(false);
          setScannerOpened(true);
        }}
        onChooseProduct={(_foodProduct) => {
          setFoodProduct(_foodProduct);
          setFindOpen(false);
          setAddProductOpen(true);
        }}
        onCreateProduct={(name) => {
          setFindOpen(false);
          setCreateProductOpen({ name, code: null, open: true });
        }}
      />
      <ScannerModal
        open={scannerOpened}
        onClose={() => setScannerOpened(false)}
        onFound={(foodProduct) => {
          setFoodProduct(foodProduct);
          setScannerOpened(false);
          setAddProductOpen(true);
        }}
        onCreateProduct={(code) => {
          setScannerOpened(false);
          setCreateProductOpen({ code, name: null, open: true });
        }}
      />
      <AddProductModal
        foodProduct={foodProduct}
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />
      <CreateProductDialog
        code={createProductOpen.code}
        name={createProductOpen.name}
        open={createProductOpen.open}
        onClose={() => setCreateProductOpen({ code: null, name: null, open: false })}
        onCreated={(foodProduct) => {
          setFoodProduct(foodProduct);
          setAddProductOpen(true);
          setCreateProductOpen({ code: null, name: null, open: false });
        }}
      />
    </Stack>
  );
};

export default Food;
