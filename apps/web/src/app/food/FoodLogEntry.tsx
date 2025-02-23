import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import css from './FoodList.module.css';
import { Group, Stack, Text, Title } from '@mantine/core';

type Props = {
  food: QueryFoodToday[number];
};

const FoodLogEntry = ({ food }: Props) => {
  return (
    <li className={css.unstyledLi}>
      <Group align="flex-start" justify="space-between">
        <Stack component="header" gap={0} flex={3}>
          <Text fw="normal">{food.product_name}</Text>
          <Text>{food.brands}</Text>
        </Stack>
        <Stack align="flex-end" gap={0} flex={1}>
          <Text>{food.amount}g</Text>
          <Text>{food.kcal} kcal</Text>
        </Stack>
      </Group>
    </li>
  );
};

export default FoodLogEntry;
