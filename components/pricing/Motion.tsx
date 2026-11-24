'use client';

// ============================================================================
// components/pricing/Motion.tsx
// Motion for the pricing page without a hydration mismatch.
//
// components/fa/motion/Reveal branches on useReducedMotion(), which is null
// on the server and true in a reduced-motion browser: the server HTML keeps
// opacity 0, React refuses to patch the attribute, and the section stays
// invisible for exactly the readers who asked for less motion. Here the
// server and the client render the same props; MotionConfig
// reducedMotion="user" drops the movement (transforms) for those readers,
// so they get a short fade and nothing moves.
// ============================================================================
import React from 'react';
import { MotionConfig, motion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

export function PricingMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export default function Reveal({ children, delay = 0, className, as = 'div' }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}
