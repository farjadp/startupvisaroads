// ============================================================================
// Component: components/fa/Flag.tsx
// The four European flags, drawn as inline SVG at their legislated
// proportions and official colours. No network request, no image file, no
// licence question, and sharp at any size.
//
// Two things this must not do:
//   - Mirror. The page is RTL, but a flag's hoist is on the left however the
//     text runs. Drawing explicit coordinates keeps it that way; never apply
//     an RTL transform to this.
//   - Float free of its meaning. Each flag carries the country's Persian name
//     for assistive technology, so it is never a decorative rectangle.
// ============================================================================
import React from 'react';
import { FLAG_NAME, FLAG_RATIO, type FlagCode } from '@/lib/fa/flags';

// Official specifications, not eyeballed web hex.
const C = {
  dkRed: '#C8102E',
  fiBlue: '#002F6C',
  nlRed: '#AE1C28',
  nlBlue: '#21468B',
  eeBlue: '#0072CE',
  eeBlack: '#000000',
  white: '#FFFFFF',
};

function Shapes({ code }: { code: FlagCode }) {
  switch (code) {
    // Nordic cross: bands at 12:4:12 vertically and 12:4:21 horizontally,
    // which is what puts the cross off-centre towards the hoist.
    case 'dk':
      return (
        <>
          <rect width={37} height={28} fill={C.dkRed} />
          <rect y={12} width={37} height={4} fill={C.white} />
          <rect x={12} width={4} height={28} fill={C.white} />
        </>
      );
    // 4:3:4 vertically, 5:3:10 horizontally.
    case 'fi':
      return (
        <>
          <rect width={18} height={11} fill={C.white} />
          <rect y={4} width={18} height={3} fill={C.fiBlue} />
          <rect x={5} width={3} height={11} fill={C.fiBlue} />
        </>
      );
    case 'nl':
      return (
        <>
          <rect width={3} height={2} fill={C.nlBlue} />
          <rect width={3} height={1} fill={C.white} />
          <rect width={3} height={0.6667} fill={C.nlRed} />
        </>
      );
    case 'ee':
      return (
        <>
          <rect width={11} height={7} fill={C.white} />
          <rect width={11} height={4.6667} fill={C.eeBlack} />
          <rect width={11} height={2.3333} fill={C.eeBlue} />
        </>
      );
  }
}

export default function Flag({ code, className }: { code: FlagCode; className?: string }) {
  const { w, h } = FLAG_RATIO[code];
  const name = FLAG_NAME[code];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`پرچم ${name}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <Shapes code={code} />
      {/* A hairline, because three of the four flags carry white to the edge
          and would otherwise bleed into a pale background. */}
      <rect width={w} height={h} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={h / 40} />
    </svg>
  );
}
