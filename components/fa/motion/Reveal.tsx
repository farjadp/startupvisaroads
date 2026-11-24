'use client';

// ============================================================================
// Component: components/fa/motion/Reveal.tsx
// Quiet in-view reveal for supporting content. The authored moment on a
// page is the hero (image wipe + route draw-on); this is the background
// grammar — short, decelerating, once, and instant under reduced motion.
//
// The rendered element and its `initial` are the same on the server and the
// client; only the transition depends on the preference (it is not part of
// the markup). Branching the element on useReducedMotion() left the server's
// opacity:0 in place for reduced-motion readers — see useHydratedReducedMotion.
// ============================================================================
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({ children, delay = 0, className, as = 'div', id }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' | 'figure'; id?: string }) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}
