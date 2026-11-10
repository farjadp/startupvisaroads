// Stage 0 / stage 5 (spec §6): deterministic personal-data detection and
// redaction for en and fa text. No model involved; the Haiku pass in the
// pipeline is an extra net on top of this, never a replacement.
//
// Inputs:
// - names: Farjad's list for type B, and the parser's party names for type A
//   (split into tokens, so "MOHAMMAD REZA X" catches "Mr. X" and "Reza");
// - terms: case-specific identifiers (employer, incubator, school, company,
//   city, niche profession), from the case folder, never from the repo;
// - allow: strings that must not be flagged (judge's surname as author, etc.).
//
// Court files of other cases (IMM-…) and neutral citations are not personal
// data and are never flagged.

import { normaliseFaForMatching } from './persian-lint';

export type PiiKind =
  | 'name' | 'initials' | 'uci' | 'application_number' | 'passport' | 'receipt'
  | 'email' | 'phone' | 'handle' | 'social_url' | 'exact_date' | 'age' | 'term' | 'place';

export type PiiFinding = { kind: PiiKind; match: string; index: number; severity: 'block' | 'review' };

export type AnonymiseOptions = {
  /** 'A' court decision page, 'B' own client case (stricter: dates, ages, places block). */
  mode: 'A' | 'B';
  names?: readonly string[];
  terms?: readonly string[];
  allow?: readonly string[];
};

// Tokens in a style of cause that are not a person's name.
const NAME_STOPWORDS = new Set([
  'the', 'minister', 'of', 'citizenship', 'and', 'immigration', 'public', 'safety', 'emergency', 'preparedness',
  'canada', 'attorney', 'general', 'applicant', 'applicants', 'respondent', 'respondents', 'mr', 'mrs', 'ms', 'dr',
  'refugees', 'employment', 'social', 'development', 'v', 'vs', 'et', 'al', 'by', 'litigation', 'guardian', 'his', 'her',
]);

