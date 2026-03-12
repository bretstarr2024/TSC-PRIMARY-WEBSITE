'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrafficMetrics } from '@/lib/reporting/types';
import { MetricsCard } from './MetricsCard';

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}m ${s}s`;
}

interface Props { data: TrafficMetrics }

export function TrafficSection({ data }: Props) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Traffic</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard title="Page Views" value={data.pageViews.toLocaleString()} change={data.pageViewsChange} />
        <MetricsCard title="Visitors" value={data.visitors.toLocaleString()} change={data.visitorsChange} accent="#73F5FF" />
        <MetricsCard title="Avg Session" value={formatDuration(data.avgSessionDuration)} accent="#ED0AD2" />
        <MetricsCard title="Bounce Rate" value={`${Math.round(data.bounceRate * 100)}%`} accent="#FF5910" />
      </div>

      {data.trend.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Daily Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.trend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6D6D69', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={d => d.slice(5)}
              />
              <YAxis tick={{ fill: '#6D6D69', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#d1d1c6' }}
              />
              <Line type="monotone" dataKey="value" name="Page Views" stroke="#E1FF00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value2" name="Visitors" stroke="#73F5FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.topPages.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Top Pages</p>
            <div className="space-y-2">
              {data.topPages.slice(0, 8).map(p => (
                <div key={p.path} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#d1d1c6] truncate flex-1" title={p.path}>{p.path}</span>
                  <span className="text-sm text-white font-medium shrink-0">{p.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.sources.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Traffic Sources</p>
            <div className="space-y-3">
              {data.sources.map(s => (
                <div key={s.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#d1d1c6]">{s.source}</span>
                    <span className="text-white">{s.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div className="h-1 rounded-full bg-[#E1FF00]" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
