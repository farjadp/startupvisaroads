// ============================================================================
// Copy for the phone "get the app" card inside blog articles. Built on the
// server so the counts come from lib/routes-v2 and cannot drift, and so the
// client component carries none of the route data. Every claim must stay true
// of mobile/store/listing-v3.md: no promise of approval, no prices.
// ============================================================================
import { toFaDigits } from '@/content/app-page';

export type AppCardCopy = {
  label: string;
  heading: string;
  body: string;
  dismiss: string;
  cta: { ios: string; android: string };
  /** The card's accessible name, per store. */
  name: { ios: string; android: string };
};

export function appCardCopy(locale: 'en' | 'fa', routes: number, countries: number): AppCardCopy {
  if (locale === 'fa') {
    return {
      label: 'اپ VisaRoads',
      heading: `ببینید با ${toFaDigits(routes)} مسیر مهاجرت چقدر مطابقت دارید.`,
      body: `ده سؤال، بدون ثبت‌نام. پاسخ‌هایتان با شرایط منتشرشده‌ی مسیرها در ${toFaDigits(countries)} کشور سنجیده می‌شود و هر مسیر منبع رسمی خودش را دارد.`,
      dismiss: 'بستن',
      cta: { ios: 'دانلود از اپ استور', android: 'دانلود از گوگل پلی' },
      name: { ios: 'دانلود اپ VisaRoads از اپ استور', android: 'دانلود اپ VisaRoads از گوگل پلی' },
    };
  }
  return {
    label: 'The VisaRoads app',
    heading: `See how you match ${routes} visa routes.`,
    body: `Ten questions, no sign-up. Your answers are compared with the published criteria in ${countries} countries, and every route shows its official source.`,
    dismiss: 'Dismiss',
    cta: { ios: 'Get it on the App Store', android: 'Get it on Google Play' },
    name: { ios: 'Get the VisaRoads app on the App Store', android: 'Get the VisaRoads app on Google Play' },
  };
}
