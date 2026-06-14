// ============================================================================
// Shared article persistence logic used by both the instant AI writer
// (/api/ai/generate) and the cron auto-pilot (/api/cron/generate).
// Keeps slug generation, category resolution and tag linking consistent.
// ============================================================================

import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { sanitizeHtml } from '@/lib/sanitize';
import type { Locale } from '@/lib/seo';
import { shareToSocials } from '@/lib/socials';

export interface ArticlePayload {
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  content: string;
  coverImage?: string | null;
}

export interface CreateArticleOptions {
  locale: Locale;
  status?: 'DRAFT' | 'PUBLISHED';
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true }) || 'article';
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

/**
 * Resolve a category name to an existing category id. Categories are a curated
 * set managed in the admin console — we never auto-create new ones here.
 * Falls back to the first existing category if the AI picks an unknown name.
 */
async function resolveCategoryId(categoryName?: string): Promise<string | null> {
  if (!categoryName) return null;
  const name = categoryName.trim();
  if (!name) return null;
  const slug = slugify(name, { lower: true, strict: true });

  const category = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name }] },
  });
  if (category) return category.id;

  const fallback = await prisma.category.findFirst({ orderBy: { name: 'asc' } });
  return fallback?.id ?? null;
}

async function linkTags(tagNames: string[] = []): Promise<{ id: string }[]> {
  const connections: { id: string }[] = [];
  for (const raw of tagNames) {
    const name = raw.trim();
    if (!name) continue;
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    connections.push({ id: tag.id });
  }
  return connections;
}

export async function createArticleFromPayload(payload: ArticlePayload, options: CreateArticleOptions) {
  const slug = await generateUniqueSlug(payload.title);
  const categoryId = await resolveCategoryId(payload.category);
  const tagConnections = await linkTags(payload.tags);

  const article = await prisma.article.create({
    data: {
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: sanitizeHtml(payload.content),
      coverImage: payload.coverImage || null,
      status: options.status ?? 'PUBLISHED',
      locale: options.locale,
      ...(categoryId ? { categoryId } : {}),
      tags: { connect: tagConnections },
    },
  });

  if (article.status === 'PUBLISHED') {
    await shareToSocials(article.id);
  }

  return article;
}
