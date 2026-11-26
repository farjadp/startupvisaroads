'use client';
// ============================================================================
// components/rcip-finder/Finder.tsx
// The RCIP employer finder: profile form, closest employers (one server page
// at a time), contact reveals within the monthly quota, and the unlock steps.
// No row data is in the page's HTML; every list comes from /api/finder/*.
// ============================================================================
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COMMUNITY_FA, COPY, num, wage, type Lang } from './copy';

type Hit = { noc: string; en: string; fa: string; curated: boolean };
type Contact = { website: string | null; phone: string | null; emails: string[]; source: string };
type Item = {
  id: string; name: string; community: string; province: string; businessType: string; tier: 'core' | 'related';
  communityPostings: number; listAsOf: string | null; sourceUrl: string; closedNote: string | null; hasContact: boolean; contact: Contact | null;
};
type Check = {
  noc: string; name: string; teer: number | null; clbNeeded: number | null; clbMeets: boolean | null; experienceMeets: boolean | null;
  postings: { postings: number; vacancies: number; median_wage_hr: number | null; wage_n: number } | null;
};
type Result = { check: Check; total: number; coreTotal: number; page: number; pages: number; items: Item[]; capped: boolean };
type Me = { email: string; profile: { noc: string | null; experience: string | null; clb: number | null }; steps: string[]; next: string | null; quota: number; used: number };

const FIELD = 'h-12 w-full border border-ink bg-white px-3 text-base text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';
const BTN = 'inline-flex min-h-11 items-center justify-center border border-ink px-4 text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50';
const DARK = `${BTN} bg-ink text-paper hover:bg-[#3A3A39]`;
const LIGHT = `${BTN} bg-paper text-ink hover:bg-[#E5E3DD]`;
const ACID = `${BTN} bg-acid text-ink hover:bg-[#b8e600]`;
const PROVINCES = ['ON', 'BC', 'SK', 'MB', 'NS', 'AB'];
const STEPS = ['account', 'profile', 'guide', 'quiz', 'pledge'];

async function api<T>(url: string, init?: RequestInit): Promise<{ status: number; body: T & { error?: string; retryAfter?: number } }> {
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }, credentials: 'same-origin' });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

const Ltr = ({ children }: { children: React.ReactNode }) => <bdi dir="ltr">{children}</bdi>;

