import { requireUser } from '@/server/auth/getUser';
import Food from './Food';
import { getGoals } from '@/server/getGoals';
import { getFoodHistory } from '@/server/getFoodHistory';

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 0;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

const FoodPage = async () => {
  const user = await requireUser();
  const goals = getGoals(user.id);
  const foodHistory = getFoodHistory(user.id);

  return <Food goals={await goals} foodHistoryInit={await foodHistory} />;
};

export default FoodPage;
