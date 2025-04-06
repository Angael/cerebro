import { QueryFoodToday } from '@cerebro/server';
import { Text } from '@mantine/core';
import FoodLogEntry from './food-log-entry/FoodLogEntry';
import FoodLogsList from './food-log-entry/FoodLogsList';

type Props = {
  foods: QueryFoodToday;
};

const FoodList = ({ foods }: Props) => {
  if (foods.length === 0) {
    return <Text>No foods logged today</Text>;
  }

  return (
    <FoodLogsList>
      {foods.map((food) => (
        <FoodLogEntry key={food.id} food={food} />
      ))}
    </FoodLogsList>
  );
};

export default FoodList;
