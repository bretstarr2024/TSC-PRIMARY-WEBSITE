import { NextResponse } from 'next/server';
import { DASHBOARD_COOKIE } from '@/lib/dashboard-auth';

export function GET() {
  const res = NextResponse.redirect(new URL('/dashboard/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  res.cookies.delete(DASHBOARD_COOKIE);
  return res;
}
