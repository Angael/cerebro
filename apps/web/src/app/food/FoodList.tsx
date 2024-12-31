import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import { List, ListItem, Stack, Text } from '@mantine/core';

type Props = {
  foods: QueryFoodToday;
};

const FoodList = ({ foods }: Props) => {
  if (foods.length === 0) {
    return <Text>No foods logged today</Text>;
  }
  return (
    <Stack>
      <Text>Logged calories:</Text>
      <List>
        {foods.map((food) => (
          <ListItem key={food.id}>
            {food.product_name} {food.brands} {food.barcode} {food.amount}g/ml {food.kcal}kcal
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default FoodList;
