import { Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { dbPool } from '@cerebro/db';
import { UserType } from '@cerebro/db/src/types.js';

const adapter = new Mysql2Adapter(dbPool, {
  user: 'user',
  session: 'user_session',
});

export const lucia = new Lucia(adapter, {
  // Express js uses ms, and it should be seconds, so we need 1000 fix
  sessionExpiresIn: new TimeSpan(2 * 1000, 'w'), // 2 weeks
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  // Map stuff from user table to user object
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      type: attributes.type,
    };
  },
});

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: number;
      email: string;
      type: UserType;
    };
  }
}
