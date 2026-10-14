import type { Script } from '@/theme/tokens';

export type Locale = 'en' | 'fa' | 'fr' | 'zh' | 'ar';

export type LocaleMeta = {
  code: Locale;
  /** The language's name in its own script, shown on its chip. */
  endonym: string;
  script: Script;
  rtl: boolean;
  /** BCP-47 tag for Intl number formatting. */
  intl: string;
  /** Prose numerals: Persian digits in fa prose (Brand Book); Latin everywhere else. */
  proseDigits: 'latin' | 'persian';
  /** Which site locale holds this locale's long-form content. */
  siteLocale: 'en' | 'fa';
};

export const LOCALES: Record<Locale, LocaleMeta> = {
  en: { code: 'en', endonym: 'English', script: 'latin', rtl: false, intl: 'en-CA', proseDigits: 'latin', siteLocale: 'en' },
  fa: { code: 'fa', endonym: 'فارسی', script: 'arabic', rtl: true, intl: 'en-US', proseDigits: 'persian', siteLocale: 'fa' },
  fr: { code: 'fr', endonym: 'Français', script: 'latin', rtl: false, intl: 'fr-CA', proseDigits: 'latin', siteLocale: 'en' },
  zh: { code: 'zh', endonym: '中文', script: 'han', rtl: false, intl: 'zh-CN', proseDigits: 'latin', siteLocale: 'en' },
  ar: { code: 'ar', endonym: 'العربية', script: 'arabic', rtl: true, intl: 'en-US', proseDigits: 'latin', siteLocale: 'en' },
};

export const LOCALE_ORDER: Locale[] = ['en', 'fa', 'fr', 'zh', 'ar'];

export function pickDeviceLocale(tags: string[]): Locale {
  for (const tag of tags) {
    const lang = tag.toLowerCase().split(/[-_]/)[0];
    if (lang in LOCALES) return lang as Locale;
  }
  return 'en';
}
