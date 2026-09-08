// ============================================================================
// content/fa/videos.ts
// Farjad's YouTube catalogue (@FarjadTalks, channel UCKwrxko4YPDjWLsRSCTcTMg),
// scraped 2026-09-06 and hand-tagged. Pages pick videos by tag or id; the
// VideoCard renders a thumbnail facade and only loads the iframe on click.
// Music and unrelated videos are deliberately left out.
// ============================================================================

import { toPersianDigits } from '@/lib/fa/format';

export type VideoTag =
  | 'suv' | 'pnp' | 'new-brunswick' | 'ontario' | 'bc' | 'netherlands' | 'denmark' | 'finland' | 'turkey' | 'europe'
  | 'startup' | 'pitch' | 'market' | 'decision' | 'webinar' | 'mentorship';

export type Video = {
  id: string;
  title: string;
  tags: VideoTag[];
  /** ISO date if known; otherwise omitted. */
  published?: string;
  /**
   * Public view count when last read. Rendered as a floor — «بیش از ۱۳ هزار
   * بازدید» — never as an exact figure, because the number only ever rises:
   * a stale floor understates but stays true, which is the safe direction to
   * be wrong in. Refresh with scripts/fetch-video-views.ts.
   */
  views?: number;
};

/** When every `views` figure below was last read. */
export const VIEWS_CHECKED = '2026-09-08';

/**
 * Below this, the card shows no view count at all.
 *
 * Applied blindly to every video rather than per video, so this is a rule and
 * not a way of hiding the quiet ones. The reasoning: a view count is on the
 * page as a signal of whether something is worth twenty minutes, and below a
 * thousand it carries no such signal — it mostly reports how recently the
 * video went up. Half the catalogue — twelve of twenty-four — sits below it today.
 */
export const VIEWS_FLOOR = 1000;

