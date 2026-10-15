// Numbers and dates per locale, without relying on the JS engine's calendar
// support: Hermes' Intl coverage differs between iOS and Android, and the
// Persian (Jalali) calendar must render the same on both.
import { LOCALES, type Locale } from './locales';
import { toJalali, toPersianDigits } from './jalali';

export { toJalali, toPersianDigits };

/** A count or score inside prose: Persian digits in fa, Latin elsewhere. */
export function fmtCount(n: number, locale: Locale): string {
  const latin = new Intl.NumberFormat('en-US').format(n);
  return LOCALES[locale].proseDigits === 'persian' ? toPersianDigits(latin) : new Intl.NumberFormat(LOCALES[locale].intl).format(n);
}

/** Money is always Latin digits with the ISO code (Brand Book: currency stays Latin). */
export function fmtMoney(n: number, currency: string, locale: Locale): string {
  const grouped = new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-US', { maximumFractionDigits: Number.isInteger(n) ? 0 : 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
  return locale === 'fr' ? `${grouped} ${currency}` : `${currency} ${grouped}`;
}

const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FR_MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** Parses an ISO date (YYYY-MM-DD) as a calendar date, never shifting a day by time zone. */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** A date as a reader of this locale writes it in prose. */
export function fmtDate(input: Date | string, locale: Locale): string {
  const date = typeof input === 'string' ? parseIsoDate(input) : input;
  switch (locale) {
    case 'fa': {
      const { jy, jm, jd } = toJalali(date);
      return toPersianDigits(`${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`).replace(/[a-z]/g, '');
    }
    case 'ar':
      return `${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    case 'zh':
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    case 'fr':
      return `${date.getDate()} ${FR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    default:
      return `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
}
