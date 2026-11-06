// ============================================================================
// content/fa/webinar.ts
// «دورهمی آنلاین استارتاپ و استارتاپ ویزا» — the Persian meetup page. Persian
// copy, not a translation of the English webinar page.
//
// For the next meetup change four things: WEBINAR_DATE, WEBINAR_MINUTES,
// WEBINAR_EVENT_ID (the Google Calendar event registrants are added to) and
// `number`. When the date passes, the page switches to a "next session" state
// instead of showing an expired countdown. Add the recording to PAST_MEETUPS
// once it is on YouTube.
// ============================================================================
import { TELEGRAM_URL, TELEGRAM_CHANNEL_URL } from './home';

/** Start, ISO with the organiser's offset. Set to null when no date is scheduled. */
export const WEBINAR_DATE: string | null = '2026-11-11T13:00:00-05:00';
export const WEBINAR_MINUTES = 90;
/** Google Calendar event id (farjad@visaroads.com). Registrants are added as guests. */
export const WEBINAR_EVENT_ID: string | null = '52lpnmt3vqqni6c1ae5rgkjcr7';

/** Shown as a clock each. IANA zones, so daylight saving is handled by the browser. */
export const MEETUP_ZONES = [
  { city: 'تهران', region: 'ایران', tz: 'Asia/Tehran' },
  { city: 'برلین، آمستردام، پاریس', region: 'اروپای مرکزی', tz: 'Europe/Berlin' },
  { city: 'لندن', region: 'بریتانیا', tz: 'Europe/London' },
  { city: 'تورنتو', region: 'شرق کانادا', tz: 'America/Toronto' },
  { city: 'ونکوور', region: 'غرب کانادا', tz: 'America/Vancouver' },
] as const;

/** Poster, 1200×675, used as the page's share image. Full size and story versions sit beside it. */
export const WEBINAR_POSTER = '/img/fa/meetups/meetup-25-og.jpg';

/**
 * Where the meetup is streamed, scheduled from Riverside on 2026-11-06.
 * Null means not scheduled; the page hides that button.
 */
export const LIVE_LINKS: { key: 'youtube' | 'x' | 'linkedin' | 'instagram'; label: string; href: string | null }[] = [
  { key: 'youtube', label: 'یوتیوب', href: 'https://www.youtube.com/watch?v=K2AK_Ujj0a0' },
  { key: 'x', label: 'ایکس', href: 'https://x.com/i/broadcasts/2zkAWNQWKjdQjj' },
  { key: 'linkedin', label: 'لینکدین', href: null },
  { key: 'instagram', label: 'اینستاگرام', href: null },
];

export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLCMZ6fZQA3876e9Yc9RQvvoGdVUKcdP1Y';

export type PastMeetup = { n: number; id: string; length: string; note?: string; part?: string };

/** The playlist «رویداد آنلاین استارتاپ و استارتاپ ویزا», read 2026-11-06. Newest first. */
export const PAST_MEETUPS: PastMeetup[] = [
  { n: 23, id: 'cXAWOW-Wdco', length: '1:33:17', note: 'آخرین تغییرات، اولویت‌ها و کشورهای دارای ویزای استارتاپ' },
  { n: 22, id: 'oJ-00ZIYLEY', length: '1:19:25', note: 'استارتاپ ویزای کانادا بعد از اتفاقات ۱۹ دسامبر' },
  { n: 19, id: 'TSEuZlWE_TM', length: '1:33:24' },
  { n: 17, id: '9fs3oHRPhwg', length: '1:55:17' },
  { n: 15, id: 'iSfOQgi1apc', length: '1:25:00' },
  { n: 13, id: 'wrvsYo42Ejo', length: '1:17:17' },
  { n: 12, id: 'cdo6UfUjzGQ', length: '1:34:01' },
  { n: 10, id: 'tRhbLnU5fPQ', length: '1:10:49', note: 'با حضور سازمان تأییدشده‌ی TreeFrog' },
  { n: 9, id: 'ZGipfW31THU', length: '1:49:58', note: 'با حضور سازمان تأییدشده‌ی Innovation Factory' },
  { n: 8, id: 'XFPFzL7pXH4', length: '1:42:36' },
  { n: 7, id: 'pG0rCO0iOlQ', length: '1:39:19' },
  { n: 6, id: 'F7-pPpuFtX4', length: '59:16', part: 'بخش اول' },
  { n: 6, id: 'nVwcnF-rK2Y', length: '1:02:43', part: 'بخش دوم' },
  { n: 5, id: 'os3gHBi-CyM', length: '1:54:05' },
  { n: 4, id: 'VjD0k1V-kmY', length: '1:24:46' },
  { n: 3, id: 'Mb9ebuU1SoU', length: '1:23:34' },
  { n: 2, id: 'pmYq0HhmyqU', length: '1:18:15' },
  { n: 1, id: 'jcgAeEr7_WU', length: '1:24:17' },
];

