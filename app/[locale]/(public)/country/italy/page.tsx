// ============================================================================
// Page: app/[locale]/(public)/country/italy/page.tsx
// Layout: a guided route, built on the /country/finland pattern. A Florence
// hero with the answer up front, a sticky rail whose Italian flag rises as the
// reader completes each stop, and one stop per question people actually
// search. Every stop opens with its question as the H2 and a ~50-word direct
// answer (the passage answer engines quote), then the detail: real tables,
// lists and a small game on top. The games the shared widgets do not cover
// (founder cap, the two funding doors, the renewal ladder) live in
// ./ItalyWidgets.tsx. All copy is rendered on the
// server, so crawlers and AI engines read the whole page.
//
// No video stop: there is no English Italy walkthrough to embed. No
// citizenship roadmap: this page states no citizenship period, so it maps the
// renewals to the EU long-term permit and stops there.
//
// Subject: the Italia Startup Visa — a self-employment visa in the "startup"
// category, decided by a technical committee at MIMIT on documents alone.
//
// This is the English twin of /fa/europe/italy, written in the same pass.
// Everything here comes from that guide's verification (2026-09-24, see
// content/fa/europe-italy.ts) against the two official MIMIT guideline PDFs
// (the original and the 20/03/2018 revision, which is the operative one), so
// the two pages must move together.
//
// THE FACT THIS PAGE LEADS WITH: a maximum of five Certificates of No
// Impediment per startup, ten only in exceptional cases. Almost every English
// and Persian write-up of this route says there is no cap on founders. The
// guidelines say there is, in a sentence, and a six-person team deserves to
// read it before it builds a cap table.
//
// THE OTHER THING NOBODY SAYS: the published guidelines predate Law 193/2024.
// They still define a startup as "operating no longer than 4 years" and say
// nothing about the EU SME test or the consultancy exclusion. The visa
// procedure in them is current; the startup-law definition in them is not. A
// file built only on the PDF is built on something incomplete.
//
// WHAT WE DO NOT CLAIM. That the 500-place sub-quota of the 2026–2028 Flow
// Decree belongs to startup founders. It is shared with four other
// categories, among them entrepreneurs investing €500,000 and hiring three
// people. The bigger number is the one in circulation; the accurate one is
// here.
//
// Photos (checked 2026-10-29): all three are local files and genuinely Italy —
// Florence (Ponte Vecchio), Milan (Porta Nuova) and Turin (tram crossing).
// italiastartupvisa.mise.gov.it and mimit.gov.it did not answer from the
// machine this page was rebuilt on; their URLs are the ones already cited in
// the repo, not re-fetched.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, GateQuiz, OpenedTracker, ParallaxLayer, PerkOrCatch, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { DoorPicker, RenewalLadder, TeamCap, type Door, type Rung } from './ItalyWidgets';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/italy', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

const UPDATED = { iso: '2026-09-24', label: '24 Sep 2026' };

// The page's own greens. Contrast (WCAG 2.1): accentText #00753A is 5.11:1 on
// #F2F0E9 and 5.82:1 on white; accentInk #0A0E1A is 9.68:1 on #34D17D; white
// on primary #00753A is 5.82:1.
const THEME: RouteTheme = { accent: '#34D17D', accentInk: '#0A0E1A', accentText: '#00753A', primary: '#00753A', deep: '#0D1017', soft: '#DDF3E6' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'team', label: 'Five seats' },
  { id: 'gate', label: 'The gate' },
  { id: 'steps', label: '5 steps' },
  { id: 'money', label: 'Money' },
  { id: 'hub', label: 'Already here' },
  { id: 'life', label: 'Perks & catches' },
  { id: 'residence', label: 'Renewals' },
  { id: 'faq', label: 'FAQ' },
];

