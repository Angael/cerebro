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

const SaveProductModal = ({ foodProduct, onClose }: Props) => {
  const [inputValue, setInputValue] = useState('');

  const handleQuickAdd = (value: string) => {
    setInputValue(value);
  };

  const onPercentQuickAdd = (percent: number) => {
    const productQuantity = foodProduct.product_quantity * (percent / 100);
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

  const isOnlyNumbers = true;

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
            rightSection={'g'}
            error={!isOnlyNumbers}
          />
          <Button variant="default" onClick={increment}>
            +
          </Button>
        </Group>

        <Text size="xs" mb={-16}>
          Quick add:
        </Text>
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
