// ============================================================================
// Central SEO copy for the static marketing pages.
// Each page calls metaFor('/path', locale) from its generateMetadata.
// Titles are brandless — buildMetadata appends "| Startup Visa Roads".
// ============================================================================

import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

interface Entry {
  en: { title: string; description: string };
  fa: { title: string; description: string };
  noindex?: boolean;
}

const META: Record<string, Entry> = {
  '/about': {
    en: { title: 'About Us', description: 'Startup Visa Roads pairs founders with mentorship and investor-grade documents to win Startup Visa and global migration cases.' },
    fa: { title: 'درباره ما', description: 'راه‌های ویزای استارتاپ بنیان‌گذاران را با منتورشیپ و اسناد سرمایه‌گذارپسند برای موفقیت در پرونده‌های استارتاپ ویزا و مهاجرت جهانی همراهی می‌کند.' },
  },
  '/services': {
    en: { title: 'Services — Business Plans, Financial Models & Pitch Decks', description: 'Investor-grade business plans, financial projections, and pitch decks engineered to pass immigration scrutiny for startup and entrepreneur visas.' },
    fa: { title: 'خدمات — بیزینس پلن، مدل مالی و پیچ‌دک', description: 'بیزینس پلن، مدل مالی پروفرما و پیچ‌دک در سطح سرمایه‌گذار، مهندسی‌شده برای قبولی در ارزیابی پرونده‌های ویزای استارتاپ و کارآفرینی.' },
  },
  '/mentorship': {
    en: { title: 'Mentorship & Startup Readiness', description: 'One-on-one mentorship to validate your concept, sharpen your business model, and prepare a fundable, immigration-ready startup.' },
    fa: { title: 'منتورشیپ و آمادگی استارتاپ', description: 'منتورشیپ اختصاصی برای اعتبارسنجی ایده، تقویت مدل کسب‌وکار و آماده‌سازی استارتاپ قابل سرمایه‌گذاری و مهاجرت‌پذیر.' },
  },
  '/contact': {
    en: { title: 'Contact & Free Advisory', description: 'Talk to a strategic immigration advisor. Request a free advisory to map your fastest, lowest-risk path to global residency.' },
    fa: { title: 'تماس و مشاوره رایگان', description: 'با مشاور استراتژیک مهاجرت گفت‌وگو کنید. درخواست مشاوره رایگان برای ترسیم سریع‌ترین و کم‌ریسک‌ترین مسیر اقامت جهانی.' },
  },
  '/startup-visa-canada': {
    en: { title: 'Canada Startup Visa (SUV)', description: 'Complete guide and end-to-end support for the Canada Startup Visa: eligibility, designated organizations, letters of support, and permanent residency.' },
    fa: { title: 'ویزای استارتاپ کانادا (SUV)', description: 'راهنمای کامل و پشتیبانی سرتاسری برای ویزای استارتاپ کانادا: شرایط، نهادهای تأییدشده، نامه حمایتی و اقامت دائم.' },
  },
  '/startupworkpermit': {
    en: { title: 'Canada Startup Work Permit', description: 'Launch and operate your business in Canada while your Startup Visa permanent residence application is processed.' },
    fa: { title: 'مجوز کار استارتاپی کانادا', description: 'راه‌اندازی و اداره کسب‌وکارتان در کانادا هم‌زمان با بررسی پرونده اقامت دائم ویزای استارتاپ.' },
  },
  '/pnp': {
    en: { title: 'Provincial Nominee Programs (PNP)', description: 'Compare Canada\'s Provincial Nominee Programs and entrepreneur streams to find the province that fits your capital, skills, and goals.' },
    fa: { title: 'برنامه‌های نامزدی استانی کانادا (PNP)', description: 'مقایسه برنامه‌های نامزدی استانی و مسیرهای کارآفرینی کانادا برای یافتن استان متناسب با سرمایه، تخصص و اهداف شما.' },
  },
  '/pnp/ontario': { en: { title: 'Ontario PNP (OINP)', description: 'Ontario Immigrant Nominee Program entrepreneur and business streams: requirements, investment thresholds, and the path to nomination.' }, fa: { title: 'برنامه استانی انتاریو (OINP)', description: 'مسیرهای کارآفرینی و تجاری برنامه نامزدی مهاجرتی انتاریو: شرایط، آستانه سرمایه‌گذاری و مسیر دریافت نامزدی.' } },
  '/pnp/bc': { en: { title: 'British Columbia PNP (BC PNP)', description: 'BC Provincial Nominee Program entrepreneur and tech streams: eligibility, net worth requirements, and business establishment.' }, fa: { title: 'برنامه استانی بریتیش کلمبیا (BC PNP)', description: 'مسیرهای کارآفرینی و تک برنامه نامزدی استانی بریتیش کلمبیا: شرایط، الزامات دارایی خالص و راه‌اندازی کسب‌وکار.' } },
  '/pnp/alberta': { en: { title: 'Alberta PNP (AAIP)', description: 'Alberta Advantage Immigration Program entrepreneur streams: requirements, investment, and routes to permanent residency.' }, fa: { title: 'برنامه استانی آلبرتا (AAIP)', description: 'مسیرهای کارآفرینی برنامه مهاجرتی آلبرتا: شرایط، سرمایه‌گذاری و مسیرهای اقامت دائم.' } },
  '/pnp/saskatchewan': { en: { title: 'Saskatchewan PNP (SINP)', description: 'Saskatchewan Immigrant Nominee Program entrepreneur category: net worth, investment, and business performance agreements.' }, fa: { title: 'برنامه استانی ساسکاچوان (SINP)', description: 'دسته کارآفرینی برنامه نامزدی مهاجرتی ساسکاچوان: دارایی خالص، سرمایه‌گذاری و توافق‌نامه عملکرد کسب‌وکار.' } },
  '/pnp/manitoba': { en: { title: 'Manitoba PNP (MPNP)', description: 'Manitoba Provincial Nominee Program business investor stream: requirements, deposit, and settlement expectations.' }, fa: { title: 'برنامه استانی مانیتوبا (MPNP)', description: 'مسیر سرمایه‌گذار تجاری برنامه نامزدی استانی مانیتوبا: شرایط، ودیعه و انتظارات استقرار.' } },
  '/pnp/new-brunswick': { en: { title: 'New Brunswick PNP', description: 'New Brunswick entrepreneurial immigration stream: eligibility, business plan, and nomination requirements.' }, fa: { title: 'برنامه استانی نیوبرانزویک', description: 'مسیر مهاجرت کارآفرینی نیوبرانزویک: شرایط، بیزینس پلن و الزامات دریافت نامزدی.' } },
  '/pnp/newfoundland': { en: { title: 'Newfoundland & Labrador PNP', description: 'Newfoundland and Labrador entrepreneur and international graduate streams: requirements and pathway to PR.' }, fa: { title: 'برنامه استانی نیوفاندلند', description: 'مسیرهای کارآفرینی و فارغ‌التحصیل بین‌المللی نیوفاندلند و لابرادور: شرایط و مسیر اقامت دائم.' } },
  '/pnp/nova-scotia': { en: { title: 'Nova Scotia PNP (NSNP)', description: 'Nova Scotia Nominee Program entrepreneur stream: requirements, investment, and business ownership routes.' }, fa: { title: 'برنامه استانی نوا اسکوشیا (NSNP)', description: 'مسیر کارآفرینی برنامه نامزدی نوا اسکوشیا: شرایط، سرمایه‌گذاری و مسیرهای مالکیت کسب‌وکار.' } },
  '/pnp/pei': { en: { title: 'Prince Edward Island PNP (PEI)', description: 'PEI Provincial Nominee Program work permit entrepreneur stream: requirements, investment, and residency.' }, fa: { title: 'برنامه استانی جزیره پرنس ادوارد (PEI)', description: 'مسیر کارآفرینی مجوز کار برنامه نامزدی استانی PEI: شرایط، سرمایه‌گذاری و اقامت.' } },
  '/usa/eb1': { en: { title: 'US EB-1 Extraordinary Ability Green Card', description: 'Direct US Green Card for founders and professionals with extraordinary achievements — no labor certification required.' }, fa: { title: 'گرین کارت نخبگان آمریکا (EB-1)', description: 'گرین کارت مستقیم آمریکا برای بنیان‌گذاران و متخصصان با دستاوردهای خارق‌العاده — بدون نیاز به تأیید کار.' } },
  '/usa/eb2-niw': { en: { title: 'US EB-2 NIW Green Card', description: 'Secure a US Green Card via the National Interest Waiver based on the national importance of your work — no employer sponsor needed.' }, fa: { title: 'گرین کارت منافع ملی آمریکا (EB-2 NIW)', description: 'دریافت گرین کارت آمریکا از طریق معافیت منافع ملی بر اساس اهمیت ملی کارتان — بدون نیاز به اسپانسر کارفرما.' } },
  '/usa/eb5': { en: { title: 'US EB-5 Investor Green Card', description: 'Permanent US residency through qualifying job-creating investment in targeted projects or regional centers.' }, fa: { title: 'گرین کارت سرمایه‌گذاری آمریکا (EB-5)', description: 'اقامت دائم آمریکا از طریق سرمایه‌گذاری اشتغال‌زا در پروژه‌های هدف یا مراکز منطقه‌ای.' } },
  '/europe/netherlands': { en: { title: 'Netherlands Startup Visa', description: 'Dutch residency for innovative founders via a recognized facilitator — build your startup in the heart of Europe.' }, fa: { title: 'ویزای استارتاپ هلند', description: 'اقامت هلند برای بنیان‌گذاران نوآور از طریق فسیلیتیتور تأییدشده — استارتاپ خود را در قلب اروپا بسازید.' } },
  '/europe/finland': { en: { title: 'Finland Startup Visa', description: 'Residency in the world\'s happiest country for innovative tech startups, with a strong support ecosystem.' }, fa: { title: 'ویزای استارتاپ فنلاند', description: 'اقامت در شادترین کشور دنیا برای استارتاپ‌های نوآور تکنولوژی، با اکوسیستم حمایتی قدرتمند.' } },
  '/europe/denmark': { en: { title: 'Start-up Denmark Visa', description: 'Launch your innovative business in Denmark with direct access to advanced Nordic markets and residency.' }, fa: { title: 'ویزای استارتاپ دانمارک', description: 'راه‌اندازی کسب‌وکار نوآور در دانمارک با دسترسی مستقیم به بازارهای پیشرفته اسکاندیناوی و اقامت.' } },
  '/australia/entrepreneur-stream': { en: { title: 'Australia Entrepreneur Pathway', description: 'Australian residency through the Business Innovation and Investment program for innovative entrepreneurs.' }, fa: { title: 'مسیر کارآفرینی استرالیا', description: 'اقامت استرالیا از طریق برنامه نوآوری و سرمایه‌گذاری تجاری برای کارآفرینان نوآور.' } },
  '/uae/golden-visa': { en: { title: 'UAE Golden Visa', description: 'Long-term UAE residency for investors, entrepreneurs, and exceptional talent — zero income tax, global hub.' }, fa: { title: 'اقامت طلایی امارات', description: 'اقامت بلندمدت امارات برای سرمایه‌گذاران، کارآفرینان و استعدادهای برجسته — بدون مالیات بر درآمد، مرکز جهانی.' } },
  '/country': { en: { title: 'Destination Countries', description: 'Explore startup and entrepreneur immigration pathways across Canada, the USA, Europe, Australia, and the UAE.' }, fa: { title: 'کشورهای مقصد', description: 'مسیرهای مهاجرت استارتاپی و کارآفرینی در کانادا، آمریکا، اروپا، استرالیا و امارات را بررسی کنید.' } },
  '/country/canada': { en: { title: 'Immigrate to Canada', description: 'Canada immigration pathways for founders: Startup Visa, Provincial Nominee Programs, and work permits.' }, fa: { title: 'مهاجرت به کانادا', description: 'مسیرهای مهاجرت کانادا برای بنیان‌گذاران: ویزای استارتاپ، برنامه‌های نامزدی استانی و مجوز کار.' } },
  '/country/usa': { en: { title: 'Immigrate to the USA', description: 'US immigration pathways for talent and investors: EB-1, EB-2 NIW, and EB-5 Green Cards.' }, fa: { title: 'مهاجرت به آمریکا', description: 'مسیرهای مهاجرت آمریکا برای استعداد و سرمایه‌گذار: گرین کارت‌های EB-1، EB-2 NIW و EB-5.' } },
  '/country/australia': { en: { title: 'Immigrate to Australia', description: 'Australian residency pathways for entrepreneurs and investors through innovation-driven programs.' }, fa: { title: 'مهاجرت به استرالیا', description: 'مسیرهای اقامت استرالیا برای کارآفرینان و سرمایه‌گذاران از طریق برنامه‌های نوآوری‌محور.' } },
  '/country/uae': { en: { title: 'Immigrate to the UAE', description: 'UAE residency for investors, founders, and skilled talent — including the long-term Golden Visa.' }, fa: { title: 'مهاجرت به امارات', description: 'اقامت امارات برای سرمایه‌گذاران، بنیان‌گذاران و استعدادهای متخصص — از جمله اقامت طلایی بلندمدت.' } },
  '/country/denmark': { en: { title: 'Immigrate to Denmark', description: 'Denmark residency pathways for innovative founders through the Start-up Denmark program.' }, fa: { title: 'مهاجرت به دانمارک', description: 'مسیرهای اقامت دانمارک برای بنیان‌گذاران نوآور از طریق برنامه استارتاپ دانمارک.' } },
  '/country/finland': { en: { title: 'Immigrate to Finland', description: 'Finland residency pathways for innovative tech startups via the Finnish Startup Permit.' }, fa: { title: 'مهاجرت به فنلاند', description: 'مسیرهای اقامت فنلاند برای استارتاپ‌های نوآور تکنولوژی از طریق مجوز استارتاپ فنلاند.' } },
  '/privacy': { en: { title: 'Privacy Policy', description: 'How Startup Visa Roads collects, uses, and protects your personal information.' }, fa: { title: 'سیاست حریم خصوصی', description: 'نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شخصی شما توسط راه‌های ویزای استارتاپ.' } },
  '/terms': { en: { title: 'Terms of Service', description: 'The terms and conditions governing your use of the Startup Visa Roads website and services.' }, fa: { title: 'شرایط استفاده از خدمات', description: 'شرایط و ضوابط حاکم بر استفاده شما از وب‌سایت و خدمات راه‌های ویزای استارتاپ.' } },
  '/landing': { en: { title: 'Start Your Global Mobility Journey', description: 'Map your fastest, lowest-risk path to global residency with mentorship and investor-grade documents.' }, fa: { title: 'سفر مهاجرت جهانی خود را آغاز کنید', description: 'سریع‌ترین و کم‌ریسک‌ترین مسیر اقامت جهانی را با منتورشیپ و اسناد سرمایه‌گذارپسند ترسیم کنید.' } },
  '/landing/pnp-landing': { en: { title: 'Canada PNP Assessment', description: 'Discover which Canadian Provincial Nominee Program fits your profile, capital, and goals.' }, fa: { title: 'ارزیابی برنامه استانی کانادا (PNP)', description: 'کشف کنید کدام برنامه نامزدی استانی کانادا با پروفایل، سرمایه و اهداف شما هماهنگ است.' } },
  '/landing/pnp-landing/pnp-brochure': { en: { title: 'Canada PNP Brochure', description: 'A concise overview of Canada\'s Provincial Nominee Programs for entrepreneurs and investors.' }, fa: { title: 'بروشور برنامه استانی کانادا', description: 'مروری فشرده بر برنامه‌های نامزدی استانی کانادا برای کارآفرینان و سرمایه‌گذاران.' } },
  '/landing/pnp-landing/pnp-farsi': { en: { title: 'Canada PNP (Farsi)', description: 'Canadian Provincial Nominee Programs explained for Persian-speaking entrepreneurs.' }, fa: { title: 'برنامه استانی کانادا (فارسی)', description: 'توضیح برنامه‌های نامزدی استانی کانادا برای کارآفرینان فارسی‌زبان.' } },
  '/login': { en: { title: 'Login', description: 'Sign in to your account.' }, fa: { title: 'ورود', description: 'به حساب کاربری خود وارد شوید.' }, noindex: true },
};

function titleFromPath(path: string): string {
  const last = path.split('/').filter(Boolean).pop() || 'Startup Visa Roads';
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function metaFor(path: string, locale: string): Metadata {
  const isRtl = locale === 'fa';
  const entry = META[path];
  if (!entry) {
    return buildMetadata({
      locale,
      path,
      title: titleFromPath(path),
      description: isRtl
        ? 'راه‌های ویزای استارتاپ — منتورشیپ و آمادگی استارتاپ برای ویزای استارتاپ و برنامه‌های مهاجرت جهانی.'
        : 'Startup Visa Roads — mentorship and startup readiness for Startup Visa and global migration programs.',
    });
  }
  const copy = isRtl ? entry.fa : entry.en;
  return buildMetadata({ locale, path, title: copy.title, description: copy.description, noindex: entry.noindex });
}
