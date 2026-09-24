// ============================================================================
// lib/autopilot/diversity.ts
// Variety, enforced by the code that picks topics rather than hoped for from
// the list it picks from.
//
// WHY THIS EXISTS
// On 14 Sep 2026 Farjad pointed out that the Persian blog had published
// nothing but startup-visa pieces, one after another — and he had asked for a
// lot of variety. The cause was measurable: the Persian backlog held 14
// topics and 11 of their titles were "startup visa + something". The
// dedupe was working (after the 9 Sep fix every title was distinct); it was
// simply walking through a pool that had one subject in it. No amount of
// deduplication makes a one-subject pool varied.
//
// So variety is now a property of the SELECTION. Every topic carries a
// subject family and a destination; the picker refuses to repeat either back
// to back, prefers whatever has gone longest unwritten, and will not run two
// "startup visa"-headlined pieces in a row. The same constraints are handed
// to the model planner as explicit instructions, and briefs that ignore them
// are dropped rather than published.
//
// It deliberately does not ban the startup-visa subject. That IS the business
// — the site mentors teams through startup-visa routes, and Farjad named
// those queries as priorities on 6 Sep. The complaint was monotony, not the
// subject: a reader should meet the startup-visa piece between an article on
// housing in Helsinki and one on splitting equity with a co-founder.
// ============================================================================

export const FAMILIES = [
  'route-decision',
  'route-mechanics',
  'life-in-destination',
  'founder-craft',
  'money-and-tax',
  'iranian-practicalities',
  'career-and-work',
  'ecosystem-and-market',
] as const;
export type Family = (typeof FAMILIES)[number];

/** What each family is for, in words the planner model is shown. */
export const FAMILY_BRIEF: Record<Family, string> = {
  'route-decision': 'choosing between routes or countries — a comparison or a decision guide',
  'route-mechanics': "one route's requirements, steps, documents or timeline",
  'life-in-destination': 'living there — housing, schools, healthcare, language, climate, cost of living, community',
  'founder-craft': 'building the company itself — validating an idea, an MVP, pitching, co-founders, equity, incorporation, first hires',
  'money-and-tax': 'money — proof of funds, banking, taxes for founders, what the route really costs, raising a first round',
  'iranian-practicalities': 'what is specific to an Iranian applicant — sanctions and banking, translation, military service, passports, where to submit',
  'career-and-work': 'work — permits, skilled-worker routes, the job market, getting credentials recognised',
  'ecosystem-and-market': "the destination's startup scene — sectors that fund, investors, incubators, events, the market for a product",
};

export const DESTINATIONS = ['denmark', 'netherlands', 'finland', 'estonia', 'italy', 'canada', 'usa', 'australia', 'turkiye', 'general'] as const;
export type Destination = (typeof DESTINATIONS)[number];

export type Tagged = { family: Family; destination: Destination; startupVisaHeadline: boolean };

// ---------------------------------------------------------------------------
// Classification, for articles written before topics carried tags
// ---------------------------------------------------------------------------
const DEST_PATTERNS: [Destination, RegExp][] = [
  ['denmark', /denmark|danish|copenhagen|دانمارک|کپنهاگ/i],
  ['netherlands', /netherlands|dutch|holland|amsterdam|هلند|آمستردام/i],
  ['finland', /finland|finnish|helsinki|فنلاند|هلسینکی/i],
  ['estonia', /estonia|tallinn|استونی|تالین/i],
  // Rome is left out on purpose: رم is a two-letter Persian word that appears
  // inside ordinary text, and the Latin 'rome' is a substring of nothing here
  // but would still be a loose match. The cities that identify the route are
  // Milan, Turin and Florence, which is where the ecosystem actually is.
  ['italy', /italy|italian|italia|milan|turin|florence|bologna|ایتالیا|ایتالیایی|میلان|تورین|فلورانس/i],
  ['canada', /canada|canadian|ontario|alberta|british columbia|\bbc\b|quebec|toronto|vancouver|pgwp|express entry|\bpnp\b|کانادا|انتاریو|آلبرتا|بریتیش|کبک|تورنتو|ونکوور|اکسپرس انتری|نیوبرانزویک|نوااسکوشیا/i],
  ['usa', /\busa\b|united states|america|\bniw\b|eb-?1|eb-?2|uscis|آمریکا|ایالات متحده/i],
  ['australia', /australia|sydney|melbourne|استرالیا|سیدنی|ملبورن/i],
  ['turkiye', /turkey|türkiye|turkiye|istanbul|ترکیه|استانبول/i],
];

