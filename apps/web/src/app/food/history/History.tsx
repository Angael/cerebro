import { FoodHistoryType } from '@/server/food/getFoodHistory';
import { zFoodHistory } from '@/server/types/foodTypes';
import { formatYYYYMMDD } from '@/utils/formatYYYYMMDD';
import { Button, Stack, Title } from '@mantine/core';
import { z } from 'zod';
import HistoryDay from './HistoryDay';
import { memo } from 'react';

type Props = {
  foodHistory: FoodHistoryType;
};

const History = ({ foodHistory }: Props) => {
  const groupedFoods = foodHistory?.reduceRight(
    (acc, food) => {
      const date = formatYYYYMMDD(new Date(food.dayDate));
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

export default memo(History);
