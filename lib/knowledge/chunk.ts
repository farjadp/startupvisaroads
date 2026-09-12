// ============================================================================
// lib/knowledge/chunk.ts
// Split a document's plain text into citable passages.
//
// The writer is handed passages, not documents, so a passage has to stand on
// its own: it carries where it came from (page, heading path) and it breaks
// on paragraph boundaries, never mid-sentence when that can be helped. Sizes
// are in characters because tokens differ between English and Persian and a
// character budget is honest for both; ~2,000 chars is 400–600 tokens.
//
// Adapters produce text with two kinds of marker this splitter understands:
//   \f            page break (PDF) — locator becomes "p.N"
//   lines starting with "# " / "## " / "### "   headings — locator becomes
//                 the heading path, e.g. "Eligibility > Funding"
// Anything else is paragraphs separated by blank lines.
// ============================================================================

export type Chunk = { ord: number; text: string; locator: string | null; tokenCount: number };

export const CHUNK_TARGET = 2000;
export const CHUNK_MAX = 2600;
export const CHUNK_OVERLAP = 300;

/** Rough token estimate: 4 chars/token English, ~3 for Persian script. */
export function estimateTokens(text: string): number {
  const persian = (text.match(/[؀-ۿ]/g) ?? []).length;
  const ratio = persian > text.length / 3 ? 3 : 4;
  return Math.ceil(text.length / ratio);
}

type Para = { text: string; page: number | null; heads: string[] };

function paragraphs(raw: string): Para[] {
  const out: Para[] = [];
  const hasPages = raw.includes('\f');
  const heads: string[] = [];
  let page = 1;
  for (const pageText of raw.split('\f')) {
    for (const block of pageText.split(/\n{2,}/)) {
      const t = block.replace(/[ \t]+/g, ' ').trim();
      if (!t) continue;
      const h = /^(#{1,3})\s+(.+)$/.exec(t);
      if (h) {
        const level = h[1].length;
        heads.splice(level - 1);
        heads[level - 1] = h[2].trim();
        continue;
      }
      out.push({ text: t, page: hasPages ? page : null, heads: [...heads] });
    }
    page++;
  }
  return out;
}

function locatorOf(p: Para): string | null {
  const parts: string[] = [];
  if (p.page) parts.push(`p.${p.page}`);
  if (p.heads.length) parts.push(p.heads.filter(Boolean).join(' > '));
  return parts.length ? parts.join(' · ') : null;
}

/** Split an oversized paragraph on sentence ends, then hard-wrap as a last resort. */
function splitLong(text: string, max: number): string[] {
  const out: string[] = [];
  let buf = '';
  for (const s of text.split(/(?<=[.!?؟。])\s+/)) {
    if ((buf + ' ' + s).trim().length > max && buf) {
      out.push(buf.trim());
      buf = s;
    } else buf = (buf + ' ' + s).trim();
  }
  if (buf) out.push(buf.trim());
  return out.flatMap((piece) => {
    if (piece.length <= max) return [piece];
    const hard: string[] = [];
    for (let i = 0; i < piece.length; i += max) hard.push(piece.slice(i, i + max));
    return hard;
  });
}

export function chunkText(raw: string, opts: { target?: number; max?: number; overlap?: number } = {}): Chunk[] {
  const target = opts.target ?? CHUNK_TARGET;
  const max = opts.max ?? CHUNK_MAX;
  const overlap = opts.overlap ?? CHUNK_OVERLAP;

  const paras = paragraphs(raw).flatMap((p) => splitLong(p.text, max).map((text) => ({ ...p, text })));
  const chunks: Chunk[] = [];
  let buf: Para[] = [];
  let len = 0;

  const flush = () => {
    if (!buf.length) return;
    const text = buf.map((p) => p.text).join('\n\n');
    chunks.push({ ord: chunks.length, text, locator: locatorOf(buf[0]), tokenCount: estimateTokens(text) });
    // Carry the tail forward so a fact split across the boundary survives in one of the two.
    const keep: Para[] = [];
    let kept = 0;
    for (let i = buf.length - 1; i >= 0 && kept < overlap; i--) {
      keep.unshift(buf[i]);
      kept += buf[i].text.length;
    }
    buf = keep.length < buf.length ? keep : [];
    len = buf.reduce((n, p) => n + p.text.length, 0);
  };

  for (const p of paras) {
    const sameSection = !buf.length || locatorOf(p) === locatorOf(buf[buf.length - 1]) || locatorOf(buf[0]) === null;
    if (buf.length && (len + p.text.length > target || (!sameSection && len > target / 2))) flush();
    buf.push(p);
    len += p.text.length;
  }
  if (buf.length && (chunks.length === 0 || buf.some((p) => !chunks[chunks.length - 1].text.includes(p.text)))) {
    const text = buf.map((p) => p.text).join('\n\n');
    chunks.push({ ord: chunks.length, text, locator: locatorOf(buf[0]), tokenCount: estimateTokens(text) });
  }
  return chunks;
}
