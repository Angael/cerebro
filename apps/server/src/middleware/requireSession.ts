import { optionalSession } from '@/middleware/optionalSession.js';
import { MyContext } from '@/routes/myHono';
import { HttpError } from '@/utils/errors/HttpError.js';

export const requireSession = async (c: MyContext) => {
  const sessionAndUser = await optionalSession(c);
  if (sessionAndUser.user && sessionAndUser.session) {
    return sessionAndUser;
  } else {
    throw new HttpError(401, "Couldn't authenticate");
  }
};
