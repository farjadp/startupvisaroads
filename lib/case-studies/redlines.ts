// The 12 red lines of spec §5, as a deterministic scan over the page text in
// en and fa. Stage 8 runs it on every draft; the admin review screen shows
// the result; any hit blocks the post.
//
// Design:
// - Text is folded first (length-preserving, so indexes map to the original):
//   typographic quotes/dashes to ASCII; for Persian also ی/ک/digit/ZWNJ forms
//   (normaliseFaForMatching).
// - English patterns always run (a Persian page can carry English phrases);
//   Persian patterns run when locale = 'fa'.
// - Some patterns are "negatable": a negation just before them in the same
//   clause (and, for verb-final Persian, after them up to the clause end)
//   cancels the hit. That is what keeps the mandatory disclaimers clean:
//   "not a typical result", "not affiliated with or endorsed by the
//   Government", «نه نتیجه معمول». The strongest phrases are never negatable.
// - A few patterns have an allow-condition on the clause, e.g. refund wording
//   that states the real undertaking (evaluating body + 12 months).
//
// Rule 11 flags every currency amount. A type A page may legitimately repeat
// an amount from the decision; the pipeline accepts such a hit only when the
// same amount appears in a verified claim quote (scripts/case-studies), never
// here.

import { decodeEntities } from './fc-parser';
import { normaliseFaForMatching } from './persian-lint';

export type RedLineHit = { rule: number; label: string; match: string; index: number };

type Pattern = {
  re: RegExp;
  negatable?: boolean;
  /** Return true to allow (skip) the hit given the surrounding clause. */
  allowIf?: (clause: string) => boolean;
};

type Rule = { rule: number; label: string; en: Pattern[]; fa: Pattern[] };

const en = (src: string, opts: Omit<Pattern, 're'> = {}): Pattern => ({ re: new RegExp(src, 'gi'), ...opts });

/**
 * Persian patterns are written in natural spelling. They are folded the same
 * way as the text, and every literal space (ZWNJ folds to a space) becomes
 * \s*, so «می‌کنیم», «می کنیم» and «میکنیم» all match.
 */
const fa = (src: string, opts: Omit<Pattern, 're'> = {}): Pattern => ({
  re: new RegExp(normaliseFaForMatching(src).replace(/ +/g, '\\s*'), 'gi'),
  ...opts,
});

const NUM = String.raw`\d[\d,.٬٫]*`;

const mentionsUndertakingEn = (c: string) => /\bevaluating\s+body\b/i.test(c) && /\b(?:12|twelve)\s*-?\s*months?\b/i.test(c);
const mentionsUndertakingFa = (c: string) => /نهاد\s*ارزیاب/.test(c) && /(?:12|دوازده)\s*ماه/.test(c);
const attributedToCourtEn = (c: string) => /\b(?:the\s+)?Court\s+(?:found|held|said|noted|concluded|stated|wrote|agreed|accepted|determined)\b/i.test(c);
const attributedToCourtFa = (c: string) => /دادگاه/.test(c) && /(?:گفت|نوشت|دانست|تشخیص|نتیجه|پذیرفت|اعلام)/.test(c);

