// ============================================================================
// components/guide/visual/StepLine.tsx
// An ordered process as a line of numbered dots: a vertical rail on phones,
// one row across on wider screens. Each step is a short label, who acts, and
// a chip with the deadline or the thing that step produces. The full step
// text stays in the section's fold (and in the HowTo JSON-LD).
// ============================================================================
import React from 'react';
import { type Lang, display, eyebrow, num, text } from './kit';

export interface LineStep {
  label: string;
  who?: string;
  chip?: string;
}

const COLS: Record<number, string> = {
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export default function StepLine({ steps, lang = 'en', caption }: { steps: LineStep[]; lang?: Lang; caption?: string }) {
  return (
    <figure className={text(lang)}>
      {caption && <figcaption className={`mb-4 text-[var(--ra-text)] ${eyebrow(lang)}`}>{caption}</figcaption>}
      <ol className={`grid grid-cols-1 md:gap-x-3 ${COLS[steps.length] ?? 'md:grid-flow-col md:auto-cols-fr'}`}>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.label} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 pb-5 last:pb-0 md:grid-cols-1 md:content-start md:gap-y-3 md:pb-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 start-[15px] top-8 w-0.5 bg-[var(--ra)] md:bottom-auto md:end-[-0.75rem] md:start-10 md:top-[15px] md:h-0.5 md:w-auto"
                />
              )}
              <span
                aria-hidden="true"
                className={`relative grid h-8 w-8 place-items-center rounded-full bg-[var(--ra)] text-sm text-[var(--ra-ink)] ${lang === 'fa' ? 'font-estedad font-black' : 'font-sans font-bold'}`}
              >
                {num(i + 1, lang)}
              </span>
              <div className="min-w-0 md:pe-2">
                <span className="sr-only">{lang === 'fa' ? `مرحله‌ی ${num(i + 1, lang)}: ` : `Step ${i + 1}: `}</span>
                <p className={`text-lg leading-snug md:text-xl ${display(lang)}`}>{s.label}</p>
                {(s.who || s.chip) && (
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5 md:flex-col md:items-start">
                    {s.who && <span className="text-xs leading-relaxed text-[#1a1a1a]/65">{s.who}</span>}
                    {s.chip && <span className="rounded-full bg-[var(--rs)] px-2.5 py-1 text-xs font-bold leading-snug text-[var(--ra-text)]">{s.chip}</span>}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
