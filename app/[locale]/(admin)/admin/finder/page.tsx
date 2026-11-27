// ============================================================================
// Admin: /[locale]/admin/finder
// RCIP employer finder: sign-ups (email, date, profile, steps, reveals,
// marketing opt-in), open "this contact is wrong" reports, and the contact
// policy switch. Middleware guards /admin; actions re-check the session.
// ============================================================================
import React from 'react';
import Link from 'next/link';
import { isFinderFilter, loadFinderAdmin, optInEmails, type FinderAdminData, type FinderFilter } from '@/lib/rcip-finder/admin';
import { CopyOptIn, PolicySwitch, ResolveButton } from '@/components/admin/finder/FinderControls';

export const dynamic = 'force-dynamic';

const fmt = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '—');
const EXPERIENCE: Record<string, string> = { lt1: '< 1 yr', '1to2': '1–2 yrs', '3plus': '3+ yrs' };
const REASON: Record<string, string> = { wrong: 'Wrong contact', removal: 'Removal request', other: 'Other' };
const FILTERS: { key: FinderFilter; label: string }[] = [
  { key: 'all', label: 'All sign-ups' },
  { key: 'verified', label: 'Signed in' },
  { key: 'optin', label: 'Opted in to marketing' },
];

function href(filter: FinderFilter, q: string | null, page = 1) {
  const p = new URLSearchParams();
  if (filter !== 'all') p.set('filter', filter);
  if (q) p.set('q', q);
  if (page > 1) p.set('page', String(page));
  const s = p.toString();
  return `/en/admin/finder${s ? `?${s}` : ''}`;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#1a1a1a]/5 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-[#1a1a1a]/50">{label}</p>
      <p className="mt-1 font-serif text-3xl text-[#1a1a1a]">{value.toLocaleString('en')}</p>
    </div>
  );
}

