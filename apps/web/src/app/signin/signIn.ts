'use server';
import { getUrl } from '@/server/helpers/getUrl';
import { Logger } from '@/utils/logger';
import { db } from '@cerebro/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Argon2id } from 'oslo/password';

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
      return redirectWithError('invalid_credentials');
    }

    const isValidPassword = await new Argon2id().verify(user.hashed_password, password);
    if (!isValidPassword) {
      return redirectWithError('invalid_credentials');
    }
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
