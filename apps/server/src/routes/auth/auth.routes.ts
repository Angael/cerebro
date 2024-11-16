import express from 'express';
import { generateId } from 'lucia';
import { lucia } from '@/my-lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import z from 'zod';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { parseCookies } from 'oslo/cookie';

const authRouter = express.Router({ mergeParams: true });
authRouter.use('/auth', express.json());

const signupZod = z.object({
  email: z.string().email('Provide a valid email').min(6, 'Email is too short').trim(), // a@a.aa
  password: z.string().min(8, 'Password is too short').trim(),
});

authRouter.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = signupZod.parse(req.body);

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);

    const userExists = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    if (userExists) {
      return res.status(400).json({ msg: 'Email already taken' });
    }

    await db
      .insertInto('user')
      .values({ id: userId, type: 'FREE', email, hashed_password: hashedPassword })
      .execute();

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.sendStatus(204);
  } catch (e) {
    // db error, email taken, etc
    errorResponse(res, e);
  }
});

const signinZod = z.object({
  email: z.string().min(3).trim(),
  password: z.string().min(3).trim(),
});

const badEmailOrPassword = { msg: 'Bad email or password' };

authRouter.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = signinZod.parse(req.body);

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return res.status(400).json(badEmailOrPassword);
    }

    const isValidPassword = await new Argon2id().verify(user.hashed_password, password);
    if (!isValidPassword) {
      return res.status(400).json(badEmailOrPassword);
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.cookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      maxAge: sessionCookie.attributes.maxAge! * 1000,
    });
    res.sendStatus(204);
  } catch (e) {
    errorResponse(res, e);
  }
});

authRouter.delete('/auth/signout', async (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie ?? '');
    const auth_session = cookies.get('auth_session');

    if (!auth_session) {
      res.sendStatus(400);
      return;
    }

    await db.deleteFrom('user_session').where('id', '=', auth_session).execute();
    await lucia.invalidateSession(auth_session);

    const sessionCookie = lucia.createBlankSessionCookie();
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.sendStatus(204);
  } catch (e) {
    errorResponse(res, e);
  }
});

export default authRouter;