export default async function AdminFinderPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const filter: FinderFilter = isFinderFilter(sp.filter) ? sp.filter : 'all';
  const q = typeof sp.q === 'string' && sp.q.trim() ? sp.q.trim().slice(0, 120) : null;
  const page = typeof sp.page === 'string' ? Number.parseInt(sp.page, 10) || 1 : 1;

  let data: FinderAdminData | null = null;
  let optIn: string[] = [];
  try {
    [data, optIn] = await Promise.all([loadFinderAdmin({ filter, q, page }), optInEmails()]);
  } catch (e) {
    console.error('admin/finder: query failed', e);
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-4xl text-[#1a1a1a]">RCIP finder</h1>
        <p className="max-w-3xl font-sans text-[#1a1a1a]/60">
          Who signed up to the <Link href="/en/data-reports/rcip-employers" className="underline">employer finder</Link>, how far they got, and the contact reports.
          Only people who opted in may receive marketing email (CASL); everyone else gets sign-in links only.
        </p>
      </div>

      {!data ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">The finder data is unavailable right now: the database did not answer.</p>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Stat label="Sign-ups" value={data.totals.users} />
            <Stat label="Signed in" value={data.totals.verified} />
            <Stat label="Opted in" value={data.totals.optIn} />
            <Stat label="Reveals" value={data.totals.reveals} />
            <Stat label="Reveals this month" value={data.totals.revealsThisMonth} />
            <Stat label="Open reports" value={data.totals.openReports} />
          </div>

          <section className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <Link
                  key={f.key}
                  href={href(f.key, q)}
                  className={`rounded-full px-3 py-1 text-sm ${filter === f.key ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'bg-white text-[#1a1a1a]/70 hover:text-[#1a1a1a]'}`}
                >
                  {f.label}
                </Link>
              ))}
              <form action="/en/admin/finder" className="ms-auto flex items-center gap-2">
                {filter !== 'all' && <input type="hidden" name="filter" value={filter} />}
                <input
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder="Search email"
                  className="w-56 rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-1.5 text-sm"
                />
                <button className="rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-sm text-[#CCFF00]">Search</button>
              </form>
              <CopyOptIn emails={optIn} />
            </div>

            {data.users.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#1a1a1a]/15 bg-white/60 p-10 text-center text-sm text-[#1a1a1a]/60">No sign-ups match.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#1a1a1a]/5 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#1a1a1a]/10 text-xs uppercase tracking-wider text-[#1a1a1a]/50">
                    <tr>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Signed up</th>
                      <th className="px-4 py-3">Last seen</th>
                      <th className="px-4 py-3">Occupation</th>
                      <th className="px-4 py-3">Exp.</th>
                      <th className="px-4 py-3">CLB</th>
                      <th className="px-4 py-3">Steps</th>
                      <th className="px-4 py-3">Reveals (month)</th>
                      <th className="px-4 py-3">Marketing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((u) => (
                      <tr key={u.id} className="border-b border-[#1a1a1a]/5 last:border-0">
                        <td className="px-4 py-3 font-medium text-[#1a1a1a]">
                          {u.email}
                          {!u.verifiedAt && <span className="ms-2 rounded bg-[#1a1a1a]/5 px-1.5 py-0.5 text-[10px] text-[#1a1a1a]/50">never signed in</span>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#1a1a1a]/70">{fmt(u.createdAt)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#1a1a1a]/70">{fmt(u.lastSeenAt)}</td>
                        <td className="px-4 py-3 text-[#1a1a1a]/70">{u.noc ? `${u.occupation ?? ''} (${u.noc})` : '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#1a1a1a]/70">{u.experience ? EXPERIENCE[u.experience] ?? u.experience : '—'}</td>
                        <td className="px-4 py-3 text-[#1a1a1a]/70">{u.clb ?? '—'}</td>
                        <td className="px-4 py-3 text-[#1a1a1a]/70">{u.steps}/5</td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#1a1a1a]/70">
                          {u.usedThisMonth}/{u.quota} <span className="text-[#1a1a1a]/40">· {u.revealsTotal} total</span>
                        </td>
                        <td className="px-4 py-3">
                          {u.marketingOptIn ? (
                            <span className="rounded-full bg-[#CCFF00] px-2 py-0.5 text-[11px] font-semibold text-[#1a1a1a]">opted in</span>
                          ) : (
                            <span className="text-xs text-[#1a1a1a]/40">no</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {data.pages > 1 && (
              <div className="mt-4 flex items-center gap-3 text-sm text-[#1a1a1a]/60">
                {data.page > 1 && <Link href={href(filter, q, data.page - 1)} className="underline">Previous</Link>}
                <span>
                  Page {data.page} of {data.pages} · {data.matching.toLocaleString('en')} people
                </span>
                {data.page < data.pages && <Link href={href(filter, q, data.page + 1)} className="underline">Next</Link>}
              </div>
            )}
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl text-[#1a1a1a]">Open contact reports</h2>
            {data.reports.length === 0 ? (
              <p className="text-sm text-[#1a1a1a]/60">None. Visitors can flag a revealed contact as wrong or ask for removal; reports land here.</p>
            ) : (
              <ul className="space-y-2">
                {data.reports.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-[#1a1a1a]/5 bg-white p-4">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.reason === 'removal' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                      {REASON[r.reason] ?? r.reason}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1a1a1a]">
                        {r.employerName} <span className="font-normal text-[#1a1a1a]/50">· {r.community}</span>
                      </p>
                      {r.note && <p className="mt-1 text-sm text-[#1a1a1a]/70">{r.note}</p>}
                      <p className="mt-1 text-xs text-[#1a1a1a]/40">
                        {fmt(r.createdAt)}
                        {r.reporterEmail ? ` · ${r.reporterEmail}` : ''}
                      </p>
                    </div>
                    <ResolveButton id={r.id} />
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-[#1a1a1a]/50">Resolving only closes the report. To fix or remove a contact, correct it in the webscraper CSV and re-run the import.</p>
          </section>

          <section>
            <h2 className="mb-1 font-serif text-2xl text-[#1a1a1a]">Contact policy</h2>
            <p className="mb-4 text-sm text-[#1a1a1a]/60">
              What a reveal shows. {data.policySaved ? '' : 'Not saved yet, so the code default applies. '}
              No-solicitation communities: {data.blocked.join(', ')}.
            </p>
            <PolicySwitch current={data.policy} />
          </section>
        </>
      )}
    </div>
  );
}
