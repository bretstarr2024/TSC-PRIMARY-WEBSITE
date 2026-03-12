'use client';

import type { InternalMetrics } from '@/lib/reporting/types';
import { MetricsCard } from './MetricsCard';

interface Props { data: InternalMetrics }

const STATUS_COLORS: Record<string, string> = {
  pending: '#6D6D69',
  generating: '#E1FF00',
  published: '#73F5FF',
  failed: '#FF5910',
};

export function InternalSection({ data }: Props) {
  const totalPublished = data.content.reduce((s, c) => s + c.published, 0);
  const totalThisPeriod = data.content.reduce((s, c) => s + c.thisPeriod, 0);

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Internal Stats</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard title="Total Leads" value={data.leads.total.toLocaleString()} subtext={`+${data.leads.thisPeriod} this period`} accent="#E1FF00" />
        <MetricsCard title="Published Content" value={totalPublished.toLocaleString()} subtext={`+${totalThisPeriod} this period`} accent="#73F5FF" />
        <MetricsCard title="Pipeline Queue" value={data.pipeline.pending + data.pipeline.generating} subtext={`${data.pipeline.pending} pending · ${data.pipeline.generating} generating`} accent="#ED0AD2" />
        <MetricsCard title="Published (Pipeline)" value={data.pipeline.published} subtext={`${data.pipeline.failed} failed this period`} accent="#FF5910" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads by source */}
        {data.leads.bySource.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Leads by Source (this period)</p>
            <div className="space-y-3">
              {data.leads.bySource.map(s => {
                const pct = Math.round((s.count / data.leads.thisPeriod) * 100) || 0;
                return (
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#d1d1c6] capitalize">{s.source || 'Unknown'}</span>
                      <span className="text-white">{s.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10">
                      <div className="h-1 rounded-full bg-[#E1FF00]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content counts */}
        {data.content.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Content Library</p>
            <div className="space-y-2">
              {data.content.filter(c => c.total > 0).map(c => (
                <div key={c.type} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#d1d1c6]">{c.label}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    {c.thisPeriod > 0 && (
                      <span className="text-xs text-[#73F5FF]">+{c.thisPeriod}</span>
                    )}
                    <span className="text-sm text-white font-medium">{c.published.toLocaleString()}</span>
                    <span className="text-xs text-[#6D6D69]">/{c.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pipeline status */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Pipeline Status</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-xs text-[#d1d1c6] capitalize">{status}</span>
              <span className="text-sm font-medium text-white ml-1">
                {data.pipeline[status as keyof typeof data.pipeline]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
