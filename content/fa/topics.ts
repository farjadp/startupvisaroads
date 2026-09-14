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
import { sameSubject } from '@/lib/autopilot/text';
import { classify, pickDiverse, type Destination, type Family, type Tagged } from '@/lib/autopilot/diversity';

export type FaTopic = Brief & {
  /** Stable id, so a topic can be tracked across runs. */
  slug: string;
  /** Who this is written for. Documentation of intent, never rendered. */
  audience: string;
  /**
   * What kind of article this is and where it is about. Required, because the
   * picker cannot keep the blog varied on a topic it cannot place — see
   * lib/autopilot/diversity.ts for why this exists.
   */
  family: Family;
  destination: Destination;
};

export const FA_TOPICS: FaTopic[] = [
  {
    slug: 'funds-under-sanctions',
    family: 'iranian-practicalities',
    destination: 'general',
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
      'An empty bank vestibule with a queue rail and a bare counter edge, flat overcast daylight',
      'A single unmarked steel deposit box door in a plain wall, shallow depth of field',
    ],
    depth: 'deep',
    audience: 'An Iranian founder with savings inside Iran who has read the funds requirement and cannot see how to evidence it.',
  },
  {
    slug: 'where-to-interview',
    family: 'iranian-practicalities',
    destination: 'general',
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
    family: 'route-decision',
    destination: 'general',
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
      'Two plain chairs facing each other across a bare oak table by a tall window, nothing on the table',
      'A blank contract page and an uncapped pen on a desk, nothing legible, soft side light',
    ],
    depth: 'standard',
    audience: 'A founder deciding who to pay, who has heard three different guarantees from three different offices.',
  },
  {
    slug: 'iranian-documents',
    family: 'iranian-practicalities',
    destination: 'general',
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
      'A brass embossing seal on a bare counter, one worn leather satchel beside it',
      'A flat file drawer half open showing tabbed dividers, cool even light',
    ],
    depth: 'standard',
    audience: 'A founder who has been accepted in principle and now has six weeks of paperwork nobody warned them about.',
  },
  {
    slug: 'denmark-or-finland',
    family: 'route-decision',
    destination: 'general',
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
    family: 'route-mechanics',
    destination: 'general',
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
    family: 'route-mechanics',
    destination: 'canada',
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
    family: 'route-decision',
    destination: 'canada',
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
    family: 'route-mechanics',
    destination: 'netherlands',
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
    family: 'founder-craft',
    destination: 'estonia',
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
    family: 'route-mechanics',
    destination: 'finland',
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
    family: 'route-mechanics',
    destination: 'denmark',
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
    family: 'route-mechanics',
    destination: 'usa',
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
    family: 'founder-craft',
    destination: 'general',
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
      'A single dry-erase marker resting on an empty aluminium tray against a plain wall',
      'A bare oak desk with a closed laptop and a single matte ceramic cup, cool overcast light',
    ],
    depth: 'standard',
    audience: 'A founder who has decided to get help and wants to know what the work actually is before paying for it.',
  },
  // ── Added 14 Sep 2026 ──────────────────────────────────────────────────────
  // The backlog above was eleven "startup visa + something" titles out of
  // fourteen, and the Persian blog published exactly that, back to back.
  // These widen it to the rest of a founder's move: living there, building
  // the company, money, work, and the market they are walking into. Every
  // figure-shaped claim is left to the writer to cite from the authority; the
  // angles say what to explain, never what the number is.
  {
    slug: 'housing-helsinki',
    family: 'life-in-destination',
    destination: 'finland',
    category: 'European Visas',
    workingTitle: 'پیدا کردن خانه در هلسینکی برای خانواده‌ی تازه‌وارد',
    angle:
      'The residence permit is the part founders plan for; the flat is the part that decides the first three months. Explain how renting works in the Helsinki region for someone with no Finnish credit history — what landlords ask for, why a deposit and a local reference matter, the difference between the rental market and the city housing queue, and the order to do things in (address, registration, bank). State no rent levels as fact; point to the official and city sources for current figures.',
    whyNow: 'A founder whose permit is approved in autumn arrives into the tightest part of the rental year with no local history to show.',
    primaryKeyword: 'اجاره خانه در هلسینکی',
    secondaryKeywords: ['زندگی در فنلاند', 'مسکن در فنلاند برای مهاجران', 'ثبت آدرس در فنلاند'],
    searchQueryEn: 'how to rent an apartment in Helsinki as a newcomer without credit history',
    mustLink: ['/europe/finland', '/which-path', '/faq'],
    imageScenes: [
      'A bare apartment hallway with a pale wooden floor and a tall window onto snowy rooftops, cool morning light',
      'An empty tram stop beside low apartment blocks on a grey Helsinki afternoon',
    ],
    depth: 'standard',
    audience: 'A founder who has, or expects, a Finnish permit and is bringing a partner and children.',
  },
  {
    slug: 'schools-denmark',
    family: 'life-in-destination',
    destination: 'denmark',
    category: 'European Visas',
    workingTitle: 'مدرسه‌ی فرزندان در دانمارک: ثبت‌نام، زبان و انتخاب مدرسه',
    angle:
      'For a founding family the schooling question arrives before the business does. Explain how a child is placed in a Danish public school, what the choice between a local school, a private school and an international school actually involves, how Danish language support for newcomer children works, and what a parent should prepare before arrival. Cite the municipality and national sources for rules and fees; do not state tuition figures.',
    whyNow: 'Parents usually learn the school timetable after they have already fixed the moving date around the permit.',
    primaryKeyword: 'مدرسه در دانمارک برای فرزندان مهاجر',
    secondaryKeywords: ['زندگی در دانمارک با خانواده', 'مدرسه بین‌المللی دانمارک', 'مهاجرت خانوادگی به دانمارک'],
    searchQueryEn: 'enrolling immigrant children in school in Denmark public or international',
    mustLink: ['/europe/denmark', '/faq', '/which-path'],
    imageScenes: [
      'An empty primary-school classroom with small wooden chairs and tall windows onto a courtyard, soft overcast light',
      'Bicycles parked in a row outside a low brick school building on a quiet weekday morning',
    ],
    depth: 'standard',
    audience: 'An Iranian founder moving to Denmark with school-age children.',
  },
  {
    slug: 'dutch-language',
    family: 'life-in-destination',
    destination: 'netherlands',
    category: 'European Visas',
    workingTitle: 'برای زندگی و کار در هلند چقدر زبان هلندی لازم است؟',
    angle:
      'English gets a founder through the permit and the first customers in the Netherlands; it does not get them through every appointment, lease or school letter. Separate what is genuinely fine in English (much of the startup scene) from where Dutch starts to matter (municipal services, some customers, the path to longer-term residence), and give a realistic plan for learning it alongside running a company. Any language requirement tied to a residence status must be cited to the authority.',
    whyNow: 'The question founders ask in the first week is whether English is enough; the answer changes by the second year.',
    primaryKeyword: 'زبان هلندی برای مهاجرت',
    secondaryKeywords: ['زندگی در هلند', 'کار در هلند با زبان انگلیسی', 'یادگیری زبان هلندی'],
    searchQueryEn: 'do you need to speak Dutch to live and run a startup in the Netherlands',
    mustLink: ['/europe/netherlands', '/which-path', '/mentorship'],
    imageScenes: [
      'A quiet canal-side street with brick facades and bicycles against railings, cool diffuse light',
      'An empty co-working desk by a large window looking onto a canal, grey sky',
    ],
    depth: 'standard',
    audience: 'A founder weighing the Netherlands who speaks English well and no Dutch.',
  },
  {
    slug: 'tallinn-daily-life',
    family: 'life-in-destination',
    destination: 'estonia',
    category: 'European Visas',
    workingTitle: 'زندگی روزمره‌ی بنیان‌گذار در تالین: مسکن، زمستان و جامعه',
    angle:
      'Estonia sells itself on speed and digital government; living there is a different question. Describe daily life for a founder in Tallinn honestly — finding a flat, the length and darkness of winter, how international the community is, what the startup scene looks like week to week, and what families find hardest. Keep it practical and even-handed, with no claim about costs or rules that is not cited.',
    whyNow: 'Estonia is often chosen as the cheap and fast option by people who have never spent a November there.',
    primaryKeyword: 'زندگی در استونی',
    secondaryKeywords: ['زندگی در تالین', 'مهاجرت به استونی', 'جامعه ایرانی استونی'],
    searchQueryEn: 'what is daily life like in Tallinn for a startup founder',
    mustLink: ['/europe/estonia', '/which-path', '/faq'],
    imageScenes: [
      'A cobbled old-town lane in Tallinn at blue hour with snow along the kerbs and no one about',
      'A modern timber-and-glass office building beside a harbour on a cold clear morning',
    ],
    depth: 'standard',
    audience: 'A founder who has shortlisted Estonia mainly for speed and cost.',
  },
  {
    slug: 'atlantic-canada-first-year',
    family: 'life-in-destination',
    destination: 'canada',
    category: 'Canada PNP',
    workingTitle: 'سال اول زندگی در نیوبرانزویک و نوااسکوشیا',
    angle:
      'The Atlantic provincial routes ask an entrepreneur to live and run a business outside the big cities, and that is a daily-life decision before it is an immigration one. Describe the first year in New Brunswick and Nova Scotia — housing outside Halifax and the larger towns, winter and driving, healthcare registration, schooling, and the size of the local market for a new business. Link to our provincial pages for the programme rules; state no figures that are not cited.',
    whyNow: 'With the federal Start-up Visa paused, more founders are looking at provincial entrepreneur routes that tie them to one province.',
    primaryKeyword: 'زندگی در نیوبرانزویک',
    secondaryKeywords: ['زندگی در نوااسکوشیا', 'مهاجرت به کانادای آتلانتیک', 'کارآفرینی در نیوبرانزویک'],
    searchQueryEn: 'what is the first year like living in New Brunswick or Nova Scotia as an immigrant entrepreneur',
    mustLink: ['/pnp/new-brunswick', '/pnp/nova-scotia', '/pnp'],
    imageScenes: [
      'A small harbour town street of clapboard houses under a pale winter sky, empty and still',
      'A snow-dusted two-lane road through pine forest with a single parked car, cold morning light',
    ],
    depth: 'standard',
    audience: 'A founder considering a provincial entrepreneur stream in Atlantic Canada.',
  },
  {
    slug: 'cofounder-equity',
    family: 'founder-craft',
    destination: 'general',
    category: 'Mentorship & Business Planning',
    workingTitle: 'تقسیم سهام میان هم‌بنیان‌گذاران پیش از هر درخواستی',
    angle:
      'Teams that apply together split equity in a hurry, usually evenly, and fall out over it a year later when one person is doing most of the work. Explain how to agree a split that survives: contribution versus title, vesting and a cliff, what happens when someone leaves, and why the agreement has to be written before any application because several startup routes look at who owns and controls the company. Where a programme sets an ownership rule, cite that authority rather than stating it.',
    whyNow: 'A split agreed casually in Tehran becomes a legal and immigration problem once the company exists abroad.',
    primaryKeyword: 'تقسیم سهام هم‌بنیان‌گذاران',
    secondaryKeywords: ['قرارداد هم‌بنیان‌گذار', 'وستینگ سهام استارتاپ', 'سهام تیم استارتاپ'],
    searchQueryEn: 'how should startup cofounders split equity fairly with vesting',
    mustLink: ['/mentorship', '/europe/denmark', '/europe/netherlands'],
    imageScenes: [
      'A long empty meeting table with three chairs pushed back and a laptop closed at one end, cool daylight',
      'Two glasses of water and a closed laptop on a pale wooden desk by a window, cool daylight',
    ],
    depth: 'standard',
    audience: 'A two- or three-person founding team about to apply for a startup route together.',
  },
  {
    slug: 'pitch-for-evaluators',
    family: 'founder-craft',
    destination: 'general',
    category: 'Mentorship & Business Planning',
    workingTitle: 'ارائه به کمیته‌ی ارزیابی اروپایی: چه چیزی را واقعاً می‌خوانند',
    angle:
      'The body that reviews a startup application is not an investor and does not read a deck like one. Explain what an evaluator for a European startup route is actually checking — innovation, a credible team, a market that makes sense for that country, a plausible plan to grow — and how that differs from a fundraising pitch. Give concrete advice on structure and evidence. Describe each body only as its own published criteria say; do not invent approval rates.',
    whyNow: 'Most refusals we see come from applications written as a fundraising pitch to a reader who is not raising money.',
    primaryKeyword: 'ارائه طرح استارتاپ به کمیته ارزیابی',
    secondaryKeywords: ['پیچ دک برای ویزای کارآفرینی', 'طرح کسب‌وکار برای مهاجرت', 'معیار ارزیابی استارتاپ'],
    searchQueryEn: 'what do startup visa evaluation committees in Europe look for in a pitch',
    mustLink: ['/mentorship', '/europe/netherlands', '/europe/finland'],
    imageScenes: [
      'An empty presentation room with a blank screen and rows of grey chairs, cool fluorescent light',
      'A laptop open on a lectern in an empty auditorium, seen from the back row',
    ],
    depth: 'standard',
    audience: 'A founder preparing the business case for a European startup route.',
  },
  {
    slug: 'validate-before-moving',
    family: 'founder-craft',
    destination: 'general',
    category: 'Mentorship & Business Planning',
    workingTitle: 'اعتبارسنجی ایده‌ی استارتاپ پیش از مهاجرت، نه بعد از آن',
    angle:
      'Founders often plan to validate the idea once they have arrived; by then rent is running and the permit may depend on progress. Lay out how to test demand in the target market from where you are now — customer interviews with people in that country, a landing page and a small paid test, a pilot with one real customer — and how to turn that evidence into a stronger application. Keep it practical and free of invented success rates.',
    whyNow: 'Evidence gathered before the move costs weeks; evidence gathered after it costs the first year.',
    primaryKeyword: 'اعتبارسنجی ایده استارتاپ',
    secondaryKeywords: ['تست بازار پیش از مهاجرت', 'مصاحبه با مشتری', 'MVP برای مهاجرت'],
    searchQueryEn: 'how to validate a startup idea in a foreign market before relocating',
    mustLink: ['/mentorship', '/europe/estonia', '/which-path'],
    imageScenes: [
      'A laptop on a small kitchen table beside a window at dawn, a single lamp off, cool blue light',
      'A quiet shared office with empty desks and one monitor showing a blank dashboard',
    ],
    depth: 'standard',
    audience: 'A founder with an idea but no paying customers yet, considering a move.',
  },
  {
    slug: 'first-hire-denmark',
    family: 'founder-craft',
    destination: 'denmark',
    category: 'Mentorship & Business Planning',
    workingTitle: 'استخدام اولین کارمند در دانمارک برای یک استارتاپ کوچک',
    angle:
      'The first hire changes a Danish startup from a founder project into an employer, with obligations that surprise people arriving from outside Europe. Explain what an employer takes on in Denmark — contracts, collective-agreement norms, holiday and pension expectations, payroll registration — and when a freelancer or an intern is the wiser first step. Cite Danish authorities for every rule; state no salary or tax figure as fact.',
    whyNow: 'Founders on a Danish route are expected to build a real company there, and that means hiring sooner than they plan.',
    primaryKeyword: 'استخدام کارمند در دانمارک',
    secondaryKeywords: ['قرارداد کار دانمارک', 'کارفرما بودن در دانمارک', 'استارتاپ در دانمارک'],
    searchQueryEn: 'what does a startup need to know before hiring its first employee in Denmark',
    mustLink: ['/europe/denmark', '/mentorship', '/faq'],
    imageScenes: [
      'Two empty desks facing each other in a bright Copenhagen studio with a large industrial window',
      'A coat rack by an office door with a single umbrella, overcast light through frosted glass',
    ],
    depth: 'standard',
    audience: 'A founder already in Denmark, or about to be, who needs help to grow.',
  },
  {
    slug: 'founder-tax-netherlands',
    family: 'money-and-tax',
    destination: 'netherlands',
    category: 'European Visas',
    workingTitle: 'مالیات بنیان‌گذار در هلند در سال اول فعالیت',
    angle:
      'A founder in the Netherlands meets the tax office in the first months, not at the end of the year. Explain the shape of it without numbers: registering the business, VAT and when it applies, how paying yourself from the company differs from being self-employed, and why an accountant earns their fee in year one. Cite the Dutch tax authority and the business register for rules; do not state rates or thresholds, and say plainly that this is not tax advice.',
    whyNow: 'The first VAT return arrives long before a new founder has thought about one.',
    primaryKeyword: 'مالیات در هلند برای بنیان‌گذار',
    secondaryKeywords: ['ثبت شرکت در هلند', 'مالیات بر ارزش افزوده هلند', 'حسابداری استارتاپ در هلند'],
    searchQueryEn: 'what taxes does a startup founder deal with in the first year in the Netherlands',
    mustLink: ['/europe/netherlands', '/mentorship', '/faq'],
    imageScenes: [
      'A calculator and a closed laptop on a clean white desk beside a canal window, flat grey daylight',
      'A narrow Amsterdam office stairwell with white walls and a single potted plant',
    ],
    depth: 'standard',
    audience: 'A founder who expects to run a company in the Netherlands and has never filed business taxes there.',
  },
  {
    slug: 'real-cost-estonia',
    family: 'money-and-tax',
    destination: 'estonia',
    category: 'European Visas',
    workingTitle: 'هزینه‌ی واقعی مسیر استونی برای یک تیم دونفره',
    angle:
      'Estonia is chosen as the low-cost route, and the application is cheap; the move is not free. Build a cost picture for a two-person team as categories rather than invented numbers — state fees, proof of means of support, a first flat, travel, company set-up and accounting, and the months before revenue — and show how to research each figure from the official source. Cite the Estonian authorities for anything stated as a requirement.',
    whyNow: 'A team that budgets only for the application runs out of money in the first quarter.',
    primaryKeyword: 'هزینه مهاجرت به استونی',
    secondaryKeywords: ['تمکن مالی استونی', 'هزینه زندگی در تالین', 'بودجه تیم استارتاپ'],
    searchQueryEn: 'total cost of moving a two person startup team to Estonia',
    mustLink: ['/europe/estonia', '/which-path', '/mentorship'],
    imageScenes: [
      'Two suitcases standing in an empty modern apartment with bare white walls, cool window light',
      'A tram crossing an empty square in Tallinn under a flat grey sky',
    ],
    depth: 'standard',
    audience: 'A two-person team that picked Estonia because it looked cheapest.',
  },
  {
    slug: 'pre-seed-europe',
    family: 'money-and-tax',
    destination: 'general',
    category: 'Mentorship & Business Planning',
    workingTitle: 'جذب سرمایه‌ی اولیه در اروپا برای تیم تازه‌مهاجر',
    angle:
      'A startup permit gets a team into Europe; it does not fund the company. Explain the realistic sources of early money for a newly arrived team — grants and public programmes, angels, accelerators, revenue — what each expects from founders who are new to the country, and how residence status and a short local track record affect those conversations. Name programmes only by linking their official pages; state no grant amounts.',
    whyNow: 'Founders often assume the evaluating body that approved them will also invest; usually it will not.',
    primaryKeyword: 'جذب سرمایه استارتاپ در اروپا',
    secondaryKeywords: ['سرمایه‌گذار فرشته اروپا', 'گرنت استارتاپ اروپا', 'شتاب‌دهنده اروپایی'],
    searchQueryEn: 'how can an immigrant startup team raise pre-seed funding in Europe',
    mustLink: ['/mentorship', '/europe/finland', '/europe/estonia'],
    imageScenes: [
      'An empty glass-walled meeting room in a modern office with a round table and four chairs, cool light',
      'A long corridor of a startup hub with closed glass doors and polished concrete floor',
    ],
    depth: 'standard',
    audience: 'A founding team that has or expects a European startup permit and no investors yet.',
  },
  {
    slug: 'bank-account-after-arrival',
    family: 'iranian-practicalities',
    destination: 'general',
    category: 'Global Talent & Compliance',
    workingTitle: 'افتتاح حساب بانکی با گذرنامه‌ی ایرانی پس از ورود',
    angle:
      'Holding a residence permit does not guarantee a bank will open an account for an Iranian national, and without an account there is no salary, lease or company. Explain why banks apply extra checks, what documents and explanations tend to help, the difference between a personal and a business account, and what to do if a bank declines. Describe bank behaviour as what applicants report, not as rules; we do not advise on sanctions compliance and must say so.',
    whyNow: 'It is the first administrative wall most Iranian founders hit in their first week abroad.',
    primaryKeyword: 'افتتاح حساب بانکی برای ایرانیان در اروپا',
    secondaryKeywords: ['حساب بانکی با پاسپورت ایرانی', 'بانک و تحریم', 'حساب شرکت در اروپا'],
    searchQueryEn: 'opening a bank account in Europe with an Iranian passport after getting a residence permit',
    mustLink: ['/europe/finland', '/faq', '/which-path'],
    imageScenes: [
      'A quiet modern bank branch with an empty waiting bench and a numbered-ticket stand, cool daylight',
      'A bank card terminal on a clean counter beside a glass partition, shallow depth of field',
    ],
    depth: 'standard',
    audience: 'An Iranian founder who has a European permit and is about to open accounts.',
  },
  {
    slug: 'spouse-work-rights',
    family: 'career-and-work',
    destination: 'general',
    category: 'Global Talent & Compliance',
    workingTitle: 'حق کار همسر در مسیرهای کارآفرینی اروپا',
    angle:
      'For many families the deciding question is whether the partner can work. Compare, route by route, what each authority says about a family member\'s right to work under the startup and entrepreneur routes we cover, and what that means for household income in the first year. Every statement of a right must be cited to the authority; where it is conditional or unclear, say so rather than resolving it.',
    whyNow: 'A plan built on two incomes falls apart if only the founder is allowed to earn one.',
    primaryKeyword: 'اجازه کار همسر در اروپا',
    secondaryKeywords: ['کار همسر در دانمارک', 'کار همسر در فنلاند', 'مهاجرت خانوادگی کارآفرینی'],
    searchQueryEn: 'can the spouse of a startup visa holder work in Denmark or Finland',
    mustLink: ['/europe/denmark', '/europe/finland', '/which-path'],
    imageScenes: [
      'Two empty desks in a home office by a window, one laptop open and one closed, cool daylight',
      'An empty commuter train platform in a Nordic city on an overcast morning',
    ],
    depth: 'standard',
    audience: 'A founder planning to move with a partner who will want to work.',
  },
  {
    slug: 'credential-recognition-finland',
    family: 'career-and-work',
    destination: 'finland',
    category: 'Global Talent & Compliance',
    workingTitle: 'ارزیابی مدرک تحصیلی ایرانی برای کار در فنلاند',
    angle:
      'An engineer or doctor arriving in Finland finds that a degree is recognised differently depending on whether the job is regulated. Explain the difference between regulated and unregulated professions, which body decides recognition, what an Iranian graduate should gather before leaving, and how long the process tends to take according to the official source. Cite the Finnish authority for every step.',
    whyNow: 'Documents that are easy to obtain in Iran can be almost impossible to obtain from abroad once you have left.',
    primaryKeyword: 'ارزیابی مدرک تحصیلی در فنلاند',
    secondaryKeywords: ['کار در فنلاند با مدرک ایرانی', 'مشاغل دارای مجوز فنلاند', 'مهاجرت کاری به فنلاند'],
    searchQueryEn: 'how to get an Iranian degree recognised for work in Finland',
    mustLink: ['/europe/finland', '/faq', '/mentorship'],
    imageScenes: [
      'A university library reading room in Helsinki with long empty tables and green desk lamps switched off',
      'A modern government service hall with empty seating and tall windows, flat winter light',
    ],
    depth: 'standard',
    audience: 'A skilled professional, or the partner of a founder, planning to work in Finland.',
  },
  {
    slug: 'niw-or-job-offer',
    family: 'route-decision',
    destination: 'usa',
    category: 'USA Business & Talent',
    workingTitle: 'EB-2 NIW یا پیشنهاد شغلی: کدام برای متخصص ایرانی؟',
    angle:
      'For a skilled Iranian professional the American question is usually whether to self-petition under the National Interest Waiver or find an employer to sponsor. Compare the two honestly — who controls the case, what evidence each needs, how dependent you are on one employer, and what travel and visa-issuance realities an Iranian national faces. Cite USCIS and the Department of State; state no approval rates or processing times that are not cited.',
    whyNow: 'Many applicants pick NIW because it needs no employer, without weighing what the employer route would have given them.',
    primaryKeyword: 'مقایسه EB-2 NIW و اسپانسر شغلی',
    secondaryKeywords: ['مهاجرت کاری به آمریکا', 'گرین کارت از طریق کارفرما', 'NIW برای ایرانیان'],
    searchQueryEn: 'EB-2 NIW versus employer sponsorship which is better for an Iranian professional',
    mustLink: ['/usa-eb2-niw', '/which-path', '/mentorship'],
    imageScenes: [
      'An empty open-plan tech office at dusk with rows of dark monitors and city towers outside, cool blue light',
      'A glass office lobby with an empty reception desk and a long marble floor',
    ],
    depth: 'standard',
    audience: 'An Iranian engineer or researcher deciding how to approach the United States.',
  },
  {
    slug: 'pnp-without-capital',
    family: 'career-and-work',
    destination: 'canada',
    category: 'Canada PNP',
    workingTitle: 'برنامه‌ی استانی کانادا برای متخصص، وقتی سرمایه ندارید',
    angle:
      'Entrepreneur streams ask for capital most founders do not have; several provincial routes are built for skilled workers instead. Explain how a skilled-worker provincial nomination differs from an entrepreneur stream, why a job offer or a link to the province often matters, and how it interacts with Express Entry. Link our provincial pages and cite each province for its rules; state no draw scores or thresholds.',
    whyNow: 'Founders priced out of entrepreneur streams often do not realise they may qualify on their work experience instead.',
    primaryKeyword: 'برنامه استانی کانادا برای متخصصان',
    secondaryKeywords: ['PNP بدون سرمایه', 'نامزدی استانی کانادا', 'اکسپرس انتری و PNP'],
    searchQueryEn: 'Canadian provincial nominee program for skilled workers without investment',
    mustLink: ['/pnp', '/pnp/new-brunswick', '/which-path'],
    imageScenes: [
      'An empty modern office floor in a mid-size Canadian city with snow visible on the rooftops outside',
      'A quiet industrial workshop with tidy workbenches and tall windows, cool morning light',
    ],
    depth: 'standard',
    audience: 'A skilled professional who cannot meet an entrepreneur stream\'s capital requirement.',
  },
  {
    slug: 'helsinki-ecosystem',
    family: 'ecosystem-and-market',
    destination: 'finland',
    category: 'European Visas',
    workingTitle: 'اکوسیستم استارتاپی هلسینکی و رویدادهایی که ارزش رفتن دارند',
    angle:
      'A founder who arrives in Helsinki without a network loses months. Describe the ecosystem a newcomer can actually plug into — the university-linked communities, the hubs and incubators, the kinds of events worth the time, and the sectors where Finnish startups tend to be strong — and how to use the first ninety days to build relationships. Name organisations only by linking their own pages; make no claims about funding volumes.',
    whyNow: 'The first months are when a founder has the most time and the least network.',
    primaryKeyword: 'اکوسیستم استارتاپی فنلاند',
    secondaryKeywords: ['رویداد استارتاپی هلسینکی', 'شبکه‌سازی در فنلاند', 'استارتاپ در هلسینکی'],
    searchQueryEn: 'Helsinki startup ecosystem for newly arrived founders events and communities',
    mustLink: ['/europe/finland', '/mentorship', '/which-path'],
    imageScenes: [
      'A large empty event hall with stacked chairs and a stage under cool white light',
      'The atrium of a modern innovation hub with open staircases and nobody on them, grey daylight',
    ],
    depth: 'standard',
    audience: 'A founder who has chosen or is weighing Finland and knows nobody there.',
  },
  {
    slug: 'copenhagen-sectors',
    family: 'ecosystem-and-market',
    destination: 'denmark',
    category: 'European Visas',
    workingTitle: 'کپنهاگ برای کدام استارتاپ‌ها جای درستی است؟',
    angle:
      'A startup route assesses whether the business makes sense in Denmark, so the market matters as much as the idea. Discuss the sectors where Denmark has depth — life sciences, green energy and climate technology, design, and others the official sources highlight — what a small, high-trust market means for sales, and when a Danish base serves a Nordic or European plan. Cite Danish public sources for any claim about sector strength.',
    whyNow: 'An idea that would work in a large market can struggle to justify itself in a small one, and evaluators notice.',
    primaryKeyword: 'بازار استارتاپ دانمارک',
    secondaryKeywords: ['استارتاپ در کپنهاگ', 'صنایع قوی دانمارک', 'انتخاب کشور برای استارتاپ'],
    searchQueryEn: 'which startup sectors fit Copenhagen and the Danish market',
    mustLink: ['/europe/denmark', '/mentorship', '/which-path'],
    imageScenes: [
      'A waterfront of modern Copenhagen buildings and wind turbines on the horizon, cool clear morning',
      'An empty laboratory bench with glassware and tall windows onto a harbour, flat daylight',
    ],
    depth: 'standard',
    audience: 'A founder deciding whether their product belongs in Denmark.',
  },
  {
    slug: 'dutch-market-test',
    family: 'ecosystem-and-market',
    destination: 'netherlands',
    category: 'European Visas',
    workingTitle: 'آزمودن بازار هلند پیش از ثبت درخواست اقامت',
    angle:
      'The Dutch startup route puts a facilitator between the founder and the application, and a facilitator is more convinced by traction than by a plan. Explain how to test the Dutch market from abroad — finding the first customers, working with a facilitator early, using the Netherlands as a gateway to the wider European market — and how that evidence strengthens the case. Describe facilitators only as the authority does.',
    whyNow: 'Founders who approach a facilitator with early Dutch customers have a different conversation from those who arrive with only a deck.',
    primaryKeyword: 'ورود به بازار هلند',
    secondaryKeywords: ['استارتاپ در هلند', 'فسیلیتیتور هلند', 'بازار اروپا از هلند'],
    searchQueryEn: 'how to test the Dutch market before applying for a Netherlands startup residence permit',
    mustLink: ['/europe/netherlands', '/mentorship', '/which-path'],
    imageScenes: [
      'A row of empty market stalls folded away on a Rotterdam square under an overcast sky',
      'A glass-fronted shared office on a Dutch canal with empty desks visible through the window',
    ],
    depth: 'standard',
    audience: 'A founder considering the Netherlands who has no Dutch customers yet.',
  },
  {
    slug: 'australia-invitation',
    family: 'route-mechanics',
    destination: 'australia',
    category: 'Australia Entrepreneurship',
    workingTitle: 'استرالیا برای بنیان‌گذار ایرانی: دعوت‌نامه مهم است، نه درخواست',
    angle:
      'Australia\'s route for exceptional founders and talent is not a startup visa in the European sense: it is assessed on the individual and begins with an expression of interest that has to be invited. Explain what that means in practice — why the invitation, not the application, is the real gate, what kind of record tends to stand out, and why it suits a proven individual more than an early team. Cite the Department of Home Affairs for everything; state no invitation numbers unless they are cited with their period.',
    whyNow: 'Founders read "innovation visa" and assume it works like the European startup routes; it does not.',
    primaryKeyword: 'مهاجرت به استرالیا برای بنیان‌گذاران',
    secondaryKeywords: ['ویزای نوآوری استرالیا', 'ابراز علاقه استرالیا', 'استعداد برتر استرالیا'],
    searchQueryEn: 'Australia national innovation visa for founders how the invitation works',
    mustLink: ['/australia', '/which-path', '/faq'],
    imageScenes: [
      'An empty modern office terrace in Sydney with outdoor chairs and a harbour view under a clear pale sky',
      'A long empty airport arrivals corridor with polished floors and tall windows',
    ],
    depth: 'standard',
    audience: 'An accomplished Iranian founder or researcher looking beyond Europe.',
  },
  {
    slug: 'turkiye-tech-visa-limits',
    family: 'route-mechanics',
    destination: 'turkiye',
    category: 'Global Talent & Compliance',
    workingTitle: 'ویزای فناوری ترکیه: چه چیزی به دست می‌آورید و چه چیزی نه',
    angle:
      'Türkiye is close, familiar and relatively easy for Iranians to reach, which makes its Tech Visa attractive. Explain plainly what it is and is not: a route for a technology startup to operate in Türkiye, not a path towards a European passport, with its own conditions on the company. Say what the official programme describes, flag where published detail is thin, and do not repeat unofficial claims about exemptions from employment rules. Cite the programme\'s own site.',
    whyNow: 'Türkiye is often framed as a stepping stone to Europe, which it is not.',
    primaryKeyword: 'ویزای فناوری ترکیه',
    secondaryKeywords: ['Turkey Tech Visa', 'استارتاپ در ترکیه', 'مهاجرت به ترکیه برای بنیان‌گذار'],
    searchQueryEn: 'Turkey Tech Visa for startups what it offers and its limits',
    mustLink: ['/turkey-tech-visa', '/which-path', '/faq'],
    imageScenes: [
      'A modern technopark campus in Istanbul with glass buildings and empty walkways, soft overcast light',
      'An empty ferry deck on the Bosphorus with rows of benches and a grey sky',
    ],
    depth: 'standard',
    audience: 'An Iranian founder considering Türkiye as a nearby base.',
  },
  {
    slug: 'military-service-exit',
    family: 'iranian-practicalities',
    destination: 'general',
    category: 'Global Talent & Compliance',
    workingTitle: 'کارت پایان خدمت و خروج از کشور برای بنیان‌گذار مرد',
    angle:
      'For a male Iranian founder, military-service status can decide whether he can leave the country and travel back, long before any foreign permit matters. Explain the question as a planning issue — why the status needs sorting before a move is planned, what founders commonly have to resolve, and why a lawyer inside Iran should confirm the current rules. Describe no Iranian regulation as fact without a source, and say plainly that we do not advise on Iranian law.',
    whyNow: 'A permit can be approved for someone who then finds he cannot leave to use it.',
    primaryKeyword: 'کارت پایان خدمت برای مهاجرت',
    secondaryKeywords: ['خروج از کشور مشمولان', 'سربازی و مهاجرت', 'معافیت تحصیلی و مهاجرت'],
    searchQueryEn: 'military service status and leaving Iran for a male startup founder',
    mustLink: ['/faq', '/which-path', '/europe/finland'],
    imageScenes: [
      'An empty airport departure gate with rows of seats facing a runway at dawn, cool light',
      'A quiet government building entrance with closed glass doors and wide stone steps',
    ],
    depth: 'standard',
    audience: 'A male Iranian founder of service age planning a move abroad.',
  },
];

