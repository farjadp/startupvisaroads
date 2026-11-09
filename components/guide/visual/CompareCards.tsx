// ============================================================================
// components/guide/visual/CompareCards.tsx
// Country against country in one compact grid: flag and name, then what is
// in its favour and what is against it. The page's own country is tinted.
// On a phone each country is a row with both lines labelled; from md up the
// labels move into a header row, like a table.
// ============================================================================
import React from 'react';
import { type Lang, type Surface, display, eyebrow, text, tile } from './kit';

export interface CompareRow {
  flag: React.ReactNode;
  country: string;
  plus: string;
  minus: string;
  /** The page's own country. */
  self?: boolean;
}

export default function CompareCards({
  rows,
  heads,
  lang = 'en',
  surface = 'paper',
  caption,
}: {
  rows: CompareRow[];
  /** Column names: country, for, against. */
  heads: [string, string, string];
  lang?: Lang;
  surface?: Surface;
  caption?: string;
}) {
  const grid = 'md:grid md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-6';
  return (
    <figure className={text(lang)}>
      {caption && <figcaption className={`mb-3 text-[var(--ra-text)] ${eyebrow(lang)}`}>{caption}</figcaption>}
      <div className={`overflow-hidden rounded-2xl border border-[#1a1a1a]/10 ${tile(surface)}`}>
        <div aria-hidden="true" className={`hidden border-b border-[#1a1a1a]/10 px-6 py-3 text-[#1a1a1a]/65 ${grid} ${eyebrow(lang)}`}>
          <span>{heads[0]}</span>
          <span>{heads[1]}</span>
          <span>{heads[2]}</span>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.country} className={`grid gap-2 border-b border-[#1a1a1a]/10 px-5 py-4 last:border-0 md:px-6 ${grid} ${r.self ? 'bg-[var(--rs)]' : ''}`}>
              <p className={`flex items-center gap-2.5 text-xl ${display(lang)}`}>
                {r.flag}
                {r.country}
              </p>
              <p className="flex items-start gap-2 text-sm leading-relaxed">
                <span aria-hidden="true" className="font-bold text-[var(--ra-text)]">+</span>
                <span>
                  <span className="sr-only">{heads[1]}: </span>
                  {r.plus}
                </span>
              </p>
              <p className="flex items-start gap-2 text-sm leading-relaxed text-[#1a1a1a]/75">
                <span aria-hidden="true" className="font-bold text-[#8F3A0E]">−</span>
                <span>
                  <span className="sr-only">{heads[2]}: </span>
                  {r.minus}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
