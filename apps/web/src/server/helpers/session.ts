'use server';
import { env } from '@/utils/env';
import { db } from '@cerebro/db';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { cookies } from 'next/headers';
import { Logger } from '@/utils/logger';

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface User {
  id: string;
}

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.IS_PROD,
    expires: expiresAt,
    path: '/',
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.IS_PROD,
    maxAge: 0,
    path: '/',
  });
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  await db
    .insertInto('user_session')
    .values({ id: session.id, user_id: session.userId, expires_at: session.expiresAt });

  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  Logger.verbose('validateSessionToken', 'Generated sessionId', sessionId);
  const row = await db
    .selectFrom('user_session')
    .innerJoin('user', 'user.id', 'user_session.user_id')
    .select([
      'user_session.id as sessionId',
      'user_session.user_id as sessionUserId',
      'user_session.expires_at',
      'user.id as userId',
    ])
    .where('user_session.id', '=', sessionId)
    .executeTakeFirst();
  Logger.verbose('validateSessionToken', 'DB query result', row);

  if (!row) {
    Logger.info('validateSessionToken', 'No session found for sessionId', sessionId);
    return { session: null, user: null };
  }
  const session: Session = {
    id: row.sessionId,
    userId: row.sessionUserId,
    expiresAt: row.expires_at,
  };
  Logger.verbose('validateSessionToken', 'Session object created', session);

  const user: User = {
    id: row.userId,
  };
  Logger.verbose('validateSessionToken', 'User object created', user);

  if (Date.now() >= session.expiresAt.getTime()) {
    Logger.info('validateSessionToken', 'Session expired, deleting session', session.id);
    await db.deleteFrom('user_session').where('id', '=', session.id).execute();
    Logger.verbose('validateSessionToken', 'Session deleted from DB', session.id);
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    Logger.info('validateSessionToken', 'Session expiring soon, extending expiration', session.id);
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .updateTable('user_session')
      .set('expires_at', session.expiresAt)
      .where('id', '=', session.id)
      .execute();
    Logger.verbose(
      'validateSessionToken',
      'Session expiration updated in DB',
      session.id,
      session.expiresAt,
    );
  }

  Logger.info('validateSessionToken', 'Session and user validated', session, user);
  return { session, user };
}
