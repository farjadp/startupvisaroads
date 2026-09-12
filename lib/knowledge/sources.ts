// ============================================================================
// lib/knowledge/sources.ts
// Registering a source: validation, the row, the first document when the
// admin supplied the text themselves (pasted text, uploaded PDF), and the
// ingest job that does the rest. See docs/knowledge-sources-architecture.md.
// ============================================================================
import { createHash } from 'node:crypto';
import prisma from '@/lib/prisma';
import { officialCitationUrl } from '@/lib/autopilot/official-sources';
import { pdfToText, MAX_PDF_BYTES } from './adapters/pdf';
import { putObject } from './storage';

export const KINDS = ['html', 'pdf', 'youtube', 'text'] as const;
export const CADENCES = ['once', 'watch'] as const;
export const TRUSTS = ['official', 'press', 'commentary'] as const;
export type Kind = (typeof KINDS)[number];
export type Cadence = (typeof CADENCES)[number];
export type Trust = (typeof TRUSTS)[number];

export const MIN_TEXT_CHARS = 200;

export type NewSource = {
  kind: Kind;
  cadence?: Cadence;
  url?: string | null;
  title?: string | null;
  trust?: Trust | null;
  locale?: 'en' | 'fa' | null;
  pinned?: boolean;
  topics?: string[];
  watchEvery?: number | null;
  notes?: string | null;
  /** Pasted text (kind = text). */
  text?: string | null;
  /** Uploaded PDF (kind = pdf, no url). */
  file?: { name: string; bytes: Uint8Array; contentType: string } | null;
};

export class SourceError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

export function normaliseUrl(raw: string): string {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new SourceError('That is not a valid URL.');
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new SourceError('Only http(s) URLs can be read.');
  u.hash = '';
  for (const k of [...u.searchParams.keys()]) if (/^(utm_|fbclid|gclid|mc_)/i.test(k)) u.searchParams.delete(k);
  return u.toString();
}

export function defaultTrust(url: string | null | undefined): Trust {
  return url && officialCitationUrl(url) ? 'official' : 'press';
}

export function cleanTopics(topics: unknown): string[] {
  if (!Array.isArray(topics)) return [];
  return [...new Set(topics.map((t) => String(t).trim().toLowerCase()).filter((t) => t && t.length <= 80))].slice(0, 40);
}

/**
 * Create the source and queue its ingestion. Returns the row and the job.
 * Text and uploaded PDFs are extracted here, synchronously, so the document
 * exists before the response and the job can start at `chunk`; URLs are
 * fetched by the job.
 */
export async function createSource(input: NewSource) {
  if (!KINDS.includes(input.kind)) throw new SourceError('Unknown source kind.');
  if (input.kind === 'youtube') throw new SourceError('YouTube sources arrive in a later phase. Paste the transcript as text for now.');
  const cadence: Cadence = input.cadence === 'watch' ? 'watch' : 'once';
  if (cadence === 'watch' && input.kind !== 'html') throw new SourceError('Only a web page can be watched.');

  let url: string | null = null;
  let text: string | null = null;
  let docTitle = (input.title ?? '').trim();
  let storagePath: string | null = null;
  let firstStep: 'fetch' | 'chunk' = 'fetch';

  if (input.kind === 'text') {
    text = (input.text ?? '').replace(/\r\n/g, '\n').trim();
    if (text.length < MIN_TEXT_CHARS) throw new SourceError(`Pasted text is too short to carry facts (${text.length} chars, minimum ${MIN_TEXT_CHARS}).`);
    if (!docTitle) throw new SourceError('Give pasted text a title so it can be cited.');
    if (input.url) url = normaliseUrl(input.url); // where the text came from, for the citation only
    firstStep = 'chunk';
  } else if (input.kind === 'pdf' && input.file) {
    if (input.file.bytes.byteLength > MAX_PDF_BYTES) throw new SourceError('PDF is larger than 25 MB.');
    let extracted;
    try {
      extracted = await pdfToText(input.file.bytes, docTitle || input.file.name.replace(/\.pdf$/i, ''));
    } catch (e) {
      throw new SourceError(`Could not read that PDF: ${e instanceof Error ? e.message : String(e)}`);
    }
    text = extracted.text.trim();
    if (text.replace(/\f/g, '').length < MIN_TEXT_CHARS) throw new SourceError('That PDF has no extractable text (a scan?). Paste the text instead.');
    docTitle = docTitle || extracted.title;
    const safe = input.file.name.replace(/[^\w.-]+/g, '_').slice(0, 120);
    storagePath = await putObject(`sources/${Date.now()}-${safe}`, input.file.bytes, 'application/pdf');
    firstStep = 'chunk';
  } else {
    if (!input.url) throw new SourceError('A URL is required.');
    url = normaliseUrl(input.url);
  }

  if (url) {
    const clash = await prisma.source.findUnique({ where: { url }, select: { id: true } });
    if (clash && input.kind !== 'text') throw new SourceError('That URL is already registered.', 409);
    if (clash) url = null; // pasted text citing a URL we also crawl: keep the text, drop the unique claim
  }

  const source = await prisma.source.create({
    data: {
      kind: input.kind,
      cadence,
      url,
      storagePath,
      title: docTitle || null,
      trust: input.trust && TRUSTS.includes(input.trust) ? input.trust : defaultTrust(url),
      locale: input.locale === 'fa' || input.locale === 'en' ? input.locale : null,
      pinned: !!input.pinned,
      topics: JSON.stringify(cleanTopics(input.topics)),
      watchEvery: cadence === 'watch' ? Math.max(1, Math.min(168, input.watchEvery ?? 24)) : null,
      notes: input.notes?.trim() || null,
      status: 'pending',
    },
  });

  let documentId: string | null = null;
  if (text) {
    const doc = await prisma.sourceDocument.create({
      data: {
        sourceId: source.id,
        url: null,
        title: docTitle,
        contentHash: sha256(text),
        text,
        charCount: text.length,
        language: /[؀-ۿ]/.test(text.slice(0, 2000)) ? 'fa' : 'en',
        status: 'new',
      },
    });
    documentId = doc.id;
  }

  const job = await prisma.ingestJob.create({ data: { sourceId: source.id, documentId, step: firstStep } });
  return { source, job };
}

/** Queue a fresh read of a source (admin "Re-fetch"). One pending job per source at a time. */
export async function enqueueRefetch(sourceId: string) {
  const open = await prisma.ingestJob.findFirst({ where: { sourceId, status: { in: ['pending', 'running'] } } });
  if (open) return open;
  const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId }, select: { kind: true, url: true } });
  const step = source.kind === 'text' || (source.kind === 'pdf' && !source.url) ? 'chunk' : 'fetch';
  const doc = step === 'chunk' ? await prisma.sourceDocument.findFirst({ where: { sourceId }, select: { id: true } }) : null;
  await prisma.source.update({ where: { id: sourceId }, data: { status: 'pending', lastError: null } });
  return prisma.ingestJob.create({ data: { sourceId, documentId: doc?.id ?? null, step } });
}
