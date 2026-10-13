// ============================================================================
// components/pnp/EntrepreneurComparison.tsx
// The five Entrepreneur PNP provinces side by side, on /en/pnp. The values
// are the same ones the province guides carry (content/en/pnp-*.ts), checked
// against each province's official pages on CHECKED. When a province changes
// a threshold, change it in its guide and here in the same commit.
// ============================================================================
import React from 'react';
import { Link } from '@/routing';

const CHECKED = '2026-10-12';

type Row = {
  province: string;
  stream: string;
  href: string;
  status: string;
  netWorth: string;
  investment: string;
  ownership: string;
  language: string;
  beforeNomination: string;
};

const ROWS: Row[] = [
  {
    province: 'Alberta',
    stream: 'Rural Entrepreneur (AAIP)',
    href: '/pnp/alberta',
    status: 'Open; 24 of 60 entrepreneur nominations left in 2026',
    netWorth: 'CAD 300,000',
    investment: 'CAD 100,000',
    ownership: '51%',
    language: 'CLB 4',
    beforeNomination: '12 months of operation',
  },
  {
    province: 'Manitoba',
    stream: 'Business Investor, Entrepreneur Pathway',
    href: '/pnp/manitoba',
    status: 'EOIs by email, reviewed within 4 weeks; no draws',
    netWorth: 'CAD 500,000',
    investment: 'CAD 250,000 (150,000 outside Winnipeg region)',
    ownership: '33⅓%',
    language: 'CLB 5',
    beforeNomination: '6 months of operation, final report by month 20',
  },
  {
    province: 'Nova Scotia',
    stream: 'NSNP Entrepreneur',
    href: '/pnp/nova-scotia',
    status: 'By invitation; 4 draws in 2026, latest cut-off 101',
    netWorth: 'CAD 600,000 (400,000 outside Halifax)',
    investment: 'CAD 150,000 (100,000 outside Halifax)',
    ownership: 'One third',
    language: 'CLB 5',
    beforeNomination: '1 full year of operation',
  },
  {
    province: 'New Brunswick',
    stream: 'Business Immigration Stream (NBBIS)',
    href: '/pnp/new-brunswick',
    status: 'Active; no business draws published',
    netWorth: 'CAD 500,000 (300,000 agriculture)',
    investment: 'CAD 150,000',
    ownership: '33.3%',
    language: 'CLB 4',
    beforeNomination: '6 consecutive months of operation',
  },
  {
    province: 'Prince Edward Island',
    stream: 'Business Work Permit Stream',
    href: '/pnp/pei',
    status: 'Listed, but 0 entrepreneurs invited in 2026',
    netWorth: 'CAD 600,000',
    investment: 'CAD 150,000',
    ownership: '100% for a start-up',
    language: 'CLB 4',
    beforeNomination: '12 consecutive months of operation',
  },
];

const COLUMNS: { key: keyof Row; label: string }[] = [
  { key: 'status', label: 'Status (October 2026)' },
  { key: 'netWorth', label: 'Minimum net worth' },
  { key: 'investment', label: 'Minimum investment' },
  { key: 'ownership', label: 'Ownership' },
  { key: 'language', label: 'Language' },
  { key: 'beforeNomination', label: 'Before nomination' },
];

const checkedOn = new Date(`${CHECKED}T12:00:00Z`).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric' });

export default function EntrepreneurComparison() {
  return (
    <section id="entrepreneur-pnp" className="py-24 border-t border-[#1a1a1a]/10 px-4 scroll-mt-28">
      <h2 className="font-serif text-4xl md:text-6xl mb-4 max-w-[22ch]">Entrepreneur PNP: the five provinces compared</h2>
      <p className="font-sans text-[#1a1a1a]/65 max-w-3xl mb-10 leading-relaxed">
        Canada&rsquo;s federal Start-up Visa is paused, so for most founders the way in is a provincial entrepreneur stream: start or buy a business, run it on a work permit, then be nominated for permanent residence. These are the five we work with. Every figure comes from the province&rsquo;s own pages, checked on <time dateTime={CHECKED}>{checkedOn}</time>; each guide links its sources.
      </p>
      <div className="overflow-x-auto border border-[#1a1a1a]">
        <table className="w-full min-w-[900px] text-left font-sans text-sm">
          <caption className="sr-only">Entrepreneur provincial nominee streams in Alberta, Manitoba, Nova Scotia, New Brunswick and Prince Edward Island</caption>
          <thead className="bg-[#1a1a1a] text-[#F2F0E9]">
            <tr>
              <th scope="col" className="p-4 font-bold">Province</th>
              {COLUMNS.map((c) => (
                <th key={c.key} scope="col" className="p-4 font-bold">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.href} className="border-t border-[#1a1a1a]/15 align-top">
                <th scope="row" className="p-4 font-normal">
                  <Link href={r.href} className="font-serif text-xl underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">{r.province}</Link>
                  <span className="block text-xs text-[#1a1a1a]/55 mt-1">{r.stream}</span>
                </th>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="p-4 leading-relaxed">{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#1a1a1a]/50">Thresholds change during the year. Confirm on the official source linked from each province&rsquo;s guide before you act.</p>
    </section>
  );
}
