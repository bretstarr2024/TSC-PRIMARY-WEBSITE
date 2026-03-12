/**
 * Simple password auth for the /dashboard route.
 * Cookie: tsc_dash — value is SHA-256 hex of the dashboard password.
 */

import crypto from 'node:crypto';
import { NextRequest } from 'next/server';

const COOKIE = 'tsc_dash';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyDashboardSession(request: NextRequest): boolean {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) return false;
  const cookie = request.cookies.get(COOKIE)?.value;
  return cookie === hashPassword(expected);
}

export { COOKIE as DASHBOARD_COOKIE };
