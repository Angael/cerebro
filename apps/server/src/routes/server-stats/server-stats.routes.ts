import logger from '@/utils/log';
import { honoFactory } from '../honoFactory';
import { requireSession } from '@/middleware/requireSession';
import { getStats } from './server-stats.logic';

const serverStatsRoutes = honoFactory();

serverStatsRoutes.get('/stats', async (c) => {
  const { user } = await requireSession(c);

  if (user.type !== 'ADMIN') {
    logger.warn('Server stats: User %s is not an ADMIN', user?.id);
  }

  logger.info('Server stats: serving for user: %s', user?.id);

  return c.json(getStats());
});

export default serverStatsRoutes;
