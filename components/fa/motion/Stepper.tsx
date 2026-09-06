'use client';

// ============================================================================
// Component: components/fa/motion/Stepper.tsx
// A numbered sequence the reader steps through instead of a wall of bullets.
// One step open at a time; the number is the control. Content modules keep
// writing plain "۱. …" bullets — the layout detects them.
//
// The numbers sit on a rail that fills to the reader's position, so the
// sequence reads as a progression rather than as six unrelated tabs.
//
// Deliberately NOT scroll-driven. Advancing the step as the reader scrolls
// would mean taking the scroll away from them to do it, and a reader who
// wants to re-read step 2 would be dragged forward. Scroll stays theirs; the
// rail is what scroll-linking would have bought, without the cost.
// ============================================================================
import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type Step = { n: string; title: string; body: string };

export default function Stepper({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const s = steps[i];
  const progress = steps.length > 1 ? i / (steps.length - 1) : 1;

  // Arrow keys move between steps once the rail has focus, which is what a
  // tablist is expected to do and what a row of buttons does not do on its own.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const back = e.key === 'ArrowRight'; // RTL: right is backwards
    const fwd = e.key === 'ArrowLeft';
    if (!back && !fwd) return;
    e.preventDefault();
    const next = Math.min(steps.length - 1, Math.max(0, i + (fwd ? 1 : -1)));
    setI(next);
    listRef.current?.querySelectorAll('button')[next]?.focus();
  };

  return (
    <div className="border border-[#1a1a1a] bg-[#F2F0E9]">
      <div className="relative">
        <ol
          ref={listRef}
          onKeyDown={onKeyDown}
          className="flex flex-wrap border-b border-[#1a1a1a] relative"
          aria-label="مراحل"
        >
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
        {/* The rail sits on the divider under the numbers, drawn after them so
            the border cannot cover it, and filling from the reading edge. */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 end-0 h-[2px] bg-[#CCFF00]"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
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
