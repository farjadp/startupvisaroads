import type { Locale } from '@/i18n/locales';

/**
 * Localised text. `en` is required. UI-sized strings carry all five
 * languages; long-form route content carries en and fa only until it is
 * written by hand (spec: content is never machine-translated for publication).
 */
export type Text = { en: string } & Partial<Record<Exclude<Locale, 'en'>, string>>;

export type Resolved = { text: string; lang: Locale; fallback: boolean };

export function pick(t: Text, locale: Locale): Resolved {
  const own = t[locale];
  if (own) return { text: own, lang: locale, fallback: false };
  return { text: t.en, lang: 'en', fallback: locale !== 'en' };
}
