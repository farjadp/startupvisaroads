// ============================================================================
// lib/pricing/resolve.ts
// From the stored document to what a reader may see. This is the safety
// layer of the pricing page, so it is pure and tested
// (lib/__tests__/pricing.test.ts):
//
//   - A hidden group never renders.
//   - A group that needs legal review (Canada) renders in production only
//     once legalReviewed is true.
//   - A price line renders only for an active group, with a real amount and
//     a label. A missing amount means no line at all, never the text "TBD".
//   - Any text that is empty or carries the TBD marker is dropped in
//     production; a table row, list item or FAQ with a TBD part goes whole.
//   - Outside production (`showDrafts`) everything stays, so the gaps are
//     visible in dev, marked.
// ============================================================================
import { ASSESSMENT_PATH } from './defaults';
import { withLeadSource } from '@/lib/lead-source';
import { TBD, type Currency, type FaqItem, type PricingCopy, type PricingDoc, type PricingLocale, type TitledItem, type ComparisonRow } from './types';

export interface ResolveOptions {
  /** true outside production: keep TBD text so the gaps are visible. */
  showDrafts: boolean;
}

/**
 * Drafts show outside production only. PRICING_SHOW_DRAFTS=0 lets a local dev
 * server render exactly what production renders (used for the PR screenshots);
 * nothing can turn drafts ON in production.
 */
export const showDraftsByDefault = (): boolean =>
  process.env.NODE_ENV !== 'production' && process.env.PRICING_SHOW_DRAFTS !== '0';

export function isTbd(s: string | null | undefined): boolean {
  return !s || !s.trim() || s.includes(TBD);
}

function keepText(s: string, o: ResolveOptions): string | null {
  if (!isTbd(s)) return s;
  return o.showDrafts ? s || TBD : null;
}

function keepList(items: string[], o: ResolveOptions): string[] {
  return o.showDrafts ? items : items.filter((s) => !isTbd(s));
}

function keepRows<T extends object>(items: T[], o: ResolveOptions): T[] {
  if (o.showDrafts) return items;
  return items.filter((r) => Object.values(r).every((v) => typeof v !== 'string' || !isTbd(v)));
}

export const UTM = { source: 'visaroads.com', medium: 'pricing_page', campaign: 'pricing' } as const;

/**
 * Where a pricing button goes, tagged with which button it was (`link` = the
 * route key, or 'hero' / 'final').
 *   - On-site path: /<locale>/which-path?from=pricing&route=<link>. Not UTM:
 *     an internal UTM would overwrite the visitor's real source in GA4 (see
 *     lib/lead-source.ts). The quiz and contact forms carry from/route into
 *     the lead message.
 *   - https link (if a card is ever pointed off-site): the page's UTM, with
 *     utm_content=<link>.
 */
export function ctaHref(base: string, link: string, locale: string): string {
  const b = base || ASSESSMENT_PATH;
  if (b.startsWith('/')) return withLeadSource(`/${locale}${b}`, 'pricing', link);
  const sep = b.includes('?') ? '&' : '?';
  return `${b}${sep}utm_source=${UTM.source}&utm_medium=${UTM.medium}&utm_campaign=${UTM.campaign}&utm_content=${encodeURIComponent(link)}`;
}

export const isExternal = (href: string): boolean => href.startsWith('https://');

export interface GroupView {
  key: string;
  status: 'active' | 'soon';
  title: string;
  summary: string | null;
  /** Fixed fees, one per tier; empty = the card says the price comes after the assessment. */
  prices: { label: string; amount: number | null }[];
  currency: Currency;
  note: string | null;
  includes: string[];
  excludes: string[];
  milestones: string[];
  duration: string | null;
  ctaLabel: string;
  /** The button's link, tagged with the group's key ("soon" groups go to /contact). */
  ctaHref: string;
  image: string;
  imageAlt: string;
  /** Only ever true in dev: the card would be hidden in production until a lawyer approves it. */
  awaitingLegalReview: boolean;
}

