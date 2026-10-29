// ============================================================================
// /en/startup-visa-canada/cost — the English page body.
// Same guided-route shape as /country/finland. The programme is PAUSED; the
// costs are kept for files in progress and for comparison with the pilot.
//
// Facts: content/fa/canada-startup-visa-cost.ts (updated 2026-09-12),
// lib/canada-suv.ts, and IRCC's fee list, re-read 2026-10-29. The module's
// government fees were out of date and are replaced by IRCC's:
//   principal processing ~$1,625 → $1,895; right of permanent residence fee
//   ~$575 → $600; spouse processing ~$850 → $990; dependent child ~$230 →
//   $270. Biometrics ($85, family max $170), the work permit ($155) and the
//   open work permit holder fee ($100) were confirmed unchanged. The module's
//   "$4,000–5,000 for a family of four" is now computed: $4,795.
//
// Every other money figure here (incubator programmes, preparation, RCIC,
// translation, travel, test fees, medicals, the total) is the module's own
// MARKET RANGE, labelled as such on the page. None is a VisaRoads price, and
// no VisaRoads price appears anywhere on this page.
// ============================================================================
import React from 'react';
import { Link } from '@/routing';
import { RouteProvider, RouteRail, RouteStop, type RouteStopDef } from '@/components/route/RouteProgress';
import { OpenedTracker, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { SUV_ORGS, SUV_SETTLEMENT_FUNDS, SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON, SUV_SOURCES } from '@/lib/canada-suv';
import { FairOrFlag, FeeCalculator, type FeeTable } from '../_shared/SuvWidgets';
import {
  BookingSection,
  DataTable,
  FEES_SOURCE,
  FaqList,
  IRCC_FEES,
  PAUSED_ON_LABEL,
  RelatedReads,
  SanctionsNote,
  SourcesSection,
  STATUS_SOURCES,
  SubpageJsonLd,
  SuvHero,
  SuvNotice,
  SuvStatus,
  THEME,
  cad,
  label,
  type SourceItem,
} from '../_shared/suv-guide';

const PATH = '/startup-visa-canada/cost';

/** Brandless title ≤ 60, description ≤ 160 — the lead copies these into lib/pageMeta.ts. */
export const META = {
  path: PATH,
  title: 'Canada Start-up Visa Cost: Fees and Real Budget',
  description:
    'IRCC fees, settlement funds, designated organization charges, preparation and the costs people forget, itemised, plus the charges that signal a scam.',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'fees', label: 'IRCC fees' },
  { id: 'organization', label: 'Organization' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'extras', label: 'Extras' },
  { id: 'total', label: 'Total' },
  { id: 'timeline', label: 'When you pay' },
  { id: 'scams', label: 'Scam fees' },
  { id: 'faq', label: 'FAQ' },
];

const F = IRCC_FEES;
const principalTotal = F.principalProcessing + F.rprf;
const familyOfFour = F.principalProcessing + F.rprf + F.spouseProcessing + F.rprf + 2 * F.child + F.biometricsFamilyMax;

const feeTable: FeeTable = {
  principalProcessing: F.principalProcessing,
  rprf: F.rprf,
  spouseProcessing: F.spouseProcessing,
  child: F.child,
  biometricsPerPerson: F.biometricsPerPerson,
  biometricsFamilyMax: F.biometricsFamilyMax,
  funds: [1, 2, 3, 4, 5, 6, 7].map((n) => SUV_SETTLEMENT_FUNDS[n]),
  fundsExtra: SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON,
};

const feeRows = [
  ['Principal applicant: processing fee', cad(F.principalProcessing), 'Paid with the application'],
  ['Principal applicant: right of permanent residence fee', cad(F.rprf), 'Normally paid on approval'],
  ['Spouse or partner: processing fee', cad(F.spouseProcessing), 'Paid with the application'],
  ['Spouse or partner: right of permanent residence fee', cad(F.rprf), 'Normally paid on approval'],
  ['Each dependent child', cad(F.child), 'Per child'],
  ['Biometrics', cad(F.biometricsPerPerson), `Per person; ${cad(F.biometricsFamilyMax)} maximum for a family applying together`],
  ['Work permit (optional)', cad(F.workPermit), `Plus the ${cad(F.openWorkPermitHolder)} open work permit holder fee`],
];

