// ============================================================================
// lib/agent-articles.ts
// Hand-written articles from the local Claude agents, published now or held
// for a date.
//
// No schema change: a held article is a row with status SCHEDULED and
// createdAt set to the moment it should appear. Every public query filters on
// status === 'PUBLISHED', so a SCHEDULED row is invisible until
// releaseScheduled() flips it. The release runs on the 15-minute knowledge
// ingest cron, so an article appears within a quarter hour of its time.
// ============================================================================
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { sanitizeHtml } from '@/lib/sanitize';
import { shareToSocials } from '@/lib/socials';
import { backfillCovers } from '@/lib/covers';

export const SCHEDULED = 'SCHEDULED';

export interface AgentArticlePayload {
  locale: 'en' | 'fa';
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  tags?: string[];
  keyTakeaway?: string;
  summaryEn?: string;
  faq?: { q: string; a: string }[];
  internalLinks?: string[];
  coverImage?: string;
  topicSeed?: string;
  /** ISO time. Absent or in the past = publish now. */
  publishAt?: string;
}

type Parsed = { ok: true; article: AgentArticlePayload; publishAt: Date | null } | { ok: false; error: string };

const str = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : undefined;

export function parseAgentArticle(body: unknown, now = new Date()): Parsed {
  if (!body || typeof body !== 'object') return { ok: false, error: 'body must be an object' };
  const b = body as Record<string, unknown>;
  const locale = b.locale === 'fa' ? 'fa' : b.locale === 'en' ? 'en' : null;
  if (!locale) return { ok: false, error: 'locale must be en or fa' };
  const title = str(b.title, 200);
  const excerpt = str(b.excerpt, 600);
  const content = str(b.content, 200_000);
  const rawSlug = str(b.slug, 120);
  if (!title || !excerpt || !content || !rawSlug) return { ok: false, error: 'title, slug, excerpt and content are required' };
  const slug = slugify(rawSlug, { lower: true, strict: true });
  if (!slug || slug !== rawSlug) return { ok: false, error: `slug must be lowercase latin with hyphens (got "${rawSlug}")` };

  let publishAt: Date | null = null;
  if (b.publishAt !== undefined && b.publishAt !== null) {
    const d = new Date(String(b.publishAt));
    if (Number.isNaN(d.getTime())) return { ok: false, error: 'publishAt is not a date' };
    if (d.getTime() > now.getTime() + 60_000) publishAt = d;
    if (d.getTime() > now.getTime() + 400 * 86_400_000) return { ok: false, error: 'publishAt is more than 400 days away' };
  }

  const faq = Array.isArray(b.faq)
    ? b.faq.filter((x): x is { q: string; a: string } => !!x && typeof (x as any).q === 'string' && typeof (x as any).a === 'string')
    : undefined;
  const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()) : undefined);

  return {
    ok: true,
    publishAt,
    article: {
      locale,
      slug,
      title,
      excerpt,
      content,
      category: str(b.category, 80),
      tags: strings(b.tags),
      keyTakeaway: str(b.keyTakeaway, 1200),
      summaryEn: str(b.summaryEn, 1200),
      faq,
      internalLinks: strings(b.internalLinks),
      coverImage: str(b.coverImage, 1000),
      topicSeed: str(b.topicSeed, 1000),
    },
  };
}

async function categoryId(name?: string): Promise<string | null> {
  if (!name) return null;
  const slug = slugify(name, { lower: true, strict: true });
  const c = await prisma.category.findFirst({ where: { OR: [{ slug }, { name }] } });
  return c?.id ?? null;
}

/**
 * Create or replace the article with this slug. Replacing is how a correction
 * is made; a slug owned by an article in the other locale is refused.
 */
export async function upsertAgentArticle(a: AgentArticlePayload, publishAt: Date | null) {
  const existing = await prisma.article.findUnique({ where: { slug: a.slug }, select: { id: true, locale: true, status: true, createdAt: true } });
  if (existing && existing.locale !== a.locale) throw new Error(`slug ${a.slug} belongs to a ${existing.locale} article`);

  const tags = [];
  for (const name of a.tags ?? []) tags.push(await prisma.tag.upsert({ where: { name }, update: {}, create: { name }, select: { id: true } }));

  const status = publishAt ? SCHEDULED : 'PUBLISHED';
  const data = {
    title: a.title,
    excerpt: a.excerpt,
    content: sanitizeHtml(a.content),
    locale: a.locale,
    keyTakeaway: a.keyTakeaway ?? null,
    summaryEn: a.summaryEn ?? null,
    faq: a.faq?.length ? JSON.stringify(a.faq) : null,
    internalLinks: JSON.stringify(a.internalLinks ?? []),
    topicSeed: a.topicSeed ?? 'agent-article',
    aiModel: 'claude (agent-articles)',
    categoryId: await categoryId(a.category),
    status,
    // A held article carries its release time; a correction to a live one keeps its date.
    createdAt: publishAt ?? (existing?.status === 'PUBLISHED' ? existing.createdAt : new Date()),
    ...(a.coverImage ? { coverImage: a.coverImage } : {}),
  };

  const row = existing
    ? await prisma.article.update({ where: { id: existing.id }, data: { ...data, tags: { set: tags } } })
    : await prisma.article.create({ data: { ...data, slug: a.slug, tags: { connect: tags } } });

  const firstPublish = status === 'PUBLISHED' && existing?.status !== 'PUBLISHED';
  if (firstPublish) await afterPublish(row.id, row.slug, !row.coverImage);
  return { row, status, firstPublish };
}

async function afterPublish(id: string, slug: string, needsCover: boolean) {
  if (needsCover) await backfillCovers({ slug, limit: 1 }).catch((e) => console.error('[agent-articles] cover', slug, e));
  await shareToSocials(id).catch((e) => console.error('[agent-articles] socials', slug, e));
}

/** Publish every SCHEDULED article whose time has come. Safe to call often. */
export async function releaseScheduled(now = new Date(), limit = 5) {
  const due = await prisma.article.findMany({
    where: { status: SCHEDULED, createdAt: { lte: now } },
    orderBy: { createdAt: 'asc' },
    take: limit,
    select: { id: true, slug: true, coverImage: true },
  });
  const released: string[] = [];
  for (const a of due) {
    // updateMany with the status in the filter, so two overlapping cron ticks cannot both release it.
    const { count } = await prisma.article.updateMany({ where: { id: a.id, status: SCHEDULED }, data: { status: 'PUBLISHED' } });
    if (!count) continue;
    released.push(a.slug);
    await afterPublish(a.id, a.slug, !a.coverImage);
  }
  return released;
}
