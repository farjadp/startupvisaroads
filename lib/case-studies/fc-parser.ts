// Stage 2 (spec §6): parse a Federal Court decision into numbered paragraphs,
// the JUDGMENT block, header facts and the certified question.
//
// Input is the official copy from decisions.fct-cf.gc.ca: the document.do
// endpoint serves a PDF (observed 9 Nov 2026), and a page saved by hand may be
// HTML. Both are reduced to plain text lines and parsed by the same code.
//
// The style of cause and the party names are kept for the anonymiser only.
// They live on a non-enumerable `private` property, so JSON.stringify of a
// parse result (payloads, caches, logs) can never carry them.

export type Disposition = 'allowed' | 'dismissed' | 'allowed_in_part' | 'consent' | 'unknown';

export type PrivateParties = {
  /** e.g. "NAME v THE MINISTER OF CITIZENSHIP AND IMMIGRATION". Never output. */
  styleOfCause: string | null;
  /** Applicant-side names from the BETWEEN block and the style of cause. Never output. */
  partyNames: string[];
};

export type ParsedDecision = {
  citation: string | null;
  courtFile: string | null;
  /** ISO yyyy-mm-dd */
  decisionDate: string | null;
  judge: string | null;
  paragraphs: Record<number, string>;
  /** Headings that precede a paragraph, e.g. { beforePara: 20, text: 'VII. Analysis' }. */
  headings: { beforePara: number; text: string }[];
  /** First paragraph after a heading named Analysis / Discussion, if any. */
  analysisStartPara: number | null;
  judgmentText: string | null;
  certifiedQuestion: string | null;
  certifiedQuestionStatus: 'none' | 'certified' | 'unknown';
  warnings: string[];
  readonly private: PrivateParties;
};

const RIGHT_SINGLE = /[‘’‚‛]/g;
const RIGHT_DOUBLE = /[“”„‟]/g;

function ascii(s: string): string {
  return s.replace(RIGHT_SINGLE, "'").replace(RIGHT_DOUBLE, '"').replace(/ /g, ' ');
}

