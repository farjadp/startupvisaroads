// ============================================================================
// Component: components/fa/AtlasFlag.tsx
// The flag for a route in the /fa/which-path atlas, or — for Israel, which
// has none on purpose (lib/fa/flags.ts) — a blank tile of the same shape, so
// a row of flags keeps its rhythm. Usable from server and client components.
// ============================================================================
import React from 'react';
import { atlasFlag, type AtlasRoute } from '@/lib/fa/route-atlas';
import Flag from './Flag';

export default function AtlasFlag({ route, className = 'h-6' }: { route: AtlasRoute; className?: string }) {
  const code = atlasFlag(route);
  if (code) return <Flag code={code} className={`${className} w-auto shrink-0 text-[#1a1a1a]`} />;
  return <span aria-hidden className={`${className} inline-block aspect-[3/2] shrink-0 border border-[#1a1a1a]/20 bg-white`} />;
}