export const webinar = {
  number: 25,
  /** Sent with every registration so the Telegram message names the event. */
  eventLabel: 'دورهمی آنلاین شماره‌ی ۲۵ استارتاپ و استارتاپ ویزا',
  meta: {
    path: '/webinar',
    title: 'دورهمی آنلاین ۲۵ استارتاپ ویزا: کانادا و کشورهای اروپایی',
    description:
      'ثبت‌نام رایگان در دورهمی آنلاین شماره‌ی ۲۵، چهارشنبه ۲۰ آبان ۱۴۰۵ ساعت ۲۱:۳۰ به وقت تهران: استارتاپ ویزای کانادا و استارتاپ ویزای کشورهای اروپایی، به فارسی و با پرسش و پاسخ زنده.',
    keywords: ['دورهمی استارتاپ ویزا', 'وبینار استارتاپ ویزای کانادا', 'استارتاپ ویزای اروپا', 'وبینار رایگان مهاجرت استارتاپی'],
  },
  hero: {
    eyebrow: 'آنلاین · رایگان · به فارسی',
    kicker: 'دورهمی آنلاین استارتاپ و استارتاپ ویزا',
    headline: ['استارتاپ ویزا:', 'کانادا یا اروپا؟'],
    sub: 'این بار درباره‌ی وضعیت امروز استارتاپ ویزای کانادا حرف می‌زنیم و مسیرهای استارتاپی کشورهای اروپایی را کنارش می‌گذاریم تا روشن شود کدام برای شما واقع‌بینانه‌تر است. بدون فروش، با پرسش و پاسخ زنده.',
    cta: 'ثبت‌نام رایگان',
    archive: 'دورهمی‌های قبلی',
  },
  when: {
    label: 'زمان برگزاری',
    duration: 'یک ساعت و نیم',
    countdown: { days: 'روز', hours: 'ساعت', minutes: 'دقیقه', seconds: 'ثانیه' },
    zonesHeading: 'به وقت شهر شما',
    yours: 'ساعت دستگاه شما',
    live: 'دورهمی همین حالا در جریان است. اگر ثبت‌نام کرده‌اید، از لینک دعوت‌نامه‌ی تقویم وارد شوید.',
    none: 'زمان دورهمی بعدی به‌زودی اعلام می‌شود. ثبت‌نام کنید تا اول از همه خبردار شوید.',
    expired: 'این دورهمی برگزار شده. ضبط آن به‌زودی در یوتیوب قرار می‌گیرد. برای دورهمی بعدی ثبت‌نام کنید.',
  },
  live: {
    heading: 'پخش زنده',
    body: 'دورهمی هم‌زمان در این شبکه‌ها پخش زنده می‌شود. اگر فقط می‌خواهید تماشا کنید، ثبت‌نام لازم نیست. برای پرسیدن سؤال با تصویر و صدا، ثبت‌نام کنید تا لینک Google Meet برایتان بیاید.',
    meet: 'Google Meet برای ثبت‌نام‌کنندگان',
    reminder: 'یادآوری در یوتیوب',
  },
  routes: ['کانادا', 'هلند', 'دانمارک', 'فنلاند', 'بلژیک', 'استونی', 'اسپانیا', 'ایتالیا', 'بلغارستان'],
  agenda: {
    heading: 'در این دورهمی',
    items: [
      { title: 'استارتاپ ویزای کانادا امروز کجاست', body: 'برنامه از تیر ۱۴۰۵ متوقف شده. چه کسانی هنوز پرونده‌ی در جریان دارند، چه چیزی برای آن‌ها باز مانده، و برنامه‌ی آزمایشی جایگزین تا امروز چه گفته و چه نگفته است.' },
      { title: 'استارتاپ ویزای کشورهای اروپایی', body: 'هلند، دانمارک، فنلاند، بلژیک، استونی، اسپانیا، ایتالیا و بلغارستان: هر کدام از بنیان‌گذار چه می‌خواهد و کجا با کانادا فرق دارد.' },
      { title: 'کانادا یا اروپا، برای کدام بنیان‌گذار', body: 'مرحله‌ی کسب‌وکار، تیم، سرمایه و هدف اقامت دائم را کنار هم می‌گذاریم تا روشن شود کدام مسیر به وضعیت شما نزدیک‌تر است.' },
      { title: 'مسائل خاص ایرانی‌ها', body: 'انتقال پول زیر تحریم، مدارک ایرانی، باز کردن حساب بانکی و ثبت شرکت در کشور مقصد.' },
      { title: 'پرسش و پاسخ زنده', body: 'سؤال خودتان را بپرسید. پاسخ صادقانه می‌گیرید، حتی اگر پاسخ این باشد که این مسیر مناسب شما نیست.' },
    ],
  },
  who: {
    heading: 'برای چه کسی مناسب است',
    items: [
      'بنیان‌گذاری که می‌خواهد بداند بعد از توقف استارتاپ ویزای کانادا چه گزینه‌هایی دارد',
      'کسی که پرونده‌ی استارتاپ ویزای کانادا دارد و می‌خواهد وضعیتش را بهتر بفهمد',
      'کسی که بین کانادا و یک کشور اروپایی مردد است',
      'کسی که هنوز در مرحله‌ی شناخت است و نمی‌خواهد از روز اول پول خرج کند',
    ],
  },
  form: {
    heading: 'ثبت‌نام رایگان',
    body: 'بعد از ثبت‌نام، دعوت‌نامه‌ی تقویم گوگل با لینک ورود به ایمیل‌تان می‌رسد و تقویم خودش یادآوری می‌کند.',
    name: 'نام و نام خانوادگی',
    email: 'ایمیل',
    required: 'الزامی',
    optional: 'اختیاری',
    phone: 'شماره تلفن یا آیدی تلگرام',
    residence: 'کشور محل زندگی',
    interest: {
      label: 'بیشتر به کدام مسیر فکر می‌کنید؟',
      options: ['کانادا', 'کشورهای اروپایی', 'هر دو', 'هنوز نمی‌دانم'],
    },
    idea: 'در یک خط: کسب‌وکار یا تخصص شما',
    submit: 'ثبت‌نام در دورهمی',
    sending: 'در حال ثبت…',
    doneTitle: 'جای شما نگه داشته شد',
    done: 'دعوت‌نامه‌ی تقویم با لینک ورود به ایمیل شما فرستاده شد. اگر در صندوق اصلی نبود، پوشه‌ی اسپم را هم ببینید.',
    donePending: 'لینک ورود پیش از دورهمی به ایمیل شما فرستاده می‌شود.',
    error: 'ثبت‌نام انجام نشد. دوباره تلاش کنید یا در تلگرام پیام بدهید.',
    privacy: 'ایمیل شما فقط برای همین دورهمی استفاده می‌شود و مهمان‌های دیگر آن را نمی‌بینند.',
  },
  archive: {
    heading: 'دورهمی‌های قبلی',
    sub: 'ضبط کامل دورهمی‌های گذشته در یوتیوب. از اولین دورهمی تا بیست‌وسوم.',
    item: 'دورهمی',
    all: 'همه‌ی دورهمی‌ها در یوتیوب',
  },
  telegram: {
    heading: 'در تلگرام همراه ما باشید',
    channel: { label: 'کانال تلگرام VisaRoads', handle: '@visaroads', href: TELEGRAM_CHANNEL_URL, body: 'خبر دورهمی‌های بعدی و تغییرات قوانین' },
    support: { label: 'پشتیبانی در تلگرام', handle: '@ashavidsupport', href: TELEGRAM_URL, body: 'سؤال درباره‌ی ثبت‌نام یا ورود به دورهمی' },
  },
};
