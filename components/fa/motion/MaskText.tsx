'use client';

// ============================================================================
// Component: components/fa/motion/MaskText.tsx
// The headline rises into a mask, word by word, from the reading edge.
//
// This replaces a blur-and-fade. Blur is the wrong gesture for a face as
// hard-edged as Estedad on a hard-edged layout — it makes the one moment on
// the page look out of focus. A mask keeps every edge sharp and still gives
// the entrance somewhere to come from.
//
// Split on ordinary spaces only. A Persian word can carry a ZWNJ (نیم‌فاصله)
// inside it — «نیم‌فاصله» is one word — and splitting there would break the
// word in half.
// ============================================================================
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MaskText({
  text,
  className,
  as = 'h1',
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'p';
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = as;
  if (reduced) return <Tag className={className}>{text}</Tag>;

  const words = text.split(' ');
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        // The mask. Bottom padding keeps Persian descenders (ج، ی، ن) from
        // being clipped by their own overflow:hidden.
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, delay: delay + Math.min(i * 0.04, 0.5), ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