export const RED_LINES: readonly Rule[] = [
  {
    rule: 1,
    label: 'Guarantee wording',
    en: [
      en(String.raw`\bguarantee[ds]?\s+(?:of\s+)?(?:your\s+|a\s+|an\s+|the\s+)?(?:approval|visa|success|acceptance|results?|PR|permanent\s+residence|outcome|permit|admission)\b`, { negatable: true }),
      en(String.raw`\bguaranteed\s+(?:approval|visas?|success|results?|acceptance|outcomes?|PR|admission|permits?)\b`, { negatable: true }),
      en(String.raw`\b(?:approval|success|visa|acceptance|admission)\s+(?:is\s+)?guaranteed\b`, { negatable: true }),
      en(String.raw`\bwe\s+guarantee\b`, { negatable: true }),
      en(String.raw`\b100\s?%\s+guaranteed\b`),
      en(String.raw`\bsure[- ]shot\b`),
      en(String.raw`\b(?:certain|assured)\s+(?:approval|visa|success)\b`, { negatable: true }),
      en(String.raw`\bpromise\s+(?:you\s+)?(?:approval|a\s+visa|success|your\s+visa)\b`, { negatable: true }),
    ],
    fa: [
      fa('تضمین (?:ی )?(?:ویزا|قبولی|اقامت|موفقیت|پذیرش|نتیجه|صدور)', { negatable: true }),
      fa('قبولی (?:قطعی|تضمینی|صد در صد|100)'),
      fa('(?:ویزا|اقامت|پذیرش|قبولی)(?:ی)? (?:تضمینی|قطعی)'),
      fa('تضمین می (?:کنیم|دهیم)'),
      fa('با تضمین (?:کامل|صد|قبولی)'),
      fa('صد در صد (?:قبول|موفق|تضمین)'),
    ],
  },
  {
    rule: 2,
    label: '"We got them their visa / PR / permit"',
    en: [
      en(String.raw`\bwe\s+(?:got|secured|obtained|won|delivered)\s+(?:them|him|her|you|our\s+clients?|clients?|the\s+applicant|the\s+family)\s+(?:their\s+|his\s+|her\s+|your\s+|a\s+|the\s+)?(?:visas?|PR|permanent\s+residence|permits?|work\s+permits?|study\s+permits?)\b`),
      en(String.raw`\bwe\s+(?:got|secured|obtained|won)\s+(?:their|his|her|your|the|a)\s+(?:visas?|PR|permanent\s+residence|permits?|work\s+permits?|study\s+permits?)\b`),
      en(String.raw`\bwe\s+helped\s+(?:\w+\s+){1,3}(?:get|obtain|secure|win)\s+(?:their|his|her|a|the)\s+(?:visas?|PR|permanent\s+residence|permits?)\b`),
    ],
    fa: [
      fa('(?:ویزا|اقامت|پی آر|مجوز کار|ویزای \\S+)(?:ش|شان|اش)? را (?:برایش|برایشان|براش|براشون )?(?:گرفتیم|دریافت کردیم)'),
      fa('(?:برایش|برایشان|براش|براشون|برای (?:او|ایشان|مراجع|موکل)(?:مان)?) (?:ویزا|اقامت|مجوز) (?:گرفتیم|دریافت کردیم)'),
      fa('ما (?:\\S+ ){0,4}(?:ویزا|اقامت)(?: \\S+){0,2} (?:گرفتیم|رساندیم)'),
    ],
  },
  {
    rule: 3,
    label: '"The Court approved the visa" / "won the appeal"',
    en: [
      en(String.raw`\b(?:the\s+)?(?:Federal\s+)?Court\s+(?:approved|granted|issued|awarded|gave)\s+(?:the\s+|his\s+|her\s+|their\s+|a\s+)?(?:applicant'?s?\s+)?(?:visa|permit|PR|permanent\s+residence|study\s+permit|work\s+permit)\b`, { negatable: true }),
      en(String.raw`\bwon\s+(?:the\s+|an\s+|their\s+|his\s+|her\s+)?(?:visa\s+)?appeal\b`, { negatable: true }),
      en(String.raw`\bvisa\s+appeal\b`, { negatable: true }),
      en(String.raw`\bappeal(?:ed)?\s+(?:the|a|their|his|her)\s+(?:visa\s+)?refusal\b`, { negatable: true }),
      en(String.raw`\boverturned\s+the\s+refusal\s+and\s+(?:granted|issued)\b`),
    ],
    fa: [
      fa('دادگاه (?:\\S+ ){0,2}(?:ویزا|اقامت|مجوز کار|مجوز تحصیل|ویزای \\S+) (?:را )?(?:صادر|تایید|اعطا) (?:کرد|نمود)'),
      fa('(?:برنده|پیروز) (?:دعوا|پرونده|تجدیدنظر|اعتراض)', { negatable: true }),
      fa('تجدیدنظر (?:را )?برد'),
      fa('دادگاه (?:به \\S+ )?ویزا داد'),
    ],
  },
  {
    rule: 4,
    label: 'Success rate, approval count, "X of Y" or "100%"',
    en: [
      en(String.raw`\b100\s?%|\b100\s+percent\b|\bhundred\s+percent\b`),
      en(String.raw`\b(?:success|approval|acceptance|win|visa)\s+rates?\b`),
      en(String.raw`\b\d+\s+(?:out\s+)?of\s+(?:\d+|every|our)\s+(?:clients?|applicants?|cases?|founders?|files?|students?|applications?|customers?)\b`),
      en(String.raw`\b\d+\s+out\s+of\s+\d+\b`),
      en(String.raw`\b${NUM}\+?\s+(?:successful|approved|happy)\s+(?:clients?|cases?|applications?|visas?|founders?|families)\b`),
      en(String.raw`\b(?:hundreds|dozens|thousands)\s+of\s+(?:successful|approved|happy)\s+\w+`),
      en(String.raw`\b\d{1,3}\s?%\s+(?:of\s+)?(?:our\s+)?(?:clients|applicants|cases|founders|success|approvals?)\b`),
    ],
    fa: [
      fa('100 ?(?:٪|%|درصد)'),
      fa('صد در صد'),
      fa('(?:نرخ|درصد|آمار) (?:موفقیت|قبولی|پذیرش)'),
      fa('\\d+ (?:نفر )?از (?:هر )?\\d+ (?:نفر|مراجع|متقاضی|پرونده|مشتری)'),
      fa('\\d+ (?:مراجع|متقاضی|پرونده|نفر|خانواده)(?:ی)? (?:موفق|قبول)'),
    ],
  },
  {
    rule: 5,
    label: '"Your case is like this one, so you will…"',
    en: [
      en(String.raw`\byour\s+(?:case|file|application|situation)\s+is\s+(?:just\s+|exactly\s+)?like\s+(?:this|the\s+one|these|theirs)`, { negatable: true }),
      en(String.raw`\b(?:like|as\s+with)\s+(?:this|the)\s+applicant,?\s+you\s+(?:will|would|can)\b`),
      en(String.raw`\byou\s+will\s+(?:also\s+)?(?:win|succeed|be\s+approved|get\s+(?:your\s+|a\s+)?(?:visa|permit|PR|approval))\b`, { negatable: true }),
      en(String.raw`\bthe\s+same\s+will\s+happen\s+(?:to|for)\s+you\b`, { negatable: true }),
    ],
    fa: [
      fa('پرونده(?: ی)? (?:شما|تان) (?:هم )?(?:مثل|شبیه|مانند) (?:همین|این)'),
      fa('شما هم (?:قبول|موفق|برنده) (?:می شوید|خواهید شد)'),
      fa('(?:ویزا|اقامت|مجوز)(?:تان)? را (?:هم )?(?:می گیرید|خواهید گرفت)'),
    ],
  },
  {
    rule: 6,
    label: '"We file / submit / represent you"',
    en: [
      en(String.raw`\bwe\s+(?:will\s+|can\s+|also\s+)?(?:file|filed|submit|submitted|lodge|lodged|prepare|prepared|complete|completed)\s+(?:your|the|their|his|her|all|clients'?)?\s*(?:\w+\s+){0,2}(?:applications?|forms?|files?|paperwork|petitions?)\b`, { negatable: true }),
      en(String.raw`\bwe\s+(?:will\s+|can\s+)?represent(?:ed)?\s+(?:you|clients|our\s+clients|applicants|them)\b`, { negatable: true }),
      en(String.raw`\b(?:file|submit|apply|lodge)\w*\s+(?:\w+\s+){0,4}on\s+your\s+behalf\b`, { negatable: true }),
      en(String.raw`\b(?:we\s+are|as)\s+your\s+(?:immigration\s+)?(?:representative|agent|lawyer|consultant)\b`, { negatable: true }),
    ],
    fa: [
      fa('(?:پرونده|درخواست|فرم)(?: های)?(?: تان| ت| شما)? را (?:برای شما )?(?:ثبت|ارسال|تشکیل|پر|تکمیل) (?:می کنیم|کردیم|خواهیم کرد)'),
      fa('(?:وکیل|نماینده)(?: قانونی)? (?:شما|تان) (?:هستیم|می شویم)'),
      fa('از طرف شما (?:\\S+ ){0,3}(?:ارسال|ثبت|اقدام|اپلای)'),
      fa('(?:برای شما|براتون) اپلای (?:می کنیم|کردیم)'),
    ],
  },
  {
    rule: 7,
    label: '"Our immigration advice"',
    en: [
      en(String.raw`\bour\s+immigration\s+(?:advice|advisers?|advisors?|consultants?|lawyers?|services?|consulting)\b`),
      en(String.raw`\bwe\s+(?:will\s+)?(?:give|provide|offer)\s+(?:you\s+)?(?:expert\s+)?immigration\s+(?:advice|consulting|counsel)\b`, { negatable: true }),
      en(String.raw`\bimmigration\s+advice\s+from\s+(?:us|VisaRoads)\b`, { negatable: true }),
      en(String.raw`\bour\s+(?:RCICs?|licensed\s+(?:immigration\s+)?consultants?)\b`),
    ],
    fa: [
      fa('مشاوره(?: ی)? مهاجرتی ما'),
      fa('مشاوران مهاجرتی ما'),
      fa('مشاوره مهاجرتی (?:می دهیم|ارائه می دهیم|ارائه می کنیم|می کنیم)'),
    ],
  },
  {
    rule: 8,
    label: 'Refund wording beyond the 12-month evaluating-body undertaking',
    en: [
      en(String.raw`\bmoney[- ]back\b`, { allowIf: mentionsUndertakingEn }),
      en(String.raw`\b(?:full|100\s?%|guaranteed)\s+refunds?\b`),
      en(String.raw`\brefund(?:ed|s|able)?\b`, { allowIf: mentionsUndertakingEn }),
      en(String.raw`\brefund[^.;\n]{0,40}\b(?:refus|reject|den(?:y|ied))\w*`),
      en(String.raw`\brisk[- ]free\b`),
      en(String.raw`\bno\s+(?:visa|approval),?\s+no\s+(?:fee|pay)\b`),
      en(String.raw`\bpay\s+only\s+(?:if|when|after)\b`),
    ],
    fa: [
      fa('(?:بازگشت|عودت|استرداد)(?: کامل)? (?:وجه|پول|هزینه)', { allowIf: mentionsUndertakingFa }),
      fa('(?:پول|وجه|هزینه)(?:تان|ت| شما)? (?:را )?(?:پس می|بر می گردانیم|برمی گردانیم)', { allowIf: mentionsUndertakingFa }),
      fa('در صورت (?:ریجکت|ریجکتی|رد)[^.،؛\\n]{0,40}(?:بازگشت|عودت|پس)'),
      fa('پرداخت فقط (?:بعد از|پس از|در صورت) (?:قبولی|ویزا)'),
    ],
  },
  {
    rule: 9,
    label: 'Bias or incompetence claims in our own voice',
    en: [
      en(String.raw`\b(?:the\s+)?(?:visa\s+)?(?:officer|officers|IRCC|visa\s+office|government)\s+(?:was|were|is|are)\s+(?:clearly\s+|obviously\s+|simply\s+)?(?:biased|incompetent|lazy|racist|careless|negligent|prejudiced|corrupt|ignorant)\b`, { allowIf: attributedToCourtEn }),
      en(String.raw`\b(?:biased|incompetent|lazy|racist|careless|prejudiced|corrupt)\s+(?:visa\s+)?(?:officers?|IRCC|government|visa\s+office)\b`, { allowIf: attributedToCourtEn }),
      en(String.raw`\b(?:discriminat(?:ed|es|ing)|prejudiced?)\s+against\s+(?:Iranians?|applicants|the\s+applicant|him|her)\b`, { allowIf: attributedToCourtEn }),
    ],
    fa: [
      fa('افسر(?: مهاجرت)? (?:مغرض|بی کفایت|نژادپرست|تنبل|بی سواد|بی دقت|متعصب|فاسد)', { allowIf: attributedToCourtFa }),
      fa('(?:مغرض|نژادپرست|متعصب|بی کفایت)(?: بودن)? (?:افسر|اداره مهاجرت|IRCC)', { allowIf: attributedToCourtFa }),
      fa('(?:تبعیض|غرض ورزی) (?:افسر|اداره مهاجرت|IRCC)', { allowIf: attributedToCourtFa }),
    ],
  },
  {
    rule: 10,
    label: '"Official" about us, or government symbols',
    en: [
      en(String.raw`\bofficial\s+(?:partner|representative|agent|consultant|provider|immigration\s+(?:partner|consultant|agent)|website\s+of\s+(?:IRCC|the\s+Government))\b`, { negatable: true }),
      en(String.raw`\bofficially\s+(?:approved|endorsed|recogni[sz]ed|licen[sc]ed|accredited|certified|authori[sz]ed|partnered)\b`, { negatable: true }),
      en(String.raw`\b(?:approved|endorsed|accredited|certified|authori[sz]ed|licen[sc]ed|recogni[sz]ed)\s+by\s+(?:IRCC|the\s+Government(?:\s+of\s+Canada)?|Immigration\s+Canada|the\s+(?:Federal\s+)?Court|the\s+Canadian\s+government)\b`, { negatable: true }),
      en(String.raw`\bgovernment[- ](?:approved|accredited|certified|endorsed|partner)\b`, { negatable: true }),
      en(String.raw`\bIRCC[- ](?:approved|certified|accredited|partner|endorsed)\b`, { negatable: true }),
      en(String.raw`\bin\s+(?:partnership|affiliation)\s+with\s+(?:IRCC|the\s+Government\s+of\s+Canada|the\s+Court)\b`, { negatable: true }),
      en(String.raw`\b(?:coat\s+of\s+arms|Canada\s+wordmark|FIP\s+symbol)\b`),
    ],
    fa: [
      fa('(?:نماینده|شریک|مشاور|سایت|وب سایت|کارگزار|عامل)(?: ی)? رسمی', { negatable: true }),
      fa('(?:مورد )?تایید(?: رسمی)? (?:دولت|IRCC|اداره مهاجرت|دادگاه)', { negatable: true }),
      fa('رسما (?:تایید|مورد تایید|ثبت|شریک)', { negatable: true }),
      fa('مجوز رسمی (?:از )?(?:دولت|IRCC)', { negatable: true }),
      fa('نشان (?:رسمی )?دولت کانادا'),
    ],
  },
  {
    rule: 11,
    label: 'Company prices or fees',
    en: [
      en(String.raw`(?:[$€£]|\b(?:CAD|USD|EUR|GBP|C\$|US\$|CA\$))\s?${NUM}(?:\s?(?:k|K|thousand|million)\b)?`),
      en(String.raw`\b${NUM}\s?(?:dollars|CAD|USD|euros?|EUR|GBP)\b`),
      en(String.raw`\b(?:our|the)\s+(?:fees?|prices?|pricing|packages?|rates?)\s+(?:is|are|start|starts|from|of)\b`),
    ],
    fa: [
      fa(`${NUM} ?(?:هزار |میلیون )?(?:دلار|یورو|تومان|ریال|پوند)`),
      fa('(?:هزینه|قیمت|تعرفه)(?: ی)? (?:خدمات|بسته|منتورینگ|مشاوره|ما)'),
    ],
  },
  {
    rule: 12,
    label: '"Typical result" or "this could be you"',
    en: [
      en(String.raw`\btypical\s+(?:results?|outcomes?|experiences?)\b`, { negatable: true }),
      en(String.raw`\bthis\s+could\s+be\s+you\b`),
      en(String.raw`\byou\s+could\s+be\s+(?:next|our\s+next)\b`),
      en(String.raw`\b(?:get|achieve|see)\s+(?:the\s+)?same\s+(?:results?|outcomes?)\b`, { negatable: true }),
      en(String.raw`\bresults?\s+like\s+(?:these|this)\b`, { negatable: true }),
      en(String.raw`\b(?:join|be\s+one\s+of)\s+our\s+success\s+stor(?:y|ies)\b`),
    ],
    fa: [
      fa('نتیجه(?: ی)? (?:معمول|معمولی|همیشگی)', { negatable: true }),
      fa('این (?:می تواند|میتواند) (?:شما|داستان شما) (?:باشد|باشید)'),
      fa('شما هم می توانید (?:همین|مثل)'),
      fa('نفر بعدی (?:شما|خودتان)'),
      fa('(?:همین|چنین) نتیجه ای (?:را )?(?:بگیرید|می گیرید|خواهید گرفت)'),
    ],
  },
];

