// ============================================================================
// Component: components/route/FinnishFlag.tsx
// The Finnish flag at its official proportions (Act on the Flag of Finland
// 380/1978): 18 × 11, a blue cross 3 units wide whose vertical bar starts 5
// units from the hoist. Drawn from rectangles, never stretched, so it reads
// correctly at any size. No hooks — usable from server and client components.
// ============================================================================
import React from 'react';

const BLUE = '#002F6C';

/** The flag in its own 18 × 11 user space, for nesting inside another SVG. */
export function FinnishFlagShapes() {
  return (
    <>
      <rect width="18" height="11" fill="#fff" />
      <rect x="5" width="3" height="11" fill={BLUE} />
      <rect y="4" width="18" height="3" fill={BLUE} />
      <rect x=".125" y=".125" width="17.75" height="10.75" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth=".25" />
    </>
  );
}

export default function FinnishFlag({ width = 36, className = '' }: { width?: number; className?: string }) {
  return (
    <svg
      width={width}
      height={(width * 11) / 18}
      viewBox="0 0 18 11"
      className={`block shrink-0 ${className}`}
      role="img"
      aria-label="Flag of Finland"
    >
      <FinnishFlagShapes />
    </svg>
  );
}
