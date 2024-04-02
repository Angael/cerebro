import express from 'express';
import { generateId } from 'lucia';
import { lucia } from '@/lucia.js';
import { db } from '@cerebro/db';
import { Argon2id } from 'oslo/password';
import bodyParser from 'body-parser';

const authRouter = express.Router({ mergeParams: true });
authRouter.use(bodyParser.urlencoded({ extended: true }));

authRouter.post('/signup', async (req, res) => {
  throw new Error('not implemented');
  console.log(req.body);
  const formData = await req.body; // TODO zod check
  const email = formData['email'];

  function isValidEmail(email: string): boolean {
    return /.+@.+/.test(email);
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).send('Invalid email');
  }
  const password = formData['password'];
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).send('Invalid password');
  }

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

authRouter.post('/signin', async (req, res) => {
  throw new Error('not implemented');
  const formData = await req.body; // TODO zod check
  const email = formData['email'];
  const password = formData['password'];

  if (!email || typeof email !== 'string') {
    return res.status(400).send('Invalid email');
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).send('Invalid password');
  }

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
  res.cookie('TestName', 'TestValue', { maxAge: 9999 });
  res.redirect('http://localhost:3000/');
});

export default authRouter;
