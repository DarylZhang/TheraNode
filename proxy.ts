import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/resonance',
  '/studio',
  '/community',
  '/whiteboard',
  '/playspace',
  '/records',
  '/membership',
];

const AUTH_PREFIXES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // accessToken cookie is written by saveTokens() on the client side
  const token = request.cookies.get('accessToken')?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const from = request.nextUrl.searchParams.get('from');
    const dest = from && from.startsWith('/') ? from : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/resonance/:path*',
    '/studio/:path*',
    '/community/:path*',
    '/whiteboard/:path*',
    '/playspace/:path*',
    '/records/:path*',
    '/membership/:path*',
    '/login',
    '/register',
  ],
};
