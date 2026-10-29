// ============================================================================
// Component: components/route/flags.tsx
// National flags for the route guides, drawn from the construction sheets on
// Wikimedia Commons (public domain): official proportions, official colours.
// Each `draw` works in the flag's own user space (w × h). `uid` keeps the
// clip-path ids unique when the same flag appears more than once on a page.
// No hooks — usable from server and client components alike.
// ============================================================================
import React from 'react';

export type FlagCode = 'fi' | 'dk' | 'it' | 'nl' | 'tr' | 'il' | 'au' | 'ca' | 'ae' | 'ee' | 'es' | 'bg';

export interface FlagDef {
  name: string;
  w: number;
  h: number;
  draw: (uid: string) => React.ReactNode;
}

// Australia: Union Jack canton, Commonwealth Star, Southern Cross.
const STAR7 = 'M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z';
const STAR5 = 'M0,-210 54.859957,-75.508253 199.721868,-64.893569 88.765275,28.841586 123.434903,169.893569 0,93.333333 -123.434903,169.893569 -88.765275,28.841586 -199.721868,-64.893569 -54.859957,-75.508253z';

export const FLAGS: Record<FlagCode, FlagDef> = {
  fi: {
    name: 'Finland',
    w: 18,
    h: 11,
    draw: () => (
      <>
        <rect width="18" height="11" fill="#fff" />
        <path d="M0,5.5h18M6.5,0v11" stroke="#002F6C" strokeWidth="3" />
      </>
    ),
  },
  dk: {
    name: 'Denmark',
    w: 37,
    h: 28,
    draw: () => (
      <>
        <path fill="#c8102e" d="M0,0H37V28H0Z" />
        <path stroke="#fff" strokeWidth="4" d="M0,14h37M14,0v28" />
      </>
    ),
  },
  it: {
    name: 'Italy',
    w: 3,
    h: 2,
    draw: () => (
      <>
        <rect width="3" height="2" fill="#009246" />
        <rect width="2" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#ce2b37" />
      </>
    ),
  },
  nl: {
    name: 'the Netherlands',
    w: 9,
    h: 6,
    draw: () => (
      <>
        <rect fill="#21468B" width="9" height="6" />
        <rect fill="#fff" width="9" height="4" />
        <rect fill="#AE1C28" width="9" height="2" />
      </>
    ),
  },
  tr: {
    name: 'Türkiye',
    w: 90000,
    h: 60000,
    draw: () => (
      <g transform="translate(0 30000)">
        <path fill="#e30a17" d="m0-30000h90000v60000H0z" />
        <path fill="#fff" d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z" />
      </g>
    ),
  },
  il: {
    name: 'Israel',
    w: 1100,
    h: 800,
    draw: () => (
      <>
        <path d="M0,0H1100V800H0Z" fill="#fff" />
        <path d="M0,75H1100V200H0Z" fill="#0038b8" />
        <path d="M0,600H1100V725H0Z" fill="#0038b8" />
        <path d="M423.81566,472.85253H676.18435L550.00001,254.29492Zm126.18435,72.85255 126.1843,-218.55765H423.81566Z" fill="none" stroke="#0038b8" strokeWidth="27.5" />
      </>
    ),
  },
  au: {
    name: 'Australia',
    w: 10080,
    h: 5040,
    draw: (uid) => (
      <>
        <defs>
          <clipPath id={`${uid}-au1`}><path d="M0,0H6V3H0z" /></clipPath>
          <clipPath id={`${uid}-au2`}><path d="M0,0V1.5H6V3H6zM6,0H3V3H0V3z" /></clipPath>
        </defs>
        <g transform="scale(840)">
          <rect width="12" height="6" fill="#00008b" />
          <path d="M0,0 6,3M6,0 0,3" stroke="#fff" strokeWidth="0.6" clipPath={`url(#${uid}-au1)`} />
          <path d="M0,0 6,3M6,0 0,3" stroke="#f00" strokeWidth="0.4" clipPath={`url(#${uid}-au2)`} />
          <path d="M3,0V3M0,1.5H6" stroke="#fff" />
          <path d="M3,0V3M0,1.5H6" stroke="#f00" strokeWidth="0.6" />
        </g>
        <g fill="#fff">
          <path d={STAR7} transform="translate(2520 3780) scale(2.1)" />
          <path d={STAR7} transform="translate(7560 4200)" />
          <path d={STAR7} transform="translate(6300 2205)" />
          <path d={STAR7} transform="translate(7560 840)" />
          <path d={STAR7} transform="translate(8680 1869)" />
          <path d={STAR5} transform="translate(8064 2730)" />
        </g>
      </>
    ),
  },
  ca: {
    name: 'Canada',
    w: 9600,
    h: 4800,
    draw: () => (
      <>
        <path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" />
        <path
          fill="#fff"
          d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
        />
      </>
    ),
  },
  ae: {
    name: 'the United Arab Emirates',
    w: 12,
    h: 6,
    draw: () => (
      <>
        <rect width="12" height="6" fill="#00843d" />
        <rect width="12" height="4" y="2" fill="#fff" />
        <rect width="12" height="2" y="4" fill="#000" />
        <rect width="3" height="6" fill="#c8102e" />
      </>
    ),
  },
  ee: {
    name: 'Estonia',
    w: 990,
    h: 630,
    draw: () => (
      <>
        <path d="m0 0h990v315H0z" fill="#0072ce" />
        <path d="m0 210h990v315H0z" fill="#000" />
        <path d="m0 420h990v210H0z" fill="#fff" />
      </>
    ),
  },
  // Spain: the civil flag (no coat of arms), lawful for civil use and legible at icon size.
  es: {
    name: 'Spain',
    w: 750,
    h: 500,
    draw: () => (
      <>
        <rect width="750" height="500" fill="#c60b1e" />
        <rect width="750" height="250" y="125" fill="#ffc400" />
      </>
    ),
  },
  bg: {
    name: 'Bulgaria',
    w: 5,
    h: 3,
    draw: () => (
      <>
        <rect width="5" height="3" fill="#fff" />
        <rect width="5" height="2" y="1" fill="#00966E" />
        <rect width="5" height="1" y="2" fill="#D62612" />
      </>
    ),
  },
};

/** The flag's shapes plus a hairline edge, in its own user space — for nesting inside another SVG. */
export function FlagShapes({ code, uid }: { code: FlagCode; uid: string }) {
  const f = FLAGS[code];
  return (
    <>
      {f.draw(uid)}
      <rect width={f.w} height={f.h} fill="none" stroke="rgba(0,0,0,.2)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </>
  );
}

export default function Flag({ code, width = 36, uid = 'flag', className = '' }: { code: FlagCode; width?: number; uid?: string; className?: string }) {
  const f = FLAGS[code];
  return (
    <svg
      width={width}
      height={(width * f.h) / f.w}
      viewBox={`0 0 ${f.w} ${f.h}`}
      className={`block shrink-0 ${className}`}
      role="img"
      aria-label={`Flag of ${f.name}`}
    >
      <FlagShapes code={code} uid={uid} />
    </svg>
  );
}
