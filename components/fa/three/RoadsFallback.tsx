// ============================================================================
// Component: components/fa/three/RoadsFallback.tsx
// The same globe as a static SVG — for reduced motion, no WebGL, and as the
// server-rendered placeholder before the 3D bundle arrives. Same projection
// maths (lib/fa/geo), same palette, so the swap is quiet.
// ============================================================================
import React from 'react';
import { project, greatCircle, centroidLatLng, TEHRAN, type Destination } from '@/lib/fa/geo';

const D2R = Math.PI / 180;

/** Lift a 3D arc point back to lat/lng so the SVG can project it. */
function toLatLng([x, y, z]: [number, number, number]) {
  const len = Math.hypot(x, y, z) || 1;
  const lat = 90 - Math.acos(y / len) / D2R;
  const lng = Math.atan2(z / len, -x / len) / D2R - 180;
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

export default function RoadsFallback({ destinations, className }: { destinations: Destination[]; className?: string }) {
  const center = centroidLatLng([TEHRAN, ...destinations]);
  const S = 200;
  const px = (v: number) => S / 2 + v * (S / 2 - 6);
  const t = project(TEHRAN, center);

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className={className} role="img" aria-label="نقشه‌ی مسیرها از تهران">
      <circle cx={S / 2} cy={S / 2} r={S / 2 - 6} fill="#1a1a1a" />
      {[-60, -30, 0, 30, 60].map((lat) => {
        const d = Array.from({ length: 61 }, (_, i) => project({ lat, lng: -180 + i * 6 }, center))
          .filter((p) => p.visible)
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.x).toFixed(1)} ${px(p.y).toFixed(1)}`)
          .join(' ');
        return <path key={lat} d={d} fill="none" stroke="#F2F0E9" strokeOpacity="0.16" strokeWidth="0.6" />;
      })}
      {destinations.map((dest) => {
        const pts = greatCircle(TEHRAN, dest, 48).map((p) => project(toLatLng(p), center));
        const d = pts.filter((p) => p.visible).map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.x).toFixed(1)} ${px(p.y).toFixed(1)}`).join(' ');
        const e = project(dest, center);
        return (
          <g key={dest.id}>
            <path d={d} fill="none" stroke="#CCFF00" strokeWidth="1.6" strokeLinecap="round" />
            {e.visible && <circle cx={px(e.x)} cy={px(e.y)} r="2.4" fill="#CCFF00" />}
          </g>
        );
      })}
      {t.visible && <circle cx={px(t.x)} cy={px(t.y)} r="3.2" fill="#F2F0E9" />}
    </svg>
  );
}
