import { Request } from 'express';
import { lucia } from '@/lucia.js';
import type { Session, User } from 'lucia';

// Define the function that retrieves the return type of getStuff
type UnwrappedReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : never;

// TODO rename to not use hook like name?
export const useOptionalSession = async (req: Request): ReturnType<typeof lucia.validateSession> => {
  // Optimization to not query db twice
  const { user, session } = req as any;
  if (user && session) {
    return { user, session };
  } else {
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');
    const { user, session } = await lucia.validateSession(sessionId ?? '');

    if (user && session) {
      // Save to req for optimization
      (req as any).user = user;
      (req as any).session = session;

      return { user, session };
    } else {
      return { user: null, session: null };
    }
  }
};
