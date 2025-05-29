'use client';
import { deleteFoodLog } from '@/server/deleteFoodLog';
import { QUERY_KEYS } from '@/utils/consts';
import { Button, Collapse, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AddProductModal from '../add-product-modal/AddProductModal';
import css from './FoodLogEntry.module.css';
import { useFoodLogsContext } from './FoodLogsContext';
import { FoodHistoryType } from '@/server/getFoodHistory';

type Props = {
  food: FoodHistoryType[number];
};

const FoodLogEntry = ({ food }: Props) => {
  const { openFoodLogId, setOpenFoodLogId } = useFoodLogsContext();
  const [isEdited, { open: startEditing, close: endEditing }] = useDisclosure(false);
  const isOpen = openFoodLogId === food.id;

  const queryClient = useQueryClient();
  const deleteMut = useMutation({
    meta: {
      invalidateQueryKey: [QUERY_KEYS.fetchFoodHistory],
      error: {
        title: 'Error deleting food log',
        message: 'Please try again later.',
      },
    },
    mutationFn: () => {
      queryClient.setQueryData([QUERY_KEYS.fetchFoodHistory], (data: any) => {
        data?.filter((f: any) => f.id !== food.id);
      });
      return deleteFoodLog(food.id);
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
          <Button
            variant="outline"
            leftSection={<Icon path={mdiPencil} size={1} />}
            onClick={startEditing}
          >
            Edit
          </Button>
          <Button color="red" onClick={() => deleteMut.mutate()} loading={deleteMut.isPending}>
            Delete
          </Button>
        </Group>
      </Collapse>

      <AddProductModal open={isEdited} onClose={endEditing} foodLog={food} />
    </li>
  );
};

export default FoodLogEntry;
