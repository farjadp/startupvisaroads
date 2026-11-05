// ============================================================================
// Component: components/fa/Blocks.tsx
// The structural blocks a guide section can carry besides prose: a strip of
// key figures, a picture, a definition list, a choice between options, a
// timeline. Server components, no state. They read the route palette
// (--rd dark, --ra accent, --rs soft) and fall back to ink and paper, so the
// same block looks right in both Persian layouts.
//
// None of these shortens the text. They give a paragraph's numbers, lists
// and decisions a container the eye can scan before the paragraph is read.
// ============================================================================
import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@/navigation';
import type { FaChoice, FaFigure, FaKeyFact, FaTerm, FaTimeline } from '@/lib/fa/content';

export function KeyFacts({ facts }: { facts: FaKeyFact[] }) {
  return (
    <ul className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="اعداد کلیدی این بخش">
      {facts.map((f, i) => (
        <li key={i} className="rounded-2xl border border-[#1a1a1a]/12 bg-white px-4 py-4">
          <p className="font-estedad text-2xl font-black leading-none text-[var(--rd,#1a1a1a)] md:text-[1.7rem]">{f.value}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#1a1a1a]/60">{f.label}</p>
        </li>
      ))}
    </ul>
  );
}

export function FigureBlock({ figure }: { figure: FaFigure }) {
  const ratio = figure.ratio ?? 16 / 9;
  return (
    <figure className="my-7 max-w-[68ch]">
      <div className="relative w-full overflow-hidden rounded-2xl border border-[#1a1a1a]/12 bg-white" style={{ aspectRatio: String(ratio) }}>
        <Image src={figure.src} alt={figure.alt} fill sizes="(min-width: 1024px) 68ch, 100vw" className="object-contain" />
      </div>
      {figure.caption && <figcaption className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60">{figure.caption}</figcaption>}
    </figure>
  );
}

export function Terms({ terms }: { terms: FaTerm[] }) {
  return (
    <dl className="my-2 max-w-[68ch] divide-y divide-[#1a1a1a]/12 rounded-2xl border border-[#1a1a1a]/12 bg-white">
      {terms.map((t, i) => (
        <div key={i} className="grid gap-1 px-5 py-4 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-6">
          <dt className="font-estedad font-bold leading-snug text-[var(--rd,#1a1a1a)]">{t.term}</dt>
          <dd className="text-base leading-[1.9] text-[#1a1a1a]/80">{t.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function ChoiceCta({ cta }: { cta: NonNullable<FaChoice['options'][number]['cta']> }) {
  const ext = /^https?:\/\//.test(cta.href) || cta.href.startsWith('/en/');
  const cls = 'mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--ra-text,#1a1a1a)] hover:underline';
  const inner = (
    <>
      {cta.label}
      {/^https?:/.test(cta.href) ? <Send className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
    </>
  );
  return ext ? <a href={cta.href} className={cls}>{inner}</a> : <Link href={cta.href} className={cls}>{inner}</Link>;
}

export function Choice({ choice }: { choice: FaChoice }) {
  const n = choice.options.length;
  return (
    <section className="my-2 max-w-[68ch]" aria-label={choice.question ?? 'انتخاب'}>
      {choice.question && (
        <p className="mb-3 flex items-center gap-3 font-estedad text-lg font-bold">
          <span className="h-2 w-2 bg-[var(--ra,#CCFF00)] border border-[#1a1a1a]" aria-hidden />
          {choice.question}
        </p>
      )}
      <div className={`grid gap-3 ${n >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {choice.options.map((o, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-[#1a1a1a]/12 bg-white p-5">
            <p className="font-estedad text-lg font-black leading-snug text-[var(--rd,#1a1a1a)]">{o.title}</p>
            <p className="mt-2 flex-1 text-base leading-[1.9] text-[#1a1a1a]/80">{o.body}</p>
            {o.cta && <ChoiceCta cta={o.cta} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Timeline({ timeline }: { timeline: FaTimeline }) {
  return (
    <figure className="my-2 max-w-[68ch]">
      {timeline.caption && (
        <figcaption className="mb-3 flex items-center gap-3 text-sm font-bold text-[#1a1a1a]">
          <span className="h-2 w-2 bg-[var(--ra,#CCFF00)] border border-[#1a1a1a]" aria-hidden />
          {timeline.caption}
        </figcaption>
      )}
      <ol className="relative ms-3 border-s-2 border-[var(--rd,#1a1a1a)]/20">
        {timeline.items.map((it, i) => (
          <li key={i} className="relative ps-7 pb-6 last:pb-0">
            <span className="absolute -start-[7px] top-[0.55em] h-3 w-3 rounded-full border-2 border-[var(--rd,#1a1a1a)] bg-[var(--ra,#CCFF00)]" aria-hidden />
            <p className="font-estedad text-sm font-black text-[var(--rd,#1a1a1a)]">{it.when}</p>
            <p className="mt-0.5 text-base leading-[1.9] text-[#1a1a1a]/80">{it.what}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
