'use client';

// ============================================================================
// components/partners/BreathingImage.tsx
// A photograph that is visible from the first paint (it may be the LCP
// element, so no fade-in) and then breathes: a very slow scale. Reduced
// motion gets the still photograph.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

export default function BreathingImage({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { scale: [1, 1.07] }}
        transition={reduced ? undefined : { duration: 24, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