export function resolveGroups(doc: PricingDoc, locale: PricingLocale, o: ResolveOptions): GroupView[] {
  const out: GroupView[] = [];
  for (const g of doc.groups) {
    if (g.status === 'hidden') continue;
    const awaitingLegalReview = g.requiresLegalReview && !g.legalReviewed;
    if (awaitingLegalReview && !o.showDrafts) continue;
    const title = keepText(g.title[locale], o);
    if (!title) continue;
    const active = g.status === 'active';
    const prices = active
      ? g.prices
          .map((p) => ({ label: keepText(p.label[locale], o), amount: p.amount && p.amount > 0 && Number.isFinite(p.amount) ? p.amount : null }))
          .filter((p): p is { label: string; amount: number | null } => p.label !== null && (o.showDrafts || p.amount !== null))
      : [];
    out.push({
      key: g.key,
      status: g.status,
      title,
      summary: keepText(g.summary[locale], o),
      prices,
      currency: g.currency,
      note: g.note[locale]?.trim() ? keepText(g.note[locale], o) : null,
      includes: active ? keepList(g.includes[locale], o) : [],
      excludes: active ? keepList(g.excludes[locale], o) : [],
      milestones: active ? keepList(g.paymentMilestones[locale], o) : [],
      duration: active ? keepText(g.duration[locale], o) : null,
      ctaLabel: keepText(g.ctaLabel[locale], o) ?? (locale === 'fa' ? 'ارزیابی رایگان مسیر' : 'Free route assessment'),
      ctaHref: active ? ctaHref(g.ctaUrl, g.key, locale) : ctaHref('/contact', g.key, locale),
      image: g.image,
      imageAlt: g.imageAlt[locale] || '',
      awaitingLegalReview,
    });
  }
  return out;
}

export interface CopyView {
  hero: { eyebrow: string | null; title: string; lede: string | null; cta: string };
  cards: { title: string; intro: string | null };
  comparison: { title: string; intro: string | null; usHeading: string; typicalHeading: string; rows: ComparisonRow[] };
  extras: { title: string; intro: string | null; items: TitledItem[] };
  payment: { title: string; intro: string | null; steps: TitledItem[] };
  faq: { title: string; items: FaqItem[] };
  final: { title: string; body: string | null; cta: string; partnerPrompt: string; partnerLink: string };
}

export function resolveCopy(c: PricingCopy, locale: PricingLocale, o: ResolveOptions): CopyView {
  const fa = locale === 'fa';
  const t = (s: string, fallback: string) => keepText(s, o) ?? fallback;
  const cta = fa ? 'ارزیابی رایگان مسیر' : 'Free route assessment';
  return {
    hero: { eyebrow: keepText(c.hero.eyebrow, o), title: t(c.hero.title, fa ? 'قیمت‌ها' : 'Pricing'), lede: keepText(c.hero.lede, o), cta: t(c.hero.cta, cta) },
    cards: { title: t(c.cards.title, fa ? 'مسیرها' : 'Routes'), intro: keepText(c.cards.intro, o) },
    comparison: {
      title: t(c.comparison.title, ''),
      intro: keepText(c.comparison.intro, o),
      usHeading: t(c.comparison.usHeading, 'VisaRoads'),
      typicalHeading: t(c.comparison.typicalHeading, ''),
      rows: keepRows(c.comparison.rows, o),
    },
    extras: { title: t(c.extras.title, ''), intro: keepText(c.extras.intro, o), items: keepRows(c.extras.items, o) },
    payment: { title: t(c.payment.title, ''), intro: keepText(c.payment.intro, o), steps: keepRows(c.payment.steps, o) },
    faq: { title: t(c.faq.title, fa ? 'پرسش‌های رایج' : 'Questions'), items: keepRows(c.faq.items, o) },
    final: {
      title: t(c.final.title, cta),
      body: keepText(c.final.body, o),
      cta: t(c.final.cta, cta),
      partnerPrompt: t(c.final.partnerPrompt, fa ? 'شریک تجاری هستید؟' : 'Are you a business partner?'),
      partnerLink: t(c.final.partnerLink, '/partners'),
    },
  };
}

const NUMBER_LOCALE: Record<PricingLocale, string> = { en: 'en-CA', fa: 'fa-IR' };

/** "3,500" in English, "۳٬۵۰۰" in Persian. No currency conversion, no decimals. */
export function formatAmount(n: number, locale: PricingLocale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], { maximumFractionDigits: 0, useGrouping: true }).format(n);
}

export const CURRENCY_NAME: Record<PricingLocale, Record<Currency, string>> = {
  en: { EUR: 'EUR', CAD: 'CAD', USD: 'USD' },
  fa: { EUR: 'یورو', CAD: 'دلار کانادا', USD: 'دلار آمریکا' },
};
