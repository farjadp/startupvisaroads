// ============================================================================
// /en/startup-visa-canada/designated-organizations — the English page body.
// Same guided-route shape as /country/finland. The programme is PAUSED, and
// designated organizations' intake of new founders is paused with it.
//
// Facts: content/fa/canada-startup-visa-designated-organizations.ts (updated
// 2026-09-12), lib/canada-suv.ts, and IRCC's designated-organizations page,
// re-read 2026-10-29 (page dated 2026-09-21): minimums of $200,000 (VC) and
// $75,000 (angel); priority for VC funds, angel groups, incubators with
// $75,000 committed capital and organizations in Canada's Tech Network
// labelled "Priority processing". The Tech Network line is new relative to
// the module and lib/canada-suv.ts and is cited to that page.
//
// Like the Persian page, this deliberately names NO organization and makes
// no claim about any: it links IRCC's official list instead.
// ============================================================================
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/routing';
import { RouteProvider, RouteRail, RouteStop, type RouteStopDef } from '@/components/route/RouteProgress';
import { OpenedTracker, StepWalker, type RouteStep } from '@/components/route/RouteWidgets';
import { SUV_ORGS, SUV_SOURCES } from '@/lib/canada-suv';
import { Checklist, FairOrFlag } from '../_shared/SuvWidgets';
import {
  BookingSection,
  DataTable,
  FaqList,
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

const PATH = '/startup-visa-canada/designated-organizations';
const IRCC_LIST = SUV_SOURCES.designatedOrganizations;

/** Brandless title ≤ 60, description ≤ 160 — the lead copies these into lib/pageMeta.ts. */
export const META = {
  path: PATH,
  title: 'Canada Start-up Visa Designated Organizations',
  description:
    'What a designated organization is, how incubators, angel groups and VC funds differ, how to vet one, the warning signs, and how to prepare for its interview.',
};

const STOPS: RouteStopDef[] = [
  { id: 'snapshot', label: 'Snapshot' },
  { id: 'types', label: '3 types' },
  { id: 'steps', label: '5 steps' },
  { id: 'vet', label: 'Vet one' },
  { id: 'warnings', label: 'Warning signs' },
  { id: 'interview', label: 'Interview' },
  { id: 'faq', label: 'FAQ' },
];

const capSince = new Date(SUV_ORGS.capInForceSince).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const typeRows = [
  ['Business incubator or accelerator', 'Accepts you into a multi-month programme', 'None required of it; usually a programme fee for you', 'No proven traction needed; admission is competitive'],
  ['Angel investor group', 'Invests in your company for equity', `At least ${cad(SUV_ORGS.angelMinimum)}`, 'You must convince real investors to put in real money'],
  ['Venture capital fund', 'Invests in your company for equity', `At least ${cad(SUV_ORGS.ventureCapitalMinimum)}`, 'For startups with a product, customers and proven growth'],
];

const steps: RouteStep[] = [
  {
    title: 'Open IRCC’s list yourself',
    who: 'canada.ca',
    body: 'The official list of designated organizations is published by IRCC, split into incubators, angel investor groups and venture capital funds, and updated from time to time. Anything not on it is not a designated organization, whatever it calls itself.',
    note: 'Do not trust a second-hand list, including lists on other websites: organizations are added and removed.',
    figure: '1',
    figureLabel: 'official list',
  },
  {
    title: 'Shortlist by fit',
    who: 'You',
    body: 'Pick organizations by industry focus, track record and what their programme actually delivers, not by how easy they are to get into. An incubator strong in fintech is worth less to a health startup.',
    note: 'If you have no product or customers yet, an incubator is the realistic door; with traction, an angel group adds money and credibility.',
    figure: '3',
    figureLabel: 'types to choose from',
  },
  {
    title: 'Apply to several',
    who: 'Incubators, angels, funds',
    body: 'Admission is competitive, so applying to several organizations that suit your field is sensible. In the end, only one organization’s letter of support goes into your application.',
    note: 'Ask early whether the programme needs you in Canada in person, and when.',
    figure: 'Several',
    figureLabel: 'applications, one letter',
  },
  {
    title: 'Pass the interview',
    who: 'The organization’s committee',
    body: 'Expect an investor’s questions: how big the market is and how you know, why you, who the main competitor is, what the revenue model is and what it shows in year three, and why Canada.',
    note: 'A committee spots an unprepared founder in the first five minutes.',
    figure: '5 min',
    figureLabel: 'to make the impression',
  },
  {
    title: 'Letter and certificate',
    who: 'Designated organization → you and IRCC',
    body: 'If it backs you, the organization gives you a letter of support for your application and sends a commitment certificate to IRCC directly. Understand the agreement — shares, capital, each founder’s role — before you sign it.',
    note: `Paused: designated organizations have stopped taking on new founders for the Start-up Visa, which has accepted no new applications since ${PAUSED_ON_LABEL}.`,
    figure: 'Paused',
    figureLabel: `since ${PAUSED_ON_LABEL}`,
  },
];

const vetting = [
  { title: 'Real track record', body: 'How many years has it been active? Where are the startups it backed now? Search the names of its past founders.' },
  { title: 'Industry focus', body: 'An incubator strong in fintech is worth less to your health startup. Take the fit of field seriously.' },
  { title: 'Programme content', body: 'What exactly do you get: mentors, space, access to investors? If the answer is vague, so is the programme.' },
  { title: 'Acceptance rate', body: 'An organization that accepts everyone is not assessing anyone — and IRCC knows it.' },
  { title: 'Fee transparency', body: 'How much is the programme, what is it for, and when is it paid? Vagueness here is an answer in itself.' },
  { title: 'Reputation with IRCC', body: 'Organizations with many refused files bring closer scrutiny to the files that follow.' },
];

const signs = [
  { title: 'A fixed-price, guaranteed letter of support', content: 'Red flag. A letter of support is the result of an assessment. If it is being bought and sold, you are buying a high-risk file.', fair: false },
  { title: 'A committee that asks hard questions about your market, rivals and revenue', content: 'Fair. That is what a real assessment looks like. If nobody asks you hard questions, nobody has assessed you.', fair: true },
  { title: 'A middleman claiming an “exclusive contract” with a designated organization', content: 'Red flag. Designated organizations work directly with founders.', fair: false },
  { title: 'Admission with no serious interview', content: 'Red flag. If no one questioned your market, competitors and revenue model, there was no assessment.', fair: false },
  { title: 'An organization you cannot find on IRCC’s list, or recently removed from it', content: 'Red flag. Check the list yourself, never on a middleman’s word.', fair: false },
  { title: 'A clear programme fee: how much, what for, and when', content: 'Fair. Incubators usually charge for their programme, and a reputable one can tell you exactly what you are paying for.', fair: true },
  { title: 'Pressure to sign fast and pay immediately', content: 'Red flag. A credible organization gives you time, because it is assessing you too.', fair: false },
  { title: 'A promised “ready-made team” or “ready-made startup”', content: 'Red flag. A nominal founder collapses in the IRCC interview, and misrepresentation can lead to a ban on entering Canada.', fair: false },
];

const faqs = [
  {
    q: 'Where can I see the list of designated organizations?',
    a: 'Only on IRCC’s official site, canada.ca. The list is published by type — incubators, angel investor groups and venture capital funds — and updated from time to time. Do not rely on any second-hand list, including lists on other websites, because organizations are added and removed.',
  },
  {
    q: 'Can I apply to several organizations at once?',
    a: 'Yes, and usually you should. Admission is competitive, and applying to several incubators that suit your field is sensible. In the end, only one organization’s letter of support goes into your application.',
  },
  {
    q: 'Is an incubator better than an angel investor?',
    a: 'It depends on your startup’s stage. Without a proven product and customers, an incubator is more realistic. With market traction, angel investment strengthens the file and gives you capital. Neither is “better” in IRCC’s eyes.',
  },
  {
    q: 'What happens if the organization is removed from the list after giving me a letter of support?',
    a: 'If the letter was issued before the removal and your application was already filed, the application usually continues, but it may be examined more closely. That is one reason to choose an established, reputable organization.',
  },
  {
    q: 'Do I have to move to Canada to attend the incubator?',
    a: 'It depends on the programme. Some incubators require you in person; others start remotely and require you on site once you have a work permit. Settle this before you apply — for applicants from sanctioned countries, travelling to Canada before a work permit is not simple.',
  },
];

const sources: SourceItem[] = [
  { name: 'IRCC — List of designated organizations and priority processing', href: IRCC_LIST, what: `The official list; the ${cad(SUV_ORGS.ventureCapitalMinimum)} and ${cad(SUV_ORGS.angelMinimum)} minimums; priority processing; intake paused.`, checked: '29 Oct 2026' },
  ...STATUS_SOURCES,
];

export default function DesignatedOrganizationsEn() {
  return (
    <div className="w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a]">
      <SubpageJsonLd
        path={PATH}
        title={META.title}
        description={META.description}
        crumb="Designated organizations"
        citation={sources.map((s) => s.href)}
        howTo={{ name: 'How to approach a Canada Start-up Visa designated organization', steps }}
        faqs={faqs}
      />

      <RouteProvider stops={STOPS} flag="ca" theme={THEME}>
        <SuvHero
          crumb="Designated organizations"
          brand={<>The <em className="text-[#FF8F85]">gatekeepers.</em></>}
          phrase="Canada Start-up Visa designated organizations in 2026, step by step"
          lede={
            <p>
              IRCC does not judge your business; it hands that job to designated organizations. Choosing the right one and preparing for its interview was
              the most important decision on the Start-up Visa route — more important than the immigration file itself. Their intake is paused with the
              programme.
            </p>
          }
          checkedAgainst="IRCC’s designated-organizations page"
          routeItems={['Know the three types', 'Walk the five steps', 'Vet an organization', 'Spot the warning signs', 'Prepare for the interview']}
          start="#types"
        />

        <SuvStatus current="designated-organizations" />

        <RouteRail />

        {/* 01 — Snapshot */}
        <RouteStop
          id="snapshot"
          number={1}
          eyebrow="At a glance"
          question="What is a Start-up Visa designated organization?"
          task="Read the four facts"
          completeOn="view"
          message="Snapshot read"
          answer={
            <p>
              A private Canadian incubator, accelerator, angel investor group or venture capital fund that IRCC has approved to assess startups for the
              Start-up Visa. IRCC publishes the list. Its letter of support was the only way into the programme: without one there was no application.
              Taking on new founders has been paused since {PAUSED_ON_LABEL}.
            </p>
          }
        >
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { stat: '3', label: 'Types', sub: 'incubators, angel groups, VC funds' },
              { stat: cad(SUV_ORGS.angelMinimum), label: 'Angel minimum', sub: 'confirmed investment' },
              { stat: cad(SUV_ORGS.ventureCapitalMinimum), label: 'VC minimum', sub: 'confirmed investment' },
              { stat: String(SUV_ORGS.groupApplicationsPerOrganisationPerYear), label: 'Group files a year', sub: `per organization, since ${capSince}` },
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
              <strong className="text-[#1a1a1a]">Why they exist.</strong> An immigration officer is not an expert in assessing startups. So the government
              handed that judgement to people who assess startups every day — and who lose their credibility, and their place on the list, if they get it
              wrong.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">What it means for you.</strong> The letter of support is the only door into the programme. No letter, no
              file.{' '}
              <a href={IRCC_LIST} target="_blank" rel="noopener noreferrer" className="font-bold text-[#B01C12] underline">IRCC’s official list</a>.
            </p>
          </div>
        </RouteStop>

        {/* 02 — Types */}
        <RouteStop
          id="types"
          number={2}
          tone="white"
          eyebrow="Three types, three commitments"
          question="What is the difference between an incubator, an angel group and a VC fund?"
          task="Compare the three"
          completeOn="view"
          message="Types compared"
          answer={
            <p>
              All three issue letters of support. An incubator accepts you into a programme, requires no investment and usually charges a fee. An angel group
              invests at least {cad(SUV_ORGS.angelMinimum)} in your company for equity; a venture capital fund at least {cad(SUV_ORGS.ventureCapitalMinimum)}.
              The incubator is the most common door, because it needs no proven traction.
            </p>
          }
        >
          <DataTable
            caption="The three types of designated organization (IRCC)"
            head={['Type', 'What it does', 'Investment', 'Who it suits']}
            rows={typeRows}
            wide
            note={<>Source: <a href={IRCC_LIST} target="_blank" rel="noopener noreferrer" className="underline">IRCC, designated organizations</a>.</>}
          />
          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 font-sans text-sm leading-relaxed text-[#1a1a1a]/70 md:grid-cols-3">
            <p>
              <strong className="text-[#1a1a1a]">Incubators</strong> are the most common route, including for applicants from Iran, because they need no
              proven market traction. Admission is competitive.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Angel groups</strong> mean persuading real investors to put real money in. Harder, but it raises the
              credibility of the file.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Venture capital funds</strong> fit startups with a product, customers and proven growth — not realistic for
              most founders at their first stage.
            </p>
          </div>
          <div className="mt-6 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            <p className="rounded-xl bg-[#FBE7E4] px-4 py-3 font-sans text-sm leading-relaxed">
              <strong>The cap.</strong> From {capSince}, IRCC considered only {SUV_ORGS.groupApplicationsPerOrganisationPerYear} complete group
              applications per designated organization a year. Applications over the cap were returned and their processing fees refunded, and a group
              counted against the cap even when one member failed the completeness check. A place with a good organization was scarce, which made being
              ready to compete matter even more.
            </p>
            <p className="rounded-xl border border-[#1a1a1a]/10 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-[#1a1a1a]/75">
              <strong className="text-[#1a1a1a]">Priority processing.</strong> IRCC prioritises applications backed by venture capital funds, angel investor
              groups, incubators with {cad(SUV_ORGS.incubatorPriorityCommittedCapital)} of committed capital, and organizations in Canada’s Tech Network
              labelled “Priority processing”. An incubator without committed capital was a slower lane, not an equal one.
            </p>
          </div>
        </RouteStop>

        {/* 03 — Steps */}
        <RouteStop
          id="steps"
          number={3}
          eyebrow="The process"
          question="How do you approach a designated organization?"
          task="Walk to step 5"
          answer={
            <p>
              Open IRCC’s official list yourself, shortlist organizations by fit with your field, apply to several, and prepare for an investor-style interview.
              If one backs you, it gives you a letter of support and sends a commitment certificate to IRCC. Organizations stopped taking new Start-up Visa
              founders when the programme paused.
            </p>
          }
        >
          <StepWalker stopId="steps" steps={steps} />
        </RouteStop>

        {/* 04 — Vet */}
        <RouteStop
          id="vet"
          number={4}
          tone="white"
          eyebrow="Being on the list is the minimum"
          question="How do you evaluate a designated organization?"
          task="Tick all six checks"
          answer={
            <p>
              Being on IRCC’s list is the minimum, not a mark of quality. Before applying, check six things: its real track record, its industry focus, what
              its programme actually delivers, how selective it is, how transparent its fees are, and its reputation with IRCC, since many refused files bring
              closer scrutiny to the next ones.
            </p>
          }
        >
          <Checklist
            stopId="vet"
            items={vetting}
            message="Vetting checklist complete"
            progressLabel="Your vetting checklist"
            doneNote="All six checked. Now confirm the organization is still on IRCC’s list today, on canada.ca."
          />
        </RouteStop>

        {/* 05 — Warning signs */}
        <RouteStop
          id="warnings"
          number={5}
          eyebrow="Fair practice or red flag?"
          question="What are the warning signs of a fake designated organization?"
          task="Sort all eight"
          answer={
            <p>
              A fixed-price guaranteed letter, a middleman with an “exclusive contract”, admission without a serious interview, an organization missing from
              IRCC’s list or recently removed, pressure to sign and pay fast, and a ready-made team or startup. If it is not on IRCC’s official list, it is not
              a designated organization, whatever its name.
            </p>
          }
        >
          <FairOrFlag stopId="warnings" items={signs} />
          <p className="mt-6 max-w-[68ch] rounded-xl bg-[#FBE7E4] px-4 py-3 font-sans text-sm leading-relaxed">
            <strong>The simple rule:</strong> open the official list of designated organizations on IRCC’s site yourself. Anything not on it is not a
            designated organization, whatever name it carries.{' '}
            <a href={IRCC_LIST} target="_blank" rel="noopener noreferrer" className="font-bold text-[#B01C12] underline">Open IRCC’s list</a>.
          </p>
        </RouteStop>

        {/* 06 — Interview */}
        <RouteStop
          id="interview"
          number={6}
          tone="white"
          eyebrow="Where files stop"
          question="What does a designated organization ask in the interview?"
          task="Read the five questions"
          completeOn="view"
          message="Interview questions read"
          answer={
            <p>
              The questions an investor asks: how big is the market and how do you know, why you, who is the main competitor and why would customers choose
              you, what is the revenue model and what does it show in year three, and why Canada. Many founders with good businesses arrive unprepared, and
              the committee sees it within five minutes.
            </p>
          }
        >
          <ol className="grid max-w-5xl grid-cols-1 gap-3 md:grid-cols-5">
            {['How big is the market, and how do you know?', 'Why you?', 'Who is the main competitor, and why would customers pick you?', 'What is the revenue model, and what does year three look like?', 'Why Canada?'].map((q, i) => (
              <li key={q} className="rounded-2xl border border-[#1a1a1a]/10 bg-[#F2F0E9] p-4">
                <span className={`text-[#B01C12] ${label}`}>Q{i + 1}</span>
                <p className="mt-1 font-serif text-lg leading-snug">{q}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[68ch] font-sans text-[15px] leading-relaxed text-[#1a1a1a]/70">
            The usual failure is not the business but the preparation: a translated feasibility study instead of a business plan, no Canadian market data,
            and no practice answering hard questions in English.
          </p>
          <SanctionsNote>
            <p>
              Expect extra questions: How will you move your money? How will you run operations in Canada from Iran? What do sanctions do to your supply
              chain? These questions have answers, but they must be ready before the interview. Most stalled Iranian files stop here, at the interview,
              rather than with IRCC.
            </p>
          </SanctionsNote>
        </RouteStop>

        {/* 07 — FAQ */}
        <RouteStop
          id="faq"
          number={7}
          eyebrow="Questions founders ask"
          question="What else do founders ask about designated organizations?"
          task="Open three answers"
          answer={<p>Five answers: where to find the official list, applying to several at once, incubator versus angel, what happens if an organization is delisted, and whether you must be in Canada for the programme.</p>}
        >
          <FaqList faqs={faqs} />
          <OpenedTracker stopId="faq" need={3} message="Questions answered" />
        </RouteStop>

        <SourcesSection sources={sources} />

        <BookingSection
          heading={<>Prepare for the room in a <span className="italic text-[#FF8F85]">free session.</span></>}
          body="We have no “special relationship” with any designated organization and we do not sell letters of support — be wary of anyone who claims either. Our job is that when you sit in front of a committee, you are the founder they are looking for."
          extra={
            <div className="mt-4 grid gap-2 font-sans text-sm text-white/75">
              <p>
                That means a business plan and financial model to Canadian standards, a pitch deck that tells the story in ten minutes, interview practice with
                real questions, in English, with unsparing feedback, and ready answers to the questions only you will be asked. We choose the organization
                with you too — for fit with your business and the organization’s standing, not for how easy it is to get into.
              </p>
              <p>
                <Link href="/mentorship" className="inline-flex items-center gap-1.5 font-bold text-white underline">
                  The interview preparation programme <ArrowRight className="h-4 w-4" />
                </Link>
              </p>
              <p>
                Also on this programme: <Link href="/startup-visa-canada/requirements" className="underline">requirements and documents</Link> and{' '}
                <Link href="/startup-visa-canada/cost" className="underline">what it costs</Link>.
              </p>
            </div>
          }
        />

        <RelatedReads />
      </RouteProvider>

      <SuvNotice>This page names no designated organization and makes no claim about any; check IRCC’s official list yourself.</SuvNotice>
    </div>
  );
}
