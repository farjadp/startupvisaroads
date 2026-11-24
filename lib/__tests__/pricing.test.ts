// The pricing page is the only public page with VisaRoads prices, so what it
// may show is held here: Farjad's fees exactly, no TBD and no number-less
// "TBD" in production, legal gates and hidden groups respected, the UTM
// exact, the banned words absent, and the save action admin-only.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const cookieStore = { value: undefined as string | undefined };
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (name === 'admin_session' && cookieStore.value !== undefined ? { name, value: cookieStore.value } : undefined),
  }),
}));
const db = vi.hoisted(() => ({ pricingContent: { upsert: vi.fn(async () => null), findUnique: vi.fn(async () => null) } }));
vi.mock('@/lib/prisma', () => ({ default: db }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { DEFAULT_PRICING } from '@/lib/pricing/defaults';
import { formatAmount, readinessHref, resolveCopy, resolveGroups } from '@/lib/pricing/resolve';
import { normalizePricing, parsePrice } from '@/lib/pricing/validate';
import { pricingJsonLd } from '@/lib/pricing/json-ld';
import { CHROME, CANADA_KEYS, legalLine } from '@/lib/pricing/chrome';
import { TBD, type PricingDoc } from '@/lib/pricing/types';
import { savePricing } from '@/app/actions/pricingActions';
import { signJWT } from '@/lib/auth';
import { FA_PAIRED, isFaPath } from '@/lib/fa/paths';
import { EN_INDEXABLE_PATHS } from '@/lib/pageMeta';

const LIVE = { showDrafts: false };
const DEV = { showDrafts: true };
const clone = (): PricingDoc => JSON.parse(JSON.stringify(DEFAULT_PRICING));
const withGroup = (key: string, patch: Partial<PricingDoc['groups'][number]>): PricingDoc => {
  const d = clone();
  d.groups = d.groups.map((g) => (g.key === key ? { ...g, ...patch } : g));
  return d;
};

describe('production visibility', () => {
  it('shows no TBD anywhere, in either language', () => {
    for (const l of ['en', 'fa'] as const) {
      const out = JSON.stringify({ g: resolveGroups(DEFAULT_PRICING, l, LIVE), c: resolveCopy(DEFAULT_PRICING.copy[l], l, LIVE) });
      expect(out).not.toContain(TBD);
      expect(out).not.toMatch(/TBD/);
    }
  });

  it('publishes Farjad’s fixed fees (23 Nov 2026)', () => {
    const fee = (key: string) => resolveGroups(DEFAULT_PRICING, 'en', LIVE).find((g) => g.key === key)!;
    expect(fee('eu-nordic').prices.map((p) => p.amount)).toEqual([20000, 30000, 40000]);
    expect(fee('eu-nordic').currency).toBe('EUR');
    expect(fee('eu-spain-italy').prices.map((p) => p.amount)).toEqual([15000]);
    expect(fee('eu-belgium-bulgaria').prices.map((p) => p.amount)).toEqual([12000]);
    expect(fee('tr-tech-visa').prices.map((p) => p.amount)).toEqual([8000, 25000]);
    expect(fee('tr-tech-visa').currency).toBe('USD');
    expect(fee('ca-pnp').prices.map((p) => [p.label, p.amount])).toEqual([['British Columbia', 75000], ['Alberta', 70000], ['Other provinces', 60000]]);
    expect(fee('ca-high-impact').prices.map((p) => p.amount)).toEqual([88000, 133000]);
    expect(fee('us-founder').prices.map((p) => p.amount)).toEqual([55000]);
    expect(fee('us-founder').currency).toBe('USD');
  });

  it('hides a group that needs legal review until it is reviewed', () => {
    const gated = withGroup('ca-pnp', { requiresLegalReview: true, legalReviewed: false });
    expect(resolveGroups(gated, 'en', LIVE).map((g) => g.key)).not.toContain('ca-pnp');
    expect(resolveGroups(withGroup('ca-pnp', { requiresLegalReview: true, legalReviewed: true }), 'en', LIVE).map((g) => g.key)).toContain('ca-pnp');
    expect(resolveGroups(gated, 'en', DEV).find((g) => g.key === 'ca-pnp')!.awaitingLegalReview).toBe(true);
  });

  it('never shows a hidden group, even in dev', () => {
    const d = withGroup('us-founder', { status: 'hidden' });
    for (const o of [LIVE, DEV]) expect(resolveGroups(d, 'fa', o).map((g) => g.key)).not.toContain('us-founder');
  });

  it('shows a "soon" group without a number or lists, even if one is stored', () => {
    const d = withGroup('other-routes', { prices: [{ label: { en: 'x', fa: 'x' }, amount: 5000 }], includes: { en: ['x'], fa: ['x'] } });
    const g = resolveGroups(d, 'en', LIVE).find((x) => x.key === 'other-routes')!;
    expect(g.prices).toEqual([]);
    expect(g.includes).toEqual([]);
    expect(g.ctaHref).toBeNull();
  });

  it('drops a price line with no amount in production, keeps it marked in dev', () => {
    const d = withGroup('eu-nordic', { prices: [{ label: { en: 'Per family', fa: 'هر خانواده' }, amount: null }] });
    expect(resolveGroups(d, 'en', LIVE).find((g) => g.key === 'eu-nordic')!.prices).toEqual([]);
    expect(resolveGroups(d, 'en', DEV).find((g) => g.key === 'eu-nordic')!.prices).toEqual([{ label: 'Per family', amount: null }]);
  });

  it('drops a comparison row or list item with a TBD part, keeps final ones', () => {
    const c = resolveCopy(DEFAULT_PRICING.copy.en, 'en', LIVE);
    expect(c.comparison.rows).toEqual([]);
    expect(c.faq.items.length).toBe(6);
    expect(c.extras.items.length).toBe(4);
    const g = resolveGroups(DEFAULT_PRICING, 'en', LIVE).find((x) => x.key === 'eu-nordic')!;
    expect(g.includes).toEqual([]);
    expect(g.excludes.length).toBeGreaterThan(0);
    expect(g.duration).toBeNull();
  });

  it('shows the pilot status note', () => {
    expect(resolveGroups(DEFAULT_PRICING, 'fa', LIVE).find((g) => g.key === 'ca-high-impact')!.note).toContain('هنوز باز نشده');
  });
});

describe('schema', () => {
  const meta = { title: 'Pricing', description: 'd' };
  const services = (d: PricingDoc) => (pricingJsonLd(d, 'en', meta) as { '@type': string }[]).filter((x) => x['@type'] === 'Service') as any[];

  it('has a Service per priced group, one Offer per price line', () => {
    const s = services(DEFAULT_PRICING);
    expect(s.map((x) => x['@id'].split('#')[1])).toEqual(['eu-nordic', 'eu-spain-italy', 'eu-belgium-bulgaria', 'tr-tech-visa', 'ca-pnp', 'ca-high-impact', 'us-founder']);
    const nordic = s[0];
    expect(nordic.offers).toHaveLength(3);
    expect(nordic.offers[0]).toMatchObject({ '@type': 'Offer', name: 'Per family', price: 20000, priceCurrency: 'EUR' });
  });

  it('has no Service for an unpriced or legally gated group', () => {
    expect(services(withGroup('us-founder', { prices: [] })).map((x) => x['@id'])).not.toContain('https://visaroads.com/en/pricing#us-founder');
    expect(services(withGroup('ca-pnp', { requiresLegalReview: true })).some((x) => x['@id'].endsWith('#ca-pnp'))).toBe(false);
  });

  it('includes the FAQPage', () => {
    expect((pricingJsonLd(DEFAULT_PRICING, 'fa', meta) as { '@type': string }[]).some((x) => x['@type'] === 'FAQPage')).toBe(true);
  });
});

describe('links and numbers', () => {
  it('builds the readiness link with the exact UTM', () => {
    expect(readinessHref('https://readiness.visaroads.com', 'eu-finland')).toBe(
      'https://readiness.visaroads.com?utm_source=visaroads.com&utm_medium=pricing_page&utm_campaign=pricing&utm_content=eu-finland',
    );
    const g = resolveGroups(DEFAULT_PRICING, 'en', LIVE).find((x) => x.key === 'tr-tech-visa')!;
    expect(g.ctaHref).toContain('utm_content=tr-tech-visa');
  });

  it('formats Persian numbers with Persian digits and separators', () => {
    expect(formatAmount(12500, 'fa')).toBe('۱۲٬۵۰۰');
    expect(formatAmount(12500, 'en')).toBe('12,500');
  });

  it('parses prices, rejecting text and zero', () => {
    expect(parsePrice('3,500')).toBe(3500);
    expect(parsePrice('۳٬۵۰۰')).toBe(3500);
    expect(parsePrice('TBD')).toBeNull();
    expect(parsePrice('0')).toBeNull();
    expect(parsePrice('')).toBeNull();
  });
});

describe('normalisation', () => {
  it('cannot set a legal gate, add a group, or store a non-https CTA', () => {
    const evil = clone() as any;
    evil.groups.find((g: any) => g.key === 'ca-pnp').requiresLegalReview = true;
    evil.groups.find((g: any) => g.key === 'eu-nordic').ctaUrl = 'javascript:alert(1)';
    evil.groups.find((g: any) => g.key === 'eu-nordic').prices[0].amount = 'TBD';
    evil.groups.push({ ...evil.groups[0], key: 'b2b-canreach' });
    const d = normalizePricing(evil);
    expect(d.groups.find((g) => g.key === 'ca-pnp')!.requiresLegalReview).toBe(false);
    expect(d.groups.find((g) => g.key === 'eu-nordic')!.ctaUrl).toBe('https://readiness.visaroads.com');
    expect(d.groups.find((g) => g.key === 'eu-nordic')!.prices[0].amount).toBeNull();
    expect(d.groups.map((g) => g.key)).toEqual(DEFAULT_PRICING.groups.map((g) => g.key));
  });

  it('round-trips the defaults unchanged', () => {
    expect(normalizePricing(JSON.parse(JSON.stringify(DEFAULT_PRICING)))).toEqual(DEFAULT_PRICING);
  });
});

describe('copy rules', () => {
  const all = JSON.stringify({ DEFAULT_PRICING, CHROME });
  it('never says guarantee or immigration consulting', () => {
    expect(all).not.toMatch(/guarantee|تضمین|immigration consult|مشاوره‌?ی? مهاجرت/i);
  });
  it('puts the lawyer line on both Canada cards and the attorney line on the US card', () => {
    expect(CHROME.fa.canadaLawyer).toBe('بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد. هزینه‌ی وکیل جداست.');
    for (const k of CANADA_KEYS) expect(legalLine(k, CHROME.en)).toBe(CHROME.en.canadaLawyer);
    expect(legalLine('us-founder', CHROME.fa)).toBe(CHROME.fa.usAttorney);
    expect(legalLine('eu-nordic', CHROME.en)).toBeNull();
  });
  it('does not title Canada as SUV or a BC PNP package', () => {
    for (const k of CANADA_KEYS) {
      const ca = DEFAULT_PRICING.groups.find((g) => g.key === k)!;
      expect(JSON.stringify(ca.title)).not.toMatch(/SUV|PNP|package|ویزای استارتاپ|بسته/i);
    }
  });
});

describe('routing', () => {
  it('exists in both languages and pairs them', () => {
    expect(isFaPath('/pricing')).toBe(true);
    expect(FA_PAIRED['/pricing']).toBe('/pricing');
    expect(EN_INDEXABLE_PATHS).toContain('/pricing');
  });
});

describe('savePricing', () => {
  const SECRET = 'test-secret-at-least-16-chars';
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', SECRET);
    db.pricingContent.upsert.mockClear();
    cookieStore.value = undefined;
  });
  afterEach(() => vi.unstubAllEnvs());

  it('rejects a caller without an admin session before touching the db', async () => {
    const res = await savePricing(JSON.stringify(DEFAULT_PRICING));
    expect(res.success).toBe(false);
    expect(db.pricingContent.upsert).not.toHaveBeenCalled();
  });

  it('stores the normalised document for an admin', async () => {
    cookieStore.value = await signJWT({ username: 'farjad' }, SECRET);
    const res = await savePricing(JSON.stringify(DEFAULT_PRICING));
    expect(res.success).toBe(true);
    expect(db.pricingContent.upsert).toHaveBeenCalledTimes(1);
  });
});
