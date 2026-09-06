'use client';

// ============================================================================
// Component: components/fa/motion/Reveal.tsx
// Quiet in-view reveal for supporting content. The authored moment on a
// page is the hero (image wipe + route draw-on); this is the background
// grammar — short, decelerating, once, and off entirely under reduced motion.
// ============================================================================
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({ children, delay = 0, className, as = 'div', id }: { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li' | 'figure'; id?: string }) {
  const reduced = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  if (reduced) return React.createElement(as, { className, id }, children);
  return (
    <M
      id={id}
      className={className}
      initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}
