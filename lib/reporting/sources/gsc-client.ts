/**
 * Google Search Console client — pure fetch, no SDK.
 * Requires: GOOGLE_SERVICE_ACCOUNT_JSON, GSC_SITE_URL (e.g. "https://example.com/")
 */

import type { SearchMetrics, TimePeriod } from '../types';
import { getCached, setCache, cacheKey } from '../cache';
import { getGoogleAccessToken } from './google-auth';

const GSC_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const BASE = 'https://searchconsole.googleapis.com/webmasters/v3/sites';

function dateRange(period: TimePeriod): { start: string; end: string; prevStart: string; prevEnd: string } {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const end = new Date();
  // GSC data has ~2 day lag
  end.setDate(end.getDate() - 2);
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    prevStart: prevStart.toISOString().slice(0, 10),
    prevEnd: prevEnd.toISOString().slice(0, 10),
  };
}

async function query(siteUrl: string, token: string, body: object) {
  const encoded = encodeURIComponent(siteUrl);
  const res = await fetch(`${BASE}/${encoded}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GSC API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getSearchMetrics(period: TimePeriod): Promise<SearchMetrics> {
  const key = cacheKey('gsc', period);
  const cached = getCached<SearchMetrics>(key);
  if (cached) return cached;

  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) {
    return { impressions: 0, impressionsChange: 0, clicks: 0, clicksChange: 0, ctr: 0, avgPosition: 0, topQueries: [], topPages: [], trend: [], _health: { configured: false } };
  }

  try {
    const token = await getGoogleAccessToken(GSC_SCOPES);
    const { start, end, prevStart, prevEnd } = dateRange(period);

    const [summary, prevSummary, queries, pages, trend] = await Promise.all([
      query(siteUrl, token, { startDate: start, endDate: end, dimensions: [] }),
      query(siteUrl, token, { startDate: prevStart, endDate: prevEnd, dimensions: [] }),
      query(siteUrl, token, { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 25, orderBy: [{ fieldName: 'impressions', sortOrder: 'DESCENDING' }] }),
      query(siteUrl, token, { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 15, orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }] }),
      query(siteUrl, token, { startDate: start, endDate: end, dimensions: ['date'], rowLimit: 90 }),
    ]);

    const s0 = summary.rows?.[0] ?? {};
    const p0 = prevSummary.rows?.[0] ?? {};

    const impressions = s0.impressions ?? 0;
    const clicks = s0.clicks ?? 0;
    const prevImpressions = p0.impressions ?? 0;
    const prevClicks = p0.clicks ?? 0;

    const result: SearchMetrics = {
      impressions,
      impressionsChange: prevImpressions ? Math.round(((impressions - prevImpressions) / prevImpressions) * 100) : 0,
      clicks,
      clicksChange: prevClicks ? Math.round(((clicks - prevClicks) / prevClicks) * 100) : 0,
      ctr: Math.round((s0.ctr ?? 0) * 1000) / 10,
      avgPosition: Math.round((s0.position ?? 0) * 10) / 10,
      topQueries: (queries.rows ?? []).slice(0, 25).map((r: any) => ({
        query: r.keys[0],
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: Math.round(r.ctr * 1000) / 10,
        position: Math.round(r.position * 10) / 10,
      })),
      topPages: (pages.rows ?? []).slice(0, 15).map((r: any) => ({
        path: new URL(r.keys[0]).pathname,
        views: r.impressions,
        uniqueViews: r.clicks,
      })),
      trend: (trend.rows ?? []).map((r: any) => ({
        date: r.keys[0],
        value: r.impressions,
        value2: r.clicks,
      })),
      _health: { configured: true },
    };

    setCache(key, result);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GSC]', msg);
    return { impressions: 0, impressionsChange: 0, clicks: 0, clicksChange: 0, ctr: 0, avgPosition: 0, topQueries: [], topPages: [], trend: [], _health: { configured: true, error: msg } };
  }
}