/** Checked in order; the first family whose pattern matches wins. */
const FAMILY_PATTERNS: [Family, RegExp][] = [
  ['iranian-practicalities', /iran|sanction|translat|military service|passport|biometric|ایران|تحریم|ترجمه|سربازی|پایان خدمت|گذرنامه|پاسپورت|بیومتریک/i],
  ['money-and-tax', /fund|bank|tax|cost|price|fee|budget|invest(or|ment)? money|تمکن|بانک|مالیات|هزینه|بودجه|پول/i],
  ['route-decision', /\bvs\.?\b|versus|compar|choos|which (route|country|path)|or .* for|مقایسه|یا |انتخاب|کدام|بهتر است/i],
  ['life-in-destination', /housing|rent|school|health|language|cost of living|climate|family life|daily life|مسکن|اجاره|مدرسه|درمان|زبان|زندگی|آب و هوا/i],
  ['founder-craft', /mvp|pitch|co-?founder|equity|cap table|incorporat|validat|business plan|hire|بنیان‌گذار|هم‌بنیان|سهام|پیچ|ارائه به|ثبت شرکت|طرح کسب|اعتبارسنجی|استخدام/i],
  ['ecosystem-and-market', /ecosystem|incubator|accelerator|investor|startup scene|sector|market for|شتاب‌دهنده|انکوباتور|سرمایه‌گذار|اکوسیستم|بازار/i],
  ['career-and-work', /work permit|job|career|skilled|employ|credential|recogni[sz]|مجوز کار|شغل|کار |استخدام در|مدرک تحصیلی|ارزیابی مدرک/i],
  ['route-mechanics', /.*/],
];

// "Start-up Permit" is Finland's name for the same thing, hyphen and all.
const STARTUP_VISA = /start-?up\s*(visa|permit)|ویزای\s*استارتاپ|استارتاپ\s*ویزا/i;

export function classify(text: string): Tagged {
  const destination = (DEST_PATTERNS.find(([, re]) => re.test(text))?.[0] ?? 'general') as Destination;
  const family = (FAMILY_PATTERNS.find(([, re]) => re.test(text))?.[0] ?? 'route-mechanics') as Family;
  return { family, destination, startupVisaHeadline: STARTUP_VISA.test(text) };
}

export const isFamily = (v: unknown): v is Family => typeof v === 'string' && (FAMILIES as readonly string[]).includes(v);
export const isDestination = (v: unknown): v is Destination => typeof v === 'string' && (DESTINATIONS as readonly string[]).includes(v);

/** `[family:x] [dest:y]` in an article's topicSeed, the same shape as `[topic:]` and `[kw:]`. */
export function seedTags(t: Pick<Tagged, 'family' | 'destination'>): string {
  return `[family:${t.family}] [dest:${t.destination}] `;
}

/** Read an article back into tags: its own tags when it has them, a classification when it predates them. */
export function tagsOf(article: { title: string; topicSeed?: string | null }): Tagged {
  const seed = article.topicSeed ?? '';
  const guessed = classify(`${article.title} ${seed}`);
  const family = /\[family:([a-z-]+)\]/.exec(seed)?.[1];
  const destination = /\[dest:([a-z]+)\]/.exec(seed)?.[1];
  return {
    family: isFamily(family) ? family : guessed.family,
    destination: isDestination(destination) ? destination : guessed.destination,
    startupVisaHeadline: STARTUP_VISA.test(article.title),
  };
}

// ---------------------------------------------------------------------------
// The rules
// ---------------------------------------------------------------------------
/** How many of the newest articles a family or destination must stay out of. */
export const FAMILY_COOLDOWN = 2;
export const DESTINATION_COOLDOWN = 1;
/**
 * A startup-visa headline must stay out of this many newest articles: at most
 * one in every three. "Not two in a row" was the first version, and a
 * reproduction against real data showed it still let half the days be
 * startup visa while those topics remained. That is the brand's core subject
 * and Farjad named its queries as priorities, so it is capped, not banned.
 */
export const STARTUP_VISA_COOLDOWN = 2;

export type DiversityPlan = {
  avoidFamilies: Family[];
  avoidDestinations: Destination[];
  /** Least recently used first. */
  preferFamilies: Family[];
  preferDestinations: Destination[];
  /** One of the newest articles carried a startup-visa headline, so the next one must not. */
  avoidStartupVisaHeadline: boolean;
};

/** `recent` newest first. */
export function planDiversity(recent: Tagged[]): DiversityPlan {
  const lastIndex = <T extends string>(all: readonly T[], pick: (t: Tagged) => T) =>
    all
      .map((v) => {
        const i = recent.findIndex((r) => pick(r) === v);
        return { v, i: i === -1 ? Number.POSITIVE_INFINITY : i };
      })
      .sort((a, b) => b.i - a.i)
      .map((x) => x.v);

  return {
    avoidFamilies: [...new Set(recent.slice(0, FAMILY_COOLDOWN).map((r) => r.family))],
    // `general` is not a place, so it never needs a cooldown.
    avoidDestinations: [...new Set(recent.slice(0, DESTINATION_COOLDOWN).map((r) => r.destination))].filter((d) => d !== 'general'),
    preferFamilies: lastIndex(FAMILIES, (r) => r.family),
    preferDestinations: lastIndex(DESTINATIONS, (r) => r.destination).filter((d) => d !== 'general'),
    avoidStartupVisaHeadline: recent.slice(0, STARTUP_VISA_COOLDOWN).some((r) => r.startupVisaHeadline),
  };
}