const marketRows = [
  ['Incubator programme fee', 'A few thousand to tens of thousands; $10,000–$40,000 is the common range we see', 'For the programme itself, not for a letter'],
  ['Business plan, financial model and pitch deck', 'A few thousand to about $15,000', 'Depends on depth and how much you do yourself'],
  ['Regulated immigration consultant (RCIC) or lawyer', '$5,000–$15,000 for a Start-up Visa file', 'To file and follow the application'],
  ['Certified translations', 'Several hundred; over $1,000 for document-heavy files', 'Authentication by the issuing country is extra'],
  ['Travel for biometrics and the medical', '$1,000–$3,000 for a family', 'When there is no visa centre in your country'],
  ['Language test (IELTS or CELPIP)', 'About $300 per sitting', 'Often taken more than once'],
  ['Incorporation and first-year accounting', 'A few hundred to about $2,000', 'In the first year'],
  ['Medical exam', '$200–$400 per person, usually', 'Set by the panel physician and the country'],
];

const steps: RouteStep[] = [
  {
    title: 'Prepare the business',
    who: 'You, or advisers you hire',
    body: 'A business plan with real Canadian and North American market research, a three-to-five-year financial model on defensible assumptions, and a pitch deck that tells the story in ten minutes. An incubator committee sees dozens of applications a month; yours has to meet that standard.',
    note: 'Market range: a few thousand to about $15,000, depending on depth and how much you do yourself.',
    figure: 'Range',
    figureLabel: 'market, not official',
  },
  {
    title: 'Join a designated organization',
    who: 'Incubator, angel group or VC fund',
    body: `Incubators usually charge a programme fee. Angel groups and venture capital funds invest in you instead — at least ${cad(SUV_ORGS.angelMinimum)} and ${cad(SUV_ORGS.ventureCapitalMinimum)} respectively, in exchange for equity — though some angel groups charge a due-diligence fee.`,
    note: 'The fee pays for the programme. A letter of support is the result of an assessment and is never for sale.',
    figure: '$10–40k',
    figureLabel: 'common incubator range we see',
  },
  {
    title: 'File the application',
    who: 'IRCC',
    body: `Pay the processing fees for yourself and each family member, and the biometrics fee, when you submit: ${cad(F.principalProcessing)} for you, ${cad(F.spouseProcessing)} for a spouse or partner, ${cad(F.child)} per child, ${cad(F.biometricsPerPerson)} biometrics per person to a family maximum of ${cad(F.biometricsFamilyMax)}.`,
    note: 'IRCC fees are paid online by international card. Have the language test result, under two years old, in hand before you file.',
    figure: cad(F.principalProcessing),
    figureLabel: 'principal processing fee',
  },
  {
    title: 'Medicals, police certificates, translations',
    who: 'Other organizations',
    body: 'The medical exam with an IRCC panel physician, police certificates and certified translations are paid to the organizations that provide them, not to IRCC. Applicants without a visa centre at home also pay to travel to a third country.',
    note: 'Medical exam: usually $200–$400 per person, set by the physician and country.',
    figure: '$200–$400',
    figureLabel: 'medical, per person',
  },
  {
    title: 'Approval',
    who: 'IRCC',
    body: `In most cases the right of permanent residence fee — ${cad(F.rprf)} for you and ${cad(F.rprf)} for a spouse or partner — is paid when the application is approved. An optional work permit costs ${cad(F.workPermit)} plus the ${cad(F.openWorkPermitHolder)} open work permit holder fee.`,
    note: `Paused: no new Start-up Visa applications have been accepted since ${PAUSED_ON_LABEL}.`,
    figure: cad(F.rprf),
    figureLabel: 'per adult, on approval',
  },
];

