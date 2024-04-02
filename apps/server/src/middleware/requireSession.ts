import { Request } from 'express';
import { optionalSession } from '@/middleware/optionalSession.js';
import { HttpError } from '@/utils/errors/HttpError.js';

// TODO rename to not use hook like name?
export const requireSession = async (req: Request) => {
  const sessionAndUser = await optionalSession(req);
  if (sessionAndUser.user && sessionAndUser.session) {
    return sessionAndUser;
  } else {
    throw new HttpError(401);
  }
};
