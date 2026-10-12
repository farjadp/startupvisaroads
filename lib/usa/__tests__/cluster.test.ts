// ============================================================================
// The US cluster's tripwires: every link resolves in its own locale, the
// service page carries no figure and no approval-keyed fee, and the Iranian
// travel-ban notice reads from the one shared source.
// ============================================================================
import { describe, it, expect } from 'vitest';
import { FA_PATHS, FA_PAIRED } from '@/lib/fa/paths';
import { EN_INDEXABLE_PATHS } from '@/lib/pageMeta';
import { USA_CLUSTER } from '@/lib/usa/cluster';
import { USA_IRAN_STATUS_FA, USA_IRAN_STATUS_EN } from '@/lib/usa/travel-ban';
import type { FaPage } from '@/lib/fa/content';

import { page as faHub } from '@/content/fa/usa';
import { page as faO1 } from '@/content/fa/usa-o-1a';
import { page as faE2 } from '@/content/fa/usa-e-2';
import { page as faFail } from '@/content/fa/usa-why-petitions-fail';
import { page as faCmp } from '@/content/fa/usa-o-1a-eb-1a-niw';
import { page as faAssess } from '@/content/fa/usa-assessment';
import { page as faSvc } from '@/content/fa/usa-founder-readiness';
import { page as enHub } from '@/content/en/usa';
import { page as enO1 } from '@/content/en/usa-o-1a';
import { page as enE2 } from '@/content/en/usa-e-2';
import { page as enFail } from '@/content/en/usa-why-petitions-fail';
import { page as enCmp } from '@/content/en/usa-o-1a-eb-1a-niw';
import { page as enAssess } from '@/content/en/usa-assessment';
import { page as enSvc } from '@/content/en/usa-founder-readiness';

const FA = [faHub, faO1, faE2, faFail, faCmp, faAssess, faSvc];
const EN = [enHub, enO1, enE2, enFail, enCmp, enAssess, enSvc];
const internal = (p: FaPage) => [p.hero.cta, ...p.closing, ...(p.status?.cta ? [p.status.cta] : [])]
  .map((c) => c.href.split('#')[0])
  .filter((h) => h.startsWith('/'));
const text = (p: FaPage) => JSON.stringify(p);

describe('US cluster', () => {
  it('only links Persian pages to Persian paths', () => {
    for (const p of FA) {
      expect(FA_PATHS).toContain(p.path);
      for (const h of internal(p)) expect(FA_PATHS).toContain(h);
    }
  });

  it('only links English pages to indexable English paths', () => {
    for (const p of EN) {
      expect(EN_INDEXABLE_PATHS).toContain(p.path);
      for (const h of internal(p)) expect([...EN_INDEXABLE_PATHS]).toContain(h);
    }
  });

  it('pairs every Persian page with its English twin', () => {
    FA.forEach((p, i) => expect(FA_PAIRED[p.path as keyof typeof FA_PAIRED]).toBe(EN[i].path));
  });

  it('has a link grid entry for every page, in both locales', () => {
    for (const c of USA_CLUSTER) {
      expect(FA_PATHS).toContain(c.faPath);
      expect([...EN_INDEXABLE_PATHS]).toContain(c.enPath);
    }
  });

  it('puts no company figure on the service page and never keys the fee to approval', () => {
    for (const p of [faSvc, enSvc]) {
      expect(text(p)).not.toMatch(/[$€£]|دلار|یورو|CAD|USD/);
    }
    expect(text(enSvc)).toMatch(/never tied to visa approval/);
  });

  it('never claims an E-2 dollar minimum', () => {
    for (const p of [faE2, enE2]) expect(text(p)).not.toMatch(/\$\s?\d|\d+\s?هزار دلار/);
  });

  it('reads the Iranian travel-ban notice from the shared source', () => {
    for (const p of [faHub, faO1, faCmp, faSvc]) expect(p.status).toBe(USA_IRAN_STATUS_FA);
    for (const p of [enHub, enO1, enCmp, enSvc]) expect(p.status).toBe(USA_IRAN_STATUS_EN);
    expect(USA_IRAN_STATUS_EN.body).toContain('10998');
  });

  it('does not repeat the removed immediate-relatives exception', () => {
    expect(USA_IRAN_STATUS_EN.body.toLowerCase()).not.toContain('immediate relative');
  });
});
