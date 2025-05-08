'use client';
import { API } from '@/utils/API';
import { QUERY_KEYS } from '@/utils/consts';
import { Button, Collapse, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './FoodLogEntry.module.css';
import { useFoodLogsContext } from './FoodLogsContext';

type Props = {
  food: {
    id: number;
    brands: string | null;
    product_name: string;
    amount: number;
    kcal: number;
  };
};

const FoodLogEntry = ({ food }: Props) => {
  const { openFoodLogId, setOpenFoodLogId } = useFoodLogsContext();
  const isOpen = openFoodLogId === food.id;

  const queryClient = useQueryClient();
  const deleteMut = useMutation({
    mutationFn: () => {
      queryClient.setQueryData([QUERY_KEYS.foodHistory], (data: any) => {
        data?.filter((f: any) => f.id !== food.id);
      });
      queryClient.setQueryData([QUERY_KEYS.todaysFood], (data: any) =>
        data?.filter((f: any) => f.id !== food.id),
      );

      return API.delete(`/food/log/${food.id}`);
    },
  });

  const bigText = food.product_name || food.brands;
  const smallText = food.product_name ? food.brands : null;

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
            <Text size="sm" c="gray.3">
              {bigText}
            </Text>
            {smallText && (
              <Text size="xs" c="gray.5">
                {smallText}
              </Text>
            )}
          </Stack>
          <Stack align="flex-end" gap={0} flex={1}>
            <Text size="sm">{Math.ceil(food.kcal)} kcal</Text>
            {!!food.amount && (
              <Text span c="dark.2" size="xs">
                {food.amount}g
              </Text>
            )}
          </Stack>
        </Group>
      </UnstyledButton>
      <Collapse in={isOpen}>
        <Group pb="xs">
          <Button disabled>Add today</Button>
          <Button disabled variant="outline" leftSection={<Icon path={mdiPencil} size={1} />}>
            Edit
          </Button>
          <Button color="red" onClick={() => deleteMut.mutate()} loading={deleteMut.isPending}>
            Delete
          </Button>
        </Group>
      </Collapse>
    </li>
  );
};

export default FoodLogEntry;
