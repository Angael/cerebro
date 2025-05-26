import { NextRequest, NextResponse } from 'next/server';
import { refreshSession } from './middleware/refreshSession';

export function middleware(request: NextRequest) {
  const fullUrl = request.url;
  const response = NextResponse.next();
  response.headers.set('x-url', fullUrl);

  refreshSession(request, response);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
