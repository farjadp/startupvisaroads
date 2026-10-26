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
  'work-and-skilled-immigration': 'مهاجرت کاری',
  'study-abroad': 'مهاجرت تحصیلی',
  'life-and-family-abroad': 'زندگی و خانواده در مهاجرت',
  // Country categories the autopilot creates on the fly.
  canada: 'کانادا',
  finland: 'فنلاند',
  denmark: 'دانمارک',
  netherlands: 'هلند',
  estonia: 'استونی',
  italy: 'ایتالیا',
  turkiye: 'ترکیه',
  turkey: 'ترکیه',
  australia: 'استرالیا',
  usa: 'آمریکا',
};

/** Persian label for a category slug, or the stored name when we have none. */
export function faCategoryLabel(slug: string, fallback: string): string {
  return LABELS[slug] ?? fallback;
}

export type FaCategoryGuide = { path: string; title: string; description: string };

/**
 * A country category page is where Persian searches for the country land
 * (Search Console, Jul–Oct 2026: «استارتاپ فنلاند» and «شرایط استارتاپ فنلاند»
 * reached /fa/blog/category/finland at position 6–9, under the title
 * "Finland — مقالات", and drew no clicks). Title it with the phrase people
 * type and point it at the country's guide. No figures here: this copy is
 * not re-verified when a programme changes.
 */
const GUIDES: Record<string, FaCategoryGuide> = {
  canada: {
    path: '/pnp',
    title: 'مهاجرت کارآفرینی به کانادا: مقاله‌ها و راهنماها',
    description: 'مسیرهای کارآفرینی استانی کانادا در آلبرتا، منیتوبا، نوااسکوشیا، پرنس ادوارد و نیوبرانزویک، و همه‌ی مقاله‌های ما درباره‌ی مهاجرت به کانادا.',
  },
  finland: {
    path: '/europe/finland',
    title: 'ویزای استارتاپ فنلاند: شرایط، تمکن مالی و مقاله‌ها',
    description: 'شرایط مجوز استارتاپ فنلاند، تأییدیه‌ی Business Finland، تمکن مالی و زندگی بنیان‌گذار در فنلاند، همراه با راهنمای کامل مسیر.',
  },
  denmark: {
    path: '/europe/denmark',
    title: 'استارتاپ ویزای دانمارک: شرایط، پنل ارزیابی و مقاله‌ها',
    description: 'شرایط Start-up Denmark، پنل ارزیابی، تمکن مالی، تمدید و زندگی در دانمارک، همراه با راهنمای کامل مسیر.',
  },
  netherlands: {
    path: '/europe/netherlands',
    title: 'ویزای استارتاپ هلند: فسیلیتیتور، شرایط و مقاله‌ها',
    description: 'شرایط ویزای استارتاپ هلند، نقش فسیلیتیتور، تمکن مالی و مسیر بعد از سال اول، همراه با راهنمای کامل.',
  },
  estonia: {
    path: '/europe/estonia',
    title: 'ویزای استارتاپ استونی: شرایط، کمیته و مقاله‌ها',
    description: 'شرایط ویزای استارتاپ استونی، ارزیابی کمیته، تمکن مالی و زندگی در تالین، همراه با راهنمای کامل مسیر.',
  },
  italy: {
    path: '/europe/italy',
    title: 'ویزای استارتاپ ایتالیا: شرایط، کمیته و مقاله‌ها',
    description: 'شرایط Italia Startup Visa، کمیته‌ی ارزیابی، انکوباتور و تمکن مالی، همراه با راهنمای کامل مسیر.',
  },
  turkiye: {
    path: '/turkey-tech-visa',
    title: 'ویزای فناوری ترکیه: شرایط و مقاله‌ها',
    description: 'شرایط Türkiye Tech Visa، ظرفیت پذیرش، محدودیت‌ها و زندگی بنیان‌گذار در ترکیه، همراه با راهنمای کامل.',
  },
  australia: {
    path: '/australia',
    title: 'مهاجرت کارآفرینی به استرالیا: ویزای نوآوری و مقاله‌ها',
    description: 'ویزای نوآوری ملی استرالیا، دعوت‌نامه، شرایط فردی متقاضی و مسیرهای جایگزین، همراه با راهنمای کامل.',
  },
};
GUIDES.turkey = GUIDES.turkiye;

/** The Persian guide and search-facing copy for a category, or null. */
export function faCategoryGuide(slug: string): FaCategoryGuide | null {
  return GUIDES[slug] ?? null;
}
