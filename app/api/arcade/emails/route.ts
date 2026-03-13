/**
 * GET /api/arcade/emails
 * Returns all arcade plays where an email was captured.
 * Dashboard-only — requires tsc_dash session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyDashboardSession } from '@/lib/dashboard-auth';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  if (!await verifyDashboardSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDatabase();

  const plays = await db
    .collection('arcade_scores')
    .find(
      { email: { $exists: true, $nin: [null, ''] } },
      { projection: { _id: 0, email: 1, initials: 1, game: 1, score: 1, createdAt: 1 } }
    )
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return NextResponse.json({ plays, total: plays.length });
}
