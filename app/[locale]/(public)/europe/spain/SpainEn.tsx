// ============================================================================
// Component: app/[locale]/(public)/europe/spain/SpainEn.tsx
// The English guide at /en/europe/spain, in the guided-route shape of
// /country/finland: a Madrid hero, a sticky rail whose Spanish (civil) flag
// rises as the reader completes each stop, and one stop per searched question.
// Every stop opens with its question as the H2 and a ~50-word direct answer
// built only from facts on this page.
//
// Source of truth: content/fa/europe-spain.ts (updated 2026-10-29), verified
// against the consolidated text of Ley 14/2013 on boe.es (arts. 62, 69, 70,
// 75.5, 76), the UGE's «Emprendedores» page and its «Instrucciones solicitud
// emprendedores» PDF, and the Spanish Consulate in London's entrepreneur-visa
// page. Every fact, caveat, FAQ and source in that module is carried here.
// Re-checked 2026-10-29 in a browser: the UGE page ("No existen mínimos de
// inversión ni de creación de empleo", ENISA's three criteria) and the London
// consulate page (criminal record for the past 5 years, not older than 6
// months, 10-day decision period that can be extended).
//
// Deliberately absent, as in the module: the amounts of tasa 790-038, 790-012
// and the consular fee. The forms are named; the reader generates them.
// Advice specific to Iranian passport holders is kept as a labelled note for
// applicants from sanctioned countries, never as the page's framing.
//
// Photos: the module's own three (public/fa/img), opened and checked: Madrid
// (Metropolis building, Gran Vía / Calle de Alcalá), Barcelona (Via Laietana)
// and Valencia (City of Arts and Sciences).
// ============================================================================

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { pageCopy } from '@/lib/pageMeta';
import { FOUNDER_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag, { type FlagCode } from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import {
  CopyButton,
  GateQuiz,
  OpenedTracker,
  ParallaxLayer,
  PerkOrCatch,
  YearsRoadmap,
  type PrRoute,
  type RoadmapCopy,
  type RouteStep,
} from '@/components/route/RouteWidgets';
import { MeansCalculator, SpainSteps, type MeansRule } from './SpainWidgets';
import { SPAIN_EN } from './meta';

// ─── Data ────────────────────────────────────────────────────────────────────

// The module's `updated` date: the day the figures were checked.
const UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };
const PAGE_URL = `${SITE_URL}/en${SPAIN_EN.path}`;

// Spanish red and gold. Contrast (WCAG 2.x): accentInk #1a1a1a on #FFC400
// 10.9:1; accentText #A30F1F on #F2F0E9 6.96:1, on white 7.94:1, on the soft
// tint #FFF4CC 7.21:1; accentOnDark #FFC400 on deep #2B0A0F 11.4:1.
const THEME: RouteTheme = {
  accent: '#FFC400',
  accentInk: '#1a1a1a',
  accentText: '#A30F1F',
  primary: '#A30F1F',
  deep: '#2B0A0F',
  soft: '#FFF4CC',
  accentOnDark: '#FFC400',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'money', label: 'Money' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'enisa', label: 'ENISA' },
  { id: 'steps', label: '6 steps' },
  { id: 'family', label: 'Family' },
  { id: 'catches', label: 'Perks & catches' },
  { id: 'tax', label: 'Tax' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'compare', label: 'Compare' },
  { id: 'sanctioned', label: 'Sanctioned countries' },
  { id: 'faq', label: 'FAQ' },
];

// Every source the module was verified against. The UGE instructions PDF is
// linked from the UGE page itself; it refuses non-browser requests (403).
const sources = [
  {
    name: 'BOE — Ley 14/2013 (Law on support for entrepreneurs), consolidated text',
    href: 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074',
    what: 'Art. 62 (general requirements), 69 (3-year permit, 2-year renewals), 70 (ENISA report in 10 working days), 75.5 (consular deadline and its Visa Code art. 22 exception), 76 (UGE: 20 days, silence means granted; residence card).',
  },
  {
    name: 'UGE, Ministry of Inclusion, Social Security and Migration — Emprendedores',
    href: 'https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores',
    what: 'No minimum investment or job creation; what ENISA assesses.',
  },
  {
    name: 'UGE — Instrucciones para realizar una solicitud de la autorización de emprendedores (PDF)',
    href: 'https://www.inclusion.gob.es/documents/1823432/1826098/Instrucciones+solicitud+emprendedores.pdf/3a4d0b60-71bf-1c53-9f9d-fff7f94cbf5d?t=1682675484705',
    what: 'The official order: ENISA portal first, then form MIT, tasa 790-038 and the NRC code, then the UGE e-office.',
  },
  {
    name: 'Consulate General of Spain in London — Entrepreneur visa',
    href: 'https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-para-emprendedor.aspx',
    what: 'What a mission asks for: criminal record for the past 5 years, no older than 6 months; 10-day decision period.',
  },
  {
    name: 'ENISA — Empresa Nacional de Innovación',
    href: 'https://www.enisa.es/',
    what: 'The portal where the project questionnaire is filed.',
  },
];

// Ley 14/2013 art. 62, plus what art. 70 adds for the entrepreneur.
const requirements = [
  { title: 'A favourable ENISA report', body: 'ENISA must report that the activity is innovative and/or of special economic interest for Spain. "And/or": you do not need both.' },
  { title: 'Age and nationality', body: 'At least 18, and not an EU citizen or someone with EU free-movement rights.' },
  { title: 'Lawful status', body: 'You are not in Spain irregularly, and you are not on the Schengen list of people refused entry.' },
  { title: 'A clean criminal record', body: 'No record in Spain or in the countries you lived in over the last two years, plus a written declaration covering the last five years. Consulates may ask for five years of certificates.' },
  { title: 'Health insurance', body: 'Public or private health insurance with an insurer authorised to operate in Spain.' },
  { title: 'Sufficient means', body: 'Enough money for you and your family for the stay, against the IPREM criterion: €600 a month for one person in 2026.' },
];

const meansRule: MeansRule = { iprem: 600, holder: 1, twoPerson: 1.5, eachFurther: 0.5 };

const meansRows = [
  { label: 'One person (the entrepreneur)', share: '100% of IPREM', monthly: '€600', total: '€21,600' },
  { label: 'Two people (with a spouse or partner)', share: '150% of IPREM', monthly: '€900', total: '€32,400' },
  { label: 'Three people (spouse and one child)', share: '200% of IPREM', monthly: '€1,200', total: '€43,200' },
  { label: 'Each further family member', share: '+50% of IPREM', monthly: '+€300', total: '+€10,800' },
];

