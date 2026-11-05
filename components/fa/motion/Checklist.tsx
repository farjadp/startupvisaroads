'use client';

// ============================================================================
// Component: components/fa/motion/Checklist.tsx
// A checklist the reader works through: documents to gather, obligations to
// meet before a deadline. Each item is a real checkbox; ticked state is kept
// in the reader's own browser (localStorage) so it survives a reload and
// never leaves the device — we neither see it nor want to. A counter shows
// progress; a reset link clears it.
//
// Storage can be absent (private window, blocked site data), so every read
// and write is wrapped and the list works without it.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, RotateCcw } from 'lucide-react';
import type { FaChecklist } from '@/lib/fa/content';
import { toPersianDigits } from '@/lib/fa/format';

export default function Checklist({ list, storageKey, lang = 'fa' }: { list: FaChecklist; storageKey: string; lang?: 'fa' | 'en' }) {
  const en = lang === 'en';
  const num = (n: number) => (en ? String(n) : toPersianDigits(n));
  const [done, setDone] = useState<boolean[]>(() => list.items.map(() => false));
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw) as unknown;
        if (Array.isArray(arr)) setDone(list.items.map((_, i) => arr[i] === true));
      }
    } catch {
      /* no storage — the list still works for this visit */
    }
    setLoaded(true);
  }, [storageKey, list.items]);

  const persist = (next: boolean[]) => {
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  const toggle = (i: number) => persist(done.map((d, k) => (k === i ? !d : d)));
  const reset = () => persist(list.items.map(() => false));
  const count = done.filter(Boolean).length;
  const all = count === list.items.length;

  return (
    <section
      aria-label={list.title}
      className="my-2 rounded-2xl border border-[#1a1a1a]/15 bg-white overflow-hidden"
      data-loaded={loaded ? 'true' : 'false'}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a1a1a]/15 px-5 py-4">
        <div>
          <h3 className="font-estedad font-bold text-xl leading-snug">{list.title}</h3>
          {list.intro && <p className="mt-1 text-sm text-[#1a1a1a]/65 leading-relaxed">{list.intro}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`font-estedad font-bold text-sm px-3 py-1 border transition-colors ${all ? 'bg-[var(--ra,#CCFF00)] border-transparent text-[var(--ra-ink,#1a1a1a)]' : 'border-[#1a1a1a]/30 text-[#1a1a1a]/70'}`}
            aria-live="polite"
          >
            {en ? `${num(count)} of ${num(list.items.length)}` : `${num(count)} از ${num(list.items.length)}`}
          </span>
          {count > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              {en ? 'Reset' : 'از نو'}
            </button>
          )}
        </div>
      </header>
      <ol className="divide-y divide-[#1a1a1a]/15">
        {list.items.map((item, i) => {
          const checked = done[i];
          const id = `${storageKey}-${i}`.replace(/[^a-zA-Z0-9_-]/g, '_');
          return (
            <li key={i}>
              <label htmlFor={id} className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--rs,#F2F0E9)]/50 transition-colors">
                <input id={id} type="checkbox" checked={checked} onChange={() => toggle(i)} className="sr-only peer" />
                <motion.span
                  aria-hidden
                  className={`mt-1 grid h-6 w-6 shrink-0 place-items-center border border-[#1a1a1a] peer-focus-visible:ring-2 peer-focus-visible:ring-[#1a1a1a] peer-focus-visible:ring-offset-2 ${checked ? 'bg-[var(--rd,#1a1a1a)] text-[var(--ra,#CCFF00)] border-transparent' : 'bg-white'}`}
                  animate={reduced ? undefined : { scale: checked ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {checked && <Check className="w-4 h-4" strokeWidth={3} />}
                </motion.span>
                <span className={`leading-[1.8] transition-colors ${checked ? 'text-[#1a1a1a]/45 line-through decoration-[#1a1a1a]/30' : 'text-[#1a1a1a]/85'}`}>{item}</span>
              </label>
            </li>
          );
        })}
      </ol>
      <p className="px-5 py-3 text-xs text-[#1a1a1a]/50 border-t border-[#1a1a1a]/15">{en ? 'Ticks are saved in your own browser only and never sent to us.' : 'تیک‌ها فقط در مرورگر خودتان ذخیره می‌شوند و برای ما فرستاده نمی‌شوند.'}</p>
    </section>
  );
}
