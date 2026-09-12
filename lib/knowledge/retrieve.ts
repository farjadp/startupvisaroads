// ============================================================================
// lib/knowledge/retrieve.ts
// Build the evidence pack for a brief: the chunks that answer it, scored by
// meaning, wording, trust and freshness, plus the digests of pinned sources.
// Rendered as [S1]…[Sn] blocks the writer cites. The scoring is a pure
// function so it can be tested without a database.
// ============================================================================
import prisma from '@/lib/prisma';
import { cosine, decodeVector, embedQuery } from './embed';

export type EvidenceItem = {
  ref: string;
  chunkId: string;
  documentId: string;
  sourceId: string;
  title: string;
  url: string | null;
  trust: string;
  kind: string;
  locator: string | null;
  publishedAt: string | null;
  fetchedAt: string;
  text: string;
  score: number;
  parts: { cosine: number; keyword: number; trust: number; recency: number };
};

export type EvidencePack = {
  query: string;
  items: EvidenceItem[];
  pinned: { sourceId: string; title: string; url: string | null; digest: string }[];
  rendered: string;
  candidates: number;
};

export const WEIGHTS = { cosine: 0.65, keyword: 0.2, trust: 0.1, recency: 0.05 } as const;
const TRUST: Record<string, number> = { official: 1, press: 0.5, commentary: 0.2 };
const RECENCY_DAYS = 18 * 30;

const STOP = new Set('the a an and or of to in for on with by from at is are be as this that it its how what which who when where why do does can your you we our'.split(' '));

export function queryTerms(q: string): string[] {
  return [...new Set(q.toLowerCase().split(/[^\p{L}\p{N}‌-]+/u).filter((t) => t.length > 2 && !STOP.has(t)))];
}

export function keywordOverlap(terms: string[], text: string): number {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const t of terms) if (hay.includes(t)) hit++;
  return hit / terms.length;
}

export function recencyScore(date: Date | null, isGuide: boolean, now = Date.now()): number {
  if (isGuide || !date) return 0.5;
  const age = (now - date.getTime()) / 864e5;
  return Math.max(0, 1 - age / RECENCY_DAYS);
}

export function scoreChunk(parts: EvidenceItem['parts']): number {
  return WEIGHTS.cosine * parts.cosine + WEIGHTS.keyword * parts.keyword + WEIGHTS.trust * parts.trust + WEIGHTS.recency * parts.recency;
}

const intersects = (a: string[], b: string[]) => a.some((x) => b.includes(x));
const parseList = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

export type RetrieveOpts = { k?: number; topics?: string[]; perDocument?: number; minScore?: number };

