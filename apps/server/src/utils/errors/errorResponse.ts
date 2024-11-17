import { MyContext } from '@/routes/myHono.js';
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';
import logger from '../log.js';
import { HttpError } from './HttpError.js';

// TODO: is this necessary? Hono should probably catch errors itself
export const errorResponse = (c: MyContext, e: any) => {
  if (e instanceof HttpError) {
    logger.error('HttpError Error: %s', e.message);
    return c.json({ error: e.message }, e.status as StatusCode);
  } else if (e instanceof ZodError) {
    logger.error('Zod Error: %O', e.issues); // Should we log validation issues?
    // Changed to include error beside of issues
    return c.json({ error: e.message, issues: e.issues }, 400);
  } else {
    logger.error('Unknown Error: %s', e.message);
    // Changed to include json
    return c.json({ error: 'Internal server error' }, 500);
  }
};
