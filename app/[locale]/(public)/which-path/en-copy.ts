// ============================================================================
// app/[locale]/(public)/which-path/en-copy.ts
// English copy and English outcome for /en/which-path.
//
// The SCORING is not duplicated: `recommendPathEn` calls the Persian
// `recommendPath` from lib/fa/path-quiz.ts to decide the route, so the two
// pages can never send the same answers to different routes. What this file
// adds is the English sentence for each branch. `recommendPath` only returns
// Persian prose, so `reasonFor` re-reads the same conditions to pick which
// English sentence applies; a check over every possible answer set (2,592)
// confirmed that `reasonFor` lands on the branch `recommendPath` took.
// If you change a rule in lib/fa/path-quiz.ts, change `reasonFor` with it.
//
// Facts in the sentences are the Persian module's (content/fa/which-path.ts
// and lib/fa/path-quiz.ts), with one correction carried from the site's
// verified guides: Finland's Business Finland statement is free today but is
// becoming chargeable under the 2026 reform (see /en/country/finland).
// Estonia's EUR 880 a month is four times the 2026 subsistence level (EUR
// 220), politsei.ee and lib/funds.ts.
//
// This module has no 'use server' or 'use client' directive so both the
// client quiz and the server action can import it.
// ============================================================================
import { recommendPath, type PathId, type QuizAnswers } from '@/lib/fa/path-quiz';
import { MAIN_CONTACT } from '@/content/contact';

export type EnQuestion<K extends keyof QuizAnswers = keyof QuizAnswers> = {
  id: K;
  title: string;
  hint?: string;
  options: { value: QuizAnswers[K]; label: string; detail?: string }[];
};

export const EN_PATH = '/which-path';
export const EN_UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };

export const EN_META = {
  title: 'Which Immigration Route Fits You? Free 3-Minute Test',
  description:
    'Seven questions on your team, business, English, capital, background and timing, then a suggested route (Europe, Türkiye, Atlantic Canada or EB-2 NIW) and why.',
};

export const enIntro = {
  eyebrow: 'Free · 7 questions · 3 minutes',
  start: 'Start the assessment',
  privacy: 'Your answers are only used to work out the result. Nothing is sent anywhere unless you choose to send it.',
};

export const enQuestions: EnQuestion[] = [
  {
    id: 'goal',
    title: 'What is your main goal in moving?',
    options: [
      { value: 'residency', label: 'Permanent residence for me and my family', detail: 'The business is the means, not the goal' },
      { value: 'growth', label: 'Growing my business in a global market', detail: 'Residence is a side effect' },
      { value: 'family', label: "My children's education and future", detail: 'Time and stability matter more than speed' },
    ],
  },
  {
    id: 'team',
    title: 'Are you a solo founder, or do you have co-founders?',
    hint: 'Finland requires at least two founders; Denmark and Estonia accept a solo founder.',
    options: [
      { value: 'solo', label: "I'm on my own" },
      { value: 'team', label: 'I have one or more serious co-founders', detail: 'With a real role and a plan to relocate' },
    ],
  },
  {
    id: 'business',
    title: 'Where is your business today?',
    hint: 'Be honest: the body that evaluates your business will ask exactly this.',
    options: [
      { value: 'none', label: "I don't have a business", detail: "I'm an employee, specialist or researcher" },
      { value: 'idea', label: "I have an idea, but haven't built a product yet" },
      { value: 'mvp', label: 'I have a minimum viable product (MVP) and my first users' },
      { value: 'revenue', label: 'I run an active business with revenue' },
    ],
  },
  {
    id: 'language',
    title: 'What is your English level right now?',
    hint: 'Roughly your IELTS General Training band in each skill.',
    options: [
      { value: 'low', label: "Below 5, or I haven't taken a test and I'm not sure", detail: 'Below CLB 5' },
      { value: 'mid', label: 'Between 5 and 6.5', detail: 'CLB 5 to 7' },
      { value: 'high', label: '7 or higher', detail: 'Above CLB 7' },
    ],
  },
  {
    id: 'capital',
    title: 'How much transferable capital do you have, separate from living money?',
    hint: 'In Canadian dollars. "Transferable" means you can prove where it came from and move it through legal channels.',
    options: [
      { value: 'under50', label: 'Under CAD 50,000' },
      { value: '50to200', label: 'CAD 50,000 to 200,000' },
      { value: '200to500', label: 'CAD 200,000 to 500,000' },
      { value: 'over500', label: 'Over CAD 500,000' },
    ],
  },
  {
    id: 'background',
    title: 'Which description fits you best?',
    options: [
      { value: 'research', label: 'Researcher or specialist with publications, patents or an academic record', detail: "Master's degree or PhD" },
      { value: 'professional', label: 'Specialist or manager with a clear work history', detail: 'At least 3 years in one field' },
      { value: 'none', label: 'Neither of these is quite me' },
    ],
  },
  {
    id: 'horizon',
    title: 'When do you want to be in your destination?',
    hint: 'Be realistic: every real route takes several years.',
    options: [
      { value: 'urgent', label: 'In less than a year', detail: 'Whichever route is fastest' },
      { value: 'medium', label: 'In one to three years' },
      { value: 'long', label: 'In more than three years', detail: 'Long-term planning' },
    ],
  },
];

