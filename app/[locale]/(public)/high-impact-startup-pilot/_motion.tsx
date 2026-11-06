'use client';

// ============================================================================
// app/[locale]/(public)/high-impact-startup-pilot/_motion.tsx
// The moving parts of the pilot page. Same grammar as components/fa/motion:
// one decelerating curve, short, once, and everything still under reduced
// motion. The content never depends on an animation having run: every piece
// renders its final text on the server and only the entrance is animated.
//
//   Stamp       the status stamp pressed onto the hero
//   RiseWords   a line of text rising into a mask, word by word
//   Count       a numeral counting up to its value when it scrolls into view
//   FileTable   the dossier: rows stagger in, blank lines draw themselves,
//               "not published" is stamped after the line; a filter lets the
//               reader keep only what IRCC has stated, or only the blanks
//   TimelineDraw the rail draws left to right and the dates land on it
//   Stagger     a list whose items arrive one after another
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { toPersianDigits } from '@/lib/fa/format';

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Stamp ───────────────────────────────────────────────────────────────────

export function Stamp({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 1.6, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: -2 }}
      transition={{ duration: 0.45, delay: 0.9, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

// ─── RiseWords ───────────────────────────────────────────────────────────────

export function RiseWords({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-5% 0px' }}
            transition={{ duration: 0.7, delay: delay + Math.min(i * 0.035, 0.5), ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      )).flatMap((el, i) => (i < words.length - 1 ? [el, ' '] : [el]))}
    </span>
  );
}

// ─── Count ───────────────────────────────────────────────────────────────────

export function Count({ to, className = '', digits = 'latin' }: { to: number; className?: string; digits?: 'latin' | 'fa' }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [n, setN] = useState(to);
  useEffect(() => {
    if (reduced || !inView) return;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);
  return <span ref={ref} className={className}>{digits === 'fa' ? toPersianDigits(n) : n}</span>;
}

// ─── FileTable ───────────────────────────────────────────────────────────────

export type Cell = { kind: 'filled'; text: string; href?: string } | { kind: 'reported'; text: string; href?: string } | { kind: 'blank' };
export type FileRow = { field: string; old: Cell; pilot: Cell };

type Filter = 'all' | 'official' | 'blank';

/** Every string the table and the timeline show. English by default; the Persian twin passes its own. */
export type MotionLabels = {
  notPublished: string;
  reported: string;
  filters: { all: string; official: string; blank: string };
  field: string;
  paused: string;
  announced: string;
  caption: string;
  empty: string;
  source: string;
  ours: string;
};

export const EN_LABELS: MotionLabels = {
  notPublished: 'not published',
  reported: '· reported',
  filters: { all: 'Every field', official: 'Only what IRCC has stated', blank: 'Only the blanks' },
  field: 'Field',
  paused: 'Paused',
  announced: 'Announced',
  caption: 'The paused Canada Start-up Visa and the announced High Impact Start-up Pilot compared field by field; a dotted line means IRCC has published nothing',
  empty: 'Nothing in this view.',
  source: 'Source',
  ours: 'Our estimate',
};

/** Small-caps labels are Latin only: no letter-spacing or uppercase on Arabic script. */
const tag = (rtl: boolean) => (rtl ? 'font-vazir text-[11px] font-bold' : 'font-sans text-[11px] font-bold uppercase tracking-[0.16em]');
const tagSm = (rtl: boolean) => (rtl ? 'font-vazir text-[10px] font-bold' : 'font-sans text-[10px] font-bold uppercase tracking-[0.16em]');
const serif = (rtl: boolean) => (rtl ? 'font-estedad font-black' : 'font-serif');
const sans = (rtl: boolean) => (rtl ? 'font-vazir' : 'font-sans');

function BlankLine({ delay = 0, note, rtl = false }: { delay?: number; note: string; rtl?: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <span className="flex items-baseline gap-3">
        <span aria-hidden="true" className="h-px grow translate-y-[-0.35em] border-b border-dotted border-[#1a1a1a]/50" />
        <span className={`shrink-0 text-[#B01C12] ${tag(rtl)}`}>{note}</span>
      </span>
    );
  }
  return (
    <span className="flex items-baseline gap-3">
      <motion.span
        aria-hidden="true"
        className={`h-px grow translate-y-[-0.35em] border-b border-dotted border-[#1a1a1a]/50 ${rtl ? 'origin-right' : 'origin-left'}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.8, delay, ease: EASE }}
      />
      <motion.span
        className={`shrink-0 text-[#B01C12] ${tag(rtl)}`}
        initial={{ opacity: 0, scale: 1.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.3, delay: delay + 0.7, ease: EASE }}
      >
        {note}
      </motion.span>
    </span>
  );
}

function Reported({ children, note, rtl = false }: { children: React.ReactNode; note: string; rtl?: boolean }) {
  return (
    <mark className="bg-[#CCFF00] px-1 py-0.5 text-[#1a1a1a] [box-decoration-break:clone]">
      {children} <span className={tagSm(rtl)}>{note}</span>
    </mark>
  );
}

function FileCell({ cell, delay, labels, rtl }: { cell: Cell; delay: number; labels: MotionLabels; rtl: boolean }) {
  if (cell.kind === 'blank') return <BlankLine delay={delay} note={labels.notPublished} rtl={rtl} />;
  const body = cell.kind === 'reported' ? <Reported note={labels.reported} rtl={rtl}>{cell.text}</Reported> : <span>{cell.text}</span>;
  return (
    <span className="block leading-relaxed">
      {body}
      {cell.href && (
        <>
          {' '}
          <a href={cell.href} target="_blank" rel="noopener noreferrer" aria-label={labels.source} className="inline-flex align-middle text-[#B01C12] hover:text-[#D52B1E]">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </>
      )}
    </span>
  );
}

export function FileTable({ rows, oldTitle, pilotTitle, labels = EN_LABELS, rtl = false }: { rows: FileRow[]; oldTitle: string; pilotTitle: string; labels?: MotionLabels; rtl?: boolean }) {
  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: labels.filters.all },
    { key: 'official', label: labels.filters.official },
    { key: 'blank', label: labels.filters.blank },
  ];
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const shown = rows.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'official') return r.pilot.kind === 'filled';
    return r.pilot.kind === 'blank';
  });

  return (
    <div>
      <div role="group" aria-label={labels.filters.all} className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.key)}
              className={`relative rounded-full border px-4 py-2 text-xs font-bold transition-colors ${rtl ? 'font-vazir' : 'font-sans uppercase tracking-[0.14em]'} ${
                on ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#1a1a1a]/30 text-[#1a1a1a] hover:border-[#1a1a1a]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-x-auto border border-[#1a1a1a] bg-white">
        <table className={`w-full min-w-[720px] border-collapse text-start text-[15px] ${sans(rtl)}`}>
          <caption className="sr-only">{labels.caption}</caption>
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th scope="col" className={`w-[22%] px-5 py-4 text-[#1a1a1a]/60 ${tag(rtl)}`}>{labels.field}</th>
              <th scope="col" className="w-[39%] border-s border-[#1a1a1a]/15 px-5 py-4">
                <span className={`block text-2xl leading-tight ${serif(rtl)}`}>{oldTitle}</span>
                <span className={`mt-1 block text-[#B01C12] ${tag(rtl)}`}>{labels.paused}</span>
              </th>
              <th scope="col" className="w-[39%] border-s border-[#1a1a1a]/15 px-5 py-4">
                <span className={`block text-2xl leading-tight ${serif(rtl)}`}>{pilotTitle}</span>
                <span className={`mt-1 block text-[#B01C12] ${tag(rtl)}`}>{labels.announced}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {shown.map((r, i) => (
                <motion.tr
                  key={r.field}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, delay: filter === 'all' ? Math.min(i * 0.05, 0.4) : 0, ease: EASE }}
                  className="border-b border-[#1a1a1a]/10 align-baseline last:border-0"
                >
                  <th scope="row" className="px-5 py-5 font-bold">{r.field}</th>
                  <td className="border-s border-[#1a1a1a]/15 px-5 py-5"><FileCell cell={r.old} delay={i * 0.06} labels={labels} rtl={rtl} /></td>
                  <td className="border-s border-[#1a1a1a]/15 px-5 py-5"><FileCell cell={r.pilot} delay={i * 0.06 + 0.1} labels={labels} rtl={rtl} /></td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {shown.length === 0 && (
              <tr>
                <td colSpan={3} className={`px-5 py-8 text-center text-sm text-[#1a1a1a]/60 ${sans(rtl)}`}>{labels.empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TimelineDraw ────────────────────────────────────────────────────────────

export type TimelineItem = { when: string; iso: string; ours?: boolean; what: string };

export function TimelineDraw({ items, labels = EN_LABELS, rtl = false }: { items: TimelineItem[]; labels?: MotionLabels; rtl?: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const go = reduced || inView;
  const n = items.length;

  return (
    <ol ref={ref} className="relative mt-12 ps-8 lg:grid lg:grid-cols-6 lg:gap-6 lg:ps-0">
      {/* The rail: vertical on small screens, horizontal from lg. Drawn once. */}
      <motion.span
        aria-hidden="true"
        className="absolute start-0 top-0 h-full w-[2px] origin-top bg-[#D52B1E] lg:hidden"
        initial={reduced ? false : { scaleY: 0 }}
        animate={go ? { scaleY: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.span
        aria-hidden="true"
        className={`absolute start-0 top-[9px] hidden h-[2px] w-full bg-[#D52B1E] lg:block ${rtl ? 'origin-right' : 'origin-left'}`}
        initial={reduced ? false : { scaleX: 0 }}
        animate={go ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {items.map((t, i) => {
        const d = reduced ? 0 : 0.25 + (i / Math.max(1, n - 1)) * 1.1;
        return (
          <li key={t.when} className="relative pb-9 last:pb-0 lg:pb-0 lg:pt-10">
            <motion.span
              className={`absolute -start-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-[#D52B1E] lg:start-0 lg:top-0.5 lg:h-[18px] lg:w-[18px] ${t.ours ? 'border-dashed bg-white' : 'bg-[#D52B1E]'}`}
              aria-hidden="true"
              initial={reduced ? false : { scale: 0 }}
              animate={go ? { scale: 1 } : undefined}
              transition={{ duration: 0.35, delay: d, ease: EASE }}
            />
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={go ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: d + 0.1, ease: EASE }}
            >
              <time dateTime={t.iso} className={`block text-2xl leading-tight lg:text-[1.65rem] ${serif(rtl)} ${t.ours ? 'text-[#B01C12]' : ''}`}>{t.when}</time>
              {t.ours && <span className={`mt-1 block text-[#B01C12] ${tag(rtl)}`}>{labels.ours}</span>}
              <p className={`mt-3 text-[14px] leading-relaxed text-[#1a1a1a]/75 ${sans(rtl)} ${rtl ? 'leading-[1.9]' : ''}`}>{t.what}</p>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Stagger ─────────────────────────────────────────────────────────────────

export function Stagger({ items, className = '', itemClassName = '', as = 'div', step = 0.08 }: { items: React.ReactNode[]; className?: string; itemClassName?: string; as?: 'div' | 'ol' | 'ul'; step?: number }) {
  const reduced = useReducedMotion();
  const Tag = as;
  const ItemTag = as === 'div' ? 'div' : 'li';
  if (reduced) {
    return (
      <Tag className={className}>
        {items.map((c, i) => React.createElement(ItemTag, { key: i, className: itemClassName }, c))}
      </Tag>
    );
  }
  const Item = as === 'div' ? motion.div : motion.li;
  return (
    <Tag className={className}>
      {items.map((c, i) => (
        <Item
          key={i}
          className={itemClassName}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6, delay: i * step, ease: EASE }}
        >
          {c}
        </Item>
      ))}
    </Tag>
  );
}
