// ============================================================================
// components/guide/visual/Detail.tsx
// The fold under each visual: a native <details>, so every word stays in the
// server-rendered HTML for search and answer engines, opens with Enter/Space,
// and is found by the browser's find-in-page.
// ============================================================================
import React from 'react';
import { type Lang, num } from './kit';

const COPY = {
  en: { open: 'Read the detail', close: 'Close the detail', min: (n: string) => `about ${n} min` },
  fa: { open: 'جزئیات این بخش', close: 'بستن جزئیات', min: (n: string) => `حدود ${n} دقیقه` },
};

export default function Detail({
  lang = 'en',
  label,
  minutes,
  closeLabel,
  children,
}: {
  lang?: Lang;
  /** Replaces the default "Read the detail" line. */
  label?: string;
  /** Reading time of the folded text, shown next to the label. */
  minutes?: number;
  /** Replaces the default "Close the detail" line. */
  closeLabel?: string;
  children: React.ReactNode;
}) {
  const c = COPY[lang];
  const meta = minutes ? ` · ${c.min(num(Math.max(1, Math.round(minutes)), lang))}` : '';
  return (
    <details className="group" data-detail>
      <summary
        className={`inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-[#1a1a1a]/20 bg-white py-2 pe-5 ps-2 text-sm font-bold text-[#1a1a1a] transition-colors hover:border-[var(--rp)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rp)] group-open:border-[var(--rp)] [&::-webkit-details-marker]:hidden ${lang === 'en' ? 'font-sans' : ''}`}
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-full bg-[var(--rs)] text-base leading-none text-[var(--ra-text)] motion-safe:transition-transform group-open:rotate-45"
        >
          +
        </span>
        <span className="group-open:hidden">{(label ?? c.open) + meta}</span>
        <span className="hidden group-open:inline">{closeLabel ?? c.close}</span>
      </summary>
      <div className="pt-8">{children}</div>
    </details>
  );
}
