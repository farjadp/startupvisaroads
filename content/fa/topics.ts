// ============================================================================
// content/fa/topics.ts
// The Persian guide lane's topic backlog.
//
// WHY THIS EXISTS
// Left to itself the planner invents topics from the site's own pages, which
// produces competent articles about whatever the site already covers — in
// practice, Canada. The Persian magazine only earns its place by answering
// questions an Iranian founder actually types, several of which have no
// English equivalent at all and which no English article on this site will
// ever cover: moving money under sanctions, where the interview happens when
// there is no embassy, what a "مؤسسه مهاجرتی" is really selling.
//
// So a human picks the query, the audience and the pages each piece must link
// to, and the model writes to that brief instead of choosing it. Every field
// here maps onto the planner's Brief type unchanged.
//
// Each topic states its `audience` for the same reason: a brief that cannot
// say who it is for produces prose for nobody.
// ============================================================================
import type { Brief } from '@/lib/autopilot/planner';

export type FaTopic = Brief & {
  /** Stable id, so a topic can be tracked across runs. */
  slug: string;
  /** Who this is written for. Documentation of intent, never rendered. */
  audience: string;
};

export const FA_TOPICS: FaTopic[] = [
  {
    slug: 'funds-under-sanctions',
    category: 'European Visas',
    workingTitle: 'اثبات تمکن مالی برای ویزای استارتاپ وقتی حساب ایرانی دارید',
    angle:
      'The settlement-funds requirement is published by each authority and is not negotiable; what is specific to an Iranian applicant is evidencing it. Explain what Denmark and Finland actually ask for as proof, cite each authority for the figure, and then treat the Iranian side — which account, in whose name, how long it must have been held, why a sudden deposit reads badly — as practical guidance rather than as a claim about the programme. Say plainly where we cannot advise: we do not move money and do not advise on sanctions compliance.',
    whyNow:
      'It is the first question every Iranian founder asks and the one most likely to end an application before it starts.',
    primaryKeyword: 'اثبات تمکن مالی ویزای استارتاپ',
    secondaryKeywords: ['تمکن مالی دانمارک', 'تمکن مالی فنلاند', 'انتقال وجه از ایران', 'حساب بانکی برای مهاجرت'],
    searchQueryEn: 'proof of funds startup visa Denmark Finland requirement',
    mustLink: ['/europe/denmark', '/europe/finland', '/mentorship'],
    imageScenes: [
      'A closed bank passbook on a bare wooden desk beside a cold cup of tea, flat overcast daylight',
      'An empty glass-fronted bank counter photographed from the queue side, no signage legible',
    ],
    depth: 'deep',
    audience: 'An Iranian founder with savings inside Iran who has read the funds requirement and cannot see how to evidence it.',
  },
  {
    slug: 'where-to-interview',
    category: 'Global Talent & Compliance',
    workingTitle: 'کجا باید بیومتریک و مدارک ویزای استارتاپ را ارائه کنید؟',
    angle:
      'Iranian applicants cannot submit in Tehran for most of these routes, so the practical route runs through Dubai, Yerevan, Ankara or Tbilisi. Lay out what determines the choice — appointment availability, the transit visa the city itself needs, cost, and how long the file waits — without stating any appointment rule as though it came from the authority unless it is cited. Every programme claim links to the authority; everything else is described as what applicants report.',
    whyNow:
      'Founders pick a programme first and discover the submission problem afterwards, when the plan is already built around it.',
    primaryKeyword: 'مصاحبه و بیومتریک ویزای استارتاپ برای ایرانیان',
    secondaryKeywords: ['سفارت دانمارک برای ایرانیان', 'ویزای استارتاپ از دبی', 'بیومتریک ایروان', 'ارائه مدارک آنکارا'],
    searchQueryEn: 'biometrics appointment Iranian applicants Dubai Yerevan Ankara Tbilisi',
    mustLink: ['/europe/netherlands', '/europe/estonia', '/which-path'],
    imageScenes: [
      'An airport departure hall seating row at dawn, empty, one dark holdall on a seat',
      'A plain waiting-room corridor with numbered doors and a row of empty chairs, even light',
    ],
    depth: 'standard',
    audience: 'A founder inside Iran who has chosen a route and now has to work out, physically, where the file gets submitted.',
  },
  {
    slug: 'mentorship-vs-agency',
    category: 'Mentorship & Business Planning',
    workingTitle: 'تفاوت منتورشیپ استارتاپ با «مؤسسه مهاجرتی» در چیست؟',
    angle:
      'Name the difference in terms of what is actually sold: an agency sells a filing, a mentor prepares the business the evaluating body reads. Give the reader concrete tests they can apply to anyone selling them a service — a guaranteed outcome, a success rate, a promise about processing time, a fee tied to approval rather than work. Be explicit that we are not immigration lawyers and do not file applications, because a piece about trust that is vague about its own author is worthless.',
    whyNow:
      'The Persian-language market for this is full of guarantees that nobody can make, and the reader has no way to tell the difference.',
    primaryKeyword: 'مؤسسه مهاجرتی یا منتور استارتاپ',
    secondaryKeywords: ['کلاهبرداری مهاجرتی', 'وکیل مهاجرت استارتاپ ویزا', 'تضمین اقامت', 'انتخاب مشاور مهاجرت'],
    searchQueryEn: 'immigration agency vs startup mentor difference what to check',
    mustLink: ['/mentorship', '/canada-startup-visa', '/about'],
    imageScenes: [
      'Two plain chairs facing each other across a bare oak table by a tall window, a closed notebook between them',
      'A blank contract page and an uncapped pen on a desk, nothing legible, soft side light',
    ],
    depth: 'standard',
    audience: 'A founder deciding who to pay, who has heard three different guarantees from three different offices.',
  },
  {
    slug: 'iranian-documents',
    category: 'Global Talent & Compliance',
    workingTitle: 'مدارک ایرانی برای پرونده‌ی استارتاپ ویزا: چه چیزی لازم است؟',
    angle:
      'Walk the document set an Iranian file actually needs — certified translation, education verification, the company registration notice in روزنامه رسمی for a founder who already has a company — and the order to do them in, because several expire and several depend on each other. Tie each requirement to the authority that asks for it and cite it; where the requirement is Iranian-side procedure rather than the programme, say so.',
    whyNow:
      'Document preparation is the longest lead time in the whole process and the part founders start last.',
    primaryKeyword: 'ترجمه رسمی مدارک برای ویزای استارتاپ',
    secondaryKeywords: ['تأییدیه تحصیلی', 'روزنامه رسمی شرکت', 'مدارک شرکت برای مهاجرت', 'دارالترجمه رسمی'],
    searchQueryEn: 'certified translation education verification documents startup visa application',
    mustLink: ['/europe/finland', '/pnp/new-brunswick', '/faq'],
    imageScenes: [
      'A stack of stapled paper documents squared on a desk edge, an embossing seal beside them, no text readable',
      'A flat file drawer half open showing tabbed dividers, cool even light',
    ],
    depth: 'standard',
    audience: 'A founder who has been accepted in principle and now has six weeks of paperwork nobody warned them about.',
  },
  {
    slug: 'denmark-or-finland',
    category: 'European Visas',
    workingTitle: 'ویزای استارتاپ دانمارک یا فنلاند؟ مقایسه برای تیم ایرانی',
    angle:
      'A side-by-side for a founder choosing between the two routes the site leads with. Compare on the axes that actually decide it: whether you have a co-founder at all (Finland requires two, Denmark accepts one), who evaluates and how long they take, the settlement funds per founder, and what the permit converts into. Every figure carries its authority. End by pointing at the assessment rather than asserting which route is better, because that depends on facts the article does not have.',
    whyNow:
      'These are the two routes the site now leads with, and the choice between them is the most common question after the Canada programme closed.',
    primaryKeyword: 'ویزای استارتاپ دانمارک یا فنلاند',
    secondaryKeywords: ['مقایسه ویزای استارتاپ اروپا', 'استارتاپ ویزا فنلاند شرایط', 'استارتاپ ویزا دانمارک هزینه', 'بهترین کشور استارتاپ ویزا'],
    searchQueryEn: 'Denmark vs Finland startup visa comparison founders requirements',
    mustLink: ['/europe/denmark', '/europe/finland', '/which-path'],
    imageScenes: [
      'A fork in a wet cobbled street between two plain brick facades, overcast northern light',
      'Two identical empty desks side by side in a bare room, one window between them',
    ],
    depth: 'standard',
    audience: 'A founder who has narrowed it to two European routes and needs the axes that actually separate them.',
  },
  // ── Second batch, 6 Sep 2026 ────────────────────────────────────────────
  // Written against the keyword set Farjad named as the ones that matter, and
  // their combinations. Each targets one query rather than several, because a
  // page that chases «استارتاپ ویزا» and «مهاجرت به کانادا» at once ranks for
  // neither.
  {
    slug: 'what-is-startup-visa',
    category: 'European Visas',
    workingTitle: 'ویزای استارتاپ چیست و کدام کشورها هنوز آن را می‌دهند؟',
    angle:
      'The pillar for the bare query. Define what a startup visa is and what separates it from an investment or skilled-worker route: a body evaluates the business, not the applicant\'s savings alone. Then the five routes that are actually open — Denmark, the Netherlands, Finland, Estonia, and entrepreneur streams in Atlantic Canada — with one line each on who evaluates and what they want. Say plainly that the Canadian Start-up Visa is closed to new applications, because a reader arriving on this query in Persian usually believes it is open. Every programme claim cites its authority.',
    whyNow: 'It is the broadest Persian query on the subject and the site has no page written for it.',
    primaryKeyword: 'ویزای استارتاپ',
    secondaryKeywords: ['استارتاپ ویزا', 'ویزای استارتاپ چیست', 'کشورهای دارای ویزای استارتاپ', 'شرایط ویزای استارتاپ'],
    searchQueryEn: 'what is a startup visa which countries offer it',
    mustLink: ['/europe/finland', '/europe/denmark', '/which-path'],
    imageScenes: [
      'A row of five plain wooden doors along a bare corridor, even daylight, none of them marked',
      'An empty departures board frame in a quiet hall, the panels blank, cool light',
    ],
    depth: 'deep',
    audience: 'Someone at the very start, who has heard the term and does not yet know it is several different programmes.',
  },
  {
    slug: 'canada-startup-visa-status',
    category: 'Canada Startup Visa',
    workingTitle: 'استارتاپ ویزای کانادا در ۲۰۲۶: چه چیزی بسته شد و چه ماند؟',
    angle:
      'The highest-intent Persian query on this site, and the one where being wrong costs the reader the most: most people searching it believe the programme is open. State the closure and its dates, describe the announced high-impact pilot without implying a date nobody has published, and route the reader to what is actually open. Do not soften it — a reader who leaves this page still planning around the old programme has been failed.',
    whyNow: 'People are still searching it monthly and still being sold preparation for a programme that stopped taking applications.',
    primaryKeyword: 'استارتاپ ویزای کانادا',
    secondaryKeywords: ['ویزای استارتاپ کانادا', 'مهاجرت به کانادا', 'استارتاپ ویزا کانادا ۲۰۲۶', 'برنامه پایلوت کانادا'],
    searchQueryEn: 'Canada start-up visa 2026 closed status pilot',
    mustLink: ['/canada-startup-visa', '/pnp/new-brunswick', '/which-path'],
    imageScenes: [
      'A closed corrugated steel shutter on a concrete threshold, flat grey light',
      'A single empty chair facing a bare counter in a plain office, no signage',
    ],
    depth: 'standard',
    audience: 'A founder who has been preparing for the Canadian route and does not know it closed.',
  },
  {
    slug: 'canada-entrepreneur-after-suv',
    category: 'Canada PNP',
    workingTitle: 'مهاجرت کارآفرینی به کانادا وقتی استارتاپ ویزا بسته است',
    angle:
      'The route that survives: provincial entrepreneur streams, New Brunswick and Nova Scotia specifically. Set out what they ask that the startup visa did not — net worth, an investment, a language band, an age range, living in the province — and be honest that this is a different kind of programme aimed at a different kind of applicant, not a substitute. Cite each province for its own figures.',
    whyNow: 'It is the first question every reader of the closure article asks next.',
    primaryKeyword: 'مهاجرت به کانادا از راه کارآفرینی',
    secondaryKeywords: ['کارآفرینی', 'مهاجرت به کانادا', 'برنامه استانی کانادا', 'نیوبرانزویک کارآفرینی'],
    searchQueryEn: 'Canada entrepreneur immigration provincial streams New Brunswick Nova Scotia',
    mustLink: ['/pnp', '/pnp/new-brunswick', '/pnp/nova-scotia'],
    imageScenes: [
      'A red-brick harbour warehouse doorway in morning fog, a dark coat on a hook inside',
      'A wide empty small-town main street under overcast sky, shopfronts closed',
    ],
    depth: 'standard',
    audience: 'A founder with capital who has just learned the startup visa is closed to them.',
  },
  {
    slug: 'netherlands-facilitator',
    category: 'European Visas',
    workingTitle: 'استارتاپ ویزای هلند: فسیلیتیتور چه کسی است و چرا تعیین‌کننده است؟',
    angle:
      'The Dutch route turns on one decision the other routes do not have: a signed agreement with an RVO-approved facilitator, who then stands behind the business for a year. Explain what a facilitator does, what RVO checks, what the permit converts into after twelve months, and how to judge one before signing — because choosing badly is the single most expensive mistake available on this route. Cite RVO and IND for anything about the programme itself.',
    whyNow: 'The Netherlands is one of the four routes the site leads with and has no Persian article of its own.',
    primaryKeyword: 'استارتاپ ویزای هلند',
    secondaryKeywords: ['ویزای استارتاپ هلند', 'فسیلیتیتور هلند', 'RVO', 'مهاجرت به هلند'],
    searchQueryEn: 'Netherlands startup visa facilitator RVO requirements',
    mustLink: ['/europe/netherlands', '/mentorship', '/which-path'],
    imageScenes: [
      'A narrow brick warehouse doorway with a matte black steel door beside still canal water',
      'Two chairs at a bare table by a tall window, a closed folder between them',
    ],
    depth: 'standard',
    audience: 'A founder comparing European routes who keeps seeing the word "facilitator" and does not know what it commits them to.',
  },
  {
    slug: 'estonia-mvp',
    category: 'European Visas',
    workingTitle: 'استارتاپ ویزای استونی: چرا بدون MVP پرونده رد می‌شود؟',
    angle:
      'Estonia is the fastest decision in Europe and the strictest about one thing: there has to be a product. Explain what the Startup Committee looks at, why an idea on paper does not pass, what the D-visa and the residence permit each give, and the monthly funds. Be clear that speed is not looseness — the committee refuses quickly too. Cite Startup Estonia.',
    whyNow: 'Estonia is the cheapest and quickest route the site covers, and the one most often misunderstood as the easiest.',
    primaryKeyword: 'استارتاپ ویزای استونی',
    secondaryKeywords: ['ویزای استارتاپ استونی', 'مهاجرت به استونی', 'Startup Committee', 'MVP برای ویزای استارتاپ'],
    searchQueryEn: 'Estonia startup visa MVP requirement startup committee',
    mustLink: ['/europe/estonia', '/which-path', '/mentorship'],
    imageScenes: [
      'A limestone city wall corner meeting a plate-glass facade, cool flat light',
      'A plain workbench with a partly assembled device under an angled lamp, nothing legible',
    ],
    depth: 'standard',
    audience: 'A solo founder with a working prototype looking for the fastest route into Europe.',
  },
  {
    slug: 'move-to-finland',
    category: 'European Visas',
    workingTitle: 'مهاجرت به فنلاند از راه استارتاپ: از ایده تا اقامت دائم',
    angle:
      'Written for the broader query rather than the permit alone: what the whole path looks like, from the Business Finland eligibility statement through the residence permit to permanent residence and eventually citizenship, with the honest gaps — the two-founder requirement that stops solo applicants, the monthly funds per founder, the language question that arrives later. Cite Migri and Business Finland separately, because they decide different things.',
    whyNow: 'Finland leads the site and the Persian search is for the country, not for the permit\'s name.',
    primaryKeyword: 'مهاجرت به فنلاند',
    secondaryKeywords: ['استارتاپ ویزای فنلاند', 'ویزای استارتاپ فنلاند', 'اقامت دائم فنلاند', 'Business Finland'],
    searchQueryEn: 'move to Finland startup permit path to permanent residence',
    mustLink: ['/europe/finland', '/which-path', '/mentorship'],
    imageScenes: [
      'A weathered timber dock reaching into still grey water, birch at the frame edge',
      'An empty tram shelter in soft snow light, steel and glass, nothing legible',
    ],
    depth: 'standard',
    audience: 'Someone who has decided on the country before the programme and needs the whole arc.',
  },
  {
    slug: 'move-to-denmark',
    category: 'European Visas',
    workingTitle: 'مهاجرت به دانمارک با استارتاپ ویزا: مسیر و هزینه‌ی واقعی',
    angle:
      'The country-level query for Denmark. The expert panel and what it reads, the one-founder allowance that separates Denmark from Finland, the first-year funds, the permit length and renewal, and what living costs actually look like against them. Cite nyidanmark and the Danish Business Authority for the programme; mark anything about cost of living as an estimate rather than a rule.',
    whyNow: 'Denmark accepts a single founder, which makes it the realistic European route for a solo applicant, and the Persian search is for the country.',
    primaryKeyword: 'مهاجرت به دانمارک',
    secondaryKeywords: ['استارتاپ ویزای دانمارک', 'ویزای استارتاپ دانمارک', 'Start-up Denmark', 'هزینه زندگی دانمارک'],
    searchQueryEn: 'move to Denmark startup visa expert panel cost',
    mustLink: ['/europe/denmark', '/which-path', '/mentorship'],
    imageScenes: [
      'A dark timber harbour building wall with one small mooring cleat, overcast',
      'A bicycle leaning against a pale brick wall on wet cobblestones',
    ],
    depth: 'standard',
    audience: 'A solo founder who cannot meet Finland\'s two-founder rule and is looking at Denmark instead.',
  },
  {
    slug: 'move-to-usa-niw',
    category: 'USA Business & Talent',
    workingTitle: 'مهاجرت به آمریکا برای بنیان‌گذاران: EB-2 NIW چه می‌خواهد؟',
    angle:
      'The US query, answered without pretending the obstacles are not there. What a national interest waiver actually asks for in evidence, why it suits researchers and technical founders more than early-stage product ideas, and — stated plainly, not buried — the entry restrictions that apply to Iranian nationals and the three scenarios by where the applicant currently lives. Cite USCIS for the programme. This paragraph in particular must be re-checked against current policy at every review.',
    whyNow: 'It is one of the most searched Persian immigration queries and the one where a stale claim does the most damage.',
    primaryKeyword: 'مهاجرت به آمریکا',
    secondaryKeywords: ['EB-2 NIW', 'ویزای آمریکا برای بنیان‌گذار', 'مهاجرت کاری آمریکا', 'اقامت آمریکا از راه استعداد'],
    searchQueryEn: 'EB-2 NIW national interest waiver founders evidence requirements',
    mustLink: ['/usa-eb2-niw', '/which-path', '/mentorship'],
    imageScenes: [
      'A laboratory glass door slightly ajar, matte aluminium frame, cool even light',
      'A university corridor with tall windows and a polished concrete floor, empty',
    ],
    depth: 'standard',
    audience: 'A researcher or technical founder weighing the US against Europe.',
  },
  {
    slug: 'what-a-startup-visa-mentor-does',
    category: 'Mentorship & Business Planning',
    workingTitle: 'منتور استارتاپ ویزا دقیقاً چه کاری برای شما انجام می‌دهد؟',
    angle:
      'Not a comparison against agencies — that piece exists — but a plain account of the work. What an evaluating body actually reads: the business plan, the financial model, the pitch deck, the interview. What each of those has to contain to survive a panel, in what order they get built, and how long it honestly takes. Bound every claim about the programme to its authority, and every claim about our own work to BRAND_FACTS. Say what a mentor cannot do: file the application, guarantee an outcome, or move money.',
    whyNow:
      'The phrase is searched by people who have already decided they need help and are trying to work out what they are buying.',
    primaryKeyword: 'منتور استارتاپ ویزا',
    secondaryKeywords: ['مشاور استارتاپ ویزا', 'بیزینس پلن برای ویزای استارتاپ', 'آمادگی مصاحبه استارتاپ ویزا', 'پیچ دک مهاجرت'],
    searchQueryEn: 'startup visa mentor what they do business plan pitch deck',
    mustLink: ['/mentorship', '/europe/denmark', '/which-path'],
    imageScenes: [
      'A whiteboard wiped clean with faint ghost marks and a single marker on the tray',
      'A bare oak desk with a closed laptop and one printed document squared beside it',
    ],
    depth: 'standard',
    audience: 'A founder who has decided to get help and wants to know what the work actually is before paying for it.',
  },
];

/** Strip the backlog-only fields so the writer receives a plain Brief. */
export function topicToBrief(topic: FaTopic): Brief {
  const { slug: _slug, audience: _audience, ...brief } = topic;
  return brief;
}

/**
 * The next `n` topics that have not been written yet.
 *
 * Matching on the working title is deliberately loose: the writer renames the
 * piece, so an exact match would never fire. A title the writer produced that
 * contains the backlog title, or the reverse, counts as covered.
 */
export function pickTopics(n: number, writtenTitles: string[]): FaTopic[] {
  const done = writtenTitles.map((t) => t.trim()).filter(Boolean);
  const covered = (t: FaTopic) =>
    done.some((w) => w.includes(t.workingTitle) || t.workingTitle.includes(w));

  const out: FaTopic[] = [];
  let deepUsed = false;
  for (const t of FA_TOPICS) {
    if (out.length >= n) break;
    if (covered(t)) continue;
    // The planner allows at most one deep guide per run; so does the backlog.
    if (t.depth === 'deep') {
      if (deepUsed) continue;
      deepUsed = true;
    }
    out.push(t);
  }
  return out;
}
