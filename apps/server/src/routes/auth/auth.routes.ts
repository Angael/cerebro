import express from 'express';
import { generateId } from 'lucia';
import { lucia } from '@/lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import z from 'zod';
import { errorResponse } from '@/utils/errors/errorResponse.js';

const authRouter = express.Router({ mergeParams: true });

const signupZod = z.object({
  email: z.string().email().min(6), // a@a.aa
  password: z.string().min(8),
});

authRouter.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = signupZod.parse(req.body);

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);

    await db
      .insertInto('user')
      .values({ id: userId, type: 'FREE', email, hashed_password: hashedPassword })
      .execute();

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    console.log({ sessionCookie });
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.sendStatus(204);
  } catch (e) {
    // db error, email taken, etc
    errorResponse(res, e);
  }
});

const signinZod = z.object({
  email: z.string().min(3),
  password: z.string().min(3),
});

authRouter.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = signinZod.parse(req.body);

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return res.status(400).send('User not found');
    }

    const isValidPassword = await new Argon2id().verify(user.hashed_password, password);
    if (!isValidPassword) {
      return res.status(400).send('Invalid password');
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

export default authRouter;
