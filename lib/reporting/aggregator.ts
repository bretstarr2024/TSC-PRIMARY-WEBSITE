/**
 * Dashboard data aggregator.
 * Fetches all sources in parallel and returns a unified overview.
 */

import type { DashboardOverview, TimePeriod } from './types';
import { getTrafficMetrics } from './sources/ga4-client';
import { getSearchMetrics } from './sources/gsc-client';
import { getAhrefsMetrics } from './sources/ahrefs-client';
import { getInternalMetrics } from './sources/internal-metrics';

export async function getDashboardOverview(period: TimePeriod): Promise<DashboardOverview> {
  const [traffic, search, ahrefs, internal] = await Promise.allSettled([
    getTrafficMetrics(period),
    getSearchMetrics(period),
    getAhrefsMetrics(period),
    getInternalMetrics(period),
  ]);

  return {
    period,
    generatedAt: new Date().toISOString(),
    traffic: traffic.status === 'fulfilled' ? traffic.value : null,
    search: search.status === 'fulfilled' ? search.value : null,
    ahrefs: ahrefs.status === 'fulfilled' ? ahrefs.value : null,
    internal: internal.status === 'fulfilled' ? internal.value : null,
  };
}
