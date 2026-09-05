// ============================================================================
// Component: components/fa/three/RoadsFallback.tsx
// The same globe as static SVG — for reduced motion, no WebGL, and as the
// server-rendered picture before the 3D bundle arrives. Same projection and
// same coastlines as the WebGL version, so the swap is quiet.
//
// Every coordinate is rounded before it reaches an attribute: unrounded
// floats serialise differently on server and client and break hydration.
// ============================================================================
import React from 'react';
import { project, greatCircle, centroidLatLng, TEHRAN, type Destination, type LatLng } from '@/lib/fa/geo';
import { LAND_RINGS } from '@/lib/fa/land';

const D2R = Math.PI / 180;

/** Lift a 3D arc point back to lat/lng so the SVG can project it. */
function toLatLng([x, y, z]: [number, number, number]): LatLng {
  const len = Math.hypot(x, y, z) || 1;
  const lat = 90 - Math.acos(y / len) / D2R;
  const lng = Math.atan2(z / len, -x / len) / D2R - 180;
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

const S = 200;
const px = (v: number) => Number((S / 2 + v * (S / 2 - 6)).toFixed(2));

/** Project a path and break it wherever it crosses behind the globe. */
function visibleRuns(points: LatLng[], center: LatLng): string {
  const runs: string[][] = [];
  let run: string[] = [];
  for (const p of points) {
    const q = project(p, center);
    if (q.visible) {
      run.push(`${px(q.x)} ${px(q.y)}`);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);
  return runs
    .filter((r) => r.length > 1)
    .map((r) => `M${r.join(' L')}`)
    .join(' ');
}

export default function RoadsFallback({ destinations, className }: { destinations: Destination[]; className?: string }) {
  const center = centroidLatLng([TEHRAN, ...destinations]);
  const t = project(TEHRAN, center);

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className={className} role="img" aria-label="نقشه‌ی مسیرها از تهران به مقاصد این صفحه">
      <circle cx={S / 2} cy={S / 2} r={S / 2 - 6} fill="#1a1a1a" />
      {[-60, -30, 0, 30, 60].map((lat) => (
        <path
          key={`p${lat}`}
          d={visibleRuns(Array.from({ length: 73 }, (_, i) => ({ lat, lng: -180 + i * 5 })), center)}
          fill="none"
          stroke="#F2F0E9"
          strokeOpacity="0.22"
          strokeWidth="0.6"
        />
      ))}
      {Array.from({ length: 12 }, (_, k) => -180 + k * 30).map((lng) => (
        <path
          key={`m${lng}`}
          d={visibleRuns(Array.from({ length: 37 }, (_, i) => ({ lat: -90 + i * 5, lng })), center)}
          fill="none"
          stroke="#F2F0E9"
          strokeOpacity="0.22"
          strokeWidth="0.6"
        />
      ))}
      {LAND_RINGS.map((ring, i) => (
        <path
          key={`l${i}`}
          d={visibleRuns(ring.map(([lng, lat]) => ({ lat, lng })), center)}
          fill="none"
          stroke="#F2F0E9"
          strokeOpacity="0.85"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      ))}
      {destinations.map((dest) => {
        const d = visibleRuns(greatCircle(TEHRAN, dest, 60).map(toLatLng), center);
        const e = project(dest, center);
        return (
          <g key={dest.id}>
            <path d={d} fill="none" stroke="#CCFF00" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
            <path d={d} fill="none" stroke="#CCFF00" strokeWidth="1.5" strokeLinecap="round" />
            {e.visible && <circle cx={px(e.x)} cy={px(e.y)} r="2.6" fill="#CCFF00" />}
          </g>
        );
      })}
      {t.visible && <circle cx={px(t.x)} cy={px(t.y)} r="3.2" fill="#F2F0E9" />}
    </svg>
  );
}
