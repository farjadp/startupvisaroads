// ============================================================================
// lib/cover-art/index.ts
// From an article to a stored, code-drawn cover. See render.ts for the look.
// ============================================================================
import slugify from 'slugify';
import { faCategoryLabel } from '@/lib/fa/categories';
import { isStorageConfigured, storeImage } from '@/lib/storage';
import { detectCountry, type CoverCountry } from './countries';
import { renderCover, type CoverSpec } from './render';

export type CoverSubject = {
  title: string;
  locale: string;
  /** The category's stored (English) name. */
  category?: string | null;
  tags?: string[];
  topicSeed?: string | null;
  /** Publication date; the month on the card. Defaults to now. */
  date?: Date;
};

/** "Nov 2026" / "آبان ۱۴۰۵". */
export function coverDate(date: Date, locale: 'en' | 'fa'): string {
  return locale === 'fa'
    ? new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
    : new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/**
 * The eyebrow: country, then category, in the cover's language. A category
 * that already names the country ("Canada PNP", or a country category the
 * autopilot made) stands alone, so the card never reads "Canada · Canada PNP".
 */
export function coverLabel(country: CoverCountry | null, category: string | null | undefined, locale: 'en' | 'fa'): string {
  const cat = category?.trim()
    ? locale === 'fa'
      ? faCategoryLabel(slugify(category, { lower: true, strict: true }), category)
      : category.trim()
    : '';
  const name = country ? (locale === 'fa' ? country.fa : country.en) : '';
  if (!name) return cat || (locale === 'fa' ? 'ویزارودز' : 'VisaRoads');
  if (!cat || cat.toLowerCase().includes(name.toLowerCase())) return cat || name;
  return `${name} · ${cat}`;
}

export function coverSpec(s: CoverSubject): CoverSpec {
  const locale = s.locale === 'fa' ? 'fa' : 'en';
  const country = detectCountry({ title: s.title, topicSeed: s.topicSeed, category: s.category, tags: s.tags });
  return {
    title: s.title.trim(),
    locale,
    label: coverLabel(country, s.category, locale),
    date: coverDate(s.date ?? new Date(), locale),
    country,
  };
}

/**
 * Draw and store the cover. Never throws: a missing cover is a note in the
 * run, not a failed article. Returns the stored URL or null.
 *
 * Same storage gate as the photo flow: in production, refuse to inline a
 * base64 cover into the row when object storage is not configured.
 */
export async function makeBrandCover(s: CoverSubject): Promise<string | null> {
  if (!isStorageConfigured() && process.env.NODE_ENV === 'production') {
    console.warn('cover-art: skipping — object storage not configured (S3_*)');
    return null;
  }
  try {
    const png = await renderCover(coverSpec(s));
    return await storeImage(new Uint8Array(png), 'image/png');
  } catch (e) {
    console.error(`cover-art: "${s.title}" failed, continuing without a cover`, e);
    return null;
  }
}
