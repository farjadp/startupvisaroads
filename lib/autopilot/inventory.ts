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

type Page = { path: string; en: string; kind: LinkTarget['kind'] };

/** English static pages. Keep in step with EN_PATHS in app/sitemap.ts. */
export const SITE_PAGES: Page[] = [
  { path: '/startup-visa-canada', en: 'Canada Start-up Visa (SUV) programme guide', kind: 'program' },
  { path: '/startupworkpermit', en: 'Canada start-up work permit', kind: 'program' },
  { path: '/pnp', en: 'Provincial Nominee Programs overview', kind: 'program' },
  { path: '/pnp/ontario', en: 'Ontario Immigrant Nominee Program (OINP)', kind: 'program' },
  { path: '/pnp/bc', en: 'British Columbia PNP (BC PNP)', kind: 'program' },
  { path: '/pnp/alberta', en: 'Alberta Advantage Immigration Program', kind: 'program' },
  { path: '/pnp/saskatchewan', en: 'Saskatchewan Immigrant Nominee Program', kind: 'program' },
  { path: '/pnp/manitoba', en: 'Manitoba Provincial Nominee Program', kind: 'program' },
  { path: '/pnp/new-brunswick', en: 'New Brunswick PNP', kind: 'program' },
  { path: '/pnp/newfoundland', en: 'Newfoundland and Labrador PNP', kind: 'program' },
  { path: '/pnp/nova-scotia', en: 'Nova Scotia Nominee Program', kind: 'program' },
  { path: '/pnp/pei', en: 'Prince Edward Island PNP', kind: 'program' },
  { path: '/usa/eb1', en: 'US EB-1 extraordinary ability green card', kind: 'program' },
  { path: '/usa/eb2-niw', en: 'US EB-2 National Interest Waiver', kind: 'program' },
  { path: '/usa/eb5', en: 'US EB-5 investor green card', kind: 'program' },
  { path: '/europe/netherlands', en: 'Netherlands start-up visa', kind: 'program' },
  { path: '/europe/finland', en: 'Finland start-up permit', kind: 'program' },
  { path: '/europe/denmark', en: 'Start-up Denmark', kind: 'program' },
  { path: '/australia/entrepreneur-stream', en: 'Australia entrepreneur pathway', kind: 'program' },
  { path: '/uae/golden-visa', en: 'UAE Golden Visa', kind: 'program' },
  { path: '/country/canada', en: 'Immigrate to Canada as a founder', kind: 'page' },
  { path: '/country/usa', en: 'Immigrate to the USA as a founder', kind: 'page' },
  { path: '/country/australia', en: 'Immigrate to Australia as a founder', kind: 'page' },
  { path: '/country/uae', en: 'Relocate to the UAE', kind: 'page' },
  { path: '/country/denmark', en: 'Immigrate to Denmark', kind: 'page' },
  { path: '/country/finland', en: 'Immigrate to Finland', kind: 'page' },
  { path: '/tools/express-entry', en: 'Free Express Entry pathway diagnostic (CRS calculator)', kind: 'tool' },
  { path: '/tools', en: 'Free immigration tools', kind: 'tool' },
  { path: '/services', en: 'Business plan, financial model and pitch deck services', kind: 'page' },
  { path: '/mentorship', en: 'Founder mentorship programme', kind: 'page' },
  { path: '/webinar', en: 'Free immigration webinar registration', kind: 'page' },
  { path: '/book-meeting', en: 'Book a strategy call', kind: 'page' },
  { path: '/contact', en: 'Request a free advisory', kind: 'page' },
  { path: '/about', en: 'About Startup Visa Roads', kind: 'page' },
  { path: '/blog', en: 'Journal', kind: 'page' },
];

export type FaPage = { path: string; label: string; kind: LinkTarget['kind'] };

/**
 * The Persian site's link inventory. It is a different set of pages from the
 * English one, not a translation of it — /fa has its own IA. Every path here
 * must be in FA_PATHS, otherwise the writer mints links that 301 the reader
 * out of Persian mid-article.
 */
export const FA_SITE_PAGES: FaPage[] = [
  { path: '/canada-startup-visa', label: 'راهنمای کامل ویزای استارتاپ کانادا (SUV)', kind: 'program' },
  { path: '/canada-startup-visa/requirements', label: 'شرایط و مدارک ویزای استارتاپ کانادا', kind: 'program' },
  { path: '/canada-startup-visa/cost', label: 'هزینه‌های ویزای استارتاپ کانادا', kind: 'program' },
  { path: '/canada-startup-visa/designated-organizations', label: 'سازمان‌های تأییدشده (Designated Organizations)', kind: 'program' },
  { path: '/pnp', label: 'برنامه‌های استانی کانادا (PNP)', kind: 'program' },
  { path: '/usa-eb2-niw', label: 'ویزای EB-2 NIW آمریکا برای متخصصان ایرانی', kind: 'program' },
  { path: '/which-path', label: 'کدام مسیر مهاجرت برای شما مناسب است؟ (ارزیابی رایگان)', kind: 'tool' },
  { path: '/mentorship', label: 'برنامه منتورشیپ و آماده‌سازی بنیان‌گذاران', kind: 'page' },
  { path: '/faq', label: 'سؤالات متداول مهاجرت استارتاپی', kind: 'page' },
  { path: '/webinar', label: 'وبینار رایگان مهاجرت استارتاپی', kind: 'page' },
  { path: '/about', label: 'درباره ما', kind: 'page' },
  { path: '/contact', label: 'تماس و مشاوره', kind: 'page' },
  { path: '/blog', label: 'مجله', kind: 'page' },
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

  const targets: LinkTarget[] =
    locale === 'fa'
      ? FA_SITE_PAGES.map((p) => ({ path: p.path, label: p.label, kind: p.kind }))
      : SITE_PAGES.map((p) => ({ path: p.path, label: p.en, kind: p.kind }));
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
