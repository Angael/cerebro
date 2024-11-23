import { optionalSession } from '@/middleware/optionalSession.js';
import { MyContext } from '@/routes/honoFactory';
import { HTTPException } from 'hono/http-exception';

export const requireSession = async (c: MyContext) => {
  const sessionAndUser = await optionalSession(c);
  if (sessionAndUser.user && sessionAndUser.session) {
    return sessionAndUser;
  } else {
    throw new HTTPException(401, { message: "Couldn't authenticate" });
  }
};