export default function Finder({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const fa = lang === 'fa';
  const cname = (c: string) => (fa ? COMMUNITY_FA[c] ?? c : c);

  // ── profile form
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [noc, setNoc] = useState<Hit | null>(null);
  const [experience, setExperience] = useState('1to2');
  const [clb, setClb] = useState(5);
  const [province, setProvince] = useState('');
  const [formError, setFormError] = useState('');

  // ── results
  const [result, setResult] = useState<Result | null>(null);
  const [page, setPage] = useState(1);
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'limited'>('idle');
  const [retry, setRetry] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── account
  const [me, setMe] = useState<Me | null>(null);
  const [panel, setPanel] = useState<'none' | 'signin' | 'steps'>('none');
  const [notice, setNotice] = useState('');

  const loadMe = useCallback(async () => {
    const { body } = await api<{ me: Me | null }>('/api/finder/me');
    setMe(body.me ?? null);
    return body.me ?? null;
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const signin = sp.get('signin');
    if (signin === 'ok') { setNotice(t.welcome); setPanel('steps'); }
    if (signin === 'expired') { setNotice(t.expired); setPanel('signin'); }
    const qNoc = sp.get('noc');
    loadMe().then((m) => {
      const fromProfile = m?.profile.noc ?? null;
      const start = qNoc && /^\d{5}$/.test(qNoc) ? qNoc : fromProfile;
      if (m?.profile.experience) setExperience(m.profile.experience);
      if (m?.profile.clb) setClb(m.profile.clb);
      if (start) {
        api<{ items: Hit[] }>(`/api/finder/occupations?q=${start}`).then(({ body }) => {
          const h = body.items?.find((x) => x.noc === start);
          if (h) { setNoc(h); setQuery(fa ? h.fa : h.en); }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // occupation suggestions, debounced
  useEffect(() => {
    if (noc && (query === noc.fa || query === noc.en)) return;
    const q = query.trim();
    if (q.length < 2) { setHits([]); return; }
    const id = setTimeout(async () => {
      const { body } = await api<{ items: Hit[] }>(`/api/finder/occupations?q=${encodeURIComponent(q)}`);
      setHits(body.items ?? []);
      setOpen(true);
      setActive(-1);
    }, 200);
    return () => clearTimeout(id);
  }, [query, noc]);

  const choose = (h: Hit) => { setNoc(h); setQuery(fa ? h.fa : h.en); setOpen(false); setFormError(''); };

  const load = useCallback(async (p: number) => {
    if (!noc) return;
    setState('loading');
    const qs = new URLSearchParams({ noc: noc.noc, page: String(p), clb: String(clb), exp: experience, ...(province ? { province } : {}) });
    const { status, body } = await api<Result>(`/api/finder/employers?${qs}`);
    if (status === 429) { setState('limited'); setRetry(body.retryAfter ?? 60); return; }
    if (status !== 200) { setState('error'); return; }
    setResult(body);
    setPage(body.page);
    setState('idle');
    const url = new URL(window.location.href);
    url.searchParams.set('noc', noc.noc);
    url.searchParams.delete('signin');
    window.history.replaceState(null, '', url.toString());
  }, [noc, clb, experience, province]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noc) { setFormError(t.pickOccupation); return; }
    load(1).then(() => resultsRef.current?.focus());
  };

  const goPage = (p: number) => load(p).then(() => resultsRef.current?.scrollIntoView({ block: 'start' }));

  // ── reveal
  const [revealError, setRevealError] = useState<Record<string, string>>({});
  const revealRow = async (id: string) => {
    if (!me) { setPanel('signin'); return; }
    const { status, body } = await api<{ contact: Contact; me: Me }>('/api/finder/reveal', { method: 'POST', body: JSON.stringify({ employerId: id }) });
    if (body.me) setMe(body.me);
    if (status === 200 && result) {
      setResult({ ...result, items: result.items.map((i) => (i.id === id ? { ...i, contact: body.contact } : i)) });
    } else if (body.error === 'quota') {
      setRevealError((m) => ({ ...m, [id]: t.quotaUsed }));
      setPanel('steps');
    } else if (status === 401) {
      setMe(null);
      setPanel('signin');
    } else {
      setRevealError((m) => ({ ...m, [id]: t.error }));
    }
  };

  const [reported, setReported] = useState<Record<string, boolean>>({});
  const report = async (id: string, reason: 'wrong' | 'removal') => {
    const { status } = await api('/api/finder/report', { method: 'POST', body: JSON.stringify({ employerId: id, reason }) });
    if (status === 200) setReported((m) => ({ ...m, [id]: true }));
  };

  const left = me ? Math.max(0, me.quota - me.used) : 0;
  const listDate = (d: string | null) => {
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(d ?? '');
    if (!m) return '';
    const date = new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1));
    return new Intl.DateTimeFormat(fa ? 'fa-IR-u-ca-gregory' : 'en-CA', { day: m[3] ? 'numeric' : undefined, month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-8 sm:px-6 md:pt-10">
      <header className="border-b border-ink pb-6">
        <p className={fa ? 'text-xs font-bold' : 'text-[11px] font-bold uppercase tracking-[0.15em]'}>{t.kicker}</p>
        <h1 className={fa ? 'mt-3 font-estedad text-3xl font-black leading-snug md:text-[2.4rem]' : 'mt-3 font-serif text-[2.3rem] leading-[1] tracking-[-0.02em] md:text-[3rem]'}>{t.h1}</h1>
        <p className={`mt-3 max-w-[70ch] ${fa ? 'text-base leading-[1.9]' : 'text-[17px] leading-relaxed'}`}>{t.lead}</p>
      </header>

      {/* Account bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink py-3 text-sm">
        {me ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex gap-1" role="img" aria-label={t.quotaLine(left, me.quota)}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-5 w-5 ${i < me.used ? 'bg-ink' : i < me.quota ? 'bg-acid outline outline-1 outline-ink' : 'border-2 border-dashed border-[#8a8883]'}`} />
                ))}
              </span>
              <span><strong>{t.quotaTitle}</strong> · {t.quotaLine(left, me.quota)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {me.quota < 5 && <button type="button" className={ACID} onClick={() => setPanel('steps')}>{t.unlockMore}</button>}
              <span className="text-[#555451]">{t.signedInAs(me.email)}</span>
              <button type="button" className={LIGHT} onClick={async () => { await api('/api/finder/auth/logout', { method: 'POST' }); setMe(null); setPanel('none'); }}>{t.signOut}</button>
            </div>
          </>
        ) : (
          <>
            <span className="text-[#555451]">{t.signInLead}</span>
            <button type="button" className={DARK} onClick={() => setPanel('signin')}>{t.signIn}</button>
          </>
        )}
      </div>
      {notice && <p role="status" className="mt-3 border border-ink bg-white px-4 py-3 text-sm">{notice}</p>}

      {panel === 'signin' && !me && <SignIn lang={lang} onClose={() => setPanel('none')} />}
      {panel === 'steps' && me && (
        <Steps
          lang={lang}
          me={me}
          profile={noc ? { noc: noc.noc, experience, clb } : null}
          onMe={setMe}
          onClose={() => setPanel('none')}
        />
      )}

      {/* Profile form */}
      <form onSubmit={submit} className="mt-6 grid gap-4 bg-[#121417] p-5 text-paper md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end" noValidate>
        <div className="relative">
          <label htmlFor="occ" className="mb-1.5 block text-sm font-bold">{t.occupation}</label>
          <input
            id="occ"
            type="search"
            dir="auto"
            autoComplete="off"
            role="combobox"
            aria-expanded={open && hits.length > 0}
            aria-controls="occ-list"
            aria-activedescendant={active >= 0 ? `occ-${active}` : undefined}
            aria-describedby="occ-hint"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setNoc(null); }}
            onKeyDown={(e) => {
              if (!open || hits.length === 0) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(hits.length - 1, a + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
              if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(hits[active]); }
              if (e.key === 'Escape') setOpen(false);
            }}
            className={FIELD}
          />
          <p id="occ-hint" className="mt-1 text-xs text-[#b9b7b1]">{t.occupationHint}</p>
          {open && hits.length > 0 && (
            <ul id="occ-list" role="listbox" className="absolute z-20 mt-1 max-h-72 w-full overflow-auto border border-ink bg-white text-ink shadow-lg">
              {hits.map((h, i) => (
                <li
                  key={h.noc}
                  id={`occ-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => { e.preventDefault(); choose(h); }}
                  className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm ${i === active ? 'bg-[#E5E3DD]' : ''}`}
                >
                  <span>{fa ? h.fa : h.en}{fa && h.curated ? <span className="text-[#555451]"> · <Ltr>{h.en}</Ltr></span> : null}</span>
                  <span className="shrink-0 text-xs text-[#555451]"><Ltr>NOC {h.noc}</Ltr></span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="exp" className="mb-1.5 block text-sm font-bold">{t.experience}</label>
          <select id="exp" value={experience} onChange={(e) => setExperience(e.target.value)} className={FIELD}>
            {Object.entries(t.expOptions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="clb" className="mb-1.5 block text-sm font-bold">{t.clb}</label>
          <select id="clb" value={clb} onChange={(e) => setClb(Number(e.target.value))} className={FIELD}>
            {[4, 5, 6, 7, 8, 9, 10].map((v) => <option key={v} value={v}>CLB {v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="prov" className="mb-1.5 block text-sm font-bold">{t.province}</label>
          <select id="prov" value={province} onChange={(e) => setProvince(e.target.value)} className={FIELD}>
            <option value="">{t.anyProvince}</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{t.provinces[p]}</option>)}
          </select>
        </div>
        <button type="submit" className={`${ACID} h-12 border-0`}>{t.search}</button>
        {formError && <p role="alert" className="text-sm text-acid md:col-span-5">{formError}</p>}
        <p className="text-xs text-[#b9b7b1] md:col-span-5"><a href={t.clbLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.clbHint}</a></p>
      </form>

      {/* Results */}
      <div ref={resultsRef} tabIndex={-1} className="mt-6 outline-none" aria-busy={state === 'loading'}>
        <p className="sr-only" aria-live="polite">
          {state === 'loading' ? t.loading : result ? t.count(result.total, (result.page - 1) * 20 + 1, (result.page - 1) * 20 + result.items.length) : ''}
        </p>
        {state === 'error' && <p role="alert" className="border border-ink bg-white px-4 py-3">{t.error}</p>}
        {state === 'limited' && <p role="alert" className="border border-ink bg-white px-4 py-3">{t.rateLimited(retry)}</p>}
        {state === 'loading' && !result && <p className="py-8 text-[#555451]">{t.loading}</p>}

        {result && (
          <>
            <SummaryStrip lang={lang} check={result.check} total={result.total} coreTotal={result.coreTotal} clb={clb} />
            <p className="mt-4 border-y border-ink bg-white px-4 py-3 text-sm leading-relaxed">{t.resultsNote} {t.unsolicited}</p>
            {result.items.length === 0 ? (
              <p className="py-10">{t.empty}</p>
            ) : (
              <>
                <p className="py-3 text-sm text-[#555451]">
                  {t.count(result.total, (result.page - 1) * 20 + 1, (result.page - 1) * 20 + result.items.length)}
                  {result.capped ? ` · ${t.capped}` : ''}
                </p>
                <ol className={`list-none border-t border-ink p-0 transition-opacity ${state === 'loading' ? 'opacity-50' : ''}`}>
                  {result.items.map((i) => (
                    <li key={i.id} className="grid gap-3 border-b border-[#d5d2c8] py-4 md:grid-cols-[minmax(0,1fr)_400px] md:items-start md:gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-2 text-xs font-bold">
                          <span aria-hidden className={`h-3 w-3 ${i.tier === 'core' ? 'bg-ink' : 'border-2 border-ink'}`} />
                          {i.tier === 'core' ? t.tierCore : t.tierRelated}
                        </span>
                        <strong className="text-[15px]"><Ltr>{i.name}</Ltr></strong>
                        <span className="text-sm text-[#555451]">
                          <Ltr>{i.businessType}</Ltr> · {cname(i.community)}{fa ? '،' : ','} {t.provinces[i.province] ?? i.province}
                          {i.communityPostings > 0 && <> · {t.postedHere(i.communityPostings)}</>}
                        </span>
                        {i.closedNote && <span className="text-sm font-bold">{t.closed[i.closedNote]}</span>}
                        <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start text-sm underline underline-offset-2">{t.onList(listDate(i.listAsOf))}</a>
                      </div>
                      <div>
                        {i.contact ? (
                          <div className="flex flex-col gap-1 border border-ink bg-white px-4 py-3 text-sm">
                            {i.contact.website && <span>{t.website}: <a href={i.contact.website} target="_blank" rel="noopener noreferrer nofollow" className="underline"><Ltr>{i.contact.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</Ltr></a></span>}
                            {i.contact.phone && <span>{t.phone}: <a href={`tel:${i.contact.phone.replace(/[^\d+]/g, '')}`} className="underline"><Ltr>{i.contact.phone}</Ltr></a></span>}
                            {i.contact.emails.map((e) => <span key={e}>{t.email}: <Ltr>{e}</Ltr></span>)}
                            <span className="text-xs text-[#555451]">{t.source[i.contact.source] ?? i.contact.source}</span>
                            <span className="text-xs leading-relaxed text-[#555451]">{t.contactNote}</span>
                            {reported[i.id] ? <span className="text-xs">{t.reported}</span> : (
                              <button type="button" onClick={() => report(i.id, 'wrong')} className="inline-flex min-h-11 items-center self-start text-xs underline">{t.reportWrong}</button>
                            )}
                          </div>
                        ) : i.hasContact ? (
                          <div className="flex flex-wrap items-center justify-between gap-3 border border-dashed border-[#8a8883] px-4 py-3">
                            <span aria-hidden className="flex flex-col gap-1.5"><span className="block h-2.5 w-40 bg-[#d5d2c8]" /><span className="block h-2.5 w-52 bg-[#d5d2c8]" /></span>
                            {!me ? (
                              <button type="button" className={DARK} onClick={() => setPanel('signin')}>{t.signInToReveal}</button>
                            ) : left > 0 ? (
                              <button type="button" className={ACID} onClick={() => revealRow(i.id)}>{t.showContact}</button>
                            ) : (
                              <button type="button" className={LIGHT} onClick={() => setPanel('steps')}>{t.locked}</button>
                            )}
                            {revealError[i.id] && <span role="alert" className="w-full text-xs">{revealError[i.id]}</span>}
                          </div>
                        ) : (
                          <p className="border border-[#d5d2c8] px-4 py-3 text-sm text-[#555451]">{t.noContact}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
                <nav aria-label={t.pageOf(result.page, result.pages)} className="flex flex-wrap items-center justify-between gap-3 border-t border-ink pt-4 text-sm">
                  <button type="button" className={LIGHT} disabled={page <= 1 || state === 'loading'} onClick={() => goPage(page - 1)}>{t.prev}</button>
                  <span>{t.pageOf(result.page, result.pages)}</span>
                  <button type="button" className={LIGHT} disabled={page >= result.pages || state === 'loading'} onClick={() => goPage(page + 1)}>{t.next}</button>
                </nav>
              </>
            )}
          </>
        )}
      </div>

      <aside className="mt-12 grid gap-4 border-t border-ink pt-6 text-sm md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-bold">{t.sourcesTitle}</h2>
          <p className={`mt-2 max-w-[75ch] ${fa ? 'leading-[1.9]' : 'leading-relaxed'}`}>{t.sources}</p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <a href={t.reportUrl} className="underline underline-offset-2">{t.report}</a>
          <a href={`/${lang}/contact`} className="underline underline-offset-2">{t.removal}</a>
          {me && (
            <button
              type="button"
              className="inline-flex min-h-11 items-center underline underline-offset-2"
              onClick={async () => {
                if (!window.confirm(t.deleteConfirm)) return;
                await api('/api/finder/me', { method: 'DELETE' });
                setMe(null);
              }}
            >
              {t.deleteAccount}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function SummaryStrip({ lang, check, total, coreTotal, clb }: { lang: Lang; check: Check; total: number; coreTotal: number; clb: number }) {
  const t = COPY[lang];
  const p = check.postings;
  const cell = 'flex flex-col gap-1 border-ink p-3';
  return (
    <div className="grid border border-ink bg-white text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div className={`${cell} border-b lg:border-b-0 sm:border-e`}>
        <span className="text-[#555451]">{t.yourCode}</span>
        <strong className="text-[15px]">{lang === 'fa' ? <bdi dir="ltr">{check.name}</bdi> : check.name} · <bdi dir="ltr">NOC {check.noc}{check.teer != null ? ` · TEER ${check.teer}` : ''}</bdi></strong>
      </div>
      <div className={`${cell} border-b lg:border-b-0 lg:border-e`}>
        <span className="text-[#555451]">{t.related}</span>
        <strong className="text-[15px]">{t.tierSplit(coreTotal, total - coreTotal)}</strong>
      </div>
      <div className={`${cell} border-b sm:border-b-0 sm:border-e`}>
        <span className="text-[#555451]">{t.advertised}</span>
        <strong className="text-[15px]">{p ? t.postingsLine(p.postings, wage(p.median_wage_hr, lang)) : t.noPostings}</strong>
      </div>
      <div className={cell}>
        <span className="text-[#555451]">{t.language}</span>
        <strong className="text-[15px]">
          {check.clbNeeded != null ? <bdi dir="ltr">CLB {check.clbNeeded}</bdi> : '—'}
          {check.clbMeets != null && <> · {check.clbMeets ? t.clbOk : t.clbShort} (<bdi dir="ltr">CLB {clb}</bdi>)</>}
        </strong>
        {check.experienceMeets === false && <span className="text-xs">{t.expNote}</span>}
      </div>
    </div>
  );
}

function SignIn({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = COPY[lang];
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const { status, body } = await api('/api/finder/auth/start', { method: 'POST', body: JSON.stringify({ email, consent, marketingOptIn: marketing, locale: lang }) });
    if (status === 200) { setState('sent'); return; }
    setState('error');
    setErr(status === 429 ? t.rateLimited(body.retryAfter ?? 900) : t.error);
  };
  return (
    <section aria-labelledby="signin-h" className="mt-4 border border-ink bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 id="signin-h" className="text-lg font-bold">{t.signInTitle}</h2>
        <button type="button" className={LIGHT} onClick={onClose}>{t.close}</button>
      </div>
      {state === 'sent' ? (
        <p role="status" className="mt-3">{t.linkSent}</p>
      ) : (
        <form onSubmit={send} className="mt-3 grid max-w-xl gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-bold">{t.emailLabel}
            <input type="email" dir="ltr" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
          </label>
          <p className="text-sm leading-relaxed text-[#555451]">{t.privacy} <a href={`/${lang}/privacy`} className="underline">{t.privacyLink}</a></p>
          <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-5 w-5" /> {t.consent}</label>
          <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-5 w-5" /> {t.marketing}</label>
          <button type="submit" className={DARK} disabled={!consent || !email || state === 'sending'}>{t.sendLink}</button>
          {state === 'error' && <p role="alert" className="text-sm">{err}</p>}
        </form>
      )}
    </section>
  );
}

function Steps({ lang, me, profile, onMe, onClose }: { lang: Lang; me: Me; profile: { noc: string; experience: string; clb: number } | null; onMe: (m: Me) => void; onClose: () => void }) {
  const t = COPY[lang];
  const [msg, setMsg] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [guideOpened, setGuideOpened] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true);
    const { status, body } = await api<{ me: Me }>('/api/finder/steps', { method: 'POST', body: JSON.stringify(payload) });
    setBusy(false);
    if (status === 200 && body.me) { onMe(body.me); setMsg(''); setQuizOpen(false); return; }
    setMsg(body.error === 'quiz_wrong' ? t.quizWrong : body.error === 'profile' ? t.pickOccupation : t.error);
  };

  return (
    <section aria-labelledby="steps-h" className="mt-4 border border-ink bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="steps-h" className="text-lg font-bold">{t.stepsTitle}</h2>
          <p className="mt-1 max-w-[70ch] text-sm text-[#555451]">{t.stepsLead}</p>
        </div>
        <button type="button" className={LIGHT} onClick={onClose}>{t.close}</button>
      </div>
      <ol className="mt-4 list-none border-t border-ink p-0">
        {STEPS.map((s, idx) => {
          const done = me.steps.includes(s);
          const current = me.next === s;
          return (
            <li key={s} className={`flex flex-wrap items-center gap-3 border-b border-[#d5d2c8] py-3 ${current ? 'bg-[#F2F0E9] px-2' : ''}`}>
              <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center font-bold ${done ? 'bg-ink text-acid' : current ? 'border-2 border-ink' : 'border-2 border-dashed border-[#8a8883] text-[#555451]'}`}>
                {done ? '✓' : idx + 1}
              </span>
              <span className="flex-grow text-sm">
                <strong>{t.steps[s]}</strong>
                <span className="sr-only">{done ? ` · ${t.done}` : ''}</span>
              </span>
              {!done && current && s === 'profile' && (
                <button type="button" className={ACID} disabled={busy || !profile} onClick={() => profile && post({ step: 'profile', ...profile })}>{profile ? t.saveProfile : t.pickOccupation}</button>
              )}
              {!done && current && s === 'guide' && (
                <span className="flex flex-wrap gap-2">
                  <a href={t.guideUrl} target="_blank" rel="noopener noreferrer" className={LIGHT} onClick={() => setGuideOpened(true)}>{t.openGuide}</a>
                  <button type="button" className={ACID} disabled={busy || !guideOpened} onClick={() => post({ step: 'guide' })}>{t.guideDone}</button>
                </span>
              )}
              {!done && current && s === 'quiz' && !quizOpen && <button type="button" className={ACID} onClick={() => setQuizOpen(true)}>{t.startQuiz}</button>}
              {!done && current && s === 'pledge' && (
                <span className="flex w-full flex-col gap-2">
                  <span className="text-sm">{t.pledgeText}</span>
                  <button type="button" className={`${ACID} self-start`} disabled={busy} onClick={() => post({ step: 'pledge', agree: true })}>{t.agree}</button>
                </span>
              )}
              {!done && !current && <span className="text-xs text-[#555451]">{t.later}</span>}
              {s === 'quiz' && quizOpen && current && (
                <form className="flex w-full flex-col gap-4" onSubmit={(e) => { e.preventDefault(); post({ step: 'quiz', answers }); }}>
                  {t.quiz.map((q) => (
                    <fieldset key={q.id} className="m-0 border-0 p-0">
                      <legend className="mb-2 text-sm font-bold">{q.q}</legend>
                      {q.options.map(([id, label]) => (
                        <label key={id} className="flex min-h-11 items-center gap-3 text-sm">
                          <input type="radio" name={q.id} value={id} checked={answers[q.id] === id} onChange={() => setAnswers((a) => ({ ...a, [q.id]: id }))} className="h-5 w-5" />
                          {label}
                        </label>
                      ))}
                    </fieldset>
                  ))}
                  <button type="submit" className={`${DARK} self-start`} disabled={busy || Object.keys(answers).length < 3}>{t.submit}</button>
                </form>
              )}
            </li>
          );
        })}
      </ol>
      {msg && <p role="alert" className="mt-3 text-sm">{msg}</p>}
    </section>
  );
}
