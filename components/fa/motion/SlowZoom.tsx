'use client';

// ============================================================================
// Component: components/fa/motion/SlowZoom.tsx
// A full-bleed photograph that settles in, then breathes: a very slow scale
// back and forth, the way a landscape hero holds the eye without anything
// on the page actually moving. Reduced motion gets the still photograph.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

export default function SlowZoom({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.12, opacity: 0 }}
        animate={reduced ? undefined : { scale: [1.12, 1, 1.05], opacity: 1 }}
        transition={reduced ? undefined : {
          scale: { duration: 26, times: [0, 0.08, 1], ease: 'easeOut', repeat: Infinity, repeatType: 'mirror' },
          opacity: { duration: 1.2, ease: 'easeOut' },
        }}
      >
        <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
