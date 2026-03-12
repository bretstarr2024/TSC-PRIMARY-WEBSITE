/**
 * Ahrefs API v3 client — pure fetch.
 * Requires: AHREFS_API_KEY, AHREFS_TARGET (domain, e.g. "thestarrconspiracy.com")
 */

import type { AhrefsMetrics, TimePeriod } from '../types';
import { getCached, setCache, cacheKey } from '../cache';

const BASE = 'https://api.ahrefs.com/v3';

function get(path: string, params: Record<string, string>, token: string) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    next: { revalidate: 0 },
  }).then(async r => {
    if (!r.ok) throw new Error(`Ahrefs ${path} error ${r.status}: ${await r.text()}`);
    return r.json();
  });
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export async function getAhrefsMetrics(period: TimePeriod): Promise<AhrefsMetrics> {
  const key = cacheKey('ahrefs', period);
  const cached = getCached<AhrefsMetrics>(key);
  if (cached) return cached;

  const token = process.env.AHREFS_API_KEY;
  const target = process.env.AHREFS_TARGET;

  if (!token || !target) {
    return {
      domainRating: 0, domainRatingChange: 0, ahrefsRank: 0,
      backlinks: { total: 0, live: 0, dofollow: 0, nofollow: 0, newThisPeriod: 0, lostThisPeriod: 0 },
      referringDomains: 0, referringDomainsChange: 0,
      organicKeywords: 0, organicTraffic: 0, organicValue: 0,
      topReferringDomains: [], topBacklinks: [], drTrend: [],
      _health: { configured: false },
    };
  }

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const today = todayStr();
  const periodStart = daysAgoStr(days);
  const prevPeriodStart = daysAgoStr(days * 2);

  try {
    const [dr, drPrev, bstats, refs, refsPrev, topDomains] = await Promise.all([
      get('/site-explorer/domain-rating', { target, date: today, output: 'json' }, token),
      get('/site-explorer/domain-rating', { target, date: periodStart, output: 'json' }, token),
      get('/site-explorer/backlinks-stats', { target, mode: 'domain', date: today, output: 'json' }, token),
      get('/site-explorer/refdomains-history', { target, mode: 'domain', date_from: periodStart, date_to: today, output: 'json' }, token),
      get('/site-explorer/refdomains-history', { target, mode: 'domain', date_from: prevPeriodStart, date_to: periodStart, output: 'json' }, token),
      get('/site-explorer/refdomains', { target, mode: 'domain', output: 'json', limit: '10', select: 'domain,domain_rating,links_to_target,dofollow_links' }, token).catch(() => ({ refdomains: [] })),
    ]);

    const currentDR = dr.domain_rating?.domain_rating ?? 0;
    const prevDR = drPrev.domain_rating?.domain_rating ?? 0;
    const bsData = bstats.metrics ?? {};
    const currentRefs = refs.refdomains?.slice(-1)?.[0]?.refdomains ?? 0;
    const prevRefsVal = refsPrev.refdomains?.slice(-1)?.[0]?.refdomains ?? 0;

    const drTrend = (refs.refdomains ?? []).map((h: any) => ({
      date: typeof h.date === 'string' ? h.date.slice(0, 10) : h.date,
      value: h.refdomains ?? 0,
    }));

    const liveBacklinks = bsData.live ?? 0;
    const allBacklinks = bsData.all_time ?? 0;
    const liveRefs = bsData.live_refdomains ?? currentRefs;

    const result: AhrefsMetrics = {
      domainRating: currentDR,
      domainRatingChange: Math.round((currentDR - prevDR) * 10) / 10,
      ahrefsRank: dr.domain_rating?.ahrefs_rank ?? 0,
      backlinks: {
        total: allBacklinks,
        live: liveBacklinks,
        dofollow: 0,
        nofollow: 0,
        newThisPeriod: bsData.new ?? 0,
        lostThisPeriod: bsData.lost ?? 0,
      },
      referringDomains: liveRefs,
      referringDomainsChange: prevRefsVal ? Math.round(((liveRefs - prevRefsVal) / prevRefsVal) * 100) : 0,
      organicKeywords: 0,
      organicTraffic: 0,
      organicValue: 0,
      topReferringDomains: (topDomains.refdomains ?? []).slice(0, 10).map((d: any) => ({
        domain: d.domain ?? '',
        dr: Math.round(d.domain_rating ?? 0),
        backlinks: d.links_to_target ?? 0,
        dofollow: d.dofollow_links > 0,
      })),
      topBacklinks: [],
      drTrend,
      _health: { configured: true },
    };

    setCache(key, result);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Ahrefs]', msg);
    return {
      domainRating: 0, domainRatingChange: 0, ahrefsRank: 0,
      backlinks: { total: 0, live: 0, dofollow: 0, nofollow: 0, newThisPeriod: 0, lostThisPeriod: 0 },
      referringDomains: 0, referringDomainsChange: 0,
      organicKeywords: 0, organicTraffic: 0, organicValue: 0,
      topReferringDomains: [], topBacklinks: [], drTrend: [],
      _health: { configured: true, error: msg },
    };
  }
}
