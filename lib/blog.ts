import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

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
  page,
  pageSize,
}: {
  locale: string;
  activeCategorySlug?: string;
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

    const totalCount = await prisma.article.count({
      where: {
        status: 'PUBLISHED',
        locale,
        ...(activeCategorySlug ? { category: { slug: activeCategorySlug } } : {}),
      },
    });

    let featuredArticle: ArticleRecord | null = null;
    let gridArticles: ArticleRecord[] = [];

    if (activeCategorySlug) {
      gridArticles = await prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          locale,
          category: { slug: activeCategorySlug },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true, tags: true },
      });
    } else if (page === 1) {
      const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED', locale },
        orderBy: { createdAt: 'desc' },
        take: pageSize + 1,
        include: { category: true, tags: true },
      });
      featuredArticle = articles[0] ?? null;
      gridArticles = featuredArticle ? articles.slice(1) : articles;
    } else {
      gridArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED', locale },
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
    return await prisma.article.findUnique({
      where: { slug },
      include: { category: true, tags: true },
    });
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    console.warn(`Legacy blog schema detected while loading article "${slug}".`);
    const rows = await queryLegacyArticles({ slug, take: 1 });
    const row = rows[0];
    if (!row) return null;

    const article = mapLegacyArticle(row, locale);
    article.tags = await queryLegacyTags(article.id);
    return article;
  }
}

export async function getRelatedArticle(article: {
  id: string;
  categoryId?: string | null;
}) {
  try {
    return (
      await prisma.article.findFirst({
        where: {
          NOT: { id: article.id },
          status: 'PUBLISHED',
          ...(article.categoryId ? { categoryId: article.categoryId } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    ) || (
      await prisma.article.findFirst({
        where: {
          NOT: { id: article.id },
          status: 'PUBLISHED',
        },
        orderBy: { createdAt: 'desc' },
      })
    );
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    const sameCategory = await queryLegacyArticles({
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

    const row = rows[0] ?? sameCategory.find((candidate) => candidate.id !== article.id) ?? null;
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

    return { category, articles };
  } catch (error) {
    if (!isLegacyArticleSchemaError(error)) {
      throw error;
    }

    const category = await prisma.category.findUnique({
      where: { slug },
    });
    if (!category) return null;

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
      articles: rows.map((row) => mapLegacyArticle(row, locale)),
    };
  }
}
