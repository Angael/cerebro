import { parseCookies } from 'oslo/cookie';
import { MyContext } from '@/routes/honoFactory';
import { db } from '@cerebro/db';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

// Simplified copy of validateSessionToken in next web app
export const optionalSession = async (c: MyContext) => {
  // Optimization to not query db twice
  const user = c.get('user');
  const session = c.get('session');

  if (user && session) {
    return { user, session };
  } else {
    const cookies = parseCookies(c.req.header('cookie') ?? '');
    const authSession = cookies.get('auth_session');

    if (!authSession) {
      return { user: null, session: null };
    }

    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(authSession)));

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
      return { user: null, session: null };
    }

    const session = {
      id: row.sessionId,
      userId: row.sessionUserId,
      expiresAt: row.expires_at,
      fresh: true, // idk what this is, we don't use it here
    };
    const user = {
      id: row.userId,
      email: row.email,
      type: row.type,
    };

    if (Date.now() >= session.expiresAt.getTime()) {
      await db.deleteFrom('user_session').where('id', '=', session.id).execute();
      return { user: null, session: null };
    }

    if (user && session) {
      c.set('user', user);
      c.set('session', session);

      return { user, session };
    } else {
      return { user: null, session: null };
    }
  }
};
