/**
 * GA4 Data API client — pure fetch, no SDK.
 * Requires: GOOGLE_SERVICE_ACCOUNT_JSON, GA4_PROPERTY_ID (numeric, e.g. "123456789")
 */

import type { TrafficMetrics, TimePeriod } from '../types';
import { getCached, setCache, cacheKey } from '../cache';
import { getGoogleAccessToken } from './google-auth';

const GA4_SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
const BASE = 'https://analyticsdata.googleapis.com/v1beta/properties';

function dateRange(period: TimePeriod): { startDate: string; endDate: string } {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function prevDateRange(period: TimePeriod): { startDate: string; endDate: string } {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  end.setDate(end.getDate() - days);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function runReport(propertyId: string, token: string, body: object) {
  const res = await fetch(`${BASE}/${propertyId}:runReport`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GA4 API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getTrafficMetrics(period: TimePeriod): Promise<TrafficMetrics> {
  const key = cacheKey('ga4', period);
  const cached = getCached<TrafficMetrics>(key);
  if (cached) return cached;

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return { pageViews: 0, pageViewsChange: 0, visitors: 0, visitorsChange: 0, avgSessionDuration: 0, bounceRate: 0, topPages: [], sources: [], trend: [], _health: { configured: false } };
  }

  try {
    const token = await getGoogleAccessToken(GA4_SCOPES);
    const { startDate, endDate } = dateRange(period);
    const prev = prevDateRange(period);

    // Run all reports in parallel
    const [summary, prevSummary, pages, sources, trend] = await Promise.all([
      runReport(propertyId, token, {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),
      runReport(propertyId, token, {
        dateRanges: [{ startDate: prev.startDate, endDate: prev.endDate }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      }),
      runReport(propertyId, token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      runReport(propertyId, token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
        limit: 8,
      }),
      runReport(propertyId, token, {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ]);

    const row0 = summary.rows?.[0]?.metricValues ?? [];
    const prow0 = prevSummary.rows?.[0]?.metricValues ?? [];

    const pageViews = Number(row0[0]?.value ?? 0);
    const visitors = Number(row0[1]?.value ?? 0);
    const prevPageViews = Number(prow0[0]?.value ?? 0);
    const prevVisitors = Number(prow0[1]?.value ?? 0);

    const totalVisitors = sources.rows?.reduce((s: number, r: any) => s + Number(r.metricValues[0].value), 0) || 1;
    const topPages = (pages.rows ?? []).slice(0, 10).map((r: any) => ({
      path: r.dimensionValues[0].value,
      views: Number(r.metricValues[0].value),
      uniqueViews: Number(r.metricValues[1].value),
    }));
    const sourceList = (sources.rows ?? []).slice(0, 6).map((r: any) => {
      const v = Number(r.metricValues[0].value);
      return { source: r.dimensionValues[0].value, visitors: v, pct: Math.round((v / totalVisitors) * 100) };
    });
    const trendData = (trend.rows ?? []).map((r: any) => {
      const d = r.dimensionValues[0].value; // YYYYMMDD
      return {
        date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
        value: Number(r.metricValues[0].value),
        value2: Number(r.metricValues[1].value),
      };
    });

    const result: TrafficMetrics = {
      pageViews,
      pageViewsChange: prevPageViews ? Math.round(((pageViews - prevPageViews) / prevPageViews) * 100) : 0,
      visitors,
      visitorsChange: prevVisitors ? Math.round(((visitors - prevVisitors) / prevVisitors) * 100) : 0,
      avgSessionDuration: Number(row0[2]?.value ?? 0),
      bounceRate: Number(row0[3]?.value ?? 0),
      topPages,
      sources: sourceList,
      trend: trendData,
      _health: { configured: true },
    };

    setCache(key, result);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GA4]', msg);
    return { pageViews: 0, pageViewsChange: 0, visitors: 0, visitorsChange: 0, avgSessionDuration: 0, bounceRate: 0, topPages: [], sources: [], trend: [], _health: { configured: true, error: msg } };
  }
}
