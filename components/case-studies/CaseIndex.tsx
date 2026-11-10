// ============================================================================
// components/case-studies/CaseIndex.tsx
// Option A "Docket" index: hub intro with the direct answer, filter chips as
// plain links (query parameters, no JS), and a ruled register of cases.
// On phones the table rows become two-column grid rows; nothing is hidden
// except the column headers.
// ============================================================================
import React from 'react';
import Link from 'next/link';
import type { CaseFilters, CaseListItem } from '@/lib/case-studies/public';
import { CASE_OUTCOMES } from '@/lib/case-studies/outcomes';
import { COPY, courtDate, routeLabel, type Lang } from './copy';
import { Label, Ltr, OutcomeMark, SampleBanner, TypeBadge } from './Marks';

type Props = {
  lang: Lang;
  /** Every published case in this locale (unfiltered), newest first. */
  all: CaseListItem[];
  filters: CaseFilters;
};

function hrefFor(lang: Lang, f: CaseFilters): string {
  const qs = new URLSearchParams();
  if (f.route) qs.set('route', f.route);
  if (f.outcome) qs.set('outcome', f.outcome);
  const s = qs.toString();
  return `/${lang}/case-studies${s ? `?${s}` : ''}`;
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border border-ink px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        active ? 'bg-ink text-paper hover:bg-[#3A3A39]' : 'hover:bg-[#E5E3DD]'
      }`}
    >
      {children}
    </Link>
  );
}

function FilterGroup({ lang, label, children }: { lang: Lang; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Label lang={lang} className="min-w-[72px] text-[#666562]">
        {label}
      </Label>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function CaseIndex({ lang, all, filters }: Props) {
  const t = COPY[lang];
  const routes = Array.from(new Set(all.map((i) => i.route)));
  const outcomes = CASE_OUTCOMES.filter((o) => all.some((i) => i.outcome === o));
  const items = all.filter((i) => (!filters.route || i.route === filters.route) && (!filters.outcome || i.outcome === filters.outcome));
  const filtered = !!(filters.route || filters.outcome);
  const anySample = all.some((i) => i.sample);
  const fa = lang === 'fa';

  return (
    <>
      {anySample && <SampleBanner lang={lang} />}
      <div className="mx-auto max-w-[1240px] px-6 pb-20 pt-8 md:pt-10">
        <header className="grid gap-6 border-b border-ink pb-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
          <div>
            <Label lang={lang} as="p">
              {t.kicker}
            </Label>
            <h1
              className={
                fa
                  ? 'mt-3 font-estedad text-3xl font-black leading-snug md:text-[2.6rem] md:leading-[1.25]'
                  : 'mt-3 font-serif text-[2.5rem] leading-[0.95] tracking-[-0.02em] md:text-[3.25rem]'
              }
            >
              {t.h1}
            </h1>
          </div>
          <div className="self-end">
            <p className={fa ? 'text-base leading-[1.9]' : 'text-[17px] leading-relaxed'}>{t.directAnswer}</p>
            <p className="mt-2 text-xs leading-normal text-[#666562]">{t.hubNote}</p>
          </div>
        </header>

        {all.length > 0 && (
          <div role="group" aria-label={t.filterLabel} className="grid gap-3 border-b border-ink py-5">
            {routes.length > 1 && (
              <FilterGroup lang={lang} label={t.route}>
                <FilterChip href={hrefFor(lang, { ...filters, route: null })} active={!filters.route}>
                  {t.all}
                </FilterChip>
                {routes.map((r) => (
                  <FilterChip key={r} href={hrefFor(lang, { ...filters, route: r })} active={filters.route === r}>
                    {routeLabel(r, lang)}
                  </FilterChip>
                ))}
              </FilterGroup>
            )}
            {outcomes.length > 0 && (
              <FilterGroup lang={lang} label={t.outcome}>
                <FilterChip href={hrefFor(lang, { ...filters, outcome: null })} active={!filters.outcome}>
                  {t.all}
                </FilterChip>
                {outcomes.map((o) => (
                  <FilterChip key={o} href={hrefFor(lang, { ...filters, outcome: o })} active={filters.outcome === o}>
                    <OutcomeMark outcome={o} lang={lang} className="font-medium" />
                  </FilterChip>
                ))}
              </FilterGroup>
            )}
            <FilterGroup lang={lang} label={t.country}>
              <span className="inline-flex min-h-10 items-center rounded-full border border-ink bg-ink px-3.5 text-sm font-medium text-paper">
                {t.canada}
              </span>
              <span className="text-xs text-[#666562]">{t.moreCountries}</span>
            </FilterGroup>
          </div>
        )}

        {all.length === 0 ? (
          <p className="py-10 text-base">{t.empty}</p>
        ) : (
          <>
            <p className="py-3 text-sm text-[#666562]" aria-live="polite">
              {t.count(items.length)}
            </p>
            {items.length === 0 ? (
              <p className="border-t border-ink py-8">
                {t.filteredEmpty}{' '}
                <Link href={`/${lang}/case-studies`} className="font-medium underline underline-offset-[3px]">
                  {t.clearFilters}
                </Link>
              </p>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead className="max-md:hidden">
                  <tr>
                    {[t.colCitation, t.colRoute, t.colCase, t.colOutcome, t.colDate].map((h) => (
                      <th key={h} scope="col" className="border-b border-ink py-3 pe-3 text-start font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr
                      key={i.id}
                      className="transition-colors duration-150 hover:bg-[#E5E3DD] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:border-b max-md:border-ink/15 max-md:py-3"
                    >
                      <td className="whitespace-nowrap border-b border-ink/15 py-3.5 pe-3 align-top font-bold tabular-nums max-md:border-0 max-md:py-0.5">
                        {i.type === 'FC_DECISION' && i.citation ? <Ltr>{i.citation}</Ltr> : <TypeBadge type={i.type} lang={lang} />}
                      </td>
                      <td className="border-b border-ink/15 py-3.5 pe-3 align-top text-[#666562] max-md:col-span-2 max-md:border-0 max-md:py-0.5">
                        {routeLabel(i.route, lang)}
                        {i.decisionDate && <span className="md:hidden"> · {courtDate(i.decisionDate, lang, true)}</span>}
                      </td>
                      <td className="border-b border-ink/15 py-3.5 pe-3 align-top max-md:col-span-2 max-md:border-0 max-md:py-0.5">
                        <Link
                          href={`/${lang}/case-studies/${i.slug}`}
                          className="font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        >
                          {i.title}
                        </Link>
                        {i.lesson && <span className="mt-1 block text-xs leading-normal text-[#666562]">{i.lesson}</span>}
                      </td>
                      <td className="whitespace-nowrap border-b border-ink/15 py-3.5 pe-3 align-top max-md:col-start-2 max-md:row-start-1 max-md:border-0 max-md:py-0.5">
                        {i.outcome ? <OutcomeMark outcome={i.outcome} lang={lang} /> : <span className="text-xs text-[#666562]">{t.noCourtOutcome}</span>}
                      </td>
                      <td className="whitespace-nowrap border-b border-ink/15 py-3.5 align-top tabular-nums text-[#666562] max-md:hidden">
                        {i.decisionDate && <time dateTime={i.decisionDate.toISOString().slice(0, 10)}>{courtDate(i.decisionDate, lang, true)}</time>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filtered && items.length > 0 && (
              <p className="pt-6 text-sm">
                <Link href={`/${lang}/case-studies`} className="font-medium underline underline-offset-[3px]">
                  {t.clearFilters}
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
