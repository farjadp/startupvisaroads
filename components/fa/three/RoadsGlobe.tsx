'use client';

// ============================================================================
// Component: components/fa/three/RoadsGlobe.tsx
// The "roads" globe: an ink sphere with paper graticule, acid-lime routes
// drawn from Tehran to the page's destinations. The draw-on of the routes
// is the one authored motion moment on every Persian page; after it, the
// globe idles slowly. Loaded only through RoadsScene (dynamic, in view).
// ============================================================================
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { greatCircle, latLngToVec3, centroidLatLng, TEHRAN, type Destination, type Vec3 } from '@/lib/fa/geo';

const INK = '#1a1a1a';
const PAPER = '#F2F0E9';
const ACID = '#CCFF00';
const R = 1;

function Graticule() {
  const lines = useMemo(() => {
    const out: Vec3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: Vec3[] = [];
      for (let lng = -180; lng <= 180; lng += 6) ring.push(latLngToVec3({ lat, lng }, R * 1.001));
      out.push(ring);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const mer: Vec3[] = [];
      for (let lat = -90; lat <= 90; lat += 6) mer.push(latLngToVec3({ lat, lng }, R * 1.001));
      out.push(mer);
    }
    return out;
  }, []);
  return (
    <group>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color={PAPER} lineWidth={0.6} transparent opacity={0.16} />
      ))}
    </group>
  );
}

function Route({ to, delay, animate }: { to: Destination; delay: number; animate: boolean }) {
  const pts = useMemo(() => greatCircle(TEHRAN, to, 64, R), [to]);
  const total = useMemo(() => {
    let l = 0;
    for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
    return l;
  }, [pts]);
  const ref = useRef<any>(null);
  const t0 = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const mat = ref.current?.material;
    if (!mat) return;
    if (!animate) { mat.dashSize = total; mat.gapSize = 0; return; }
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = Math.max(0, clock.elapsedTime - t0.current - delay);
    const p = 1 - Math.pow(1 - Math.min(1, t / 1.4), 3); // ease-out cubic over 1.4s
    mat.dashSize = total * p;
    mat.gapSize = total * 4;
  });

  return (
    <group>
      <Line ref={ref} points={pts} color={ACID} lineWidth={2} dashed dashSize={0} gapSize={total * 4} />
      <mesh position={latLngToVec3(to, R * 1.01)}>
        <sphereGeometry args={[0.018, 12, 12]} />
        <meshBasicMaterial color={ACID} />
      </mesh>
    </group>
  );
}

function Globe({ destinations, animate }: { destinations: Destination[]; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const focus = useMemo(() => centroidLatLng([TEHRAN, ...destinations]), [destinations]);
  // Rotate so the focus point faces +z (the camera).
  const baseY = useMemo(() => -((focus.lng + 180) * Math.PI) / 180 + Math.PI / 2, [focus]);
  const baseX = useMemo(() => (focus.lat * Math.PI) / 180 * 0.8, [focus]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const idle = animate ? Math.sin(clock.elapsedTime * 0.15) * 0.18 : 0;
    group.current.rotation.set(baseX, baseY + idle, 0);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color={INK} roughness={0.95} metalness={0} />
      </mesh>
      <Graticule />
      <mesh position={latLngToVec3(TEHRAN, R * 1.01)}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={PAPER} />
      </mesh>
      {destinations.map((d, i) => (
        <Route key={d.id} to={d} delay={0.25 + i * 0.22} animate={animate} />
      ))}
    </group>
  );
}

export default function RoadsGlobe({ destinations, animate = true, className }: { destinations: Destination[]; animate?: boolean; className?: string }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 2.9], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={animate ? 'always' : 'demand'}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[-2, 3, 4]} intensity={1.1} color={PAPER} />
      <Globe destinations={destinations} animate={animate} />
    </Canvas>
  );
}
