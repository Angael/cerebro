import { env } from '@/utils/env';
import { db } from '@cerebro/db';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { honoFactory } from '../honoFactory';

const domain = env.AUTH_COOKIE_DOMAIN;

const authRouter = honoFactory().delete('/auth/signout', async (c) => {
  const auth_session = getCookie(c, 'auth_session');

  if (!auth_session) {
    throw new HTTPException(401);
  }

  await db.deleteFrom('user_session').where('id', '=', auth_session).execute();

  setCookie(c, 'auth_session', '', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    domain,
  });

  return c.body(null, 204);
});

export default authRouter;
