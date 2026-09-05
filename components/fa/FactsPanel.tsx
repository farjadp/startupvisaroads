// ============================================================================
// Component: components/fa/FactsPanel.tsx
// The programme's key numbers, above the prose. Two jobs at once: a reader
// deciding between five routes can compare them in seconds, and an answer
// engine asked "what does the Finland startup permit require" finds labelled
// values instead of having to parse paragraphs. The same array is emitted as
// schema.org PropertyValue in faWebPageJsonLd.
// ============================================================================
import React from 'react';
import type { FaFact } from '@/lib/fa/content';
import Reveal from './motion/Reveal';

export default function FactsPanel({ facts, caption }: { facts: FaFact[]; caption?: string }) {
  if (!facts.length) return null;
  return (
    <Reveal as="section" className="my-14">
      <h2 className="sr-only">اعداد کلیدی این مسیر</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]">
        {facts.map((f) => (
          <div key={f.label} className="bg-[#F2F0E9] p-6 flex flex-col justify-between min-h-[8.5rem]">
            <dt className="text-xs font-bold text-[#1a1a1a]/55 mb-3">{f.label}</dt>
            <dd>
              <span className="block font-estedad font-black text-2xl leading-tight [text-wrap:balance]">{f.value}</span>
              {f.note && <span className="block mt-2 text-xs text-[#1a1a1a]/55 leading-relaxed">{f.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      {caption && <p className="mt-3 text-xs text-[#1a1a1a]/50">{caption}</p>}
    </Reveal>
  );
}
