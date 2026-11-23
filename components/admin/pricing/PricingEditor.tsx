'use client';

// ============================================================================
// components/admin/pricing/PricingEditor.tsx
// The /en/admin/pricing form. Edits the whole pricing document (route groups
// plus the page copy in English and Persian) and saves it in one server
// action. Lists are one item per line. Anything containing [[TBD]] is
// highlighted here and is never shown on the live site; delete the marker to
// publish that text.
// ============================================================================
import React, { useMemo, useState, useTransition } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { savePricing, resetPricing } from '@/app/actions/pricingActions';
import { TBD, type PricingCopy, type PricingDoc, type PricingGroup, type PricingLocale } from '@/lib/pricing/types';

type Path = (string | number)[];

function setIn<T>(root: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const clone: any = Array.isArray(root) ? [...(root as unknown[])] : { ...(root as object) };
  clone[head] = setIn((root as any)?.[head], rest, value);
  return clone;
}

function countTbd(v: unknown): number {
  if (typeof v === 'string') return v.includes(TBD) ? 1 : 0;
  if (Array.isArray(v)) return v.reduce((n, x) => n + countTbd(x), 0);
  if (v && typeof v === 'object') return Object.values(v).reduce((n: number, x) => n + countTbd(x), 0);
  return 0;
}

const input =
  'w-full rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 font-sans text-sm text-[#1a1a1a] focus:border-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#CCFF00]';
const label = 'mb-1 block font-sans text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/60';

function tbdClass(v: string): string {
  return v.includes(TBD) ? ' bg-amber-50 border-amber-400' : '';
}

function Field({ name, value, onChange, dir, multiline, hint }: { name: string; value: string; onChange: (v: string) => void; dir?: 'rtl' | 'ltr'; multiline?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className={label}>{name}</span>
      {multiline ? (
        <textarea dir={dir} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={input + tbdClass(value)} />
      ) : (
        <input dir={dir} value={value} onChange={(e) => onChange(e.target.value)} className={input + tbdClass(value)} />
      )}
      {hint && <span className="mt-1 block font-sans text-xs text-[#1a1a1a]/50">{hint}</span>}
    </label>
  );
}

function Lines({ name, value, onChange, dir }: { name: string; value: string[]; onChange: (v: string[]) => void; dir?: 'rtl' | 'ltr' }) {
  // Keep the raw text while typing so blank lines are not swallowed mid-edit.
  const [raw, setRaw] = useState(value.join('\n'));
  return (
    <label className="block">
      <span className={label}>
        {name} <span className="normal-case tracking-normal text-[#1a1a1a]/40">(one per line)</span>
      </span>
      <textarea
        dir={dir}
        rows={Math.max(3, value.length + 1)}
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean));
        }}
        className={input + tbdClass(raw)}
      />
    </label>
  );
}

function Rows<T extends Record<string, string>>({
  title,
  rows,
  fields,
  onChange,
  dir,
}: {
  title: string;
  rows: T[];
  fields: { key: keyof T & string; name: string; multiline?: boolean }[];
  onChange: (rows: T[]) => void;
  dir: 'rtl' | 'ltr';
}) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, ''])) as T;
  return (
    <div>
      <p className={label}>{title}</p>
      <ol className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="rounded-lg border border-[#1a1a1a]/10 bg-[#F2F0E9]/50 p-3">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div className="grid gap-2">
                {fields.map((f) => (
                  <Field key={f.key} name={f.name} dir={dir} multiline={f.multiline} value={r[f.key]} onChange={(v) => onChange(rows.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)))} />
                ))}
              </div>
              <div className="flex gap-1 md:flex-col">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onChange(rows.map((x, j) => (j === i - 1 ? rows[i] : j === i ? rows[i - 1] : x)))} className="rounded border border-[#1a1a1a]/15 px-2 py-1 text-xs disabled:opacity-30">
                  ↑
                </button>
                <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => onChange(rows.map((x, j) => (j === i + 1 ? rows[i] : j === i ? rows[i + 1] : x)))} className="rounded border border-[#1a1a1a]/15 px-2 py-1 text-xs disabled:opacity-30">
                  ↓
                </button>
                <button type="button" aria-label="Remove" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" onClick={() => onChange([...rows, blank])} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#1a1a1a]/15 px-3 py-1.5 font-sans text-xs font-bold hover:bg-white">
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}

