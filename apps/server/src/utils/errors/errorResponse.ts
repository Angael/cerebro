import { MyContext } from '@/routes/myHono.js';
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';
import logger from '../log.js';
import { HttpError } from './HttpError.js';
import { HTTPException } from 'hono/http-exception';

// TODO: is this necessary? Hono should probably catch errors itself
export const errorResponse = (c: MyContext, e: any) => {
  if (e instanceof HttpError) {
    logger.error('HttpError Error: %s', e.toString());
    return c.json({ error: e.message }, e.status as StatusCode);
  } else if (e instanceof HTTPException) {
    logger.error('HTTPException Error: %s', e.toString());
    return c.json({ error: e.message }, e.status as StatusCode);
  } else if (e instanceof ZodError) {
    logger.error('Zod Error: %s', e.toString()); // Should we log validation issues?
    // Changed to include error beside of issues
    return c.json({ error: e.message, issues: e.issues }, 400);
  } else {
    logger.error('Unknown Error: %s', e.toString());
    // Changed to include json
    return c.json({ error: 'Internal server error' }, 500);
  }
};
