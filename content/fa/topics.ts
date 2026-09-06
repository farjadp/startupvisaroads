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
