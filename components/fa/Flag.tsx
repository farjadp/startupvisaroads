// ============================================================================
// Component: components/fa/Flag.tsx
// The European flags, drawn as inline SVG at their legislated
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
  trRed: '#E30A17',
  caRed: '#D52B1E',
  auBlue: '#012169',
  auRed: '#E4002B',
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
    // Official artwork (Wikimedia Commons, public domain), authored on a
    // vertically centred canvas. Translated down by half the height rather
    // than re-derived, so the legislated crescent and star geometry is the
    // published one and not something drawn by eye. Star and crescent are a
    // single subpath pair: the inner arc runs the opposite way, punching the
    // crescent out under the default nonzero fill rule.
    case 'tr':
      return (
        <>
          <rect width={90000} height={60000} fill={C.trRed} />
          <g transform="translate(0 30000)">
            <path
              fill={C.white}
              d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z"
            />
          </g>
        </>
      );
    // Official Pantone artwork (Wikimedia Commons, public domain). The white
    // path carries the pale field and the leaf as one subpath, so the default
    // nonzero fill rule punches the leaf out and the red beneath shows
    // through — which is why the red rect underneath must be full-bleed.
    // Official artwork (Wikimedia Commons, public domain), authored at
    // 10080x5040. Nothing here is redrawn: the Union Jack's offset saltire
    // needs those two clip paths to come out right, the Commonwealth Star has
    // seven points, and the Southern Cross is four seven-pointed stars plus a
    // five-pointed Epsilon. Every one of those is a thing you get subtly
    // wrong by eye.
    //
    // The ids are namespaced `au-` rather than made unique per instance:
    // Flag renders in both server and client components, so useId is not
    // available, and two Australian flags on one page would resolve their
    // clip-path references to identical definitions anyway.
    case 'au':
      return (
        <>
          <defs>
            <clipPath id="au-c1">
              <path d="M0,0H6V3H0z" />
            </clipPath>
            <clipPath id="au-c2">
              <path d="M0,0V1.5H6V3H6zM6,0H3V3H0V3z" />
            </clipPath>
          </defs>
          <g transform="scale(840)">
            <rect width={12} height={6} fill={C.auBlue} />
            <path d="M0,0 6,3M6,0 0,3" stroke={C.white} strokeWidth={0.6} clipPath="url(#au-c1)" />
            <path d="M0,0 6,3M6,0 0,3" stroke={C.auRed} strokeWidth={0.4} clipPath="url(#au-c2)" />
            <path d="M3,0V3M0,1.5H6" stroke={C.white} />
            <path d="M3,0V3M0,1.5H6" stroke={C.auRed} strokeWidth={0.6} />
          </g>
          <g fill={C.white}>
            <path d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z" transform="translate(2520 3780) scale(2.1)" />
            <path d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z" transform="translate(7560 4200)" />
            <path d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z" transform="translate(6300 2205)" />
            <path d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z" transform="translate(7560 840)" />
            <path d="M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z" transform="translate(8680 1869)" />
            <path d="M0,-210 54.859957,-75.508253 199.721868,-64.893569 88.765275,28.841586 123.434903,169.893569 0,93.333333 -123.434903,169.893569 -88.765275,28.841586 -199.721868,-64.893569 -54.859957,-75.508253z" transform="translate(8064 2730)" />
          </g>
        </>
      );
    case 'ca':
      return (
        <>
          <rect width={9600} height={4800} fill={C.caRed} />
          <path
            fill={C.white}
            d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
          />
        </>
      );
  }
}

export default function Flag({ code, className }: { code: FlagCode; className?: string }) {
  // Canada's official artwork is authored at 9600x4800; the others are drawn
  // directly in their ratio units.
  const { w, h } =
    code === 'ca'
      ? { w: 9600, h: 4800 }
      : code === 'tr'
        ? { w: 90000, h: 60000 }
        : code === 'au'
          ? { w: 10080, h: 5040 }
          : FLAG_RATIO[code];
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