const EN_NEG = /\b(?:not|no|never|nor|neither|without|cannot|can't|isn't|aren't|doesn't|don't|won't|didn't|does\s+not|did\s+not)\b/i;
const FA_NEG_BEFORE = /(?:^|\s)(?:نه|نمی|هیچ|بدون|نیست|ندارد)(?:\s|$)/;
const FA_NEG_AFTER = /(?:نیست|نیستند|نمی|ندارد|ندارند|نخواهد|نکرد|نمی شود|نبوده|نه)/;
const CLAUSE_END = /[.!?;؛؟\n]/;

function clauseBounds(text: string, index: number, length: number): { start: number; end: number } {
  let start = index;
  while (start > 0 && !CLAUSE_END.test(text[start - 1])) start -= 1;
  let end = index + length;
  while (end < text.length && !CLAUSE_END.test(text[end])) end += 1;
  return { start, end };
}

function isNegated(folded: string, index: number, length: number, script: 'en' | 'fa'): boolean {
  const { start, end } = clauseBounds(folded, index, length);
  if (script === 'en') return EN_NEG.test(folded.slice(Math.max(start, index - 60), index));
  const before = folded.slice(Math.max(start, index - 30), index);
  const after = folded.slice(index + length, end);
  return FA_NEG_BEFORE.test(before) || FA_NEG_AFTER.test(after);
}

/** Length-preserving fold of typographic punctuation (same as quotes.ts, minus whitespace collapsing). */
function foldPunct(s: string): string {
  return s
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐‑‒–—―−]/g, '-');
}

