import Link from 'next/link';
import { Search } from 'lucide-react';
import { RECIPIENT_FILTERS, type LinkReportRow, type RecipientReportRow } from '@/lib/campaign-queue/report';

const cardCls = 'bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden';
const thCls = 'px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest whitespace-nowrap';
const FILTER_LABELS: Record<string, string> = {
  all: 'Everyone',
  opened: 'Opened',
  clicked: 'Clicked',
  'not-opened': 'Not opened',
  failed: 'Failed',
};

const when = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(date)
    : '—';

export function CampaignLinks({ links }: { links: LinkReportRow[] }) {
  return (
    <div className={cardCls}>
      <div className="p-6 border-b border-[#1a1a1a]/5">
        <h3 className="font-serif text-xl">Link clicks</h3>
        <p className="font-sans text-xs text-[#1a1a1a]/40 mt-1">
          Clicks from before per-link tracking count once per person. Email security tools can also click links.
        </p>
      </div>
      {links.length === 0 ? (
        <p className="px-6 py-8 text-sm font-sans text-[#1a1a1a]/40 italic">No link has been clicked yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-[#1a1a1a]/[0.02] border-b border-[#1a1a1a]/5">
              <tr>
                <th className={thCls}>Link</th>
                <th className={`${thCls} text-right`}>People</th>
                <th className={`${thCls} text-right`}>Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {links.map((link) => (
                <tr key={link.url}>
                  <td className="px-4 py-3 text-[#1a1a1a]/80 break-all">{link.url}</td>
                  <td className="px-4 py-3 text-right font-bold">{link.people.toLocaleString('en-CA')}</td>
                  <td className="px-4 py-3 text-right font-bold">{link.clicks.toLocaleString('en-CA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CampaignVersions({
  versions,
}: {
  versions: { version: number; subject: string | null; current: boolean; sent: number; opened: number; clicked: number }[];
}) {
  if (versions.length < 2) return null;
  return (
    <div className={cardCls}>
      <div className="p-6 border-b border-[#1a1a1a]/5">
        <h3 className="font-serif text-xl">Versions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead className="bg-[#1a1a1a]/[0.02] border-b border-[#1a1a1a]/5">
            <tr>
              <th className={thCls}>Version</th>
              <th className={thCls}>Subject</th>
              <th className={`${thCls} text-right`}>Sent</th>
              <th className={`${thCls} text-right`}>Opened</th>
              <th className={`${thCls} text-right`}>Clicked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {versions.map((v) => (
              <tr key={v.version}>
                <td className="px-4 py-3 font-bold whitespace-nowrap">
                  {v.version}{v.current ? ' (current)' : ''}
                </td>
                <td className="px-4 py-3 text-[#1a1a1a]/70">{v.subject ?? '—'}</td>
                <td className="px-4 py-3 text-right">{v.sent.toLocaleString('en-CA')}</td>
                <td className="px-4 py-3 text-right">{v.opened.toLocaleString('en-CA')}</td>
                <td className="px-4 py-3 text-right">{v.clicked.toLocaleString('en-CA')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CampaignRecipients({
  campaignId,
  report,
}: {
  campaignId: string;
  report: { show: string; q: string; page: number; pages: number; total: number; rows: RecipientReportRow[] };
}) {
  const base = `/en/admin/marketing/campaigns/${campaignId}`;
  const href = (next: { show?: string; page?: number }) => {
    const params = new URLSearchParams();
    const show = next.show ?? report.show;
    if (show !== 'all') params.set('show', show);
    if (report.q) params.set('q', report.q);
    if (next.page && next.page > 1) params.set('page', String(next.page));
    const query = params.toString();
    return `${base}${query ? `?${query}` : ''}#recipients`;
  };

  return (
    <section id="recipients" className={`${cardCls} mt-8 scroll-mt-6`} aria-label="Recipients">
      <div className="p-6 border-b border-[#1a1a1a]/5 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl">Recipients</h3>
            <p className="font-sans text-xs text-[#1a1a1a]/40 mt-1">
              Opens are approximate: Apple Mail and some security tools load images without the person reading the email.
            </p>
          </div>
          <form method="get" action={`${base}#recipients`} className="flex items-center gap-2">
            {report.show !== 'all' && <input type="hidden" name="show" value={report.show} />}
            <label htmlFor="recipient-search" className="sr-only">Search by email or phone</label>
            <input
              id="recipient-search"
              name="q"
              defaultValue={report.q}
              placeholder="Search email or phone"
              className="border border-[#1a1a1a]/10 rounded-xl px-3 py-2 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
            />
            <button type="submit" aria-label="Search" className="p-2.5 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
        <nav className="flex flex-wrap gap-2" aria-label="Filter recipients">
          {RECIPIENT_FILTERS.map((filter) => (
            <Link
              key={filter}
              href={href({ show: filter })}
              aria-current={report.show === filter ? 'true' : undefined}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                report.show === filter
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                  : 'border-[#1a1a1a]/10 text-[#1a1a1a]/70 hover:bg-[#1a1a1a]/5'
              }`}
            >
              {FILTER_LABELS[filter]}
            </Link>
          ))}
        </nav>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead className="bg-[#1a1a1a]/[0.02] border-b border-[#1a1a1a]/5">
            <tr>
              <th className={thCls}>Recipient</th>
              <th className={thCls}>Status</th>
              <th className={thCls}>Version</th>
              <th className={thCls}>Sent</th>
              <th className={thCls}>Opens</th>
              <th className={thCls}>Clicks</th>
              <th className={thCls}>Links clicked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {report.rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[#1a1a1a]/40 italic">Nobody matches.</td>
              </tr>
            ) : (
              report.rows.map((row) => (
                <tr key={row.id} className="align-top hover:bg-[#1a1a1a]/[0.02]">
                  <td className="px-4 py-3">
                    <span className={row.recipient ? 'font-bold text-[#1a1a1a]' : 'italic text-[#1a1a1a]/40'}>
                      {row.recipient ?? 'Removed contact'}
                    </span>
                    {row.name && <span className="block text-xs text-[#1a1a1a]/40">{row.name}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      row.status === 'SENT' ? 'bg-green-100 text-green-700' : row.status === 'CLAIMED' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {row.status === 'CLAIMED' ? 'UNCONFIRMED' : row.status}
                    </span>
                    {row.error && <span className="block text-xs text-red-500 mt-1 max-w-56 break-words">{row.error}</span>}
                  </td>
                  <td className="px-4 py-3 text-[#1a1a1a]/60">{row.version}</td>
                  <td className="px-4 py-3 text-xs text-[#1a1a1a]/50 whitespace-nowrap">{when(row.sentAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold">{row.openCount}</span>
                    {row.openedAt && <span className="block text-xs text-[#1a1a1a]/40">{when(row.openedAt)}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold">{row.clickCount}</span>
                    {row.clickedAt && <span className="block text-xs text-[#1a1a1a]/40">{when(row.clickedAt)}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#1a1a1a]/70 min-w-64">
                    {row.links.length === 0 ? '—' : row.links.map((link) => (
                      <span key={link.url} className="block break-all">
                        <span className="font-bold">{link.clicks}×</span> {link.url}
                      </span>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-[#1a1a1a]/5 font-sans text-sm text-[#1a1a1a]/60">
        <span>{report.total.toLocaleString('en-CA')} people · page {report.page} of {report.pages}</span>
        <span className="flex gap-2">
          {report.page > 1 && <Link href={href({ page: report.page - 1 })} className="font-bold underline">Previous</Link>}
          {report.page < report.pages && <Link href={href({ page: report.page + 1 })} className="font-bold underline">Next</Link>}
        </span>
      </div>
    </section>
  );
}