const flags = [
  { title: 'An incubator programme fee for real mentoring, space and network access', content: 'Fair. Most incubator programmes charge a fee, and it pays for the programme. It does not buy the letter: you can pay and still not be supported.', fair: true },
  { title: 'A “guaranteed letter of support” for a set price', content: 'Red flag. A letter of support is the result of an assessment, not a product. A seller of guaranteed letters is either not on IRCC’s list or at risk of removal from it, and its files are scrutinised.', fair: false },
  { title: 'A “visa guarantee”, or a refund promised only verbally', content: 'Red flag. Nobody can guarantee an IRCC decision. A genuine refund undertaking is written into the contract, says which failure at which stage it covers, and lists its exclusions there. If it is only spoken, or nobody can say which refusal it covers, it does not exist.', fair: false },
  { title: 'IRCC’s own fees, paid online to IRCC', content: `Fair. Government fees are fixed and published: ${cad(principalTotal)} for a principal applicant including the right of permanent residence fee. They are the smallest and most transparent part of the bill.`, fair: true },
  { title: 'A large up-front payment before anyone has assessed your business', content: 'Red flag. A firm that names a final price before seeing your business has not assessed your business.', fair: false },
  { title: '“Our exclusive designated organization”', content: 'Red flag. Designated organizations are independent and publicly listed. No agency has one of its own.', fair: false },
  { title: 'A “ready-made team” or “ready-made startup” for sale', content: 'Red flag. Nominal founders and rented businesses collapse in the interview, and a misrepresented application can lead to a ban on entering Canada.', fair: false },
  { title: 'Cash, or a transfer to a personal account, with no contract', content: 'Red flag. No contract, no record and no way back.', fair: false },
];

const faqs = [
  {
    q: 'What is the lowest possible cost of the Canada Start-up Visa?',
    a: 'If you write the business plan yourself, find a low-cost incubator and apply single, the route can be done for roughly $15,000–$20,000 plus settlement funds, in our observation of the market. That low end also carries lower odds, because the quality of the package feeds directly into whether you get a letter of support.',
  },
  {
    q: 'Do I have to invest my own money in the startup?',
    a: 'IRCC sets no minimum. But a startup with no launch capital at all is not credible to a designated organization or to an immigration officer. The right amount depends on the business model, and your financial model has to justify it.',
  },
  {
    q: 'Is the incubator fee the price of the letter of support?',
    a: 'No, and if it is presented that way, treat it as a warning sign. The fee pays for the incubator’s actual programme. The letter of support is the outcome of an assessment of your business and may not be issued even if you have paid for the programme.',
  },
  {
    q: 'Can I pay the costs from a sanctioned country such as Iran?',
    a: 'IRCC fees are paid online by international credit card, and Iranian cards do not work. Most other costs also need an account or card in a third country. Solve this early.',
  },
  {
    q: 'How much do you charge?',
    a: 'We quote after a free initial assessment, based on the work your case actually needs — there is no single price for everyone. We do not sell letters of support or visas; we sell preparation. If the assessment shows the route is not for you, we tell you that.',
  },
];

const sources: SourceItem[] = [
  { name: 'IRCC — Fee list', href: FEES_SOURCE, what: 'Start-up Visa processing fees, the right of permanent residence fee, dependants, biometrics and work permit fees.', checked: '29 Oct 2026' },
  ...STATUS_SOURCES,
  { name: 'IRCC — Start-up Visa: how to apply', href: SUV_SOURCES.apply, what: 'Fees paid with the application, the right of permanent residence fee on approval, and costs paid to other organizations.', checked: '29 Oct 2026' },
  { name: 'IRCC — Designated organizations', href: SUV_SOURCES.designatedOrganizations, what: `The ${cad(SUV_ORGS.ventureCapitalMinimum)} and ${cad(SUV_ORGS.angelMinimum)} investment minimums.`, checked: '29 Oct 2026' },
];