/**
 * Order candidates so the most varied choice comes first, then take `n`.
 *
 * It is an ordering, not a filter: when nothing satisfies every rule it still
 * returns the least-bad candidates, because a day with a slightly repetitive
 * article beats a day with none, which is how the Persian lane once went
 * silent while looking healthy. The rules decide the order; they never empty
 * the list.
 *
 * Within one batch, each pick becomes the most recent article for the next
 * pick, so a two-article day cannot be two pieces from the same family.
 */
export function pickDiverse<T extends Tagged>(candidates: T[], recent: Tagged[], n: number): T[] {
  const pool = [...candidates];
  const chosen: T[] = [];
  let history = [...recent];

  while (chosen.length < n && pool.length) {
    const plan = planDiversity(history);
    // How many articles ago a family or destination last appeared; never is
    // the whole history. Measured from the history itself, not from the
    // position in a preference list, because on an empty site every family is
    // equally unused and must tie. Ordering them by where they sit in FAMILIES
    // would let an arbitrary array order override the backlog's hand-set
    // priority, which is exactly what a test caught.
    const age = (pick: (r: Tagged) => string, value: string) => {
      const i = history.findIndex((r) => pick(r) === value);
      return Math.min(i === -1 ? history.length : i, 10);
    };
    const rank = (t: T) => {
      let score = 0;
      if (plan.avoidFamilies.includes(t.family)) score -= 100;
      if (plan.avoidDestinations.includes(t.destination)) score -= 60;
      if (plan.avoidStartupVisaHeadline && t.startupVisaHeadline) score -= 80;
      score += age((r) => r.family, t.family) * 3;
      if (t.destination !== 'general') score += age((r) => r.destination, t.destination) * 2;
      return score;
    };
    // Stable: equal scores keep the backlog's own order, so a hand-set
    // priority still wins a tie.
    const best = pool.map((t, i) => ({ t, i, s: rank(t) })).sort((a, b) => b.s - a.s || a.i - b.i)[0];
    chosen.push(best.t);
    pool.splice(best.i, 1);
    history = [best.t, ...history];
  }
  return chosen;
}

/**
 * The same rules, as instructions for the model planner. Paired with
 * `violates`, which throws out a brief that ignored them.
 */
export function diversityPrompt(plan: DiversityPlan): string {
  const lines = [
    'VARIETY — this is a hard requirement, not a style note. The site must not publish the same kind of article twice running.',
    `Each brief must set "family" to one of: ${FAMILIES.map((f) => `${f} (${FAMILY_BRIEF[f]})`).join('; ')}.`,
    `Each brief must set "destination" to one of: ${DESTINATIONS.join(', ')} ("general" when it is not about one country).`,
  ];
  if (plan.avoidFamilies.length) lines.push(`Do NOT use these families today — the last articles were: ${plan.avoidFamilies.join(', ')}.`);
  if (plan.avoidDestinations.length) lines.push(`Do NOT make any brief about: ${plan.avoidDestinations.join(', ')} — the last article was.`);
  lines.push(`Prefer, in this order, the families that have gone longest unwritten: ${plan.preferFamilies.filter((f) => !plan.avoidFamilies.includes(f)).slice(0, 4).join(', ')}.`);
  lines.push(`Prefer these destinations: ${plan.preferDestinations.filter((d) => !plan.avoidDestinations.includes(d)).slice(0, 4).join(', ')}.`);
  if (plan.avoidStartupVisaHeadline) lines.push(`One of the last ${STARTUP_VISA_COOLDOWN} articles was headlined on "startup visa". Today\'s working titles must NOT contain "startup visa" / «ویزای استارتاپ» / «استارتاپ ویزا».`);
  lines.push('No two briefs in today\'s batch may share a family or a destination.');
  return lines.join('\n');
}

/** Why a planned brief breaks the plan, or null. */
export function violates(brief: Tagged, plan: DiversityPlan): string | null {
  if (plan.avoidFamilies.includes(brief.family)) return `family ${brief.family} was used in the last ${FAMILY_COOLDOWN} articles`;
  if (plan.avoidDestinations.includes(brief.destination)) return `destination ${brief.destination} was the last article's`;
  if (plan.avoidStartupVisaHeadline && brief.startupVisaHeadline) return `a startup-visa headline within ${STARTUP_VISA_COOLDOWN} articles of the last one`;
  return null;
}
