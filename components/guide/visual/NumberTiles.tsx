// ============================================================================
// components/guide/visual/NumberTiles.tsx
// Two to four figures a section is about, as large numerals with a label and
// a one-line qualifier. The figure is the first thing read; the qualifier
// keeps it honest ("20 days · no answer means granted").
// ============================================================================
import React from 'react';
import { type Lang, type Surface, display, text, tile } from './kit';

export interface Tile {
  value: string;
  label: string;
  sub?: string;
}

export default function NumberTiles({ tiles, lang = 'en', surface = 'paper', label }: { tiles: Tile[]; lang?: Lang; surface?: Surface; label?: string }) {
  const cols = tiles.length >= 4 ? 'md:grid-cols-4' : tiles.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return (
    <dl aria-label={label} className={`grid grid-cols-2 gap-3 ${cols} ${text(lang)}`}>
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className={`flex flex-col rounded-2xl border border-[#1a1a1a]/10 p-4 md:p-5 ${tile(surface)} ${tiles.length === 3 && i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
        >
          <dt className="order-2 mt-2 text-sm font-bold leading-snug">{t.label}</dt>
          <dd className={`order-1 text-[2rem] leading-none text-[var(--rp)] md:text-4xl ${display(lang)}`}>{t.value}</dd>
          {t.sub && <dd className="order-3 mt-1 text-xs leading-relaxed text-[#1a1a1a]/65">{t.sub}</dd>}
        </div>
      ))}
    </dl>
  );
}
