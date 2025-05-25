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
import { SignInErrorCode, zSignInForm } from './signInUtils';

const redirectWithError = async (errorCode: SignInErrorCode) => {
  const searchParams = new URL(await getUrl()).searchParams;
  searchParams.set('errorCode', errorCode);
  return redirect('/signin?' + searchParams.toString());
};

// This needs to be submitted using a Form, because what if hydration happens too late?
export const signInSubmitForm = async (formData: FormData) => {
  try {
    const parsedData = zSignInForm.parse(Object.fromEntries(formData.entries()));

    const { email, password, redirectTo } = parsedData;

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

    redirect(redirectTo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      Logger.error('signInSubmitForm', error);
      return redirectWithError('invalid_form_data');
    } else if (error instanceof Error) {
      if (error.message === 'NEXT_REDIRECT') {
        throw error; // rethrow to let Next.js handle the redirect
      }

      Logger.error('signInSubmitForm', error);
    } else {
      Logger.error('signInSubmitForm', 'Unknown error occurred');
    }

    return redirectWithError('unknown_error');
  }
};
