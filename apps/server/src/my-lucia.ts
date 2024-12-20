import { Lucia, TimeSpan } from 'lucia';
import { Mysql2Adapter } from '@lucia-auth/adapter-mysql';
import { dbPool } from '@cerebro/db';
import { UserType } from '@cerebro/db/src/types.js';

const adapter = new Mysql2Adapter(dbPool, {
  user: 'user',
  session: 'user_session',
});

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, 'w'), // 2 weeks
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
    UserId: string;
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      type: UserType;
    };
  }

  // For some reason i need to duplicate this interface
  interface User {
    id: string;
    email: string;
    type: UserType;
  }
}
