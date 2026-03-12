'use client';

import type { TimePeriod } from '@/lib/reporting/types';

interface Props {
  value: TimePeriod;
  onChange: (p: TimePeriod) => void;
}

const OPTIONS: { label: string; value: TimePeriod }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === opt.value
              ? 'bg-[#E1FF00] text-[#0a0a0a]'
              : 'text-[#d1d1c6] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
