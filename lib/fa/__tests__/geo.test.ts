import { describe, it, expect } from 'vitest';
import { latLngToVec3, greatCircle, centroidLatLng, project, TEHRAN, DESTINATIONS } from '../geo';

describe('latLngToVec3', () => {
  it('puts the north pole on +y and keeps unit length', () => {
    const [x, y, z] = latLngToVec3({ lat: 90, lng: 0 });
    expect(y).toBeCloseTo(1, 6);
    expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
  });
});

describe('greatCircle', () => {
  it('starts and ends on the endpoints and lifts in the middle', () => {
    const pts = greatCircle(TEHRAN, DESTINATIONS.helsinki, 40);
    expect(pts).toHaveLength(41);
    const r0 = Math.hypot(...pts[0]);
    const rMid = Math.hypot(...pts[20]);
    const rEnd = Math.hypot(...pts[40]);
    expect(r0).toBeCloseTo(1, 3);
    expect(rEnd).toBeCloseTo(1, 3);
    expect(rMid).toBeGreaterThan(1.02);
  });

  it('never produces NaN, even for near-identical points', () => {
    for (const p of greatCircle(TEHRAN, { lat: 35.7, lng: 51.4 }, 8)) for (const c of p) expect(Number.isNaN(c)).toBe(false);
  });
});

describe('centroidLatLng', () => {
  it('lands between Tehran and Helsinki', () => {
    const c = centroidLatLng([TEHRAN, DESTINATIONS.helsinki]);
    expect(c.lat).toBeGreaterThan(35);
    expect(c.lat).toBeLessThan(61);
    expect(c.lng).toBeGreaterThan(24);
    expect(c.lng).toBeLessThan(52);
  });
});

describe('project', () => {
  it('centres the focus point and hides the far side', () => {
    const c = project(TEHRAN, TEHRAN);
    expect(c.x).toBeCloseTo(0, 6);
    expect(c.y).toBeCloseTo(0, 6);
    expect(c.visible).toBe(true);
    const far = project({ lat: -35.69, lng: 51.39 - 180 }, TEHRAN);
    expect(far.visible).toBe(false);
  });
});
