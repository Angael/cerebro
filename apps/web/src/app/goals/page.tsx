import { requireUser } from '@/utils/next-server/getUser';
import Goals from './Goals';

const GoalsPage = async () => {
  await requireUser();

  return <Goals />;
};

export default GoalsPage;
