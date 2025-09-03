import { FoodProduct } from '@cerebro/db';
import { ActionIcon, Group, Stack, Text, Title } from '@mantine/core';
import { mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import css from './FoodProductSummary.module.css';
import Link from 'next/link';

type Props = {
  id: FoodProduct['id'];
  product_name: FoodProduct['product_name'];
  brands: FoodProduct['brands'];
  kcal_100g: FoodProduct['kcal_100g'];
  image_url?: FoodProduct['image_url'];
  product_quantity?: FoodProduct['product_quantity'];
  product_quantity_unit?: FoodProduct['product_quantity_unit'];
};

const FoodProductSummary = ({
  id,
  product_name,
  brands,
  kcal_100g,
  image_url,
  product_quantity,
  product_quantity_unit,
}: Props) => {
  const bigText = product_name || brands;
  const smallText = product_name ? brands : null;

  return (
    <div className={css.imgAndDescFlex}>
      {image_url && <img className={css.foodImg} src={image_url} alt="" />}
      <Stack gap="xs" className={css.foodDesc}>
        <div>
          {smallText && (
            <Text c="gray.5" size="sm">
              {smallText}
            </Text>
          )}
          <Group>
            <Title order={3} size="lg">
              {bigText}
            </Title>
            {id && (
              <ActionIcon
                variant="transparent"
                aria-label="Edit"
                size="sm"
                component={Link}
                href={`/food/edit-product/${id}`}
              >
                <Icon path={mdiPencil} />
              </ActionIcon>
            )}
          </Group>
        </div>
        <div>
          <Text size="sm">{kcal_100g} kcal / 100g</Text>

          {product_quantity && (
            <Text size="sm">
              Size: {product_quantity}
              {product_quantity_unit}
            </Text>
          )}
        </div>
      </Stack>
    </div>
  );
};

export default FoodProductSummary;
