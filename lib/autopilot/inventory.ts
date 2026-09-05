// ============================================================================
// lib/autopilot/inventory.ts
// What the writer may link to and what it already wrote.
//
// VisaRoads has no directory data to quote, so the inventory is the site's
// own programme pages, tools and recent articles. The planner picks topics
// against it (so every post links into a real page), enforceLinks verifies
// against it (so no link 404s), and recentTitles stops the planner from
// writing the same article twice.
// ============================================================================
import prisma from '@/lib/prisma';
import { ensureDefaultCategories } from '@/lib/categories';
import type { Locale } from '@/lib/seo';

export type LinkTarget = {
  path: string; // locale-agnostic, e.g. /pnp/ontario
  label: string;
  kind: 'page' | 'program' | 'tool' | 'article';
};

export type Inventory = {
  locale: Locale;
  targets: LinkTarget[];
  recentTitles: string[];
  /** Category names of the recent articles, one entry per article (for rotation). */
  recentCategories: string[];
  categories: { name: string; slug: string }[];
};

type Page = { path: string; en: string; fa: string; kind: LinkTarget['kind'] };

/** Static pages. Keep in step with app/sitemap.ts STATIC_PATHS. */
export const SITE_PAGES: Page[] = [
  { path: '/startup-visa-canada', en: 'Canada Start-up Visa (SUV) programme guide', fa: 'راهنمای ویزای استارتاپ کانادا (SUV)', kind: 'program' },
  { path: '/startupworkpermit', en: 'Canada start-up work permit', fa: 'مجوز کار استارتاپی کانادا', kind: 'program' },
  { path: '/pnp', en: 'Provincial Nominee Programs overview', fa: 'برنامه‌های استانی کانادا (PNP)', kind: 'program' },
  { path: '/pnp/ontario', en: 'Ontario Immigrant Nominee Program (OINP)', fa: 'برنامه استانی انتاریو (OINP)', kind: 'program' },
  { path: '/pnp/bc', en: 'British Columbia PNP (BC PNP)', fa: 'برنامه استانی بریتیش کلمبیا', kind: 'program' },
  { path: '/pnp/alberta', en: 'Alberta Advantage Immigration Program', fa: 'برنامه استانی آلبرتا', kind: 'program' },
  { path: '/pnp/saskatchewan', en: 'Saskatchewan Immigrant Nominee Program', fa: 'برنامه استانی ساسکاچوان', kind: 'program' },
  { path: '/pnp/manitoba', en: 'Manitoba Provincial Nominee Program', fa: 'برنامه استانی منیتوبا', kind: 'program' },
  { path: '/pnp/new-brunswick', en: 'New Brunswick PNP', fa: 'برنامه استانی نیوبرانزویک', kind: 'program' },
  { path: '/pnp/newfoundland', en: 'Newfoundland and Labrador PNP', fa: 'برنامه استانی نیوفاندلند', kind: 'program' },
  { path: '/pnp/nova-scotia', en: 'Nova Scotia Nominee Program', fa: 'برنامه استانی نوا اسکوشیا', kind: 'program' },
  { path: '/pnp/pei', en: 'Prince Edward Island PNP', fa: 'برنامه استانی جزیره پرنس ادوارد', kind: 'program' },
  { path: '/usa/eb1', en: 'US EB-1 extraordinary ability green card', fa: 'ویزای EB-1 آمریکا', kind: 'program' },
  { path: '/usa/eb2-niw', en: 'US EB-2 National Interest Waiver', fa: 'ویزای EB-2 NIW آمریکا', kind: 'program' },
  { path: '/usa/eb5', en: 'US EB-5 investor green card', fa: 'ویزای سرمایه‌گذاری EB-5 آمریکا', kind: 'program' },
  { path: '/europe/netherlands', en: 'Netherlands start-up visa', fa: 'ویزای استارتاپ هلند', kind: 'program' },
  { path: '/europe/finland', en: 'Finland start-up permit', fa: 'ویزای استارتاپ فنلاند', kind: 'program' },
  { path: '/europe/denmark', en: 'Start-up Denmark', fa: 'ویزای استارتاپ دانمارک', kind: 'program' },
  { path: '/australia/entrepreneur-stream', en: 'Australia entrepreneur pathway', fa: 'ویزای کارآفرینی استرالیا', kind: 'program' },
  { path: '/uae/golden-visa', en: 'UAE Golden Visa', fa: 'ویزای طلایی امارات', kind: 'program' },
  { path: '/country/canada', en: 'Immigrate to Canada as a founder', fa: 'مهاجرت به کانادا برای بنیان‌گذاران', kind: 'page' },
  { path: '/country/usa', en: 'Immigrate to the USA as a founder', fa: 'مهاجرت به آمریکا برای بنیان‌گذاران', kind: 'page' },
  { path: '/country/australia', en: 'Immigrate to Australia as a founder', fa: 'مهاجرت به استرالیا', kind: 'page' },
  { path: '/country/uae', en: 'Relocate to the UAE', fa: 'اقامت امارات', kind: 'page' },
  { path: '/country/denmark', en: 'Immigrate to Denmark', fa: 'مهاجرت به دانمارک', kind: 'page' },
  { path: '/country/finland', en: 'Immigrate to Finland', fa: 'مهاجرت به فنلاند', kind: 'page' },
  { path: '/tools/express-entry', en: 'Free Express Entry pathway diagnostic (CRS calculator)', fa: 'ابزار رایگان تشخیص مسیر اکسپرس انتری (محاسبه CRS)', kind: 'tool' },
  { path: '/tools', en: 'Free immigration tools', fa: 'ابزارهای رایگان مهاجرتی', kind: 'tool' },
  { path: '/services', en: 'Business plan, financial model and pitch deck services', fa: 'خدمات بیزینس پلن، مدل مالی و پیچ‌دک', kind: 'page' },
  { path: '/mentorship', en: 'Founder mentorship programme', fa: 'برنامه منتورشیپ بنیان‌گذاران', kind: 'page' },
  { path: '/webinar', en: 'Free immigration webinar registration', fa: 'ثبت‌نام وبینار رایگان مهاجرت', kind: 'page' },
  { path: '/book-meeting', en: 'Book a strategy call', fa: 'رزرو جلسه مشاوره', kind: 'page' },
  { path: '/contact', en: 'Request a free advisory', fa: 'درخواست مشاوره رایگان', kind: 'page' },
  { path: '/about', en: 'About Startup Visa Roads', fa: 'درباره ما', kind: 'page' },
  { path: '/blog', en: 'Journal', fa: 'مجله', kind: 'page' },
];

