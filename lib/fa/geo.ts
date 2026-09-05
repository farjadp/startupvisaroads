// ============================================================================
// lib/fa/geo.ts
// Pure geometry for the "roads" globe: destination coordinates, great-circle
// interpolation, and an orthographic projection for the SVG fallback. No
// three.js here so it stays testable and usable server-side.
// ============================================================================

export type LatLng = { lat: number; lng: number };
export type Destination = LatLng & { id: string; label: string };

export const TEHRAN: Destination = { id: 'tehran', label: 'تهران', lat: 35.69, lng: 51.39 };

export const DESTINATIONS: Record<string, Destination> = {
  helsinki: { id: 'helsinki', label: 'هلسینکی', lat: 60.17, lng: 24.94 },
  copenhagen: { id: 'copenhagen', label: 'کپنهاگ', lat: 55.68, lng: 12.57 },
  tallinn: { id: 'tallinn', label: 'تالین', lat: 59.44, lng: 24.75 },
  amsterdam: { id: 'amsterdam', label: 'آمستردام', lat: 52.37, lng: 4.9 },
  fredericton: { id: 'fredericton', label: 'فردریکتون', lat: 45.96, lng: -66.64 },
  halifax: { id: 'halifax', label: 'هلیفکس', lat: 44.65, lng: -63.57 },
  toronto: { id: 'toronto', label: 'تورنتو', lat: 43.65, lng: -79.38 },
  washington: { id: 'washington', label: 'واشینگتن', lat: 38.9, lng: -77.04 },
};

export type Vec3 = [number, number, number];

const D2R = Math.PI / 180;

/** Lat/lng on a sphere of radius r → xyz (y up, lng 0 on +z). */
export function latLngToVec3({ lat, lng }: LatLng, r = 1): Vec3 {
  const phi = (90 - lat) * D2R;
  const theta = (lng + 180) * D2R;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

/**
 * Points along the great circle from a to b, lifted off the surface by a
 * parabolic bump so the arc reads as a route, not a seam. `n` is the number
 * of segments; returns n+1 points.
 */
export function greatCircle(a: LatLng, b: LatLng, n = 48, r = 1, lift = 0.18): Vec3[] {
  const [ax, ay, az] = latLngToVec3(a, 1);
  const [bx, by, bz] = latLngToVec3(b, 1);
  const dot = Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz));
  const omega = Math.acos(dot);
  const sinO = Math.sin(omega) || 1e-9;
  const pts: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const s1 = Math.sin((1 - t) * omega) / sinO;
    const s2 = Math.sin(t * omega) / sinO;
    const x = s1 * ax + s2 * bx;
    const y = s1 * ay + s2 * by;
    const z = s1 * az + s2 * bz;
    const len = Math.hypot(x, y, z) || 1;
    const h = r * (1 + lift * Math.sin(Math.PI * t) * Math.min(1, omega / 1.2));
    pts.push([(x / len) * h, (y / len) * h, (z / len) * h]);
  }
  return pts;
}

/** Centroid direction of a set of points, for aiming the globe at its destinations. */
export function centroidLatLng(points: LatLng[]): LatLng {
  let x = 0, y = 0, z = 0;
  for (const p of points) {
    const [px, py, pz] = latLngToVec3(p, 1);
    x += px; y += py; z += pz;
  }
  const len = Math.hypot(x, y, z) || 1;
  x /= len; y /= len; z /= len;
  const lat = 90 - Math.acos(y) / D2R;
  const lng = Math.atan2(z, -x) / D2R - 180;
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

/**
 * Orthographic projection for the SVG fallback: rotate so `center` faces
 * the viewer, return 2D coords in [-1, 1] and whether the point is on the
 * visible hemisphere.
 */
export function project(p: LatLng, center: LatLng): { x: number; y: number; visible: boolean } {
  const lat = p.lat * D2R, lng = p.lng * D2R;
  const cl = center.lat * D2R, cg = center.lng * D2R;
  const cosc = Math.sin(cl) * Math.sin(lat) + Math.cos(cl) * Math.cos(lat) * Math.cos(lng - cg);
  const x = Math.cos(lat) * Math.sin(lng - cg);
  const y = Math.cos(cl) * Math.sin(lat) - Math.sin(cl) * Math.cos(lat) * Math.cos(lng - cg);
  return { x, y: -y, visible: cosc >= 0 };
}
