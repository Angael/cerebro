import { FoodProduct } from '@cerebro/db';
import { Stack, Text, Title } from '@mantine/core';
import css from './FoodProductSummary.module.css';

type Props = {
  product_name: FoodProduct['product_name'];
  brands: FoodProduct['brands'];
  kcal_100g: FoodProduct['kcal_100g'];
  image_url?: FoodProduct['image_url'];
  product_quantity?: FoodProduct['product_quantity'];
  product_quantity_unit?: FoodProduct['product_quantity_unit'];
};

const FoodProductSummary = ({
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
          <Title order={3} size="lg">
            {bigText}
          </Title>
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
