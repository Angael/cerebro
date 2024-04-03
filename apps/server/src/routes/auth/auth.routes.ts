import express from 'express';
import { generateId } from 'lucia';
import { lucia } from '@/lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import bodyParser from 'body-parser';
import z from 'zod';

const authRouter = express.Router({ mergeParams: true });
authRouter.use(bodyParser.urlencoded({ extended: true }));

const signupZod = z.object({
  email: z.string().email().min(6), // a@a.aa
  password: z.string().min(8),
});

authRouter.post('/auth/signup', async (req, res) => {
  const { email, password } = signupZod.parse(req.body);

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    await db
      .insertInto('user')
      .values({ id: userId, type: 'FREE', email, hashed_password: hashedPassword })
      .execute();

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    console.log({ sessionCookie });
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.redirect('http://localhost:3000/');
  } catch (e) {
    // db error, email taken, etc
    return res.status(400).json(e);
  }
});

const signinZod = z.object({
  email: z.string().min(3),
  password: z.string().min(3),
});

const redirectZod = z.string().url();

authRouter.post('/auth/signin', async (req, res) => {
  const { email, password } = signinZod.parse(req.body);
  const redirectUrl = redirectZod.parse(req.query.redirect);

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

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  res.redirect(redirectUrl);
});

export default authRouter;
