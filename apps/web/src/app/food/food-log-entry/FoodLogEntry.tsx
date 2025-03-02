import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import { Group, Stack, Text, UnstyledButton } from '@mantine/core';
import css from './FoodLogEntry.module.css';

type Props = {
  food: QueryFoodToday[number];
};

const FoodLogEntry = ({ food }: Props) => {
  return (
    <UnstyledButton component="li" role="button" className={css.unstyledLi} tabIndex={0}>
      <Group align="flex-start" justify="space-between">
        <Stack component="header" gap={0} flex={3}>
          <Text size="md" fw="bold">
            {food.product_name}
          </Text>
          <Text size="sm">
            {food.brands}{' '}
            <Text span c="dark.2">
              {food.amount}g
            </Text>
          </Text>
        </Stack>
        <Stack align="flex-end" gap={0} flex={1}>
          <Text size="md">{Math.ceil(food.kcal)} kcal</Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
};

export default FoodLogEntry;