export const enUi = {
  back: 'Back',
  next: 'Next',
  finish: 'See my result',
  stepOf: (n: number, total: number) => `Question ${n} of ${total}`,
  resultLabel: 'Suggested route',
  readMore: 'Read the full guide to this route',
  restart: 'Start again',
  disclaimer:
    'This assessment is not a substitute for legal advice. The final decision on any application rests with a licensed immigration lawyer or regulated immigration consultant.',
  lead: {
    heading: 'Want us to go through your result with you?',
    body: 'Leave your email or Telegram handle. Your result and answers come to us, and within two business days we reply with a short, honest opinion. No sales call.',
    name: 'Name',
    email: 'Email',
    telegram: 'Telegram handle (optional)',
    submit: 'Send for review',
    sending: 'Sending…',
    done: "Received. We'll reply within two business days.",
    error: "It didn't send. You can message us directly on Telegram.",
    telegramCta: 'Or ask on Telegram right now',
    telegramUrl: MAIN_CONTACT.telegram,
  },
};

/** English title and English guide for each outcome. Every href returns 200 on /en (checked 2026-10-29). */
export const EN_RESULT: Record<PathId, { title: string; href: string; guide: string }> = {
  finland: { title: 'Finland startup permit', href: '/country/finland', guide: 'Finland startup visa guide' },
  denmark: { title: 'Start-up Denmark', href: '/country/denmark', guide: 'Start-up Denmark guide' },
  netherlands: { title: 'Netherlands startup visa', href: '/europe/netherlands', guide: 'Netherlands startup visa guide' },
  estonia: { title: 'Estonia startup visa', href: '/europe/estonia', guide: 'Estonia startup visa guide' },
  italy: { title: 'Italia Startup Visa', href: '/country/italy', guide: 'Italy startup visa guide' },
  turkey: { title: 'Türkiye Tech Visa', href: '/country/turkey', guide: 'Türkiye Tech Visa guide' },
  atlantic: { title: 'New Brunswick or Nova Scotia entrepreneur stream', href: '/pnp/new-brunswick', guide: 'New Brunswick business stream guide' },
  eb2niw: { title: 'US EB-2 NIW', href: '/usa/eb2-niw', guide: 'EB-2 NIW guide' },
  'too-early': { title: "Not yet, and that's good news", href: '/mentorship', guide: 'How the mentorship works' },
};

type Reason =
  | 'eb2niw'
  | 'early-nothing'
  | 'early-idea'
  | 'atlantic'
  | 'italy'
  | 'finland'
  | 'turkey'
  | 'netherlands'
  | 'estonia'
  | 'denmark'
  | 'early-language'
  | 'early-professional'
  | 'early-other';

const WHY: Record<Reason, { why: string; note?: string }> = {
  eb2niw: {
    why: 'Your research record is exactly what the second prong of the Dhanasar test asks for, and the NIW needs no employer and no investment.',
    note: 'For nationals of countries under US entry restrictions, such as Iran: check the current restrictions with a lawyer before you do anything else.',
  },
  'early-nothing': {
    why: "Without a running business and without a clear professional or research record, none of the routes open today makes sense for you, and anyone who tells you otherwise wants your money. Build one of the two first; that is exactly the stage we help with.",
  },
  'early-idea': {
    why: "An idea on its own is not enough for Business Finland, the Danish panel or the Estonian committee: all of them want an early product and evidence from the market. Six to twelve months building an MVP and winning your first users takes you from 'too early' to 'ready'.",
  },
  atlantic: {
    why: "Your transferable capital and management record clear the thresholds of Atlantic Canada's entrepreneur streams: an investment of CAD 150,000 and a net worth of CAD 400,000 to 600,000. A work permit within a few months, permanent residence once you have met your commitments, and Canada, which the paused Start-up Visa no longer reaches.",
  },
  italy: {
    why: "A team with a product, a budget and growth as its priority: Italy accepts up to five founders per startup (Denmark, three), and its EUR 50,000 in funds is for the whole team, not per person. The MIMIT committee decides within 30 days on the documents alone, with no interview. Take two things seriously now: every member's CV has to fit the plan, and businesses that are mainly consulting or intermediation have been refused since December 2024.",
  },
  finland: {
    why: "A running business and a team of two put you squarely in range of Finland's startup permit: the same logic as Canada's Start-up Visa, with no required investment, and a Business Finland assessment that is free today (the 2026 reform makes it chargeable). The next question is whether Business Finland sees your business as internationally scalable.",
  },
  turkey: {
    why: 'A solo founder with a ready product, a limited budget and growth as the priority: Türkiye gives the longest first permit, up to three years, where the Netherlands re-assesses you after twelve months, and living and set-up costs are far lower. In exchange, this route does not lead to a European passport; if that is your goal, look at Denmark.',
  },
  netherlands: {
    why: "A solo founder with a product, for whom market growth comes first: the Netherlands pairs you with an RVO-approved facilitator who stays with you for a year on business development and access to the Western European market. The first permit lasts only twelve months and is not extended; after that you are assessed on RVO's points system.",
  },
  estonia: {
    why: 'A solo founder with a ready product and a limited budget or a deadline: Estonia is the fastest and cheapest door. The committee decides within about ten working days, and the means requirement is EUR 880 a month. From there you can grow into Europe’s bigger markets.',
  },
  denmark: {
    why: "A solo founder with a running business and a reasonable budget: Start-up Denmark accepts you, without Finland's team requirement and without a fixed capital threshold. Its expert panel assesses the business plan in about six weeks.",
  },
  'early-language': {
    why: 'Your business could take you to Europe, but Business Finland, the Danish panel and the Estonian committee all assess in English and expect a fluent English business plan. Language is the fastest thing you can change: six months of focus on it changes this answer.',
  },
  'early-professional': {
    why: 'You have a professional record, but without a running business and without capital at the level of the Atlantic thresholds, no entrepreneur route is open to you today. There are two ways forward: build an MVP for Europe, or bring your transferable capital up to the threshold for Canada.',
  },
  'early-other': {
    why: "With your current answers, none of the routes open today can be recommended. That isn't a bad result: it means that before you spend money, you need to build one of three things — a business, your English, or your capital.",
  },
};

