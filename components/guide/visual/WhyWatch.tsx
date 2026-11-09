// ============================================================================
// components/guide/visual/WhyWatch.tsx
// The case for and the case against, side by side: two columns of one-line
// titles. On a phone the "why" column comes first, then "watch out". The
// explanations behind each line are in the section's fold.
// ============================================================================
import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { type Lang, display, text } from './kit';

export default function WhyWatch({
  why,
  watch,
  lang = 'en',
}: {
  why: { heading: string; items: string[] };
  watch: { heading: string; items: string[] };
  lang?: Lang;
}) {
  const col = (side: 'why' | 'watch') => {
    const d = side === 'why' ? why : watch;
    const good = side === 'why';
    return (
      <section
        aria-label={d.heading}
        className={`rounded-2xl border p-5 md:p-6 ${good ? 'border-[color-mix(in_srgb,var(--ra)_45%,transparent)] bg-[var(--rs)]' : 'border-[#B4531A]/25 bg-[#FBEBDD]'}`}
      >
        <p className={`flex items-center gap-2 text-xl md:text-2xl ${display(lang)} ${good ? 'text-[var(--ra-text)]' : 'text-[#8F3A0E]'}`}>
          {d.heading}
        </p>
        <ul className="mt-3 grid gap-2.5">
          {d.items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-[15px] font-bold leading-snug">
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${good ? 'bg-[var(--ra)] text-[var(--ra-ink)]' : 'bg-white text-[#8F3A0E]'}`}
              >
                {good ? <Check className="h-3 w-3" strokeWidth={3} /> : <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />}
              </span>
              {it}
            </li>
          ))}
        </ul>
      </section>
    );
  };
  return (
    <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${text(lang)}`}>
      {col('why')}
      {col('watch')}
    </div>
  );
}
