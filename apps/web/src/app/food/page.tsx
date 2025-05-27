import { requireUser } from '@/server/auth/getUser';
import Food from './Food';
import { getGoals } from '@/server/getGoals';
import { getFoodHistory } from '@/server/getFoodHistory';

const FoodPage = async () => {
  const user = await requireUser();
  const goals = getGoals(user.id);
  const foodHistory = getFoodHistory(user.id);

  return <Food goals={await goals} foodHistoryInit={await foodHistory} />;
};

export default FoodPage;
