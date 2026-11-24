'use client';

// ============================================================================
// Component: components/fa/motion/Parallax.tsx
// A slow vertical drift on a full-width figure as it passes through the
// viewport. Small on purpose: enough to give the band depth, never enough to
// make the reader feel the page is moving under them.
//
// The inner layer is oversized by the full travel so the drift can never
// expose an edge of the image.
// ============================================================================
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useHydratedReducedMotion } from './useHydratedReducedMotion';

export default function Parallax({
  children,
  distance = 36,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Hydrate with the drifting markup the server sent, then settle to the
  // still figure for reduced-motion readers.
  const reduced = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  if (reduced) return <div ref={ref} className={className}>{children}</div>;
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        style={{ y, top: -distance, bottom: -distance }}
        className="absolute inset-x-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
