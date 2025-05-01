import { tryCatch } from '@/utils/tryCatch';
import { db, UserType } from '@cerebro/db';
import * as Sentry from '@sentry/nextjs';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type UiUserType = {
  id: string;
  email: string;
  type: UserType;
  expiresAt: Date;
};

// Little cache, just to avoid hitting db multiple times in the same request
export const getUserDb = async (authSession: string | undefined): Promise<null | UiUserType> => {
  'use cache';
  cacheLife('seconds');

  if (!authSession) {
    return null;
  }

  const { data: user, error } = await tryCatch(
    db
      .selectFrom('user_session')
      .innerJoin('user', 'user.id', 'user_session.user_id')
      .where('user_session.id', '=', authSession)
      .select([
        'user_session.user_id',
        'user_session.expires_at',
        'user.type',
        'user.id',
        'user.email',
      ])
      .executeTakeFirstOrThrow(),
  );

  if (error) {
    // TODO replace with pino logger
    console.log(error);
    Sentry.captureException(error);
    return null;
  }

  if (new Date(user.expires_at).getTime() < new Date().getTime()) {
    return null;
  }

  return { id: user.user_id, email: user.email, type: user.type, expiresAt: user.expires_at };
};

export const getUser = async () => {
  const _cookies = await cookies();

  return getUserDb(_cookies.get('auth_session')?.value);
};

export const requireUser = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/signin');
  }

  return user;
};
