/**
 * GET /api/dashboard/leads
 * Returns all leads. Dashboard-only — requires tsc_dash session cookie.
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

  const leads = await db
    .collection('leads')
    .find({}, { projection: { _id: 0, name: 1, email: 1, message: 1, source: 1, ctaId: 1, timestamp: 1 } })
    .sort({ timestamp: -1 })
    .limit(500)
    .toArray();

  return NextResponse.json({ leads, total: leads.length });
}
