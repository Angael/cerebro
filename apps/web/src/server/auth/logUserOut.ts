'use server';
import { db } from '@cerebro/db';
import { cookies } from 'next/headers';
import { deleteSessionTokenCookie, getSessionIdFromToken } from '../helpers/session';

export const logUserOut = async (): Promise<void> => {
  const auth_token = (await cookies()).get('auth_session');

  if (!auth_token) {
    return;
  }

  const sessionId = getSessionIdFromToken(auth_token.value);
  deleteSessionTokenCookie();
  await db.deleteFrom('user_session').where('id', '=', sessionId).execute();
};
