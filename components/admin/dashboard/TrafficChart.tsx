'use client';

import { useState } from 'react';
import type { TrafficDay } from '@/lib/admin-dashboard/metrics';

const W = 720;
const H = 210;
const PAD = { top: 12, right: 44, bottom: 24, left: 40 };
const fmt = new Intl.NumberFormat('en-US');
const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Gridline steps at 1, 2 or 5 × 10ⁿ, so the axis reads as round numbers. */
function niceMax(value: number): number {
  if (value <= 4) return 4;
  const base = 10 ** Math.floor(Math.log10(value / 4));
  const step = [1, 2, 5, 10].map((m) => m * base).find((m) => m * 4 >= value) ?? 10 * base;
  return step * 4;
}

const SERIES = [
  { key: 'en', label: 'English', stroke: 'stroke-[#1f5fa8]', fill: 'fill-[#1f5fa8]', swatch: 'bg-[#1f5fa8]' },
  { key: 'fa', label: 'Persian', stroke: 'stroke-[#d9730d]', fill: 'fill-[#d9730d]', swatch: 'bg-[#d9730d]' },
] as const;

export default function TrafficChart({ days }: { days: TrafficDay[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(1, ...days.flatMap((d) => [d.en, d.fa])));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (days.length > 1 ? (i / (days.length - 1)) * innerW : 0);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  // End labels: when the two lines finish close together, push the labels apart so both stay readable.
  const last = days.at(-1);
  const gap = last ? y(last.en) - y(last.fa) : 0;
  const nudge = Math.abs(gap) < 12 ? (12 - Math.abs(gap)) / 2 : 0;
  const labelY = (key: 'en' | 'fa') => {
    if (!last) return 0;
    const sign = (key === 'en' ? 1 : -1) * (gap >= 0 ? 1 : -1);
    return y(last[key]) + 4 + sign * nudge;
  };
  const hovered = active === null ? null : days[active];
  const tipX = active === null ? 0 : Math.min(x(active) + 8, W - PAD.right - 112);

  return (
    <figure>
      <div className="mb-2 flex gap-4 font-sans text-xs text-[#1a1a1a]/60">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span className={`h-0.5 w-3 ${s.swatch}`} aria-hidden />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Daily page views for English and Persian pages over the last 28 complete days"
        onMouseLeave={() => setActive(null)}
      >
        {[0, 1, 2, 3, 4].map((step) => {
          const value = (max / 4) * step;
          return (
            <g key={step}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(value)} y2={y(value)} className="stroke-[#1a1a1a]/10" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(value) + 4} textAnchor="end" className="fill-[#1a1a1a]/50 font-sans text-[11px]">
                {fmt.format(value)}
              </text>
            </g>
          );
        })}
        <text x={PAD.left} y={H - 6} className="fill-[#1a1a1a]/50 font-sans text-[11px]">
          {days[0] && dayLabel(days[0].date)}
        </text>
        <text x={W - PAD.right} y={H - 6} textAnchor="end" className="fill-[#1a1a1a]/50 font-sans text-[11px]">
          {days.at(-1) && dayLabel(days.at(-1)!.date)}
        </text>

        {SERIES.map((s) => (
          <polyline
            key={s.key}
            points={days.map((d, i) => `${x(i).toFixed(1)},${y(d[s.key]).toFixed(1)}`).join(' ')}
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={s.stroke}
          />
        ))}
        {days.length > 0 &&
          SERIES.map((s) => (
            <text key={s.key} x={W - PAD.right + 6} y={labelY(s.key)} className="fill-[#1a1a1a]/70 font-sans text-[11px]">
              {s.key.toUpperCase()}
            </text>
          ))}

        {hovered && active !== null && (
          <g pointerEvents="none">
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} className="stroke-[#1a1a1a]/30" strokeWidth={1} />
            {SERIES.map((s) => (
              <circle key={s.key} cx={x(active)} cy={y(hovered[s.key])} r={4} strokeWidth={2} className={`${s.fill} stroke-white`} />
            ))}
            <rect x={tipX} y={PAD.top} width={104} height={54} rx={6} className="fill-[#1a1a1a]" />
            <text x={tipX + 8} y={PAD.top + 16} className="fill-white font-sans text-[11px] font-bold">
              {dayLabel(hovered.date)}
            </text>
            <text x={tipX + 8} y={PAD.top + 31} className="fill-white font-sans text-[11px]">
              English {fmt.format(hovered.en)}
            </text>
            <text x={tipX + 8} y={PAD.top + 46} className="fill-white font-sans text-[11px]">
              Persian {fmt.format(hovered.fa)}
            </text>
          </g>
        )}

        {days.map((d, i) => (
          <rect
            key={d.date}
            x={x(i) - innerW / Math.max(1, days.length - 1) / 2}
            y={PAD.top}
            width={innerW / Math.max(1, days.length - 1)}
            height={innerH}
            className="fill-transparent"
            onMouseEnter={() => setActive(i)}
          />
        ))}
      </svg>
      <details className="mt-2 font-sans text-xs text-[#1a1a1a]/60">
        <summary className="cursor-pointer">Show the numbers as a table</summary>
        <table className="mt-2 w-full max-w-sm text-left">
          <thead>
            <tr>
              <th className="py-1 font-bold">Day</th>
              <th className="py-1 text-right font-bold">English</th>
              <th className="py-1 text-right font-bold">Persian</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date} className="border-t border-[#1a1a1a]/5">
                <td className="py-1">{dayLabel(d.date)}</td>
                <td className="py-1 text-right tabular-nums">{fmt.format(d.en)}</td>
                <td className="py-1 text-right tabular-nums">{fmt.format(d.fa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
