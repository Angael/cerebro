import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.routes';
import { List, ListItem } from '@mantine/core';

type Props = {
  foods: QueryFoodToday;
};

const FoodList = ({ foods }: Props) => {
  return (
    <List>
      {foods.map((food) => (
        <ListItem key={food.id}>
          {food.product_name} {food.brands} {food.barcode} {food.amount}g/ml {food.kcal}kcal
        </ListItem>
      ))}
    </List>
  );
};

export default FoodList;
