import FoodMacros from '@/lib/food-macros/FoodMacros';
import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Paper, Stack, Text, Title } from '@mantine/core';
import css from './FoodProductSummary.module.css';

type Props = {
  foodProduct: QueryScannedCode;
};

const FoodProductSummary = ({ foodProduct }: Props) => {
  const { carbohydrates_100g, proteins_100g, fat_100g } = foodProduct.nutriments;

  const hasNutriments =
    carbohydrates_100g !== undefined && proteins_100g !== undefined && fat_100g !== undefined;

  return (
    <Paper bg="dark.9" p="md">
      <div className={css.imgAndDescFlex}>
        <img className={css.foodImg} src={foodProduct.image_url} alt="" />
        <Stack gap="xs">
          <div>
            <Text c="gray" size="sm">
              {foodProduct.brands}
            </Text>
            <Title order={3}>{foodProduct.product_name}</Title>
          </div>
          <div>
            {foodProduct.nutriments['energy-kcal_100g'] && (
              <Text size="sm">{foodProduct.nutriments['energy-kcal_100g']} kcal / 100g</Text>
            )}
            {foodProduct.product_quantity && (
              <Text size="sm">
                Size: {foodProduct.product_quantity}
                {foodProduct.product_quantity_unit}
              </Text>
            )}
          </div>
        </Stack>
      </div>

      {hasNutriments && (
        <FoodMacros carbs={carbohydrates_100g} proteins={proteins_100g} fats={fat_100g} mt="sm" />
      )}
    </Paper>
  );
};

export default FoodProductSummary;
