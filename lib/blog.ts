import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { toPersianDigits } from '@/lib/fa/format';

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
};

type ArticleRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: CategoryRecord | null;
  tags: { id: string; name: string }[];
};

type LegacyArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

export function computeReadingTime(content: string, locale: string) {
  const text = content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200) || 1;
  return locale === 'fa'
    ? `${toPersianDigits(minutes)} دقیقه مطالعه`
    : `${minutes} min read`;
}

const SAFE_QUICK_FACT_KEYS = new Set([
  'level',
  'suitableFor',
  'keyBenefit',
  'actionability',
  'requirements',
]);
const UNSUPPORTED_FACT_CLAIM = /[%٪]|^\s*(?:\d{4}|[۰-۹]{4})\s*$|\b(?:percent|compliance|compliant|official(?:ly)?|validat(?:ed|ion)|approved|verified|certified|aligned\s+with|regulations?\s+(?:status|20\d\d))\b|\b20\d\d\b|درصد|تطابق|رسمی|تأیید|تایید|اعتبارسنج|قوانین\s*[۰-۹0-9]{4}/i;

export function getSafeQuickFacts(facts: unknown): Record<string, string> {
  if (!facts || typeof facts !== 'object' || Array.isArray(facts)) return {};

  return Object.fromEntries(
    Object.entries(facts)
      .filter(([key, value]) => SAFE_QUICK_FACT_KEYS.has(key)
        && typeof value === 'string'
        && value.trim().length > 0
        && !UNSUPPORTED_FACT_CLAIM.test(value))
      .map(([key, value]) => [key, (value as string).trim()]),
  );
}

