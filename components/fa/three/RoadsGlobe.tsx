'use client';

// ============================================================================
// Component: components/fa/three/RoadsGlobe.tsx
// The roads globe: an ink Earth with paper coastlines, and the routes out of
// Tehran drawn in acid lime. The draw-on of the routes is the one authored
// motion moment on a Persian page; after it the globe idles.
//
// The first version had no coastlines and read as a black disc. Land is what
// makes a sphere read as Earth — that is the whole job of LAND_RINGS here.
// Loaded only through RoadsScene (dynamic, in view, no reduced motion).
// ============================================================================
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { greatCircle, latLngToVec3, centroidLatLng, TEHRAN, type Destination, type Vec3 } from '@/lib/fa/geo';
import { LAND_RINGS } from '@/lib/fa/land';

const INK = '#1a1a1a';
const PAPER = '#F2F0E9';
const ACID = '#CCFF00';
const R = 1;

function Land() {
  const rings = useMemo(
    () => LAND_RINGS.map((ring) => ring.map(([lng, lat]) => latLngToVec3({ lat, lng }, R * 1.004))),
    [],
  );
  return (
    <group>
      {rings.map((pts, i) => (
        <Line key={i} points={pts} color={PAPER} lineWidth={1.4} transparent opacity={0.85} />
      ))}
    </group>
  );
}

function Graticule() {
  const lines = useMemo(() => {
    const out: Vec3[][] = [];
    for (const lat of [-60, -30, 0, 30, 60]) {
      const ring: Vec3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) ring.push(latLngToVec3({ lat, lng }, R * 1.002));
      out.push(ring);
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const mer: Vec3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) mer.push(latLngToVec3({ lat, lng }, R * 1.002));
      out.push(mer);
    }
    return out;
  }, []);
  return (
    <group>
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color={PAPER} lineWidth={0.7} transparent opacity={0.22} />
      ))}
    </group>
  );
}

function Marker({ at, color, size }: { at: Destination | typeof TEHRAN; color: string; size: number }) {
  return (
    <mesh position={latLngToVec3(at, R * 1.012)}>
      <sphereGeometry args={[size, 14, 14]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Route({ to, delay, animate }: { to: Destination; delay: number; animate: boolean }) {
  const pts = useMemo(() => greatCircle(TEHRAN, to, 72, R), [to]);
  const total = useMemo(() => {
    let l = 0;
    for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
    return l;
  }, [pts]);
  const core = useRef<any>(null);
  const halo = useRef<any>(null);
  const t0 = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const set = (ref: typeof core, gapScale: number) => {
      const mat = ref.current?.material;
      if (!mat) return;
      if (!animate) { mat.dashSize = total; mat.gapSize = 0; return; }
      if (t0.current === null) t0.current = clock.elapsedTime;
      const t = Math.max(0, clock.elapsedTime - t0.current - delay);
      const p = 1 - Math.pow(1 - Math.min(1, t / 1.4), 3); // ease-out cubic, 1.4s
      mat.dashSize = total * p;
      mat.gapSize = total * gapScale;
    };
    set(halo, 4);
    set(core, 4);
  });

  return (
    <group>
      {/* soft wide pass under a crisp thin one: reads as a lit route without a bloom pass */}
      <Line ref={halo} points={pts} color={ACID} lineWidth={6} transparent opacity={0.22} dashed dashSize={0} gapSize={total * 4} />
      <Line ref={core} points={pts} color={ACID} lineWidth={2.2} dashed dashSize={0} gapSize={total * 4} />
      <Marker at={to} color={ACID} size={0.026} />
    </group>
  );
}

function Globe({ destinations, animate }: { destinations: Destination[]; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const focus = useMemo(() => centroidLatLng([TEHRAN, ...destinations]), [destinations]);
  const baseY = useMemo(() => -((focus.lng + 180) * Math.PI) / 180 + Math.PI / 2, [focus]);
  const baseX = useMemo(() => ((focus.lat * Math.PI) / 180) * 0.75, [focus]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const idle = animate ? Math.sin(clock.elapsedTime * 0.13) * 0.16 : 0;
    group.current.rotation.set(baseX, baseY + idle, 0);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color={INK} roughness={0.85} metalness={0} />
      </mesh>
      <Graticule />
      <Land />
      <Marker at={TEHRAN} color={PAPER} size={0.032} />
      {destinations.map((d, i) => (
        <Route key={d.id} to={d} delay={0.3 + i * 0.2} animate={animate} />
      ))}
    </group>
  );
}

export default function RoadsGlobe({ destinations, animate = true, className }: { destinations: Destination[]; animate?: boolean; className?: string }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 2.75], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={animate ? 'always' : 'demand'}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[-2.5, 2.5, 4]} intensity={1.4} color={PAPER} />
      <Globe destinations={destinations} animate={animate} />
    </Canvas>
  );
}
