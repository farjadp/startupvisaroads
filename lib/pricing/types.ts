// ============================================================================
// lib/pricing/types.ts
// The shape of the /pricing page's content. One document holds every route
// group and the page copy in both languages; it lives in the PricingContent
// table (one row, id "main") and is edited at /en/admin/pricing. Until the
// first admin save the page renders DEFAULT_PRICING (lib/pricing/defaults.ts).
//
// Numbers and statuses are shared by both languages, so a price can never
// differ between /en and /fa. Text is per language.
// ============================================================================

export const PRICING_LOCALES = ['en', 'fa'] as const;
export type PricingLocale = (typeof PRICING_LOCALES)[number];

/** A value written once per language. */
export type Localized<T> = { en: T; fa: T };

export const GROUP_STATUSES = ['active', 'soon', 'hidden'] as const;
export type GroupStatus = (typeof GROUP_STATUSES)[number];

/** Every amount names its currency. No conversion, ever. */
export const CURRENCIES = ['EUR', 'CAD', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** The placeholder for anything Farjad has not decided. Never rendered in production. */
export const TBD = '[[TBD]]';

/** One price on a card: "Per family 20,000", "British Columbia 75,000". */
export interface PriceLine {
  label: Localized<string>;
  /** Whole units of the group's currency. null = not decided: the line is not shown in production. */
  amount: number | null;
}

export interface PricingGroup {
  /** Stable id: analytics route_key, the CTA's utm_content, and the image. Not editable. */
  key: string;
  status: GroupStatus;
  /** VisaRoads' own fee, fixed (not "starting from"), one line per tier. Empty = no number on the card. */
  prices: PriceLine[];
  /** Shared by every line of the group. */
  currency: Currency;
  /**
   * When true the group is not shown in production until `legalReviewed` is
   * also true (the Canada card: a licensed lawyer must approve its text).
   */
  requiresLegalReview: boolean;
  legalReviewed: boolean;
  /** Base URL of the CTA. The UTM parameters are appended in code. */
  ctaUrl: string;
  /** A photograph from public/fa/img, credited in public/fa/img/credits.json. */
  image: string;
  title: Localized<string>;
  summary: Localized<string>;
  includes: Localized<string[]>;
  excludes: Localized<string[]>;
  paymentMilestones: Localized<string[]>;
  duration: Localized<string>;
  /** A short line under the price, e.g. a programme's status. Empty = none. */
  note: Localized<string>;
  ctaLabel: Localized<string>;
  imageAlt: Localized<string>;
}

export type ComparisonRow = {
  label: string;
  us: string;
  typical: string;
};

export type TitledItem = {
  title: string;
  body: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

/** The editable page copy, one per language. */
export interface PricingCopy {
  hero: { eyebrow: string; title: string; lede: string; cta: string };
  cards: { title: string; intro: string };
  comparison: { title: string; intro: string; usHeading: string; typicalHeading: string; rows: ComparisonRow[] };
  extras: { title: string; intro: string; items: TitledItem[] };
  payment: { title: string; intro: string; steps: TitledItem[] };
  faq: { title: string; items: FaqItem[] };
  final: { title: string; body: string; cta: string; partnerPrompt: string; partnerLink: string };
}

export interface PricingDoc {
  version: 1;
  groups: PricingGroup[];
  copy: Localized<PricingCopy>;
}
