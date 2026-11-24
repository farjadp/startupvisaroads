'use client';

// ============================================================================
// components/partners/HandoffLanes.tsx
// "Two desks, one file": the collaboration as two swim lanes. On wide screens
// a line draws itself through the five steps, zig-zagging between the
// partner's desk and ours, and a small file token travels along it, so the
// reader sees the legal side start and end on their desk. On phones it is a
// numbered list with a lane tag per step. Reduced motion: the drawn line and
// token stay still; nothing loops.
// ============================================================================
import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { FileText } from 'lucide-react';
import { useHydratedReducedMotion } from '@/components/fa/motion/useHydratedReducedMotion';
import type { PartnerCopy, PartnerStep } from '@/content/partners';

const EASE = [0.16, 1, 0.3, 1] as const;

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (n: number) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

// Node positions as static Tailwind classes (five steps, three lane heights).
const LEFT: Record<number, string> = { 10: 'left-[10%]', 30: 'left-[30%]', 50: 'left-[50%]', 70: 'left-[70%]', 90: 'left-[90%]' };
const TOP: Record<number, string> = { 26: 'top-[26%]', 50: 'top-[50%]', 74: 'top-[74%]' };

/** Vertical position of a step's node in the lane strip, in %. */
const laneY = (lane: PartnerStep['lane']) => (lane === 'partner' ? 26 : lane === 'us' ? 74 : 50);

export default function HandoffLanes({ copy, locale }: { copy: PartnerCopy['handoff']; locale: string }) {
  const isRtl = locale === 'fa';
  // `initial` and the rendered elements are the same on the server and the
  // client; only transitions use the raw preference. The travelling token is
  // removed after hydration, never during it.
  const reduced = useReducedMotion();
  const stillAfterHydration = useHydratedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-15% 0px' });
  const steps = copy.steps;
  const n = steps.length;

  // Node x in % of the strip, mirrored for RTL so step 1 sits at the start.
  const xs = steps.map((_, i) => {
    const x = Math.round(((i + 0.5) / n) * 100);
    return isRtl ? 100 - x : x;
  });
  const ys = steps.map((s) => laneY(s.lane));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const num = (i: number) => (isRtl ? toFa(i + 1) : String(i + 1).padStart(2, '0'));
  const display = isRtl ? 'font-estedad font-black' : 'font-serif';

  return (
    <div ref={ref}>
      {/* Lane strip: wide screens only. Decorative; the list below carries the content. */}
      <div className="relative hidden h-44 border-y border-[#1a1a1a] md:block" aria-hidden>
        <div className="absolute inset-x-0 top-0 flex h-1/2 items-center border-b border-dashed border-[#1a1a1a]/25 px-4">
          <span className="bg-[#F2F0E9] pe-3 text-xs font-bold text-[#1a1a1a]/70">{copy.partnerLane}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-center bg-[#CCFF00]/25 px-4">
          <span className="pe-3 text-xs font-bold text-[#1a1a1a]/70">{copy.usLane}</span>
        </div>

        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="#1a1a1a" strokeOpacity={0.15} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <motion.polyline
            points={points}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: reduced || inView ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 1.6, ease: EASE }}
          />
        </svg>

        {xs.map((x, i) => (
          <span
            key={i}
            className={`absolute ${LEFT[x]} ${TOP[ys[i]]} flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#1a1a1a] text-sm font-bold ${steps[i].lane === 'us' ? 'bg-[#CCFF00]' : steps[i].lane === 'both' ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-[#F2F0E9]'} ${isRtl ? 'font-vazir' : 'font-sans'}`}
          >
            {num(i)}
          </span>
        ))}

        {/* The file token travelling between the two desks. */}
        {!stillAfterHydration && (
          <motion.span
            className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#1a1a1a] text-[#CCFF00] shadow-[4px_4px_0_0_#CCFF00]"
            initial={{ left: `${xs[0]}%`, top: `${ys[0]}%`, opacity: 0 }}
            animate={
              inView
                ? { left: xs.map((x) => `${x}%`), top: ys.map((y) => `${y}%`), opacity: [0, 1, 1, 1, 1] }
                : { opacity: 0 }
            }
            transition={{ duration: 7, times: xs.map((_, i) => i / (n - 1)), ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: 1.2 }}
          >
            <FileText className="h-4 w-4" />
          </motion.span>
        )}
      </div>

      <ol className="divide-y divide-[#1a1a1a]/15 border-b border-[#1a1a1a] md:grid md:grid-cols-5 md:divide-y-0 md:border-b-0">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            className="py-5 md:px-4 md:py-6"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.15 * i, ease: EASE }}
          >
            <div className="flex items-center gap-3">
              <span className={`text-3xl text-[#1a1a1a]/30 md:hidden ${display}`}>{num(i)}</span>
              <span
                className={`px-2 py-0.5 text-xs font-bold ${s.lane === 'us' ? 'bg-[#CCFF00] text-[#1a1a1a]' : s.lane === 'both' ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'border border-[#1a1a1a]/40 text-[#1a1a1a]'}`}
              >
                {s.lane === 'us' ? copy.usLane : s.lane === 'partner' ? copy.partnerLane : `${copy.partnerLane} + ${copy.usLane}`}
              </span>
            </div>
            <h3 className={`mt-3 text-lg font-bold ${isRtl ? 'font-vazir' : 'font-sans'}`}>{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#1a1a1a]/75">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
