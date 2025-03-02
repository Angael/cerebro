import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import css from './SaveProductForm.module.css';

type Props = {
  foodProduct: QueryScannedCode;
  onClose: () => void;
};

const percentageButtons = ['10%', '25%', '50%', '75%', '100%'];
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

function getNrFromQuantity(quantity: string | undefined): number {
  if (quantity === undefined) {
    return 100;
  }

  return parseInt(quantity, 10) || 100;
}

const SaveProductModal = ({ foodProduct, onClose }: Props) => {
  const [inputValue, setInputValue] = useState('');

  const handleQuickAdd = (value: string) => {
    setInputValue(value);
  };

  const onPercentQuickAdd = (percent: number) => {
    const quantityNumber = getNrFromQuantity(foodProduct.product_quantity);

    if (isNaN(quantityNumber)) {
      return;
    }

    const productQuantity = quantityNumber * (percent / 100);
    setInputValue(`${productQuantity}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submit value:', inputValue);
    showNotification({
      title: 'Product saved',
      message: 'Product saved successfully',
      color: 'blue',
    });
    // Here you would handle the form submission, e.g., sending the data to an API
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

  const allowPercentageQuickAdd =
    foodProduct.product_quantity !== undefined &&
    !isNaN(parseInt(foodProduct.product_quantity, 10));
  const kcal = (foodProduct.nutriments['energy-kcal_100g'] / 100) * Number(inputValue);

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
                key={percent}
                size="xs"
                color="orange"
                variant="light"
                onClick={() => onPercentQuickAdd(parseInt(percent, 10))}
              >
                {percent}
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

        <Button type="submit">Save</Button>
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    </form>
  );
};

export default SaveProductModal;
