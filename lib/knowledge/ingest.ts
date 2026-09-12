// ============================================================================
// lib/knowledge/ingest.ts
// The job runner. One IngestJob walks a document through
//   fetch → chunk → embed → digest → done
// persisting the step after each so a run cut by the cron's 300 s budget
// resumes where it stopped. Jobs are claimed oldest first; a job that fails
// three times is parked and the source shows the error.
// ============================================================================
import prisma from '@/lib/prisma';
import { chunkText } from './chunk';
import { embedTexts, encodeVector } from './embed';
import { fetchUrl, htmlToStructuredText } from './adapters/html';
import { pdfToText } from './adapters/pdf';
import { writeDigest } from './digest';
import { getObject } from './storage';
import { MIN_TEXT_CHARS, sha256 } from './sources';

const MAX_ATTEMPTS = 3;
const EMBED_BATCH = 64;

class Blocked extends Error {}

type Job = NonNullable<Awaited<ReturnType<typeof prisma.ingestJob.findFirst>>>;

export type RunSummary = { claimed: number; done: number; failed: number; deferred: number; notes: string[] };

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
async function stepFetch(job: Job): Promise<{ documentId: string; unchanged: boolean }> {
  const source = await prisma.source.findUniqueOrThrow({ where: { id: job.sourceId } });

  let title = source.title ?? '';
  let text = '';
  let publishedAt: Date | null = null;
  let language: string | null = null;

  if (source.kind === 'pdf' && !source.url) {
    // Uploaded PDF being re-read: the text is already in the document; nothing to fetch.
    const doc = await prisma.sourceDocument.findFirst({ where: { sourceId: source.id }, select: { id: true } });
    if (doc) return { documentId: doc.id, unchanged: false };
    const bytes = source.storagePath ? await getObject(source.storagePath) : null;
    if (!bytes) throw new Error('Uploaded PDF is no longer available; upload it again.');
    const pdf = await pdfToText(bytes, title);
    text = pdf.text;
    title ||= pdf.title;
  } else {
    if (!source.url) throw new Error('Source has no URL to read.');
    const res = await fetchUrl(source.url);
    if (!res.ok) throw res.status === 403 || res.status === 503 || res.status === 429 ? new Blocked(res.error) : new Error(res.error);
    const isPdf = source.kind === 'pdf' || /application\/pdf/i.test(res.contentType) || res.body.subarray(0, 5).toString() === '%PDF-';
    if (isPdf) {
      const pdf = await pdfToText(new Uint8Array(res.body), title);
      text = pdf.text;
      title ||= pdf.title;
    } else {
      const page = htmlToStructuredText(res.body.toString('utf8'));
      text = page.text;
      title ||= page.title;
      publishedAt = page.publishedAt;
      language = page.language;
    }
  }

  text = text.trim();
  if (text.replace(/\f/g, '').length < MIN_TEXT_CHARS) throw new Error(`nothing worth reading came back (${text.length} chars); the page may be rendered by JavaScript or be behind a login`);
  title = (title || source.url || 'Untitled').slice(0, 400);
  const hash = sha256(text);

  const existing = await prisma.sourceDocument.findFirst({ where: { sourceId: source.id, url: source.url }, select: { id: true, contentHash: true } });
  if (existing && existing.contentHash === hash) {
    await prisma.source.update({ where: { id: source.id }, data: { title: source.title ?? title, lastCheckedAt: new Date() } });
    return { documentId: existing.id, unchanged: true };
  }
  const data = { title, text, charCount: text.length, contentHash: hash, publishedAt, language: language ?? (/[؀-ۿ]/.test(text.slice(0, 2000)) ? 'fa' : 'en'), fetchedAt: new Date(), status: 'new', digest: null };
  const doc = existing
    ? await prisma.sourceDocument.update({ where: { id: existing.id }, data })
    : await prisma.sourceDocument.create({ data: { ...data, sourceId: source.id, url: source.url } });
  await prisma.source.update({ where: { id: source.id }, data: { title: source.title ?? title, lastCheckedAt: new Date() } });
  return { documentId: doc.id, unchanged: false };
}

async function stepChunk(documentId: string) {
  const doc = await prisma.sourceDocument.findUniqueOrThrow({ where: { id: documentId }, select: { text: true } });
  const chunks = chunkText(doc.text);
  await prisma.$transaction([
    prisma.sourceChunk.deleteMany({ where: { documentId } }),
    prisma.sourceChunk.createMany({ data: chunks.map((c) => ({ documentId, ord: c.ord, text: c.text, locator: c.locator, tokenCount: c.tokenCount })) }),
  ]);
  return chunks.length;
}

