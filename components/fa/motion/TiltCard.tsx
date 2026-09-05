'use client';

// CSS-3D tilt on pointer: the card leans toward the cursor and the lime
// highlight follows. Zero bundle cost, off under reduced motion and on touch.
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';

export default function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 220, damping: 22 });
  const glow = useTransform([px, py], ([x, y]) => `radial-gradient(420px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(204,255,0,0.22), transparent 60%)`);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType === 'touch') return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); };

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className={`relative ${className ?? ''}`}
      >
        {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ background: glow }} />}
        {children}
      </motion.div>
    </div>
  );
}
