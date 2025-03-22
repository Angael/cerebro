import CardBtn from '@/lib/card-btn/CardBtn';
import FoodMacros from '@/lib/food-macros/FoodMacros';
import { FoodProduct } from '@cerebro/db';
import { Group, Stack, Text, Title } from '@mantine/core';

type Props = {
  foodProduct: FoodProduct;
  onProductSelect: (id: FoodProduct) => void;
};

const CustomProductBtn = ({ foodProduct, onProductSelect }: Props) => {
  const { id, product_name, brands, kcal_100g, carb_100g, fat_100g, proteins_100g } = foodProduct;

  const showMacros = carb_100g !== null && fat_100g !== null && proteins_100g !== null;

  return (
    <CardBtn key={id} onClick={() => onProductSelect(foodProduct)} pos="relative" p="sm">
      <Stack gap="xs">
        <Group>
          <Stack flex={1} gap={0}>
            <Title order={5}>{product_name}</Title>
            {brands && <Text size="sm">{brands}</Text>}
          </Stack>
          {kcal_100g && (
            <Stack gap={0}>
              <Text size="sm">
                {kcal_100g} kcal{' '}
                <Text component="span" size="sm" c="gray.6">
                  / 100g
                </Text>
              </Text>
            </Stack>
          )}
        </Group>
        {showMacros && <FoodMacros carbs={carb_100g} fats={fat_100g} proteins={proteins_100g} />}
      </Stack>
    </CardBtn>
  );
};

export default CustomProductBtn;
