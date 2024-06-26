import { NextFunction, Request, Response } from 'express';
import logger from '@/utils/log.js';
import { optionalSession } from '@/middleware/optionalSession.js';

export const isPremium = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = await optionalSession(req);
  if (user?.type === 'PREMIUM' || user?.type === 'ADMIN') {
    next();
  } else {
    const { method, url } = req;
    logger.error('User is not premium %o', {
      method,
      url,
      userId: user?.id,
    });
    res.status(403).send();
  }
};
