// ============================================================================
// components/guide/visual/MoneyBar.tsx
// Household means as stacked bars: one segment per person, coloured by role
// (the applicant, a partner, each further member), every bar on one scale.
// The bars are decorative (aria-hidden); the figure printed beside each row is
// what carries the meaning, so a screen reader or a crawler reads the numbers.
// ============================================================================
import React from 'react';
import { type Lang, type Surface, display, eyebrow, text, tile } from './kit';

/** 0 = the applicant, 1 = spouse or partner, 2 = each further member. */
export type MoneyRole = 0 | 1 | 2;

export interface MoneyRow {
  label: string;
  /** What the row costs, as printed text: "€900 a month". */
  figure: string;
  /** A second line under the figure, e.g. the 36-month total. */
  sub?: string;
  segments: { value: number; role: MoneyRole }[];
}

const FILL: Record<MoneyRole, string> = {
  0: 'bg-[var(--rp)]',
  1: 'bg-[var(--ra)]',
  2: 'bg-[color-mix(in_srgb,var(--rd)_45%,transparent)]',
};

export default function MoneyBar({
  rows,
  legend,
  lang = 'en',
  surface = 'paper',
  caption,
  note,
}: {
  rows: MoneyRow[];
  /** Names of the three roles, in order. */
  legend: [string, string, string];
  lang?: Lang;
  surface?: Surface;
  caption?: string;
  note?: string;
}) {
  const max = Math.max(...rows.map((r) => r.segments.reduce((a, s) => a + s.value, 0)));
  const used = new Set(rows.flatMap((r) => r.segments.map((s) => s.role)));
  return (
    <figure className={`rounded-2xl border border-[#1a1a1a]/10 p-5 md:p-7 ${tile(surface)} ${text(lang)}`}>
      {caption && <figcaption className={`mb-5 text-[var(--ra-text)] ${eyebrow(lang)}`}>{caption}</figcaption>}
      <ul className="grid gap-5">
        {rows.map((r) => {
          const total = r.segments.reduce((a, s) => a + s.value, 0);
          return (
            <li key={r.label} className="grid gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <span className="text-sm font-bold leading-snug">{r.label}</span>
                <span className="text-end">
                  <span className={`block text-2xl leading-none text-[var(--rp)] ${lang === 'en' ? 'tabular-nums' : ''} ${display(lang)}`}>{r.figure}</span>
                </span>
              </div>
              <div aria-hidden="true" className="h-4 w-full rounded-full bg-[#1a1a1a]/[0.06]">
                <div
                  className="flex h-full w-[var(--w)] gap-[3px] overflow-hidden rounded-full"
                  style={{ '--w': `${(total / max) * 100}%` } as React.CSSProperties}
                >
                  {r.segments.map((s, i) => (
                    <span
                      key={i}
                      className={`h-full grow-[var(--g)] basis-0 first:rounded-s-full last:rounded-e-full ${FILL[s.role]}`}
                      style={{ '--g': s.value } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
              {r.sub && <p className="text-xs leading-relaxed text-[#1a1a1a]/65">{r.sub}</p>}
            </li>
          );
        })}
      </ul>
      <ul aria-hidden="true" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#1a1a1a]/10 pt-4 text-xs text-[#1a1a1a]/70">
        {legend.map((l, i) =>
          used.has(i as MoneyRole) ? (
            <li key={l} className="inline-flex items-center gap-2">
              <span className={`h-3 w-5 rounded-full ${FILL[i as MoneyRole]}`} />
              {l}
            </li>
          ) : null,
        )}
      </ul>
      {note && <p className="mt-3 text-xs leading-relaxed text-[#1a1a1a]/65">{note}</p>}
    </figure>
  );
}
