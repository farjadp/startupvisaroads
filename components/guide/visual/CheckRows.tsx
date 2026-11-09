// ============================================================================
// components/guide/visual/CheckRows.tsx
// A list a reader can scan in five seconds: one icon and one line per item.
// `check` for conditions you must meet, `alert` for things to plan around,
// `number` for an ordered set of criteria. The full wording of each item is
// in the section's fold.
// ============================================================================
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { type Lang, type Surface, num, text, tile } from './kit';

export interface CheckRow {
  label: string;
  note?: string;
}

export default function CheckRows({
  items,
  icon = 'check',
  lang = 'en',
  surface = 'paper',
  label,
  columns = 2,
}: {
  items: CheckRow[];
  icon?: 'check' | 'alert' | 'number';
  lang?: Lang;
  surface?: Surface;
  label?: string;
  columns?: 1 | 2 | 3;
}) {
  const cols = columns === 3 ? 'md:grid-cols-3' : columns === 2 ? 'md:grid-cols-2' : '';
  // Rules between rows only: none above the first row of each column.
  const firstRow = columns === 3 ? 'md:[&:nth-child(-n+3)]:border-t-0' : columns === 2 ? 'md:[&:nth-child(-n+2)]:border-t-0' : '';
  return (
    <ul aria-label={label} className={`grid grid-cols-1 gap-x-8 rounded-2xl border border-[#1a1a1a]/10 px-5 py-2 md:px-6 ${cols} ${tile(surface)} ${text(lang)}`}>
      {items.map((it, i) => (
        <li key={it.label} className={`flex items-start gap-3 border-t border-dashed border-[#1a1a1a]/12 py-3.5 first:border-t-0 ${firstRow}`}>
          <span
            aria-hidden="true"
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
              icon === 'alert' ? 'bg-[#FBEBDD] text-[#8F3A0E]' : 'bg-[var(--ra)] text-[var(--ra-ink)]'
            }`}
          >
            {icon === 'check' && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            {icon === 'alert' && <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />}
            {icon === 'number' && num(i + 1, lang)}
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold leading-snug">{it.label}</span>
            {it.note && <span className="mt-0.5 block text-sm leading-relaxed text-[#1a1a1a]/65">{it.note}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
