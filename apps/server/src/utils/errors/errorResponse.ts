import { Response } from 'express';
import { HttpError } from './HttpError.js';
import logger from '../log.js';
import { ZodError } from 'zod';

export const errorResponse = (res: Response, e: any) => {
  if (e instanceof HttpError) {
    res.status(e.status).send(e.message);
  } else if (e instanceof ZodError) {
    logger.error('Error: %O', e.issues); // Should we log validation issues?
    res.status(400).json(e.issues);
  } else {
    logger.error('Error: %s', e.message);
    res.sendStatus(500);
  }
};
