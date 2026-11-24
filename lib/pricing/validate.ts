// ============================================================================
// lib/pricing/validate.ts
// Turns anything (a DB row, an admin form post) into a well-formed PricingDoc.
// The shape of DEFAULT_PRICING is the template: unknown keys are dropped,
// missing or wrong-typed values fall back to the default, strings are trimmed
// and capped. A few fields are locked to the defaults on purpose and cannot
// be changed from admin: a group's key, image and requiresLegalReview (so the
// Canada card's lawyer gate cannot be switched off by an edit).
// ============================================================================
import { DEFAULT_PRICING, READINESS_URL } from './defaults';
import {
  CURRENCIES,
  GROUP_STATUSES,
  PRICING_LOCALES,
  type Currency,
  type GroupStatus,
  type Localized,
  type PricingCopy,
  type PricingDoc,
  type PricingGroup,
} from './types';

const MAX_TEXT = 2000;
const MAX_ITEMS = 20;
export const MAX_PRICE = 10_000_000;

function text(v: unknown, fallback: string): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX_TEXT) : fallback;
}

function list(v: unknown, fallback: string[]): string[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .filter((x): x is string => typeof x === 'string')
    .map((x) => x.trim().slice(0, MAX_TEXT))
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function localized<T>(v: unknown, fallback: Localized<T>, each: (x: unknown, f: T) => T): Localized<T> {
  const o = obj(v);
  return { en: each(o.en, fallback.en), fa: each(o.fa, fallback.fa) };
}

/** Whole units, or null for "not decided". Accepts "3,500", "۳٬۵۰۰", 3500. */
export function parsePrice(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  let s = String(v).trim();
  s = s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  s = s.replace(/[\s,٬.']/g, '');
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isSafeInteger(n) && n > 0 && n <= MAX_PRICE ? n : null;
}

/** Only https links leave the site from a pricing CTA. */
export function safeHttpsUrl(v: unknown, fallback = READINESS_URL): string {
  if (typeof v !== 'string') return fallback;
  try {
    const u = new URL(v.trim());
    return u.protocol === 'https:' ? v.trim() : fallback;
  } catch {
    return fallback;
  }
}

function group(v: unknown, d: PricingGroup): PricingGroup {
  const o = obj(v);
  const status = GROUP_STATUSES.includes(o.status as GroupStatus) ? (o.status as GroupStatus) : d.status;
  const currency = CURRENCIES.includes(o.currency as Currency) ? (o.currency as Currency) : d.currency;
  return {
    key: d.key,
    image: d.image,
    requiresLegalReview: d.requiresLegalReview,
    status,
    currency,
    startingFrom: 'startingFrom' in o ? parsePrice(o.startingFrom) : d.startingFrom,
    legalReviewed: typeof o.legalReviewed === 'boolean' ? o.legalReviewed : d.legalReviewed,
    ctaUrl: safeHttpsUrl(o.ctaUrl, d.ctaUrl),
    title: localized(o.title, d.title, text),
    summary: localized(o.summary, d.summary, text),
    includes: localized(o.includes, d.includes, list),
    excludes: localized(o.excludes, d.excludes, list),
    paymentMilestones: localized(o.paymentMilestones, d.paymentMilestones, list),
    duration: localized(o.duration, d.duration, text),
    ctaLabel: localized(o.ctaLabel, d.ctaLabel, text),
    imageAlt: localized(o.imageAlt, d.imageAlt, text),
  };
}

function rows<T extends Record<string, string>>(v: unknown, fallback: T[], keys: (keyof T)[]): T[] {
  if (!Array.isArray(v)) return fallback;
  return v
    .map((r) => {
      const o = obj(r);
      const out = {} as T;
      for (const k of keys) (out as Record<string, string>)[k as string] = text(o[k as string], '');
      return out;
    })
    .filter((r) => keys.some((k) => r[k]))
    .slice(0, MAX_ITEMS);
}

function copy(v: unknown, d: PricingCopy): PricingCopy {
  const o = obj(v);
  const hero = obj(o.hero);
  const cards = obj(o.cards);
  const cmp = obj(o.comparison);
  const extras = obj(o.extras);
  const pay = obj(o.payment);
  const faq = obj(o.faq);
  const fin = obj(o.final);
  return {
    hero: {
      eyebrow: text(hero.eyebrow, d.hero.eyebrow),
      title: text(hero.title, d.hero.title),
      lede: text(hero.lede, d.hero.lede),
      cta: text(hero.cta, d.hero.cta),
    },
    cards: { title: text(cards.title, d.cards.title), intro: text(cards.intro, d.cards.intro) },
    comparison: {
      title: text(cmp.title, d.comparison.title),
      intro: text(cmp.intro, d.comparison.intro),
      usHeading: text(cmp.usHeading, d.comparison.usHeading),
      typicalHeading: text(cmp.typicalHeading, d.comparison.typicalHeading),
      rows: rows(cmp.rows, d.comparison.rows, ['label', 'us', 'typical']),
    },
    extras: {
      title: text(extras.title, d.extras.title),
      intro: text(extras.intro, d.extras.intro),
      items: rows(extras.items, d.extras.items, ['title', 'body']),
    },
    payment: {
      title: text(pay.title, d.payment.title),
      intro: text(pay.intro, d.payment.intro),
      steps: rows(pay.steps, d.payment.steps, ['title', 'body']),
    },
    faq: { title: text(faq.title, d.faq.title), items: rows(faq.items, d.faq.items, ['q', 'a']) },
    final: {
      title: text(fin.title, d.final.title),
      body: text(fin.body, d.final.body),
      cta: text(fin.cta, d.final.cta),
      partnerPrompt: text(fin.partnerPrompt, d.final.partnerPrompt),
      partnerLink: text(fin.partnerLink, d.final.partnerLink),
    },
  };
}

/**
 * Always returns a complete document. Groups are matched by key to the
 * defaults: a group missing from the input keeps its default, and a key the
 * defaults do not know is dropped.
 */
export function normalizePricing(input: unknown): PricingDoc {
  const o = obj(input);
  const given = Array.isArray(o.groups) ? o.groups.map(obj) : [];
  const groups = DEFAULT_PRICING.groups.map((d) => group(given.find((g) => g.key === d.key), d));
  const c = obj(o.copy);
  const copyOut = {} as Localized<PricingCopy>;
  for (const l of PRICING_LOCALES) copyOut[l] = copy(c[l], DEFAULT_PRICING.copy[l]);
  return { version: 1, groups, copy: copyOut };
}
