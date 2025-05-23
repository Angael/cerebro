import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const fullUrl = request.url;  
  const response = NextResponse.next();
  response.headers.set('x-url', fullUrl);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
