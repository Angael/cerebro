import FoodMacros from '@/lib/food-macros/FoodMacros';
import { FoodProduct } from '@cerebro/db';
import { Paper, Stack, Text, Title } from '@mantine/core';
import css from './FoodProductSummary.module.css';

type Props = {
  foodProduct: FoodProduct;
};

const FoodProductSummary = ({ foodProduct }: Props) => {
  const {
    kcal_100g,
    carb_100g,
    proteins_100g,
    fat_100g,
    image_url,
    product_quantity,
    product_quantity_unit,
  } = foodProduct;

  const hasNutriments = carb_100g !== null && proteins_100g !== null && fat_100g !== null;

  const bigText = foodProduct.product_name || foodProduct.brands;
  const smallText = foodProduct.product_name ? foodProduct.brands : null;

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
          <Title order={3}>{bigText}</Title>
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
