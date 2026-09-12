// ============================================================================
// lib/knowledge/embed.ts
// Embeddings and the arithmetic on them. Vectors are stored as Float32 bytes
// in the SourceChunk row; similarity is computed here in Node. At our scale
// (tens of thousands of chunks at most) that is milliseconds, and it keeps
// the SQLite dev schema identical to production. pgvector is the upgrade
// path when the chunk count justifies it (docs/knowledge-sources-architecture.md).
// ============================================================================
import OpenAI from 'openai';

export const EMBED_MODEL = process.env.KNOWLEDGE_EMBED_MODEL ?? 'text-embedding-3-small';
export const EMBED_DIMS = 1536;
const BATCH = 64;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build' });

export function encodeVector(v: number[] | Float32Array): Buffer {
  const f = v instanceof Float32Array ? v : Float32Array.from(v);
  return Buffer.from(f.buffer, f.byteOffset, f.byteLength);
}

export function decodeVector(b: Uint8Array): Float32Array {
  // Copy so alignment never matters where the Buffer came from a pool.
  const copy = new Uint8Array(b.byteLength);
  copy.set(b);
  return new Float32Array(copy.buffer);
}

export function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export async function embedTexts(texts: string[]): Promise<Float32Array[]> {
  const out: Float32Array[] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const slice = texts.slice(i, i + BATCH).map((t) => t.slice(0, 8000));
    const res = await openai.embeddings.create({ model: EMBED_MODEL, input: slice });
    for (const d of res.data) out.push(Float32Array.from(d.embedding));
  }
  return out;
}

export async function embedQuery(text: string): Promise<Float32Array> {
  return (await embedTexts([text]))[0];
}
