'use client';

// ============================================================================
// Component: components/fa/motion/Rule.tsx
// A short acid rule that draws itself in from the reading edge when its
// section arrives, then stops. It marks where a section begins without
// adding another thing that keeps moving while the reader is trying to read.
// ============================================================================
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function Rule({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const cls = `block h-[2px] w-16 bg-[#CCFF00] origin-right ${className ?? ''}`;
  if (reduced) return <span aria-hidden className={cls} />;
  return (
    <motion.span
      aria-hidden
      className={cls}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
