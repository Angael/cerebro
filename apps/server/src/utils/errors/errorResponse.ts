import { MyContext } from '@/routes/honoFactory.js';
import { ZodError } from 'zod';
import logger from '../log.js';
import { HTTPException } from 'hono/http-exception';

export const errorResponse = (c: MyContext, e: any) => {
  const url = c.req.url;
  if (e instanceof HTTPException) {
    logger.error('HTTPException: %s %s (%s)', e.status, e.message || 'None', url);

    return e.getResponse();
  } else if (e instanceof ZodError) {
    logger.error('Zod Error: %s (%s)', e.toString(), url);

    return c.json({ error: e.message, issues: e.issues }, 400);
  } else {
    logger.error('Unknown Error: %s (%s)', e.toString(), url);

    return c.json({ error: 'Internal server error' }, 500);
  }
};