/** HTML to plain text: tags removed (block tags become newlines), entities decoded. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<\/?(?:p|div|br|li|ul|ol|tr|td|th|table|h[1-6]|blockquote|section|article|header|footer|figure|figcaption)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  );
}

export function scanRedLines(input: string, locale: 'en' | 'fa'): RedLineHit[] {
  const text = /<[a-z][\s\S]*?>/i.test(input) ? htmlToText(input) : input;
  const folded = foldPunct(normaliseFaForMatching(text));
  const hits: RedLineHit[] = [];
  for (const rule of RED_LINES) {
    const sets: { script: 'en' | 'fa'; patterns: Pattern[] }[] = [{ script: 'en', patterns: rule.en }];
    if (locale === 'fa') sets.push({ script: 'fa', patterns: rule.fa });
    for (const { script, patterns } of sets) {
      for (const p of patterns) {
        p.re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = p.re.exec(folded))) {
          if (m[0].length === 0) { p.re.lastIndex += 1; continue; }
          const { start, end } = clauseBounds(folded, m.index, m[0].length);
          const clause = folded.slice(start, end);
          if (p.negatable && isNegated(folded, m.index, m[0].length, script)) continue;
          if (p.allowIf && p.allowIf(clause)) continue;
          hits.push({ rule: rule.rule, label: rule.label, match: text.slice(m.index, m.index + m[0].length), index: m.index });
        }
      }
    }
  }
  // One hit per (rule, index): overlapping patterns of the same rule collapse.
  const seen = new Set<string>();
  return hits
    .sort((a, b) => a.index - b.index || a.rule - b.rule)
    .filter((h) => {
      const key = `${h.rule}:${h.index}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Paste-ready disclaimers from spec §5. Pages must carry them verbatim; the scanner must report zero hits on them. */
