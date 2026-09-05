'use client';

// ============================================================================
// Component: components/fa/three/RoadsScene.tsx
// The gate in front of the 3D globe. Renders the SVG fallback immediately
// (server-rendered, so there is always a picture), then swaps in the WebGL
// globe only when: the element is in view, the reader has not asked for
// reduced motion, and WebGL exists. Three.js never loads on a page the
// reader does not scroll to, and never on a reduced-motion device.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import RoadsFallback from './RoadsFallback';
import { DESTINATIONS, type Destination } from '@/lib/fa/geo';

const RoadsGlobe = dynamic(() => import('./RoadsGlobe'), { ssr: false });

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export type RoadsSceneProps = {
  /** Keys of DESTINATIONS, or full destination objects. */
  to: (keyof typeof DESTINATIONS | Destination)[];
  className?: string;
};

export default function RoadsScene({ to, className }: RoadsSceneProps) {
  const destinations = to.map((d) => (typeof d === 'string' ? DESTINATIONS[d] : d)).filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'svg' | 'gl'>('svg');
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !webglAvailable()) return; // stay on the SVG
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setMode('gl');
          setAnimate(e.isIntersecting && !document.hidden);
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 },
    );
    io.observe(el);
    const vis = () => setAnimate(!document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden={mode === 'gl'}>
      {mode === 'gl' ? (
        <RoadsGlobe destinations={destinations} animate={animate} className="!absolute !inset-0" />
      ) : (
        <RoadsFallback destinations={destinations} className="absolute inset-0 w-full h-full" />
      )}
    </div>
  );
}
