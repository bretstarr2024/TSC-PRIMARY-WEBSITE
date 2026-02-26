/**
 * Shared cron route authentication.
 * Verifies CRON_SECRET via Bearer token in Authorization header.
 * Defaults to DENY when CRON_SECRET is not set.
 */

import { NextRequest } from 'next/server';

export function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('[Cron Auth] CRON_SECRET not set — denying request');
    return false;
  }
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}