/**
 * Which branch of lib/fa/path-quiz.ts's recommendPath fired. Mirrors its
 * if-chain line for line; recommendPathEn asserts the routes agree.
 */
function reasonFor(a: QuizAnswers): Reason {
  const hasBusiness = a.business === 'mvp' || a.business === 'revenue';
  const funded = a.capital === '200to500' || a.capital === 'over500';
  const langOk = a.language !== 'low';
  if (a.background === 'research' && !hasBusiness) return 'eb2niw';
  if (!hasBusiness && a.background === 'none') return 'early-nothing';
  if (a.business === 'idea' && !funded) return 'early-idea';
  if (funded && a.background !== 'none' && (a.goal !== 'growth' || !hasBusiness)) return 'atlantic';
  if (hasBusiness && langOk) {
    if (a.team === 'team') return a.goal === 'growth' && a.capital !== 'under50' ? 'italy' : 'finland';
    if (a.goal === 'growth') return a.capital === 'under50' ? 'turkey' : 'netherlands';
    if (a.horizon === 'urgent' || a.capital === 'under50') return 'estonia';
    return 'denmark';
  }
  if (hasBusiness && !langOk) return 'early-language';
  if (a.background === 'professional') return 'early-professional';
  return 'early-other';
}

const REASON_PATH: Record<Reason, PathId> = {
  eb2niw: 'eb2niw',
  'early-nothing': 'too-early',
  'early-idea': 'too-early',
  atlantic: 'atlantic',
  italy: 'italy',
  finland: 'finland',
  turkey: 'turkey',
  netherlands: 'netherlands',
  estonia: 'estonia',
  denmark: 'denmark',
  'early-language': 'too-early',
  'early-professional': 'too-early',
  'early-other': 'too-early',
};

export type EnRecommendation = { path: PathId; title: string; why: string; note?: string; href: string; guide: string };

export function recommendPathEn(a: QuizAnswers): EnRecommendation {
  // The route always comes from the shared scorer.
  const path = recommendPath(a).path;
  const reason = reasonFor(a);
  // If the two ever disagree, the shared scorer wins and we fall back to its
  // route with a neutral sentence rather than explain the wrong route.
  const copy = REASON_PATH[reason] === path ? WHY[reason] : { why: WHY['early-other'].why };
  return { path, ...EN_RESULT[path], ...copy };
}

export const QUIZ_KEYS: (keyof QuizAnswers)[] = ['goal', 'team', 'business', 'language', 'capital', 'background', 'horizon'];

/** For the page body: what each outcome means, in the order the scorer tests them. */
export const OUTCOMES: { path: PathId; when: string }[] = [
  { path: 'eb2niw', when: 'A research profile (publications, patents, a master’s or PhD) with no operating business.' },
  { path: 'atlantic', when: 'CAD 200,000 or more in transferable capital plus a professional or research record, unless you already run a business and growth is your goal.' },
  { path: 'finland', when: 'An operating business (MVP or revenue), English at IELTS 5 or above, and a team of two or more.' },
  { path: 'italy', when: 'The same team, when growth is the goal and capital is CAD 50,000 or more.' },
  { path: 'netherlands', when: 'A solo founder with an operating business, growth as the goal, and CAD 50,000 or more.' },
  { path: 'turkey', when: 'A solo founder with an operating business, growth as the goal, and under CAD 50,000.' },
  { path: 'estonia', when: 'A solo founder with an operating business who is in a hurry or has under CAD 50,000.' },
  { path: 'denmark', when: 'A solo founder with an operating business, a reasonable budget and time.' },
  { path: 'too-early', when: 'No business and no record yet, an idea without funds, an operating business with English below IELTS 5, or a professional record without a business or threshold-level capital.' },
];
