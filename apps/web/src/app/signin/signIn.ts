'use server';
import { getUrl } from '@/server/helpers/getUrl';
import { Logger } from '@/utils/logger';
import { db } from '@cerebro/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Argon2id } from 'oslo/password';
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from '@/server/helpers/session';

export type SignInErrorCode = 'invalid_form_data' | 'invalid_credentials' | 'unknown_error';

const zForm = z.object({
  email: z.string().trim().min(3).email().trim(),
  password: z.string().trim().min(6, 'Password must be at least 6 characters long'),
  redirectTo: z.string().trim().optional(),
});

const redirectWithError = (errorCode: SignInErrorCode) => {
  const searchParams = new URLSearchParams();
  searchParams.append('errorCode', errorCode);
  redirect('/signin?' + searchParams.toString());
};

// This needs to be submitted using a Form, because what if hydration happens too late?
export const signInSubmitForm = async (formData: FormData) => {
  try {
    const parsedData = zForm.parse(Object.fromEntries(formData.entries()));

    const { email, password, redirectTo } = parsedData;
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Redirect To:', redirectTo);

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      Logger.verbose('signInSubmitForm', 'User not found');
      return redirectWithError('invalid_credentials');
    }

    const isValidPassword = await new Argon2id().verify(user.hashed_password, password);
    if (!isValidPassword) {
      Logger.verbose('signInSubmitForm', 'Invalid password');
      return redirectWithError('invalid_credentials');
    }

    Logger.verbose('signInSubmitForm', 'User authenticated successfully', user.id);
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await setSessionTokenCookie(token, expiresAt);
    await createSession(token, user.id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      Logger.error('signInSubmitForm', error);
      return redirectWithError('invalid_form_data');
    } else if (error instanceof Error) {
      Logger.error('signInSubmitForm', error);
    }

    redirectWithError('unknown_error');
  }
};
