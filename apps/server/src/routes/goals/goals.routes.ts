import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import { GoalsType, zGoals } from './goals.model.js';
import { getGoals, setCurrentGoals } from './goals.service.js';

const goalsRoutes = honoFactory();

goalsRoutes.get('/goals/current', async (c) => {
  const { user } = await requireSession(c);

  const result = await getGoals(user?.id);
  logger.verbose('Got /goals/current for %s', user?.id);

  return c.json(result satisfies GoalsType | null);
});

goalsRoutes.post('/goals/set', zValidator('json', zGoals), async (c) => {
  const { user } = await requireSession(c);
  const payload = c.req.valid('json');

  await setCurrentGoals(user.id, payload);
  logger.info('Set goals for %s', user?.id);

  return c.body(null, 201);
});

export default goalsRoutes;
