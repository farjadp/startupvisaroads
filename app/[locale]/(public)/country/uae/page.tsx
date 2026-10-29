// ============================================================================
// Page: app/[locale]/(public)/country/uae/page.tsx
// Was: "Modernist Editorial + Desert Gold & Future" theme — UAE Country Profile
// & Golden/Blue/Green Visa Advisory. Rebuilt 29 Oct 2026 as a guided route on
// the Finland page's pattern, in the old page's own palette (desert gold on
// paper and near-black): a compact Dubai hero, a sticky rail whose UAE flag
// rises as the reader completes each stop, and one stop per question people
// actually search, each opening with its question as the H2 and a ~50-word
// direct answer. All copy is rendered on the server. The two UAE-shaped games
// (tier finder, city picker) live next to this file in UaeWidgets.tsx.
//
// The UAE has no classic startup visa. Founders use the long-term residencies:
// Golden (10 years), Green (5 years) and the Blue Visa (2025).
//
// Figures: the old page carried no check date. The Golden Visa investor and
// entrepreneur figures, the issuing bodies and the "no permanent residence"
// line are taken from lib/routes-v2/tr-il-ae.ts, checked 2026-10-15 against
// icp.gov.ae (Golden and Green Residency), gdrfad.gov.ae (investor,
// entrepreneur and freelancer services) and u.ae (Golden Visa page). Changed
// from the old page on that source: the Golden entrepreneur route was "AED 500k
// project"; routes-v2 records the 2018 decree's AED 500,000 project value as
// outdated and on no current official page. Two conflicts stay open and are
// stated on the page: ICP treats the incubator route as standalone while GDRFA
// Dubai asks for AED 2,000,000 of income; ICP and GDRFA Dubai give 10 years
// where u.ae lists 5 for some Golden categories.
//
// Not yet checked against an official source, kept in the old page's wording
// and marked as such: the Blue Visa, the Green Visa's skilled-employee and
// AED 1M investor categories, the 9% Corporate Tax, ESR, and the 3–6-month
// banking estimate.
//
// Photos: the old page had none. The Golden Visa page's "Dubai Architecture"
// Unsplash ID and the CountryCard UAE ID both return 404. The one image kept,
// Unsplash 1526495124232, is genuinely Dubai: towers on Sheikh Zayed Road at
// dusk with the Burj Khalifa behind them.
//
// No English video exists for the UAE, and the old page had no FAQ, so there
// is no video stop, no FAQ stop and no FAQPage JSON-LD. No English blog
// articles about the UAE are in the sitemap (29 Oct 2026) and
// /blog/category/uae returns 404, so "Keep reading" links related guides.
// ============================================================================

import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from '@/routing';
import { metaFor } from '@/lib/pageMeta';
import JsonLd from '@/components/JsonLd';
import { MAIN_CONTACT } from '@/content/contact';
import Flag from '@/components/route/flags';
import { RouteProvider, RouteRail, RouteStop, RouteFinish, type RouteStopDef, type RouteTheme } from '@/components/route/RouteProgress';
import { CopyButton, PerkOrCatch, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { ArenaPicker, TierFinder, type Arena, type TierDoor } from './UaeWidgets';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/country/uae', locale);
}

// ─── Data ────────────────────────────────────────────────────────────────────

// The date the Golden and Green figures were checked (lib/routes-v2/tr-il-ae.ts).
const UPDATED = { iso: '2026-10-15', label: '15 Oct 2026' };

// The old page's own palette: desert gold on paper and near-black. The gold
// itself (#D4AF37) is only 2.1:1 on paper, so text uses #7D6310 (5.03:1 on
// #F2F0E9, 5.73:1 on white). Near-black on the gold reads at 8.28:1, and the
// gold on the near-black bands at 8.28:1.
const THEME: RouteTheme = { accent: '#D4AF37', accentInk: '#1a1a1a', accentText: '#7D6310', primary: '#1a1a1a', deep: '#1a1a1a', soft: '#F7EFD2', accentOnDark: '#D4AF37' };

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'tiers', label: 'Your tier' },
  { id: 'arena', label: 'Dubai or Abu Dhabi' },
  { id: 'steps', label: '5 steps' },
  { id: 'money', label: 'Money' },
  { id: 'life', label: 'Life' },
  { id: 'residence', label: 'Long term' },
];

