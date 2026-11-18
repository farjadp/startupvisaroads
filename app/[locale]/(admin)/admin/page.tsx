import React from 'react';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-guard';
import { loadDashboard } from '@/lib/admin-dashboard/load';
import { buildSuggestions } from '@/lib/admin-dashboard/suggestions';
import { getGa4, getSearchConsole } from '@/lib/site-analytics';
import { serviceAccountEmail } from '@/lib/site-analytics/google-auth';
import type { RankedRow, Ga4RankedRow, SiteFilter } from '@/lib/site-analytics/shape';
import NextActions from '@/components/admin/dashboard/NextActions';
import {
  ContentSection,
  EmailSection,
  GoogleSetup,
  NotMeasured,
  SystemsSection,
  TrafficSection,
} from '@/components/admin/dashboard/Sections';
import {
  DailyChart,
  Delta,
  EmptyTile,
  KpiTile,
  PanelNotice,
  PathCell,
  RankTable,
  SiteSwitch,
  UpdatedAt,
  fmtInt,
  fmtPct,
  fmtPos,
  windowLabel,
} from '@/components/admin/SiteAnalytics';

function parseSite(value: string | string[] | undefined): SiteFilter {
  return value === 'en' || value === 'fa' ? value : 'all';
}

function ChangeCell({ current, previous }: { current: number; previous: number | null }) {
  return previous === null ? <span className="text-xs text-[#1a1a1a]/40">new</span> : <Delta current={current} previous={previous} />;
}

