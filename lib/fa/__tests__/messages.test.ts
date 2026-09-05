import { describe, it, expect } from 'vitest';
import en from '@/messages/en.json';
import fa from '@/messages/fa.json';

/** Every leaf key path in a nested message object. */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object'
      ? keyPaths(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

describe('message catalogs', () => {
  it('en and fa have exactly the same keys', () => {
    const e = keyPaths(en).sort();
    const f = keyPaths(fa).sort();
    expect(f.filter((k) => !e.includes(k))).toEqual([]);
    expect(e.filter((k) => !f.includes(k))).toEqual([]);
  });

  it('has no empty Persian string', () => {
    for (const path of keyPaths(fa)) {
      const value = path.split('.').reduce<any>((o, k) => o?.[k], fa);
      expect(String(value).trim(), path).not.toBe('');
    }
  });

  it('covers the shared chrome namespaces', () => {
    for (const ns of ['Footer', 'Navigation']) {
      expect(Object.keys(fa)).toContain(ns);
    }
  });
});
