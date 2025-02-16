import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';

type Props = {
  foodProduct: QueryScannedCode;
};

const percentageButtons = ['10%', '25%', '50%', '75%', '100%'];
const gramsButtons = ['10', '25', '50', '75', '100'];

const SaveProductModal = (props: Props) => {
  const [inputValue, setInputValue] = useState('');

  const handleQuickAdd = (value: string) => {
    setInputValue(value);
  };

  const onPercentQuickAdd = (percent: number) => {
    const productFullSize = props.foodProduct.product_quantity;
    const productQuantity = productFullSize * (percent / 100);
    setInputValue(`${productQuantity}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submit value:', inputValue);
    // Here you would handle the form submission, e.g., sending the data to an API
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group wrap="nowrap" align="flex-end">
          <Button>-1g</Button>
          <TextInput
            label="How much grams?"
            placeholder="100g"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            rightSection={'g'}
          />
          <Button>+1g</Button>
        </Group>

        <Text size="xs" mb={-16}>
          Quick add:
        </Text>
        <Group wrap="nowrap" justify="space-between">
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

        <Group wrap="nowrap" justify="space-between">
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
      </Stack>
    </form>
  );
};

export default SaveProductModal;
