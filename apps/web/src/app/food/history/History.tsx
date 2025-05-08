import { FoodHistoryType } from '@/server/getFoodHistory';
import { zFoodHistory } from '@/server/types/foodTypes';
import { Button, Stack, Title } from '@mantine/core';
import { format } from 'date-fns';
import HistoryDay from './HistoryDay';
import { z } from 'zod';

type Props = {
  foodHistory: FoodHistoryType;
};

const History = ({ foodHistory }: Props) => {
  const groupedFoods = foodHistory?.reduceRight(
    (acc, food) => {
      const date = format(new Date(food.dayDate), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(food);

      return acc;
    },
    {} as Record<string, z.infer<typeof zFoodHistory>>,
  );

  return (
    <Stack>
      <Title order={2}>Previous logs</Title>

      {Object.entries(groupedFoods ?? {}).map(([date, logs]) => (
        <HistoryDay key={date} date={date} logs={logs} />
      ))}

      <Button disabled style={{ alignSelf: 'flex-end' }}>
        View all
      </Button>
    </Stack>
  );
};

export default History;