export const DISCLAIMERS = {
  courtEn: "An educational summary of a public Federal Court of Canada decision, not legal or immigration advice and not the official version. The official text is on the Court's website (linked). Every case turns on its own facts. VisaRoads Inc. is not affiliated with or endorsed by the Government of Canada or the Court. For your own case, consult a lawyer or a licensed consultant (RCIC).",
  courtFa: 'این صفحه خلاصه‌ای آموزشی از یک رأی عمومی دادگاه فدرال کاناداست؛ نه مشاوره حقوقی یا مهاجرتی است و نه نسخه رسمی رأی. متن معتبر را در سایت دادگاه بخوانید (لینک بالا). هر پرونده با شرایط خودش سنجیده می‌شود. ویزا رودز هیچ وابستگی‌ای به دولت کانادا یا دادگاه ندارد. برای پرونده خودتان با وکیل یا مشاور مهاجرت دارای مجوز (RCIC) صحبت کنید.',
  clientEn: "A real VisaRoads client's experience, shared with their written consent; identifying details are removed or generalised. VisaRoads Inc. provides mentorship and business-plan services. It is not an immigration representative and gives no immigration advice. Results depend on each person's circumstances and on government decisions. This story is not a typical result or a promise of any outcome.",
  clientFa: 'این تجربه واقعی یکی از مراجعان ویزا رودز است که با رضایت کتبی خودش و بدون جزئیات شناسایی‌کننده منتشر شده. ویزا رودز خدمات منتورینگ و نگارش طرح کسب‌وکار ارائه می‌دهد و نماینده یا مشاور مهاجرتی نیست. نتیجه هر پرونده به شرایط خود فرد و تصمیم مقام دولتی بستگی دارد؛ این تجربه نه نتیجه معمول است و نه تضمینی برای شما.',
  sourceBoxEn: 'Not produced in affiliation with, or with the endorsement of, the Government of Canada.',
} as const;
