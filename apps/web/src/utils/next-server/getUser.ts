import { db } from '@cerebro/db';
import { cookies } from 'next/headers';
import { env } from '../env';
import { unstable_cacheLife as cacheLife } from 'next/cache';

export const getUserDb = async (authSession: string | undefined) => {
  'use cache';
  cacheLife('seconds');

  console.log('getUserDb', authSession);

  if (!authSession) {
    return null;
  }

  const user = await db
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
    .executeTakeFirstOrThrow();

  if (new Date(user.expires_at).getTime() < new Date().getTime()) {
    return null;
  }

  if (!env.IS_PROD) {
    // simulate delay
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return {
    id: user.user_id,
    email: user.email,
    type: user.type,
    expiresAt: user.expires_at,
  };
};

export const getUser = async () => {
  const _cookies = await cookies();
  return getUserDb(_cookies.get('auth_session')?.value);
};
