import { NextRequest, NextResponse } from 'next/server';
import { env } from './utils/env';

export function middleware(request: NextRequest) {
  const fullUrl = request.url;
  const response = NextResponse.next();
  response.headers.set('x-url', fullUrl);

  // Refresh session cookie
  if (request.method === 'GET') {
    const response = NextResponse.next();
    const token = request.cookies.get('auth_session')?.value ?? null;
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new auth_session wasn't set when handling the request.
      response.cookies.set('auth_session', token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        httpOnly: true,
        secure: env.IS_PROD,
      });
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