const PAGE_HEADER = /^\s*(Page|Page\s*:)\s*:?\s*\d+\s*$/i;
const HEADING = /^(?:[IVXLC]{1,6}|[A-H])\.\s+[A-Z(].{0,140}$/;
const JUDGMENT_START = /^(?:JUDGMENT|ORDER|JUDGMENT AND ORDER)\s+in\s+(?:IMM|T|A)-\d+-\d+|^THIS COURT'?S\s+(?:JUDGMENT|ORDER)\b|^THIS COURT\s+(?:ORDERS|ADJUDGES)\b|^(?:JUDGMENT|ORDER)\s*$/i;
const REASONS_END = /^(?:FEDERAL COURT\s*$|SOLICITORS OF RECORD|ANNEX\b|APPENDIX\b|SCHEDULE\b)/i;
const JUDGMENT_END = /^(?:Judge|Juge)\s*$|^FEDERAL COURT\s*$|^SOLICITORS OF RECORD|^REASONS FOR (?:JUDGMENT|ORDER)\b|^ANNEX\b|^APPENDIX\b/i;

function toLines(text: string): string[] {
  return ascii(text)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter((l) => l.length > 0 && !PAGE_HEADER.test(l));
}

function isoFromCompact(d: string): string | null {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(d);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

function joinLines(lines: string[]): string {
  // Re-join hyphenated line breaks only where a word was split ("investi-\nment").
  return lines.reduce((acc, line) => {
    if (!acc) return line;
    if (/[a-z]-$/.test(acc) && /^[a-z]/.test(line)) return acc.slice(0, -1) + line;
    return `${acc} ${line}`;
  }, '');
}

export function parseDecisionText(rawText: string): ParsedDecision {
  const lines = toLines(rawText);
  const warnings: string[] = [];
  const header = lines.slice(0, 40).join('\n');

  const citation = /Citation\s*:\s*(\d{4}\s+(?:FC|CF)\s+\d+)/i.exec(header)?.[1]?.replace(/\s+/g, ' ')
    ?? /\b(\d{4}\s+FC\s+\d+)\b/.exec(header)?.[1] ?? null;
  const courtFile = /Docket\s*:\s*((?:IMM|T)-\d+-\d+)/i.exec(header)?.[1]
    ?? /DOCKET\s*:\s*((?:IMM|T)-\d+-\d+)/.exec(lines.join('\n'))?.[1] ?? null;
  const dateCompact = /Date\s*:\s*(\d{8})/i.exec(header)?.[1];
  const decisionDate = dateCompact ? isoFromCompact(dateCompact) : null;
  const presentLine = lines.slice(0, 40).find((l) => /^PRESENT\s*:/i.test(l));
  const judge = presentLine
    ? presentLine.replace(/^PRESENT\s*:\s*/i, '').replace(/^The Honourable\s+/i, '').replace(/^(?:Mr\.|Madam|Madame|Mme)\s+/i, '').trim() || null
    : null;
  if (!citation) warnings.push('neutral citation not found in header');
  if (!courtFile) warnings.push('court file (docket) not found');
  if (!decisionDate) warnings.push('decision date not found');

  // Party names: BETWEEN: block up to "Applicant(s)", plus the style of cause.
  const partyNames: string[] = [];
  const betweenIdx = lines.findIndex((l) => /^BETWEEN\s*:?$/i.test(l));
  if (betweenIdx >= 0) {
    for (let i = betweenIdx + 1; i < Math.min(lines.length, betweenIdx + 15); i += 1) {
      if (/^(Applicants?|Demandeurs?|Demanderesses?)$/i.test(lines[i])) break;
      if (/^and$/i.test(lines[i])) continue;
      partyNames.push(lines[i]);
    }
  }
  let styleOfCause: string | null = null;
  const socIdx = lines.findIndex((l) => /^STYLE OF CAUSE\s*:/i.test(l));
  if (socIdx >= 0) {
    const parts = [lines[socIdx].replace(/^STYLE OF CAUSE\s*:\s*/i, '')];
    for (let i = socIdx + 1; i < Math.min(lines.length, socIdx + 4); i += 1) {
      if (/^[A-Z ]+\s*:/.test(lines[i])) break;
      parts.push(lines[i]);
    }
    styleOfCause = parts.join(' ').trim();
    const applicantSide = styleOfCause.split(/\s+v\.?\s+/i)[0];
    for (const n of applicantSide.split(/\s*,\s*|\s+AND\s+/)) if (n.trim()) partyNames.push(n.trim());
  }

  // Paragraphs: a line starting "[n]" where n is the next expected number.
  const paragraphs: Record<number, string> = {};
  const headings: { beforePara: number; text: string }[] = [];
  let judgmentLines: string[] | null = null;
  let current: number | null = null;
  let buf: string[] = [];
  let expected = 1;
  let pendingHeadings: string[] = [];
  let inJudgment = false;
  let judgmentDone = false;

  const flush = () => {
    if (current !== null) paragraphs[current] = joinLines(buf).trim();
    buf = [];
  };

  for (const line of lines) {
    if (inJudgment) {
      if (JUDGMENT_END.test(line) || (/^\[1\]\s/.test(line) && expected === 1)) {
        inJudgment = false;
        judgmentDone = true;
        if (!/^\[1\]\s/.test(line)) continue;
      } else {
        judgmentLines?.push(line);
        continue;
      }
    }
    if (!judgmentDone && JUDGMENT_START.test(line) && !/^JUDGMENT AND REASONS$/i.test(line)) {
      flush();
      current = null;
      inJudgment = true;
      judgmentLines = [line];
      continue;
    }
    if (current !== null && REASONS_END.test(line)) {
      flush();
      current = null;
      continue;
    }
    const m = /^\[(\d{1,3})\]\s*(.*)$/.exec(line);
    if (m && Number(m[1]) === expected) {
      flush();
      current = expected;
      for (const h of pendingHeadings) headings.push({ beforePara: current, text: h });
      pendingHeadings = [];
      buf = m[2] ? [m[2]] : [];
      expected += 1;
      continue;
    }
    if (current === null) continue;
    if (HEADING.test(line) && !/[.;:,]$/.test(line)) {
      pendingHeadings.push(line);
      continue;
    }
    buf.push(line);
  }
  flush();
  if (pendingHeadings.length) warnings.push(`trailing headings after last paragraph: ${pendingHeadings.join(' | ')}`);

  const count = Object.keys(paragraphs).length;
  if (count === 0) warnings.push('no numbered paragraphs found');

  const analysisHeading = headings.find((h) => /\b(Analysis|Discussion|Analyse)\b/i.test(h.text));
  // Drop the quoted signature line ("Name") and filler the PDF carries.
  const judgmentText = judgmentLines
    ? joinLines(judgmentLines.filter((l) => !/^"[^"]{2,80}"$/.test(l) && !/^blank$/i.test(l))).trim()
    : null;
  if (!judgmentText) warnings.push('JUDGMENT block not found');

  const cq = certifiedQuestionFrom(judgmentText ?? '');
  const parsed = {
    citation,
    courtFile,
    decisionDate,
    judge,
    paragraphs,
    headings,
    analysisStartPara: analysisHeading?.beforePara ?? null,
    judgmentText,
    certifiedQuestion: cq.question,
    certifiedQuestionStatus: cq.status,
    warnings,
  } as Omit<ParsedDecision, 'private'>;
  Object.defineProperty(parsed, 'private', {
    value: Object.freeze({ styleOfCause, partyNames: Array.from(new Set(partyNames)) }),
    enumerable: false,
    writable: false,
  });
  return parsed as ParsedDecision;
}

const NO_QUESTION = /\bno\s+(?:serious\s+)?question(?:\s+of\s+general\s+importance)?\s+(?:is|was|will\s+be|shall\s+be|to\s+be|for|of|arises|has\s+been)?\s*(?:certified|certification|proposed)|\bno\s+question\s+(?:is\s+)?certified|\bthere\s+is\s+no\s+question\s+(?:to\s+(?:be\s+)?certify|to\s+certify|for\s+certification)|\bneither\s+party\s+(?:has\s+)?(?:proposed|raised|submitted)\s+a\s+question|\bdoes\s+not\s+raise\s+a\s+(?:serious\s+)?question\s+of\s+general\s+importance|\bno\s+questions?\s+(?:are|were)\s+(?:certified|proposed)/i;
const CERTIFIED = /\b(?:the\s+following\s+(?:serious\s+)?question(?:\s+of\s+general\s+importance)?\s+is\s+(?:hereby\s+)?certified|(?:I|the\s+Court)\s+(?:certif(?:y|ies))\s+the\s+following\s+question)\s*:?\s*([\s\S]+)/i;

export function certifiedQuestionFrom(judgment: string): { status: 'none' | 'certified' | 'unknown'; question: string | null } {
  const text = ascii(judgment);
  const cert = CERTIFIED.exec(text);
  if (cert) {
    // The question runs to the next numbered order item ("4. ...") or the end.
    const q = cert[1].split(/\s+\d{1,2}\.\s+(?=[A-Z])/)[0].trim().replace(/^["']|["']$/g, '');
    return { status: 'certified', question: q || null };
  }
  if (NO_QUESTION.test(text)) return { status: 'none', question: null };
  return { status: 'unknown', question: null };
}

const APP = String.raw`(?:the\s+|this\s+|his\s+|her\s+|their\s+)?(?:judicial\s+review\s+)?(?:application|applications|motion)(?:\s+for\s+(?:leave\s+and\s+(?:for\s+)?)?judicial\s+review)?(?:\s+in\s+(?:IMM|T)-\d+-\d+)?(?:\s+and\s+the\s+(?:request|application)\s+for\s+(?:an\s+order\s+of\s+|a\s+writ\s+of\s+)?mandamus)?`;
const RX = {
  consent: /\bon\s+consent\b|\bconsent\s+(?:judgment|order)\b|\bwith\s+the\s+consent\s+of\s+the\s+parties\b|\bparties\s+(?:have\s+)?(?:consented|agree[ds]?)\b|\bon\s+the\s+consent\b|\b(?:parties|respondent|applicants?)\s+having\s+consented\b/i,
  inPart: /\b(?:allowed|granted)\s+in\s+part\b|\bpartially\s+(?:allowed|granted)\b|\bin\s+part\s+(?:allowed|granted)\b/i,
  allowed: new RegExp(String.raw`\b${APP}\s+(?:is|are|shall\s+be|be)\s+(?:hereby\s+)?(?:allowed|granted)\b`, 'i'),
  dismissed: new RegExp(String.raw`\b${APP}\s+(?:is|are|shall\s+be|be)\s+(?:hereby\s+)?dismissed\b`, 'i'),
  setAside: /\b(?:decision|refusal)[^.;]{0,200}?\b(?:is|are|be|shall\s+be)\s+(?:hereby\s+)?(?:quashed\s+and\s+)?set\s+aside\b/i,
};

/**
 * Deterministic disposition from the JUDGMENT block. Conservative on purpose:
 * consent, "in part", or both allowed and dismissed (consolidated files) are
 * reported as such or as 'unknown', and every one of those blocks the case.
 */
export function dispositionFromJudgment(judgment: string): Disposition {
  const text = ascii(judgment).replace(/\s+/g, ' ');
  if (!text.trim()) return 'unknown';
  if (RX.consent.test(text)) return 'consent';
  if (RX.inPart.test(text)) return 'allowed_in_part';
  const allowed = RX.allowed.test(text) || RX.setAside.test(text);
  const dismissed = RX.dismissed.test(text);
  if (allowed && dismissed) return 'unknown';
  if (allowed) return 'allowed';
  if (dismissed) return 'dismissed';
  return 'unknown';
}

/** Was the matter sent back for redetermination? Only meaningful when allowed. */
export function remittedFromJudgment(judgment: string): boolean {
  const text = ascii(judgment).replace(/\s+/g, ' ');
  return /\bremitted\b|\breferred\s+back\b|\bsent\s+back\b|\breturned\s+(?:to|for)\b[^.;]{0,80}\b(?:redetermination|reconsideration)\b|\b(?:re)?determin(?:ed|ation)\s+by\s+a\s+different\b|\bconsidered\s+by\s+a\s+different\s+(?:officer|decision[- ]maker|visa\s+officer)\b|\bfor\s+(?:re-?determination|reconsideration)\b/i.test(text);
}

const BLOCK_TAGS = /<\/?(?:p|div|br|li|ul|ol|tr|td|th|table|h[1-6]|blockquote|section|article|header|footer|pre)\b[^>]*>/gi;

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…', zwnj: '‌' };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/** HTML to plain text with one line per block element. Scripts and styles dropped. */
export function htmlToLines(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(BLOCK_TAGS, '\n')
      .replace(/<[^>]+>/g, ''),
  );
}

export function parseDecisionHtml(html: string): ParsedDecision {
  return parseDecisionText(htmlToLines(html));
}

/** PDF via the repo's unpdf dependency; pages joined with newlines. */
export async function parseDecisionPdf(bytes: Uint8Array): Promise<ParsedDecision> {
  const { extractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  return parseDecisionText(pages.join('\n'));
}

/**
 * The Court's deadline order in a mandamus judgment, verbatim: e.g. "A decision
 * shall be rendered on the Applicant's application within 90 days of this
 * judgment." Null when the JUDGMENT block sets no deadline. Deterministic, so
 * the quote is exact by construction.
 */
export function deadlineOrderFromJudgment(judgment: string | null | undefined): { quote: string; days: number } | null {
  const text = (judgment ?? '').replace(/\s+/g, ' ');
  // Split the numbered order items ("1. ... 2. ...").
  const items = text.split(/\s(?=\d{1,2}\.\s+[A-Z])/).map((x) => x.replace(/^\d{1,2}\.\s+/, '').trim());
  for (const item of items) {
    const m = /^[^.]*?\b(?:decision|determination)\b[^.]*?\bwithin\s+(\d{1,3})\s+days\b[^.]*\./i.exec(item);
    if (m) return { quote: m[0].trim(), days: Number(m[1]) };
  }
  return null;
}