// Each door is enough on its own for its tier.
const doors: TierDoor[] = [
  {
    key: 'property',
    tier: 'Golden Visa · Investor',
    question: 'Do you own, or will you buy, UAE property worth AED 2 million or more?',
    detail: 'Property investment of AED 2M+ qualifies for the 10-year Golden Visa.',
  },
  {
    key: 'deposit',
    tier: 'Golden Visa · Investor',
    question: 'Can you place AED 2 million in a UAE bank deposit?',
    detail: 'A bank deposit of AED 2M is a separate route to the same 10-year Golden Visa.',
  },
  {
    key: 'business',
    tier: 'Golden Visa · Entrepreneur',
    question: 'Does your business qualify as an entrepreneur project?',
    detail:
      'One of: a UAE-registered SME in an approved field with annual revenue of at least AED 1,000,000; a business idea approved by an accredited incubator, the Ministry of Economy or a local authority; or businesses you founded and sold worth at least AED 7,000,000 in total.',
  },
  {
    key: 'freelance',
    tier: 'Green Visa',
    question: 'Do you work as a freelancer or self-employed?',
    detail: 'The 5-year Green Visa has a category for freelancers and the self-employed.',
  },
  {
    key: 'skilled',
    tier: 'Green Visa',
    question: 'Are you a skilled employee who wants residency without an employer sponsor?',
    detail: 'Skilled employees can hold the Green Visa with no sponsor.',
  },
  {
    key: 'invest',
    tier: 'Green Visa',
    question: 'Can you invest AED 1 million?',
    detail: 'The Green Visa has an investor category at AED 1M.',
  },
  {
    key: 'sustain',
    tier: 'Blue Visa',
    question: 'Do you work in sustainability?',
    detail: 'The Blue Visa (2025) is for environmental champions, sustainability tech founders and members of international NGOs.',
  },
];

const tiers = [
  {
    name: 'Golden Visa',
    term: '10-year residency',
    dark: true,
    items: [
      'Property investment (AED 2M+)',
      'Bank deposit (AED 2M)',
      'Entrepreneur: an SME with AED 1M a year in revenue, an accredited incubator’s approval, or past exits worth AED 7M',
    ],
  },
  {
    name: 'Green Visa',
    term: '5-year residency',
    dark: false,
    items: ['Freelancers / self-employed', 'Skilled employees (no sponsor)', 'Investors (AED 1M)'],
  },
  {
    name: 'Blue Visa',
    term: '10-year · sustainability',
    dark: false,
    items: ['Environmental champions', 'Sustainability tech founders', 'International NGO members'],
  },
];

const arenas: Arena[] = [
  {
    city: 'Dubai',
    role: 'The commercial hub',
    body: 'Optimised for speed, fintech, crypto and e-commerce. Home to DIFC and DMCC. Fast setup, high visibility, cosmopolitan lifestyle.',
    zones: ['DIFC', 'DMCC', 'DWTC'],
    sectors: ['Fintech', 'Crypto', 'E-commerce'],
  },
  {
    city: 'Abu Dhabi',
    role: 'The capital',
    body: 'Optimised for deep tech, AI, healthcare and clean energy. Backed by massive sovereign wealth funds (ADGM, Hub71). Slower pace, higher capital support.',
    zones: ['ADGM', 'Hub71', 'Masdar'],
    sectors: ['Deep tech', 'AI', 'Healthcare', 'Clean energy'],
  },
];

