// ============================================================================
// content/fa/videos.ts
// Farjad's YouTube catalogue (@FarjadTalks, channel UCKwrxko4YPDjWLsRSCTcTMg),
// scraped 2026-09-06 and hand-tagged. Pages pick videos by tag or id; the
// VideoCard renders a thumbnail facade and only loads the iframe on click.
// Music and unrelated videos are deliberately left out.
// ============================================================================

export type VideoTag =
  | 'suv' | 'pnp' | 'new-brunswick' | 'ontario' | 'bc' | 'netherlands' | 'denmark' | 'finland' | 'europe'
  | 'startup' | 'pitch' | 'market' | 'decision' | 'webinar' | 'mentorship';

export type Video = {
  id: string;
  title: string;
  tags: VideoTag[];
  /** ISO date if known; otherwise omitted. */
  published?: string;
};

export const VIDEOS: Video[] = [
  { id: 'cXAWOW-Wdco', title: 'وبینار ۲۳ استارتاپ ویزا | آخرین تغییرات، اولویت‌ها و کشورهای دارای ویزای استارتاپ', tags: ['webinar', 'suv', 'europe'] },
  { id: 'oJ-00ZIYLEY', title: 'بیست و دومین دورهمی استارتاپ ویزا کانادا: بعد از اتفاقات ۱۹ دسامبر', tags: ['webinar', 'suv'] },
  { id: 'WG9QFxaw0tI', title: 'صفر تا صد ویزای استارتاپ هلند (۲۰۲۶): شرایط، هزینه‌ها و چالش‌های ماه اول', tags: ['netherlands', 'europe'] },
  { id: '7nyGJrUgxtw', title: 'ویزای استارتاپ دانمارک 🇩🇰 اقامت دائم در ۴ سال! (آپدیت ۲۰۲۶)', tags: ['denmark', 'europe'] },
  { id: '-n4lCG2MAK4', title: '🇩🇰 زندگی در دانمارک از زبان یک بنیان‌گذار استارتاپ | تجربه واقعی', tags: ['denmark', 'europe'] },
  { id: 'RSo7Ilu8tWE', title: 'استارتاپ ویزای دانمارک ۲۰۲۵', tags: ['denmark', 'europe'] },
  { id: 'UyEsOpfswjk', title: 'ویزای استارتاپ فنلاند ۲۰۲۶ | همه چیز از تأیید ایده تا اقامت دائم و پاسپورت 🇫🇮', tags: ['finland', 'europe'] },
  { id: '7wbBkrLgRiM', title: '🇫🇮 زندگی در فنلاند از زبان یک ساکن | فرهنگ، هزینه‌ها، کار و واقعیت‌ها', tags: ['finland', 'europe'] },
  { id: 'Fl1Q7gUU06A', title: 'سریع‌ترین راه اقامت کانادا در ۶ ماه؛ کارآفرینی استان نیوبرانزویک PNP', tags: ['new-brunswick', 'pnp'] },
  { id: 'I3tts3-vkos', title: 'PNP Canada Explained | واقعیت مهاجرت استانی کانادا', tags: ['pnp'] },
  { id: 'JZOl-te4JBM', title: 'نقشه واقعی برنامه کارآفرینی انتاریو ۲۰۲۶ | از صفر تا اقامت دائم کانادا', tags: ['ontario', 'pnp'] },
  { id: 'UYbdV-jmEFE', title: 'کالبدشکافی برنامه کارآفرینی استان انتاریو ۲۰۲۶', tags: ['ontario', 'pnp'] },
  { id: 'KuAR_P2xJlI', title: 'قبل از اقدام برای BC PNP این ویدیو را ببین! | مهاجرت کارآفرینی کانادا', tags: ['bc', 'pnp'] },
  { id: 'qODv_KLFGbk', title: 'چطور یک استارتاپ برای مهاجرت درست کنیم؟ صفر تا ۱۰۰ — قسمت چهارم', tags: ['startup', 'mentorship'] },
  { id: 'N6A9BVkiwrw', title: 'سه روش حرفه‌ای برای محاسبه Market Size استارتاپ | قسمت دوم', tags: ['market', 'startup', 'mentorship'] },
  { id: 'zI4-gPWSKhI', title: 'چطور استارتاپت رو مثل Y Combinator پیچ کنی؟ فرمول دو جمله‌ای', tags: ['pitch', 'startup', 'mentorship'] },
  { id: 'B3PWek0HQcA', title: 'چرا بازخوردها توی استارتاپت جواب نمی‌ده؟ مدل ماتریس بازخورد', tags: ['startup', 'mentorship'] },
  { id: 'BlC2aMoecvE', title: 'در آشوب چطور تصمیم بگیریم؟ ۵ سؤال برای تصمیم‌های سخت', tags: ['decision'] },
  { id: 'MPxsYfAg61o', title: 'توهم خط پایان | چرا تصمیم‌های بزرگ شکست می‌خورند؟', tags: ['decision'] },
  { id: 'vEET1u-n-Fo', title: 'The Rubber Band Model: تصمیم‌گیری قاطع در لحظه‌های دودلی', tags: ['decision'] },
  { id: 'TSEuZlWE_TM', title: 'نوزدهمین دورهمی آنلاین در مسیر استارتاپ ویزا', tags: ['webinar', 'suv'] },
  { id: '9fs3oHRPhwg', title: 'هفدهمین دورهمی آنلاین در مسیر استارتاپ ویزا', tags: ['webinar', 'suv'] },
];

export const CHANNEL_URL = 'https://www.youtube.com/@FarjadTalks';

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