export function buildBlogPageHref(page: number, filters: { category?: string; q?: string }) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.q) params.set('q', filters.q);
  params.set('page', String(page));
  return `/blog?${params.toString()}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildRelatedArticleBox({
  locale,
  isRtl,
  article,
}: {
  locale: string;
  isRtl: boolean;
  article: { slug: string; title: string; excerpt?: string | null };
}) {
  const label = isRtl ? 'مطالعه پیشنهادی' : 'RECOMMENDED READING';
  const href = `/${encodeURIComponent(locale)}/blog/${encodeURIComponent(article.slug)}`;
  return `
    <div class="my-8 p-6 bg-[#1a1a1a]/[0.03] ${isRtl ? 'border-r-4 text-right' : 'border-l-4 text-left'} border-[#CCFF00] font-sans not-prose rounded-lg" dir="${isRtl ? 'rtl' : 'ltr'}">
      <span class="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 block mb-2">${label}</span>
      <a href="${href}" class="font-serif text-xl font-bold text-[#1a1a1a] hover:text-[#CCFF00] transition-colors block mb-1">${escapeHtml(article.title)}</a>
      ${article.excerpt ? `<p class="text-xs text-[#1a1a1a]/60 line-clamp-2 mt-1 leading-relaxed">${escapeHtml(article.excerpt)}</p>` : ''}
    </div>
  `;
}

type RecommendedService = { path: string; title: string; desc: string };

export function getRecommendedService(title: string, categoryName: string, locale: string): RecommendedService {
  const content = `${title} ${categoryName}`.toLowerCase();
  const isFa = locale === 'fa';
  const matches = (keywords: string[]) => keywords.some((keyword) => content.includes(keyword));

  if (matches(['canada', 'suv', 'startup visa', 'کانادا', 'استارتاپ کانادا'])) {
    return isFa
      ? { path: '/canada-startup-visa', title: 'راهنمای وضعیت ویزای استارتاپ کانادا', desc: 'وضعیت فعلی برنامه و منابع رسمی مرتبط با متقاضیان ویزای استارتاپ کانادا را بررسی کنید.' }
      : { path: '/startup-visa-canada', title: 'Canada Startup Visa Status Guide', desc: 'Review the program’s current status and official resources for Canada Startup Visa applicants.' };
  }
  if (matches(['work permit', 'startup work permit', 'مجوز کار', 'ورک پرمیت'])) {
    return isFa
      ? { path: '/which-path', title: 'راهنمای انتخاب مسیر', desc: 'مسیرهای موجود را بر اساس شرایط و هدف خود مقایسه کنید.' }
      : { path: '/startupworkpermit', title: 'Canada Startup Work Permit Guide', desc: 'Read the current eligibility and process information for the startup work permit route.' };
  }
  if (matches(['finland', 'finnish', 'فنلاند'])) {
    return { path: '/europe/finland', title: isFa ? 'راهنمای ویزای استارتاپ فنلاند' : 'Finland Startup Visa Guide', desc: isFa ? 'شرایط و مراحل مسیر استارتاپ فنلاند را مرور کنید.' : 'Review the requirements and process for Finland’s startup route.' };
  }
  if (matches(['denmark', 'danish', 'دانمارک'])) {
    return { path: isFa ? '/europe/denmark' : '/country/denmark', title: isFa ? 'راهنمای استارتاپ دانمارک' : 'Start-up Denmark Guide', desc: isFa ? 'شرایط و مراحل برنامه استارتاپ دانمارک را مرور کنید.' : 'Review the requirements and process for Start-up Denmark.' };
  }
  if (matches(['eb2', 'eb-2', 'niw', 'ان آی دبلیو'])) {
    return { path: isFa ? '/usa-eb2-niw' : '/usa/eb2-niw', title: isFa ? 'راهنمای EB-2 NIW آمریکا' : 'US EB-2 NIW Guide', desc: isFa ? 'معیارها و فرایند مسیر EB-2 NIW را بررسی کنید.' : 'Review the criteria and process for the EB-2 NIW route.' };
  }
  if (matches(['pnp', 'provincial', 'ontario', 'bc', 'alberta', 'ساسکاچوان', 'انتاریو', 'بریتیش کلمبیا'])) {
    return { path: '/pnp', title: isFa ? 'راهنمای برنامه‌های نامزدی استانی' : 'Provincial Nominee Program Guides', desc: isFa ? 'راهنماهای برنامه‌های استانی کانادا را مرور کنید.' : 'Explore current guides to Canada’s provincial nominee programs.' };
  }
  if (matches(['netherlands', 'dutch', 'هلند'])) {
    return isFa
      ? { path: '/which-path', title: 'راهنمای انتخاب مسیر', desc: 'مسیرهای موجود را بر اساس شرایط و هدف خود مقایسه کنید.' }
      : { path: '/europe/netherlands', title: 'Netherlands Startup Visa Guide', desc: 'Review the requirements and process for the Netherlands startup route.' };
  }
  if (matches(['australia', 'استرالیا'])) {
    return isFa
      ? { path: '/which-path', title: 'راهنمای انتخاب مسیر', desc: 'مسیرهای موجود را بر اساس شرایط و هدف خود مقایسه کنید.' }
      : { path: '/country/australia', title: 'Australia National Innovation Visa Guide', desc: 'Review current information about Australia’s entrepreneur pathway.' };
  }
  if (matches(['eb1', 'eb-1', 'ای بی ۱'])) {
    return isFa
      ? { path: '/which-path', title: 'راهنمای انتخاب مسیر', desc: 'مسیرهای موجود را بر اساس شرایط و هدف خود مقایسه کنید.' }
      : { path: '/usa/eb1', title: 'US EB-1 Guide', desc: 'Review the criteria and process for the EB-1 route.' };
  }
  if (matches(['eb5', 'eb-5', 'ای بی ۵'])) {
    return isFa
      ? { path: '/which-path', title: 'راهنمای انتخاب مسیر', desc: 'مسیرهای موجود را بر اساس شرایط و هدف خود مقایسه کنید.' }
      : { path: '/usa/eb5', title: 'US EB-5 Guide', desc: 'Review the criteria and process for the EB-5 route.' };
  }

  return {
    path: isFa ? '/mentorship' : '/services',
    title: isFa ? 'برنامه منتورشیپ استارتاپ' : 'Business Architecture Services',
    desc: isFa ? 'با فرایند منتورشیپ و آمادگی کسب‌وکار آشنا شوید.' : 'Explore business planning, financial modelling, and pitch-deck support.',
  };
}

function mapLegacyArticle(row: LegacyArticleRow, locale: string): ArticleRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage,
    status: row.status,
    locale,
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
    categoryId: row.categoryId,
    category: row.categoryId && row.categoryName && row.categorySlug
      ? { id: row.categoryId, name: row.categoryName, slug: row.categorySlug }
      : null,
    tags: [],
  };
}

export function isLegacyArticleSchemaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return [
    'no such column: locale',
    'no such column: Article.locale',
    'column "locale" does not exist',
    'column "Article"."locale" does not exist',
  ].some((needle) => message.includes(needle));
}

async function queryLegacyCategories() {
  return prisma.$queryRaw<CategoryRecord[]>(Prisma.sql`
    SELECT DISTINCT c."id", c."name", c."slug"
    FROM "Category" c
    INNER JOIN "Article" a ON a."categoryId" = c."id"
    WHERE a."status" = 'PUBLISHED'
    ORDER BY c."name" ASC
  `);
}

async function queryLegacyArticleCount(categorySlug?: string) {
  const rows = await prisma.$queryRaw<Array<{ count: bigint | number }>>(Prisma.sql`
    SELECT COUNT(*) AS count
    FROM "Article" a
    LEFT JOIN "Category" c ON c."id" = a."categoryId"
    WHERE a."status" = 'PUBLISHED'
    ${categorySlug ? Prisma.sql`AND c."slug" = ${categorySlug}` : Prisma.empty}
  `);

  const value = rows[0]?.count ?? 0;
  return typeof value === 'bigint' ? Number(value) : value;
}

async function queryLegacyArticles(args: {
  take: number;
  skip?: number;
  categorySlug?: string;
  slug?: string;
}) {
  const { take, skip = 0, categorySlug, slug } = args;

  return prisma.$queryRaw<LegacyArticleRow[]>(Prisma.sql`
    SELECT
      a."id",
      a."title",
      a."slug",
      a."excerpt",
      a."content",
      a."coverImage",
      a."status",
      a."createdAt",
      a."updatedAt",
      a."categoryId",
      c."name" AS "categoryName",
      c."slug" AS "categorySlug"
    FROM "Article" a
    LEFT JOIN "Category" c ON c."id" = a."categoryId"
    WHERE a."status" = 'PUBLISHED'
    ${categorySlug ? Prisma.sql`AND c."slug" = ${categorySlug}` : Prisma.empty}
    ${slug ? Prisma.sql`AND a."slug" = ${slug}` : Prisma.empty}
    ORDER BY a."createdAt" DESC
    LIMIT ${take}
    OFFSET ${skip}
  `);
}

async function queryLegacyTags(articleId: string) {
  return prisma.$queryRaw<Array<{ id: string; name: string }>>(Prisma.sql`
    SELECT t."id", t."name"
    FROM "_ArticleTags" at
    INNER JOIN "Tag" t ON t."id" = at."B"
    WHERE at."A" = ${articleId}
    ORDER BY t."name" ASC
  `);
}

export async function getBlogIndexData({
  locale,
  activeCategorySlug,
  searchQuery,
  page,
  pageSize,
}: {
  locale: string;
  activeCategorySlug?: string;
  searchQuery?: string;
  page: number;
  pageSize: number;
}) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        articles: {
          some: { status: 'PUBLISHED', locale },
        },
      },
    });

    const whereClause: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
      locale,
      ...(activeCategorySlug ? { category: { slug: activeCategorySlug } } : {}),
    };

    if (searchQuery?.trim()) {
      const needle = searchQuery.trim().toLocaleLowerCase();
      const matchingArticles = (await prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: { category: true, tags: true },
      })).filter((article) => `${article.title} ${article.excerpt ?? ''}`.toLocaleLowerCase().includes(needle));
      return {
        categories,
        totalCount: matchingArticles.length,
        featuredArticle: null,
        gridArticles: matchingArticles.slice((page - 1) * pageSize, page * pageSize),
      };
    }

    const totalCount = await prisma.article.count({ where: whereClause });
    let featuredArticle: ArticleRecord | null = null;
    let gridArticles: ArticleRecord[] = [];

    if (activeCategorySlug) {
      gridArticles = await prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true, tags: true },
      });
    } else if (page === 1) {
      const articles = await prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: pageSize + 1,
        include: { category: true, tags: true },
      });
      featuredArticle = articles[0] ?? null;
      gridArticles = featuredArticle ? articles.slice(1) : articles;
    } else {
      gridArticles = await prisma.article.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: 1 + (page - 1) * pageSize,
        take: pageSize,
        include: { category: true, tags: true },
      });
    }

    return { categories, totalCount, featuredArticle, gridArticles };
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    console.warn('Legacy blog schema detected; falling back to locale-agnostic queries.');
    if (locale !== 'en') {
      return { categories: [], totalCount: 0, featuredArticle: null, gridArticles: [] };
    }

    const categories = await queryLegacyCategories();
    const totalCount = await queryLegacyArticleCount(activeCategorySlug);

    let featuredArticle: ArticleRecord | null = null;
    let gridArticles: ArticleRecord[] = [];

    if (activeCategorySlug) {
      const rows = await queryLegacyArticles({
        categorySlug: activeCategorySlug,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      gridArticles = rows.map((row) => mapLegacyArticle(row, locale));
    } else if (page === 1) {
      const rows = await queryLegacyArticles({ take: pageSize + 1 });
      const articles = rows.map((row) => mapLegacyArticle(row, locale));
      featuredArticle = articles[0] ?? null;
      gridArticles = featuredArticle ? articles.slice(1) : articles;
    } else {
      const rows = await queryLegacyArticles({
        skip: 1 + (page - 1) * pageSize,
        take: pageSize,
      });
      gridArticles = rows.map((row) => mapLegacyArticle(row, locale));
    }

    return { categories, totalCount, featuredArticle, gridArticles };
  }
}

export async function getArticleBySlug(slug: string, locale: string) {
  try {
    return await prisma.article.findFirst({
      where: { slug, locale },
      include: { category: true, tags: true },
    });
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    console.warn(`Legacy blog schema detected while loading article "${slug}".`);
    if (locale !== 'en') return null;
    const rows = await queryLegacyArticles({ slug, take: 1 });
    const row = rows[0];
    if (!row) return null;

    const article = mapLegacyArticle(row, 'en');
    article.tags = await queryLegacyTags(article.id);
    return article;
  }
}

export async function getRelatedArticle(article: {
  id: string;
  categoryId?: string | null;
  locale: string;
}) {
  try {
    return (
      await prisma.article.findFirst({
        where: {
          NOT: { id: article.id },
          status: 'PUBLISHED',
          locale: article.locale,
          ...(article.categoryId ? { categoryId: article.categoryId } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    ) || (
      await prisma.article.findFirst({
        where: {
          NOT: { id: article.id },
          status: 'PUBLISHED',
          locale: article.locale,
        },
        orderBy: { createdAt: 'desc' },
      })
    );
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    if (article.locale !== 'en') return null;
    const fallbackLatest = await queryLegacyArticles({
      take: 1,
      categorySlug: undefined,
    });

    const rows = article.categoryId
      ? await prisma.$queryRaw<LegacyArticleRow[]>(Prisma.sql`
          SELECT
            a."id",
            a."title",
            a."slug",
            a."excerpt",
            a."content",
            a."coverImage",
            a."status",
            a."createdAt",
            a."updatedAt",
            a."categoryId",
            c."name" AS "categoryName",
            c."slug" AS "categorySlug"
          FROM "Article" a
          LEFT JOIN "Category" c ON c."id" = a."categoryId"
          WHERE a."status" = 'PUBLISHED'
            AND a."id" <> ${article.id}
            AND a."categoryId" = ${article.categoryId}
          ORDER BY a."createdAt" DESC
          LIMIT 1
        `)
      : [];

    const row = rows[0] ?? fallbackLatest.find((candidate) => candidate.id !== article.id) ?? null;
    return row ? mapLegacyArticle(row, 'en') : null;
  }
}

export async function getCategoryArchiveData(locale: string, slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) return null;

    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        locale,
        categoryId: category.id,
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true, tags: true },
    });
    const localeRows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', categoryId: category.id },
      distinct: ['locale'],
      select: { locale: true },
    });

    return { category, articles, availableLocales: localeRows.map((row) => row.locale) };
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    const category = await prisma.category.findUnique({
      where: { slug },
    });
    if (!category) return null;
    if (locale !== 'en') return { category, articles: [], availableLocales: [] };

    const rows = await prisma.$queryRaw<LegacyArticleRow[]>(Prisma.sql`
      SELECT
        a."id",
        a."title",
        a."slug",
        a."excerpt",
        a."content",
        a."coverImage",
        a."status",
        a."createdAt",
        a."updatedAt",
        a."categoryId",
        c."name" AS "categoryName",
        c."slug" AS "categorySlug"
      FROM "Article" a
      INNER JOIN "Category" c ON c."id" = a."categoryId"
      WHERE a."status" = 'PUBLISHED'
        AND c."slug" = ${slug}
      ORDER BY a."createdAt" DESC
    `);

    return {
      category,
      articles: rows.map((row) => mapLegacyArticle(row, 'en')),
      availableLocales: rows.length ? ['en'] : [],
    };
  }
}
