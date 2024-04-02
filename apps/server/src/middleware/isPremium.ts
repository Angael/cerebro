import { NextFunction, Request, Response } from 'express';
import logger from '@/utils/log.js';
import { useOptionalSession } from '@/middleware/useOptionalSession.js';

export const isPremium = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = await useOptionalSession(req);
  if (user?.type === 'PREMIUM') {
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
