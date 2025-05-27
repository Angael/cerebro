import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import { zGoals } from './goals.model.js';
import { setCurrentGoals } from './goals.service.js';

const goalsRoutes = honoFactory();

goalsRoutes.post('/goals/set', zValidator('json', zGoals), async (c) => {
  const { user } = await requireSession(c);
  const payload = c.req.valid('json');

  await setCurrentGoals(user.id, payload);
  logger.info('Set goals for %s', user?.id);

  return c.body(null, 201);
});

export default goalsRoutes;