export default async function AdminDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  // Middleware already guards this path; the page checks again before reading any business data.
  try {
    await requireAdmin();
  } catch {
    redirect(`/${locale}/admin/login`);
  }

  const site = parseSite((await searchParams).site);
  const adminBase = `/${locale}/admin`;
  const [gsc, ga4, data] = await Promise.all([getSearchConsole(site), getGa4(site), loadDashboard()]);
  const { content, traffic, email, systems } = data;
  const needsSearch = gsc.state === 'not_configured';
  const needsGa4 = ga4.state === 'not_configured';
  const serviceAccount = needsSearch || needsGa4 ? await serviceAccountEmail() : null;

  const suggestions = buildSuggestions({
    now: new Date(),
    adminBase,
    searchConsole: gsc.state,
    ga4: ga4.state,
    opportunities: gsc.state === 'ok' ? gsc.data.opportunities : null,
    ga4Sessions: ga4.state === 'ok' ? ga4.data.sessions.current : null,
    ga4Leads: ga4.state === 'ok' ? ga4.data.leads.current : null,
    content: content.state === 'ok' ? content.data : null,
    traffic: traffic.state === 'ok' ? traffic.data : null,
    email: email.state === 'ok' ? email.data : null,
    systems: systems.state === 'ok' ? systems.data : null,
  });

  const windows = gsc.state === 'ok' ? gsc.data.windows : ga4.state === 'ok' ? ga4.data.windows : null;
  const prevLabel = 'prior 28 days';
  const siteLabel = site === 'all' ? 'the whole site' : `/${site}`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-4xl text-[#1a1a1a]">Dashboard</h1>
        <p className="font-sans text-[#1a1a1a]/60">What needs you now, then the numbers behind it. Database figures refresh every 10 minutes.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {gsc.state === 'ok' ? (
          <KpiTile label="Search clicks" source="Google" value={fmtInt(gsc.data.totals.current.clicks)} current={gsc.data.totals.current.clicks} previous={gsc.data.totals.previous.clicks} previousLabel={prevLabel} />
        ) : (
          <EmptyTile label="Search clicks" source="Not connected" />
        )}
        {content.state === 'ok' ? (
          <KpiTile label="Published, 28 days" source="Database" value={fmtInt(content.data.published.current)} current={content.data.published.current} previous={content.data.published.previous} previousLabel={prevLabel} />
        ) : (
          <EmptyTile label="Published, 28 days" source="Unavailable" />
        )}
        {email.state === 'ok' ? (
          <KpiTile label="Emails sent, 28 days" source="Database" value={fmtInt(email.data.sent28.current)} current={email.data.sent28.current} previous={email.data.sent28.previous} previousLabel={prevLabel} />
        ) : (
          <EmptyTile label="Emails sent, 28 days" source="Unavailable" />
        )}
        {systems.state === 'ok' ? (
          <KpiTile label="Autopilot runs with errors" source="7 days" value={`${fmtInt(systems.data.autopilot.runsWithErrors.current)} of ${fmtInt(systems.data.autopilot.runs.current)}`} current={systems.data.autopilot.runsWithErrors.current} previous={systems.data.autopilot.runsWithErrors.previous} previousLabel="prior 7 days" lowerIsBetter />
        ) : (
          <EmptyTile label="Autopilot runs with errors" source="Unavailable" />
        )}
      </div>

      <NextActions items={suggestions.items} hidden={suggestions.hidden} />

      <section id="search" aria-labelledby="gsc-heading" className="mb-10 scroll-mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="gsc-heading" className="font-serif text-3xl text-[#1a1a1a]">Google Search</h2>
            <p className="mt-1 font-sans text-xs text-[#1a1a1a]/55">
              Search Console and GA4 for {siteLabel}
              {windows ? `, ${windowLabel(windows.current)} against ${windowLabel(windows.previous)}.` : '.'} Both windows end 3 days ago because Search Console runs behind.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {gsc.state === 'ok' && <UpdatedAt iso={gsc.fetchedAt} />}
            <SiteSwitch site={site} />
          </div>
        </div>

        {(needsSearch || needsGa4) && <GoogleSetup serviceAccount={serviceAccount} needsSearch={needsSearch} needsGa4={needsGa4} />}

        {gsc.state === 'error' && <PanelNotice panel={gsc} name="Search Console" />}
        {gsc.state === 'ok' && (
          <>
            <dl className="mb-6 grid grid-cols-2 divide-x divide-[#1a1a1a]/5 rounded-2xl border border-[#1a1a1a]/5 bg-white shadow-sm">
              <div className="px-6 py-4">
                <dt className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Impressions</dt>
                <dd className="font-serif text-2xl text-[#1a1a1a]">{fmtInt(gsc.data.totals.current.impressions)}</dd>
                <dd><Delta current={gsc.data.totals.current.impressions} previous={gsc.data.totals.previous.impressions} /></dd>
              </div>
              <div className="px-6 py-4">
                <dt className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">CTR and average position</dt>
                <dd className="font-serif text-2xl text-[#1a1a1a]">{fmtPct(gsc.data.totals.current.ctr)} at {fmtPos(gsc.data.totals.current.position)}</dd>
                <dd><Delta current={gsc.data.totals.current.position} previous={gsc.data.totals.previous.position} lowerIsBetter /></dd>
              </div>
            </dl>
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#1a1a1a]/5 bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="mb-1 font-serif text-2xl text-[#1a1a1a]">Daily clicks</h3>
                <p className="mb-4 font-sans text-xs text-[#1a1a1a]/50">Whole site, last 28 days.</p>
                <DailyChart points={gsc.data.daily} />
              </div>
              <div className="rounded-2xl border border-[#1a1a1a]/5 bg-white p-6 shadow-sm">
                <h3 className="mb-1 font-serif text-2xl text-[#1a1a1a]">English vs Persian</h3>
                <p className="mb-4 font-sans text-xs text-[#1a1a1a]/50">Summed from each page&apos;s rows.</p>
                <dl className="space-y-4 font-sans text-sm">
                  {(['en', 'fa'] as const).map((loc) => {
                    const t = gsc.data.split[loc];
                    return (
                      <div key={loc} className="border-t border-[#1a1a1a]/5 pt-3 first:border-0 first:pt-0">
                        <dt className="mb-1 font-bold text-[#1a1a1a]">/{loc}</dt>
                        <dd className="grid grid-cols-2 gap-y-1 text-[#1a1a1a]/70">
                          <span>{fmtInt(t.current.clicks)} clicks</span>
                          <Delta current={t.current.clicks} previous={t.previous.clicks} />
                          <span>{fmtInt(t.current.impressions)} impressions</span>
                          <Delta current={t.current.impressions} previous={t.previous.impressions} />
                          <span>{fmtPct(t.current.ctr)} CTR</span>
                          <span>position {fmtPos(t.current.position)}</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <RankTable<RankedRow>
                title="Top pages"
                rows={gsc.data.pages}
                empty="No pages with impressions in this window."
                columns={[
                  { label: 'Page', render: (r) => <PathCell value={r.key} /> },
                  { label: 'Clicks', align: 'right', render: (r) => fmtInt(r.clicks) },
                  { label: 'Impr.', align: 'right', render: (r) => fmtInt(r.impressions) },
                  { label: 'Pos.', align: 'right', render: (r) => fmtPos(r.position) },
                  { label: 'Change', align: 'right', render: (r) => <ChangeCell current={r.clicks} previous={r.previousClicks} /> },
                ]}
              />
              <RankTable<RankedRow>
                title="Top queries"
                note="Google hides rare queries, so these never add up to the clicks total."
                rows={gsc.data.queries}
                empty="No queries with impressions in this window."
                columns={[
                  { label: 'Query', render: (r) => <span dir="auto" title={r.key} className="font-bold">{r.key}</span> },
                  { label: 'Clicks', align: 'right', render: (r) => fmtInt(r.clicks) },
                  { label: 'Impr.', align: 'right', render: (r) => fmtInt(r.impressions) },
                  { label: 'Pos.', align: 'right', render: (r) => fmtPos(r.position) },
                  { label: 'Change', align: 'right', render: (r) => <ChangeCell current={r.clicks} previous={r.previousClicks} /> },
                ]}
              />
            </div>
          </>
        )}

        {!needsGa4 && (
        <div className="mt-8">
          <h3 className="mb-4 font-serif text-2xl text-[#1a1a1a]">Google Analytics</h3>
          {ga4.state === 'error' && <PanelNotice panel={ga4} name="Google Analytics" />}
          {ga4.state === 'ok' && (
            <>
              <dl className="mb-6 grid grid-cols-2 divide-x divide-y divide-[#1a1a1a]/5 rounded-2xl border border-[#1a1a1a]/5 bg-white shadow-sm lg:grid-cols-4 lg:divide-y-0">
                {[
                  { label: 'Users', v: ga4.data.users },
                  { label: 'Sessions', v: ga4.data.sessions },
                  { label: 'Leads (form submits)', v: ga4.data.leads },
                  { label: 'From AI assistants', v: ga4.data.aiAssistants },
                ].map((m) => (
                  <div key={m.label} className="px-6 py-4">
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">{m.label}</dt>
                    <dd className="font-serif text-2xl text-[#1a1a1a]">{fmtInt(m.v.current)}</dd>
                    <dd><Delta current={m.v.current} previous={m.v.previous} /></dd>
                  </div>
                ))}
              </dl>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <RankTable<Ga4RankedRow>
                  title="Top landing pages"
                  rows={ga4.data.landingPages}
                  empty="No sessions in this window."
                  columns={[
                    { label: 'Landing page', render: (r) => <PathCell value={r.key || '(not set)'} /> },
                    { label: 'Sessions', align: 'right', render: (r) => fmtInt(r.value) },
                    { label: 'Change', align: 'right', render: (r) => <ChangeCell current={r.value} previous={r.previous} /> },
                  ]}
                />
                <RankTable<Ga4RankedRow>
                  title="Traffic sources"
                  note="GA4's default channel groups. AI assistants are counted inside Referral; their total is above."
                  rows={ga4.data.channels}
                  empty="No sessions in this window."
                  columns={[
                    { label: 'Channel', render: (r) => <span className="font-bold">{r.key || '(not set)'}</span> },
                    { label: 'Sessions', align: 'right', render: (r) => fmtInt(r.value) },
                    { label: 'Change', align: 'right', render: (r) => <ChangeCell current={r.value} previous={r.previous} /> },
                  ]}
                />
              </div>
            </>
          )}
        </div>
        )}
      </section>

      <ContentSection section={content} />
      <TrafficSection section={traffic} />
      <EmailSection section={email} adminBase={adminBase} />
      <SystemsSection section={systems} adminBase={adminBase} />
      <NotMeasured adminBase={adminBase} ga4Connected={ga4.state === 'ok'} />
    </div>
  );
}
