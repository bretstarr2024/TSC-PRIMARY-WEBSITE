'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { AhrefsMetrics } from '@/lib/reporting/types';
import { MetricsCard } from './MetricsCard';

interface Props { data: AhrefsMetrics }

export function AhrefsSection({ data }: Props) {
  const { backlinks } = data;

  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-4">Authority & Backlinks <span className="text-xs text-[#6D6D69] font-normal ml-1">(Ahrefs)</span></h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricsCard
          title="Domain Rating"
          value={data.domainRating}
          suffix="/100"
          change={data.domainRatingChange !== 0 ? data.domainRatingChange : undefined}
          accent="#E1FF00"
        />
        <MetricsCard title="Referring Domains" value={data.referringDomains.toLocaleString()} change={data.referringDomainsChange} accent="#73F5FF" />
        <MetricsCard title="Live Backlinks" value={backlinks.live.toLocaleString()} subtext={`${backlinks.dofollow.toLocaleString()} dofollow`} accent="#ED0AD2" />
        <MetricsCard title="Organic Keywords" value={data.organicKeywords.toLocaleString()} accent="#FF5910" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Backlink stats */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Backlink Profile</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {[
              { label: 'Total', value: backlinks.total.toLocaleString() },
              { label: 'Live', value: backlinks.live.toLocaleString() },
              { label: 'Dofollow', value: backlinks.dofollow.toLocaleString() },
              { label: 'Nofollow', value: backlinks.nofollow.toLocaleString() },
              { label: 'New this period', value: `+${backlinks.newThisPeriod.toLocaleString()}`, color: '#73F5FF' },
              { label: 'Lost this period', value: `-${backlinks.lostThisPeriod.toLocaleString()}`, color: '#FF5910' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-[#6D6D69] mb-0.5">{item.label}</p>
                <p className="text-sm font-medium" style={{ color: item.color || 'white' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DR trend */}
        {data.drTrend.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Referring Domains Trend</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={data.drTrend} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#6D6D69', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: '#6D6D69', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#d1d1c6' }} />
                <Line type="monotone" dataKey="value" name="Ref Domains" stroke="#73F5FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.topReferringDomains.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Top Referring Domains</p>
            <div className="space-y-2">
              {data.topReferringDomains.slice(0, 10).map(d => (
                <div key={d.domain} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#d1d1c6] truncate flex-1">{d.domain}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#6D6D69]">DR {d.dr}</span>
                    <span className="text-sm text-white">{d.backlinks.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.topBacklinks.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-4">Top Backlinks</p>
            <div className="space-y-3">
              {data.topBacklinks.slice(0, 8).map((b, i) => (
                <div key={i}>
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#73F5FF] hover:text-white transition-colors truncate block">{b.url}</a>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-[#6D6D69]">DR {b.dr}</span>
                    {b.anchor && <span className="text-xs text-[#6D6D69] truncate">"{b.anchor}"</span>}
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
