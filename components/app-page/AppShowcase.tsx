'use client';

// ============================================================================
// components/app-page/AppShowcase.tsx
// The /app page body: hero with a live phone, country marquee, counters,
// the two doors, a feature bento, a scroll story where the phone follows the
// reader, the trust rules, privacy and the closing call.
//
// Motion grammar follows components/fa/motion: decelerating ease, once per
// element, and everything off under prefers-reduced-motion.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, Check, Circle, Compass, Globe2, Lock, MessageCircle, Newspaper, Play, Scale, ShieldCheck, Home } from 'lucide-react';
import { Link } from '@/navigation';
import { appPageCopy, toFaDigits, type ScreenKey } from '@/content/app-page';
import TiltCard from '@/components/fa/motion/TiltCard';
import Phone, { type FundsFigure } from './Phone';

const EASE = [0.16, 1, 0.3, 1] as const;

export type ShowcaseFacts = {
  routes: number;
  countries: number;
  families: number;
  funds: FundsFigure;
};

type Props = { locale: string; facts: ShowcaseFacts };

const HERO_CYCLE: ScreenKey[] = ['start', 'assess', 'results', 'route', 'funds'];

export default function AppShowcase({ locale, facts }: Props) {
  const isFa = locale === 'fa';
  const c = appPageCopy(locale);
  const num = (n: number) => (isFa ? toFaDigits(n) : String(n));
  const T = {
    display: isFa ? 'font-estedad font-black' : 'font-serif',
    displaySoft: isFa ? 'font-estedad font-bold' : 'font-serif',
    body: isFa ? 'font-vazir' : 'font-sans',
    label: isFa ? 'font-vazir text-[13px] font-bold' : 'font-sans text-xs font-bold uppercase tracking-[0.18em]',
  };

  return (
    <div className={`w-full overflow-x-clip bg-[#F2F0E9] text-[#1a1a1a] ${T.body}`}>
      <Hero c={c} T={T} isFa={isFa} num={num} facts={facts} />
      <Marquee items={c.countries} T={T} />
      <Stats c={c} T={T} num={num} facts={facts} />
      <Doors c={c} T={T} />
      <Features c={c} T={T} isFa={isFa} num={num} facts={facts} />
      <Story c={c} T={T} isFa={isFa} num={num} facts={facts} />
      <Honest c={c} T={T} num={num} />
      <Privacy c={c} T={T} />
      <Final c={c} T={T} isFa={isFa} />
    </div>
  );
}

type Copy = ReturnType<typeof appPageCopy>;
type Typo = { display: string; displaySoft: string; body: string; label: string };

// ---------------------------------------------------------------- Hero