/** Name tokens of at least 3 characters, stopwords removed, de-duplicated. */
export function nameTokens(names: readonly string[]): string[] {
  const out = new Set<string>();
  for (const n of names) {
    for (const t of n.split(/[\s,.;:()'"«»\-]+/)) {
      const tok = t.trim();
      if (tok.length < 3) continue;
      if (NAME_STOPWORDS.has(tok.toLowerCase())) continue;
      out.add(tok);
    }
  }
  return [...out].sort((a, b) => b.length - a.length);
}

const ESC = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FA_LETTER = '\\u0600-\\u06FF';
const isPersian = (s: string) => /[؀-ۿ]/.test(s);

function termRegex(term: string): RegExp {
  const folded = normaliseFaForMatching(term.trim());
  const body = folded.split(/\s+/).map(ESC).join('\\s+');
  // Persian: prefix boundary only (suffixes attach: «علیرضا» + «ی»). Latin: both.
  return isPersian(folded)
    ? new RegExp(`(?<![${FA_LETTER}])${body}`, 'g')
    : new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, 'giu');
}

const MONTHS_EN = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const MONTHS_FA = 'فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند|ژانویه|فوریه|مارس|آوریل|مه|ژوئن|ژوئیه|اوت|سپتامبر|اکتبر|نوامبر|دسامبر';

// Initials that are not a person: U.S., U.K., B.C., P.E.I., N.B., N.S., e.g.
const INITIALS_ALLOW = new Set(['U.S.', 'U.K.', 'E.U.', 'B.C.', 'P.E.I.', 'N.B.', 'N.S.', 'N.L.', 'S.C.', 'F.C.', 'U.A.E.', 'U.N.', 'D.C.', 'A.M.', 'P.M.']);

type Detector = { kind: PiiKind; re: RegExp; group?: number; skip?: (m: string) => boolean; modes?: ('A' | 'B')[] };

const isYearRange = (m: string) => /^(?:19|20)\d{2}-(?:19|20)\d{2}$/.test(m);
const isCourtFile = (m: string) => /^(?:IMM|T|A)-\d+-\d+$/i.test(m);

const DETECTORS: Detector[] = [
  { kind: 'email', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { kind: 'social_url', re: /\b(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|linkedin\.com\/in|t\.me|telegram\.me|facebook\.com|x\.com|twitter\.com|tiktok\.com)\/[A-Za-z0-9_.\-/]+/gi },
  { kind: 'handle', re: /(?<![\w.@])@[A-Za-z0-9_]{3,}/g },
  { kind: 'uci', re: /\b(?:UCI|client\s+ID|unique\s+client\s+identifier)\s*(?:no\.?|number|#)?\s*[:#]?\s*(\d[\d -]{6,12}\d)/gi, group: 1 },
  { kind: 'uci', re: /\b\d{2}-\d{4}-\d{4}\b|\b\d{4}-\d{4}\b/g, skip: isYearRange },
  { kind: 'uci', re: /(?<![\d.,])\d{8}(?:\d{2})?(?![\d.,])/g },
  { kind: 'passport', re: /\bpassport\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9]{6,9})\b/gi, group: 1 },
  { kind: 'passport', re: /\b[A-Z]{2}\d{6,7}\b/g },
  { kind: 'application_number', re: /\b[A-Z]\d{8,9}\b/g },
  { kind: 'receipt', re: /\breceipt\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9-]{6,})/gi, group: 1 },
  { kind: 'application_number', re: /\b(?:file|application)\s*(?:no\.?|number|#)\s*[:#]?\s*([A-Z0-9-]{5,})/gi, group: 1, skip: isCourtFile },
  { kind: 'phone', re: /(?<![\w.,])\+?\(?\d{1,4}\)?[\s.-]?\d{2,4}[\s.-]\d{3,4}(?:[\s.-]?\d{1,4})?(?!\w|[.,]\d)/g, skip: (m) => m.replace(/\D/g, '').length < 9 || isYearRange(m) },
  { kind: 'initials', re: /(?<![\p{L}.])(?:\p{Lu}\.\s?){2,3}(?![\p{Ll}])/gu, skip: (m) => INITIALS_ALLOW.has(m.replace(/\s/g, '')) },
  { kind: 'initials', re: /\b(?:Mr|Ms|Mrs|Miss|Dr|Mx)\.?\s+\p{Lu}\.?(?=[\s,.;:)]|$)/gu },
  { kind: 'initials', re: new RegExp(`(?<![${FA_LETTER}])[\\u0621-\\u06CC]\\.\\s?[\\u0621-\\u06CC]\\.(?![${FA_LETTER}])`, 'g') },
  { kind: 'initials', re: /(?:آقای|خانم)\s+[ء-ی]\.(?![؀-ۿ])/g },
  { kind: 'exact_date', re: new RegExp(`\\b(?:${MONTHS_EN})\\.?\\s+\\d{1,2},?\\s+\\d{4}\\b|\\b\\d{1,2}\\s+(?:${MONTHS_EN})\\.?,?\\s+\\d{4}\\b`, 'gi') },
  { kind: 'exact_date', re: /\b(?:19|20|13|14)\d{2}[/-](?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])\b/g },
  { kind: 'exact_date', re: new RegExp(`\\d{1,2}\\s+(?:${MONTHS_FA})\\s+\\d{4}`, 'g') },
  { kind: 'age', re: /\b\d{1,2}[- ]years?[- ]old\b|\baged?\s+\d{1,2}\b|\b\d{1,2}\s+years\s+of\s+age\b/gi },
  { kind: 'age', re: /\d{1,2}\s*ساله|سن\s+\d{1,2}/g },
];

// Built-in gazetteer: places a type B story would identify someone by. Not
// exhaustive; the case's own terms list is the main defence.
const PLACES = [
  'Tehran', 'Isfahan', 'Esfahan', 'Shiraz', 'Mashhad', 'Tabriz', 'Karaj', 'Qom', 'Ahvaz', 'Kermanshah', 'Rasht', 'Kish', 'Yazd', 'Kerman', 'Hamedan', 'Urmia', 'Sari',
  'Toronto', 'Mississauga', 'Brampton', 'Markham', 'Richmond Hill', 'Newmarket', 'Vaughan', 'Oakville', 'Ottawa', 'Montreal', 'Vancouver', 'Burnaby', 'North Vancouver', 'Calgary', 'Edmonton', 'Winnipeg', 'Halifax', 'Victoria', 'Waterloo', 'Kitchener', 'London, Ontario',
  'Dubai', 'Istanbul', 'Yerevan',
  'تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'قم', 'اهواز', 'کرمانشاه', 'رشت', 'کیش', 'یزد', 'کرمان', 'همدان', 'ارومیه', 'ساری',
  'تورنتو', 'میسیساگا', 'ونکوور', 'مونترال', 'اتاوا', 'کلگری', 'ادمونتون', 'وینیپگ', 'هلیفکس', 'دبی', 'استانبول', 'ایروان',
];

