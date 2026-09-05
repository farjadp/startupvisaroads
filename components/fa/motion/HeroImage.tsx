'use client';

// ============================================================================
// Component: components/fa/motion/HeroImage.tsx
// The page's authored entrance: the brand photograph wipes in with a
// clip-path from the reading edge while the routes draw on the globe next
// to it. Under reduced motion the image is simply there.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

export default function HeroImage({ src, alt, priority = true, className }: { src: string; alt: string; priority?: boolean; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`relative overflow-hidden bg-[#1a1a1a] ${className ?? ''}`}
      initial={reduced ? false : { clipPath: 'inset(0 0 0 100%)' }}
      animate={{ clipPath: 'inset(0 0 0 0%)' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
