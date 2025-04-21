import { requireUser } from '@/utils/next-server/getUser';
import Food from './Food';
import { getGoals } from '@/server/getGoals';

const FoodPage = async () => {
  const user = await requireUser();
  const goals = await getGoals(user.id);

  return <Food goals={goals} />;
};

export default FoodPage;