const steps: RouteStep[] = [
  {
    title: 'ENISA portal',
    who: 'You, at enisa.es',
    body: 'Register on the ENISA portal, choose the residence permit for entrepreneurs, and complete the project questionnaire. You can save it and finish it over several sessions. All the technical documents about the project reach ENISA through this route.',
    note: 'This is where the decision is really made: the business plan, your profile and the value for Spain.',
    figure: 'Step 1',
    figureLabel: 'before the immigration file',
  },
  {
    title: 'Immigration file',
    who: 'You',
    body: 'Prepare the immigration file: form MIT signed by you (a handwritten signature, scanned, is accepted); pay tasa 790 code 038 and note the 22-digit NRC code, which goes into the application; a full scan of every passport page; proof of means; insurance; and, if you are in Spain, your criminal record certificate.',
    note: 'The fee amount is printed on the form when you generate it. It changes yearly, so we do not quote it.',
    figure: '22',
    figureLabel: 'digits in the NRC payment code',
  },
  {
    title: 'File with the UGE',
    who: 'UGE e-office',
    body: 'Submit the application electronically on the UGE e-office, with a Spanish digital certificate or Cl@ve, yours or your legal representative\'s. The attachments can total 24 MB at most.',
    note: 'Most applicants outside Spain file through a legal representative who holds a digital certificate.',
    figure: '24 MB',
    figureLabel: 'maximum for all attachments',
  },
  {
    title: 'ENISA report and decision',
    who: 'ENISA and UGE',
    body: 'The UGE asks ENISA for its report; ENISA has ten working days. The UGE decides within twenty days of electronic filing. If it does not answer in time, the permit is granted by administrative silence.',
    note: 'The clock stops if the UGE asks for missing documents. File it complete.',
    figure: '20 days',
    figureLabel: 'UGE decision; silence means yes',
  },
  {
    title: 'Visa at the consulate',
    who: 'Only if you are outside Spain',
    body: 'Apply for the residence visa at the Spanish consulate in the country where you legally live, with the original documents and your criminal record certificate. The visa issued is valid for one year: it is an entry document, while the residence permit the UGE granted runs for three.',
    note: 'Legal deadline: ten working days, except for applicants subject to Visa Code art. 22 prior consultation.',
    figure: '10',
    figureLabel: 'working days, with exceptions',
  },
  {
    title: 'Arrive and get your TIE',
    who: 'Town hall and police',
    body: 'Enter Spain, register your address with the town hall (empadronamiento), book a fingerprint appointment with the police, complete form EX-17, pay tasa 790 code 012 and collect your TIE residence card a few weeks later.',
    note: 'For the first six months your passport is enough to register with Social Security, so you can start working before the card arrives.',
    figure: 'TIE',
    figureLabel: 'residence card',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Spain startup visa (entrepreneur residence permit)',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

const deadlines = [
  { stage: 'ENISA report', who: 'ENISA', limit: '10 working days', law: 'Art. 70', note: 'From the UGE\'s request.' },
  { stage: 'Residence permit decision', who: 'UGE', limit: '20 days', law: 'Art. 76', note: 'From electronic filing. No answer in time = granted (positive silence). Stops while documents are requested.' },
  { stage: 'Residence visa', who: 'Spanish consulate', limit: '10 working days', law: 'Art. 75.5', note: 'Not for applicants subject to Visa Code art. 22 prior consultation, who fall under the Visa Code\'s general deadlines. Can be extended if an interview or documents are requested.' },
];

const fees = [
  { form: 'Tasa 790, code 038', for: 'The residence permit application to the UGE', when: 'Before filing; gives the 22-digit NRC' },
  { form: 'Tasa 790, code 012', for: 'The TIE residence card', when: 'After arrival, with form EX-17' },
  { form: 'Consular visa fee', for: 'The residence visa, if you apply from abroad', when: 'When you submit at the consulate' },
];

const rights = [
  { title: 'A decision in 20 days', content: 'The UGE must decide within twenty days of electronic filing. If it does not, the permit counts as granted by administrative silence: a real legal advantage few countries offer.', positive: true },
  { title: 'Minimum investment', content: 'None. The UGE states it outright: there is no minimum investment and no minimum job creation.', positive: true },
  { title: 'Family on day one', content: 'Your spouse, children and dependent parents can apply with you and are decided at the same time. No one-year wait for family reunification.', positive: true },
  { title: 'Three-year first permit', content: 'Three years from the start, whether you apply in Spain or abroad, then two-year renewals.', positive: true },
  { title: 'Ten years to a passport', content: 'Citizenship takes ten years of legal, continuous residence, and you must formally renounce your previous nationality unless you are covered by an exception.', positive: false },
  { title: 'Spanish paperwork', content: 'Every form and portal is in Spanish, and every foreign document needs a sworn translation (traducción jurada).', positive: false },
  { title: 'Filing needs a certificate', content: 'The UGE e-office needs a Spanish digital certificate or Cl@ve, so most applicants abroad must file through a legal representative.', positive: false },
  { title: 'Renewal needs a live business', content: 'Renewal requires the business to be genuinely active. Get the permit and never start the company, and year three becomes a serious problem.', positive: false },
];

const bottlenecks = [
  'The 20 days (UGE) and 10 working days (ENISA) are legal deadlines, not the length of the whole route. Writing a defensible business plan, getting certificates, apostilles and sworn translations takes months.',
  'The UGE e-office needs a Spanish digital certificate or Cl@ve. Most applicants outside Spain have to file through a legal representative who has one.',
  'Every form and portal is in Spanish, and every foreign document needs a sworn translation (traducción jurada).',
  'The document checklist the UGE still has on its site predates the 2022 law and still names the previous evaluating body. Current practice follows the law, not that PDF.',
  'Renewal requires an active business. Someone who gets the permit and never starts the company runs into serious trouble in year three.',
  'Citizenship takes ten years, and Spain has no dual-nationality arrangement with many countries, Iran among them.',
];

const prRoutes: PrRoute[] = [
  {
    title: 'Permanent residence',
    years: 5,
    reqs: ['Five years of legal, continuous residence'],
    note: 'After the three-year first permit and one two-year renewal.',
    needs: {},
  },
];

const roadmap: RoadmapCopy = {
  prep: { title: 'Before you move', sub: 'ENISA, UGE, visa' },
  arrive: { title: 'Arrive', sub: 'Town hall, TIE card' },
  extension: { year: 3, title: 'First renewal', sub: 'Two years at a time' },
  citizenship: { years: 10 },
  phases: {
    first: { title: 'First permit, 3 years', body: 'Start the company (an SL or self-employed registration with RETA) and keep it active: that is what renewal checks.' },
    extended: { title: 'Renewed permit, 2 years at a time', body: 'Same conditions, business still active. Permanent residence in {toPr}.' },
    resident: { title: 'Permanent resident', body: 'After five years of legal, continuous residence. Citizenship in {toCitizenship}.' },
    citizen: { title: 'Eligible to apply for citizenship', body: 'Ten years of legal, continuous residence, DELE A2 Spanish, the CCSE test, and a formal renunciation of your previous nationality unless an exception applies.' },
  },
};

const comparison = [
  { code: 'es' as FlagCode, country: 'Spain', plus: 'Fastest legal decision with positive silence, no minimum investment, low means, a 3-year first permit and family at the same time.', minus: 'Ten years to citizenship, no dual nationality for many, Spanish-language bureaucracy.' },
  { code: 'it' as FlagCode, country: 'Italy', plus: 'A 30-day committee, no interview.', minus: '€50,000 for the team, a cap of five founders and a one-year first permit.' },
  { code: 'ee' as FlagCode, country: 'Estonia', plus: 'Ten working days and cheap.', minus: 'You need an MVP, and dual citizenship is not accepted.' },
  { code: 'dk' as FlagCode, country: 'Denmark', plus: 'A transparent scoring panel and a clear route to permanent residence.', minus: 'An annual quota of 75 and much higher means of support.' },
  { code: 'nl' as FlagCode, country: 'Netherlands', plus: 'A recognised facilitator guides you.', minus: 'The facilitator is mandatory, and the one-year permit is not extended.' },
];

const faqs = [
  {
    q: 'What exactly is the Spain startup visa?',
    a: 'It is the "entrepreneur" residence permit under articles 69 and 70 of Spain\'s Law 14/2013 on support for entrepreneurs, as amended by Law 28/2022, known as the Startups Law. The file is examined by the Large Companies and Strategic Groups Unit (UGE) of the migration ministry, which asks Spain\'s National Innovation Company (ENISA) for a report. If ENISA\'s report is favourable, a three-year residence permit is issued.',
  },
  {
    q: 'How much money do I need to show?',
    a: 'For the business itself, nothing: the UGE states plainly that there is no minimum investment and no minimum job creation. For your own living costs, the law only asks for "sufficient financial resources", and the criterion the immigration administration published for entrepreneurs is 100% of the IPREM index a month: €600 a month for one person in 2026. The €34,188 figure repeated everywhere belongs to the remote-work (digital nomad) permit, not to this route.',
  },
  {
    q: 'How long does it take?',
    a: 'On paper it is the shortest route in Europe: ENISA must report within ten working days, the UGE decides within twenty days, and if it does not, the application counts as granted (positive silence). The consulate also has ten working days. But for nationalities subject to Schengen prior consultation, Iran among them, the ten consular days are not guaranteed; see the question on that below.',
  },
  {
    q: 'How long is the first residence permit?',
    a: 'Three years, whether you apply from inside Spain or from abroad. Article 69 sets the entrepreneur permit at three years. "The consulate only gives one year" is a misreading: the visa the consulate puts in your passport is valid for one year because it is an entry document, but the residence permit the UGE granted runs for three years and continues, after you arrive, with the TIE residence card.',
  },
  {
    q: 'Do I need to register a company first?',
    a: 'Not before the application. ENISA assesses your plan and your profile, not a company you do not have yet. Setting up a company (usually an SL, a limited liability company) or registering as self-employed with Social Security (RETA) comes after the permit. Since 2022, under Law 18/2022, the minimum share capital of an SL is one euro; the €3,000 figure is no longer required.',
  },
  {
    q: 'Can my family come at the same time?',
    a: 'Yes, and this is one of the genuinely best parts of the route. Article 62 lets your spouse, children under 18, older children who are financially dependent, and dependent parents apply at the same time as you, in which case the applications are decided together. The one-year wait for family reunification that applies to ordinary Spanish permits does not apply here.',
  },
  {
    q: 'Do I need to speak Spanish?',
    a: 'Not as a legal condition of the ENISA and UGE file, but the forms and portals are in Spanish and every foreign document needs a sworn translation (traducción jurada). For citizenship, passing the DELE Spanish exam at A2 and the constitutional and cultural knowledge test (CCSE) is mandatory.',
  },
  {
    q: 'What if I am refused?',
    a: 'The UGE\'s decision is reasoned and, under article 76, open to an administrative appeal (recurso de alzada). In practice most refusals come from a negative ENISA report, and the right response is usually to fix the plan and apply again rather than fight the same file.',
  },
];

const deepDiveFaqs = [
  {
    q: 'What exactly does ENISA look at?',
    a: 'Article 70 names three things. One, the applicant\'s professional profile and role in the project, and where there are several partners, each one\'s contribution, whether or not they need a visa. Two, the business plan: a description of the project, the product or service, and its financing, including the capital required and its possible sources. Three, the added value for the Spanish economy, innovation or investment opportunity. The activity must be "innovative and/or of special economic interest for Spain". "And/or": you do not need both.',
  },
  {
    q: 'What should the business plan contain?',
    a: 'The immigration administration\'s own guidance lists: a description of the project (activity, start date, location, the company\'s legal form, economic impact, the number and type of jobs you expect to create, the sales and marketing plan); a detailed description of the product or service and its innovative aspects; market, competitor and customer analysis; financing and the financial plan; the added value for the Spanish economy; and the applicant\'s role in the company\'s organisation. A plan whose market is your home country or its diaspora has not answered the third criterion.',
  },
  {
    q: 'What does positive administrative silence mean, and does it really help?',
    a: 'Article 76 says that if the UGE does not decide within twenty days of the electronic filing, the permit is deemed granted by administrative silence. That is a genuine legal advantage that few countries offer. But two conditions are often forgotten: the file must have been filed complete, and if the UGE asks for further documents, the clock stops. Positive silence does not replace a good file; it only saves you from waiting indefinitely.',
  },
  {
    q: 'Why is the ten-day consular deadline not guaranteed for every nationality?',
    a: 'Article 75.5 of Law 14/2013 expressly excludes from the consulate\'s ten-working-day deadline "applicants subject to the consultation in article 22 of the Visa Code" and returns them to the Visa Code\'s general deadlines. Iran is on the list of countries whose nationals at least one Schengen state requires prior consultation for. So if you are from such a country and apply through a consulate, do not build your plan around ten days.',
  },
  {
    q: 'Should I apply from inside Spain or from my own country?',
    a: 'Both start with the UGE. If you are lawfully in Spain, for example on a Schengen visa, you or your legal representative file electronically with the UGE and, once approved, apply directly for the residence card. If you are outside, article 69 provides for a single application that moves the residence permit through the UGE first and then the visa through the consulate. One important difference: someone in Spain on a short stay gives their criminal record certificate to the UGE; someone applying from abroad gives it to the consulate.',
  },
  {
    q: 'How many years of criminal record certificates do I need?',
    a: 'The law (article 62) asks for certificates from the countries you lived in over the past two years, plus a written declaration that you have had no criminal record in the past five. But consulates can be stricter: the Spanish Consulate in London\'s official page asks for certificates covering the past five years and says a certificate must not be more than six months old. Go by your own consulate\'s list. The certificate must be apostilled or legalised and carry an official Spanish translation.',
  },
  {
    q: 'Does the health insurance have to be "without co-payments"?',
    a: 'The law only says public or private health insurance with an insurer authorised to operate in Spain. The phrase "sin copago" (without co-payment) is not in Law 14/2013. But because that condition is common in Spain\'s other visas and caseworkers are used to it, a comprehensive policy with no co-payments and no waiting period is the safer choice, and its extra cost is small compared with the risk of refusal.',
  },
  {
    q: 'For how long do I have to show the funds?',
    a: 'The law says "for the period of residence in Spain". The administration\'s criterion is monthly, so the question is how many months to multiply by. When the permit was two years, the common practice was 24 months. Now that the first permit is three years, covering the whole period means about €21,600 for one person, €32,400 for a couple and €43,200 for a family of three. That multiplication is ours, not a published UGE figure, but a file that covers the whole period leaves nothing to argue about. The money must be your own, and you may be asked for a year of bank statements.',
  },
  {
    q: 'What do I do after arriving in Spain?',
    a: 'A permit for more than six months needs a residence card (article 76). In practice: register your address with the town hall (empadronamiento), book a fingerprinting appointment with the police, complete form EX-17 and pay the fee with form 790 code 012, then collect your TIE card a few weeks later. If you entered the Schengen area through another country and have no Spanish entry stamp, you must also file a declaration of entry (declaración de entrada). A practical point: under the same article, for the first six months your passport is enough to register with Social Security, so do not wait for the card to start working.',
  },
  {
    q: 'How does renewal work, and when do I get permanent residence and a passport?',
    a: 'After three years, renewal in two-year periods, provided the conditions that created the permit still hold: the business must genuinely be active. Filing the renewal extends your permit until the decision, and even an application filed up to 90 days after expiry keeps it valid, though it may carry a fine. Permanent residence after five years. Citizenship by residence, under the Spanish Civil Code, needs ten years of legal, continuous residence; the reduction to two years is only for nationals of Latin American countries, Andorra, the Philippines, Equatorial Guinea and Portugal, and for Sephardic Jews.',
  },
  {
    q: 'Can I keep my current nationality when I become Spanish?',
    a: 'Only if your country is covered by an exception. Spain has no dual-nationality agreement with Iran, for example, and Iran is not among the exceptions in article 23 of the Spanish Civil Code, so an Iranian applicant must formally declare that they renounce their previous nationality when taking Spanish citizenship. If that applies to you, put it in your calculation today, not in year nine.',
  },
  {
    q: 'Do the Beckham Law and the 15% corporate tax rate apply to me?',
    a: 'They are two separate things and often confused. The special tax regime for newcomers (known as the Beckham Law) has, since the 2022 Startups Law, also covered people who come to Spain for an article 70 entrepreneurial activity: Spanish income up to €600,000 taxed at a flat 24%, provided you were not tax-resident in Spain in the five years before you came. The 15% corporate tax rate, however, belongs to the "emerging company" (empresa emergente), which needs a separate certificate from ENISA; a favourable ENISA report for residence is not automatically that certificate.',
  },
  {
    q: 'How is this route different from the ordinary self-employed (cuenta propia) permit?',
    a: 'The ordinary self-employed permit falls under the general immigration regulation, not Law 14/2013: it goes through a consulate, is assessed by the provincial labour office, has no twenty-day deadline or positive silence, and does not let your family come at the same time. For a traditional business (a café, a shop, local services) that is the route, because ENISA will not approve a plan that is neither innovative nor of special economic interest. If your plan is genuinely scalable, the Law 14/2013 route is better in every respect.',
  },
  {
    q: 'How many co-founders can apply together?',
    a: 'Spanish law sets no cap on the number of founders. ENISA assesses each partner\'s contribution separately, and each one has their own residence file. The "maximum of five co-founders" figure that appears in some presentations is the Italian startup visa\'s rule, not Spain\'s.',
  },
];

const related = [
  { href: '/country/italy', code: 'it' as FlagCode, title: 'Italy startup visa', blurb: 'A 30-day committee with no interview, but €50,000 for the team and a cap of five founders.' },
  { href: '/country/denmark', code: 'dk' as FlagCode, title: 'Start-up Denmark', blurb: 'A transparent scoring panel and a clear route to permanent residence, inside a quota of 75 a year.' },
  { href: '/europe/netherlands', code: 'nl' as FlagCode, title: 'Netherlands startup visa', blurb: 'A recognised facilitator is mandatory, and the one-year permit is not extended.' },
];

function spainJsonLd() {
  const hub = pageCopy('/country', 'en');
  return [
    {
      ...webPageJsonLd({ title: SPAIN_EN.title, description: SPAIN_EN.description, url: PAGE_URL, locale: 'en' }),
      dateModified: UPDATED.iso,
      author: { '@id': FOUNDER_ID },
      citation: sources.map((s) => s.href),
    },
    breadcrumbJsonLd([
      { name: 'Home', url: `${SITE_URL}/en` },
      ...(hub ? [{ name: hub.title, url: `${SITE_URL}/en/country` }] : []),
      { name: SPAIN_EN.title, url: PAGE_URL },
    ]),
    howToJsonLd,
    faqJsonLd([...faqs, ...deepDiveFaqs].map((f) => ({ question: f.q, answer: f.a })), 'en'),
  ];
}

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const body = 'font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70';

export default function SpainEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={spainJsonLd()} />

      <RouteProvider stops={STOPS} flag="es" theme={THEME}>
        {/* ── Hero ── */}
        <header className="relative overflow-hidden bg-[#2B0A0F] text-white">
          <Image
            src="/fa/img/spain.webp"
            alt="The Metropolis building in Madrid, with its black-and-gold dome and winged statue, at the corner of Gran Vía and Calle de Alcalá on a sunny day, with taxis and motorbikes in the street"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B0A0F]/95 via-[#2B0A0F]/80 to-[#2B0A0F]/35" />
          {/* The civil flag, faint, at its own 3:2 proportions (1:2:1 bands). */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-12 grid aspect-[3/2] w-[540px] grid-rows-[1fr_2fr_1fr] opacity-10">
            <span className="bg-[#c60b1e]" />
            <span className="bg-[#ffc400]" />
            <span className="bg-[#c60b1e]" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Spain</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="es" uid="hero" width={36} />
                Spain · Law 14/2013
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Spain <em className="text-[#FFC400]">Emprende.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Spain startup visa (entrepreneur residence permit) in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                ENISA, Spain&apos;s National Innovation Company, judges the plan. The UGE decides within twenty days, and if it does not answer, the
                application is granted. No minimum investment, a three-year first permit, and your family comes at the same time.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against Law 14/2013 (BOE), the UGE and the Spanish Consulate in London</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#FFC400] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The number everyone gets wrong.</strong> The €34,188 in most guides and infographics is the remote-work
                permit&apos;s threshold. For entrepreneurs the criterion is €600 a month for one person.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#FFC400] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Work out the money you really need</li>
                <li>Check yourself against the six requirements</li>
                <li>Walk the six steps</li>
                <li>Sort perks from catches</li>
                <li>Drag yourself to a Spanish passport</li>
              </ol>
              <a href="#money" className="inline-flex items-center gap-2 rounded-full bg-[#FFC400] px-5 py-3 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
                Start the route <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </header>

        <RouteRail />

        {/* 01 — What it is */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="What is the Spain startup visa?"
          task="Read the snapshot"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              It is the entrepreneur residence permit under Spain&apos;s Law 14/2013, rewritten by the 2022 Startups Law. ENISA reports on your plan,
              and the UGE in Madrid decides within twenty days, or the permit is granted by silence. There is no minimum investment, the first permit
              lasts three years, and your family applies with you.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '€0', label: 'Minimum investment', sub: 'and no minimum job creation (UGE)' },
              { stat: '€600', label: 'Means a month', sub: 'one person, 100% of IPREM 2026' },
              { stat: '20 days', label: 'UGE decision', sub: 'no answer means granted' },
              { stat: '3 yrs', label: 'First permit', sub: 'then 2-year renewals' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#A30F1F]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>

          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 ${body}`}>
            <p>
              <strong className="text-[#1a1a1a]">A law for people Spain wants.</strong> In 2013 Spain passed the Law on support for entrepreneurs and
              their internationalisation (Ley 14/2013). It built faster residence routes, separate from the general immigration regulation, for
              foreigners of economic benefit to Spain: entrepreneurs, professionals, researchers and later remote workers. The 2022 Startups Law
              (Ley 28/2022) rewrote the entrepreneur part: the first permit became three years, and the plan&apos;s assessment went to ENISA.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Two bodies.</strong> ENISA, the state innovation company, assesses your plan and your profile and
              reports. The UGE, a unit of the migration ministry in Madrid, takes the residence file, asks ENISA for its report and decides. If you
              are outside Spain, the consulate only comes in after the UGE&apos;s approval, to issue the entry visa.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">A deliberately open test.</strong> An entrepreneurial activity is one that is innovative and/or of
              special economic interest for Spain. You do not need a registered company, a finished product or an investor. You need a plan ENISA
              believes.
            </p>
          </div>

          <p className="mt-6 max-w-[72ch] rounded-2xl border-l-4 border-[#FFC400] bg-[#FFF4CC] p-5 font-sans text-sm leading-relaxed">
            <strong>The sentence that matters more than any infographic.</strong> The UGE&apos;s official page says: &ldquo;There is no minimum
            investment and no minimum job creation.&rdquo; No figure for the business itself is in the law. Anyone who tells you to put a set sum into
            a company to get residence is talking about a different route.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Spain&apos;s entrepreneur residence permit at a glance, 2026</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Item</th>
                  <th scope="col" className="px-4 py-3">Figure</th>
                  <th scope="col" className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Minimum investment', 'None', 'No minimum job creation either (UGE)'],
                  ['Means, applicant', '€600 a month', '100% of IPREM 2026; not €34,188'],
                  ['Means, family', '€900 a month for two', '150% of IPREM, plus 50% for each further person'],
                  ['Assessing body', 'ENISA', 'Mandatory report, within 10 working days'],
                  ['UGE decision', '20 days', 'No answer means granted (positive silence)'],
                  ['Consular deadline', '10 working days', 'Not for applicants subject to Visa Code art. 22 consultation, Iran included'],
                  ['First permit', '3 years', 'The entry visa is one year; the residence permit three'],
                  ['Renewal', '2 years at a time', 'The business must be active'],
                  ['Permanent residence', 'After 5 years', ''],
                  ['Citizenship', 'After 10 years', 'Renouncing your previous nationality unless an exception applies (Iran: no exception)'],
                  ['Family', 'At the same time as you', 'Spouse, children, dependent parents'],
                ].map(([k, v, n]) => (
                  <tr key={k} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{k}</th>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-[#A30F1F]">{v}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RouteStop>

        {/* 02 — Money */}
        <RouteStop
          id="money"
          number={2}
          tone="white"
          eyebrow="Means of support · IPREM 2026"
          question="How much money do you need for the Spain startup visa?"
          task="Set up your household"
          answer={
            <p>
              The business needs no minimum investment. For your living costs, the administration&apos;s criterion for entrepreneurs is 100% of the IPREM
              a month: €600 for one person in 2026, €900 for a couple and €300 more for each further family member. The €34,188 quoted everywhere is the
              remote-work permit&apos;s threshold, not this route&apos;s.
            </p>
          }
        >
          <MeansCalculator stopId="money" rule={meansRule} />

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Means of support for entrepreneurs, 2026 (IPREM €600 a month)</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Household</th>
                  <th scope="col" className="px-4 py-3">Share of IPREM</th>
                  <th scope="col" className="px-4 py-3">A month (official criterion)</th>
                  <th scope="col" className="px-4 py-3">36 months (our multiplication)</th>
                </tr>
              </thead>
              <tbody>
                {meansRows.map((r) => (
                  <tr key={r.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{r.label}</th>
                    <td className="px-4 py-3">{r.share}</td>
                    <td className="px-4 py-3 font-bold tabular-nums text-[#A30F1F]">{r.monthly}</td>
                    <td className="px-4 py-3 tabular-nums">{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
              The published criterion is monthly. Covering the whole three-year permit is the safest way to show it; the 36-month totals are our
              arithmetic, not a UGE figure.
            </p>
          </div>

          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 ${body}`}>
            <div>
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Where €34,188 really comes from</h3>
              <p>
                Almost every guide we have seen puts the means at €34,188 a year for the main applicant, 75% of the minimum wage for a spouse and 25%
                for each child. That formula exists, but it belongs to the permit for international remote workers (article 74 bis of the same law,
                known as the digital nomad visa): 200% of Spain&apos;s minimum wage (SMI), which in 2026 is €1,221 a month in fourteen payments.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">What the law actually asks</h3>
              <p>
                For entrepreneurs, the law itself (article 62) sets no number. It asks for &ldquo;sufficient financial resources for yourself and your
                family for the period of residence&rdquo;. The criterion the Secretary of State for Migration published to apply it uses another index,
                the IPREM: 100% a month for the entrepreneur, at least 150% for a two-person household, and 50% more for each further person. The IPREM
                has been frozen since 2023 and is €600 a month in 2026. It is the administration&apos;s reading of the law, not a figure in the law.
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-[72ch] rounded-2xl border-l-4 border-[#A30F1F] bg-[#FBEBDD] p-5 font-sans text-sm leading-relaxed">
            <strong>Why the mistake matters, both ways.</strong> A family with €40,000 reads &ldquo;€51,282 for a family of three&rdquo; and decides
            Spain is out of reach, when it is not. And someone who borrows to reach that figure forgets that the money must be their own: the
            administration says plainly that the resources must be personal, not a third party&apos;s guarantee or undertaking, and it can ask for a
            year of bank statements.
          </p>
        </RouteStop>

        {/* 03 — Requirements */}
        <RouteStop
          id="requirements"
          number={3}
          eyebrow="Article 62, plus article 70"
          question="What are the requirements for Spain's entrepreneur residence permit?"
          task="Answer all six"
          answer={
            <p>
              You need a favourable ENISA report that your activity is innovative and/or of special economic interest for Spain. You must be 18 or over
              and not an EU citizen, be in no irregular situation or Schengen entry ban, have a clean criminal record, hold health insurance from an insurer
              authorised in Spain, have sufficient means and pay the government fees.
            </p>
          }
        >
          <GateQuiz
            stopId="requirements"
            criteria={requirements}
            strongNote="What decides it now is the ENISA report: a plan built for Spain, a profile that fits it and a credible funding plan."
            gapNote="Certificates, apostilles and sworn translations take months; start the slow ones first."
          >
            <h3 className="font-serif text-xl">The fees, by form</h3>
            <p className="font-sans text-sm text-[#1a1a1a]/65">
              Tasa 790 code 038 for the residence application to the UGE, and later tasa 790 code 012 for the residence card. See the amount on the
              form on the day you generate it; the figures change yearly.
            </p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#FFC400] px-5 py-3 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
              Get a free read on your plan <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Government fees and forms (amounts shown on each form when generated)</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Form</th>
                  <th scope="col" className="px-4 py-3">Pays for</th>
                  <th scope="col" className="px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.form} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold">{f.form}</th>
                    <td className="px-4 py-3">{f.for}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{f.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
              We do not quote these amounts: none could be read off an official page, and the figures in circulation disagree.
            </p>
          </div>

          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 ${body}`}>
            <p>
              <strong className="text-[#1a1a1a]">Criminal record.</strong> The law asks for certificates from the countries you lived in over the past
              two years, plus a written declaration for the past five. The Spanish Consulate in London asks for five years of certificates, no older than
              six months. Go by your consulate&apos;s list. Each certificate needs an apostille or legalisation and an official Spanish translation.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Health insurance.</strong> The law only requires public or private insurance from an insurer authorised
              in Spain; &ldquo;sin copago&rdquo; (no co-payment) is not in Law 14/2013. Caseworkers know that condition from Spain&apos;s other visas, so a
              comprehensive policy with no co-payments and no waiting period is the safer choice.
            </p>
          </div>
        </RouteStop>

        {/* 04 — ENISA */}
        <RouteStop
          id="enisa"
          number={4}
          tone="white"
          eyebrow="The real gate"
          question="What does ENISA look for in a Spain startup visa business plan?"
          task="Read the three criteria"
          completeOn="view"
          message="ENISA's criteria read"
          answer={
            <p>
              ENISA weighs three things under article 70: your professional profile and role (and each partner&apos;s contribution), the business plan and
              how it is financed, and the added value for the Spanish economy, innovation or investment. The activity must be innovative and/or of special
              economic interest for Spain. A traditional café or shop does not qualify.
            </p>
          }
        >
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { t: 'Your profile and role', b: 'The applicant\'s professional profile and involvement in the project. With several partners, ENISA assesses each one\'s contribution, those who need a visa and those who do not. A CV with nothing in the plan\'s field has already lost this criterion.' },
              { t: 'The plan and its funding', b: 'A description of the project, the product or service, and its financing, including the investment required and possible sources. The law sets no minimum, but the plan must show where the money to execute it comes from.' },
              { t: 'Value for Spain', b: 'What generates added value for the Spanish economy, innovation or investment opportunities. The plan must be built for the Spanish or European market; a generic model with no local market analysis is exactly what gets refused.' },
            ].map((x, i) => (
              <li key={x.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-5">
                <span className="font-sans text-xs tabular-nums text-[#A30F1F]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 font-serif text-xl">{x.t}</h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{x.b}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className={body}>
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">What goes into the business plan</h3>
              <p className="mb-3">
                ENISA is a state company that finances innovation, and for years its job has been lending to Spanish startups. Your plan is read by people
                whose work is judging businesses, not by immigration officers. The immigration administration&apos;s own guidance lists:
              </p>
              <ul className="grid list-disc gap-1 pl-5">
                <li>The project: activity, start date, location, the company&apos;s legal form, economic impact, the number and type of jobs you expect, and the sales and marketing plan.</li>
                <li>The product or service in detail, with its innovative aspects.</li>
                <li>Market, competitors and potential customers.</li>
                <li>Financing and the financial plan.</li>
                <li>The added value for the Spanish economy.</li>
                <li>The applicant&apos;s role in the company&apos;s organisation.</li>
              </ul>
            </div>
            <div className="self-start rounded-2xl border-l-4 border-[#A30F1F] bg-[#FBEBDD] p-6">
              <h3 className="mb-2 font-serif text-2xl text-[#A30F1F]">Not every business belongs here</h3>
              <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/80">
                A traditional business (a restaurant, a shop, a service agency with nothing innovative or scalable) does not fit this route. ENISA will not
                see it as of special economic interest. There is an ordinary self-employed permit for it: slower and narrower, but built for exactly that.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 05 — Steps */}
        <RouteStop
          id="steps"
          number={5}
          eyebrow="The official order"
          question="How do you apply for the Spain startup visa?"
          task="Walk to step 6"
          answer={
            <p>
              Complete ENISA&apos;s online questionnaire, prepare form MIT and pay tasa 790-038, then file electronically with the UGE using a digital
              certificate or a representative. ENISA reports within ten working days and the UGE decides within twenty. From abroad, you then get a
              one-year entry visa at your consulate; in Spain, you collect a TIE card.
            </p>
          }
        >
          <SpainSteps stopId="steps" steps={steps} />

          <p className="mt-6 max-w-[72ch] rounded-2xl border-l-4 border-[#FFC400] bg-[#FFF4CC] p-5 font-sans text-sm leading-relaxed">
            <strong>When the twenty days start.</strong> The UGE&apos;s twenty days run from the electronic filing, and silence after that means yes. That
            only works if the file was complete. A file sent with missing documents gets a request to complete it, which stops the clock, and most of the
            delays you hear about come from there, not from a slow administration.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Legal deadlines under Law 14/2013</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Stage</th>
                  <th scope="col" className="px-4 py-3">Who</th>
                  <th scope="col" className="px-4 py-3">Deadline</th>
                  <th scope="col" className="px-4 py-3">Article</th>
                  <th scope="col" className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {deadlines.map((d) => (
                  <tr key={d.stage} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{d.stage}</th>
                    <td className="px-4 py-3">{d.who}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-[#A30F1F]">{d.limit}</td>
                    <td className="px-4 py-3">{d.law}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 ${body}`}>
            <p>
              <strong className="text-[#1a1a1a]">From inside Spain.</strong> If you are lawfully in Spain, for example on a Schengen visa, you or your
              representative file with the UGE and, once approved, apply directly for the residence card. Filing extends your current short-stay status
              until the decision (article 76), but only with a valid visa and not a single day of irregular stay. Your criminal record certificate goes to
              the UGE.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">From abroad.</strong> Article 69 provides for a single application: the residence permit moves through
              the UGE first, then the visa through the consulate in the country where you legally live. Your criminal record certificate goes to the
              consulate. If you entered Schengen elsewhere and have no Spanish entry stamp, also file a declaration of entry (declaración de entrada).
            </p>
          </div>
        </RouteStop>

        {/* Photo band: Barcelona */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#2B0A0F] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/spain-2.webp"
              alt="A domed stone corner building with iron balconies on Via Laietana in Barcelona, with yellow-and-black taxis and pedestrians under a cloudy sky"
              fill
              sizes="100vw"
              className="object-cover object-[center_45%]"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B0A0F]/20 to-[#2B0A0F]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#FFC400] ${label}`}>Barcelona or Madrid</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Two startup hubs.<br />
                <span className="italic text-[#FFC400]">One unit in Madrid decides.</span>
              </p>
              <p className="mt-2 max-w-[48ch] font-sans text-sm text-white/70">
                Barcelona and Madrid are Spain&apos;s two main startup poles, but your file is examined by the UGE in Madrid, not by the city.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">Via Laietana, Barcelona</span>
          </figcaption>
        </figure>

        {/* 06 — Family */}
        <RouteStop
          id="family"
          number={6}
          tone="white"
          eyebrow="Article 62"
          question="Can your family come with you on the Spain startup visa?"
          task="Read who qualifies"
          completeOn="view"
          message="Family covered"
          answer={
            <p>
              Yes. Your spouse or partner, children under 18, older children who are financially dependent and have not formed their own family, and
              dependent parents can apply at the same time as you, or later. If they apply together, they are decided together, with no one-year wait for
              family reunification.
            </p>
          }
        >
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Spouse or partner', b: 'Marriage certificate or proof of the partnership.' },
              { t: 'Children under 18', b: 'Birth certificates.' },
              { t: 'Adult children', b: 'Proof that they are financially dependent and have not formed a family of their own.' },
              { t: 'Dependent parents', b: 'Proof that they are in your care.' },
            ].map((f) => (
              <li key={f.t} className="rounded-xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-4">
                <h3 className="font-sans text-sm font-bold">{f.t}</h3>
                <p className="mt-1 font-sans text-sm text-[#1a1a1a]/65">{f.b}</p>
              </li>
            ))}
          </ul>
          <p className={`mt-6 max-w-[72ch] ${body}`}>
            Every family member meets the same general conditions: a passport, health insurance, means (already counted in the household criterion) and
            proof of the relationship. Every foreign document needs an apostille or legalisation and an official Spanish translation.
          </p>
        </RouteStop>

        {/* 07 — Perks and catches */}
        <RouteStop
          id="catches"
          number={7}
          eyebrow="Perk or catch?"
          question="What are the advantages and drawbacks of the Spain startup visa?"
          task="Guess all eight"
          answer={
            <p>
              The advantages are real: a legal decision in twenty days with positive silence, no minimum investment, a three-year first permit and family
              on day one. The drawbacks: ten years to citizenship, Spanish-only paperwork with sworn translations, filing that needs a Spanish digital
              certificate, and renewals that require a genuinely active business.
            </p>
          }
        >
          <PerkOrCatch stopId="catches" items={rights} />
          <div className="mt-10 max-w-4xl">
            <h3 className="mb-3 font-serif text-2xl">What the sales pitch leaves out</h3>
            <ul className="grid list-disc gap-2 pl-5 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
              {bottlenecks.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        </RouteStop>

        {/* 08 — Tax */}
        <RouteStop
          id="tax"
          number={8}
          tone="white"
          eyebrow="Tax, without the hype"
          question="What tax benefits can a startup founder get in Spain?"
          task="Read both regimes"
          completeOn="view"
          message="Tax regimes read"
          answer={
            <p>
              Two, and they are often confused. The newcomers&apos; regime (the Beckham Law) taxes Spanish income up to €600,000 at a flat 24% for the year
              you arrive and five more, if you were not tax-resident in Spain for the previous five years. The 15% corporate rate needs a separate ENISA
              &ldquo;emerging company&rdquo; certificate.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-6">
              <p className={`text-[#A30F1F] ${label}`}>You, personally</p>
              <h3 className="mt-1 font-serif text-2xl">The newcomers&apos; regime (Beckham Law)</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                Since the 2022 Startups Law it also covers people who come for an article 70 entrepreneurial activity. Spanish income up to €600,000 is
                taxed at a flat 24% instead of progressive rates, for the year of arrival and the five years after, provided you were not tax-resident in
                Spain in the five years before.
              </p>
            </div>
            <div className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-6">
              <p className={`text-[#A30F1F] ${label}`}>Your company</p>
              <h3 className="mt-1 font-serif text-2xl">15% corporate tax instead of 25%</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                For the first profitable period and the three after it. It belongs to the &ldquo;emerging company&rdquo; (empresa emergente) under Law
                28/2022 and needs a separate certificate from ENISA. A favourable ENISA report for residence is not that certificate.
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-[72ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Do not build your financial model on either</strong> until a Spanish tax adviser has looked at your case.
            Both have conditions we summarise here, not in full.
          </p>
        </RouteStop>

        {/* Photo band: Valencia */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#2B0A0F] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/spain-3.webp"
              alt="Valencia's City of Arts and Sciences: the white ribbed science museum, the white cable-stayed bridge and the blue-and-green Agora building beside a reflecting pool"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B0A0F]/20 to-[#2B0A0F]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#FFC400] ${label}`}>Choose your city</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                Valencia is growing.<br />
                <span className="italic text-[#FFC400]">Name your city in the plan.</span>
              </p>
              <p className="mt-2 max-w-[48ch] font-sans text-sm text-white/70">
                Spain&apos;s third-largest city and one of its growing ecosystems. ENISA asks where the activity will be, so say it in the business plan.
              </p>
            </div>
            <span className="font-sans text-xs text-white/55">City of Arts and Sciences, Valencia</span>
          </figcaption>
        </figure>

        {/* 09 — Roadmap */}
        <RouteStop
          id="roadmap"
          number={9}
          eyebrow="Renewal, residence, passport"
          question="How long does it take to get Spanish permanent residence and citizenship?"
          task="Drag yourself through the years"
          answer={
            <p>
              The first permit lasts three years, then renews two years at a time while the business stays active. Permanent residence comes after five
              years of legal, continuous residence. Citizenship takes ten, with the DELE A2 and CCSE tests and, unless an exception applies, renouncing
              your previous nationality. Only some nationalities qualify after two years.
            </p>
          }
        >
          <YearsRoadmap stopId="roadmap" routes={prRoutes} defaultRoute={0} copy={roadmap} />
          <ul className="mt-6 grid max-w-5xl grid-cols-1 gap-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <li>
              <strong className="text-[#1a1a1a]">Renewal, two years at a time,</strong> as long as the conditions that created the permit still hold. The
              business must be active: a registered company or self-employed registration (RETA), with tax and social security payments, is the evidence.
            </li>
            <li>
              <strong className="text-[#1a1a1a]">File on time, or within 90 days.</strong> A renewal application keeps your permit valid until the
              decision. One filed up to 90 days after expiry also keeps it valid, but may bring an administrative fine.
            </li>
            <li>
              <strong className="text-[#1a1a1a]">Permanent residence</strong> after five years of legal, continuous residence.
            </li>
            <li>
              <strong className="text-[#1a1a1a]">Citizenship</strong> after ten years of legal, continuous residence under the Civil Code. The two-year
              reduction is only for nationals of Latin American countries, Andorra, the Philippines, Equatorial Guinea and Portugal, and for Sephardic
              Jews.
            </li>
          </ul>
          <p className="mt-6 max-w-3xl rounded-2xl bg-[#2B0A0F] p-6 font-sans text-sm leading-relaxed text-white/75">
            <strong className="text-white">Fast in, slow to a passport.</strong> If your end goal is an EU passport, Spain gives the fastest entry but the
            longest road to citizenship. Compare it with Denmark and the Netherlands, not just with the twenty-day decision.
          </p>
        </RouteStop>

        {/* 10 — Compare */}
        <RouteStop
          id="compare"
          number={10}
          tone="white"
          eyebrow="Spain against the rest"
          question="How does the Spain startup visa compare with other European startup visas?"
          task="Read the comparison"
          completeOn="view"
          message="Routes compared"
          answer={
            <p>
              Spain has the fastest legal decision, with positive silence, no minimum investment, low means, a three-year first permit and family at the
              same time. Against that: ten years to citizenship and Spanish-language bureaucracy. Italy asks €50,000 for the team, Denmark has a quota of
              75 and far higher means, and the Dutch permit lasts one year.
            </p>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl bg-[#F2F0E9] font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Spain&apos;s entrepreneur permit against four European startup routes</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3">Country</th>
                  <th scope="col" className="px-4 py-3">In its favour</th>
                  <th scope="col" className="px-4 py-3">Against it</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c) => (
                  <tr key={c.country} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left">
                      <span className="flex items-center gap-2 font-bold">
                        <Flag code={c.code} uid={`cmp-${c.code}`} width={22} />
                        {c.country}
                      </span>
                    </th>
                    <td className="px-4 py-3">{c.plus}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/70">{c.minus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-[72ch] rounded-2xl border-l-4 border-[#FFC400] bg-[#FFF4CC] p-5 font-sans text-sm leading-relaxed">
            <strong>A simple rule.</strong> If you have a genuinely innovative plan, not much capital, and want your family with you from day one: Spain.
            If your end goal is a passport, weigh Spain&apos;s ten years against the other routes.
          </p>
        </RouteStop>

        {/* 11 — Sanctioned countries */}
        <RouteStop
          id="sanctioned"
          number={11}
          eyebrow="For applicants from sanctioned countries"
          question="What changes if you apply from Iran or another sanctioned country?"
          task="Read the six points"
          completeOn="view"
          message="Sanctions notes read"
          answer={
            <p>
              For Iranian passport holders the ten-day consular deadline is not guaranteed, Iranian bank balances are effectively not accepted as proof of
              funds, opening a Spanish account takes longer, criminal record certificates need legalisation rather than an apostille, and Spain has no
              dual-nationality arrangement with Iran. Filing from inside Spain, lawfully, avoids the consulate.
            </p>
          }
        >
          <p className="mb-4 max-w-[72ch] font-sans text-sm text-[#1a1a1a]/60">
            These notes are written for Iranian passport holders. If you hold another passport, check how each one applies to your nationality.
          </p>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { t: 'The ten consular days are not guaranteed', b: 'Article 75 excludes applicants subject to prior consultation under article 22 of the Schengen Visa Code from the ten-day deadline, and Iran is on that list.' },
              { t: 'Filing from inside Spain skips the consulate', b: 'If you are lawfully in Spain on a Schengen visa, you can apply directly from there. The application extends your current short-stay status until the decision (article 76). A big advantage, but only with a valid visa and not one day of irregular stay.' },
              { t: 'Funds must be readable', b: 'Proof of means must sit in an account the Spanish administration can read and whose movements it can see. A balance in an Iranian bank is effectively not accepted; plan on that from the start.' },
              { t: 'Banking takes longer', b: 'Opening a Spanish bank account with an Iranian passport takes more time and paperwork because of anti-money-laundering rules. Budget the first months on that assumption.' },
              { t: 'Legalisation, not an apostille', b: 'Iran is not a party to the Apostille Convention, so an Iranian criminal record certificate needs authentication by Iran\'s foreign ministry and the Spanish embassy, plus an official Spanish translation. Start early: a certificate counts as stale after six months.' },
              { t: 'Define the market as Spain', b: 'Do not define your plan\'s market as Iran or the Iranian diaspora. ENISA\'s third criterion is added value for the Spanish economy.' },
            ].map((x, i) => (
              <li key={x.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                <span className="font-sans text-xs tabular-nums text-[#A30F1F]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 font-serif text-xl">{x.t}</h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#1a1a1a]/65">{x.b}</p>
              </li>
            ))}
          </ol>
        </RouteStop>

        {/* 12 — FAQ */}
        <RouteStop
          id="faq"
          number={12}
          tone="white"
          eyebrow="Questions founders ask"
          question="Spain startup visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Twenty-two answers, from how much money to show and how long the permit lasts to ENISA&apos;s criteria, positive silence, renewal, tax and how many co-founders can apply.</p>}
        >
          <FaqGroups />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* How we work */}
        <section aria-labelledby="work-h" className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <p className={`text-[#A30F1F] ${label}`}>Where we fit</p>
            <h2 id="work-h" className="mt-2 max-w-4xl font-serif text-3xl leading-tight md:text-4xl">What VisaRoads does, and does not do, on a Spain file</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className={body}>
                <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Our role</h3>
                <p className="mb-3">
                  We are not Spanish immigration lawyers, and we do not file the UGE or consular application on your behalf. Our work comes before the
                  file: taking your plan to a favourable ENISA report.
                </p>
                <ul className="grid list-disc gap-1 pl-5 text-sm">
                  <li>An honest check of whether your plan is &ldquo;innovative and/or of special economic interest for Spain&rdquo;, before you spend money.</li>
                  <li>The business plan, Spanish market analysis and financial model, in the structure the immigration administration lists and ENISA assesses.</li>
                  <li>Aligning each founder&apos;s CV and role with the plan, since ENISA assesses each partner separately.</li>
                  <li>Preparing the ENISA portal questionnaire and documents.</li>
                  <li>Support in the next stage (family documents, proof of means, the first weeks in Spain) alongside the lawyer or representative who files the residence application.</li>
                </ul>
              </div>
              <div className={body}>
                <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Four phases, three instalments</h3>
                <p className="mb-3">Each instalment is tied to a real event in the file, not to the passing of time.</p>
                <ol className="grid list-decimal gap-1 pl-5 text-sm">
                  <li>Contract, idea review, fit with article 70, Spanish market research and the business plan. First instalment on signing.</li>
                  <li>Filing the plan on the ENISA portal and the residence application, up to the favourable ENISA report. Second instalment with the favourable report.</li>
                  <li>Support preparing consular documents or the residence card.</li>
                  <li>Your and your family&apos;s residence is issued. Third instalment when residence is issued.</li>
                </ol>
                <p className="mt-3 text-sm">The contract runs twelve months from signing and payment of the first instalment.</p>
              </div>
              <div className={body}>
                <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">The refund undertaking, exactly</h3>
                <p className="mb-3 text-sm">
                  What we undertake is a favourable ENISA report for your plan, and only that. If we do not obtain it within twelve months of the first
                  instalment, 100% of what you paid is refunded at the day&apos;s euro rate. That includes a negative ENISA report caused by structural or
                  content weaknesses in the business plan: that is our work and our responsibility.
                </p>
                <ul className="grid list-disc gap-1 pl-5 text-sm">
                  <li>No refund if the UGE, a consulate or the police refuse residence or a visa for any reason other than the ENISA report. That decision belongs to another body.</li>
                  <li>No refund if a refusal is due to your own personal or identity issues: problems with civil documents and translations or your passport, forged documents, a criminal record, or being unable to provide proof of means.</li>
                  <li>No refund if you do not pay government and consular fees on time or provide the personal documents Spain requires and the delay passes two months; the contract is then terminated in VisaRoads&apos; favour.</li>
                  <li>If you withdraw at any stage, the remaining instalments are due within seven working days.</li>
                </ul>
              </div>
            </div>
            <p className="mt-8 max-w-[72ch] rounded-2xl border-l-4 border-[#A30F1F] bg-white p-5 font-sans text-sm leading-relaxed">
              <strong>This is not a residence guarantee.</strong> No one outside ENISA and the UGE can guarantee their decision. If anyone sells you a
              guaranteed residence permit, walk away there and then.
            </p>
          </div>
        </section>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#A30F1F] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="break-words font-bold underline decoration-[#FFC400] decoration-2 underline-offset-2 hover:text-[#A30F1F]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked 29 Oct 2026.</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 max-w-3xl font-sans text-xs text-[#1a1a1a]/55">
              Re-check each January: the IPREM, which moves only with a budget law, and the UGE pages, which still link document lists from 2018 that
              predate Law 28/2022.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#2B0A0F] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#FFC400] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Bring your plan to a <span className="italic text-[#FFC400]">free session.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                Pick a time, come prepared, and get an honest read on whether your plan is innovative and/or of special economic interest for Spain, your
                numbers and whether Spain is the right route. If it isn&apos;t, we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#FFC400] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/which-path" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-sans text-sm font-bold transition-colors hover:bg-white/10">
                  See if Spain fits you
                </Link>
              </div>
            </div>
            <address className="grid gap-2.5 not-italic">
              <p className={`text-white/60 ${label}`}>Or reach us directly</p>
              {[
                { k: 'Phone & WhatsApp', v: MAIN_CONTACT.phone, copy: MAIN_CONTACT.phoneE164, links: [{ label: 'Call', href: MAIN_CONTACT.tel }, { label: 'WhatsApp', href: MAIN_CONTACT.whatsapp }] },
                { k: 'Email', v: MAIN_CONTACT.email, copy: MAIN_CONTACT.email, links: [{ label: 'Email', href: `mailto:${MAIN_CONTACT.email}` }] },
                { k: 'Telegram', v: MAIN_CONTACT.telegramHandle, copy: null, links: [{ label: 'Open', href: MAIN_CONTACT.telegram }] },
              ].map((c) => (
                <div key={c.k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">{c.k}</span>
                  <span className="col-start-2 row-span-2 row-start-1 flex flex-wrap justify-end gap-1.5">
                    {c.copy && <CopyButton value={c.copy} />}
                    {c.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="rounded-full border border-white/30 px-3 py-1.5 font-sans text-xs transition-colors hover:bg-white/10"
                      >
                        {l.label}
                      </a>
                    ))}
                  </span>
                  <span className="select-all break-all font-sans text-lg tabular-nums">{c.v}</span>
                </div>
              ))}
            </address>
          </div>
        </section>

        {/* Related guides: no English Spain articles are published yet (sitemap checked 29 Oct 2026). */}
        <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <p className={`text-[#A30F1F] ${label}`}>Keep reading</p>
            <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More European startup visa guides</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.href} className="group rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2B0A0F]/10">
                  <Link href={r.href} className="grid gap-3 p-6">
                    <Flag code={r.code} uid={`rel-${r.code}`} width={40} />
                    <h3 className="font-serif text-2xl leading-snug">{r.title}</h3>
                    <span className="font-sans text-sm text-[#1a1a1a]/65">{r.blurb}</span>
                    <span className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#A30F1F]">
                      Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Notice */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Regulatory Notice:</strong> Figures on this page were checked on 29 October 2026 against the consolidated text of Law 14/2013 in the
              BOE, the UGE&apos;s entrepreneur pages and the Spanish Consulate in London&apos;s entrepreneur-visa page. They are provided for informational
              purposes only. VisaRoads Inc., an Ashavid company, is a strategic business advisory firm — we are <span className="underline">NOT</span> an
              immigration law firm. A favourable ENISA report does not guarantee a residence permit; the decision belongs to the UGE and, for the visa,
              the consulate. Always verify current requirements at{' '}
              <a href="https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#A30F1F]">inclusion.gob.es</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqGroups() {
  const groups = [
    { heading: 'The essentials', items: faqs },
    { heading: 'ENISA, deadlines, family and renewal, in detail', items: deepDiveFaqs },
  ];
  return (
    <div className="grid max-w-4xl gap-12">
      {groups.map((g) => (
        <div key={g.heading}>
          <h3 className={`mb-2 text-[#A30F1F] ${label}`}>{g.heading}</h3>
          <div className="border-t border-[#1a1a1a]/10">
            {g.items.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-[#1a1a1a]/10" data-faq>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#A30F1F] group-open:text-[#A30F1F] [&::-webkit-details-marker]:hidden">
        <h4 className="font-serif text-xl leading-snug">{q}</h4>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
