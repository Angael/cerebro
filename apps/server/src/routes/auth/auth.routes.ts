import express from 'express';
import { generateId } from 'lucia';
import { lucia } from '@/lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import z from 'zod';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { requireSession } from '@/middleware/requireSession.js';

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

    await db.deleteFrom('user_session').where('user_id', '=', user.id).execute();
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.sendStatus(204);
  } catch (e) {
    errorResponse(res, e);
  }
});

authRouter.delete('/auth/signout', async (req, res) => {
  try {
    const { user, session } = await requireSession(req);

    await db.deleteFrom('user_session').where('user_id', '=', user.id).execute();
    await lucia.invalidateUserSessions(user.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.sendStatus(204);
  } catch (e) {
    errorResponse(res, e);
  }
});

export default authRouter;