export async function retrieveEvidence(query: string, opts: RetrieveOpts = {}): Promise<EvidencePack> {
  const k = opts.k ?? 12;
  const perDocument = opts.perDocument ?? 4;
  const topics = (opts.topics ?? []).map((t) => t.toLowerCase());
  const terms = queryTerms(query);

  const docs = await prisma.sourceDocument.findMany({
    where: { status: 'ready', source: { enabled: true } },
    select: {
      id: true, title: true, url: true, publishedAt: true, fetchedAt: true, matchedTopics: true,
      source: { select: { id: true, url: true, trust: true, kind: true, topics: true, pinned: true } },
    },
  });

  // Pre-filter by topic when the brief has one; widen when that leaves too little.
  let pool = docs;
  if (topics.length) {
    const narrowed = docs.filter((d) => d.source.pinned || intersects(topics, parseList(d.source.topics)) || intersects(topics, parseList(d.matchedTopics)));
    if (narrowed.length >= 3) pool = narrowed;
  }
  const byDoc = new Map(pool.map((d) => [d.id, d]));
  const chunks = pool.length
    ? await prisma.sourceChunk.findMany({ where: { documentId: { in: pool.map((d) => d.id) }, embedding: { not: null } }, select: { id: true, documentId: true, text: true, locator: true, embedding: true } })
    : [];

  const pinned = await prisma.source.findMany({
    where: { pinned: true, enabled: true, documents: { some: { status: 'ready', digest: { not: null } } } },
    select: { id: true, title: true, url: true, topics: true, documents: { where: { status: 'ready', digest: { not: null } }, select: { title: true, digest: true }, take: 1, orderBy: { fetchedAt: 'desc' } } },
  });
  const pinnedOut = pinned
    .filter((s) => !topics.length || intersects(topics, parseList(s.topics)))
    .map((s) => ({ sourceId: s.id, title: s.title ?? s.documents[0]?.title ?? 'Pinned source', url: s.url, digest: s.documents[0]?.digest ?? '' }))
    .filter((p) => p.digest);

  if (!chunks.length) return { query, items: [], pinned: pinnedOut, rendered: render([], pinnedOut), candidates: 0 };

  const qv = await embedQuery(query);
  const now = Date.now();
  const scored = chunks.map((c) => {
    const d = byDoc.get(c.documentId)!;
    const isGuide = d.source.kind === 'pdf' || d.source.kind === 'text';
    const parts = {
      cosine: cosine(qv, decodeVector(c.embedding as Uint8Array)),
      keyword: keywordOverlap(terms, c.text),
      trust: TRUST[d.source.trust] ?? 0.3,
      recency: recencyScore(d.publishedAt ?? d.fetchedAt, isGuide, now),
    };
    return { c, d, parts, score: scoreChunk(parts) };
  });
  scored.sort((a, b) => b.score - a.score);

  const items: EvidenceItem[] = [];
  const perDoc = new Map<string, number>();
  const seen = new Set<string>();
  for (const s of scored) {
    if (items.length >= k) break;
    if (opts.minScore !== undefined && s.score < opts.minScore) break;
    const n = perDoc.get(s.d.id) ?? 0;
    if (n >= perDocument) continue;
    const key = s.c.text.slice(0, 160);
    if (seen.has(key)) continue;
    seen.add(key);
    perDoc.set(s.d.id, n + 1);
    items.push({
      ref: `S${items.length + 1}`,
      chunkId: s.c.id,
      documentId: s.d.id,
      sourceId: s.d.source.id,
      title: s.d.title,
      url: s.d.url ?? s.d.source.url,
      trust: s.d.source.trust,
      kind: s.d.source.kind,
      locator: s.c.locator,
      publishedAt: s.d.publishedAt?.toISOString() ?? null,
      fetchedAt: s.d.fetchedAt.toISOString(),
      text: s.c.text,
      score: Math.round(s.score * 1000) / 1000,
      parts: { cosine: r3(s.parts.cosine), keyword: r3(s.parts.keyword), trust: s.parts.trust, recency: r3(s.parts.recency) },
    });
  }
  return { query, items, pinned: pinnedOut, rendered: render(items, pinnedOut), candidates: chunks.length };
}

const r3 = (n: number) => Math.round(n * 1000) / 1000;
const day = (iso: string | null) => (iso ? iso.slice(0, 10) : 'n.d.');

/** The block the writer sees. Evidence is DATA: the frame says so. */
export function render(items: EvidenceItem[], pinned: EvidencePack['pinned']): string {
  const out: string[] = [];
  if (pinned.length) {
    out.push('PINNED SOURCES (digests — always in scope for this topic):');
    for (const p of pinned) out.push(`— ${p.title}${p.url ? ` <${p.url}>` : ''}\n${p.digest}`);
    out.push('');
  }
  if (items.length) {
    out.push('EVIDENCE (cite as [S1], [S2] …; a figure not in here must not appear in the article):');
    for (const it of items) {
      const where = [it.locator, it.publishedAt ? `published ${day(it.publishedAt)}` : `fetched ${day(it.fetchedAt)}`].filter(Boolean).join(', ');
      out.push(`[${it.ref}] ${it.title} (${it.trust}${it.url ? `, ${it.url}` : ''}; ${where})\n«${it.text}»`);
    }
  } else if (!pinned.length) {
    out.push('EVIDENCE: none on file for this subject. Do not invent figures; write only what BRAND_FACTS and the site pages support.');
  }
  return out.join('\n\n');
}
