import CardBtn from '@/lib/card-btn/CardBtn';
import { FoodProduct } from '@cerebro/db';
import { Group, Stack, Text, Title } from '@mantine/core';
import { mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';

type Props = {
  foodProduct: FoodProduct;
  onProductSelect: (id: FoodProduct) => void;
};

const CustomProductBtn = ({ foodProduct, onProductSelect }: Props) => {
  const { id, product_name, brands, kcal_100g, product_quantity, product_quantity_unit } =
    foodProduct;

  const bigText = product_name || brands;
  const smallText = product_name ? brands : null;

  return (
    <CardBtn key={id} onClick={() => onProductSelect(foodProduct)} pos="relative" p="xs">
      <Group>
        <Stack flex={1} gap={0}>
          <Title order={6} size="sm" fw="normal">
            {bigText}
          </Title>
          {smallText && (
            <Text size="xs" c="gray.5">
              {smallText}
            </Text>
          )}
        </Stack>
        {kcal_100g && (
          <Stack gap={0} w={100} c="gray.5">
            <Text size="sm">
              {kcal_100g} kcal{' '}
              <Text component="span" c="gray.6">
                / 100{product_quantity_unit || 'g'}
              </Text>
            </Text>
            {product_quantity && (
              <Text size="sm">
                Size: {product_quantity}
                {product_quantity_unit}
              </Text>
            )}
          </Stack>
        )}
        <Icon path={mdiChevronRight} size={1} style={{ marginRight: -8 }} />
      </Group>
    </CardBtn>
  );
};

export default CustomProductBtn;