const STATUS_HELP: Record<PricingGroup['status'], string> = {
  active: 'Shown with its price (if set), lists and the readiness CTA.',
  soon: 'Shown without any number, with a “contact us” button.',
  hidden: 'Not shown anywhere.',
};

function GroupEditor({ g, i, set }: { g: PricingGroup; i: number; set: (path: Path, v: unknown) => void }) {
  const p = (...rest: Path): Path => ['groups', i, ...rest];
  const tbd = countTbd(g);
  return (
    <details className="group rounded-2xl border border-[#1a1a1a]/10 bg-white shadow-sm" open={i === 0}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="font-serif text-xl text-[#1a1a1a]">{g.title.en || g.key}</p>
          <p className="font-sans text-xs text-[#1a1a1a]/50">
            {g.key} · {g.status}
            {g.startingFrom ? ` · from ${g.currency} ${g.startingFrom.toLocaleString('en-CA')}` : ' · no price set'}
            {g.requiresLegalReview && !g.legalReviewed ? ' · hidden on the live site until legal review' : ''}
          </p>
        </div>
        {tbd > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 font-sans text-xs font-bold text-amber-800">{tbd} TBD</span>}
      </summary>
      <div className="space-y-6 border-t border-[#1a1a1a]/10 p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className={label}>Status</span>
            <select value={g.status} onChange={(e) => set(p('status'), e.target.value)} className={input}>
              <option value="active">active</option>
              <option value="soon">soon</option>
              <option value="hidden">hidden</option>
            </select>
            <span className="mt-1 block font-sans text-xs text-[#1a1a1a]/50">{STATUS_HELP[g.status]}</span>
          </label>
          <label className="block">
            <span className={label}>Starting from</span>
            <input
              inputMode="numeric"
              value={g.startingFrom ?? ''}
              placeholder="empty = no number"
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, '');
                set(p('startingFrom'), digits ? Number(digits) : null);
              }}
              className={input + (g.startingFrom ? '' : ' bg-amber-50 border-amber-400')}
            />
            <span className="mt-1 block font-sans text-xs text-[#1a1a1a]/50">Whole number. Empty shows no price at all.</span>
          </label>
          <label className="block">
            <span className={label}>Currency</span>
            <select value={g.currency} onChange={(e) => set(p('currency'), e.target.value)} className={input}>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
            </select>
          </label>
          <Field name="CTA link (UTM added automatically)" value={g.ctaUrl} onChange={(v) => set(p('ctaUrl'), v)} dir="ltr" hint="Must start with https://" />
        </div>

        {g.requiresLegalReview && (
          <label className={`flex items-start gap-3 rounded-xl border p-4 font-sans text-sm ${g.legalReviewed ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
            <input type="checkbox" checked={g.legalReviewed} onChange={(e) => set(p('legalReviewed'), e.target.checked)} className="mt-1 h-4 w-4" />
            <span>
              <strong>A licensed lawyer has reviewed and approved this card’s text in both languages.</strong> While unticked, this card is not shown on the live site and has no schema.
            </span>
          </label>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {(['en', 'fa'] as PricingLocale[]).map((l) => {
            const dir = l === 'fa' ? 'rtl' : 'ltr';
            return (
              <div key={l} className="space-y-4">
                <p className="font-sans text-sm font-bold">{l === 'en' ? 'English' : 'Persian (فارسی)'}</p>
                <Field name="Title" dir={dir} value={g.title[l]} onChange={(v) => set(p('title', l), v)} />
                <Field name="Summary (one sentence)" dir={dir} multiline value={g.summary[l]} onChange={(v) => set(p('summary', l), v)} />
                <Lines key={`inc-${l}`} name="Includes" dir={dir} value={g.includes[l]} onChange={(v) => set(p('includes', l), v)} />
                <Lines key={`exc-${l}`} name="Excludes (billed separately)" dir={dir} value={g.excludes[l]} onChange={(v) => set(p('excludes', l), v)} />
                <Lines key={`ms-${l}`} name="Payment milestones" dir={dir} value={g.paymentMilestones[l]} onChange={(v) => set(p('paymentMilestones', l), v)} />
                <Field name="Approximate duration" dir={dir} value={g.duration[l]} onChange={(v) => set(p('duration', l), v)} />
                <Field name="Button label" dir={dir} value={g.ctaLabel[l]} onChange={(v) => set(p('ctaLabel', l), v)} />
                <Field name="Photo description (alt text)" dir={dir} value={g.imageAlt[l]} onChange={(v) => set(p('imageAlt', l), v)} />
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-[#1a1a1a]/10 bg-white p-5 shadow-sm">
      <h3 className="font-serif text-xl text-[#1a1a1a]">{title}</h3>
      {children}
    </section>
  );
}

function CopyEditor({ c, l, set }: { c: PricingCopy; l: PricingLocale; set: (path: Path, v: unknown) => void }) {
  const dir = l === 'fa' ? 'rtl' : 'ltr';
  const p = (...rest: Path): Path => ['copy', l, ...rest];
  const F = (name: string, path: Path, value: string, multiline = false) => <Field name={name} dir={dir} multiline={multiline} value={value} onChange={(v) => set(p(...path), v)} />;
  return (
    <div className="space-y-6" dir={dir}>
      <Section title="1. Hero">
        {F('Eyebrow', ['hero', 'eyebrow'], c.hero.eyebrow)}
        {F('Headline', ['hero', 'title'], c.hero.title)}
        {F('Price-transparency sentence', ['hero', 'lede'], c.hero.lede, true)}
        {F('Button', ['hero', 'cta'], c.hero.cta)}
      </Section>
      <Section title="2. Price cards — heading">
        {F('Title', ['cards', 'title'], c.cards.title)}
        {F('Intro', ['cards', 'intro'], c.cards.intro, true)}
      </Section>
      <Section title="3. Comparison table">
        {F('Title', ['comparison', 'title'], c.comparison.title)}
        {F('Intro', ['comparison', 'intro'], c.comparison.intro, true)}
        <div className="grid gap-4 md:grid-cols-2">
          {F('Our column heading', ['comparison', 'usHeading'], c.comparison.usHeading)}
          {F('Other column heading', ['comparison', 'typicalHeading'], c.comparison.typicalHeading)}
        </div>
        <Rows
          title="Rows (a row with any [[TBD]] is hidden on the live site)"
          dir={dir}
          rows={c.comparison.rows}
          fields={[
            { key: 'label', name: 'Row' },
            { key: 'us', name: 'VisaRoads' },
            { key: 'typical', name: 'Typical consultant (general, name no firm)' },
          ]}
          onChange={(rows) => set(p('comparison', 'rows'), rows)}
        />
      </Section>
      <Section title="4. Extra costs">
        {F('Title', ['extras', 'title'], c.extras.title)}
        {F('Intro', ['extras', 'intro'], c.extras.intro, true)}
        <Rows title="Items" dir={dir} rows={c.extras.items} fields={[{ key: 'title', name: 'Title' }, { key: 'body', name: 'Text', multiline: true }]} onChange={(rows) => set(p('extras', 'items'), rows)} />
      </Section>
      <Section title="5. How payment works">
        {F('Title', ['payment', 'title'], c.payment.title)}
        {F('Intro', ['payment', 'intro'], c.payment.intro, true)}
        <Rows title="Steps" dir={dir} rows={c.payment.steps} fields={[{ key: 'title', name: 'Title' }, { key: 'body', name: 'Text', multiline: true }]} onChange={(rows) => set(p('payment', 'steps'), rows)} />
      </Section>
      <Section title="6. FAQ">
        {F('Title', ['faq', 'title'], c.faq.title)}
        <Rows title="Questions" dir={dir} rows={c.faq.items} fields={[{ key: 'q', name: 'Question' }, { key: 'a', name: 'Answer', multiline: true }]} onChange={(rows) => set(p('faq', 'items'), rows)} />
      </Section>
      <Section title="7. Final call">
        {F('Title', ['final', 'title'], c.final.title)}
        {F('Text', ['final', 'body'], c.final.body, true)}
        {F('Button', ['final', 'cta'], c.final.cta)}
        <div className="grid gap-4 md:grid-cols-2">
          {F('Partner question', ['final', 'partnerPrompt'], c.final.partnerPrompt)}
          {F('Partner link text', ['final', 'partnerLink'], c.final.partnerLink)}
        </div>
      </Section>
    </div>
  );
}

const TABS = [
  { id: 'groups', name: 'Prices & route groups' },
  { id: 'en', name: 'Page copy — English' },
  { id: 'fa', name: 'Page copy — Persian' },
] as const;

export default function PricingEditor({ initial, saved, updatedAt, updatedBy }: { initial: PricingDoc; saved: boolean; updatedAt: string | null; updatedBy: string | null }) {
  const [doc, setDoc] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [stored, setStored] = useState(saved);
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('groups');
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(saved ? null : { kind: 'error', text: 'Not saved yet: the live page shows the defaults. Save once to store them.' });
  const [pending, start] = useTransition();
  // Remount editors after a reset/save so line-list textareas pick up the new values.
  const [rev, setRev] = useState(0);

  const dirty = JSON.stringify(doc) !== baseline;
  const tbd = useMemo(() => countTbd(doc), [doc]);
  const set = (path: Path, v: unknown) => setDoc((d) => setIn(d, path, v));

  const apply = (res: Awaited<ReturnType<typeof savePricing>>, okText: string) => {
    if (res.success) {
      setDoc(res.doc);
      setBaseline(JSON.stringify(res.doc));
      setStored(true);
      setRev((r) => r + 1);
      setStatus({ kind: 'ok', text: okText });
    } else {
      setStatus({ kind: 'error', text: res.error });
    }
  };

  return (
    <div className="max-w-6xl space-y-6 pb-28">
      <div className="flex flex-wrap items-center gap-3 font-sans text-sm">
        <a href="/en/pricing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 hover:border-[#1a1a1a]">
          /en/pricing <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a href="/fa/pricing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 hover:border-[#1a1a1a]">
          /fa/pricing <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {updatedAt && (
          <span className="text-[#1a1a1a]/50">
            Last saved {new Date(updatedAt).toLocaleString('en-CA')}
            {updatedBy ? ` by ${updatedBy}` : ''}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-sans text-sm leading-relaxed text-amber-900">
        Anything that contains <code className="rounded bg-white px-1">{TBD}</code> is highlighted and is <strong>never shown on the live site</strong> (a list item, table row or question with it is left out). Delete the marker when the text is final. An empty price shows no number. Do not write “guarantee” or “immigration consulting”.
      </div>

      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 font-sans text-sm font-bold ${tab === t.id ? 'bg-[#1a1a1a] text-[#CCFF00]' : 'border border-[#1a1a1a]/15 bg-white text-[#1a1a1a]/70 hover:text-[#1a1a1a]'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div key={rev}>
        {tab === 'groups' && (
          <div className="space-y-4">
            {doc.groups.map((g, i) => (
              <GroupEditor key={g.key} g={g} i={i} set={set} />
            ))}
          </div>
        )}
        {tab === 'en' && <CopyEditor c={doc.copy.en} l="en" set={set} />}
        {tab === 'fa' && <CopyEditor c={doc.copy.fa} l="fa" set={set} />}
      </div>

      <div className="fixed bottom-0 left-64 right-0 z-30 border-t border-[#1a1a1a]/10 bg-[#F2F0E9]/95 px-8 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 font-sans text-sm">
          <button
            type="button"
            disabled={pending || (!dirty && stored)}
            onClick={() => start(async () => apply(await savePricing(JSON.stringify(doc)), 'Saved. /en/pricing and /fa/pricing now show this version.'))}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a1a] px-5 py-2.5 font-bold text-[#CCFF00] disabled:opacity-40"
          >
            <Save className="h-4 w-4" /> {pending ? 'Saving…' : 'Save and publish'}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (window.confirm('Reset every price and text on the pricing page to the defaults (all unknowns back to [[TBD]])?')) {
                start(async () => apply(await resetPricing(), 'Reset to the defaults and published.'));
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1a1a1a]/20 px-4 py-2.5 text-[#1a1a1a]/70 hover:text-[#1a1a1a]"
          >
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </button>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${tbd ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{tbd} TBD left</span>
          {dirty && <span className="text-xs text-[#1a1a1a]/60">Unsaved changes</span>}
          {status && (
            <span role="status" className={`inline-flex items-center gap-2 text-xs ${status.kind === 'ok' ? 'text-green-700' : 'text-amber-800'}`}>
              {status.kind === 'ok' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {status.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
