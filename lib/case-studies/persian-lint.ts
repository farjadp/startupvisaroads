// Persian checks for case-study pages (spec §6 "Persian").
//
// Two things live here:
// - normaliseFaForMatching: a length-preserving fold used by the red-line
//   scanner and the anonymiser so that Arabic/Persian letter variants, ZWNJ
//   and digit scripts cannot dodge a pattern;
// - lintFa: orthography rules the fa page must pass (نیم‌فاصله، ی/ک، «»،
//   no em dash, «بند ۲۳» with Persian digits, citations in Latin script).

const ZWNJ = '‌';
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/**
 * One-to-one character fold (same length as the input, so match indexes map
 * straight back to the original text):
 *   ي ى -> ی   ك -> ک   ة -> ه   أ إ ٱ -> ا   ؤ -> و
 *   Persian and Arabic-Indic digits -> ASCII digits
 *   ZWNJ, ZWJ, NBSP -> ASCII space
 *   tatweel and harakat -> ASCII space (then patterns allow \s*)
 */
export function normaliseFaForMatching(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    let r = ch;
    if (ch === 'ي' || ch === 'ى') r = 'ی';
    else if (ch === 'ك') r = 'ک';
    else if (ch === 'ة') r = 'ه';
    else if (ch === 'أ' || ch === 'إ' || ch === 'ٱ') r = 'ا';
    else if (ch === 'ؤ') r = 'و';
    else if (PERSIAN_DIGITS.includes(ch)) r = String(PERSIAN_DIGITS.indexOf(ch));
    else if (ARABIC_DIGITS.includes(ch)) r = String(ARABIC_DIGITS.indexOf(ch));
    else if (ch === ZWNJ || ch === '‍' || ch === ' ') r = ' ';
    else if (code === 0x0640 || (code >= 0x064B && code <= 0x0652) || code === 0x0670) r = ' ';
    // Astral characters are two UTF-16 units; keep the length identical.
    out += r.length === ch.length ? r : ch;
  }
  return out;
}

export function toPersianDigits(s: string): string {
  return s.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export type FaLintIssue = { rule: string; message: string; match: string; index: number };

type LintRule = { rule: string; message: string; re: RegExp };

const FA = '[\\u0600-\\u06FF]';
// Verb stems that commonly follow می/نمی. Limited on purpose: میز، میوه، میزان
// and میلیون start with the same letters and are not verbs.
const MI_STEMS = 'شود|شوند|شد|شدند|کند|کنند|کنیم|کنید|کرد|کردند|توان|تواند|توانند|توانید|توانیم|دهد|دهند|دهیم|گیرد|گیرند|رود|روند|آید|آیند|خواهد|خواهند|داند|دانند|دانیم|بیند|بینند|گوید|گویند|ماند|مانند|رسد|رسند|پرسد|یابد|خواند|نویسد|نویسند';

const RULES: LintRule[] = [
  { rule: 'arabic-ye', message: 'Arabic ي/ى; use Persian ی', re: /[يى]/g },
  { rule: 'arabic-kaf', message: 'Arabic ك; use Persian ک', re: /ك/g },
  { rule: 'arabic-digits', message: 'Arabic-Indic digits; use Persian digits ۰–۹', re: /[٠-٩]/g },
  { rule: 'em-dash', message: 'em/en dash in Persian prose; use ، ؛ or restructure', re: /[—–]/g },
  { rule: 'latin-quotes', message: 'Latin quotes; use «»', re: /["“”]/g },
  { rule: 'mi-space', message: 'می/نمی must be joined with نیم‌فاصله (می‌شود), not a space', re: new RegExp(`(?:^|[\\s«(])(ن?می) (?=(?:${MI_STEMS})(?:${FA}|\\s|$|[.،؛؟!»]))`, 'g') },
  { rule: 'mi-joined', message: 'می/نمی attached with no نیم‌فاصله (میشود); use می‌شود', re: new RegExp(`(?:^|[\\s«(])(ن?می)(?=(?:${MI_STEMS})(?:\\s|$|[.،؛؟!»]))`, 'g') },
  { rule: 'suffix-space', message: 'ها/های/تر/ترین must be joined with نیم‌فاصله, not a space', re: new RegExp(`${FA} (?:ها|های|هایی|هایم|هایش|هایشان|تر|ترین)(?=\\s|$|[.،؛؟!»])`, 'g') },
  { rule: 'double-space', message: 'double space', re: / {2,}/g },
  { rule: 'space-before-punct', message: 'space before Persian punctuation', re: / [،؛؟!.](?!\d)/g },
  { rule: 'latin-comma', message: 'Latin comma between Persian words; use ،', re: new RegExp(`${FA}, ?${FA}`, 'g') },
  { rule: 'latin-question', message: 'Latin ? after Persian; use ؟', re: new RegExp(`${FA}\\?`, 'g') },
  { rule: 'para-ref-latin-digits', message: 'paragraph refs are «بند ۲۳» with Persian digits', re: /بند[\s‌]*\d/g },
  { rule: 'para-ref-english', message: 'English "[para N]" in Persian text; write «بند ۲۳»', re: /\[\s*paras?\.?\s*[\d۰-۹]/gi },
  { rule: 'citation-persian-digits', message: 'neutral citations stay in Latin script (2025 FC 12)', re: /[۰-۹]{4}\s*(?:FC|CF)\s*[\d۰-۹]+|\d{4}\s*(?:FC|CF)\s*[۰-۹]+/g },
  { rule: 'citation-transliterated', message: 'neutral citation transliterated; keep "FC" in Latin', re: /اف[\s‌]*سی/g },
];

/** Lint plain Persian text (strip HTML first). Latin runs (URLs, citations) are left alone except where a rule targets them. */
export function lintFa(text: string): FaLintIssue[] {
  const issues: FaLintIssue[] = [];
  for (const { rule, message, re } of RULES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      issues.push({ rule, message, match: m[0], index: m.index });
      if (m[0].length === 0) re.lastIndex += 1;
    }
  }
  return issues.sort((a, b) => a.index - b.index);
}

/** «بند ۲۳» / «بندهای ۴ و ۷» from paragraph numbers. */
export function faParaRef(paras: number[]): string {
  const ds = paras.map((p) => toPersianDigits(String(p)));
  if (ds.length === 1) return `بند ${ds[0]}`;
  return `بندهای ${ds.slice(0, -1).join('، ')} و ${ds[ds.length - 1]}`;
}

/** "[para 23]" / "[paras 4, 7]" for English pages. */
export function enParaRef(paras: number[]): string {
  return paras.length === 1 ? `[para ${paras[0]}]` : `[paras ${paras.join(', ')}]`;
}
