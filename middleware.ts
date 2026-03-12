import { NextRequest, NextResponse } from 'next/server';
import { verifyDashboardSession } from '@/lib/dashboard-auth';

const PROTECTED = /^\/dashboard(?!\/login)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PROTECTED.test(pathname)) {
    // Allow the API reporting routes through (they do their own auth check)
    if (pathname.startsWith('/api/')) return NextResponse.next();

    if (!verifyDashboardSession(request)) {
      const login = new URL('/dashboard/login', request.url);
      login.searchParams.set('from', pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
