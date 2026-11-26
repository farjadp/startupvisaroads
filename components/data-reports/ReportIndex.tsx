// ============================================================================
// components/data-reports/ReportIndex.tsx
// The Data reports index: the same ruled "Docket" register as the Case
// Studies hub, so the two research sections read as one family. Reports are
// grouped by the month their data covers; inside a month the parts of a
// series are numbered in publishing order.
// ============================================================================
import React from 'react';
import Link from 'next/link';
import { Label, Ltr } from '@/components/case-studies/Marks';
import { courtDate } from '@/components/case-studies/copy';
import { RCIP_JOB_MARKET_SOURCES, editionLabel, type Edition } from '@/lib/data-reports';
import { COPY, type Lang } from './copy';

type Props = {
  lang: Lang;
  editions: Edition[];
  /** Link to the Case Studies index only when it has something to show. */
  showCaseStudies: boolean;
};

const LINK = 'font-medium underline underline-offset-[3px] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function ReportIndex({ lang, editions, showCaseStudies }: Props) {
  const t = COPY[lang];
  const fa = lang === 'fa';
  const total = editions.reduce((n, e) => n + e.reports.length, 0);

  return (
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

      <a
        href={`/${lang}/data-reports/rcip-employers`}
        className="mt-6 flex flex-col gap-1 bg-[#121417] p-5 text-paper transition-colors duration-150 hover:bg-[#2a2c2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <span className={fa ? 'text-xs text-[#b9b7b1]' : 'text-[11px] uppercase tracking-[0.15em] text-[#b9b7b1]'}>{t.toolKicker}</span>
        <span className={fa ? 'font-estedad text-xl font-extrabold' : 'font-serif text-2xl'}>{t.toolTitle}</span>
        <span className="text-sm text-acid">{t.toolCta}</span>
      </a>

      {total === 0 ? (
        <p className="py-10 text-base">{t.empty}</p>
      ) : (
        <>
          <p className="py-3 text-sm text-[#666562]">{t.count(total)}</p>
          {editions.map((edition) => {
            const label = editionLabel(edition, lang);
            return (
              <section key={edition.key} aria-labelledby={`edition-${edition.key}`} className="border-t border-ink">
                <h2 id={`edition-${edition.key}`} className={fa ? 'py-4 font-estedad text-xl font-extrabold' : 'py-4 font-serif text-2xl'}>
                  {label ? `${t.edition} ${label}` : t.undated}
                </h2>
                <ol className="list-none p-0">
                  {edition.reports.map((r, i) => (
                    <li
                      key={r.slug}
                      className="grid gap-x-6 gap-y-1 border-t border-ink/15 py-4 transition-colors duration-150 hover:bg-[#E5E3DD] md:grid-cols-[88px_1fr_auto]"
                    >
                      <Label lang={lang} className="pt-1 text-[#666562]">
                        {t.part(i + 1)}
                      </Label>
                      <div>
                        <Link href={`/${lang}/blog/${r.slug}`} className={`${fa ? 'text-lg font-bold leading-relaxed' : 'text-lg font-medium leading-snug'} hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}>
                          {r.title}
                        </Link>
                        {r.excerpt && <p className={`mt-1 max-w-[70ch] text-sm text-[#666562] ${fa ? 'leading-[1.9]' : 'leading-normal'}`}>{r.excerpt}</p>}
                      </div>
                      <p className="whitespace-nowrap text-sm tabular-nums text-[#666562] md:pt-1">
                        <span className="md:hidden">{t.published}: </span>
                        <time dateTime={r.publishedAt.toISOString().slice(0, 10)}>{courtDate(r.publishedAt, lang, true)}</time>
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </>
      )}

      <aside className="mt-10 grid gap-6 border-t border-ink pt-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div>
          <Label lang={lang} as="h2">
            {t.sourcesTitle}
          </Label>
          <p className={`mt-3 max-w-[70ch] text-sm ${fa ? 'leading-[1.9]' : 'leading-relaxed'}`}>{t.sourcesBody}</p>
          <ul className="mt-3 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm">
            <li>
              <a href={RCIP_JOB_MARKET_SOURCES.jobBank.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                {fa ? t.jobBank : <Ltr>{t.jobBank}</Ltr>}
              </a>
            </li>
            <li>
              <a href={RCIP_JOB_MARKET_SOURCES.ircc.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                {t.ircc}
              </a>
            </li>
          </ul>
        </div>
        {showCaseStudies && (
          <p className="self-end text-sm">
            {t.casesLead}{' '}
            <Link href={`/${lang}/case-studies`} className={LINK}>
              {t.casesLink}
            </Link>
          </p>
        )}
      </aside>
    </div>
  );
}
