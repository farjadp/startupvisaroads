// Turns engine data into sentences. Comparison symbols are never used in
// copy: "at least" reads correctly in every language and to screen readers.
import type { Check, PathfinderGap } from '@/engine/readiness';
import type { IconName } from './Icon';

type Fmt = { t: (p: string, v?: Record<string, string | number>) => string; money: (n: number, c: string) => string; count: (n: number) => string };

export function checkLabel(c: Check, f: Fmt): string {
  const n = c.need;
  switch (c.key) {
    case 'founders-min':
    case 'founders-max':
      // "At least 1 founders" reads wrong; one founder has its own phrase.
      if (n.count === 1) return f.t(`checks.${c.key}-one`);
      return f.t(`checks.${c.key}`, { count: f.count(n.count!) });
    case 'investment':
    case 'yearly-funds':
      return f.t(`checks.${c.key}`, { amount: f.money(n.amount!, n.currency!) });
    case 'clb':
      return f.t('checks.clb', { clb: n.clb! });
    case 'venture':
      return f.t(`checks.venture.${n.venture}`);
  }
}

export const CHECK_ICON: Record<Check['key'], IconName> = {
  'founders-min': 'people',
  'founders-max': 'people',
  investment: 'briefcase',
  'yearly-funds': 'wallet',
  clb: 'speech',
  venture: 'doc',
};

export function gapLabel(g: PathfinderGap, f: Fmt): string {
  return g === 'net-worth' ? f.t('result.gapNetWorth') : f.t('result.gapAge');
}
