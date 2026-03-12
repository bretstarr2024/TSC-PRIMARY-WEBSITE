/**
 * GET /api/reporting/overview?period=7d|30d|90d
 * Protected: requires valid dashboard session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardOverview } from '@/lib/reporting/aggregator';
import type { TimePeriod } from '@/lib/reporting/types';
import { verifyDashboardSession } from '@/lib/dashboard-auth';

export async function GET(request: NextRequest) {
  if (!verifyDashboardSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const period = (request.nextUrl.searchParams.get('period') || '30d') as TimePeriod;
  const valid: TimePeriod[] = ['7d', '30d', '90d'];
  const safePeriod = valid.includes(period) ? period : '30d';

  try {
    const overview = await getDashboardOverview(safePeriod);
    return NextResponse.json(overview);
  } catch (err) {
    console.error('[Dashboard overview]', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
