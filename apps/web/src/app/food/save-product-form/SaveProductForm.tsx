import { postConsumedProduct } from '@/server/postConsumedProduct';
import { QUERY_KEYS } from '@/utils/consts';
import { FoodProduct } from '@cerebro/db';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import css from './SaveProductForm.module.css';

type Props = {
  foodProduct: FoodProduct;
  onClose: () => void;
};

const percentageButtons = [
  { label: '1/4', multiplier: 0.25 },
  { label: '1/2', multiplier: 0.5 },
  { label: '1x', multiplier: 1 },
  { label: '2x', multiplier: 2 },
  { label: '3x', multiplier: 3 },
] as const;

const gramsButtons = ['10', '25', '50', '75', '100'];

function getKcalColor(calories: number): string {
  if (calories >= 0 && calories <= 50) {
    return 'green';
  } else if (calories >= 51 && calories <= 150) {
    return 'lime';
  } else if (calories >= 151 && calories <= 300) {
    return 'yellow';
  } else if (calories >= 301 && calories <= 500) {
    return 'orange';
  } else if (calories >= 501) {
    return 'red';
  } else {
    // Handle cases where calories might be negative or not a number if needed.
    return 'blue';
  }
}

function getNrFromQuantity(quantity: number | null): number {
  if (quantity === null) {
    return 100;
  }

  return quantity || 100;
}

const SaveProductModal = ({ foodProduct, onClose }: Props) => {
  // By default 100% of the product
  const [inputValue, setInputValue] = useState(
    foodProduct.product_quantity ? `${Math.round(foodProduct.product_quantity) || ''}` : '',
  );

  const handleQuickAdd = (value: string) => {
    setInputValue(value);
  };

  const onPercentQuickAdd = (percent: number) => {
    const quantityNumber = getNrFromQuantity(foodProduct.product_quantity);

    if (isNaN(quantityNumber)) {
      return;
    }

    const productQuantity = quantityNumber * percent;
    setInputValue(`${productQuantity}`);
  };

  const saveMutation = useMutation({
    meta: {
      invalidateQueryKey: [QUERY_KEYS.fetchFoodHistory],
      error: { title: 'Error logging product', message: 'Please try again later.' },
    },
    mutationFn: () =>
      postConsumedProduct({
        foodProductId: foodProduct.id,
        amount: Number(inputValue),
        date: new Date().toISOString(),
      }),
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveMutation.mutate();
  };

  const increment = () => {
    setInputValue((prev) => {
      const parsed = parseInt(prev || '0', 10);
      return `${parsed + 1}`;
    });
  };

  const decrement = () => {
    setInputValue((prev) => {
      const parsed = parseInt(prev || '0', 10);
      return `${parsed - 1}`;
    });
  };

  const allowPercentageQuickAdd = !!foodProduct.product_quantity;

  const kcal = (foodProduct.kcal_100g / 100) * Number(inputValue);

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group wrap="nowrap" align="flex-end">
          <Button variant="default" onClick={decrement}>
            -
          </Button>
          <TextInput
            type="number"
            label="How much grams?"
            placeholder="100g"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            rightSection="g"
            style={{ flex: 1 }}
          />
          <Button variant="default" onClick={increment}>
            +
          </Button>
        </Group>

        <Text size="xl" fw={900} c={getKcalColor(kcal)} mx="auto">
          {Math.round(kcal)} kcal
        </Text>

        <Text size="xs" mb={-16}>
          Quick add:
        </Text>
        {allowPercentageQuickAdd && (
          <Group gap="xs" wrap="nowrap" justify="space-between" className={css.quickAddGroup}>
            {percentageButtons.map((percent) => (
              <Button
                key={percent.label}
                size="xs"
                color="orange"
                variant="light"
                onClick={() => onPercentQuickAdd(percent.multiplier)}
              >
                {percent.label}
              </Button>
            ))}
          </Group>
        )}

        <Group gap="xs" wrap="nowrap" justify="space-between" className={css.quickAddGroup}>
          {gramsButtons.map((grams) => (
            <Button
              key={grams}
              size="xs"
              color="blue"
              variant="light"
              onClick={() => handleQuickAdd(grams)}
            >
              {grams}g
            </Button>
          ))}
        </Group>

        <Button type="submit" loading={saveMutation.isPending}>
          Save
        </Button>
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default SaveProductModal;
