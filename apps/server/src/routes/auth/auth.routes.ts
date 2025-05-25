import { generateId } from 'lucia';
import { lucia } from '@/my-lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import z from 'zod';
import { honoFactory } from '../honoFactory';
import { zValidator } from '@hono/zod-validator';
import { setCookie, getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { env } from '@/utils/env';

const domain = env.AUTH_COOKIE_DOMAIN;

const authRouter = honoFactory().delete('/auth/signout', async (c) => {
  const auth_session = getCookie(c, 'auth_session');

  if (!auth_session) {
    throw new HTTPException(401);
  }

  await db.deleteFrom('user_session').where('id', '=', auth_session).execute();
  await lucia.invalidateSession(auth_session);

  const sessionCookie = lucia.createBlankSessionCookie();
  setCookie(c, sessionCookie.name, sessionCookie.value, { ...sessionCookie.attributes, domain });

  return c.body(null, 204);
});

export default authRouter;
