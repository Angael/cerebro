import { generateId } from 'lucia';
import { lucia } from '@/my-lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import z from 'zod';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { parseCookies } from 'oslo/cookie';
import { honoFactory } from '../myHono';
import { zValidator } from '@hono/zod-validator';
import { setCookie } from 'hono/cookie';

const badEmailOrPassword = { msg: 'Bad email or password' };

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
      try {
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

        setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        return c.body('', 204);
      } catch (e) {
        // db error, email taken, etc
        return errorResponse(c, e);
      }
    },
  )
  .post(
    '/auth/signin',
    zValidator(
      'json',
      z.object({
        email: z.string().min(3).trim(),
        password: z.string().min(3).trim(),
      }),
    ),
    async (c) => {
      try {
        const { email, password } = c.req.valid('json');

        const user = await db
          .selectFrom('user')
          .selectAll()
          .where('email', '=', email)
          .executeTakeFirst();

        if (!user) {
          return c.json(badEmailOrPassword, 400);
        }

        const isValidPassword = await new Argon2id().verify(user.hashed_password, password);
        if (!isValidPassword) {
          return c.json(badEmailOrPassword, 400);
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        setCookie(c, sessionCookie.name, sessionCookie.value, {
          ...sessionCookie.attributes,
          // TODO: check if this is correct
          maxAge: sessionCookie.attributes.maxAge! * 1000,
        });

        return c.body('', 204);
      } catch (e) {
        return errorResponse(c, e);
      }
    },
  )
  .delete('/auth/signout', async (c) => {
    try {
      // Maybe OSLO is not necessary anymore?
      const cookies = parseCookies(c.header('cookie') ?? '');
      const auth_session = cookies.get('auth_session');

      if (!auth_session) {
        return c.body('', 400);
      }

      await db.deleteFrom('user_session').where('id', '=', auth_session).execute();
      await lucia.invalidateSession(auth_session);

      const sessionCookie = lucia.createBlankSessionCookie();
      setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

      return c.body('', 204);
    } catch (e) {
      return errorResponse(c, e);
    }
  });

export default authRouter;
