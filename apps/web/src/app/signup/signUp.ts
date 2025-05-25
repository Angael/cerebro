'use server';

import { getUrl } from '@/server/helpers/getUrl';
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from '@/server/helpers/session';
import { Logger } from '@/utils/logger';
import { db } from '@cerebro/db';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';
import { SignInErrorCode, zSignInForm } from '../signin/signInUtils';
import { nanoid } from 'nanoid';

const redirectWithError = async (errorCode: SignInErrorCode) => {
  const searchParams = new URL(await getUrl()).searchParams;
  searchParams.set('errorCode', errorCode);
  return redirect('/signin?' + searchParams.toString());
};

// This needs to be submitted using a Form, because what if hydration happens too late?
export const signUpSubmitForm = async (formData: FormData) => {
  try {
    const parsedData = zSignInForm.parse(Object.fromEntries(formData.entries()));
    const { email, password, redirectTo } = parsedData;

    const hashedPassword = await new Argon2id().hash(password);
    const userId = nanoid();

    const userExists = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (userExists) {
      Logger.verbose('signUpSubmitForm', 'Email taken');
      return redirectWithError('email_taken');
    }

    await db
      .insertInto('user')
      .values({ id: userId, type: 'FREE', email, hashed_password: hashedPassword })
      .execute();

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

    await setSessionTokenCookie(token, expiresAt);
    await createSession(token, userId);

    Logger.info('signUpSubmitForm', 'User signed up successfully', userId);

    redirect(redirectTo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      Logger.error('signUpSubmitForm', error);
      return redirectWithError('invalid_form_data');
    } else if (error instanceof Error) {
      if (error.message === 'NEXT_REDIRECT') {
        throw error; // rethrow to let Next.js handle the redirect
      }

      Logger.error('signUpSubmitForm', error);
    } else {
      Logger.error('signUpSubmitForm', 'Unknown error occurred');
    }

    return redirectWithError('unknown_error');
  }
};