const steps: RouteStep[] = [
  {
    title: 'Choose your arena',
    who: 'Dubai or Abu Dhabi',
    body: 'Two cities, two distinct strategies. Dubai is built for speed: fintech, crypto and e-commerce in DIFC, DMCC or DWTC. Abu Dhabi, the capital, is built for deep tech, AI, healthcare and clean energy, with ADGM, Hub71 and Masdar backed by sovereign wealth funds.',
    note: 'Where your business belongs decides which free zones and programmes you deal with.',
    figure: '2',
    figureLabel: 'cities, two strategies',
  },
  {
    title: 'Choose your tier',
    who: 'Golden, Green or Blue',
    body: 'Residency is no longer one size fits all: select the tier that matches your asset class. Property or a bank deposit of AED 2M, or a qualifying business, for the 10-year Golden Visa; freelancing, skilled employment or an AED 1M investment for the 5-year Green Visa; sustainability work for the Blue Visa.',
    note: 'Entrepreneurs in Dubai also need a nomination from Dubai Future Foundation. Nomination is not final approval: GDRFA Dubai reviews last.',
    figure: 'AED 2M',
    figureLabel: 'Golden, property or deposit',
  },
  {
    title: 'Structure the company',
    who: 'Mainland or free zone',
    body: 'Choose between a mainland LLC and a free zone entity based on your target market. The entity has to comply with the Economic Substance Regulations (ESR) and be bankable from day one.',
    note: 'Getting the residency is the easy part. The challenge is the infrastructure behind it.',
    figure: 'LLC / FZ',
    figureLabel: 'mainland or free zone',
  },
  {
    title: 'Bank and tax',
    who: 'Corporate account, Corporate Tax',
    body: 'Open the corporate bank account (Wio, ENBD and Mashreq are the banks we introduce clients to) and register for Corporate Tax, planning any exemption at the same time.',
    note: 'A corporate bank account can take 3–6 months if the company is structured incorrectly. Corporate Tax is 9%.',
    figure: '3–6 mo',
    figureLabel: 'bank account, if structured badly',
  },
  {
    title: 'Residency and Emirates ID',
    who: 'ICP or GDRFA Dubai',
    body: 'The residence visa is issued by the Federal Authority for Identity, Citizenship, Customs & Port Security (ICP), or in Dubai by GDRFA Dubai. Complete the medical test and biometrics, then collect your Emirates ID.',
    note: 'The Golden Visa is a 10-year residence, renewable while the conditions are met, with no sponsor needed.',
    figure: '10 yr',
    figureLabel: 'Golden residence, renewable',
  },
];

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to get UAE residency as a founder or investor',
  inLanguage: 'en',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.body })),
};

// Thresholds. `checked` is false where no official source in the repo covers the figure yet.
const thresholds = [
  { tier: 'Golden', route: 'Property investment', amount: 'AED 2,000,000+', source: 'ICP, GDRFA Dubai, u.ae', checked: true },
  { tier: 'Golden', route: 'Bank deposit', amount: 'AED 2,000,000', source: 'ICP, GDRFA Dubai, u.ae', checked: true },
  { tier: 'Golden', route: 'Entrepreneur: SME in an approved field', amount: 'AED 1,000,000 annual revenue', source: 'ICP, GDRFA Dubai', checked: true },
  { tier: 'Golden', route: 'Entrepreneur: idea approved by an accredited incubator, the Ministry of Economy or a local authority', amount: 'None (ICP) or AED 2,000,000 income (GDRFA Dubai)', source: 'Sources disagree', checked: true },
  { tier: 'Golden', route: 'Entrepreneur: businesses founded and sold', amount: 'AED 7,000,000 in total', source: 'ICP, GDRFA Dubai', checked: true },
  { tier: 'Green', route: 'Investor', amount: 'AED 1,000,000', source: 'Not yet checked against an official source', checked: false },
];

const taxes = [
  { label: 'Personal income tax', rate: '0%', note: 'Zero personal tax' },
  { label: 'Corporate Tax', rate: '9%', note: 'Registration and exemption planning are part of the setup' },
];

const rights = [
  { title: 'Personal tax', content: 'Zero personal income tax.', positive: true },
  { title: 'Ownership', content: '100% foreign ownership of your company.', positive: true },
  { title: 'Corporate Tax', content: 'Companies pay a 9% Corporate Tax. Registration and exemption planning have to be done properly.', positive: false },
  { title: 'Bank account', content: 'Setting up a corporate bank account in the UAE can take 3–6 months if the company is structured incorrectly.', positive: false },
  { title: 'Golden term', content: 'A 10-year residence, renewable while the conditions are met, with no sponsor needed.', positive: true },
  { title: 'Economic Substance', content: 'Your entity must comply with the Economic Substance Regulations (ESR), whether it is mainland or in a free zone.', positive: false },
  { title: 'No sponsor', content: 'Skilled employees can hold the 5-year Green Visa without an employer sponsor.', positive: true },
  { title: 'Permanent residence', content: 'There is none. You renew residence while you meet the conditions; citizenship is by nomination only.', positive: false },
];

const services = [
  { title: 'Structure', body: 'LLC vs free zone entity selection based on target market.' },
  { title: 'Banking', body: 'Direct intro to Wio, ENBD and Mashreq relationship managers.' },
  { title: 'Tax', body: 'Corporate Tax (9%) registration and exemption planning.' },
  { title: 'Concierge', body: 'Emirates ID VIP processing and medical biometrics fast-track.' },
];

