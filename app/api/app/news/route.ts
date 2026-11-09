// ============================================================================
// GET /api/app/news?locale=en|fa&since=<ISO>
//
// Published, not-withdrawn articles for the mobile app's in-app reader:
// newest 50 by createdAt (or only those updated after `since`), each with
// the body sanitised to the tag set the app renders (lib/sanitize.ts
// sanitizeForApp) and the countries it mentions (lib/news-countries.ts).
// Public, CORS `*`, strong ETag answering If-None-Match with 304.
//
// Shape: { generatedAt, locale, items: [{ id, slug, title, excerpt, html,
//          coverImage, category, countries, publishedAt, updatedAt, url }] }
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';
import { NOT_WITHDRAWN } from '@/lib/legacy-redirects';
import { NEWS_LIMIT, newsEtag, parseNewsLocale, parseSince, toNewsItem, type NewsResponse } from '@/lib/app-api/news';

export const revalidate = 600;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, If-None-Match',
  'Access-Control-Expose-Headers': 'ETag',
};

const CACHE_CONTROL = 'public, max-age=600, stale-while-revalidate=3600';

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' } });
}

export async function GET(req: NextRequest) {
  const locale = parseNewsLocale(req.nextUrl.searchParams.get('locale'));
  const sinceParam = req.nextUrl.searchParams.get('since');
  const parsedSince = parseSince(sinceParam);
  if (!parsedSince.ok) {
    return NextResponse.json({ error: '`since` must be an ISO 8601 date' }, { status: 400, headers: CORS_HEADERS });
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        locale,
        AND: [NOT_WITHDRAWN],
        ...(parsedSince.since ? { updatedAt: { gt: parsedSince.since } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: NEWS_LIMIT,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { name: true } },
      },
    });

    const newestUpdatedAt = articles.reduce<Date | null>(
      (max, a) => (max === null || a.updatedAt > max ? a.updatedAt : max),
      null,
    );
    const etag = newsEtag({
      locale,
      count: articles.length,
      newestUpdatedAt: newestUpdatedAt?.toISOString() ?? null,
      since: parsedSince.since?.toISOString() ?? null,
    });
    const headers = { ...CORS_HEADERS, 'Cache-Control': CACHE_CONTROL, ETag: etag, Vary: 'Accept-Encoding' };

    if (req.headers.get('if-none-match') === etag) {
      return new Response(null, { status: 304, headers });
    }

    const body: NewsResponse = {
      generatedAt: new Date().toISOString(),
      locale,
      items: articles.map((a) => toNewsItem(a, locale, SITE_URL)),
    };
    return NextResponse.json(body, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`app/news: ${message}`);
    return NextResponse.json({ error: 'News is unavailable right now' }, { status: 500, headers: { ...CORS_HEADERS, 'Cache-Control': 'no-store' } });
  }
}
