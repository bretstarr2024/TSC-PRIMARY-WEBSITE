'use client';

import type { DashboardOverview } from '@/lib/reporting/types';

interface Props { data: DashboardOverview | null; }

function dot(configured: boolean | undefined, error: string | undefined) {
  if (!configured) return <span className="w-2 h-2 rounded-full bg-[#444] inline-block" title="Not configured" />;
  if (error) return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" title={error} />;
  return <span className="w-2 h-2 rounded-full bg-[#73F5FF] inline-block" />;
}

export function DataSourceStatus({ data }: Props) {
  const sources = [
    { label: 'Google Analytics', health: data?.traffic?._health },
    { label: 'Search Console',   health: data?.search?._health },
    { label: 'Ahrefs',           health: data?.ahrefs?._health },
    { label: 'Internal (DB)',    health: data?.internal?._health },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Data Sources</p>
      <div className="space-y-3">
        {sources.map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-sm text-[#d1d1c6]">{s.label}</span>
            <div className="flex items-center gap-2">
              {s.health?.error && (
                <span className="text-xs text-red-400 max-w-[140px] truncate" title={s.health.error}>
                  {s.health.error.slice(0, 30)}…
                </span>
              )}
              {dot(s.health?.configured, s.health?.error)}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#444] mt-4">Cached · refreshes every 15 min</p>
    </div>
  );
}