const sources = [
  { name: 'ICP — UAE Golden Residency', href: 'https://icp.gov.ae/en/services/uae-golden-residency/', what: 'Golden Visa categories, the investor and entrepreneur thresholds, the 10-year term. Page body last updated 10 Sep 2026.', checked: '15 Oct 2026' },
  { name: 'ICP — UAE Green Residency', href: 'https://icp.gov.ae/en/services/uae-green-residency/', what: 'Green Visa for freelancers and the self-employed. Page body dated 12 Sep 2026.', checked: '15 Oct 2026' },
  { name: 'GDRFA Dubai — Golden Residence, investors', href: 'https://www.gdrfad.gov.ae/en/services/8ea80da4-f43e-11eb-0320-0050569629e8', what: 'The AED 2M deposit and property routes in Dubai.', checked: '15 Oct 2026' },
  { name: 'GDRFA Dubai — Golden Residence, entrepreneurs', href: 'https://www.gdrfad.gov.ae/en/services/8ea80da7-f43e-11eb-0320-0050569629e8', what: 'Entrepreneur routes, Dubai Future Foundation nomination, the AED 2M income asked on the incubator route.', checked: '15 Oct 2026' },
  { name: 'GDRFA Dubai — Green Residence, freelancers', href: 'https://gdrfad.gov.ae/en/services/f52024d1-b812-11ed-5210-4cd98f768936', what: 'Green Visa for freelancers in Dubai.', checked: '15 Oct 2026' },
  { name: 'u.ae — Golden Visa', href: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa', what: 'The government portal’s Golden Visa page (updated 28 Jul 2026); it lists 5 years for some categories.', checked: '15 Oct 2026' },
];

// No English blog article about the UAE exists yet (sitemap, 29 Oct 2026), so
// these are related guides on this site.
const reads = [
  {
    href: '/uae/golden-visa',
    stage: 'The Golden Visa',
    title: 'UAE Golden Visa',
    excerpt: 'Long-term UAE residency for investors, entrepreneurs, and exceptional talent.',
  },
  {
    href: '/country/turkey',
    stage: 'Nearby route',
    title: 'Türkiye Tech Visa',
    excerpt: 'A three-year work permit decided by a technopark jury rather than the Ministry.',
  },
  {
    href: '/country/israel',
    stage: 'Nearby route',
    title: 'Israel Innovation Visa',
    excerpt: 'Two years of residence, and acceptance by an approved landing pad before the Innovation Authority looks at your file.',
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const label = 'font-sans text-xs font-bold uppercase tracking-[0.18em]';

export default function UAEPage() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <JsonLd data={[howToJsonLd]} />

      <RouteProvider stops={STOPS} flag="ae" theme={THEME}>
        {/* ── Hero ── */}
        <header className="relative overflow-hidden bg-[#1a1a1a] text-white">
          <Image
            src="https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=1800&q=80&auto=format&fit=crop"
            alt="Towers along Sheikh Zayed Road in Dubai at dusk, with the Burj Khalifa behind them"
            fill
            priority
            unoptimized
            className="object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/95 via-[#1a1a1a]/80 to-[#1a1a1a]/35" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[800px] translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-t from-[#D4AF37] to-transparent opacity-20 blur-[100px]" />

          <div className="container relative mx-auto grid grid-cols-1 items-end gap-8 px-6 pb-12 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <nav aria-label="Breadcrumb" className="font-sans text-xs text-white/60 lg:col-span-2">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">›</li>
                <li><Link href="/country" className="hover:text-white">Countries</Link></li>
                <li aria-hidden="true">›</li>
                <li aria-current="page" className="text-white/85">United Arab Emirates</li>
              </ol>
            </nav>

            <div>
              <div className={`mb-5 flex items-center gap-3 text-white/75 ${label}`}>
                <Flag code="ae" uid="hero" width={36} />
                Destination: United Arab Emirates · Golden, Green, Blue
              </div>
              <h1>
                <span className="block font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.02em]">
                  Future <em className="text-[#D4AF37]">Capital.</em>
                </span>
                <span className="mt-4 block max-w-[46ch] font-sans text-lg font-medium leading-snug">
                  The UAE Golden Visa and Green Visa for founders and investors in 2026, step by step
                </span>
              </h1>
              <p className="mt-3 max-w-[56ch] font-sans text-base leading-relaxed text-white/70">
                There is no classic startup visa in the UAE. Founders and investors use its long-term residencies instead: the 10-year Golden Visa, the
                5-year Green Visa and the Blue Visa (2025), with zero personal tax and 100% foreign ownership. The real work is the company and the bank
                account behind the visa.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-white/60">
                <span>By <span className="text-white">Farjad P.D</span></span>
                <span>Updated <time dateTime={UPDATED.iso} className="text-white">{UPDATED.label}</time></span>
                <span>Golden and Green Visa figures checked against ICP, GDRFA Dubai and u.ae</span>
              </p>
              <p className="mt-5 max-w-[60ch] border-l-2 border-[#D4AF37] pl-3 font-sans text-sm text-white/70">
                <strong className="text-white">Official pages disagree.</strong> ICP and GDRFA Dubai give the Golden Visa 10 years; u.ae lists 5 for some
                categories. And GDRFA Dubai asks incubator-backed entrepreneurs for AED 2M of income where ICP asks for none.
              </p>
            </div>

            <aside aria-label="How to use this page" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className={`text-[#D4AF37] ${label}`}>Your route through this page</p>
              <ol className="my-4 list-decimal space-y-1 pl-5 font-sans text-sm text-white/75">
                <li>Find the tier that fits you</li>
                <li>Choose Dubai or Abu Dhabi</li>
                <li>Walk the five steps</li>
                <li>Check the money</li>
                <li>Sort perks from catches</li>
              </ol>
              <a href="#tiers" className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
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
          question="Is there a startup visa in the UAE?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              Not in the classic sense. There is no stand-alone startup visa: founders and investors use the UAE&apos;s long-term residencies. The 10-year
              Golden Visa covers property owners and depositors at AED 2 million and qualifying entrepreneurs; the 5-year Green Visa covers freelancers,
              skilled employees and investors; the Blue Visa covers sustainability work.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '10 yr', label: 'Golden Visa', sub: 'renewable, no sponsor' },
              { stat: '5 yr', label: 'Green Visa', sub: 'freelancers, skilled, investors' },
              { stat: 'AED 2M', label: 'Golden threshold', sub: 'property or bank deposit' },
              { stat: '0%', label: 'Personal tax', sub: 'with 100% foreign ownership' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-4xl text-[#1a1a1a]">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/55">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Beyond oil.</strong> The UAE has evolved beyond oil and now positions itself as a global HQ for Web3, AI
              and family offices. With the introduction of the Blue Visa (2025) alongside the Golden and Green tiers, it offers one of the most
              diversified residency portfolios in the world.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Who decides.</strong> Residence visas are issued by the Federal Authority for Identity, Citizenship,
              Customs &amp; Port Security (ICP), and in Dubai by GDRFA Dubai. For the Golden Visa&apos;s entrepreneur route in Dubai, Dubai Future
              Foundation nominates first and GDRFA Dubai reviews last.
            </p>
          </div>
        </RouteStop>

        {/* 02 — Which tier */}
        <RouteStop
          id="tiers"
          number={2}
          tone="white"
          eyebrow="The visa portfolio"
          question="Which UAE visa fits you: Golden, Green or Blue?"
          task="Answer all seven"
          answer={
            <p>
              Match the tier to what you bring. Property or a bank deposit of AED 2 million, or a qualifying business, points to the 10-year Golden Visa.
              Freelancing, skilled employment without a sponsor, or an AED 1 million investment points to the 5-year Green Visa. Sustainability work
              points to the 10-year Blue Visa.
            </p>
          }
        >
          <TierFinder
            stopId="tiers"
            doors={doors}
            noneNote="None of the doors is open to you today. Bring your situation to a free session and we will tell you honestly whether the UAE is the right route."
          />

          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {tiers.map((t) => (
              <li key={t.name} className={`rounded-2xl p-6 md:p-8 ${t.dark ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'border border-[#1a1a1a]/10 bg-[#F2F0E9]'}`}>
                <h3 className={`font-serif text-3xl ${t.dark ? 'text-[#D4AF37]' : ''}`}>{t.name}</h3>
                <p className={`mb-5 mt-1 ${label} ${t.dark ? 'text-white/60' : 'text-[#1a1a1a]/55'}`}>{t.term}</p>
                <ul className={`grid gap-3 font-sans text-sm ${t.dark ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                  {t.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.dark ? 'bg-[#D4AF37]' : 'bg-[#7D6310]'}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/65 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">The entrepreneur route has changed.</strong> Older guides quote an AED 500,000 project. That figure comes
              from a 2018 decree and is on no current official page. Today the Golden Visa&apos;s entrepreneur doors are the three above.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Not yet checked.</strong> The Blue Visa, and the Green Visa&apos;s skilled-employee and AED 1M investor
              categories, are kept here as the page has long stated them but have not yet been checked against an official source.{' '}
              <Link href="/uae/golden-visa" className="font-bold text-[#7D6310] underline underline-offset-2">The Golden Visa in more detail</Link>.
            </p>
          </div>
        </RouteStop>

        {/* 03 — Dubai or Abu Dhabi */}
        <RouteStop
          id="arena"
          number={3}
          eyebrow="Choose your arena"
          question="Dubai or Abu Dhabi: where should a founder set up?"
          task="Pick your sector"
          answer={
            <p>
              Two cities, two distinct strategies. Dubai suits speed: fintech, crypto and e-commerce, with fast setup, high visibility and zones such as
              DIFC, DMCC and DWTC. Abu Dhabi, the capital, suits deep tech, AI, healthcare and clean energy, with ADGM, Hub71 and Masdar backed by
              sovereign wealth funds: a slower pace, more capital support.
            </p>
          }
        >
          <ArenaPicker stopId="arena" arenas={arenas} />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
              <caption className="pb-2 text-left font-bold">Dubai and Abu Dhabi side by side</caption>
              <thead>
                <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Factor</span></th>
                  <th scope="col" className="px-4 py-3">Dubai</th>
                  <th scope="col" className="px-4 py-3">Abu Dhabi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Role', 'The commercial hub', 'The capital'],
                  ['Optimised for', 'Speed, fintech, crypto, e-commerce', 'Deep tech, AI, healthcare, clean energy'],
                  ['Zones and programmes', 'DIFC, DMCC, DWTC', 'ADGM, Hub71, Masdar'],
                  ['Pace', 'Fast setup, high visibility', 'Slower pace, higher capital support'],
                  ['Character', 'Cosmopolitan lifestyle', 'Backed by massive sovereign wealth funds'],
                ].map(([k, d, a]) => (
                  <tr key={k} className="border-b border-[#1a1a1a]/10 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold">{k}</th>
                    <td className="px-4 py-3">{d}</td>
                    <td className="px-4 py-3">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RouteStop>

        {/* 04 — How to apply */}
        <RouteStop
          id="steps"
          number={4}
          tone="white"
          eyebrow="The process"
          question="How do you get UAE residency as a founder or investor?"
          task="Walk to step 5"
          answer={
            <p>
              Pick your city, pick the visa tier that matches your assets, and structure the company as a mainland LLC or a free zone entity that meets
              the Economic Substance Regulations. Then open the corporate bank account, register for Corporate Tax, and finish the residency with ICP or
              GDRFA Dubai: medical, biometrics, Emirates ID.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Where it goes wrong:</strong> getting the residency is the easy part. A company structured for the wrong
            market, or not bankable, is what turns a few weeks into months.
          </p>
        </RouteStop>

        {/* 05 — Money */}
        <RouteStop
          id="money"
          number={5}
          eyebrow="Thresholds · checked 15 Oct 2026"
          question="How much do you need to invest for a UAE Golden Visa in 2026?"
          task="Read the thresholds"
          completeOn="view"
          message="Thresholds read"
          answer={
            <p>
              AED 2 million in UAE property or in a bank deposit qualifies for the 10-year Golden Visa on its own. Entrepreneurs qualify through an SME
              with AED 1 million in annual revenue, an accredited incubator&apos;s approval, or businesses founded and sold for AED 7 million in total.
              The Green Visa&apos;s investor category starts at AED 1 million.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Residency thresholds, in UAE dirhams (AED)</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Tier</th>
                    <th scope="col" className="px-4 py-3">Route</th>
                    <th scope="col" className="px-4 py-3">Amount</th>
                    <th scope="col" className="px-4 py-3">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {thresholds.map((r) => (
                    <tr key={r.route} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <td className="px-4 py-3">{r.tier}</td>
                      <th scope="row" className="px-4 py-3 text-left font-normal">{r.route}</th>
                      <td className="px-4 py-3 tabular-nums">{r.amount}</td>
                      <td className={`px-4 py-3 text-xs ${r.checked ? 'text-[#1a1a1a]/60' : 'font-bold text-[#B4531A]'}`}>{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">
                Any one Golden route is enough. On the incubator route ICP sets no income figure; GDRFA Dubai asks for AED 2,000,000 of income.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] overflow-hidden rounded-2xl bg-white font-sans text-sm">
                <caption className="pb-2 text-left font-bold">Tax at a glance</caption>
                <thead>
                  <tr className="border-b border-[#1a1a1a]/10 text-left text-[11px] uppercase tracking-[0.1em] text-[#1a1a1a]/55">
                    <th scope="col" className="px-4 py-3">Tax</th>
                    <th scope="col" className="px-4 py-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.map((t) => (
                    <tr key={t.label} className="border-b border-[#1a1a1a]/10 last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        {t.label}
                        <span className="block text-xs text-[#1a1a1a]/55">{t.note}</span>
                      </th>
                      <td className="px-4 py-3 font-serif text-2xl tabular-nums">{t.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-sans text-xs text-[#1a1a1a]/55">Tax rates not yet checked against an official source.</p>
            </div>
          </div>
        </RouteStop>

        {/* 06 — Perks and catches */}
        <RouteStop
          id="life"
          number={6}
          tone="white"
          eyebrow="Perk or catch?"
          question="What does UAE residency give you, and what are the catches?"
          task="Guess all eight"
          answer={
            <p>
              You get zero personal income tax, 100% foreign ownership and, on the Golden Visa, a 10-year residence with no sponsor. The catches sit
              around it: a 9% Corporate Tax, the Economic Substance Regulations, a corporate bank account that can take 3–6 months if the company is
              structured incorrectly, and no permanent residence.
            </p>
          }
        >
          <PerkOrCatch stopId="life" items={rights} />

          <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <h3 className="mb-2 font-serif text-2xl text-[#1a1a1a]">Beyond the visa</h3>
              <p className="mb-4">
                Getting the residency is the easy part. The challenge is the infrastructure. Setting up a corporate bank account in the UAE can take 3–6
                months if structured incorrectly.
              </p>
              <p>
                We handle the &quot;mainland vs free zone&quot; selection to ensure your business entity is compliant with the Economic Substance
                Regulations (ESR) and bankable from day one.
              </p>
            </div>
            <div className="rounded-2xl bg-[#1a1a1a] p-6 text-[#F2F0E9] md:p-8">
              <h3 className="mb-6 font-serif text-2xl">VisaRoads corporate services</h3>
              <ul className="grid grid-cols-1 gap-6 font-sans text-sm sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.title} className="border-l border-[#D4AF37] pl-4">
                    <b className="mb-1 block text-[#D4AF37]">{s.title}</b>
                    <span className="text-white/70">{s.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RouteStop>

        {/* 07 — Long term */}
        <RouteStop
          id="residence"
          number={7}
          eyebrow="Permanent residence and citizenship"
          question="Can you get permanent residence or citizenship in the UAE?"
          task="Read the answer"
          completeOn="view"
          message="Long term read"
          answer={
            <p>
              No permanent residence exists. The Golden Visa is a 10-year residence, renewable for as long as you keep meeting its conditions, with no
              sponsor needed; the Green Visa runs for 5 years and is renewable too. Citizenship is by nomination only, so plan on renewing residence
              rather than counting years towards a passport.
            </p>
          }
        >
          <ol className="grid grid-cols-1 gap-3 font-sans text-sm text-[#1a1a1a]/65 md:grid-cols-3">
            {[
              ['Golden Visa', '10 years, renewable while the conditions are met. No sponsor.'],
              ['Green Visa', '5 years, renewable, and it allows family sponsorship.'],
              ['Citizenship', 'By nomination only. No residence clock leads to it.'],
            ].map(([t, s]) => (
              <li key={t} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                <b className="mb-1 block font-serif text-xl text-[#1a1a1a]">{t}</b>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/65">
            <strong className="text-[#1a1a1a]">Check the term on your own approval.</strong> ICP and GDRFA Dubai give the Golden Visa 10 years; the u.ae
            government portal lists 5 years for some categories, including real-estate investors and entrepreneurs.
          </p>
        </RouteStop>

        {/* Sources */}
        <section aria-labelledby="sources-h" className="border-b border-[#1a1a1a]/10 bg-white px-6 py-14">
          <div className="container mx-auto">
            <p className={`text-[#7D6310] ${label}`}>Where these figures come from</p>
            <h2 id="sources-h" className="mt-2 font-serif text-3xl">Sources</h2>
            <ol className="mt-6 grid max-w-4xl list-decimal gap-2 pl-5 font-sans text-sm">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#D4AF37] underline-offset-2 hover:text-[#7D6310]">
                    {s.name}
                  </a>{' '}
                  <span className="text-[#1a1a1a]/60">{s.what} Checked {s.checked}.</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-4xl font-sans text-sm text-[#1a1a1a]/60">
              <strong className="text-[#1a1a1a]">Not yet checked against an official source:</strong> the Blue Visa, the Green Visa&apos;s skilled-employee
              and AED 1M investor categories, the 9% Corporate Tax, the Economic Substance Regulations, and the 3–6-month banking estimate, which comes
              from our own client work. Check them at{' '}
              <a href="https://u.ae/" target="_blank" rel="noopener noreferrer" className="underline decoration-[#D4AF37] underline-offset-2 hover:text-[#7D6310]">u.ae</a>{' '}
              before you rely on them.
            </p>
          </div>
        </section>

        {/* Book a session */}
        <section id="book" aria-labelledby="book-h" className="scroll-mt-32 bg-[#1a1a1a] px-6 py-16 text-white">
          <div className="container mx-auto grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div>
              <RouteFinish />
              <p className={`text-[#D4AF37] ${label}`}>Talk it through</p>
              <h2 id="book-h" className="mt-2 font-serif text-4xl leading-tight">
                Habibi, <span className="italic text-[#D4AF37]">welcome home.</span>
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-white/70">
                The Golden Visa is the ultimate asset protection strategy. Let&apos;s determine if you qualify via real estate or entrepreneurship. Book a
                free session and get an honest read on your tier, your company structure and whether the UAE is the right route. If it isn&apos;t,
                we&apos;ll say so.
              </p>
              <ul className="my-5 flex flex-wrap gap-2 font-sans text-xs">
                {['Free · 60 minutes', 'Online, Google Meet', 'Link sent after booking'].map((p) => (
                  <li key={p} className="rounded-full border border-white/25 px-3 py-1.5">{p}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/book-meeting" className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 font-sans text-sm font-bold text-[#1a1a1a] transition-transform hover:-translate-y-0.5">
                  Book a free session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/country" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-sans text-sm font-bold transition-colors hover:bg-white/10">
                  Compare jurisdictions
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

        {/* Related guides: no English UAE blog article exists yet */}
        <section aria-labelledby="reads-h" className="bg-[#F2F0E9] px-6 py-16">
          <div className="container mx-auto">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={`text-[#7D6310] ${label}`}>Keep reading</p>
                <h2 id="reads-h" className="mt-2 font-serif text-3xl md:text-4xl">More UAE and regional guides</h2>
              </div>
              <Link href="/country" className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#7D6310] hover:underline">
                All countries <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {reads.map((r) => (
                <li key={r.href} className="group rounded-2xl border border-[#1a1a1a]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a1a1a]/10">
                  <Link href={r.href} className="grid h-full gap-2 p-5">
                    <span className={`text-[#7D6310] ${label}`}>{r.stage}</span>
                    <h3 className="font-serif text-xl leading-snug">{r.title}</h3>
                    <span className="font-sans text-sm text-[#1a1a1a]/65">{r.excerpt}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-sans text-xs font-bold text-[#7D6310]">
                      Read the guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RouteProvider>

      {/* Notice: the old page had no disclaimer; this says only what the sources support. */}
      <section className="border-t border-[#1a1a1a]/10 bg-[#F9F9F9] px-6 py-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1a1a1a]/30" />
            <p className="font-sans text-[11px] leading-relaxed text-[#1a1a1a]/55">
              <strong>Notice:</strong> The Golden and Green Visa figures on this page were checked on 15 October 2026 against ICP, GDRFA Dubai and u.ae;
              figures marked &quot;not yet checked&quot; were not. They are provided for informational purposes only. Official sources disagree on some
              points, and rules change — always verify current requirements with ICP at{' '}
              <a href="https://icp.gov.ae/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#7D6310]">icp.gov.ae</a>,
              GDRFA Dubai at{' '}
              <a href="https://www.gdrfad.gov.ae/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#7D6310]">gdrfad.gov.ae</a>{' '}
              or the government portal at{' '}
              <a href="https://u.ae/" target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-[#7D6310]">u.ae</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
