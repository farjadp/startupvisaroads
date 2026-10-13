// ============================================================================
// lib/autopilot/own-corpus.ts
// The published articles a new body is compared with (quality.ts). Read once
// per locale per process: a run writes a handful of articles, and the ones it
// has just written are added by the caller, not re-read.
// ============================================================================
import prisma from '@/lib/prisma';
import type { Locale } from '@/lib/seo';
import type { OwnArticle } from './quality';

/** The most recent published articles: enough to catch a repeat, not the whole archive. */
const CORPUS_SIZE = 80;

const cache = new Map<Locale, Promise<OwnArticle[]>>();

export function ownCorpus(locale: Locale): Promise<OwnArticle[]> {
  let hit = cache.get(locale);
  if (!hit) {
    hit = prisma.article.findMany({
      where: { status: 'PUBLISHED', locale },
      orderBy: { createdAt: 'desc' },
      take: CORPUS_SIZE,
      select: { title: true, content: true },
    });
    cache.set(locale, hit);
  }
  return hit;
}