async function stepEmbed(documentId: string, deadline: number) {
  for (;;) {
    const batch = await prisma.sourceChunk.findMany({ where: { documentId, embedding: null }, orderBy: { ord: 'asc' }, take: EMBED_BATCH, select: { id: true, text: true } });
    if (!batch.length) return true;
    const vectors = await embedTexts(batch.map((c) => c.text));
    await prisma.$transaction(batch.map((c, i) => prisma.sourceChunk.update({ where: { id: c.id }, data: { embedding: encodeVector(vectors[i]) } })));
    if (Date.now() > deadline) return false; // resume next tick
  }
}

async function stepDigest(documentId: string) {
  const doc = await prisma.sourceDocument.findUniqueOrThrow({ where: { id: documentId }, include: { source: { select: { url: true, trust: true } } } });
  const digest = await writeDigest({ title: doc.title, text: doc.text, url: doc.url ?? doc.source.url, trust: doc.source.trust });
  await prisma.sourceDocument.update({ where: { id: documentId }, data: { digest, status: 'ready' } });
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------
async function runJob(job: Job, deadline: number, notes: string[]): Promise<'done' | 'failed' | 'deferred'> {
  let step = job.step;
  let documentId = job.documentId;
  const save = (data: Record<string, unknown>) => prisma.ingestJob.update({ where: { id: job.id }, data });

  try {
    while (step !== 'done') {
      if (Date.now() > deadline) {
        await save({ status: 'pending', step, documentId });
        return 'deferred';
      }
      if (step === 'fetch') {
        const r = await stepFetch(job);
        documentId = r.documentId;
        step = r.unchanged ? 'done' : 'chunk';
        if (r.unchanged) notes.push(`${job.sourceId}: unchanged`);
      } else if (step === 'chunk') {
        if (!documentId) throw new Error('no document to chunk');
        const n = await stepChunk(documentId);
        notes.push(`${job.sourceId}: ${n} chunks`);
        step = 'embed';
      } else if (step === 'embed') {
        if (!documentId) throw new Error('no document to embed');
        const complete = await stepEmbed(documentId, deadline);
        if (!complete) {
          await save({ status: 'pending', step, documentId });
          return 'deferred';
        }
        step = 'digest';
      } else if (step === 'digest') {
        if (!documentId) throw new Error('no document to digest');
        await stepDigest(documentId);
        step = 'done';
      } else {
        throw new Error(`unknown step ${step}`);
      }
      await save({ step, documentId });
    }
    await save({ status: 'done', step: 'done', documentId, error: null });
    await prisma.source.update({ where: { id: job.sourceId }, data: { status: 'ready', lastError: null, lastCheckedAt: new Date() } });
    return 'done';
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).slice(0, 500);
    const blocked = e instanceof Blocked;
    const final = blocked || job.attempts + 1 >= MAX_ATTEMPTS;
    console.error('knowledge/ingest: job failed', job.id, step, msg);
    await save({ status: final ? 'failed' : 'pending', step, documentId, error: msg, runAfter: new Date(Date.now() + 10 * 60_000) });
    await prisma.source.update({ where: { id: job.sourceId }, data: { status: final ? (blocked ? 'blocked' : 'error') : 'ingesting', lastError: msg } });
    if (final && documentId) await prisma.sourceDocument.update({ where: { id: documentId }, data: { status: 'failed', reason: msg } }).catch(() => {});
    notes.push(`${job.sourceId}: ${msg}`);
    return final ? 'failed' : 'deferred';
  }
}

/**
 * Process pending jobs until `limit` are handled or `budgetMs` is spent.
 * Jobs are claimed one at a time by flipping pending → running, so two
 * overlapping cron ticks do not read the same page twice.
 */
export async function runPendingJobs(opts: { limit?: number; budgetMs?: number; sourceId?: string } = {}): Promise<RunSummary> {
  const limit = opts.limit ?? 5;
  const deadline = Date.now() + (opts.budgetMs ?? 240_000);
  const out: RunSummary = { claimed: 0, done: 0, failed: 0, deferred: 0, notes: [] };

  // Anything left "running" for more than 15 minutes was cut off; hand it back.
  await prisma.ingestJob.updateMany({ where: { status: 'running', updatedAt: { lt: new Date(Date.now() - 15 * 60_000) } }, data: { status: 'pending' } });

  while (out.claimed < limit && Date.now() < deadline) {
    const next = await prisma.ingestJob.findFirst({
      where: { status: 'pending', runAfter: { lte: new Date() }, ...(opts.sourceId ? { sourceId: opts.sourceId } : {}) },
      orderBy: { createdAt: 'asc' },
    });
    if (!next) break;
    const claimed = await prisma.ingestJob.updateMany({ where: { id: next.id, status: 'pending' }, data: { status: 'running', attempts: { increment: 1 } } });
    if (!claimed.count) continue;
    await prisma.source.update({ where: { id: next.sourceId }, data: { status: 'ingesting' } });
    out.claimed++;
    const r = await runJob({ ...next, status: 'running', attempts: next.attempts + 1 }, deadline, out.notes);
    out[r]++;
  }
  return out;
}
