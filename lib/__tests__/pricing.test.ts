// The pricing page is the only public page with VisaRoads prices, so what it
// may show is held here: no TBD and no number-less "TBD" in production, the
// Canada card gated on legal review, hidden groups gone, the UTM exact, the
// banned words absent, and the save action admin-only.
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
import { CHROME, CANADA_KEY } from '@/lib/pricing/chrome';
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

  it('hides the Canada card until legalReviewed, shows it after', () => {
    expect(resolveGroups(DEFAULT_PRICING, 'en', LIVE).map((g) => g.key)).not.toContain(CANADA_KEY);
    const reviewed = withGroup(CANADA_KEY, { legalReviewed: true });
    expect(resolveGroups(reviewed, 'en', LIVE).map((g) => g.key)).toContain(CANADA_KEY);
  });

  it('never shows a hidden group, even in dev', () => {
    for (const o of [LIVE, DEV]) expect(resolveGroups(DEFAULT_PRICING, 'fa', o).map((g) => g.key)).not.toContain('us-founder');
  });

  it('shows a "soon" group without a number or lists, even if one is stored', () => {
    const d = withGroup('eu-other', { startingFrom: 5000, includes: { en: ['x'], fa: ['x'] } });
    const g = resolveGroups(d, 'en', LIVE).find((x) => x.key === 'eu-other')!;
    expect(g.price).toBeNull();
    expect(g.includes).toEqual([]);
    expect(g.ctaHref).toBeNull();
  });

  it('shows a price only when a real number is set', () => {
    expect(resolveGroups(DEFAULT_PRICING, 'en', LIVE).find((g) => g.key === 'eu-finland')!.price).toBeNull();
    const priced = withGroup('eu-finland', { startingFrom: 3500 });
    expect(resolveGroups(priced, 'en', LIVE).find((g) => g.key === 'eu-finland')!.price).toEqual({ amount: 3500, currency: 'EUR' });
  });

  it('drops a comparison row or list item with a TBD part, keeps final ones', () => {
    const c = resolveCopy(DEFAULT_PRICING.copy.en, 'en', LIVE);
    expect(c.comparison.rows).toEqual([]);
    expect(c.faq.items.length).toBe(5);
    expect(c.extras.items.length).toBe(4);
    const g = resolveGroups(DEFAULT_PRICING, 'en', LIVE).find((x) => x.key === 'eu-finland')!;
    expect(g.includes).toEqual([]);
    expect(g.excludes.length).toBeGreaterThan(0);
    expect(g.duration).toBeNull();
  });

  it('keeps the gaps visible in dev', () => {
    const g = resolveGroups(DEFAULT_PRICING, 'en', DEV).find((x) => x.key === CANADA_KEY)!;
    expect(g.awaitingLegalReview).toBe(true);
    expect(g.includes).toContain(TBD);
  });
});

describe('schema', () => {
  const meta = { title: 'Pricing', description: 'd' };
  const services = (d: PricingDoc) => (pricingJsonLd(d, 'en', meta) as { '@type': string }[]).filter((x) => x['@type'] === 'Service');

  it('has no Service while no price is set', () => {
    expect(services(DEFAULT_PRICING)).toEqual([]);
  });

  it('has a Service with minPrice for a priced active group', () => {
    const s = services(withGroup('eu-finland', { startingFrom: 3500 })) as any[];
    expect(s).toHaveLength(1);
    expect(s[0].offers.priceSpecification).toEqual({ '@type': 'PriceSpecification', minPrice: 3500, priceCurrency: 'EUR' });
  });

  it('has no Canada Service until legal review, even with a price', () => {
    expect(services(withGroup(CANADA_KEY, { startingFrom: 4000 }))).toEqual([]);
    expect(services(withGroup(CANADA_KEY, { startingFrom: 4000, legalReviewed: true }))).toHaveLength(1);
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
    const g = resolveGroups(withGroup('eu-denmark', {}), 'en', LIVE).find((x) => x.key === 'eu-denmark')!;
    expect(g.ctaHref).toContain('utm_content=eu-denmark');
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
  it('cannot unlock the Canada gate, add a group, or store a non-https CTA', () => {
    const evil = clone() as any;
    evil.groups.find((g: any) => g.key === CANADA_KEY).requiresLegalReview = false;
    evil.groups.find((g: any) => g.key === 'eu-finland').ctaUrl = 'javascript:alert(1)';
    evil.groups.push({ ...evil.groups[0], key: 'b2b-canreach' });
    const d = normalizePricing(evil);
    expect(d.groups.find((g) => g.key === CANADA_KEY)!.requiresLegalReview).toBe(true);
    expect(d.groups.find((g) => g.key === 'eu-finland')!.ctaUrl).toBe('https://readiness.visaroads.com');
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
  it('carries the mandatory lines', () => {
    expect(CHROME.fa.exactPriceNote).toBe('قیمت دقیق بعد از ارزیابی آمادگی تیم مشخص می‌شود.');
    expect(CHROME.fa.canadaLawyer).toBe('بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد. هزینه‌ی وکیل جداست.');
  });
  it('does not title Canada as SUV or a BC PNP package', () => {
    const ca = DEFAULT_PRICING.groups.find((g) => g.key === CANADA_KEY)!;
    expect(JSON.stringify(ca.title)).not.toMatch(/SUV|PNP|ویزای استارتاپ/);
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
    const d = withGroup('eu-finland', { startingFrom: 3500 });
    const res = await savePricing(JSON.stringify(d));
    expect(res.success).toBe(true);
    expect(db.pricingContent.upsert).toHaveBeenCalledTimes(1);
  });
});
