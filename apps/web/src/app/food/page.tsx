import { requireUser } from '@/utils/next-server/getUser';
import Food from './Food';

const FoodPage = async () => {
  await requireUser();

  return <Food />;
};

export default FoodPage;
