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

const authRouter = honoFactory()
  .post(
    '/auth/signup',
    zValidator(
      'json',
      z.object({
        email: z.string().email('Provide a valid email').min(6, 'Email is too short').trim(), // a@a.aa
        password: z.string().min(8, 'Password is too short').trim(),
      }),
    ),
    async (c) => {
      const { email, password } = c.req.valid('json');

      const hashedPassword = await new Argon2id().hash(password);
      const userId = generateId(15);

      const userExists = await db
        .selectFrom('user')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

      if (userExists) {
        return c.json({ msg: 'Email already taken' }, 400);
      }

      await db
        .insertInto('user')
        .values({ id: userId, type: 'FREE', email, hashed_password: hashedPassword })
        .execute();

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      setCookie(c, sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
        domain,
      });
      return c.body(null, 204);
    },
  )
  .delete('/auth/signout', async (c) => {
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
