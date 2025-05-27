import { clientEnv } from '@/utils/clientEnv';
import { db } from '@cerebro/db';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { cookies } from 'next/headers';
import { Logger } from '@/utils/logger';
import { UserSession } from '../getUser';
import { serverEnv } from '@/utils/serverEnv';

export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days
export const SESSION_SLIDING_EXPIRATION_WINDOW_SECONDS = SESSION_DURATION_SECONDS / 2; // 15 days

export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000; // 30 days
export const SESSION_SLIDING_EXPIRATION_WINDOW_MS = SESSION_DURATION_MS / 2; // 15 days

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
  cookieStore.set('auth_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: clientEnv.IS_PROD,
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
    domain: serverEnv.AUTH_COOKIE_DOMAIN,
  });
}

// For logout.
// Unfortunately middleware cannot use cookies api, and server component cannot delete cookie
export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: clientEnv.IS_PROD,
    maxAge: 0,
    path: '/',
    domain: serverEnv.AUTH_COOKIE_DOMAIN,
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
    .values({ id: session.id, user_id: session.userId, expires_at: session.expiresAt })
    .execute();

  return session;
}

async function removeAllExpiredSessions() {
  const now = new Date(Date.now()); // 30 days ago
  await db.deleteFrom('user_session').where('expires_at', '<', now).execute();
}

export async function validateSessionToken(token: string): Promise<UserSession | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const row = await db
    .selectFrom('user_session')
    .innerJoin('user', 'user.id', 'user_session.user_id')
    .where('user_session.id', '=', sessionId)
    .select([
      'user_session.id as sessionId',
      'user_session.user_id as sessionUserId',
      'user_session.expires_at',
      'user.id as userId',
      'user.type',
      'user.email',
    ])
    .executeTakeFirst();

  if (!row) {
    Logger.info('validateSessionToken', 'No session found for sessionId');
    return null;
  }

  const session: Session = {
    id: row.sessionId,
    userId: row.sessionUserId,
    expiresAt: row.expires_at,
  };

  const user: User = {
    id: row.userId,
  };

  // Check if session is expired
  if (Date.now() >= session.expiresAt.getTime()) {
    Logger.info('validateSessionToken', 'Session expired, deleting all expired sessions');
    // not great preformance, but my scale is not that big
    await removeAllExpiredSessions();
    return null;
  }

  // If session is expiring soon, extend it
  if (Date.now() >= session.expiresAt.getTime() - SESSION_SLIDING_EXPIRATION_WINDOW_MS) {
    Logger.info('validateSessionToken', 'Session expiring soon, extending expiration');
    session.expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await Promise.all([
      db
        .updateTable('user_session')
        .set('expires_at', session.expiresAt)
        .where('id', '=', session.id)
        .execute(),
      removeAllExpiredSessions(),
    ]);
  }

  return {
    id: user.id,
    email: row.email,
    type: row.type,
    expiresAt: session.expiresAt,
  } as UserSession;
}