/** Facts about us the writer may state. Nothing else about us may be claimed. */
export const BRAND_FACTS = `Startup Visa Roads (visaroads.com) is a product of Ashavid, based in Toronto, Ontario. We are not lawyers or licensed immigration consultants; we are exited founders, investment bankers and grant-committee members who build the business side of a case: business plans, financial models, pitch decks, founder mentorship, and a free Express Entry diagnostic tool. We serve founders and skilled professionals, many of them Persian-speaking.`;

export async function buildInventory(locale: Locale): Promise<Inventory> {
  await ensureDefaultCategories();
  const [cats, recent] = await Promise.all([
    prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: 'asc' } }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', locale },
      select: { slug: true, title: true, category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 60,
    }),
  ]);

  const targets: LinkTarget[] = SITE_PAGES.map((p) => ({ path: p.path, label: p[locale], kind: p.kind }));
  for (const a of recent) targets.push({ path: `/blog/${a.slug}`, label: a.title, kind: 'article' });

  return {
    locale,
    targets,
    recentTitles: recent.map((a) => a.title),
    recentCategories: recent.map((a) => a.category?.name ?? ''),
    categories: cats,
  };
}

/** The inventory block every writer prompt pastes verbatim. */
export function linkBlock(inv: Inventory): string {
  return inv.targets.map((t) => `${t.path} — ${t.label}`).join('\n');
}
