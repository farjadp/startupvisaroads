// ============================================================================
// components/guide/visual/YearsLine.tsx
// The road from arrival to a passport on a true time scale. On wider screens
// the milestones sit along one line at their real year (so three years and
// ten years look different); on a phone they become a vertical rail with the
// year as a badge. One markup for both, so nothing is read twice.
// ============================================================================
import React from 'react';
import { type Lang, type Surface, display, eyebrow, text, tile } from './kit';

export interface Milestone {
  /** The year the milestone falls on; 0 is arrival. */
  at: number;
  /** Badge text: "Y3", «سال ۳». */
  year: string;
  label: string;
  sub?: string;
}

export default function YearsLine({
  milestones,
  lang = 'en',
  surface = 'paper',
  caption,
}: {
  milestones: Milestone[];
  lang?: Lang;
  surface?: Surface;
  caption?: string;
}) {
  const max = Math.max(...milestones.map((m) => m.at)) || 1;
  const n = milestones.length;
  return (
    <figure className={`rounded-2xl border border-[#1a1a1a]/10 p-5 md:px-8 md:pb-6 md:pt-7 ${tile(surface)} ${text(lang)}`}>
      {caption && <figcaption className={`mb-5 text-[var(--ra-text)] ${eyebrow(lang)}`}>{caption}</figcaption>}
      <ol className="relative grid gap-6 border-s-2 border-[var(--ra)] ps-6 md:mx-16 md:block md:h-36 md:border-s-0 md:ps-0">
        <span aria-hidden="true" className="absolute inset-x-0 top-[13px] hidden h-1 rounded-full bg-[var(--ra)] md:block" />
        {milestones.map((m, i) => {
          const edge = i === 0 ? 'start' : i === n - 1 ? 'end' : 'mid';
          return (
            <li
              key={m.label}
              className={`relative md:absolute md:top-0 md:w-40 md:start-[var(--x)] ${
                edge === 'mid' ? 'md:-ms-20 md:text-center' : edge === 'end' ? 'md:-ms-40 md:text-end' : ''
              }`}
              style={{ '--x': `${(m.at / max) * 100}%` } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`absolute -start-[33px] top-1 h-4 w-4 rounded-full border-[3px] border-[var(--ra)] md:static md:mb-3 md:block md:h-[30px] md:w-[30px] ${
                  edge === 'mid' ? 'md:mx-auto' : edge === 'end' ? 'md:ms-auto' : ''
                } ${i === n - 1 ? 'bg-[var(--ra)]' : 'bg-white'}`}
              />
              <span className="me-2 inline-block rounded-md bg-[var(--rd)] px-1.5 py-0.5 text-xs font-bold text-white md:mb-1 md:me-0">{m.year}</span>
              <span className={`text-lg leading-snug md:block ${display(lang)}`}>{m.label}</span>
              {m.sub && <span className="mt-0.5 block text-xs leading-relaxed text-[#1a1a1a]/65">{m.sub}</span>}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
