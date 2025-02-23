import { QueryFoodToday } from '@cerebro/server/src/routes/food/food.model';
import { List, ListItem, Stack, Text } from '@mantine/core';
import css from './FoodList.module.css';
import FoodLogEntry from './FoodLogEntry';

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
      <ul className={css.unstyledList}>
        {foods.map((food) => (
          <FoodLogEntry key={food.id} food={food} />
        ))}
      </ul>
    </Stack>
  );
};

export default FoodList;