export default function CostEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <SubpageJsonLd
        path={PATH}
        title={META.title}
        description={META.description}
        crumb="Cost"
        citation={sources.map((s) => s.href)}
        howTo={{ name: 'When each Canada Start-up Visa cost is paid', steps }}
        faqs={faqs}
      />

      <RouteProvider stops={STOPS} flag="ca" theme={THEME}>
        <SuvHero
          crumb="Cost"
          brand={<>What it <em className="text-[#FF8F85]">really costs.</em></>}
          phrase="The Canada Start-up Visa cost in 2026, step by step"
          lede={
            <p>
              Far less than an investor programme, and far more than the figure in the advertisements. This page separates every line so you know where
              the money goes — and which charges should not exist at all. The programme itself is paused.
            </p>
          }
          checkedAgainst="IRCC’s fee list"
          routeItems={['Work out IRCC’s fees for your household', 'See what organizations and preparation cost', 'Add the costs people forget', 'Sort fair charges from scams']}
          start="#fees"
        />

        <SuvStatus current="cost" />

        <RouteRail />

        {/* 01 — Snapshot */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="How much does the Canada Start-up Visa cost?"
          task="Read the four figures"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              There is no set minimum investment. IRCC’s fees are {cad(principalTotal)} for a principal applicant and {cad(familyOfFour)} for a family of
              four with biometrics. Settlement funds of {cad(SUV_SETTLEMENT_FUNDS[1])} or more are your own money, not a fee. With an organization,
              preparation and extras, a typical family spends $30,000–$70,000 in our market observation.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '$0', label: 'Minimum investment', sub: 'none set by IRCC' },
              { stat: cad(principalTotal), label: 'IRCC fees, one applicant', sub: 'processing + right of PR fee' },
              { stat: cad(SUV_SETTLEMENT_FUNDS[1]), label: 'Settlement funds', sub: 'one person; yours to keep' },
              { stat: '$30–70k', label: 'Typical family total', sub: 'market observation, excluding funds' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-3xl text-[#7F1D16] md:text-4xl">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/60">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">This programme does not ask you to invest.</strong> Unlike the provincial entrepreneur programmes or the
              US EB-5, the Start-up Visa sets no minimum investment of your own. Capital that goes into the company, if any does, comes from the
              designated organization, not from your pocket.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Three kinds of cost, plus funds.</strong> Government fees are fixed and transparent; preparation and the
              designated organization come in ranges; side costs run higher for applicants from sanctioned countries. Settlement funds are not a cost:
              they are money you must have and take with you.
            </p>
          </div>
        </RouteStop>

        {/* 02 — IRCC fees */}
        <RouteStop
          id="fees"
          number={2}
          tone="white"
          eyebrow="Government fees · IRCC fee list"
          question="What are IRCC’s government fees for the Start-up Visa?"
          task="Set up your household"
          answer={
            <p>
              The principal applicant pays a {cad(F.principalProcessing)} processing fee and a {cad(F.rprf)} right of permanent residence fee. A spouse or
              partner pays {cad(F.spouseProcessing)} plus {cad(F.rprf)}, each dependent child {cad(F.child)}, and biometrics cost {cad(F.biometricsPerPerson)}{' '}
              per person, capped at {cad(F.biometricsFamilyMax)} for a family. For a family of four that is {cad(familyOfFour)}, before medical exams.
            </p>
          }
        >
          <FeeCalculator stopId="fees" t={feeTable} />
          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <DataTable
              caption="IRCC fees for the Start-up Visa, CAD (fee list read 29 Oct 2026)"
              head={['Fee', 'Amount', 'When or how']}
              rows={feeRows}
              wide
              note={<>IRCC raises its fees from time to time; check the day’s figure on <a href={FEES_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">IRCC’s fee list</a>.</>}
            />
            <div className="grid content-start gap-4 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <p>
                <strong className="text-[#1a1a1a]">The smallest, clearest part of the bill.</strong> Government fees for a family of four come to{' '}
                {cad(familyOfFour)} on today’s list — the most transparent line in the whole budget.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">Not IRCC’s figures:</strong> the medical exam is charged by the panel physician and varies by doctor
                and country, usually $200–$400 per person in our observation.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 03 — Designated organization */}
        <RouteStop
          id="organization"
          number={3}
          eyebrow="Incubators, angels, VC funds"
          question="What does a designated organization charge for the Start-up Visa?"
          task="Read the three models"
          completeOn="view"
          message="Organization costs read"
          answer={
            <p>
              It depends on the type. Most incubators charge a programme fee, from a few thousand to tens of thousands of dollars; $10,000–$40,000 is the
              common range we see. Angel groups invest at least {cad(SUV_ORGS.angelMinimum)} in you and venture capital funds at least{' '}
              {cad(SUV_ORGS.ventureCapitalMinimum)}, in exchange for equity. No organization sells a letter of support.
            </p>
          }
        >
          <ul className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { t: 'Incubators', fig: '$10k–$40k', sub: 'common programme-fee range we see', b: 'The fee pays for a real programme: mentoring, space, access to a network. It is not the price of the letter of support.' },
              { t: 'Angel investor groups', fig: `${cad(SUV_ORGS.angelMinimum)}+`, sub: 'they invest in you', b: 'They pay you, not the other way round — in exchange for equity. Some charge a due-diligence fee.' },
              { t: 'Venture capital funds', fig: `${cad(SUV_ORGS.ventureCapitalMinimum)}+`, sub: 'they invest in you', b: 'An investment of at least this much in exchange for equity, with no direct fee to you.' },
            ].map((o) => (
              <li key={o.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                <h3 className="font-serif text-2xl">{o.t}</h3>
                <p className="mt-2 font-serif text-3xl text-[#7F1D16]">{o.fig}</p>
                <p className="font-sans text-xs text-[#1a1a1a]/60">{o.sub}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{o.b}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[68ch] rounded-xl bg-[#FBE7E4] px-4 py-3 font-sans text-sm leading-relaxed">
            <strong>The red line: a letter of support is not for sale.</strong> This is where most confusion and most abuse happen, because there is no
            single rule. An organization that sells a “guaranteed letter” is either not on IRCC’s list or at risk of being removed from it, and its files are
            scrutinised. A payment with no real programme behind it is not a cost; it is the purchase of a high-risk file.{' '}
            <Link href="/startup-visa-canada/designated-organizations" className="font-bold text-[#B01C12] underline">How to vet an organization</Link>.
          </p>
        </RouteStop>

        {/* 04 — Preparation */}
        <RouteStop
          id="preparation"
          number={4}
          tone="white"
          eyebrow="Business plan, financial model, pitch deck"
          question="How much does preparing the Start-up Visa business plan cost?"
          task="Read the package"
          completeOn="view"
          message="Preparation read"
          answer={
            <p>
              On the market, professional preparation of the package runs from a few thousand dollars to about $15,000, depending on how deep the work goes
              and how much you do yourself. The package is a business plan with real Canadian market research, a three-to-five-year financial model and a
              pitch deck that tells the story in ten minutes.
            </p>
          }
        >
          <div className="grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">The standard is a committee’s, not an officer’s.</strong> A Canadian incubator committee sees dozens of
              applications a month. Your package needs real Canadian and North American market research, a financial model whose assumptions you can
              defend, and a deck that holds a room for ten minutes.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">A translated feasibility study is not a business plan.</strong> A study written for a bank at home and
              translated into English is cheaper, and it gets turned down. We quote our own fee only in a consultation, after an initial assessment,
              because it depends on the work actually needed.
            </p>
          </div>
        </RouteStop>

        {/* 05 — Extras */}
        <RouteStop
          id="extras"
          number={5}
          eyebrow="Side costs · market ranges, not official figures"
          question="Which Start-up Visa costs do applicants forget?"
          task="Read the eight lines"
          completeOn="view"
          message="Extras read"
          answer={
            <p>
              Certified translations, travel for biometrics and the medical, language tests that are often taken twice, a regulated immigration consultant or
              lawyer, incorporation and first-year accounting, and money-transfer charges. General estimates skip these lines, but they are real, and they
              run higher for applicants from sanctioned countries.
            </p>
          }
        >
          <DataTable
            caption="Side costs and market ranges, CAD — our observation, not IRCC figures and not VisaRoads prices"
            head={['Cost', 'Range we see', 'Note']}
            rows={marketRows}
            wide
          />
          <SanctionsNote>
            <p>
              Travel to a visa application centre in a third country — Dubai, Yerevan, Ankara or Tbilisi — for every family member means tickets, a stay and
              that country’s visa: usually $1,000–$3,000 for a family. Translation of Persian documents adds authentication by the judiciary and the Ministry
              of Foreign Affairs. And the fees on the legal channels for moving money out under sanctions can be substantial.
            </p>
          </SanctionsNote>
        </RouteStop>

        {/* 06 — Total */}
        <RouteStop
          id="total"
          number={6}
          tone="white"
          eyebrow="An honest range"
          question="What is a realistic total budget for the Start-up Visa?"
          task="Read the total"
          completeOn="view"
          message="Total read"
          answer={
            <p>
              Counting every line above but not settlement funds, a typical family’s total, in our observation, falls between $30,000 and $70,000 — the
              lower end through an incubator, the upper end on heavier routes. Add settlement funds, roughly $15,000–$30,000 depending on family size, and
              the real capital needed to launch the business in Canada.
            </p>
          }
        >
          <div className="grid max-w-5xl grid-cols-1 gap-6 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70 md:grid-cols-2">
            <p>
              <strong className="text-[#1a1a1a]">Two decisions move the range most:</strong> how much of the preparation you do yourself, and which
              designated organization you choose. Getting those two right saves more money than any negotiation.
            </p>
            <p className="rounded-xl bg-[#FBE7E4] px-4 py-3 text-[#1a1a1a]">
              <strong>Ask for a range, not a number.</strong> Anyone who gives you a low, fixed figure is either leaving costs out or will charge them later.
            </p>
          </div>
        </RouteStop>

        {/* 07 — When you pay */}
        <RouteStop
          id="timeline"
          number={7}
          eyebrow="The money, in order"
          question="When do you pay each Start-up Visa cost?"
          task="Walk to step 5"
          answer={
            <p>
              Preparation comes first, then the designated organization’s programme. Processing and biometrics fees are paid when you file; medical exams,
              police certificates and translations go to other organizations along the way; and the {cad(F.rprf)} right of permanent residence fee per adult
              is normally paid on approval.
            </p>
          }
        >
          <StepWalker stopId="timeline" steps={steps} />
        </RouteStop>

        {/* 08 — Scams */}
        <RouteStop
          id="scams"
          number={8}
          tone="white"
          eyebrow="Fair practice or red flag?"
          question="Which Start-up Visa fees are signs of a scam?"
          task="Sort all eight"
          answer={
            <p>
              Walk away from a guaranteed letter of support for a set price, a visa guarantee or a verbal refund promise, a large payment before any
              assessment, an agency’s “exclusive” designated organization, a ready-made team or startup, and cash or personal-account payments with no
              contract. None of these exists in any law.
            </p>
          }
        >
          <FairOrFlag stopId="scams" items={flags} />
        </RouteStop>

        {/* 09 — FAQ */}
        <RouteStop
          id="faq"
          number={9}
          eyebrow="Questions founders ask"
          question="What else do founders ask about the Start-up Visa cost?"
          task="Open three answers"
          answer={<p>Five answers: the cheapest realistic route, whether you must invest your own money, what an incubator fee pays for, paying from a sanctioned country, and how we charge.</p>}
        >
          <FaqList faqs={faqs} />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        <SourcesSection sources={sources} />

        <BookingSection
          heading={<>Get your budget read in a <span className="italic text-[#FF8F85]">free session.</span></>}
          body="Bring your numbers. We will tell you which costs are real for your case, which ones you can do yourself, and whether Canada is the right route while the Start-up Visa is paused. If it isn’t, we will say so."
          extra={
            <p className="mt-3 font-sans text-sm text-white/75">
              Also on this programme: <Link href="/startup-visa-canada/requirements" className="underline">requirements and documents</Link> and{' '}
              <Link href="/startup-visa-canada/designated-organizations" className="underline">designated organizations</Link>.
            </p>
          }
        />

        <RelatedReads />
      </RouteProvider>

      <SuvNotice>
        Government fees are IRCC’s; every other money figure on this page is a market range we have observed, not an official figure and not a VisaRoads
        price.
      </SuvNotice>
    </div>
  );
}
