import React from 'react';
import prisma from '@/lib/prisma';
import { getGa4, getSearchConsole } from '@/lib/site-analytics';
import type { RankedRow, Ga4RankedRow, SiteFilter } from '@/lib/site-analytics/shape';
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
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const site = parseSite((await searchParams).site);

  // The site's own page-view log (Prisma) stays as a fallback for when Google is not connected.
  let totalViews = 0;
  let topPages: Array<{ path: string; _count: { path: number } }> = [];
  let dataWarning: string | null = null;

  const [gsc, ga4] = await Promise.all([
    getSearchConsole(site),
    getGa4(site),
    (async () => {
      try {
        totalViews = await prisma.pageView.count();
        const groupedPages = await prisma.pageView.groupBy({
          by: ['path'],
          _count: { path: true },
          orderBy: { _count: { path: 'desc' } },
          take: 10,
        });
        topPages = groupedPages as Array<{ path: string; _count: { path: number } }>;
      } catch (error) {
        console.error('Admin dashboard analytics query failed:', error);
        dataWarning = 'The internal page-view log is temporarily unavailable. Authentication and admin navigation still work.';
      }
    })(),
  ]);

  const windows = gsc.state === 'ok' ? gsc.data.windows : ga4.state === 'ok' ? ga4.data.windows : null;
  const prevLabel = 'prior 28 days';
  const siteLabel = site === 'all' ? 'the whole site' : `/${site}`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4 justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Dashboard Overview</h1>
          <p className="font-sans text-[#1a1a1a]/60">
            Search and traffic for {siteLabel}
            {windows ? `, ${windowLabel(windows.current)} against ${windowLabel(windows.previous)}.` : '.'}
            {' '}Search Console runs 2–3 days behind, so both windows end 3 days ago.
          </p>
        </div>
        <SiteSwitch site={site} />
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {gsc.state === 'ok' ? (
          <>
            <KpiTile label="Clicks" source="Search" value={fmtInt(gsc.data.totals.current.clicks)} current={gsc.data.totals.current.clicks} previous={gsc.data.totals.previous.clicks} previousLabel={prevLabel} />
            <KpiTile label="Impressions" source="Search" value={fmtInt(gsc.data.totals.current.impressions)} current={gsc.data.totals.current.impressions} previous={gsc.data.totals.previous.impressions} previousLabel={prevLabel} />
          </>
        ) : (
          <>
            <EmptyTile label="Clicks" source="Search" />
            <EmptyTile label="Impressions" source="Search" />
          </>
        )}
        {ga4.state === 'ok' ? (
          <>
            <KpiTile label="Users" source="GA4" value={fmtInt(ga4.data.users.current)} current={ga4.data.users.current} previous={ga4.data.users.previous} previousLabel={prevLabel} />
            <KpiTile label="Sessions" source="GA4" value={fmtInt(ga4.data.sessions.current)} current={ga4.data.sessions.current} previous={ga4.data.sessions.previous} previousLabel={prevLabel} />
          </>
        ) : (
          <>
            <EmptyTile label="Users" source="GA4" />
            <EmptyTile label="Sessions" source="GA4" />
          </>
        )}
      </div>

      {/* Secondary numbers */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm mb-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#1a1a1a]/5">
        {[
          gsc.state === 'ok' && {
            label: 'CTR',
            value: fmtPct(gsc.data.totals.current.ctr),
            delta: <Delta current={gsc.data.totals.current.ctr} previous={gsc.data.totals.previous.ctr} />,
          },
          gsc.state === 'ok' && {
            label: 'Avg position',
            value: fmtPos(gsc.data.totals.current.position),
            delta: <Delta current={gsc.data.totals.current.position} previous={gsc.data.totals.previous.position} lowerIsBetter />,
          },
          ga4.state === 'ok' && {
            label: 'Leads (form submits)',
            value: fmtInt(ga4.data.leads.current),
            delta: <Delta current={ga4.data.leads.current} previous={ga4.data.leads.previous} />,
          },
          ga4.state === 'ok' && {
            label: 'From AI assistants',
            value: `${fmtInt(ga4.data.aiAssistants.current)} sessions`,
            delta: <Delta current={ga4.data.aiAssistants.current} previous={ga4.data.aiAssistants.previous} />,
            hint: ga4.data.aiAssistants.sources.map((s) => `${s.key} ${s.value}`).join(', ') || 'ChatGPT, Perplexity, Gemini, Copilot, Claude…',
          },
        ].map((m, i) =>
          m ? (
            <div key={m.label} className="px-6 py-4">
              <p className="font-sans text-[#1a1a1a]/50 text-[10px] font-bold uppercase tracking-widest mb-1">{m.label}</p>
              <p className="font-serif text-2xl text-[#1a1a1a]">{m.value}</p>
              <p className="font-sans text-xs text-[#1a1a1a]/50 flex flex-wrap items-center gap-2">
                {m.delta}
                {'hint' in m && m.hint && <span className="truncate" title={m.hint}>{m.hint}</span>}
              </p>
            </div>
          ) : (
            <div key={i} className="px-6 py-4">
              <p className="font-sans text-[#1a1a1a]/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                {['CTR', 'Avg position', 'Leads (form submits)', 'From AI assistants'][i]}
              </p>
              <p className="font-serif text-2xl text-[#1a1a1a]/25">–</p>
            </div>
          ),
        )}
      </div>

      {/* Search Console */}
      <section className="mb-10" aria-labelledby="gsc-heading">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
          <h2 id="gsc-heading" className="font-serif text-3xl text-[#1a1a1a]">Google Search</h2>
          {gsc.state === 'ok' && <UpdatedAt iso={gsc.fetchedAt} />}
        </div>

        {gsc.state !== 'ok' ? (
          <PanelNotice panel={gsc} name="Search Console" />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-1">Daily clicks</h3>
                <p className="font-sans text-xs text-[#1a1a1a]/50 mb-4">Whole site, last 28 days.</p>
                <DailyChart points={gsc.data.daily} />
              </div>
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-1">English vs Persian</h3>
                <p className="font-sans text-xs text-[#1a1a1a]/50 mb-4">Summed from each page&apos;s rows.</p>
                <dl className="space-y-4 font-sans text-sm">
                  {(['en', 'fa'] as const).map((loc) => {
                    const t = gsc.data.split[loc];
                    return (
                      <div key={loc} className="border-t border-[#1a1a1a]/5 pt-3 first:border-0 first:pt-0">
                        <dt className="font-bold text-[#1a1a1a] mb-1">/{loc}</dt>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </section>

      {/* GA4 */}
      <section className="mb-10" aria-labelledby="ga4-heading">
        <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
          <h2 id="ga4-heading" className="font-serif text-3xl text-[#1a1a1a]">Traffic (GA4)</h2>
          {ga4.state === 'ok' && <UpdatedAt iso={ga4.fetchedAt} />}
        </div>

        {ga4.state !== 'ok' ? (
          <PanelNotice panel={ga4} name="Google Analytics" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        )}
      </section>

      {/* The site's own log, kept from the previous dashboard */}
      <section aria-labelledby="log-heading">
        {dataWarning && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">{dataWarning}</div>
        )}
        <RankTable<{ path: string; _count: { path: number } }>
          title="Internal page-view log"
          note={`${fmtInt(totalViews)} views recorded by the site itself, all time and both locales. It does not follow the switch above.`}
          rows={topPages}
          empty="No views recorded yet."
          columns={[
            { label: 'Page path', render: (p) => <PathCell value={p.path} /> },
            { label: 'Views', align: 'right', render: (p) => fmtInt(p._count.path) },
          ]}
        />
      </section>
    </div>
  );
}
