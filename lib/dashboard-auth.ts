/**
 * Simple password auth for the /dashboard route.
 * Cookie: tsc_dash — value is SHA-256 hex of the dashboard password.
 */

import { NextRequest } from 'next/server';

const COOKIE = 'tsc_dash';

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyDashboardSession(request: NextRequest): Promise<boolean> {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return false;
  const cookie = request.cookies.get(COOKIE)?.value;
  if (!cookie) return false;
  return cookie === await hashPassword(expected);
}

export { COOKIE as DASHBOARD_COOKIE };
