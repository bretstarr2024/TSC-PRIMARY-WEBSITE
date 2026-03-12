/**
 * TypeScript types for the TSC reporting dashboard.
 * Core sources: GA4, GSC, Ahrefs, Internal (MongoDB)
 */

export type TimePeriod = '7d' | '30d' | '90d';

export interface DataSourceHealth {
  configured: boolean;
  error?: string;
}

/* ── GA4 ── */
export interface DailyMetric {
  date: string;
  value: number;
  value2?: number;
}

export interface TopPage {
  path: string;
  views: number;
  uniqueViews: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  pct: number;
}

export interface TrafficMetrics {
  pageViews: number;
  pageViewsChange: number;
  visitors: number;
  visitorsChange: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: TopPage[];
  sources: TrafficSource[];
  trend: DailyMetric[];      // date, pageViews, visitors
  _health: DataSourceHealth;
}

/* ── Google Search Console ── */
export interface TopQuery {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface SearchMetrics {
  impressions: number;
  impressionsChange: number;
  clicks: number;
  clicksChange: number;
  ctr: number;
  avgPosition: number;
  topQueries: TopQuery[];
  topPages: TopPage[];
  trend: DailyMetric[];      // date, impressions, clicks
  _health: DataSourceHealth;
}

/* ── Ahrefs ── */
export interface AhrefsBacklinkStats {
  total: number;
  live: number;
  dofollow: number;
  nofollow: number;
  newThisPeriod: number;
  lostThisPeriod: number;
}

export interface TopReferringDomain {
  domain: string;
  dr: number;
  backlinks: number;
  dofollow: boolean;
}

export interface TopBacklink {
  url: string;
  dr: number;
  anchor: string;
  firstSeen: string;
}

export interface AhrefsMetrics {
  domainRating: number;
  domainRatingChange: number;
  ahrefsRank: number;
  backlinks: AhrefsBacklinkStats;
  referringDomains: number;
  referringDomainsChange: number;
  organicKeywords: number;
  organicTraffic: number;
  organicValue: number;
  topReferringDomains: TopReferringDomain[];
  topBacklinks: TopBacklink[];
  drTrend: DailyMetric[];
  _health: DataSourceHealth;
}

/* ── Internal (MongoDB) ── */
export interface ContentTypeStat {
  type: string;
  label: string;
  total: number;
  published: number;
  thisPeriod: number;
}

export interface LeadStat {
  source: string;
  count: number;
}

export interface PipelineStat {
  pending: number;
  generating: number;
  published: number;
  failed: number;
  totalThisPeriod: number;
}

export interface InternalMetrics {
  leads: {
    total: number;
    thisPeriod: number;
    bySource: LeadStat[];
  };
  content: ContentTypeStat[];
  pipeline: PipelineStat;
  _health: DataSourceHealth;
}

/* ── Aggregated overview ── */
export interface DashboardOverview {
  period: TimePeriod;
  generatedAt: string;
  traffic: TrafficMetrics | null;
  search: SearchMetrics | null;
  ahrefs: AhrefsMetrics | null;
  internal: InternalMetrics | null;
}