const BLOCK_IN_A: ReadonlySet<PiiKind> = new Set(['name', 'initials', 'uci', 'application_number', 'passport', 'receipt', 'email', 'phone', 'handle', 'social_url', 'term']);

function severityFor(kind: PiiKind, mode: 'A' | 'B'): 'block' | 'review' {
  if (mode === 'B') return 'block';
  return BLOCK_IN_A.has(kind) ? 'block' : 'review';
}

export function findPii(text: string, opts: AnonymiseOptions): PiiFinding[] {
  const folded = normaliseFaForMatching(text);
  const allow = (opts.allow ?? []).map((a) => normaliseFaForMatching(a).toLowerCase()).filter(Boolean);
  // Spans of the folded text covered by an allow-listed string (e.g. "Justice X"
  // as author). A finding inside such a span is not personal data.
  const lowerFolded = folded.toLowerCase();
  const allowSpans: Array<[number, number]> = [];
  for (const a of allow) {
    for (let i = lowerFolded.indexOf(a); i !== -1; i = lowerFolded.indexOf(a, i + 1)) allowSpans.push([i, i + a.length]);
  }
  const raw: PiiFinding[] = [];
  const push = (kind: PiiKind, index: number, length: number) => {
    const match = text.slice(index, index + length);
    if (allow.some((a) => match.toLowerCase().includes(a))) return;
    if (allowSpans.some(([s, e]) => index >= s && index + length <= e)) return;
    raw.push({ kind, match, index, severity: severityFor(kind, opts.mode) });
  };

  for (const tok of nameTokens(opts.names ?? [])) {
    const re = termRegex(tok);
    let m: RegExpExecArray | null;
    while ((m = re.exec(folded))) push('name', m.index, m[0].length);
  }
  for (const term of opts.terms ?? []) {
    if (!term.trim()) continue;
    const re = termRegex(term);
    let m: RegExpExecArray | null;
    while ((m = re.exec(folded))) push('term', m.index, m[0].length);
  }
  for (const place of PLACES) {
    const re = termRegex(place);
    let m: RegExpExecArray | null;
    while ((m = re.exec(folded))) push('place', m.index, m[0].length);
  }
  for (const d of DETECTORS) {
    if (d.modes && !d.modes.includes(opts.mode)) continue;
    d.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = d.re.exec(folded))) {
      if (m[0].length === 0) { d.re.lastIndex += 1; continue; }
      const value = d.group ? m[d.group] : m[0];
      if (!value) continue;
      if (d.skip?.(value)) continue;
      const start = d.group ? m.index + m[0].lastIndexOf(value) : m.index;
      push(d.kind, start, value.length);
    }
  }

  // Keep the longest finding where two overlap.
  raw.sort((a, b) => a.index - b.index || b.match.length - a.match.length);
  const out: PiiFinding[] = [];
  for (const f of raw) {
    const last = out[out.length - 1];
    if (last && f.index < last.index + last.match.length) {
      if (f.index + f.match.length > last.index + last.match.length && f.match.length > last.match.length) out[out.length - 1] = f;
      continue;
    }
    out.push(f);
  }
  return out;
}

const PLACEHOLDER: Record<PiiKind, string> = {
  name: '[name]', initials: '[name]', uci: '[id]', application_number: '[id]', passport: '[id]', receipt: '[id]',
  email: '[contact]', phone: '[contact]', handle: '[contact]', social_url: '[contact]',
  exact_date: '[date]', age: '[age]', term: '[redacted]', place: '[place]',
};

/**
 * Replace every finding with a placeholder. Used for stage 0 (type B raw
 * notes): the model only ever sees the redacted text. Returns the findings so
 * the caller can log counts (never the matched values).
 */
export function redact(text: string, opts: AnonymiseOptions): { text: string; findings: PiiFinding[] } {
  const findings = findPii(text, opts);
  let out = '';
  let pos = 0;
  for (const f of findings) {
    out += text.slice(pos, f.index) + PLACEHOLDER[f.kind];
    pos = f.index + f.match.length;
  }
  out += text.slice(pos);
  return { text: out, findings };
}

/** Counts by kind, safe to log (no matched values). */
export function summariseFindings(findings: readonly PiiFinding[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const f of findings) out[f.kind] = (out[f.kind] ?? 0) + 1;
  return out;
}