const steps: RouteStep[] = [
  {
    title: 'Email the committee',
    who: 'MIMIT',
    body: 'The application form, a passport copy, a cover letter declaring at least €50,000 in available funds and the documents evidencing them, and — depending on the route — a business plan and deck, or a certified incubator’s undertaking to host you. In English or Italian.',
    note: 'There is no portal and no fee. The whole first stage is an email to italiastartupvisa@mise.gov.it.',
    figure: '€0',
    figureLabel: 'no fee, no portal',
  },
  {
    title: 'Completeness check',
    who: 'Secretariat and Questura',
    body: 'The programme secretariat at MIMIT checks the file is complete before the committee sees it, and asks the Questura of the city where you intend to establish the company for a provisional clearance.',
    note: 'Your city is a question on the form. "Not decided yet" stalls the file here, before anyone has read the idea.',
    figure: 'City',
    figureLabel: 'decided before you send',
  },
  {
    title: 'The committee votes',
    who: 'Technical committee',
    body: 'The technical committee — chaired by MIMIT’s Director General for Industrial Policy, with the chairs of AIFI, APSTI, IBAN, Netval and PNICube — decides by simple majority within 30 days of the complete file.',
    note: 'No interview, no call, no hearing. What you sent is what is judged.',
    figure: '30 days',
    figureLabel: 'from the complete file',
  },
  {
    title: 'Consulate visa',
    who: 'Within three months',
    body: 'The nulla osta arrives by email. You take the originals to the Italian consulate for your region, together with proof of accommodation and last year’s income, and collect a one-year self-employment visa.',
    note: 'Three months from the date on the certificate. Miss it and the file is dead — you start again from step one.',
    figure: '3 months',
    figureLabel: 'to collect the visa',
  },
  {
    title: 'Eight days after landing',
    who: 'Post office, then Questura',
    body: 'You have 180 days from visa issue to enter Italy, and 8 days from arrival to lodge the residence permit application at a post office: a €16 revenue stamp, a €30.46 bulletin, a €50 contribution, a full passport photocopy, two photographs and proof of accommodation. Fingerprints at the Questura follow.',
    note: 'The eight days land in the week you are least organised. Know the post-office kit before you fly.',
    figure: '8 days',
    figureLabel: 'from arrival',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to apply for the Italia Startup Visa',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: `${s.body} ${s.note}` })),
};

// What the committee is sensitive to, plus the Law 193/2024 exclusion.
const criteria = [
  {
    title: 'One of three indicators',
    body: '15% of costs on R&D; or a third of the team holding doctorates or three years of research, or two thirds holding a master’s; or a patent, or original software registered with SIAE. One is enough — but it must be evidenced, not asserted.',
  },
  {
    title: 'A CV that fits the plan',
    body: 'The guidelines name an applicant whose studies and career are irrelevant to the business as a reason to refuse. A founder pivoting into a field they have never worked in is the commonest way a sound-looking file fails.',
  },
  {
    title: 'A prior link to Italy',
    body: 'Also named, and rarely quoted: the absence of any previous connection with Italy and its innovation ecosystem counts against you. A university letter, a first Italian customer, a science park, an incubator — something real.',
  },
  {
    title: 'Money to match the plan',
    body: 'The committee weighs funds against the scale of what you have promised. €50,000 is the statutory floor and, for a team, the guidelines call it "purely indicative" — the adequate figure may be considerably higher.',
  },
  {
    title: 'Not consultancy or agency work',
    body: 'Since Law 193/2024 an innovative startup must meet the EU definition of a small or medium enterprise, and a company whose prevalent activity is consultancy or agency work is expressly excluded.',
  },
];

const refused = [
  'A business whose prevalent activity is consultancy',
  'Agency or brokerage work',
  'Retail and traditional services with no R&D',
  'A plan with no evidenced innovation indicator',
];

const doors: Door[] = [
  {
    key: 'found',
    choice: 'Found a new startup',
    figure: '€50,000',
    body: 'To found a new innovative startup. For the whole team, not per founder, and it may be pooled — one founder’s money, several founders’, or a third-party investor’s, with a single cover letter for the team.',
    fine: 'For teams the guidelines call this "purely indicative": the committee judges adequacy against the scale of the plan, and the figure it considers adequate may be considerably above the statutory minimum. Five founders showing exactly €50,000 is a weak file, not a compliant one.',
  },
  {
    key: 'join',
    choice: 'Join an existing one',
    figure: '€100,000',
    body: 'To join an existing innovative startup. It must be an s.r.l. or s.p.a., operating at least three years, registered in the special section. You take the position of chairman, CEO, board member or auditor, sign a Job Agreement with the company, and your background must match its core business.',
    fine: 'The money must be your own, and the committee explicitly discourages multiple applications aimed at the same company, assessing them case by case even when they arrive at different times. Treat any offer of a ready-made Italian startup to join with the scepticism that deserves.',
  },
];

const fundRows = [
  { label: 'Found a new innovative startup', amount: '€50,000', note: 'For the whole team, not per founder; may be pooled' },
  { label: 'Join an existing innovative startup (operating at least 3 years)', amount: '€100,000', note: 'From your own resources' },
  { label: 'Join a project that has already received certificates', amount: '+€50,000', note: 'On top of what the original team declared' },
  { label: 'Personal income in the previous year', amount: 'Above ~€8,400', note: 'Per applicant; the health-service co-payment exemption threshold' },
  { label: 'Committee assessment', amount: '€0', note: 'The committee charges nothing' },
];

const postOffice = [
  { item: 'Revenue stamp', cost: '€16' },
  { item: 'Bulletin', cost: '€30.46' },
  { item: 'Contribution', cost: '€50' },
  { item: 'Full passport photocopy', cost: '—' },
  { item: 'Two photographs', cost: '—' },
  { item: 'Proof of accommodation', cost: '—' },
];

const rights = [
  {
    title: 'Startup Act measures',
    content: 'Exemption from stamp duty and Business Register fees, tax relief for investors, flexible labour rules, simplified access to the SME guarantee fund for loans, and equity crowdfunding.',
    positive: true,
  },
  { title: 'The tax rate', content: 'It is not a low-tax jurisdiction. Corporate tax (IRES) is 24%, with regional IRAP on top.', positive: false },
  {
    title: 'If the startup fails',
    content: 'If, after renewal, the company no longer meets the article 25 requirements, the residence permit is not revoked. The first renewal still needs a registered company and sufficient income.',
    positive: true,
  },
  { title: 'Profits', content: 'An innovative startup may not distribute profits while it holds that status.', positive: false },
  { title: 'The first stage', content: 'Free of charge, by email, in English or Italian, decided on documents alone within 30 days of a complete file.', positive: true },
  {
    title: 'Local bureaucracy',
    content: 'The committee stage is English-speaking and digital. The post office, the Questura, the Chamber of Commerce and your accountant are none of those things.',
    positive: false,
  },
  { title: 'Team size', content: 'Five founders per startup is more room than Denmark’s hard annual cap allows.', positive: true },
  {
    title: 'The deadlines',
    content: 'Three months to collect the visa from the certificate’s date, eight days from arrival to file for the permit. Each has killed applications whose substance was fine.',
    positive: false,
  },
];

const rungs: Rung[] = [
  { year: 0, title: 'Arrive on the one-year visa', body: 'Lodge the residence permit application at a post office within 8 days of arrival; fingerprints at the Questura follow.' },
  {
    year: 1,
    title: 'First renewal, for up to two years',
    body: 'Apply to the Questura up to 60 days before expiry, with the company’s visura camerale showing registration in the special section for innovative startups and proof of lawful income above the health-service exemption minimum. By now you must actually have incorporated.',
  },
  { year: 3, title: 'Second renewal, for a further two', body: 'If, after renewal, the company no longer meets the article 25 requirements, the residence permit is not revoked.' },
  { year: 5, title: 'EU long-term residence permit', body: 'After five years you can apply for the EU long-term residence permit, which does not expire — provided you have not been outside Italy for more than six continuous months.' },
];

const faqs = [
  {
    q: 'Who actually decides?',
    a: 'A technical committee at the Ministry of Enterprises and Made in Italy, chaired by the Director General for Industrial Policy, Competitiveness and SMEs. Its members are the chairs of the main bodies of the Italian innovation ecosystem: AIFI’s venture capital committee, the science and technology parks association APSTI, the business angel network IBAN, the university research network Netval and the academic incubator association PNICube. They vote by simple majority. Your file is not read by an immigration officer; it is read by people whose job is assessing startups.',
  },
  {
    q: 'How much money do I have to show?',
    a: '€50,000 for a new startup — and that figure is for the whole team, not per founder. €100,000 if you are joining an existing registered innovative startup that has been operating at least three years, and that amount must come from your own resources. Separately, every applicant must evidence income in the previous year above roughly €8,400, the threshold for exemption from health-service co-payments. Funds must be liquid and readily convertible, evidenced by letters from the banks holding them or commitment letters from investors, VC funds or equity crowdfunding platforms.',
  },
  {
    q: 'How many founders can apply?',
    a: 'A maximum of five certificates per innovative startup. In exceptional circumstances, depending on the nature of the business, the committee may grant more — but never more than ten. This is in the official guidelines, and it contradicts most write-ups of the route, which say there is no limit. Every team member must be a co-founder with a self-employment relationship to the company and a share of its capital; no statutory minimum percentage applies. All the team’s applications must be sent at the same time, and anyone joining a project that has already received certificates must show a further €50,000 on top of what the original team declared.',
  },
  {
    q: 'Is there an interview?',
    a: 'Not with the committee. The assessment is entirely documentary — there is no hearing, no call, and nothing to prepare for beyond the file itself. If you go through a certified incubator, the incubator will usually run its own screening and pitch session before signing, because in that route the judgement on the business is largely deferred to it. That is the only interview on this path.',
  },
  {
    q: 'What does the incubator route change?',
    a: 'An undertaking to host, signed by a certified incubator’s legal representative, substitutes for the committee’s assessment of the business model; the committee’s certificate then mainly validates the financial resources and the legal fit. Italy gave incubators that role deliberately, to concentrate talent attraction in a limited number of hubs of proven reliability. One correction to what circulates widely: the undertaking does not exempt you from evidencing funds. The guidelines are explicit that applicants on this route still provide the financial documentation. What it does allow is that the value of the incubator’s in-kind services — space, equipment, mentoring — may be counted towards the total.',
  },
  {
    q: 'How do I find a certified incubator?',
    a: 'The official, current list is published in the dedicated section of the Business Register (Registro delle Imprese) and is downloadable from the Italia Startup Visa portal, which also carries an ecosystem map showing where incubators and innovative startups sit geographically. Certification is not nominal: an incubator must have adequate premises and equipment, a technical and management structure of recognised competence, and working relationships with universities and research centres.',
  },
  {
    q: 'What gets a file refused?',
    a: 'The guidelines name two families. Lack of innovativeness: the business model is judged to lack real technological substance, or none of the three article 25 indicators is evidenced. And a weak business plan, under which three things are listed explicitly — no previous link with Italy and its innovation ecosystem; an applicant whose studies or professional experience are irrelevant to the field; and financial resources inadequate to the scale of activity the plan promises. Irregularities in the funding documentation fall here too.',
  },
  {
    q: 'What happens if I am refused?',
    a: 'You have ten days from notification to send your observations to the committee’s email address, and the committee then has 30 days to grant or refuse definitively. If you send nothing, the refusal becomes final. You may apply again, but the committee will only consider a new file if it contains significant new elements compared with the previous one — the same application with cosmetic edits goes nowhere.',
  },
  {
    q: 'What changed under Law 193/2024?',
    a: 'Three things, in force since December 2024. An innovative startup must now meet the EU definition of a small or medium enterprise. A company whose prevalent activity is consultancy or agency work is expressly excluded — a hard exclusion that a lot of pitch decks have not caught up with. And the base period in the special section of the Business Register was shortened from five years to three, extendable to five on the conditions in article 25(2-bis), with further two-year extensions for companies that scale. Note the direction: it was shortened, not extended, which is the opposite of what is usually reported. MIMIT’s circular of 29 July 2025 set out how this is applied.',
  },
  {
    q: 'Does the quota limit me?',
    a: 'The visa is issued within the self-employment quota of the Flow Decree. The DPCM of 2 October 2025, published on 15 October, sets the 2026–2028 programming: 76,850 entries a year, of which 650 are self-employment, and within those a sub-quota of 500. That 500 is not reserved for startup founders — it is shared with entrepreneurs investing at least €500,000 and creating three jobs, regulated professionals, company directors and auditors, and renowned artists or highly qualified specialists. In practice the quota has not been the bottleneck on this route; the quality of the file is.',
  },
  {
    q: 'What happens after the first year?',
    a: 'Up to 60 days before expiry you apply to the Questura. The self-employment permit renews for a maximum of two years, and then for a further two. After five years you can apply for the EU long-term residence permit, which does not expire. Renewal requires the company’s visura camerale showing registration in the special section for innovative startups, and proof of lawful income above the health-service exemption minimum — so by then you must actually have incorporated. One condition people miss: you must not have been outside Italy for more than six continuous months.',
  },
  {
    q: 'What if the startup fails?',
    a: 'This is the least-quoted line in the guidelines and it matters: if, after renewal, the company no longer meets the article 25 requirements, the residence permit is not revoked. That is a real cushion, and more than several other routes offer. Read it precisely, though — it speaks to the position after renewal, and the first renewal still needs a registered company and sufficient income. The first year has to be worked.',
  },
  {
    q: 'I am already in Italy. Do I have to leave?',
    a: 'No. Italia Startup Hub exists for exactly this. Holders of any kind of valid residence permit — study, work, family — can convert it to a self-employment permit for an innovative startup without leaving the country, and the certificate of no impediment usually issues in around 20 days. For someone who studied in Italy it is the shortest entrepreneurial route in Europe: the language is there, and so is the link to the ecosystem whose absence the committee counts against outside applicants.',
  },
  {
    q: 'Is Italy a low-tax place to build?',
    a: 'No, and it is not sold here as one. Corporate tax (IRES) is 24%, with regional IRAP on top. What the Startup Act gives instead is real but different: exemption from stamp duty and Business Register fees, tax relief for investors putting money into innovative startups, flexible labour rules, simplified access to the SME guarantee fund for loans, and equity crowdfunding. Build the financial model on low setup and maintenance cost and access to capital, not on a low tax rate. Note also that an innovative startup may not distribute profits while it holds that status.',
  },
  {
    q: 'Why Italy rather than Finland or Estonia?',
    a: 'Three honest reasons. Market and industrial base: Italy is the EU’s second manufacturing economy, so a hardware, industrial, machinery, fashion, design or food-tech venture finds customers, suppliers and a supply chain that the small northern economies do not have. Team size: five founders per startup is more room than Denmark’s hard annual cap allows. And, for applicants from countries with thin consular coverage, Italy maintains a working embassy in more places than Denmark or Estonia do — including Tehran, where national type D applications are accepted, so there is no third-country trip for biometrics. Against that: slower local bureaucracy, mid-to-high corporate tax, and a higher funds threshold than Estonia or Finland.',
  },
];

// The application questions first, then life after the decision.
const FAQ_SPLIT = 10;

// Every official source the page and its header comment rely on. URLs are the
// ones already cited elsewhere in the repo; where none exists the source is
// named without a link rather than guessed.
const sources: { name: string; href?: string; what: string; checked: string }[] = [
  { name: 'MIMIT — Italia Startup Visa portal', href: 'https://italiastartupvisa.mise.gov.it/', what: 'The programme, the Italia Startup Hub, the incubator list and the ecosystem map.', checked: '24 Sep 2026' },
  {
    name: 'MIMIT — Italia Startup Visa guidelines, 20/03/2018 revision (English PDF)',
    href: 'https://italiastartupvisa.mise.gov.it/media/documents/Guidelines%20ISV%20ENG%2020_03_2018%20def.pdf',
    what: 'The five-certificate cap, the funds thresholds, the refusal grounds, the procedure and renewal.',
    checked: '24 Sep 2026',
  },
  { name: 'Registro delle Imprese — special section for innovative startups', href: 'https://startup.registroimprese.it/', what: 'The register of innovative startups and certified incubators.', checked: '24 Sep 2026' },
  {
    name: 'Consulate General of Italy in Chicago — Italia Start Up Visa',
    href: 'https://conschicago.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visa-categories-and-requirements/italia-start-up-visanational-long-term-visa/',
    what: 'What a mission actually asks for at the visa stage.',
    checked: '24 Sep 2026',
  },
  {
    name: 'Prefettura di Macerata — DPCM of 2 October 2025 (Flow Decree 2026–2028)',
    href: 'https://prefettura.interno.gov.it/it/prefetture/macerata/comunicazioni/dpcm-2-ottobre-2025-programmazione-dei-flussi-dingresso-2026-2028',
    what: 'The 2026–2028 entry quotas, including self-employment.',
    checked: '24 Sep 2026',
  },
  {
    name: 'Polizia di Stato — EU long-term residence permit',
    href: 'https://www.poliziadistato.it/articolo/permesso-di-soggiorno-ue-per-soggiornanti-di-lungo-periodo.--carta-di-soggiorno-per-cittadini-stranieri',
    what: 'The permit available after five years.',
    checked: '24 Sep 2026',
  },
  { name: 'Law 193/2024 and MIMIT’s circular of 29 July 2025', what: 'The EU SME test, the consultancy exclusion and the shortened special-section period.', checked: '24 Sep 2026' },
];

// The only English Italy guides in the sitemap on 29 Oct 2026, by stage.
// Curated rather than queried so the page stays static; there is no Italy
// blog category yet (/blog/category/italy returns 404), so no "all" link.
const reads = [
  {
    slug: 'validating-startup-idea-italia-startup-visa',
    stage: 'Before you apply',
    title: 'Validating Your Startup Idea for the Italia Startup Visa',
    excerpt: 'Market demand, value proposition, MVP requirements and Italian innovation priorities, step by step.',
    date: { iso: '2026-09-25', label: '25 Sep 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/09/622fe52e72eb58b3a0dacdaf2c85f091.jpg',
  },
  {
    slug: 'business-banking-tax-basics-italia-startup-visa-founders',
    stage: 'After you land',
    title: 'Business Banking and Tax Basics for Italia Startup Visa Founders',
    excerpt: 'Opening a business bank account, budgeting for real startup costs and meeting Italian tax obligations.',
    date: { iso: '2026-10-19', label: '19 Oct 2026' },
    minutes: 7,
    cover: 'https://storage.googleapis.com/svr-media-visaroads-website/uploads/2026/10/fb4d90179ea1e585a8386c00810d7067.jpg',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';
const prose = 'font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70';

// setRequestLocale before the first <Link>: without it next-intl reads
// headers(), Next renders the route dynamically and streams <title> and
// the meta tags into <body> instead of <head>.
export default async function ItalyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd, faqJsonLd(faqs.map((f) => ({ question: f.q, answer: f.a })), 'en')]} />

      <RouteProvider stops={STOPS} flag="it" theme={THEME}>
        {/* ── Hero: the answer up front ── */}
        <header className="relative overflow-hidden bg-[#0A0E1A] text-white">
          <Image
            src="/fa/img/italy.webp"
            alt="Florence from above: the Ponte Vecchio across the Arno, terracotta roofs filling the city and hazy hills behind"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 via-[#0A0E1A]/75 to-[#0A0E1A]/30" />
          {/* The tricolore as a thin edge, at the flag's own colours. */}
          <div aria-hidden="true" className="absolute inset-y-0 left-0 flex w-1.5 flex-col">
            <span className="flex-1 bg-[#009246]" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#CE2B37]" />
          </div>

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">Italy</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="it" uid="hero" width={36} />
                Italia Startup Visa · Decided by MIMIT in 30 days
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Italy. <em className="text-[#34D17D]">Five seats.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The Italia Startup Visa in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                A committee of venture capitalists reads your file, and nobody interviews you: thirty days from a complete file to a decision, free of
                charge, on documents alone. What the write-ups leave out is a hard ceiling of five certificates per startup, a three-month clock on the
                certificate, and a consultancy exclusion added in December 2024.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Figures checked against MIMIT&apos;s Italia Startup Visa guidelines, the Registro delle Imprese and the 2026–2028 Flow Decree</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#34D17D] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">The guidelines predate Law 193/2024.</strong> They still describe a startup as one &ldquo;operating no
                longer than 4 years&rdquo; and carry nothing about the EU SME test or the consultancy exclusion. The visa procedure in them is current; the
                startup-law definition in them is not.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#34D17D] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Count your team against the cap</li>
                <li>Check your file against what the committee weighs</li>
                <li>Walk the five steps</li>
                <li>Choose your door and its money</li>
                <li>Sort perks from catches</li>
                <li>Climb the renewals to the EU long-term permit</li>
              </ol>
              <a href="#team" className="inline-flex items-center gap-2 rounded-full bg-[#34D17D] px-5 py-3 font-sans text-sm font-bold text-[#0A0E1A] transition-transform hover:-translate-y-0.5">
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
          question="What is the Italia Startup Visa?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              The Italia Startup Visa is a simplified, fast-track version of Italy&apos;s self-employment visa for people founding an innovative startup. A
              technical committee at MIMIT judges the file on documents alone, free of charge, within 30 days of a complete file. The consulate then issues a
              one-year visa, and the Questura the residence permit after you land.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '30 days', label: 'To a decision', sub: 'from the complete file' },
              { stat: '€50k', label: 'Funds required', sub: 'for the whole team' },
              { stat: '5', label: 'Certificates per startup', sub: 'ten only exceptionally' },
              { stat: '€0', label: 'Cost of assessment', sub: 'the committee charges nothing' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#00753A]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 ${prose}`}>
            <p>
              <strong className="text-[#1a1a1a]">The programme.</strong> Italy recognised the &ldquo;innovative startup&rdquo; in law in 2012 and attached a
              package of tax, funding and labour measures to it. The Italia Startup Visa is that law&rsquo;s immigration branch: a simplified, digitised,
              fast-track version of the ordinary self-employment visa, for people who want to found one.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Three bodies, one chain.</strong> None of them does another&rsquo;s job. The MIMIT committee decides on the
              venture and issues the certificate of no impediment. The consulate issues the one-year visa. The Questura issues the residence permit after
              you land.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Understand the consequence.</strong> The hardest judgement — is this genuinely an innovative startup —
              happens first, and happens on paper. The certificate is not residence. It is the key that turns the next lock.
            </p>
          </div>
        </RouteStop>

        {/* 02 — The cap */}
        <RouteStop
          id="team"
          number={2}
          tone="white"
          eyebrow="The cap nobody mentions"
          question="How many founders can apply for the Italia Startup Visa?"
          task="Count your team"
          answer={
            <p>
              A maximum of five certificates of no impediment per innovative startup. In exceptional circumstances, depending on the nature of the business,
              the committee may grant more, but never more than ten. Every founder must be a genuine co-founder with a self-employment relationship and a
              share of the capital, and the team&apos;s applications go in together.
            </p>
          }
        >
          <TeamCap stopId="team" />
          <div className={`mt-8 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 ${prose}`}>
            <p>
              Most descriptions of this route — in English and in Persian — say there is no limit on the number of founders. The guidelines say otherwise, in
              one sentence: a maximum of five certificates of no impediment may be issued for each innovative startup, and in exceptional circumstances the
              committee may allow more, but in no case more than ten.
            </p>
            <p>
              If you are six, you are redesigning the structure — better now than after the files go in. And every one of those five must be a genuine
              co-founder with a self-employment relationship and a share of the capital; no statutory minimum percentage applies. Nobody joins as a passive
              investor, and nobody joins as an employee. Anyone joining a project that has already received certificates must show a further €50,000.
            </p>
          </div>
        </RouteStop>

        {/* 03 — Who qualifies */}
        <RouteStop
          id="gate"
          number={3}
          eyebrow="What the committee is sensitive to"
          question="Who qualifies for the Italia Startup Visa?"
          task="Answer all five"
          answer={
            <p>
              You must found an innovative startup that evidences one of three indicators: 15% of costs on R&amp;D, a qualified team, or a patent or registered
              software. The committee also weighs whether your CV fits the plan, your prior link to Italy, and whether the funds match the plan. Consultancy
              and agency businesses are excluded outright.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="There is no interview: what you send is what is judged, so each of these has to be evidenced in the file, not asserted."
            gapNote="After a refusal, a new file is only considered if it contains significant new elements."
          >
            <div>
              <h3 className="mb-2 font-serif text-xl">Refused on the definition</h3>
              <ul className="grid gap-1.5">
                {refused.map((r) => (
                  <li key={r} className="flex items-center gap-3 font-sans text-sm text-[#1a1a1a]/65">
                    <span aria-hidden="true" className="h-px w-4 bg-[#B4531A]" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <p className="border-l-2 border-[#34D17D] pl-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
              <strong className="text-[#1a1a1a]">The guidelines on the official portal predate Law 193/2024.</strong> They still describe a startup as one
              &ldquo;operating no longer than 4 years&rdquo;, and they carry nothing about the EU SME test or the consultancy exclusion. The visa procedure in
              them is current; the startup-law definition in them is not. If you build the file from the PDF alone, you have built it on something
              incomplete.
            </p>
            <Link href="/book-meeting" className="inline-flex w-fit items-center gap-2 rounded-full bg-[#34D17D] px-5 py-3 font-sans text-sm font-bold text-[#0A0E1A] transition-transform hover:-translate-y-0.5">
              Get a free read on your file <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>
        </RouteStop>

        {/* 04 — How to apply */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="An email to a residence card"
          question="How do you apply for the Italia Startup Visa?"
          task="Walk to step 5"
          answer={
            <p>
              Email the application to the MIMIT committee with proof of at least €50,000, pass the secretariat&apos;s completeness check and the
              Questura&apos;s provisional clearance, get the committee&apos;s decision within 30 days, collect a one-year visa at the consulate within three
              months of the certificate, enter within 180 days, and file for the residence permit within eight days of arriving.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Thirty days is the decision, not the journey.</strong> That clock starts only on a complete file, and the
            commonest cause of months of delay is a file that never started it. The three-month life of the certificate and the eight-day deadline after
            arrival have each killed applications whose substance was fine.
          </p>
        </RouteStop>

        {/* 05 — Money */}
        <RouteStop
          id="money"
          number={5}
          eyebrow="Two doors · funds and fees"
          question="How much money do you need for the Italia Startup Visa?"
          task="Choose your door"
          answer={
            <p>
              €50,000 to found a new innovative startup, for the whole team rather than per founder, and it may be pooled. €100,000 of your own money to join
              an existing innovative startup operating at least three years. Separately, every applicant must show income in the previous year above roughly
              €8,400. The committee&apos;s assessment itself costs nothing.
            </p>
          }
        >
          <p className="mb-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            The thresholds are not close together, and the second door is far less travelled than the consultancies advertising it suggest.
          </p>
          <DoorPicker stopId="money" doors={doors} />

          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Funds to evidence (MIMIT guidelines)</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Situation</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {fundRows.map((r) => (
                    <tr key={r.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{r.label}</th>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">{r.amount}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]/60">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[300px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">The post-office kit for the residence permit</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Item</th>
                    <th scope="col" className="px-4 py-3">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {postOffice.map((r) => (
                    <tr key={r.item} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">{r.item}</th>
                      <td className="px-4 py-3 tabular-nums">{r.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">Lodged at a post office within 8 days of arrival. Fingerprints at the Questura follow.</p>
            </div>
          </div>

          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">What counts as funds.</strong> Funds must be liquid and readily convertible, evidenced by letters from the
              banks holding them or commitment letters from investors, VC funds or equity crowdfunding platforms.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">The incubator route does not waive this.</strong> Applicants hosted by a certified incubator still provide
              the financial documentation; the value of the incubator&rsquo;s in-kind services — space, equipment, mentoring — may be counted towards the
              total.
            </p>
          </div>
        </RouteStop>

        {/* Photo band */}
        <figure className="relative flex min-h-[360px] items-end overflow-hidden bg-[#0D1017] text-white">
          <ParallaxLayer>
            <Image
              src="/fa/img/italy-2.webp"
              alt="Porta Nuova in Milan: a glass office tower, a curved glass retail building, a crane over a tower under construction and people walking beside a reflecting pool"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D1017]/30 to-[#0D1017]/90" />
          <figcaption className="container relative mx-auto flex flex-wrap items-end justify-between gap-5 px-6 py-10">
            <div>
              <p className={`text-[#34D17D] ${label}`}>The reason to choose it</p>
              <p className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
                The EU&rsquo;s second<br />
                <span className="italic text-[#34D17D]">manufacturing economy.</span>
              </p>
            </div>
            <span className="font-sans text-xs text-white/60">Porta Nuova, Milan</span>
          </figcaption>
        </figure>

        {/* 06 — Already in Italy */}
        <RouteStop
          id="hub"
          number={6}
          tone="white"
          eyebrow="Italia Startup Hub"
          question="Can you apply for the startup visa from inside Italy?"
          task="Read the shortcut"
          completeOn="view"
          message="Shortcut read"
          answer={
            <p>
              Yes, through Italia Startup Hub. Holders of any valid Italian residence permit — study, work or family — can convert it to a self-employment
              permit for an innovative startup without leaving the country and without a consulate appointment. The certificate of no impediment usually
              issues in around twenty days.
            </p>
          }
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className={`grid gap-5 lg:col-span-7 ${prose}`}>
              <p>
                A separate programme, for holders of any valid Italian residence permit — study, work, family. You convert it to a self-employment permit for
                an innovative startup without leaving the country and without a consulate appointment, and the certificate of no impediment usually issues
                in around twenty days.
              </p>
              <p>
                For someone who studied in Italy this is the shortest entrepreneurial route in Europe. They have the language, and they already have the thing
                the committee counts the absence of against everybody else: a link to the Italian innovation ecosystem.
              </p>
            </div>
            <figure className="lg:col-span-5">
              <div className="relative h-80 overflow-hidden rounded-2xl">
                <Image
                  src="/fa/img/italy-3.webp"
                  alt="A crossing in central Turin on a winter morning: tram rails over stone paving, an arcade on the left and a corner palazzo ahead"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 font-sans text-xs text-[#1a1a1a]/55">Central Turin</figcaption>
            </figure>
          </div>
        </RouteStop>

        {/* 07 — Rights and restrictions */}
        <RouteStop
          id="life"
          number={7}
          eyebrow="Perk or catch?"
          question="What does the Italia Startup Visa give you, and what does it cost you?"
          task="Guess all eight"
          answer={
            <p>
              The Startup Act gives exemption from stamp duty and Business Register fees, investor tax relief, flexible labour rules, simplified loan
              guarantees and equity crowdfunding, and the permit is not revoked if the company stops qualifying after renewal. Against that: 24% IRES plus
              IRAP, no profit distribution while an innovative startup, and slow local bureaucracy.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <h3 className="mb-2 font-serif text-2xl">What Italy is not good at</h3>
              <p className="border-l-2 border-[#34D17D] pl-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                The committee stage is English-speaking and digital. The post office, the Questura, the Chamber of Commerce and your accountant are none of
                those things.
              </p>
            </div>
            <div className={`grid gap-5 ${prose}`}>
              <p>
                <strong className="text-[#1a1a1a]">It is not a low-tax jurisdiction.</strong> IRES is 24% with regional IRAP on top, and an innovative startup
                may not distribute profits while it holds that status. What the Startup Act gives is exemption from Business Register fees and stamp duty,
                investor tax relief, flexible labour rules, simplified loan guarantees and equity crowdfunding. Build the model on cheap setup and access to
                capital, not on a low rate.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">The official portal is neglected.</strong> Parts of it have not been updated in years and some links are
                broken. That is not a reason to distrust the route — the committee and the procedure are real and running — but it is a reason to check any
                figure you read there against the current law.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">And the strength, stated plainly:</strong> Italy is the EU&rsquo;s second manufacturing economy. If your
                venture touches hardware, machinery, industrial automation, food, fashion or design, the customers and the supply chain are there in a way
                they are not in a small northern market. That, and not the tax rate, is the reason to choose it.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 08 — Renewals to long-term residence */}
        <RouteStop
          id="residence"
          number={8}
          tone="white"
          eyebrow="Renewals · EU long-term permit"
          question="How do you get permanent residence in Italy through the startup visa?"
          task="Slide to year 5"
          answer={
            <p>
              Renew at the Questura up to 60 days before the first permit expires: it renews for up to two years, then a further two. After five years you can
              apply for the EU long-term residence permit, which does not expire, provided you have not been outside Italy for more than six continuous
              months.
            </p>
          }
        >
          <RenewalLadder stopId="residence" rungs={rungs} />
          <p className="mt-4 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">The first year has to be worked.</strong> The cushion against a failed startup speaks to the position after
            renewal; the first renewal still needs a registered company and sufficient income.
          </p>
        </RouteStop>

        {/* 09 — FAQ */}
        <RouteStop
          id="faq"
          number={9}
          eyebrow="Questions founders ask"
          question="Italia Startup Visa: frequently asked questions"
          task="Open three answers"
          answer={<p>Fifteen answers, from who sits on the committee and how many founders can apply to the quota, renewals, and what happens if the startup fails.</p>}
        >
          <FaqGroups />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#00753A] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.name}>
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#34D17D] underline-offset-2 hover:text-[#00753A]">
                      {s.name}
                    </a>
                  ) : (
                    <b>{s.name}</b>
                  )}{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#0D1017] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#34D17D] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Which of the three <span className="italic text-[#34D17D]">indicators do you meet?</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                That is the question this route turns on, and it is answerable in an afternoon, before anyone spends anything. Bring your file to a free
                session: we work on the file up to the committee&rsquo;s decision — and we say no when the honest answer is no.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#34D17D] px-6 py-3.5 font-sans text-sm font-bold text-[#0A0E1A] transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/country" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-sans text-sm transition-colors hover:bg-white/10">
                  All jurisdictions
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

        {/* Related guides */}
        <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <div className="mb-6">
              <p className={`text-[#00753A] ${label}`}>Keep reading</p>
              <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More Italy guides</h2>
            </div>
            <ul className="grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible">
              {reads.map((r) => (
                <li key={r.slug} className="group snap-start overflow-hidden rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0D1017]/10">
                  <Link href={`/blog/${r.slug}`} className="block">
                    <span className="relative block aspect-video overflow-hidden">
                      <Image src={r.cover} alt="" fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className={`text-[#00753A] ${label}`}>{r.stage}</span>
                      <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                      <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                      <span className="font-sans text-xs tabular-nums text-[#1a1a1a]/55">
                        <time dateTime={r.date.iso}>{r.date.label}</time> · {r.minutes} min read
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Disclaimer */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Regulatory Notice:</strong> Figures on this page were verified on 24 September 2026 against MIMIT&apos;s official Italia Startup Visa
              guidelines (the 20/03/2018 revision), the Registro delle Imprese and the DPCM of 2 October 2025, and are provided for informational purposes
              only. VisaRoads Inc., an Ashavid company, is a strategic business advisory firm — we are <span className="underline">NOT</span> an immigration
              law firm or recruitment agency. The committee&apos;s certificate of no impediment is not residence: the visa is issued by the consulate and the
              residence permit by the Questura. The published guidelines predate Law 193/2024 — always check any figure against the current law and{' '}
              <a href="https://italiastartupvisa.mise.gov.it/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#00753A]">
                italiastartupvisa.mise.gov.it
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqGroups() {
  const groups = [
    { heading: 'The application', items: faqs.slice(0, FAQ_SPLIT) },
    { heading: 'After the decision', items: faqs.slice(FAQ_SPLIT) },
  ];
  return (
    <div className="grid max-w-4xl gap-12">
      {groups.map((g) => (
        <div key={g.heading}>
          <h3 className={`mb-2 text-[#00753A] ${label}`}>{g.heading}</h3>
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
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-[#00753A] group-open:text-[#00753A] [&::-webkit-details-marker]:hidden">
        <h4 className="font-serif text-xl leading-snug">{q}</h4>
        <span aria-hidden="true" className="font-serif text-2xl transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="max-w-[72ch] pb-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/65">{a}</p>
    </details>
  );
}
