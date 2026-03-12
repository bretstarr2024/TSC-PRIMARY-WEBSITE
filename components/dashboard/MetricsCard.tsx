'use client';

interface MetricsCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  change?: number;
  subtext?: string;
  accent?: string;
}

export function MetricsCard({ title, value, suffix, change, subtext, accent = '#E1FF00' }: MetricsCardProps) {
  const changeColor = change === undefined ? '' : change > 0 ? 'text-[#73F5FF]' : change < 0 ? 'text-red-400' : 'text-[#6D6D69]';
  const changeSign = change !== undefined && change > 0 ? '+' : '';

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6D69] mb-3">{title}</p>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-light text-white leading-none">{value}</span>
        {suffix && <span className="text-sm text-[#d1d1c6] mb-0.5">{suffix}</span>}
      </div>
      {change !== undefined && (
        <p className={`text-xs mt-2 ${changeColor}`}>
          {changeSign}{change}% vs prior period
        </p>
      )}
      {subtext && <p className="text-xs text-[#6D6D69] mt-1">{subtext}</p>}
      <div className="mt-3 h-0.5 w-8 rounded-full" style={{ background: accent }} />
    </div>
  );
}
