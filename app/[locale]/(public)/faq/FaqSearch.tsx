'use client';

// ============================================================================
// app/[locale]/(public)/faq/FaqSearch.tsx
// A filter over the server-rendered FAQ. It never holds the questions: it
// hides the [data-faq] items under #faq-list whose text does not match, and
// any group left empty, so every answer stays in the HTML for crawlers and
// the page still works with JavaScript off. A match opens its answer.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function FaqSearch({ total }: { total: number }) {
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(total);

  useEffect(() => {
    const root = document.getElementById('faq-list');
    if (!root) return;
    const needle = query.trim().toLowerCase();
    let count = 0;
    root.querySelectorAll<HTMLElement>('[data-faq-group]').forEach((group) => {
      let inGroup = 0;
      group.querySelectorAll<HTMLDetailsElement>('[data-faq]').forEach((item) => {
        const hit = !needle || (item.textContent ?? '').toLowerCase().includes(needle);
        item.hidden = !hit;
        if (hit) inGroup += 1;
        if (needle && hit) item.open = true;
      });
      group.hidden = inGroup === 0;
      count += inGroup;
    });
    setShown(count);
  }, [query]);

  return (
    <div className="max-w-xl">
      <label htmlFor="faq-q" className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/60">
        Search the questions
      </label>
      <div className="flex items-center gap-2 border border-[#1a1a1a]/30 bg-white px-4 focus-within:border-[#1a1a1a]">
        <Search className="h-4 w-4 shrink-0 text-[#1a1a1a]/45" aria-hidden="true" />
        <input
          id="faq-q"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. proof of funds, Estonia, work permit"
          className="w-full bg-transparent py-3 font-sans text-base text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 font-sans text-xs tabular-nums text-[#1a1a1a]/55" aria-live="polite">
        {query ? `${shown} of ${total} questions match` : `${total} questions`}
      </p>
    </div>
  );
}