/** Strip the backlog-only fields so the writer receives a plain Brief. */
export function topicToBrief(topic: FaTopic): Brief {
  const { slug, audience: _audience, ...brief } = topic;
  return { ...brief, topicSlug: slug };
}

/**
 * The next `n` topics that have not been written yet.
 *
 * `writtenSlugs` is the reliable half: the writer records the topic's id on
 * the article, so a rewritten title cannot hide it. The title comparison is
 * the backstop, and covers the articles published before ids were recorded.
 */
export function pickTopics(n: number, writtenTitles: string[], writtenSlugs: string[] = [], recent: Tagged[] = []): FaTopic[] {
  const done = writtenTitles.map((t) => t.trim()).filter(Boolean);
  const slugs = new Set(writtenSlugs.filter(Boolean));
  const covered = (t: FaTopic) =>
    slugs.has(t.slug) ||
    done.some((w) => w.includes(t.workingTitle) || t.workingTitle.includes(w) || sameSubject(w, t.workingTitle));

  // Order what is left for variety before taking any of it. Taking the head
  // of the list is how the Persian blog published eleven startup-visa pieces
  // in a row: the list was in that order. The picker now continues from what
  // was actually published and refuses to repeat a family, a destination or
  // a startup-visa headline back to back while anything else is available.
  const open = FA_TOPICS.filter((t) => !covered(t)).map((t) => ({ ...t, startupVisaHeadline: classify(t.workingTitle).startupVisaHeadline }));
  const ordered = pickDiverse(open, recent, open.length);

  const out: FaTopic[] = [];
  let deepUsed = false;
  for (const { startupVisaHeadline: _s, ...t } of ordered) {
    if (out.length >= n) break;
    // The planner allows at most one deep guide per run; so does the backlog.
    if (t.depth === 'deep') {
      if (deepUsed) continue;
      deepUsed = true;
    }
    out.push(t);
  }
  return out;
}
