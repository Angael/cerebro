import { requireUser } from '@/server/auth/getUser';
import Food from './Food';
import { getGoals } from '@/server/getGoals';
import { getFoodHistory } from '@/server/food/getFoodHistory';
import { FoodLogsContextProvider } from './food-log-entry/FoodLogsContext';

const FoodPage = async () => {
  const user = await requireUser();
  const goals = getGoals(user.id);
  const foodHistory = getFoodHistory(user.id);

  return (
    <FoodLogsContextProvider>
      <Food goals={await goals} foodHistoryInit={await foodHistory} />;
    </FoodLogsContextProvider>
  );
};

export default FoodPage;
