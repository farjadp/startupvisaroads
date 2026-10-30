// ============================================================================
// components/OfficialSources.tsx
// The source list for the older editorial pages (USA EB-1, EB-2 NIW, EB-5)
// that are not built on the guide layout: every figure on the page links to
// the authority that sets it, with the date we last read it.
// ============================================================================
import React from 'react';

export type OfficialSource = { label: string; url: string; what: string };

export default function OfficialSources({ checked, sources }: { checked: string; sources: OfficialSource[] }) {
  return (
    <section aria-labelledby="official-sources" className="py-16 px-6 border-t border-[#1a1a1a]/10">
      <div className="container mx-auto max-w-4xl">
        <h2 id="official-sources" className="font-serif text-3xl mb-2">Official sources</h2>
        <p className="font-sans text-sm text-[#1a1a1a]/60 mb-8">Every figure on this page was checked against these pages on {checked}.</p>
        <ul className="space-y-4 font-sans text-sm">
          {sources.map((s) => (
            <li key={s.url} className="border-l-2 border-[#CCFF00] pl-4">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2 hover:text-[#1a1a1a]/70">
                {s.label}
              </a>
              <span className="block text-[#1a1a1a]/60 mt-1">{s.what}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
