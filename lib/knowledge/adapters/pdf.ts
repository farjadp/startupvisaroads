// ============================================================================
// lib/knowledge/adapters/pdf.ts
// A PDF → plain text with form-feed page breaks, so every chunk can say
// "p.12". unpdf wraps pdf.js for serverless runtimes; no native deps.
// ============================================================================
import { extractText, getDocumentProxy, getMeta } from 'unpdf';

export type PdfExtracted = { title: string; text: string; pages: number };

export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export async function pdfToText(bytes: Uint8Array, fallbackTitle = ''): Promise<PdfExtracted> {
  const pdf = await getDocumentProxy(bytes);
  const [{ text, totalPages }, meta] = await Promise.all([extractText(pdf, { mergePages: false }), getMeta(pdf).catch(() => null)]);
  const pages = (Array.isArray(text) ? text : [String(text)]).map((p) =>
    p
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/(\S)\n(?=[a-z؀-ۿ])/g, '$1 ') // unwrap hard line breaks inside sentences
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
  const info = (meta?.info ?? {}) as Record<string, unknown>;
  const title = (typeof info.Title === 'string' && info.Title.trim()) || fallbackTitle;
  return { title, text: pages.join('\f'), pages: totalPages };
}
