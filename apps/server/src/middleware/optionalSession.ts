import { MyContext } from '@/routes/honoFactory';
import { lucia } from '@/my-lucia';

export const optionalSession = async (c: MyContext): ReturnType<typeof lucia.validateSession> => {
  // Optimization to not query db twice
  const user = c.get('user');
  const session = c.get('session');

  if (user && session) {
    return { user, session };
  } else {
    const sessionId = lucia.readSessionCookie(c.req.header('cookie') ?? '');
    const { user, session } = await lucia.validateSession(sessionId ?? '');

    if (user && session) {
      c.set('user', user);
      c.set('session', session);

      return { user, session };
    } else {
      return { user: null, session: null };
    }
  }
};
