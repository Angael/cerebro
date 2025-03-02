import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import { Button, Collapse, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import css from './FoodLogEntry.module.css';
import { useFoodLogsContext } from './FoodLogsContext';
import Icon from '@mdi/react';
import { mdiPen, mdiPencil } from '@mdi/js';

type Props = {
  food: QueryFoodToday[number];
};

const FoodLogEntry = ({ food }: Props) => {
  const { openFoodLogId, setOpenFoodLogId } = useFoodLogsContext();
  const isOpen = openFoodLogId === food.id;

  return (
    <li className={css.unstyledLi}>
      <UnstyledButton
        className={css.btn}
        onClick={() => {
          if (isOpen) {
            setOpenFoodLogId(null);
          } else {
            setOpenFoodLogId(food.id);
          }
        }}
      >
        <Group className={css.hoverAnimation} align="flex-start" justify="space-between">
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
      <Collapse in={isOpen}>
        <Group pb="xs">
          <Button>Add today</Button>
          <Button variant="outline" leftSection={<Icon path={mdiPencil} size={1} />}>
            Edit
          </Button>
          <Button color="red">Delete</Button>
        </Group>
      </Collapse>
    </li>
  );
};

export default FoodLogEntry;
