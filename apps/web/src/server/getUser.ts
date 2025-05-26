import { Logger } from '@/utils/logger';
import { tryCatch } from '@/utils/tryCatch';
import { UserType } from '@cerebro/db';
import * as Sentry from '@sentry/nextjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { validateSessionToken } from './helpers/session';

export type UserSession = {
  id: string;
  email: string;
  type: UserType;
  expiresAt: Date;
};

// Little cache, just to avoid hitting db multiple times in the same request
const getUserDb = cache(async (): Promise<null | UserSession> => {
  const _cookies = await cookies();
  const authSession = _cookies.get('auth_session')?.value;

  if (!authSession) {
    return null;
  }

  const { data: user, error } = await tryCatch(validateSessionToken(authSession));

  if (!user) {
    Logger.verbose('getUserDb', 'No user found for session', authSession);
    return null;
  }

  if (error) {
    Logger.error('getUserDb', error);
    return null;
  }

  return { id: user.id, email: user.email, type: user.type, expiresAt: user.expiresAt };
});

export const getUser = async () => {
  return Sentry.startSpan({ name: 'SF_getUser', op: 'db' }, () => getUserDb());
};

export const requireUser = async () => {
  const user = await getUser();

  if (!user) {
    const url = (await headers()).get('x-url');
    redirect('/signin?redirectTo=' + encodeURIComponent(url || '/'));
  }

  return user;
};
