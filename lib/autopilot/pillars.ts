// ============================================================================
// lib/autopilot/pillars.ts
// What KIND of reader each article is for, and how much of the blog each kind
// gets.
//
// WHY THIS EXISTS
// On 26 Oct 2026 Farjad said the blog had become «خیلی استارتاپی». It had:
// the planner was told every reader was "a founder or skilled professional",
// the link rule demanded a programme page (nearly all of them startup routes),
// and the 10 Oct mix gave startup routes 60%. So an article on an Australian
// partner visa came out "for startup founders", and housing in Istanbul came
// out "as a startup founder" — a founder angle bolted onto subjects whose
// readers are not founders.
//
// The fix is a second axis beside family and destination (diversity.ts): the
// PILLAR, which names the reader. Each pillar has a share of the blog, and the
// planner is handed the one furthest below its share. Startup is one route
// inside the business pillar, not the lens on everything.
// ============================================================================

export const PILLARS = ['work', 'business', 'study', 'life', 'news'] as const;
export type Pillar = (typeof PILLARS)[number];

/** Share of the blog, in percent. Approved by Farjad, 26 Oct 2026. */
export const PILLAR_SHARE: Record<Pillar, number> = {
  work: 25,
  business: 25,
  study: 20,
  life: 20,
  // Written by the source lane from the news; the planned lanes never pick it.
  news: 10,
};

/** The pillars the planned writers choose between. */
export const PLANNED_PILLARS = PILLARS.filter((p) => p !== 'news');

/** Who the article is written for, in words the planner and writer are shown. */
export const PILLAR_READER: Record<Pillar, string> = {
  work: 'a skilled professional or worker who wants to move for a job — work permits, skilled-worker and points-based routes, job offers, credential recognition, the job market',
  business: 'a business owner, entrepreneur or investor — entrepreneur and business-immigration streams (the Canadian Entrepreneur PNPs above all), startup visas, investor routes',
  study: 'a student or graduate, or a parent planning for one — admission, study permits, tuition and funding, working while studying, staying on after graduation',
  life: 'a person or family settling in — housing, schools, healthcare, a spouse and children, banking, first-year taxes, language, cost of living',
  news: 'anyone affected by a rule that just changed — what changed, for whom, and what to do now',
};

/** The blog category each non-business pillar files under (lib/categories.ts). */
export const PILLAR_CATEGORY: Partial<Record<Pillar, string>> = {
  work: 'Work & Skilled Immigration',
  study: 'Study Abroad',
  life: 'Life & Family Abroad',
};

/**
 * Pages about a business route: startup visas, entrepreneur streams, investor
 * visas and our founder services. The planner was told not to use them as
 * filler links on other readers' articles and did anyway (a work-permit salary
 * comparison linking the Dutch startup visa), so they are taken out in code.
 */
const BUSINESS_PAGE = /^\/(europe\/|startup-visa-canada|canada-startup-visa|uk\/innovator-founder|usa\/(o-1a|e-2|eb5|founder-readiness|assessment|why-petitions-fail)|usa$|country\/(italy|turkey|israel|australia|usa)|turkey-tech-visa|australia|israel|pnp\/(alberta|manitoba|new-brunswick|nova-scotia|pei)|mentorship|services|faq|webinar)/;

export function isBusinessPage(path: string): boolean {
  return BUSINESS_PAGE.test(path);
}

/** A brief's links with business pages removed when the reader is not in business — unless nothing else is left. */
export function linksForPillar(pillar: Pillar, links: string[]): string[] {
  if (pillar === 'business') return links;
  const kept = links.filter((l) => !isBusinessPage(l));
  return kept.length ? kept : links;
}

/** Checked in order; the first pillar whose pattern matches wins. */
const PILLAR_PATTERNS: [Pillar, RegExp][] = [
  ['study', /stud(y|ent)|universit|admission|tuition|scholarship|pgwp|graduat|college|f-?1 visa|تحصیل|دانشجو|دانشگاه|پذیرش|بورسیه|شهریه|فارغ‌التحصیل/i],
  ['business', /start-?up|entrepreneur|founder|business (immigration|stream|plan|visa)|investor|invest(ment)? visa|innovator|self-employ|e-2|eb-5|incubator|facilitator|co-?founder|equity|استارتاپ|کارآفرین|بنیان‌گذار|سرمایه‌گذاری|کسب‌وکار|انکوباتور|فسیلیتیتور|هم‌بنیان|فاندر/i],
  ['life', /housing|rent|school|child|spouse|family|health|insurance|bank account|cost of living|tax return|newcomer|language|daily life|مسکن|اجاره|خانه|مدرسه|فرزند|همسر|خانواده|درمان|بیمه|حساب بانکی|هزینه‌ی زندگی|هزینه زندگی|زبان|زندگی/i],
  ['work', /work|job|skilled|express entry|lmia|career|employ|credential|niw|eb-?[12]|h-?1b|o-1|blue card|کار|شغل|متخصص|اکسپرس|استخدام|ارزیابی مدرک/i],
];

/** Read a pillar off a title or keyword. Defaults to work, the widest pillar. */
export function classifyPillar(text: string): Pillar {
  return PILLAR_PATTERNS.find(([, re]) => re.test(text))?.[0] ?? 'work';
}

export const isPillar = (v: unknown): v is Pillar => typeof v === 'string' && (PILLARS as readonly string[]).includes(v);

/** An article's pillar: its own `[pillar:x]` tag when it has one, a classification when it predates them. */
export function pillarOf(article: { title: string; topicSeed?: string | null }): Pillar {
  const tagged = /\[pillar:([a-z]+)\]/.exec(article.topicSeed ?? '')?.[1];
  return isPillar(tagged) ? tagged : classifyPillar(article.title);
}

/** `[pillar:x] `, in the same shape as the other topicSeed tags. */
export function pillarTag(p: Pillar): string {
  return `[pillar:${p}] `;
}

/** How many of the newest articles the quota is measured over. */
export const PILLAR_WINDOW = 20;

/**
 * The planned pillar furthest below its share over the last PILLAR_WINDOW
 * articles (`recent` newest first). News counts toward the window — it is a
 * real share of what readers see — but is never returned: the planned lanes
 * do not write it. Ties go to the order of PLANNED_PILLARS.
 */
export function pillarForToday(recent: Pillar[]): Pillar {
  const window = recent.slice(0, PILLAR_WINDOW);
  const size = Math.max(window.length, 1);
  const deficit = (p: Pillar) => PILLAR_SHARE[p] / 100 - window.filter((r) => r === p).length / size;
  return [...PLANNED_PILLARS].sort((a, b) => deficit(b) - deficit(a))[0];
}
