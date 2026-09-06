import { describe, it, expect } from 'vitest';
import { DESTINATIONS, destinationsFor, configured, type Destination } from '../destinations';

const creds = (d: Destination, present: string[]) =>
  Object.fromEntries(present.map((k) => [k, 'x'])) as Record<string, string | undefined>;

describe('the destination registry', () => {
  it('declares a platform, the locales it accepts and its credential keys', () => {
    for (const d of DESTINATIONS) {
      expect(d.id, 'id').toMatch(/^[a-z0-9-]+$/);
      expect(['telegram', 'linkedin', 'x'], d.id).toContain(d.platform);
      expect(d.locales.length, d.id).toBeGreaterThan(0);
      expect(d.credentials.length, d.id).toBeGreaterThan(0);
    }
  });

  it('has a unique id per destination', () => {
    expect(new Set(DESTINATIONS.map((d) => d.id)).size).toBe(DESTINATIONS.length);
  });

  it('returns the destinations that carry the article\'s language', () => {
    const fa = destinationsFor('fa').map((d) => d.id);
    const en = destinationsFor('en').map((d) => d.id);
    for (const d of DESTINATIONS) {
      expect(fa.includes(d.id), `${d.id} for fa`).toBe(d.locales.includes('fa'));
      expect(en.includes(d.id), `${d.id} for en`).toBe(d.locales.includes('en'));
    }
  });

  // "Not set up" and "tried and failed" need different responses from a human,
  // so the caller has to be able to tell them apart before sending anything.
  it('reports a destination with no credentials as unconfigured, not as postable', () => {
    const d = DESTINATIONS[0];
    expect(configured(d, {})).toBe(false);
    expect(configured(d, creds(d, d.credentials))).toBe(true);
  });

  it('treats a partially configured destination as unconfigured', () => {
    const d = DESTINATIONS.find((x) => x.credentials.length > 1);
    if (!d) return;
    expect(configured(d, creds(d, d.credentials.slice(0, -1)))).toBe(false);
  });

  it('treats an empty-string credential as missing, which is what an unset env var looks like', () => {
    const d = DESTINATIONS[0];
    const half = Object.fromEntries(d.credentials.map((k) => [k, '']));
    expect(configured(d, half)).toBe(false);
  });

  // The escape hatch from the spec: auto-posting was Farjad's call, and any
  // one destination has to be movable to review without a redesign.
  it('lets each destination decide whether it posts automatically', () => {
    for (const d of DESTINATIONS) expect(typeof d.autoPost, d.id).toBe('boolean');
  });
});