function Hero({ c, T, isFa, num, facts }: { c: Copy; T: Typo; isFa: boolean; num: (n: number) => string; facts: ShowcaseFacts }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [isFa ? 6 : -6, 0]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((x) => (x + 1) % HERO_CYCLE.length), 3200);
    return () => clearInterval(id);
  }, [reduced]);

  const words = [c.title[0], c.title[1]];

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-[#1a1a1a]/15">
      {/* Grid backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(26,26,26,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container relative mx-auto grid grid-cols-1 items-center gap-16 px-6 pb-24 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:pb-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#1a1a1a]/20 bg-[#F2F0E9]/80 px-4 py-2 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1a1a1a] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1a1a1a]" />
            </span>
            <span className={`${T.label} text-[#1a1a1a]/70`}>{c.eyebrow}</span>
          </motion.div>

          <h1 className={`${T.display} ${isFa ? 'text-[12vw] leading-[1.2] sm:text-6xl lg:text-[5.4rem]' : 'text-[15vw] leading-[0.88] tracking-tight sm:text-7xl lg:text-[7.2rem]'}`}>
            {words.map((w, wi) => (
              <span key={w} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${wi === 1 ? (isFa ? 'text-[#1a1a1a]/45' : 'italic text-[#1a1a1a]/45') : ''}`}
                  initial={reduced ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + wi * 0.12, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className={`mt-8 max-w-xl text-lg leading-relaxed text-[#1a1a1a]/75 md:text-xl ${isFa ? 'leading-9' : ''}`}
          >
            {c.lede}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <StoreBadge icon={<AppleMark />} store={c.appStore} soon={c.soon} />
            <StoreBadge icon={<Play className="h-4 w-4 fill-current" />} store={c.googlePlay} soon={c.soon} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <Link
              href={c.primaryCta.href as never}
              className={`group inline-flex items-center gap-3 rounded-full bg-[#CCFF00] px-6 py-3.5 text-[#1a1a1a] transition-transform duration-300 hover:-translate-y-0.5 ${T.label}`}
            >
              {c.primaryCta.label}
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isFa ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </Link>
            <a href={c.secondaryCta.href} className={`${T.label} underline decoration-[#1a1a1a]/30 underline-offset-8 transition-colors hover:decoration-[#1a1a1a]`}>
              {c.secondaryCta.label}
            </a>
          </motion.div>
        </div>

        {/* Phone */}
        <motion.div style={reduced ? undefined : { y: phoneY, rotate: phoneRotate }} className="relative mx-auto w-[min(78vw,330px)]">
          <Swoosh />
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 60, rotate: isFa ? 10 : -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          >
            <motion.div animate={reduced ? undefined : { y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <Phone screen={HERO_CYCLE[i]} copy={c.screens} funds={facts.funds} isFa={isFa} num={num} />
            </motion.div>
          </motion.div>

          <FloatChip className="-left-10 top-[18%] sm:-left-20" delay={0.9} T={T}>
            <span className="h-2 w-2 rounded-full bg-[#CCFF00] ring-2 ring-[#1a1a1a]" />
            {c.chips.match}
          </FloatChip>
          <FloatChip className="-right-8 top-[52%] sm:-right-16" delay={1.1} T={T} dark>
            <ShieldCheck className="h-3.5 w-3.5 text-[#CCFF00]" />
            {c.chips.source}
          </FloatChip>
          <FloatChip className="-left-6 bottom-[10%] sm:-left-14" delay={1.3} T={T}>
            <Globe2 className="h-3.5 w-3.5" />
            {c.chips.lang}
          </FloatChip>

          {/* Screen dots */}
          <div className="mt-8 flex justify-center gap-2" dir="ltr">
            {HERO_CYCLE.map((s, k) => (
              <button
                key={s}
                type="button"
                aria-label={s}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-8 bg-[#1a1a1a]' : 'w-1.5 bg-[#1a1a1a]/25 hover:bg-[#1a1a1a]/50'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
      <span className="sr-only">{num(facts.routes)}</span>
    </section>
  );
}

function StoreBadge({ icon, store, soon }: { icon: React.ReactNode; store: string; soon: string }) {
  return (
    <div className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-[#1a1a1a] px-5 py-3 text-[#F2F0E9]" aria-label={`${store} — ${soon}`}>
      <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#F2F0E9]/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      {icon}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] opacity-60">{soon}</span>
        <span className="text-[15px] font-bold">{store}</span>
      </span>
    </div>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 384 512" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function FloatChip({ children, className, delay, T, dark }: { children: React.ReactNode; className: string; delay: number; T: Typo; dark?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`absolute z-10 hidden sm:block ${className}`}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[12px] font-bold shadow-[0_12px_30px_-12px_rgba(26,26,26,0.45)] ${T.body} ${dark ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'border border-[#1a1a1a]/10 bg-[#F2F0E9] text-[#1a1a1a]'}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Swoosh() {
  const reduced = useReducedMotion();
  return (
    <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2">
      <motion.path
        d="M20 330 C 120 320, 220 220, 260 150 S 360 40, 390 30"
        fill="none"
        stroke="#CCFF00"
        strokeWidth="26"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
      />
    </svg>
  );
}

// ---------------------------------------------------------------- Marquee

function Marquee({ items, T }: { items: string[]; T: Typo }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-[#1a1a1a]/15 bg-[#1a1a1a] py-6 text-[#F2F0E9]" dir="ltr">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((name, j) => (
              <span key={`${k}-${j}`} className={`flex items-center gap-8 px-8 text-3xl md:text-4xl ${T.displaySoft}`}>
                {name}
                <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#CCFF00]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Stats

function Counter({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const ctrl = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => ctrl.stop();
  }, [inView, to, reduced]);
  return <span ref={ref}>{format(v)}</span>;
}

function Stats({ c, T, num, facts }: { c: Copy; T: Typo; num: (n: number) => string; facts: ShowcaseFacts }) {
  const items = [
    { n: facts.routes, l: c.stats.routes },
    { n: facts.countries, l: c.stats.countries },
    { n: facts.families, l: c.stats.families },
    { n: 5, l: c.stats.languages },
    { n: 10, l: c.stats.questions },
    { n: 0, l: c.stats.signup },
  ];
  return (
    <section className="border-b border-[#1a1a1a]/15">
      <div className="container mx-auto grid grid-cols-2 px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-12">
        {items.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.06} className="border-[#1a1a1a]/15 px-2 py-10 text-center [&:not(:last-child)]:border-e">
            <p className={`${T.display} text-6xl md:text-7xl`}>
              <Counter to={s.n} format={num} />
            </p>
            <p className={`mt-3 text-sm text-[#1a1a1a]/65`}>{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Doors

function Doors({ c, T }: { c: Copy; T: Typo }) {
  return (
    <section className="container mx-auto px-6 py-24 lg:px-12 lg:py-32">
      <SectionTitle T={T}>{c.doors.title}</SectionTitle>
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {c.doors.items.map((d, i) => (
          <Reveal key={d.title} delay={i * 0.12}>
            <TiltCard className={`h-full overflow-hidden rounded-[2rem] p-8 md:p-12 ${i === 1 ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'border border-[#1a1a1a]/15 bg-[#F2F0E9]'}`}>
              <div className="flex items-center justify-between">
                <span className={`${T.label} ${i === 1 ? 'text-[#CCFF00]' : 'text-[#1a1a1a]/55'}`}>{d.kicker}</span>
                <span className={`grid h-14 w-14 place-items-center rounded-full ${i === 1 ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'bg-[#1a1a1a] text-[#F2F0E9]'}`}>
                  {i === 0 ? <Compass className="h-6 w-6" /> : <Scale className="h-6 w-6" />}
                </span>
              </div>
              <h3 className={`${T.display} mt-12 text-5xl md:text-6xl`}>{d.title}</h3>
              <p className={`mt-5 max-w-md text-base leading-relaxed ${i === 1 ? 'text-[#F2F0E9]/70' : 'text-[#1a1a1a]/70'}`}>{d.body}</p>
              <ol className="mt-10 flex flex-wrap items-center gap-2">
                {d.steps.map((s, k) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={`rounded-full px-3.5 py-1.5 text-sm ${i === 1 ? 'bg-[#F2F0E9]/10' : 'bg-[#1a1a1a]/[0.06]'}`}>{s}</span>
                    {k < d.steps.length - 1 && <span className={`h-px w-5 ${i === 1 ? 'bg-[#CCFF00]' : 'bg-[#1a1a1a]/40'}`} />}
                  </li>
                ))}
              </ol>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Features

function Features({ c, T, isFa, num, facts }: { c: Copy; T: Typo; isFa: boolean; num: (n: number) => string; facts: ShowcaseFacts }) {
  const f = c.features;
  return (
    <section id="features" className="scroll-mt-28 border-t border-[#1a1a1a]/15 bg-[#E9E6DC]/60 py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle T={T}>{f.title}</SectionTitle>
          <p className="max-w-md text-[#1a1a1a]/70">{f.lede}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Match ring */}
          <Tile className="md:col-span-3 md:row-span-2" tone="ink" delay={0}>
            <MatchRing value={82} caption={f.match.caption} isFa={isFa} num={num} />
            <TileText T={T} title={f.match.title} body={f.match.body} dark />
          </Tile>

          {/* What to close first */}
          <Tile className="md:col-span-3" delay={0.08}>
            <TileText T={T} title={f.close.title} body={f.close.body} />
            <CloseList items={f.close.items} legend={f.close.legend} isFa={isFa} />
          </Tile>

          {/* Funds */}
          <Tile className="md:col-span-3" tone="acid" delay={0.12}>
            <TileText T={T} title={f.funds.title} body={f.funds.body} />
            <CurrencyFlip funds={facts.funds} label={f.funds.label} source={f.funds.source} />
          </Tile>

          <Tile className="md:col-span-2" delay={0.05}>
            <IconBadge><ShieldCheck className="h-5 w-5" /></IconBadge>
            <TileText T={T} title={f.sources.title} body={f.sources.body} />
          </Tile>

          <Tile className="md:col-span-2" tone="ink" delay={0.1}>
            <LanguageCycle hellos={f.languages.hellos} T={T} />
            <TileText T={T} title={f.languages.title} body={f.languages.body} dark />
          </Tile>

          <Tile className="md:col-span-2" delay={0.15}>
            <IconBadge><Newspaper className="h-5 w-5" /></IconBadge>
            <TileText T={T} title={f.news.title} body={f.news.body} />
          </Tile>

          <Tile className="md:col-span-3" delay={0.05}>
            <IconBadge><Home className="h-5 w-5" /></IconBadge>
            <TileText T={T} title={f.home.title} body={f.home.body} />
          </Tile>

          <Tile className="md:col-span-3" delay={0.1}>
            <IconBadge><MessageCircle className="h-5 w-5" /></IconBadge>
            <TileText T={T} title={f.mentor.title} body={f.mentor.body} />
          </Tile>
        </div>
      </div>
    </section>
  );
}

const TILE_TONE = {
  paper: 'border-[#1a1a1a]/10 bg-[#F2F0E9]',
  ink: 'border-transparent bg-[#1a1a1a] text-[#F2F0E9]',
  acid: 'border-transparent bg-[#CCFF00]',
} as const;

function Tile({ children, className, delay, tone = 'paper' }: { children: React.ReactNode; className?: string; delay: number; tone?: keyof typeof TILE_TONE }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={reduced ? undefined : { y: -4 }}
      className={`flex flex-col gap-8 rounded-[1.75rem] border p-7 md:p-9 ${TILE_TONE[tone]} ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}

function TileText({ T, title, body, dark }: { T: Typo; title: string; body: string; dark?: boolean }) {
  return (
    <div className="mt-auto">
      <h3 className={`${T.displaySoft} text-2xl md:text-3xl`}>{title}</h3>
      <p className={`mt-3 leading-relaxed ${dark ? 'text-[#F2F0E9]/65' : 'text-[#1a1a1a]/70'}`}>{body}</p>
    </div>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return <span className="grid h-12 w-12 place-items-center rounded-full bg-[#1a1a1a] text-[#CCFF00]">{children}</span>;
}

function MatchRing({ value, caption, isFa, num }: { value: number; caption: string; isFa: boolean; num: (n: number) => string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? value / 100 : 0);
  const smooth = useSpring(progress, { stiffness: 40, damping: 18 });
  const [shown, setShown] = useState(reduced ? value : 0);
  useEffect(() => {
    if (inView) progress.set(value / 100);
  }, [inView, value, progress]);
  useEffect(() => smooth.on('change', (v) => setShown(Math.round(v * 100))), [smooth]);

  return (
    <div className="relative mx-auto my-4 w-full max-w-[280px]">
      <svg ref={ref} viewBox="0 0 200 200" className="w-full -rotate-90">
        <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(242,240,233,0.12)" strokeWidth="14" />
        <motion.circle cx="100" cy="100" r="84" fill="none" stroke="#CCFF00" strokeWidth="14" strokeLinecap="round" style={{ pathLength: smooth }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-sans text-6xl font-bold text-[#CCFF00]" dir="ltr">{isFa ? `${num(shown)}٪` : `${shown}%`}</p>
          <p className="mt-1 text-sm text-[#F2F0E9]/60">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function CloseList({ items, legend, isFa }: { items: { label: string; state: 'met' | 'open' | 'judged' }[]; legend: Record<'met' | 'open' | 'judged', string>; isFa: boolean }) {
  const reduced = useReducedMotion();
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <motion.li
          key={it.label}
          initial={reduced ? false : { opacity: 0, x: isFa ? 16 : -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: EASE }}
          className="flex items-center justify-between rounded-xl border border-[#1a1a1a]/10 px-4 py-3"
        >
          <span className="flex items-center gap-3">
            {it.state === 'met' ? (
              <motion.span
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
                className="grid h-6 w-6 place-items-center rounded-full bg-[#1a1a1a] text-[#CCFF00]"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.span>
            ) : it.state === 'open' ? (
              <Circle className="h-6 w-6 text-[#1a1a1a]/40" strokeDasharray="3 3" />
            ) : (
              <Scale className="h-6 w-6 p-0.5 text-[#1a1a1a]/55" />
            )}
            <span className="text-[15px]">{it.label}</span>
          </span>
          <span className={`text-xs ${it.state === 'met' ? 'font-bold' : 'text-[#1a1a1a]/60'}`}>{legend[it.state]}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function CurrencyFlip({ funds, label, source }: { funds: FundsFigure; label: string; source: string }) {
  const reduced = useReducedMotion();
  const rows = [
    { cur: 'DKK', v: funds.amount },
    { cur: 'USD', v: funds.usd },
    { cur: 'EUR', v: funds.eur },
  ];
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setK((x) => (x + 1) % rows.length), 2200);
    return () => clearInterval(id);
  }, [reduced, rows.length]);
  return (
    <div className="rounded-2xl bg-[#1a1a1a] p-6 text-[#F2F0E9]">
      <p className="text-sm text-[#F2F0E9]/60">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4" dir="ltr">
        <div className="relative h-12 flex-1 overflow-hidden">
          {rows.map((r, idx) => (
            <motion.p
              key={r.cur}
              className="absolute inset-0 font-sans text-4xl font-bold md:text-5xl"
              initial={false}
              animate={{ y: idx === k ? '0%' : idx < k ? '-110%' : '110%', opacity: idx === k ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {r.v}
            </motion.p>
          ))}
        </div>
        <div className="flex gap-1.5">
          {rows.map((r, idx) => (
            <button
              key={r.cur}
              type="button"
              onClick={() => setK(idx)}
              className={`rounded-full px-3 py-1 font-sans text-xs font-bold transition-colors duration-300 ${idx === k ? 'bg-[#CCFF00] text-[#1a1a1a]' : 'bg-[#F2F0E9]/10 text-[#F2F0E9]/70'}`}
            >
              {r.cur}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-[#F2F0E9]/50" dir="ltr">{source} · {funds.checked}</p>
    </div>
  );
}

function LanguageCycle({ hellos, T }: { hellos: string[]; T: Typo }) {
  const reduced = useReducedMotion();
  const [k, setK] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setK((x) => (x + 1) % hellos.length), 1600);
    return () => clearInterval(id);
  }, [reduced, hellos.length]);
  return (
    <div className="relative h-20 overflow-hidden">
      {hellos.map((h, idx) => (
        <motion.p
          key={h}
          className={`absolute inset-0 text-6xl text-[#CCFF00] ${T.displaySoft}`}
          initial={false}
          animate={{ opacity: idx === k ? 1 : 0, y: idx === k ? 0 : 24, filter: idx === k ? 'blur(0px)' : 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {h}
        </motion.p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Scroll story

function Story({ c, T, isFa, num, facts }: { c: Copy; T: Typo; isFa: boolean; num: (n: number) => string; facts: ShowcaseFacts }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] });
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const n = c.story.steps.length;
  // One source of truth for the active step: how far the reader is through
  // the list. Per-step in-view flags race when the page jumps (anchor links,
  // fast scroll) and can leave the phone a step behind the text.
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n)))));

  return (
    <section className="bg-[#121417] py-24 text-[#F2F0E9] lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionTitle T={T} dark>{c.story.title}</SectionTitle>
        <div ref={ref} className="relative mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Sticky phone (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 mx-auto w-[300px]">
              <Phone screen={c.story.steps[active].screen} copy={c.screens} funds={facts.funds} isFa={isFa} num={num} />
            </div>
          </div>

          <div className="relative">
            <div aria-hidden className="absolute bottom-0 top-0 w-px bg-[#F2F0E9]/15 ltr:left-[19px] rtl:right-[19px]">
              <motion.div className="w-px origin-top bg-[#CCFF00]" style={{ height: '100%', scaleY: bar }} />
            </div>
            {c.story.steps.map((s, i) => (
              <StoryStep key={s.title} index={i} active={active === i} T={T} num={num}>
                <h3 className={`${T.displaySoft} text-3xl md:text-4xl`}>{s.title}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-[#F2F0E9]/65">{s.body}</p>
                {/* Mobile: the phone sits inline with its step */}
                <div className="mt-8 w-[240px] lg:hidden">
                  <Phone screen={s.screen} copy={c.screens} funds={facts.funds} isFa={isFa} num={num} />
                </div>
              </StoryStep>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryStep({ children, index, active, T, num }: { children: React.ReactNode; index: number; active: boolean; T: Typo; num: (n: number) => string }) {
  return (
    <div className="relative flex gap-8 py-10 lg:min-h-[70vh] lg:items-center">
      <span
        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-sans text-sm font-bold transition-all duration-500 ${active ? 'border-[#CCFF00] bg-[#CCFF00] text-[#1a1a1a] scale-110' : 'border-[#F2F0E9]/25 bg-[#121417] text-[#F2F0E9]/60'}`}
      >
        {num(index + 1)}
      </span>
      <div className={`transition-opacity duration-500 ${active ? 'opacity-100' : 'lg:opacity-40'} ${T.body}`}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------- Honest

function Honest({ c, T, num }: { c: Copy; T: Typo; num: (n: number) => string }) {
  return (
    <section className="container mx-auto px-6 py-24 lg:px-12 lg:py-32">
      <SectionTitle T={T}>{c.honest.title}</SectionTitle>
      <div className="mt-14 border-t border-[#1a1a1a]">
        {c.honest.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06}>
            <div className="group grid grid-cols-1 gap-4 border-b border-[#1a1a1a]/20 py-8 transition-colors duration-500 hover:bg-[#CCFF00] md:grid-cols-[80px_1fr_1fr] md:gap-10 md:px-4">
              <span className={`${T.display} text-4xl text-[#1a1a1a]/30 transition-colors group-hover:text-[#1a1a1a]`}>{num(0)}{num(i + 1)}</span>
              <h3 className={`${T.displaySoft} text-2xl md:text-3xl`}>{it.title}</h3>
              <p className="leading-relaxed text-[#1a1a1a]/70 group-hover:text-[#1a1a1a]">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Privacy

function Privacy({ c, T }: { c: Copy; T: Typo }) {
  const reduced = useReducedMotion();
  return (
    <section className="px-6 pb-24 lg:px-12 lg:pb-32">
      <div className="container relative mx-auto overflow-hidden rounded-[2.25rem] bg-[#1a1a1a] px-8 py-16 text-[#F2F0E9] md:px-16 md:py-20">
        <motion.div
          aria-hidden
          className="absolute -top-24 grid h-72 w-72 place-items-center rounded-full border border-[#CCFF00]/30 ltr:-right-24 rtl:-left-24"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <div className="h-52 w-52 rounded-full border border-dashed border-[#CCFF00]/40" />
        </motion.div>
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#CCFF00] text-[#1a1a1a]">
              <Lock className="h-7 w-7" />
            </span>
            <h2 className={`${T.display} mt-8 text-4xl md:text-6xl`}>{c.privacy.title}</h2>
            <p className="mt-5 max-w-lg text-lg text-[#F2F0E9]/65">{c.privacy.body}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {c.privacy.points.map((p, i) => (
              <motion.li
                key={p}
                initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                className="flex items-center gap-3 rounded-2xl border border-[#F2F0E9]/15 px-5 py-6"
              >
                <Check className="h-5 w-5 shrink-0 text-[#CCFF00]" strokeWidth={3} />
                <span className="font-bold">{p}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Final

function Final({ c, T, isFa }: { c: Copy; T: Typo; isFa: boolean }) {
  return (
    <section className="border-t border-[#1a1a1a]/15 px-6 py-24 text-center lg:px-12 lg:py-32">
      <Reveal>
        <h2 className={`${T.display} mx-auto max-w-4xl text-5xl md:text-7xl ${isFa ? 'leading-[1.3]' : 'leading-[0.95]'}`}>{c.final.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#1a1a1a]/70">{c.final.body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <StoreBadge icon={<AppleMark />} store={c.appStore} soon={c.soon} />
          <StoreBadge icon={<Play className="h-4 w-4 fill-current" />} store={c.googlePlay} soon={c.soon} />
          <Link
            href={c.primaryCta.href as never}
            className={`group inline-flex items-center gap-3 rounded-2xl bg-[#CCFF00] px-6 py-[1.05rem] text-[#1a1a1a] transition-transform duration-300 hover:-translate-y-0.5 ${T.label}`}
          >
            {c.primaryCta.label}
            <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isFa ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
        </div>
        <p className="mx-auto mt-14 max-w-2xl text-sm text-[#1a1a1a]/55">{c.who}</p>
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------- Shared

function SectionTitle({ children, T, dark }: { children: React.ReactNode; T: Typo; dark?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div>
      <motion.span
        aria-hidden
        className={`mb-6 block h-[3px] w-16 origin-left rtl:origin-right ${dark ? 'bg-[#CCFF00]' : 'bg-[#1a1a1a]'}`}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      <Reveal>
        <h2 className={`${T.display} text-5xl leading-[1.05] md:text-7xl`}>{children}</h2>
      </Reveal>
    </div>
  );
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
