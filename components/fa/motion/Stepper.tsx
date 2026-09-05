'use client';

// ============================================================================
// Component: components/fa/motion/Stepper.tsx
// A numbered sequence the reader steps through instead of a wall of
// bullets. One step open at a time; the number is the control. Content
// modules keep writing plain "۱. …" bullets — the layout detects them.
// ============================================================================
import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type Step = { n: string; title: string; body: string };

export default function Stepper({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const s = steps[i];
  return (
    <div className="border border-[#1a1a1a] bg-[#F2F0E9]">
      <ol className="flex flex-wrap border-b border-[#1a1a1a]" aria-label="مراحل">
        {steps.map((st, k) => (
          <li key={k} className="flex-1 min-w-[3.5rem]">
            <button
              type="button"
              aria-current={k === i ? 'step' : undefined}
              onClick={() => setI(k)}
              className={`w-full py-4 font-estedad font-black text-xl transition-colors ${k === i ? 'bg-[#1a1a1a] text-[#CCFF00]' : k < i ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/35 hover:text-[#1a1a1a]'}`}
            >
              {st.n}
            </button>
          </li>
        ))}
      </ol>
      <div className="p-8 md:p-10 min-h-[12rem] relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: 12, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-estedad font-black text-2xl md:text-3xl mb-4">{s.title}</h3>
            <p className="text-lg leading-[1.9] text-[#1a1a1a]/80 max-w-3xl">{s.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between">
          <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex items-center gap-2 text-sm font-bold disabled:opacity-30">
            <ArrowRight className="w-4 h-4" /> قبلی
          </button>
          <span className="text-xs text-[#1a1a1a]/50">{s.n} از {steps[steps.length - 1].n}</span>
          <button type="button" disabled={i === steps.length - 1} onClick={() => setI(i + 1)} className="inline-flex items-center gap-2 text-sm font-bold disabled:opacity-30">
            بعدی <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
