// ============================================================================
// components/case-studies/CaseView.tsx
// One case page, option A "Docket": a case sheet (badge, citation, route,
// date, outcome, official link) beside a fixed, numbered analysis.
//
// The analysis is built from the row's claims, grouped by kind, so every
// sentence on the page is a claim and carries its ¶ chip (spec §3.9). The
// page renders only what the row contains: an empty section is skipped, a
// missing date or link is left out. No party name exists in the row, and
// nothing here would print one.
//
// Type B (client case) uses the same frame without ¶ chips, with the consent
// source line and disclaimer (b).
// ============================================================================
import React from 'react';
import Link from 'next/link';
import type { PublicCase, PublicClaim } from '@/lib/case-studies/public';
import { toPersianDigits } from '@/lib/fa/format';
import { COPY, DISCLAIMER_A, DISCLAIMER_B, courtDate, routeGuide, routeLabel, type Lang } from './copy';
import { Label, Ltr, OutcomeMark, SampleBanner, TypeBadge } from './Marks';
import ParaChip from './ParaChip';

type Section = { key: string; title: string; claims: PublicClaim[] };

function sectionsFor(c: PublicCase, lang: Lang): Section[] {
  const s = COPY[lang].sections;
  const of = (...kinds: string[]) => c.claims.filter((x) => kinds.includes(x.kind));
  if (c.type === 'CLIENT_CASE') {
    return [
      { key: 'facts', title: s.facts, claims: of('fact') },
      { key: 'problem', title: s.problem, claims: of('problem') },
      { key: 'action', title: s.action, claims: of('action') },
      { key: 'result', title: s.result, claims: of('outcome') },
    ];
  }
  const erred = of('error_found');
  return [
    { key: 'facts', title: s.facts, claims: of('fact') },
    { key: 'issue', title: s.issue, claims: of('issue', 'standard') },
    { key: 'held', title: s.held, claims: of('holding') },
    erred.length
      ? { key: 'erred', title: s.erred, claims: [...erred, ...of('no_error')] }
      : { key: 'erred', title: s.noError, claims: of('no_error') },
  ];
}

function num(n: number, lang: Lang): string {
  const two = String(n).padStart(2, '0');
  return lang === 'fa' ? toPersianDigits(two) : two;
}

function Chip({ claim, c, lang }: { claim: PublicClaim; c: PublicCase; lang: Lang }) {
  if (c.type !== 'FC_DECISION' || !claim.paras.length || !claim.quote) return null;
  const t = COPY[lang];
  return (
    <ParaChip
      label={t.paraLabel(claim.paras)}
      ariaLabel={t.paraAria(claim.paras)}
      heading={t.quoteHeading(claim.paras, c.citation)}
      quote={claim.quote}
      originalLabel={lang === 'fa' ? t.quoteLang : undefined}
    />
  );
}

