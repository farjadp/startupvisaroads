'use client';

// ============================================================================
// components/pricing/PaymentTimeline.tsx
// "How payment works": the steps on a line that draws itself when it scrolls
// into view, each node landing in turn. Horizontal from md up, vertical on a
// phone. Reduced motion: the finished line, no movement.
// ============================================================================
import React from 'react';
import { motion } from 'motion/react';
import type { TitledItem } from '@/lib/pricing/types';
import { Txt } from './Tracked';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PaymentTimeline({ steps, numbers, locale }: { steps: TitledItem[]; numbers: string[]; locale: string }) {
  const isRtl = locale === 'fa';
  const display = isRtl ? 'font-estedad font-black' : 'font-serif';
  const view = { once: true, margin: '-15% 0px' } as const;

  return (
    <div className="relative">
      {/* the line: vertical on phones, horizontal from md */}
      <motion.span
        aria-hidden
        className="absolute top-0 h-full w-[3px] bg-[#1a1a1a] ltr:left-[22px] rtl:right-[22px] md:hidden"
        style={{ originY: 0 }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={view}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.span
        aria-hidden
        className="absolute top-[22px] hidden h-[3px] bg-[#1a1a1a] md:block"
        // from the first node's centre to the last one's (columns are 1fr with a 24px gap)
        style={{ originX: isRtl ? 1 : 0, insetInlineStart: 22, insetInlineEnd: `calc(${100 / Math.max(steps.length, 1)}% - ${(24 * (steps.length - 1)) / Math.max(steps.length, 1)}px - 22px)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={view}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <ol className="relative grid gap-10 md:auto-cols-fr md:grid-flow-col md:gap-6">
        {steps.map((s, i) => (
          <motion.li
            key={i}
            className="relative flex gap-5 md:flex-col md:gap-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={view}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.3, ease: EASE }}
          >
            <span className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#1a1a1a] text-xl ${i === steps.length - 1 ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-[#CCFF00] text-[#1a1a1a]'} ${display}`}>
              {numbers[i]}
            </span>
            <div className="pt-1 md:pt-0">
              <h3 className={`text-xl leading-snug md:text-2xl ${display}`}>
                <Txt s={s.title} />
              </h3>
              <p className="mt-2 max-w-sm leading-relaxed text-[#1a1a1a]/75">
                <Txt s={s.body} />
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
