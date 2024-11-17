import { createMiddleware } from 'hono/factory';
import logger from '@/utils/log.js';
import { optionalSession } from '@/middleware/optionalSession.js';

export const isPremium = createMiddleware(async (c, next) => {
  const { user } = await optionalSession(c);

  if (user?.type === 'PREMIUM' || user?.type === 'ADMIN') {
    await next();
  } else {
    const { method, url } = c.req;

    logger.error('User %s is not premium. Method: %s. Url: %s ', user?.id, method, url);
    return c.json({ error: 'User is not premium' }, 403);
  }
});
