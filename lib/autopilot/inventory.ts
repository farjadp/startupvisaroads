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
import { tagsOf, type Tagged } from './diversity';
import { NOT_WITHDRAWN } from '@/lib/legacy-redirects';

export type LinkTarget = {
  path: string; // locale-agnostic, e.g. /pnp/ontario
  label: string;
  kind: 'page' | 'program' | 'tool' | 'article';
};

export type Inventory = {
  locale: Locale;
  targets: LinkTarget[];
  recentTitles: string[];
  /** Backlog topic ids already written, read back off the articles themselves. */
  recentTopicSlugs: string[];
  /** Keywords already spent, so the planner is never handed one twice. */
  usedKeywords: string[];
  /** Category names of the recent articles, one entry per article (for rotation). */
  recentCategories: string[];
  /**
   * Subject family and destination of the recent articles, newest first. What
   * the variety rules in diversity.ts read, so the next pick continues from
   * what was actually published rather than from a clean slate.
   */
  recentTags: Tagged[];
  categories: { name: string; slug: string }[];
};

type Page = { path: string; en: string; kind: LinkTarget['kind'] };

/** English static pages. Keep in step with EN_PATHS in app/sitemap.ts. */
export const SITE_PAGES: Page[] = [
  { path: '/startup-visa-canada', en: 'Canada Start-up Visa (SUV) status guide', kind: 'page' },
  { path: '/c10-work-permit', en: 'C10 significant benefit work permit (C10, C11, C60)', kind: 'page' },
  { path: '/pnp', en: 'Provincial Nominee Programs overview', kind: 'program' },
  { path: '/pnp/bc', en: 'British Columbia PNP (BC PNP)', kind: 'program' },
  { path: '/pnp/alberta', en: 'Alberta Rural Entrepreneur Stream (AAIP)', kind: 'program' },
  { path: '/pnp/manitoba', en: 'Manitoba Business Investor Stream, Entrepreneur Pathway', kind: 'program' },
  { path: '/pnp/new-brunswick', en: 'New Brunswick Business Immigration Stream (NBBIS)', kind: 'program' },
  { path: '/pnp/newfoundland', en: 'Newfoundland and Labrador PNP', kind: 'program' },
  { path: '/pnp/nova-scotia', en: 'Nova Scotia Entrepreneur stream (NSNP)', kind: 'program' },
  { path: '/pnp/pei', en: 'PEI PNP Business Work Permit Stream (no 2026 invitations)', kind: 'program' },
  { path: '/usa/eb1', en: 'US EB-1 extraordinary ability green card', kind: 'program' },
  { path: '/usa/eb2-niw', en: 'US EB-2 National Interest Waiver', kind: 'program' },
  { path: '/usa/eb5', en: 'US EB-5 investor green card', kind: 'program' },
  { path: '/usa/o-1a', en: 'O-1A visa for startup founders', kind: 'program' },
  { path: '/usa/e-2', en: 'E-2 treaty investor visa for founders', kind: 'program' },
  { path: '/usa/why-petitions-fail', en: 'Why strong founder O-1A and EB-1A petitions fail', kind: 'page' },
  { path: '/usa/o-1a-eb-1a-niw', en: 'O-1A vs EB-1A vs EB-2 NIW for founders', kind: 'page' },
  { path: '/usa/assessment', en: 'US readiness assessment for founders', kind: 'page' },
  { path: '/usa/founder-readiness', en: 'US founder petition readiness programme', kind: 'page' },
  { path: '/europe/netherlands', en: 'Netherlands start-up visa', kind: 'program' },
  { path: '/europe/finland', en: 'Finland start-up permit', kind: 'program' },
  { path: '/europe/denmark', en: 'Start-up Denmark', kind: 'program' },
  { path: '/country/italy', en: 'Italia Startup Visa', kind: 'program' },
  { path: '/uae/golden-visa', en: 'UAE Golden Visa', kind: 'program' },
  { path: '/country/canada', en: 'Immigrate to Canada as a founder', kind: 'page' },
  { path: '/country/usa', en: 'US visa routes for startup founders, compared', kind: 'page' },
  { path: '/country/australia', en: 'The Australian National Innovation Visa (subclass 858)', kind: 'program' },
  { path: '/country/uae', en: 'Relocate to the UAE', kind: 'page' },
  { path: '/country/denmark', en: 'Immigrate to Denmark', kind: 'page' },
  { path: '/country/finland', en: 'Immigrate to Finland', kind: 'page' },
  { path: '/country/israel', en: 'The Israel Innovation Visa', kind: 'page' },
  { path: '/country/turkey', en: 'The Türkiye Tech Visa', kind: 'program' },
  { path: '/tools/express-entry', en: 'Free Express Entry pathway diagnostic (CRS calculator)', kind: 'tool' },
  { path: '/tools', en: 'Free immigration tools', kind: 'tool' },
  { path: '/services', en: 'Business plan, financial model and pitch deck services', kind: 'page' },
  { path: '/mentorship', en: 'Founder mentorship programme', kind: 'page' },
  { path: '/webinar', en: 'Free immigration webinar registration', kind: 'page' },
  { path: '/book-meeting', en: 'Book a strategy call', kind: 'page' },
  { path: '/contact', en: 'Request a free advisory', kind: 'page' },
  { path: '/about', en: 'About Startup Visa Roads', kind: 'page' },
  { path: '/team', en: 'Our team — startup mentors and advisors', kind: 'page' },
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
  { path: '/canada-startup-visa', label: 'راهنمای وضعیت ویزای استارتاپ کانادا (SUV)', kind: 'page' },
  { path: '/pnp', label: 'برنامه‌های استانی کانادا (PNP)', kind: 'program' },
  { path: '/pnp/alberta', label: 'برنامه کارآفرینی آلبرتا (AAIP)', kind: 'program' },
  { path: '/pnp/manitoba', label: 'مسیر کارآفرینی منیتوبا (MPNP)', kind: 'program' },
  { path: '/pnp/new-brunswick', label: 'مسیر کارآفرینی نیوبرانزویک (NBBIS)', kind: 'program' },
  { path: '/pnp/nova-scotia', label: 'مسیر کارآفرینی نوااسکوشیا', kind: 'program' },
  { path: '/europe/finland', label: 'ویزای استارتاپ فنلاند', kind: 'program' },
  { path: '/europe/denmark', label: 'ویزای استارتاپ دانمارک (Start-up Denmark)', kind: 'program' },
  { path: '/europe/netherlands', label: 'ویزای استارتاپ هلند', kind: 'program' },
  { path: '/europe/estonia', label: 'ویزای استارتاپ استونی', kind: 'program' },
  { path: '/europe/italy', label: 'ویزای استارتاپ ایتالیا (Italia Startup Visa)', kind: 'program' },
  { path: '/turkey-tech-visa', label: 'تک‌ویزای ترکیه (Türkiye Tech Visa)', kind: 'program' },
  { path: '/usa-eb2-niw', label: 'ویزای EB-2 NIW آمریکا برای متخصصان ایرانی', kind: 'program' },
  { path: '/usa', label: 'مسیرهای ویزای آمریکا برای فاندرها', kind: 'page' },
  { path: '/usa/o-1a', label: 'ویزای O-1A آمریکا برای فاندرها', kind: 'program' },
  { path: '/usa/e-2', label: 'ویزای E-2 آمریکا و شرط ملیت', kind: 'program' },
  { path: '/usa/why-petitions-fail', label: 'چرا پرونده‌های خوب O-1A و EB-1A رد می‌شوند', kind: 'page' },
  { path: '/usa/o-1a-eb-1a-niw', label: 'مقایسه‌ی O-1A، EB-1A و EB-2 NIW', kind: 'page' },
  { path: '/usa/assessment', label: 'ارزیابی آمادگی آمریکا', kind: 'page' },
  { path: '/usa/founder-readiness', label: 'برنامه‌ی آمادگی پرونده‌ی فاندر برای آمریکا', kind: 'page' },
  // A reference page, not a route we run: kind 'page' on purpose, so the
  // writer cites it as background rather than recommending it as a path.
  { path: '/israel', label: 'ویزای نوآوری اسرائیل — و چرا برای متقاضی ایرانی باز نیست', kind: 'page' },
  { path: '/australia', label: 'ویزای نوآوری ملی استرالیا (ساب‌کلاس ۸۵۸)', kind: 'program' },
  { path: '/which-path', label: 'کدام مسیر مهاجرت برای شما مناسب است؟ (ارزیابی رایگان)', kind: 'tool' },
  { path: '/mentorship', label: 'برنامه منتورشیپ و آماده‌سازی بنیان‌گذاران', kind: 'page' },
  { path: '/faq', label: 'سؤالات متداول مهاجرت استارتاپی', kind: 'page' },
  { path: '/webinar', label: 'وبینار رایگان مهاجرت استارتاپی', kind: 'page' },
  { path: '/about', label: 'درباره ما', kind: 'page' },
  { path: '/team', label: 'تیم ما — منتورهای استارتاپ', kind: 'page' },
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
      where: { status: 'PUBLISHED', locale, AND: [NOT_WITHDRAWN] },
      select: { slug: true, title: true, topicSeed: true, category: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      // Titles and categories only need the recent past; a spent keyword is
      // spent for good, so this reaches back further than the 60 the rotation
      // used to need.
      take: 400,
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
    recentTitles: recent.slice(0, 60).map((a) => a.title),
    recentTopicSlugs: recent
      .map((a) => /\[topic:([a-z0-9-]+)\]/.exec(a.topicSeed ?? '')?.[1])
      .filter((s): s is string => Boolean(s)),
    usedKeywords: recent
      .map((a) => /\[kw:([^\]]+)\]/.exec(a.topicSeed ?? '')?.[1])
      .filter((s): s is string => Boolean(s)),
    recentCategories: recent.slice(0, 60).map((a) => a.category?.name ?? ''),
    recentTags: recent.slice(0, 30).map((a) => tagsOf(a)),
    categories: cats,
  };
}

/** The inventory block every writer prompt pastes verbatim. */
export function linkBlock(inv: Inventory): string {
  return inv.targets.map((t) => `${t.path} — ${t.label}`).join('\n');
}