/** Up to three claims per paragraph, each followed by its chip. */
function ClaimParagraphs({ claims, c, lang }: { claims: PublicClaim[]; c: PublicCase; lang: Lang }) {
  const chunks: PublicClaim[][] = [];
  for (let i = 0; i < claims.length; i += 3) chunks.push(claims.slice(i, i + 3));
  return (
    <>
      {chunks.map((chunk, i) => (
        <p key={i} className="mt-3 max-w-[66ch]">
          {chunk.map((claim, j) => (
            <React.Fragment key={claim.id}>
              {j > 0 && ' '}
              {claim.text}
              <Chip claim={claim} c={c} lang={lang} />
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

function SectionHeading({ n, title, lang, id }: { n: number; title: string; lang: Lang; id: string }) {
  return (
    <h2
      id={id}
      className={`mt-10 flex items-baseline gap-3 border-t border-ink pt-3 ${
        lang === 'fa' ? 'font-estedad text-xl font-black leading-snug' : 'font-serif text-2xl leading-tight'
      }`}
    >
      <small className={lang === 'fa' ? 'font-vazir text-xs font-bold' : 'font-sans text-[11px] font-bold tracking-[0.15em]'}>{num(n, lang)}</small>
      {title}
    </h2>
  );
}

const linkCls = 'font-medium underline underline-offset-[3px] hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function CaseView({ c }: { c: PublicCase }) {
  const lang: Lang = c.locale;
  const t = COPY[lang];
  const fa = lang === 'fa';
  const court = c.type === 'FC_DECISION';
  const sections = sectionsFor(c, lang).filter((s) => s.claims.length > 0);
  const oneLineClaim = court ? c.claims.find((x) => x.kind === 'holding') : undefined;
  const guide = routeGuide(c.route, lang);
  const dateIso = c.decisionDate ? c.decisionDate.toISOString().slice(0, 10) : null;
  const arrow = t.externalArrow;

  return (
    <>
      {c.sample && <SampleBanner lang={lang} />}
      <div className="mx-auto max-w-[1240px] px-6 pb-20 pt-6 md:pt-8">
        <p className="mb-6 text-sm">
          <Link href={`/${lang}/case-studies`} className={linkCls}>
            {t.back}
          </Link>
        </p>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <aside aria-label={t.caseSheet} className="self-start border border-ink lg:sticky lg:top-32">
            <div className="border-b border-ink/15 p-4">
              <TypeBadge type={c.type} lang={lang} />
            </div>
            {court && c.citation && (
              <div className="border-b border-ink/15 p-4">
                <Label lang={lang} className="mb-1.5 block text-[#666562]">
                  {t.citation}
                </Label>
                <Ltr className={`block tabular-nums ${fa ? 'font-sans text-[26px] font-bold leading-tight' : 'font-serif text-[34px] leading-[1.05]'}`}>
                  {c.citation}
                </Ltr>
              </div>
            )}
            <div className="border-b border-ink/15 p-4">
              <Label lang={lang} className="mb-1.5 block text-[#666562]">
                {t.route}
              </Label>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex min-h-8 items-center rounded-full border border-ink px-3 text-sm font-medium">{routeLabel(c.route, lang)}</span>
                <span className="inline-flex min-h-8 items-center rounded-full border border-ink px-3 text-sm font-medium">{t.canada}</span>
              </div>
            </div>
            {dateIso && c.decisionDate && (
              <div className="border-b border-ink/15 p-4">
                <Label lang={lang} className="mb-1.5 block text-[#666562]">
                  {t.decided}
                </Label>
                <time dateTime={dateIso}>{courtDate(c.decisionDate, lang)}</time>
              </div>
            )}
            {court && c.outcome && (
              <div className="border-b border-ink/15 p-4">
                <Label lang={lang} className="mb-1.5 block text-[#666562]">
                  {t.outcome}
                </Label>
                <OutcomeMark outcome={c.outcome} lang={lang} className="text-[17px]" />
                <p className="mt-1.5 text-sm font-medium">{c.outcome === 'allowed' ? t.outcomeAllowedLine : t.outcomeDismissedLine}</p>
                {c.outcome === 'allowed' && <p className="mt-1.5 text-xs leading-normal text-[#666562]">{t.notGranted}</p>}
              </div>
            )}
            {court && c.certifiedQuestion && (
              <div className="border-b border-ink/15 p-4">
                <Label lang={lang} className="mb-1.5 block text-[#666562]">
                  {t.certifiedQuestion}
                </Label>
                <p className="text-xs leading-normal">{t.certifiedNote}</p>
              </div>
            )}
            {court && c.officialUrl && (
              <div className="p-4">
                <a
                  href={c.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer external"
                  className="flex min-h-12 items-center justify-center gap-2 bg-ink px-5 text-center text-sm font-bold text-paper transition-colors duration-150 hover:bg-[#3A3A39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {t.readOfficial} <span aria-hidden>{arrow}</span>
                </a>
              </div>
            )}
          </aside>

          <article className={fa ? 'text-base leading-[1.9]' : 'text-base leading-relaxed'}>
            <h1
              className={
                fa
                  ? 'max-w-[26ch] font-estedad text-[1.75rem] font-black leading-[1.35] md:text-3xl'
                  : 'max-w-[22ch] font-serif text-[2rem] leading-[1.05] tracking-[-0.01em] md:text-[2.5rem]'
              }
            >
              {c.title}
            </h1>

            {c.keyTakeaway && (
              <p className={`mt-4 max-w-[44ch] ${fa ? 'font-estedad text-lg font-bold leading-[1.7]' : 'font-serif text-xl leading-snug'}`}>
                <span className="sr-only">{t.inOneLine}: </span>
                {c.keyTakeaway}
                {oneLineClaim && <Chip claim={oneLineClaim} c={c} lang={lang} />}
              </p>
            )}

            {sections.map((s, i) => (
              <section key={s.key} aria-labelledby={`cs-${s.key}`}>
                <SectionHeading n={i + 1} title={s.title} lang={lang} id={`cs-${s.key}`} />
                <ClaimParagraphs claims={s.claims} c={c} lang={lang} />
              </section>
            ))}

            {c.lessons.length > 0 && (
              <section aria-labelledby="cs-lessons">
                <SectionHeading n={sections.length + 1} title={t.sections.lessons} lang={lang} id="cs-lessons" />
                <ul className="mt-3 max-w-[66ch] list-disc space-y-2 ps-5">
                  {c.lessons.map((l, i) => (
                    <li key={i}>
                      {l.text}
                      {l.claim && <Chip claim={l.claim} c={c} lang={lang} />}
                      {l.href && (
                        <>
                          {' '}
                          <Link href={l.href.startsWith('/') && !/^\/(en|fa)\//.test(l.href) ? `/${lang}${l.href}` : l.href} className={`text-sm ${linkCls}`}>
                            {t.checklistLink}
                          </Link>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                {guide && (
                  <p className="mt-4">
                    <Link href={`/${lang}${guide}`} className={linkCls}>
                      {t.guideLink(routeLabel(c.route, lang))}
                    </Link>
                  </p>
                )}
              </section>
            )}

            {c.faq.length > 0 && (
              <section aria-labelledby="cs-faq">
                <SectionHeading n={sections.length + (c.lessons.length ? 2 : 1)} title={t.faq} lang={lang} id="cs-faq" />
                <dl className="mt-3 max-w-[66ch] space-y-4">
                  {c.faq.map((f, i) => (
                    <div key={i}>
                      <dt className="font-bold">{f.question}</dt>
                      <dd className="mt-1">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <footer className="mt-10 max-w-[72ch] border-t border-ink pt-4 text-sm">
              <Label lang={lang} as="p">
                {t.source}
              </Label>
              {court ? (
                <>
                  <dl className="my-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    {c.citation && (
                      <>
                        <dt className="text-[#666562]">{t.citation}</dt>
                        <dd className="font-bold tabular-nums">
                          <Ltr>{c.citation}</Ltr>
                        </dd>
                      </>
                    )}
                    <dt className="text-[#666562]">{t.court}</dt>
                    <dd>{c.court && !fa ? c.court : fa ? 'دادگاه فدرال کانادا' : 'Federal Court of Canada'}</dd>
                    {c.decisionDate && dateIso && (
                      <>
                        <dt className="text-[#666562]">{t.date}</dt>
                        <dd>
                          <time dateTime={dateIso}>{courtDate(c.decisionDate, lang)}</time>
                        </dd>
                      </>
                    )}
                  </dl>
                  {c.officialUrl && (
                    <p>
                      <a href={c.officialUrl} target="_blank" rel="noopener noreferrer external" className={linkCls}>
                        {fa ? (
                          <>
                            {t.officialOnSite} <Ltr>decisions.fct-cf.gc.ca</Ltr>
                          </>
                        ) : (
                          t.officialOnSite
                        )}{' '}
                        <span aria-hidden>{arrow}</span>
                      </a>
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-normal text-[#666562]">
                    {t.attribution} {t.noEndorsement}
                  </p>
                  <p className="mt-4 text-xs leading-normal text-[#666562]">{DISCLAIMER_A[lang]}</p>
                </>
              ) : (
                <>
                  <p className="mt-2">{t.clientSource}</p>
                  <p className="mt-4 text-xs leading-normal text-[#666562]">{DISCLAIMER_B[lang]}</p>
                </>
              )}
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
