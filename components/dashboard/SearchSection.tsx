'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { SearchMetrics } from '@/lib/reporting/types';
import { MetricsCard } from './MetricsCard';

interface Props { data: SearchMetrics }

export function SearchSection({ data }: Props) {
  const [showAll, setShowAll] = useState(false);
  const queries = showAll ? data.topQueries : data.topQueries.slice(0, 10);

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Search Console</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard title="Impressions" value={data.impressions.toLocaleString()} change={data.impressionsChange} />
        <MetricsCard title="Clicks" value={data.clicks.toLocaleString()} change={data.clicksChange} accent="#73F5FF" />
        <MetricsCard title="CTR" value={`${data.ctr}%`} accent="#ED0AD2" />
        <MetricsCard title="Avg Position" value={data.avgPosition} subtext="Lower is better" accent="#FF5910" />
      </div>

      {data.trend.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Impressions & Clicks</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.trend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#6D6D69', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: '#6D6D69', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#d1d1c6' }} />
              <Line type="monotone" dataKey="value" name="Impressions" stroke="#E1FF00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="value2" name="Clicks" stroke="#73F5FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.topQueries.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Top Queries</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#6D6D69]">
                  <th className="pb-3 font-medium">Query</th>
                  <th className="pb-3 font-medium text-right">Impressions</th>
                  <th className="pb-3 font-medium text-right">Clicks</th>
                  <th className="pb-3 font-medium text-right">CTR</th>
                  <th className="pb-3 font-medium text-right">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {queries.map(q => (
                  <tr key={q.query}>
                    <td className="py-2 text-[#d1d1c6] pr-4 max-w-[240px] truncate">{q.query}</td>
                    <td className="py-2 text-right text-white">{q.impressions.toLocaleString()}</td>
                    <td className="py-2 text-right text-white">{q.clicks.toLocaleString()}</td>
                    <td className="py-2 text-right text-[#d1d1c6]">{q.ctr}%</td>
                    <td className="py-2 text-right text-[#d1d1c6]">{q.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.topQueries.length > 10 && (
            <button onClick={() => setShowAll(p => !p)} className="mt-4 text-xs text-[#E1FF00] hover:text-white transition-colors">
              {showAll ? 'Show less' : `Show all ${data.topQueries.length} queries`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
