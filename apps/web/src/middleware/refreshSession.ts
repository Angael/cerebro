import { SESSION_DURATION_SECONDS } from '@/server/helpers/session';
import { clientEnv } from '@/utils/clientEnv';
import { serverEnv } from '@/utils/serverEnv';
import { NextRequest, NextResponse } from 'next/server';

export const refreshSession = (request: NextRequest, response: NextResponse) => {
  // Only extend cookie expiration on GET requests since we can be sure
  // a new auth_session wasn't set when handling the request.
  if (request.method !== 'GET') {
    return;
  }

  const auth_session = request.cookies.get('auth_session');
  if (!auth_session?.value) {
    return;
  }

  // Extend the session cookie always, it's impossible to check cookie age on server.
  response.cookies.set('auth_session', auth_session.value, {
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
    sameSite: 'lax',
    httpOnly: true,
    secure: clientEnv.IS_PROD,
    domain: serverEnv.AUTH_COOKIE_DOMAIN,
  });
};
