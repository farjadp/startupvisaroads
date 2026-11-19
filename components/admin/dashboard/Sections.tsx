import React from 'react';
import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';
import { Delta, PathCell, RankTable, fmtInt } from '@/components/admin/SiteAnalytics';
import TrafficChart from '@/components/admin/dashboard/TrafficChart';
import type { Section } from '@/lib/admin-dashboard/load';
import type { CampaignRow, Compare, ContentSummary, EmailSummary, SystemsSummary, TrafficSummary } from '@/lib/admin-dashboard/metrics';
import { APP_STORE_LINKS } from '@/lib/app-links';

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const pct = (part: number, whole: number) => (whole ? `${((part / whole) * 100).toFixed(1)}%` : '–');

export function SectionShell({
  id,
  title,
  source,
  children,
}: {
  id: string;
  title: string;
  source: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mb-10 scroll-mt-6">
      <div className="mb-4">
        <h2 id={`${id}-heading`} className="font-serif text-3xl text-[#1a1a1a]">{title}</h2>
        <p className="mt-1 max-w-3xl font-sans text-xs leading-5 text-[#1a1a1a]/55">{source}</p>
      </div>
      {children}
    </section>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 font-sans text-sm text-amber-900">
      <TriangleAlert className="h-5 w-5 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

function StatStrip({ stats }: { stats: Array<{ label: string; value: string; note?: React.ReactNode }> }) {
  return (
    <dl className="mb-6 grid grid-cols-2 divide-x divide-y divide-[#1a1a1a]/5 rounded-2xl border border-[#1a1a1a]/5 bg-white shadow-sm lg:grid-cols-4 lg:divide-y-0">
      {stats.map((s) => (
        <div key={s.label} className="px-5 py-4">
          <dt className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">{s.label}</dt>
          <dd className="mt-1 font-serif text-2xl text-[#1a1a1a]">{s.value}</dd>
          {s.note && <dd className="mt-0.5 font-sans text-xs text-[#1a1a1a]/55">{s.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

const versus = ({ current, previous }: Compare, label: string) => (
  <span className="flex flex-wrap items-center gap-1.5">
    <Delta current={current} previous={previous} />
    <span>{fmtInt(previous)} {label}</span>
  </span>
);

export function ContentSection({ section }: { section: Section<ContentSummary> }) {
  return (
    <SectionShell
      id="content"
      title="Content"
      source="From the Article and CaseStudy tables, withdrawn articles excluded. Windows are the last 28 complete UTC days against the 28 before."
    >
      {section.state === 'error' ? <SectionError message={section.message} /> : <ContentBody c={section.data} />}
    </SectionShell>
  );
}

function ContentBody({ c }: { c: ContentSummary }) {
  const cases = Object.entries(c.caseStudies);
  return (
    <>
      <StatStrip
        stats={[
          { label: 'Live articles', value: fmtInt(c.counts.en.published + c.counts.fa.published), note: `${fmtInt(c.counts.en.published)} en, ${fmtInt(c.counts.fa.published)} fa` },
          { label: 'Published, 28 days', value: fmtInt(c.published.current), note: versus(c.published, 'prior 28 days') },
          { label: 'Scheduled', value: fmtInt(c.counts.en.scheduled + c.counts.fa.scheduled), note: c.lastScheduledAt ? `Runs to ${shortDate(c.lastScheduledAt)}` : 'Nothing queued' },
          { label: 'Drafts', value: fmtInt(c.counts.en.draft + c.counts.fa.draft), note: `${fmtInt(c.counts.en.draft)} en, ${fmtInt(c.counts.fa.draft)} fa` },
        ]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RankTable
            title="Going out in the next 7 days"
            rows={c.next7Days}
            empty="Nothing is scheduled for the next 7 days."
            columns={[
              { label: 'Article', render: (a) => <span dir="auto" title={a.title} className="font-bold">{a.title}</span> },
              { label: 'Lang', align: 'right', render: (a) => a.locale },
              { label: 'Date', align: 'right', render: (a) => shortDate(a.at) },
            ]}
          />
        </div>
        <dl className="rounded-2xl border border-[#1a1a1a]/5 bg-white p-6 font-sans text-sm shadow-sm">
          <dt className="font-bold text-[#1a1a1a]">Published by language, 28 days</dt>
          <dd className="mb-4 mt-1 text-[#1a1a1a]/65">English {fmtInt(c.publishedByLocale.en.current)}, Persian {fmtInt(c.publishedByLocale.fa.current)}</dd>
          <dt className="font-bold text-[#1a1a1a]">Data reports</dt>
          <dd className="mb-4 mt-1 text-[#1a1a1a]/65">English {fmtInt(c.dataReports.en)}, Persian {fmtInt(c.dataReports.fa)}</dd>
          <dt className="font-bold text-[#1a1a1a]">Case studies</dt>
          <dd className="mt-1 text-[#1a1a1a]/65">
            {cases.length ? cases.map(([status, n]) => `${status.replace('_', ' ').toLowerCase()} ${fmtInt(n)}`).join(', ') : 'None yet'}
          </dd>
        </dl>
      </div>
    </>
  );
}

export function TrafficSection({ section }: { section: Section<TrafficSummary> }) {
  return (
    <SectionShell
      id="traffic"
      title="Site traffic (own log)"
      source="From the PageView table. It counts page loads on public pages from browsers that run JavaScript. Admin pages are not counted. It has no bot filter and no visitor id, so treat it as a trend and not as people; GA4 is the source for users."
    >
      {section.state === 'error' ? (
        <SectionError message={section.message} />
      ) : (
        <>
          <StatStrip
            stats={[
              { label: 'Views, 28 days', value: fmtInt(section.data.total.current), note: versus(section.data.total, 'prior 28 days') },
              { label: 'English pages', value: fmtInt(section.data.byLocale.en.current), note: versus(section.data.byLocale.en, 'prior') },
              { label: 'Persian pages', value: fmtInt(section.data.byLocale.fa.current), note: versus(section.data.byLocale.fa, 'prior') },
              { label: 'All time', value: fmtInt(section.data.allTime), note: 'Since the log began' },
            ]}
          />
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl border border-[#1a1a1a]/5 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-2xl text-[#1a1a1a]">Daily views</h3>
              <TrafficChart days={section.data.daily} />
            </div>
            <RankTable
              title="Top pages, 28 days"
              rows={section.data.topPages}
              empty="No views recorded in this window."
              columns={[
                { label: 'Page', render: (p) => <PathCell value={p.path} /> },
                { label: 'Views', align: 'right', render: (p) => fmtInt(p.views) },
                { label: 'Prior', align: 'right', render: (p) => fmtInt(p.previous) },
              ]}
            />
          </div>
        </>
      )}
    </SectionShell>
  );
}

function campaignStatus(c: CampaignRow) {
  if (c.stuckHours !== null) return <span className="text-red-700">stuck {c.stuckHours} h</span>;
  return c.status.toLowerCase();
}

export function EmailSection({ section, adminBase }: { section: Section<EmailSummary>; adminBase: string }) {
  return (
    <SectionShell
      id="email"
      title="Email"
      source="From MarketingContact and CampaignLog. The 28-day send count runs up to now, today included. Sent means our provider accepted the message, not that it was delivered. Opens and clicks are inflated by mail security scanners, which load images and follow links, so compare campaigns with each other and do not read them as people."
    >
      {section.state === 'error' ? (
        <SectionError message={section.message} />
      ) : (
        <>
          <StatStrip
            stats={[
              { label: 'Contacts', value: fmtInt(section.data.contacts.total), note: `${fmtInt(section.data.contacts.withEmail)} have an email` },
              { label: 'Reachable', value: fmtInt(section.data.contacts.reachable), note: `${fmtInt(section.data.contacts.unsubscribed)} unsubscribed` },
              { label: 'Sent, 28 days', value: fmtInt(section.data.sent28.current), note: versus(section.data.sent28, 'prior 28 days') },
              { label: 'Sent, all time', value: fmtInt(section.data.sent), note: `${fmtInt(section.data.failed)} failed` },
            ]}
          />
          <RankTable
            title="Campaigns"
            note={section.data.hiddenTestCampaigns ? `${section.data.hiddenTestCampaigns} small test sends are counted above and hidden here.` : undefined}
            rows={section.data.campaigns}
            empty="No campaigns have been sent."
            columns={[
              {
                label: 'Campaign',
                render: (c) => (
                  <Link href={`${adminBase}/marketing/campaigns/${c.id}`} dir="auto" title={c.name} className="font-bold hover:underline">
                    {c.name}
                  </Link>
                ),
              },
              { label: 'Status', align: 'right', render: campaignStatus },
              { label: 'Sent', align: 'right', render: (c) => fmtInt(c.sent) },
              { label: 'Failed', align: 'right', render: (c) => fmtInt(c.failed) },
              { label: 'Opened', align: 'right', render: (c) => <span title={`${fmtInt(c.uniqueOpens)} recipients, ${fmtInt(c.openEvents)} open events`}>{pct(c.uniqueOpens, c.sent)}</span> },
              { label: 'Clicked', align: 'right', render: (c) => <span title={`${fmtInt(c.uniqueClicks)} recipients, ${fmtInt(c.clickEvents)} click events`}>{pct(c.uniqueClicks, c.sent)}</span> },
            ]}
          />
        </>
      )}
    </SectionShell>
  );
}

export function SystemsSection({ section, adminBase }: { section: Section<SystemsSummary>; adminBase: string }) {
  return (
    <SectionShell id="systems" title="Systems" source="From AutopilotRun, IngestJob, SocialPost, AgentReport and the source tables. Rolling last 7 days unless stated.">
      {section.state === 'error' ? (
        <SectionError message={section.message} />
      ) : (
        <SystemsBody s={section.data} adminBase={adminBase} />
      )}
    </SectionShell>
  );
}

function SystemsBody({ s, adminBase }: { s: SystemsSummary; adminBase: string }) {
  const { autopilot: a } = s;
  return (
    <>
      <StatStrip
        stats={[
          { label: 'Autopilot runs', value: fmtInt(a.runs.current), note: `${fmtInt(a.articlesCreated)} articles written` },
          {
            label: 'Runs with errors',
            value: fmtInt(a.runsWithErrors.current),
            note: `Database ${fmtInt(a.byKind.database.runs)}, credits ${fmtInt(a.byKind.credits.runs)}, other ${fmtInt(a.byKind.other.runs)}`,
          },
          { label: 'Ingest jobs', value: fmtInt(s.ingest.failed), note: `failed; ${fmtInt(s.ingest.stuck)} stuck, ${fmtInt(s.ingest.pending)} pending` },
          { label: 'Social posts', value: fmtInt(s.social.posted), note: `posted; ${fmtInt(s.social.failed)} failed, ${fmtInt(s.social.skipped)} skipped` },
        ]}
      />
      <RankTable
        title="Agent reports"
        note={`${fmtInt(s.reports.last7Days)} in the last 7 days, ${fmtInt(s.reports.telegramFailed)} failed to reach Telegram.`}
        rows={s.reports.latestByAgent}
        empty="No agent has reported yet."
        columns={[
          { label: 'Agent', render: (r) => <Link href={`${adminBase}/reports?agent=${encodeURIComponent(r.agent)}`} className="font-bold hover:underline">{r.agent}</Link> },
          { label: 'Latest', align: 'right', render: (r) => shortDate(r.at) },
          { label: 'Age', align: 'right', render: (r) => `${r.ageDays} d` },
        ]}
      />
    </>
  );
}

export function NotMeasured({ adminBase, ga4Connected }: { adminBase: string; ga4Connected: boolean }) {
  const items: Array<{ name: string; why: React.ReactNode }> = [
    {
      name: 'Leads',
      why: `The six lead forms send to Telegram and store nothing, so no count, source or history exists in our database.${ga4Connected ? ' The GA4 figure above counts successful submits only.' : ' GA4 will count successful submits once it is connected.'}`,
    },
    { name: 'Email delivery and bounces', why: 'We record what the provider accepted. No delivery or bounce events come back to us.' },
    { name: 'Unique visitors', why: 'The page-view log has no visitor id. GA4 reports users once it is connected.' },
    {
      name: 'App installs and ratings',
      why: (
        <>
          No store API is connected.{' '}
          {APP_STORE_LINKS.googlePlay && (
            <a href={APP_STORE_LINKS.googlePlay} className="font-bold underline" target="_blank" rel="noopener noreferrer">Open the Google Play listing</a>
          )}
        </>
      ),
    },
    {
      name: 'AI citations',
      why: (
        <>
          No API reports them. The weekly check is in <Link href={`${adminBase}/reports`} className="font-bold underline">Agent reports</Link>; GA4 will show visits arriving from AI assistants.
        </>
      ),
    },
  ];
  return (
    <SectionShell id="not-measured" title="Not measured" source="Left empty on purpose, so nothing here is estimated.">
      <dl className="divide-y divide-[#1a1a1a]/5 rounded-2xl border border-[#1a1a1a]/5 bg-white font-sans text-sm shadow-sm">
        {items.map((item) => (
          <div key={item.name} className="grid gap-1 px-6 py-3 md:grid-cols-4 md:gap-4">
            <dt className="font-bold text-[#1a1a1a]">{item.name}</dt>
            <dd className="text-[#1a1a1a]/65 md:col-span-3">{item.why}</dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}

export function GoogleSetup({ serviceAccount, needsSearch, needsGa4 }: { serviceAccount: string | null; needsSearch: boolean; needsGa4: boolean }) {
  const vars = [needsSearch && 'SEARCH_CONSOLE_SITE=sc-domain:visaroads.com', needsGa4 && 'GA4_PROPERTY_ID=$GA4_PROPERTY_ID'].filter(Boolean).join(',');
  return (
    <div id="google-setup" dir="rtl" lang="fa" className="mb-6 scroll-mt-6 rounded-2xl border border-[#1a1a1a]/10 bg-white px-6 py-5 font-vazir text-sm leading-7 text-[#1a1a1a]/75">
      <h3 className="mb-2 text-lg font-bold text-[#1a1a1a]">اتصال گوگل</h3>
      <p className="mb-1">این ایمیل باید دسترسی فقط‌خواندنی بگیرد:</p>
      <p dir="ltr" className="mb-3 text-left font-mono text-xs text-[#1a1a1a]">
        {serviceAccount ?? 'Shown on production (the Cloud Run service account)'}
      </p>
      <ol className="list-inside list-decimal space-y-1">
        {needsSearch && (
          <li>
            در <a className="font-bold underline" href="https://search.google.com/search-console/users?resource_id=sc-domain%3Avisaroads.com" target="_blank" rel="noopener noreferrer">Search Console</a> روی Add user بزن، ایمیل را بگذار و Restricted را انتخاب کن.
          </li>
        )}
        {needsGa4 && (
          <li>
            در <a className="font-bold underline" href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">Google Analytics</a> از Admin به Property access management برو، همین ایمیل را با نقش Viewer اضافه کن و از Property details شمارهٔ Property ID را بردار.
          </li>
        )}
        <li>این دستورها را با همان شماره اجرا کن:</li>
      </ol>
      <pre dir="ltr" className="mt-2 overflow-x-auto rounded-lg bg-[#1a1a1a] p-3 text-left font-mono text-xs leading-5 text-[#F2F0E9]">
        {`${needsGa4 ? 'GA4_PROPERTY_ID=PASTE_THE_NUMBER_HERE\n' : ''}gcloud services enable analyticsdata.googleapis.com searchconsole.googleapis.com --project=visaroads-website
gcloud run services update startupvisaroads \\
  --region=europe-west1 --project=visaroads-website \\
  --update-env-vars=${vars}`}
      </pre>
    </div>
  );
}
