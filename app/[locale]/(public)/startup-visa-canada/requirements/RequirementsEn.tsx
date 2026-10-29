// ============================================================================
// /en/startup-visa-canada/requirements — the English page body.
// A guided route in the shape of /country/finland: hero, sticky rail with the
// Canadian flag, one stop per question people search, each opening with a
// ~50-word direct answer. The programme is PAUSED; the page says so in the
// hero, in the status band and in its answers.
//
// Facts: content/fa/canada-startup-visa-requirements.ts (updated 2026-09-12),
// lib/canada-suv.ts, and these canada.ca pages, re-read 2026-10-29:
//   - language-testing.html: approved tests are CELPIP-General, IELTS General
//     Training, PTE Core, TEF Canada and TCF Canada; results under 2 years old
//     when you apply. The module said only IELTS General and CELPIP, and that
//     CLB 5 is "about IELTS 5 in each skill"; IRCC's table is IELTS reading
//     4.0, writing/listening/speaking 5.0. Corrected here.
//   - helpcentre qnum 651: the DESIGNATED ORGANIZATION names an applicant as
//     essential on the commitment certificate and letter of support, and if
//     IRCC refuses that person all related applicants are refused. The module
//     said IRCC declares them. Corrected here.
//   - eligibility.html: settlement funds table (updated 29 July 2025), funds
//     cannot be borrowed, 6-month filing window for certificates issued
//     before 1 January 2026.
// ============================================================================
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/routing';
import { RouteProvider, RouteRail, RouteStop, type RouteStopDef } from '@/components/route/RouteProgress';
import { GateQuiz, OpenedTracker, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import {
  SUV_RULES,
  SUV_SETTLEMENT_FUNDS,
  SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON,
  SUV_SOURCES,
  SUV_STATE,
} from '@/lib/canada-suv';
import { Checklist } from '../_shared/SuvWidgets';
import {
  BookingSection,
  DataTable,
  ESSENTIAL_PERSON_SOURCE,
  FaqList,
  LANGUAGE_SOURCE,
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

const PATH = '/startup-visa-canada/requirements';

/** Brandless title ≤ 60, description ≤ 160 — the lead copies these into lib/pageMeta.ts. */
export const META = {
  path: PATH,
  title: 'Canada Start-up Visa Requirements and Documents',
  description:
    'CLB 5 language, settlement funds by family size, the 10% and 50% voting-rights rules and the full document list for the paused Canada Start-up Visa.',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'gate', label: 'The 5 tests' },
  { id: 'steps', label: '5 steps' },
  { id: 'language', label: 'Language' },
  { id: 'funds', label: 'Funds' },
  { id: 'ownership', label: 'Ownership' },
  { id: 'letter', label: 'Letter' },
  { id: 'documents', label: 'Documents' },
  { id: 'abroad', label: 'Sanctioned countries' },
  { id: 'faq', label: 'FAQ' },
];

const certificateCutoffLabel = new Date(SUV_STATE.certificateCutoff).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const criteria = [
  {
    title: 'A letter of support',
    body: 'A designated organization (an incubator, angel investor group or venture capital fund on IRCC’s list) backs the business, gives you a letter of support and sends a commitment certificate to IRCC directly.',
  },
  {
    title: 'The ownership split',
    body: `Each applicant holds at least ${SUV_RULES.minVotingRightsPerApplicant}% of the total voting rights, and the applicants together with the designated organization hold more than ${SUV_RULES.minCombinedVotingRights}%. No more than ${SUV_RULES.maxOwnersPerBusiness} founders apply on one business.`,
  },
  {
    title: 'CLB 5 in every skill',
    body: `Canadian Language Benchmark ${SUV_RULES.language.benchmark} in reading, writing, listening and speaking, in English or French, from an approved test less than two years old when you apply.`,
  },
  {
    title: 'Settlement funds',
    body: `Money to support yourself and your family in Canada, separate from the company’s capital and not borrowed: ${cad(SUV_SETTLEMENT_FUNDS[1])} for one person on IRCC’s current table.`,
  },
  {
    title: 'A business run from Canada',
    body: 'The company is incorporated in Canada, actively managed from inside Canada, with an essential part of its operations there, outside Quebec. The designated organization also judges whether it is innovative, scalable and able to create jobs.',
  },
];

const steps: RouteStep[] = [
  {
    title: 'Win a letter of support',
    who: 'Designated organization',
    body: 'Pitch the business to a designated organization and pass its assessment and interview. If it backs you, it gives you a letter of support for your application and sends a commitment certificate, with the agreed shares, capital and each founder’s role, straight to IRCC.',
    note: 'Most founders talk to the organization before the company is even registered. That is fine: the conditions must be met by the time you file.',
    figure: '1',
    figureLabel: 'letter goes in the file',
  },
  {
    title: 'Incorporate and split the shares',
    who: 'You and your co-founders',
    body: `Register the company in Canada and set the voting rights so each applicant holds at least ${SUV_RULES.minVotingRightsPerApplicant}% and the applicants plus the designated organization hold more than ${SUV_RULES.minCombinedVotingRights}%. These must hold when you file and when IRCC decides.`,
    note: 'A new funding round that dilutes anyone below the threshold puts the file at risk. Check every share change with your lawyer first.',
    figure: `${SUV_RULES.minVotingRightsPerApplicant}%`,
    figureLabel: 'minimum each',
  },
  {
    title: 'Take an approved language test',
    who: 'CELPIP, IELTS, PTE, TEF or TCF',
    body: `Reach CLB ${SUV_RULES.language.benchmark} in all four skills. The result must be less than two years old when you send the application, so time the test against how long the letter of support will take.`,
    note: 'Take it early enough to be ready, not so early that it expires before you file.',
    figure: `CLB ${SUV_RULES.language.benchmark}`,
    figureLabel: 'all four skills',
  },
  {
    title: 'Assemble the documents and funds',
    who: 'You and your family',
    body: 'Collect the passport, letter of support, test result, proof of settlement funds, company records, education and work history, police certificates, IRCC forms and photos, and family documents. Every document not in English or French needs a certified translation.',
    note: 'Proving where your money came from can take months. Start on the day you decide to apply.',
    figure: '10',
    figureLabel: 'document groups',
  },
  {
    title: 'File for permanent residence',
    who: 'IRCC PR Portal',
    body: `Submit the application online under the ${SUV_RULES.portalName}, pay the fees, then give biometrics at a visa application centre and complete the medical exam with an IRCC panel physician when asked.`,
    note: `Paused: IRCC has accepted no new Start-up Visa applications since ${PAUSED_ON_LABEL}. Files accepted before then are still being processed.`,
    figure: 'Paused',
    figureLabel: `since ${PAUSED_ON_LABEL}`,
  },
];

const languageRows = [
  ['CELPIP-General', '5', '5', '5', '5'],
  ['IELTS General Training', '4.0', '5.0', '5.0', '5.0'],
  ['PTE Core', '42–50', '51–59', '39–49', '51–58'],
];

const fundRows = [1, 2, 3, 4, 5, 6, 7].map((n) => [n === 1 ? '1 person' : `${n} people`, cad(SUV_SETTLEMENT_FUNDS[n])]);

const documents = [
  { title: 'A valid passport', body: 'Valid long enough to cover the whole time IRCC takes to process the file.' },
  { title: 'The letter of support', body: 'From your designated organization. The commitment certificate goes to IRCC separately.' },
  { title: 'Language test result', body: 'CELPIP-General, IELTS General Training, PTE Core, TEF Canada or TCF Canada, less than two years old.' },
  { title: 'Proof of settlement funds', body: 'Bank statements, a bank letter and evidence of where the money came from.' },
  { title: 'Canadian company records', body: 'Incorporation, the share structure and the shareholders’ agreement.' },
  { title: 'Education and work history', body: 'Degrees and employment records that show you are qualified to build this business.' },
  { title: 'Police certificates', body: 'From every country where you have lived for more than six months.' },
  { title: 'Medical exam', body: 'With an IRCC-approved panel physician.' },
  { title: 'Photos and forms', body: 'Photos to IRCC’s specifications and the completed official forms.' },
  { title: 'Family documents', body: 'Marriage certificate, children’s birth certificates and, where relevant, divorce papers.' },
];

const faqs = [
  {
    q: 'Can I apply with IELTS Academic?',
    a: 'No. IRCC accepts only these tests for the Start-up Visa: CELPIP-General, IELTS General Training and PTE Core in English, and TEF Canada or TCF Canada in French. If you only hold IELTS Academic you need to sit an approved test.',
  },
  {
    q: 'Do the settlement funds have to be in a Canadian bank account?',
    a: 'No, but they must be transferable to Canada and provable, and IRCC does not accept borrowed money. For applicants from sanctioned countries, money held in a bank inside that country is not treated as transferable; an account in a third country with a clear transaction history is the most common solution.',
  },
  {
    q: 'Can I start without a company registered in Canada?',
    a: 'You can start the process, and most applicants talk to a designated organization before registering a company. But by the time you file with IRCC, the company must be incorporated in Canada and the voting-rights conditions must be met.',
  },
  {
    q: 'What counts as a certified translation?',
    a: 'A translation stamped and signed by an officially certified translator, submitted together with a copy of the original document. Informal translation offices and translations you make yourself are not accepted. Some documents also need authentication by the issuing country’s justice ministry and foreign ministry; for Iranian documents, that means the judiciary and the Ministry of Foreign Affairs.',
  },
  {
    q: 'Does my spouse also need a language test?',
    a: 'No. The language requirement applies to the applicants who own the business, not to accompanying spouses. Language will still help your spouse work in Canada.',
  },
  {
    q: 'What happens if the share structure changes after I file?',
    a: `The ownership conditions must hold both when you file and when IRCC makes its decision. If new investment dilutes you below ${SUV_RULES.minVotingRightsPerApplicant}%, or takes the applicants and the designated organization together to ${SUV_RULES.minCombinedVotingRights}% or less, the application is at risk. Check every change to the shares with your lawyer before it happens.`,
  },
];

const sources: SourceItem[] = [
  ...STATUS_SOURCES,
  { name: 'IRCC — Start-up Visa: language testing', href: LANGUAGE_SOURCE, what: 'The five approved tests, the CLB 5 scores for each and the two-year validity rule. IELTS Academic is not on the list.', checked: '29 Oct 2026' },
  { name: 'IRCC Help Centre — What is an essential person under the Start-up Visa Program?', href: ESSENTIAL_PERSON_SOURCE, what: 'Who names an essential person, and what a refusal of that person means for the others.', checked: '29 Oct 2026' },
  { name: 'IRCC — Start-up Visa: how to apply', href: SUV_SOURCES.apply, what: 'The supporting documents, the fees paid to other organizations and the open work permit.', checked: '29 Oct 2026' },
];

export default function RequirementsEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <SubpageJsonLd
        path={PATH}
        title={META.title}
        description={META.description}
        crumb="Requirements and documents"
        citation={sources.map((s) => s.href)}
        howTo={{ name: 'How a Canada Start-up Visa application was put together', steps }}
        faqs={faqs}
      />

      <RouteProvider stops={STOPS} flag="ca" theme={THEME}>
        <SuvHero
          crumb="Requirements"
          brand={<>Canada <em className="text-[#FF8F85]">Start-up Visa.</em></>}
          phrase="The Canada Start-up Visa requirements in 2026, step by step"
          lede={
            <p>
              The official list is short; files fail on the details. This page takes each requirement with the layer underneath it, and separates the
              extra paperwork that applicants from sanctioned countries such as Iran have to prepare. The programme itself is paused.
            </p>
          }
          checkedAgainst="IRCC"
          routeItems={['Check your team against the five tests', 'Walk the five steps', 'Find your language score and funds', 'Tick off the documents']}
          start="#gate"
        />

        <SuvStatus current="requirements" />

        <RouteRail />

        {/* 01 — Snapshot */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="What are the Canada Start-up Visa requirements?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              A letter of support from a designated organization, at least {SUV_RULES.minVotingRightsPerApplicant}% of the voting rights for each founder
              and more than {SUV_RULES.minCombinedVotingRights}% together with that organization, CLB {SUV_RULES.language.benchmark} in all four skills,
              and settlement funds that are not borrowed, from {cad(SUV_SETTLEMENT_FUNDS[1])} for one person. The programme has been paused since{' '}
              {PAUSED_ON_LABEL}, so these rules now serve files already in progress.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: 'Paused', label: 'Programme status', sub: `no new applications since ${PAUSED_ON_LABEL}` },
              { stat: `CLB ${SUV_RULES.language.benchmark}`, label: 'Language', sub: 'reading, writing, listening, speaking' },
              { stat: `${SUV_RULES.minVotingRightsPerApplicant}% / >${SUV_RULES.minCombinedVotingRights}%`, label: 'Voting rights', sub: 'each founder / founders plus the organization' },
              { stat: cad(SUV_SETTLEMENT_FUNDS[1]), label: 'Settlement funds', sub: 'one person, IRCC table of 29 July 2025' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 transition-transform hover:-translate-y-1">
                <dt className="order-2 mt-2 font-sans text-sm font-bold">{s.label}</dt>
                <dd className="order-1 font-serif text-3xl text-[#7F1D16] md:text-4xl">{s.stat}</dd>
                <dd className="order-3 font-sans text-xs text-[#1a1a1a]/60">{s.sub}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-[68ch] font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
            <strong className="text-[#1a1a1a]">The official list is the floor.</strong> IRCC checks language, money and ownership. Whether the business
            is innovative, can scale and can create jobs in Canada is judged by the designated organization in its interview, and that judgement decides
            more files than anything on IRCC’s list.
          </p>
        </RouteStop>

        {/* 02 — Gate */}
        <RouteStop
          id="gate"
          number={2}
          tone="white"
          eyebrow="The five tests"
          question="Would your team have met the Start-up Visa requirements?"
          task="Answer all five"
          answer={
            <p>
              Five things had to be true when you filed: a designated organization backed the business, the voting rights were split correctly, every
              founder reached CLB {SUV_RULES.language.benchmark}, you held unborrowed settlement funds, and the business would be run from Canada outside
              Quebec. With the programme paused, use this to compare your team with whatever the replacement pilot asks.
            </p>
          }
        >
          <GateQuiz
            stopId="gate"
            criteria={criteria}
            strongNote="The programme is paused, so this is a reference check. It shows how your team compares with rules the replacement pilot may or may not keep."
            gapNote="Language and documented funds take the longest to fix; start with those."
          >
            <h3 className="font-serif text-xl">The unwritten sixth test</h3>
            <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
              The business has to be innovative, scalable and able to create jobs in Canada. IRCC does not score that; the designated organization does,
              in its interview.
            </p>
            <Link href="/startup-visa-canada/designated-organizations" className="inline-flex w-fit items-center gap-2 font-sans text-sm font-bold text-[#B01C12] hover:underline">
              How designated organizations judge you <ArrowRight className="h-4 w-4" />
            </Link>
          </GateQuiz>
        </RouteStop>

        {/* 03 — Steps */}
        <RouteStop
          id="steps"
          number={3}
          eyebrow="The process"
          question="How was a Start-up Visa application put together?"
          task="Walk to step 5"
          answer={
            <p>
              In five steps: win a letter of support from a designated organization, incorporate in Canada with the right share split, pass an approved
              language test, assemble the documents and settlement funds, then file for permanent residence online. No new files have been accepted since{' '}
              {PAUSED_ON_LABEL}; files accepted before then are still processed.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
        </RouteStop>

        {/* 04 — Language */}
        <RouteStop
          id="language"
          number={4}
          tone="white"
          eyebrow="Language · IRCC’s approved tests"
          question="What language score does the Canada Start-up Visa require?"
          task="Find your test"
          completeOn="view"
          message="Language checked"
          answer={
            <p>
              CLB {SUV_RULES.language.benchmark} in reading, writing, listening and speaking, in English or French. IRCC accepts CELPIP-General, IELTS
              General Training and PTE Core in English, and TEF Canada or TCF Canada in French; IELTS Academic is not accepted. Results must be less than
              two years old when you apply.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <DataTable
              caption="Minimum English scores for CLB 5 (IRCC)"
              head={['Test', 'Reading', 'Writing', 'Listening', 'Speaking']}
              rows={languageRows}
              note={<>TEF Canada and TCF Canada are the approved French tests; IRCC publishes their NCLC 5 scores on the same page. Source: <a href={LANGUAGE_SOURCE} target="_blank" rel="noopener noreferrer" className="underline">IRCC, language testing</a>.</>}
            />
            <div className="grid content-start gap-4 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <p>
                <strong className="text-[#1a1a1a]">CLB 5 is the legal minimum, not the target.</strong> It is IRCC’s requirement, not the designated
                organization’s. An incubator interview runs in fluent English, and no official minimum makes up for struggling in it.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">Watch the two-year clock.</strong> If preparing the business and winning the letter of support takes a
                year, take the test earlier than you think — but not so early that it expires before you file.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 05 — Funds */}
        <RouteStop
          id="funds"
          number={5}
          eyebrow="Settlement funds · IRCC table of 29 July 2025"
          question="How much money did a Start-up Visa applicant need to show?"
          task="Find your family size"
          completeOn="view"
          message="Funds checked"
          answer={
            <p>
              {cad(SUV_SETTLEMENT_FUNDS[1])} for one person, {cad(SUV_SETTLEMENT_FUNDS[2])} for two, {cad(SUV_SETTLEMENT_FUNDS[4])} for a family of four,
              plus {cad(SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON)} for each person beyond seven. This is living money for you and your family, separate from
              anything you put into the company, and it cannot be borrowed. IRCC revises the table every year.
            </p>
          }
        >
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <DataTable
              caption="Settlement funds by family size, CAD (IRCC, updated 29 July 2025)"
              head={['Family members', 'Funds required']}
              rows={[...fundRows, ['Each person beyond 7', `+${cad(SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON)}`]]}
              note={<>The figure that applies is the one in force when you file. Source: <a href={SUV_SOURCES.eligibility} target="_blank" rel="noopener noreferrer" className="underline">IRCC, who can apply</a>.</>}
            />
            <div className="grid content-start gap-4 font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
              <p>
                <strong className="text-[#1a1a1a]">Living money, not company money.</strong> You prove you can support yourself and your family in Canada,
                separately from any capital you have put into the business. The Canadian government gives no financial support.
              </p>
              <p>
                <strong className="text-[#1a1a1a]">Four conditions on the money.</strong> It must be available to you, transferable to Canada, free of
                debt and not borrowed from anyone, and you must be able to prove where it came from. For many applicants, “prove where it came from” is
                the hardest part of the sentence.
              </p>
              <p>
                Want the household total with IRCC’s fees? <Link href="/startup-visa-canada/cost" className="font-bold text-[#B01C12] underline">Work it out on the cost page</Link>.
              </p>
            </div>
          </div>
        </RouteStop>

        {/* 06 — Ownership */}
        <RouteStop
          id="ownership"
          number={6}
          tone="white"
          eyebrow="The company and the shares"
          question="What ownership rules did the Start-up Visa set?"
          task="Read the four rules"
          completeOn="view"
          message="Ownership rules read"
          answer={
            <p>
              Each applicant needed at least {SUV_RULES.minVotingRightsPerApplicant}% of the total voting rights, and all applicants together with the
              designated organization more than {SUV_RULES.minCombinedVotingRights}%. Up to {SUV_RULES.maxOwnersPerBusiness} founders could apply on one
              business, which had to be incorporated in Canada with an essential part of its operations there. All of it had to be true at filing.
            </p>
          }
        >
          <ol className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { t: 'Incorporated and operating in Canada', b: 'The company is registered in Canada, managed actively from inside Canada, and an essential part of its operations happens there.' },
              { t: `At least ${SUV_RULES.minVotingRightsPerApplicant}% each`, b: `Every applicant holds ${SUV_RULES.minVotingRightsPerApplicant}% or more of the total voting rights attached to the company’s outstanding shares.` },
              { t: `More than ${SUV_RULES.minCombinedVotingRights}% together`, b: `The applicants and the designated organization together hold more than ${SUV_RULES.minCombinedVotingRights}% of the total voting rights.` },
              { t: `Up to ${SUV_RULES.maxOwnersPerBusiness} founders, some essential`, b: 'Up to five people can apply as owners of one business. The designated organization names any essential person on the commitment certificate and letter of support; if IRCC refuses an essential person, every related applicant is refused.' },
            ].map((r, i) => (
              <li key={r.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-5">
                <p className={`text-[#B01C12] ${label}`}>Rule {i + 1}</p>
                <h3 className="mt-1 font-serif text-xl">{r.t}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{r.b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[68ch] rounded-xl bg-[#FBE7E4] px-4 py-3 font-sans text-sm leading-relaxed">
            <strong>The unwritten condition:</strong> the business has to be innovative, scalable and able to create jobs in Canada. IRCC leaves that to the
            designated organization, which tests it in the interview — and that is where many files stop.
          </p>
        </RouteStop>

        {/* 07 — Letter of support */}
        <RouteStop
          id="letter"
          number={7}
          eyebrow="Two documents from one organization"
          question="What is the difference between the letter of support and the commitment certificate?"
          task="Read both"
          completeOn="view"
          message="Letter and certificate read"
          answer={
            <p>
              The designated organization gives you the letter of support, which you send with your application. It sends the commitment certificate to
              IRCC directly, with the terms of your deal: shares, capital and each founder’s role. If your application claims something the certificate
              does not, the officer will see it.
            </p>
          }
        >
          <div className="grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
              <h3 className="font-serif text-2xl">Letter of support</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                Handed to you; it goes into your permanent residence application as a supporting document. It has a time limit: IRCC said that for a
                commitment certificate received before {certificateCutoffLabel}, you had {SUV_STATE.certificateFilingWindowMonths} months to send your
                application, after which you would need a new one.
              </p>
            </div>
            <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-6">
              <h3 className="font-serif text-2xl">Commitment certificate</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">
                Sent by the organization straight to IRCC. It records the agreement: the shareholding, the capital and the role of each founder, and it is
                where essential people are named. Understand the agreement in full before you sign it, not afterwards.
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-[68ch] font-sans text-sm text-[#1a1a1a]/70">
            The last intake rule: to apply before the pause you needed a valid {SUV_STATE.lastIntake.certificateYear} commitment certificate and had to file
            by {PAUSED_ON_LABEL}.
          </p>
        </RouteStop>

        {/* 08 — Documents */}
        <RouteStop
          id="documents"
          number={8}
          tone="white"
          eyebrow="The permanent residence file"
          question="Which documents did the Start-up Visa permanent residence application need?"
          task="Tick all ten"
          answer={
            <p>
              Ten groups for the principal applicant: passport, letter of support, language result, proof of settlement funds, Canadian company records,
              education and work history, police certificates, a panel-physician medical exam, IRCC photos and forms, and family documents. Your spouse and
              any children over 18 supply their personal documents separately.
            </p>
          }
        >
          <Checklist
            stopId="documents"
            items={documents}
            message="Document list complete"
            progressLabel="Your document list"
            doneNote="All ten groups covered. Next: certified translations for anything not in English or French."
          />
        </RouteStop>

        {/* 09 — Sanctioned countries */}
        <RouteStop
          id="abroad"
          number={9}
          eyebrow="For applicants from sanctioned countries"
          question="What extra paperwork do applicants from Iran and other sanctioned countries need?"
          task="Read the six documents"
          completeOn="view"
          message="Extra paperwork read"
          answer={
            <p>
              Documents in Persian are not simply translated; they are rebuilt for Canadian immigration. Each needs a certified translation stamped and
              signed by an official translator, with a copy of the original. Expect company gazette notices, social-insurance records, degrees, bank
              statements, police clearance and sometimes military-service papers, and allow months to prove where your money came from.
            </p>
          }
        >
          <ul className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-2">
            {[
              { t: 'Official Gazette notices and articles of association', b: 'To prove past entrepreneurship and ownership of companies in Iran. Translate every relevant notice, not only the founding one.' },
              { t: 'Social security insurance records', b: 'The most common proof of work history: the official printout, translated.' },
              { t: 'Education documents', b: 'Degree certificate and transcripts, translated, and where needed authenticated by the judiciary and the Ministry of Foreign Affairs. Some routes also need an Educational Credential Assessment (ECA).' },
              { t: 'Bank statements', b: 'At least six months, translated, with an explanation for every large deposit. A property sale, an inheritance or a transfer from a company needs a supporting document.' },
              { t: 'Police clearance', b: 'From the Iranian police, translated — and from any other country where you lived for more than six months.' },
              { t: 'Military service card or exemption', b: 'Sometimes needed to explain gaps in your history.' },
            ].map((d) => (
              <li key={d.t} className="rounded-2xl border border-[#1a1a1a]/10 bg-white p-5">
                <h3 className="font-serif text-lg leading-snug">{d.t}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-[#1a1a1a]/70">{d.b}</p>
              </li>
            ))}
          </ul>
          <SanctionsNote title="Biometrics and the medical, in a third country">
            <p>
              Canada has no active embassy in Iran. Biometrics (fingerprints and photo) are given at a visa application centre in a third country —
              usually Dubai, Yerevan, Ankara or Tbilisi — and the medical exam must be done by an IRCC panel physician, of which there are none in Iran.
              The trip needs a visa or entry permit for that country, an appointment and a budget: plan for it from the start, not when IRCC’s letter
              arrives.
            </p>
            <p className="mt-3">
              <strong>Proving the origin of funds under sanctions takes months, not weeks.</strong> If your money comes from selling property, an
              inheritance or company profits, start documenting it the day you decide to emigrate. Without a certified translation, a document does not
              exist as far as the officer is concerned.
            </p>
          </SanctionsNote>
        </RouteStop>

        {/* 10 — FAQ */}
        <RouteStop
          id="faq"
          number={10}
          tone="white"
          eyebrow="Questions founders ask"
          question="What else do founders ask about the Start-up Visa requirements?"
          task="Open three answers"
          answer={<p>Six answers: which language tests count, where the settlement funds can sit, when the company must exist, what a certified translation is, whether your spouse needs a test, and what a change in shares does to your file.</p>}
        >
          <FaqList faqs={faqs} />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        <SourcesSection sources={sources} />

        <BookingSection
          heading={<>Check your file in a <span className="italic text-[#FF8F85]">free session.</span></>}
          body="Whether your application is already with IRCC, or you are weighing the pilot that replaces the Start-up Visa against routes open today, bring your documents and get an honest read. If Canada is not the right route now, we will say so."
          extra={
            <p className="mt-3 font-sans text-sm text-white/75">
              Also on this programme: <Link href="/startup-visa-canada/cost" className="underline">what it costs</Link> and{' '}
              <Link href="/startup-visa-canada/designated-organizations" className="underline">how designated organizations work</Link>.
            </p>
          }
        />

        <RelatedReads />
      </RouteProvider>

      <SuvNotice>Settlement funds follow IRCC’s table of 29 July 2025, which IRCC revises every year.</SuvNotice>
    </div>
  );
}