export const VIDEOS: Video[] = [
  { id: 'cXAWOW-Wdco', title: 'وبینار ۲۳ استارتاپ ویزا | آخرین تغییرات، اولویت‌ها و کشورهای دارای ویزای استارتاپ', tags: ['webinar', 'suv', 'europe'], views: 424 },
  { id: 'oJ-00ZIYLEY', title: 'بیست و دومین دورهمی استارتاپ ویزا کانادا: بعد از اتفاقات ۱۹ دسامبر', tags: ['webinar', 'suv'], views: 136 },
  { id: 'WG9QFxaw0tI', title: 'صفر تا صد ویزای استارتاپ هلند (۲۰۲۶): شرایط، هزینه‌ها و چالش‌های ماه اول', tags: ['netherlands', 'europe'], views: 32083 },
  { id: '7nyGJrUgxtw', title: 'ویزای استارتاپ دانمارک 🇩🇰 اقامت دائم در ۴ سال! (آپدیت ۲۰۲۶)', tags: ['denmark', 'europe'], views: 16278 },
  { id: '-n4lCG2MAK4', title: '🇩🇰 زندگی در دانمارک از زبان یک بنیان‌گذار استارتاپ | تجربه واقعی', tags: ['denmark', 'europe'], views: 1174 },
  { id: 'RSo7Ilu8tWE', title: 'استارتاپ ویزای دانمارک ۲۰۲۵', tags: ['denmark', 'europe'], views: 2389 },
  // Türkiye. Titles read from YouTube's oEmbed endpoint, not typed off the
  // thumbnails. Not tagged 'europe': the guide is filed outside /europe on
  // purpose, and a Türkiye video surfacing on the Denmark or Finland rail
  // would undercut the one thing those pages say it cannot offer.
  { id: 'yKUnvR4dTbE', title: 'همه چیز درباره تک ویزای ترکیه | از ایده تا اقامت ۳ ساله', tags: ['turkey'], views: 13977 },
  { id: 'aDAvrHfP3LI', title: '🇹🇷 واقعیت زندگی و ساخت استارتاپ در ترکیه | تجربه یک بنیان‌گذار ایرانی', tags: ['turkey'], views: 7646 },
  { id: 'UyEsOpfswjk', title: 'ویزای استارتاپ فنلاند ۲۰۲۶ | همه چیز از تأیید ایده تا اقامت دائم و پاسپورت 🇫🇮', tags: ['finland', 'europe'], views: 26770 },
  { id: '7wbBkrLgRiM', title: '🇫🇮 زندگی در فنلاند از زبان یک ساکن | فرهنگ، هزینه‌ها، کار و واقعیت‌ها', tags: ['finland', 'europe'], views: 2136 },
  { id: 'Fl1Q7gUU06A', title: 'سریع‌ترین راه اقامت کانادا در ۶ ماه؛ کارآفرینی استان نیوبرانزویک PNP', tags: ['new-brunswick', 'pnp'], views: 41387 },
  { id: 'I3tts3-vkos', title: 'PNP Canada Explained | واقعیت مهاجرت استانی کانادا', tags: ['pnp'], views: 70 },
  { id: 'JZOl-te4JBM', title: 'نقشه واقعی برنامه کارآفرینی انتاریو ۲۰۲۶ | از صفر تا اقامت دائم کانادا', tags: ['ontario', 'pnp'], views: 41345 },
  { id: 'UYbdV-jmEFE', title: 'کالبدشکافی برنامه کارآفرینی استان انتاریو ۲۰۲۶', tags: ['ontario', 'pnp'], views: 42 },
  { id: 'KuAR_P2xJlI', title: 'قبل از اقدام برای BC PNP این ویدیو را ببین! | مهاجرت کارآفرینی کانادا', tags: ['bc', 'pnp'], views: 48 },
  { id: 'qODv_KLFGbk', title: 'چطور یک استارتاپ برای مهاجرت درست کنیم؟ صفر تا ۱۰۰ — قسمت چهارم', tags: ['startup', 'mentorship'], views: 102 },
  { id: 'N6A9BVkiwrw', title: 'سه روش حرفه‌ای برای محاسبه Market Size استارتاپ | قسمت دوم', tags: ['market', 'startup', 'mentorship'], views: 18669 },
  { id: 'zI4-gPWSKhI', title: 'چطور استارتاپت رو مثل Y Combinator پیچ کنی؟ فرمول دو جمله‌ای', tags: ['pitch', 'startup', 'mentorship'], views: 33 },
  { id: 'B3PWek0HQcA', title: 'چرا بازخوردها توی استارتاپت جواب نمی‌ده؟ مدل ماتریس بازخورد', tags: ['startup', 'mentorship'], views: 40 },
  { id: 'BlC2aMoecvE', title: 'در آشوب چطور تصمیم بگیریم؟ ۵ سؤال برای تصمیم‌های سخت', tags: ['decision'], views: 676 },
  { id: 'MPxsYfAg61o', title: 'توهم خط پایان | چرا تصمیم‌های بزرگ شکست می‌خورند؟', tags: ['decision'], views: 607 },
  { id: 'vEET1u-n-Fo', title: 'The Rubber Band Model: تصمیم‌گیری قاطع در لحظه‌های دودلی', tags: ['decision'], views: 473 },
  { id: 'TSEuZlWE_TM', title: 'نوزدهمین دورهمی آنلاین در مسیر استارتاپ ویزا', tags: ['webinar', 'suv'], views: 2076 },
  { id: '9fs3oHRPhwg', title: 'هفدهمین دورهمی آنلاین در مسیر استارتاپ ویزا', tags: ['webinar', 'suv'], views: 97 },
];

export const CHANNEL_URL = 'https://www.youtube.com/@FarjadTalks';

/**
 * A view count as a Persian floor label, or null when it is below the floor.
 *
 * Rounds DOWN to the nearest thousand so the label stays true as the real
 * number climbs: 13,977 reads «بیش از ۱۳ هزار بازدید» and is still honest a
 * year later. Never renders an exact figure, which would go stale silently.
 */
export function viewsLabel(video: Video): string | null {
  const n = video.views;
  if (n === undefined || n < VIEWS_FLOOR) return null;
  const thousands = Math.floor(n / 1000);
  return `بیش از ${toPersianDigits(thousands)} هزار بازدید`;
}

export function videosByTag(...tags: VideoTag[]): Video[] {
  const seen = new Set<string>();
  const out: Video[] = [];
  for (const tag of tags) for (const v of VIDEOS) if (v.tags.includes(tag) && !seen.has(v.id)) { seen.add(v.id); out.push(v); }
  return out;
}

export function videosById(ids: string[]): Video[] {
  return ids.map((id) => VIDEOS.find((v) => v.id === id)).filter((v): v is Video => Boolean(v));
}

export const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** VideoObject JSON-LD for a list of videos on a page. */
export function videoJsonLd(videos: Video[]) {
  return videos.map((v) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title,
    inLanguage: 'fa',
    thumbnailUrl: thumb(v.id),
    contentUrl: watchUrl(v.id),
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    ...(v.published ? { uploadDate: v.published } : {}),
    author: { '@type': 'Person', name: 'Farjad Pourmohammad', url: CHANNEL_URL },
  }));
}
