'use client';

import { useEffect, useState, useCallback } from 'react';
import type { DashboardOverview, TimePeriod } from '@/lib/reporting/types';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { DataSourceStatus } from '@/components/dashboard/DataSourceStatus';
import { TrafficSection } from '@/components/dashboard/TrafficSection';
import { SearchSection } from '@/components/dashboard/SearchSection';
import { AhrefsSection } from '@/components/dashboard/AhrefsSection';
import { InternalSection } from '@/components/dashboard/InternalSection';

function SectionError({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
      <p className="text-sm text-[#6D6D69]">{title} — not configured or unavailable.</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-white/10 border-t-[#E1FF00] rounded-full animate-spin" />
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<TimePeriod>('30d');
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (p: TimePeriod) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/reporting/overview?period=${p}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(period); }, [period, load]);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white">Overview</h1>
          {data && (
            <p className="text-xs text-[#6D6D69] mt-1">
              Last updated {new Date(data.generatedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <PeriodSelector value={period} onChange={p => { setPeriod(p); }} />
          <button
            onClick={() => load(period)}
            disabled={loading}
            className="text-xs text-[#6D6D69] hover:text-white transition-colors disabled:opacity-40"
            title="Refresh"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && <Spinner />}

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content — 3 cols */}
          <div className="lg:col-span-3 space-y-12">
            {/* Internal always first — no API key needed */}
            {data.internal && !data.internal._health.error
              ? <InternalSection data={data.internal} />
              : <SectionError title="Internal Stats" />
            }

            <hr className="border-white/5" />

            {data.traffic && !data.traffic._health.error
              ? <TrafficSection data={data.traffic} />
              : <SectionError title="Google Analytics" />
            }

            <hr className="border-white/5" />

            {data.search && !data.search._health.error
              ? <SearchSection data={data.search} />
              : <SectionError title="Search Console" />
            }

            <hr className="border-white/5" />

            {data.ahrefs && !data.ahrefs._health.error
              ? <AhrefsSection data={data.ahrefs} />
              : <SectionError title="Ahrefs" />
            }
          </div>

          {/* Sidebar — 1 col */}
          <div className="lg:col-span-1 space-y-4">
            <DataSourceStatus data={data} />

            {/* Quick links */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Quick Links</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'GA4 Dashboard', href: 'https://analytics.google.com' },
                  { label: 'Search Console', href: 'https://search.google.com/search-console' },
                  { label: 'Ahrefs', href: 'https://app.ahrefs.com' },
                  { label: 'Vercel Analytics', href: 'https://vercel.com' },
                  { label: '← Back to site', href: '/' },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="block text-[#d1d1c6] hover:text-white transition-colors">
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
