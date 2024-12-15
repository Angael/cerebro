import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.routes';
import { Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import css from './FoodProductSummary.module.css';

type Props = {
  foodProduct: QueryScannedCode;
};

const FoodProductSummary = ({ foodProduct }: Props) => {
  const { carbohydrates_100g, proteins_100g, fat_100g } = foodProduct.nutriments;
  const others_100g = 100 - carbohydrates_100g - proteins_100g - fat_100g;

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

      <Progress.Root size="xl" mt="sm">
        <Progress.Section value={carbohydrates_100g} color="cyan">
          <Progress.Label>Carbs</Progress.Label>
        </Progress.Section>
        <Progress.Section value={proteins_100g} color="pink">
          <Progress.Label>Proteins</Progress.Label>
        </Progress.Section>
        <Progress.Section value={fat_100g} color="orange">
          <Progress.Label>Fats</Progress.Label>
        </Progress.Section>
        <Progress.Section value={others_100g} color="gray">
          <Progress.Label>Others</Progress.Label>
        </Progress.Section>
      </Progress.Root>
    </Paper>
  );
};

export default FoodProductSummary;
