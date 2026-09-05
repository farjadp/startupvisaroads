// ============================================================================
// lib/fa/categories.ts
// Persian display labels for blog categories. Category rows in the DB carry
// English names (seeded from DEFAULT_CATEGORIES); the Persian site must not
// show "Canada Startup Visa" as a chip on a Persian article. Keyed by slug
// so a renamed row still maps; unknown slugs fall back to the stored name.
// ============================================================================

const LABELS: Record<string, string> = {
  'canada-startup-visa': 'ویزای استارتاپ کانادا',
  'canada-pnp': 'برنامه‌های استانی کانادا',
  'usa-business-and-talent': 'کسب‌وکار و استعداد آمریکا',
  'european-visas': 'ویزاهای اروپا',
  'australia-entrepreneurship': 'کارآفرینی استرالیا',
  'uae-golden-visa': 'ویزای طلایی امارات',
  'mentorship-and-business-planning': 'منتورشیپ و بیزینس‌پلن',
  'global-talent-and-compliance': 'استعداد جهانی و انطباق',
};

/** Persian label for a category slug, or the stored name when we have none. */
export function faCategoryLabel(slug: string, fallback: string): string {
  return LABELS[slug] ?? fallback;
}
