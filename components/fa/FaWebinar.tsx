'use client';

// ============================================================================
// Component: components/fa/FaWebinar.tsx
// The Persian meetup page («دورهمی آنلاین استارتاپ و استارتاپ ویزا»).
//
// Hero with a route map whose three nodes carry the start time in Tehran,
// Central Europe and Toronto; a live countdown; a clock per time zone plus the
// visitor's own; agenda beside a sticky registration form; and a rail of past
// meetups that open on YouTube. Every animation respects reduced motion.
//
// Times are formatted only after mount, so server and browser never disagree
// about ICU output or the visitor's zone.
// ============================================================================
import { useEffect, useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Clock, Play, Send, Youtube } from 'lucide-react';
import { registerWebinar } from '@/app/[locale]/(public)/webinar/actions';
import {
  webinar,
  WEBINAR_DATE,
  WEBINAR_MINUTES,
  MEETUP_ZONES,
  PAST_MEETUPS,
  PLAYLIST_URL,
} from '@/content/fa/webinar';
import { toPersianDigits } from '@/lib/fa/format';
import { trackLead } from '@/lib/analytics';

const EASE = [0.22, 1, 0.36, 1] as const;

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------
const START = WEBINAR_DATE ? new Date(WEBINAR_DATE) : null;
const END = START ? new Date(START.getTime() + WEBINAR_MINUTES * 60_000) : null;

const hm = (d: Date, timeZone?: string) =>
  new Intl.DateTimeFormat('fa-IR', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);

/** «چهارشنبه ۲۰ آبان» or, with the year, «چهارشنبه ۲۰ آبان ۱۴۰۵». Built from
 *  parts because ICU's own fa-IR pattern puts the year first with a Latin comma. */
function jalali(d: Date, timeZone: string | undefined, withYear: boolean) {
  const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { timeZone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? '';
  return [get('weekday'), get('day'), get('month'), withYear ? get('year') : ''].filter(Boolean).join(' ');
}
const dayLabel = (d: Date, timeZone?: string) => jalali(d, timeZone, false);
const fullDate = (d: Date, timeZone?: string) => jalali(d, timeZone, true);

type Phase = 'none' | 'upcoming' | 'live' | 'over';

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function phaseAt(now: number | null): Phase {
  if (!START || !END) return 'none';
  if (now === null || now < START.getTime()) return 'upcoming';
  return now < END.getTime() ? 'live' : 'over';
}

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Digit({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();
  const text = toPersianDigits(String(value).padStart(2, '0'));
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 md:h-20 w-16 md:w-24 overflow-hidden border border-[#F2F0E9]/15 bg-[#F2F0E9]/[0.04]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={text}
            initial={reduced ? false : { y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={reduced ? undefined : { y: '100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0 grid place-items-center font-estedad font-black text-3xl md:text-5xl tabular-nums"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[11px] text-[#F2F0E9]/50">{label}</span>
    </div>
  );
}

function Countdown({ now }: { now: number }) {
  if (!START) return null;
  const diff = Math.max(0, START.getTime() - now);
  const parts = [
    [Math.floor(diff / 864e5), webinar.when.countdown.days],
    [Math.floor((diff % 864e5) / 36e5), webinar.when.countdown.hours],
    [Math.floor((diff % 36e5) / 6e4), webinar.when.countdown.minutes],
    [Math.floor((diff % 6e4) / 1e3), webinar.when.countdown.seconds],
  ] as const;
  return (
    <div className="flex gap-3 md:gap-4" role="timer" aria-label="شمارش معکوس تا شروع دورهمی">
      {parts.map(([n, l]) => (
        <Digit key={l} value={n} label={l} />
      ))}
    </div>
  );
}

/**
 * Three cities on one arc: Toronto, Central Europe, Tehran, west to east.
 * Drawn left-to-right on purpose (it is a map), each node labelled with the
 * local start time once the browser has mounted.
 */
function RouteMap({ mounted }: { mounted: boolean }) {
  const reduced = useReducedMotion();
  const nodes = [
    { x: 70, y: 150, city: 'تورنتو', tz: 'America/Toronto' },
    { x: 300, y: 70, city: 'اروپا', tz: 'Europe/Berlin' },
    { x: 520, y: 135, city: 'تهران', tz: 'Asia/Tehran' },
  ];
  const arc = 'M70 150 C 150 40, 230 40, 300 70 S 450 60, 520 135';
  return (
    <svg viewBox="0 0 590 230" className="w-full h-auto [direction:ltr]" role="img" aria-label="تورنتو، اروپا و تهران روی یک مسیر، با ساعت شروع دورهمی در هر شهر">
      <motion.path
        d={arc}
        fill="none"
        stroke="#F2F0E9"
        strokeOpacity={0.18}
        strokeWidth={2}
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
      />
      <motion.path
        d={arc}
        fill="none"
        stroke="#CCFF00"
        strokeWidth={2}
        strokeDasharray="6 14"
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { strokeDashoffset: -200, opacity: 1 }}
        transition={reduced ? { duration: 0.3 } : { strokeDashoffset: { duration: 6, ease: 'linear', repeat: Infinity }, opacity: { delay: 1.6, duration: 0.6 } }}
      />
      {nodes.map((n, i) => (
        <motion.g
          key={n.city}
          className="[transform-box:fill-box] origin-center"
          initial={reduced ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 + i * 0.35 }}
        >
          {!reduced && (
            <motion.circle
              className="[transform-box:fill-box] origin-center"
              cx={n.x}
              cy={n.y}
              r={10}
              fill="#CCFF00"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 2.6 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 0.8 }}
            />
          )}
          <circle cx={n.x} cy={n.y} r={7} fill="#CCFF00" />
          <circle cx={n.x} cy={n.y} r={3} fill="#1a1a1a" />
          <text x={n.x} y={n.y + 34} textAnchor="middle" className="fill-[#F2F0E9] font-estedad font-bold" fontSize={18}>
            {n.city}
          </text>
          <text x={n.x} y={n.y + 58} textAnchor="middle" className="fill-[#CCFF00] font-estedad font-black" fontSize={20}>
            {mounted && START ? hm(START, n.tz) : '‌'}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function FaWebinar() {
  const w = webinar;
  const reduced = useReducedMotion();
  const now = useNow();
  const mounted = now !== null;
  const phase = phaseAt(now);

  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [onCalendar, setOnCalendar] = useState(false);
  const [pending, start] = useTransition();

  const submit = (data: FormData) =>
    start(async () => {
      const r = await registerWebinar(data);
      if (r.success) {
        trackLead('webinar', 'fa', r.eventId);
        setOnCalendar(r.calendar === 'added' || r.calendar === 'exists');
        setState('done');
      } else {
        setMessage(r.message);
        setState('error');
      }
    });

  const [localZone, setLocalZone] = useState<string | null>(null);
  useEffect(() => setLocalZone(Intl.DateTimeFormat().resolvedOptions().timeZone), []);

  const word: Variants = {
    hidden: { opacity: 0, y: '0.6em' },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.09 } }),
  };
  const words = w.hero.headline.flatMap((line, li) => line.split(' ').map((t) => ({ t, li })));

  const field = 'w-full border border-[#1a1a1a]/25 bg-white/60 px-4 py-3 outline-none transition-colors focus:border-[#1a1a1a] focus:bg-white';
  const label = 'flex items-baseline justify-between text-sm font-bold mb-1.5';

  return (
    <div className="w-full bg-[#F2F0E9] font-vazir text-[#1a1a1a]">
      {/* ================================================================ HERO */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-[#F2F0E9]">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -top-10 end-[-4%] select-none font-estedad font-black leading-none text-transparent text-[16rem] md:text-[26rem] [-webkit-text-stroke:2px_rgba(204,255,0,0.35)]"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -14, 0] }}
          transition={reduced ? { duration: 0 } : { opacity: { duration: 1.2 }, y: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
        >
          {toPersianDigits(w.number)}
        </motion.span>

        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-14 md:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-8"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1">دورهمی شماره‌ی {toPersianDigits(w.number)}</span>
              <span className="text-xs text-[#F2F0E9]/60">{w.hero.eyebrow}</span>
            </motion.div>
            <p className="text-sm md:text-base text-[#F2F0E9]/60 mb-4">{w.hero.kicker}</p>
            <h1 className="font-estedad font-black text-5xl md:text-7xl lg:text-8xl leading-[1.15] mb-8">
              {w.hero.headline.map((line, li) => (
                <span key={line} className={`block ${li === 1 ? 'text-[#CCFF00]' : ''}`}>
                  {line.split(' ').map((t) => {
                    const i = words.findIndex((x) => x.t === t && x.li === li);
                    return (
                      <span key={t} className="inline-block overflow-hidden align-bottom pb-[0.12em] me-[0.25em]">
                        <motion.span className="inline-block" variants={word} initial={reduced ? false : 'hidden'} animate="show" custom={i}>
                          {t}
                        </motion.span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
            <motion.p
              className="text-lg md:text-xl leading-loose text-[#F2F0E9]/75 max-w-2xl mb-10"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {w.hero.sub}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
            >
              <a href="#register" className="group inline-flex items-center gap-3 bg-[#CCFF00] text-black px-7 py-4 font-bold transition-colors hover:bg-[#F2F0E9]">
                {w.hero.cta}
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </a>
              <a href="#archive" className="inline-flex items-center gap-3 border border-[#F2F0E9]/30 px-7 py-4 font-bold transition-colors hover:border-[#F2F0E9]">
                <Youtube className="w-4 h-4" />
                {w.hero.archive}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <RouteMap mounted={mounted} />
          </div>
        </div>

        {/* date + countdown bar */}
        <div className="relative border-t border-[#F2F0E9]/10">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="block text-xs font-bold text-[#F2F0E9]/50 mb-2">{w.when.label}</span>
              {START && mounted ? (
                <p className="font-estedad font-black text-2xl md:text-3xl">
                  {fullDate(START, 'Asia/Tehran')}
                  <span className="text-[#CCFF00]"> · ساعت {hm(START, 'Asia/Tehran')} به وقت تهران</span>
                </p>
              ) : (
                <p className="font-estedad font-black text-2xl md:text-3xl min-h-[2.5rem]">{START ? '‌' : w.when.none}</p>
              )}
              {START && <p className="text-sm text-[#F2F0E9]/50 mt-2">{w.when.duration} · Google Meet</p>}
            </div>
            {phase === 'upcoming' && now !== null && <Countdown now={now} />}
            {phase === 'live' && (
              <p className="flex items-center gap-3 font-bold max-w-md">
                <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75 motion-safe:animate-ping"></span><span className="relative inline-flex h-3 w-3 rounded-full bg-[#CCFF00]"></span></span>
                {w.when.live}
              </p>
            )}
            {phase === 'over' && <p className="font-bold max-w-md text-[#F2F0E9]/80">{w.when.expired}</p>}
          </div>
        </div>
      </section>

      {/* ============================================================ MARQUEE */}
      <div className="overflow-hidden bg-[#CCFF00] text-black border-y border-[#1a1a1a]" aria-hidden>
        <motion.div
          className="flex w-max gap-10 py-3 font-estedad font-black text-lg"
          animate={reduced ? undefined : { x: ['0%', '50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {[...w.routes, ...w.routes, ...w.routes, ...w.routes].map((r, i) => (
            <span key={i} className="flex items-center gap-10">
              {r}
              <span className="w-1.5 h-1.5 bg-black"></span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* ============================================================ ZONES */}
        {START && END && (
          <section className="py-16 md:py-20 border-b border-[#1a1a1a]/10">
            <Reveal>
              <h2 className="font-estedad font-black text-3xl md:text-4xl mb-10 flex items-center gap-3">
                <Clock className="w-7 h-7" />
                {w.when.zonesHeading}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-px bg-[#1a1a1a]/15 border border-[#1a1a1a]/15">
              {MEETUP_ZONES.map((z, i) => (
                <Reveal key={z.tz} delay={i * 0.06} className="bg-[#F2F0E9] p-6">
                  <span className="block text-[11px] font-bold text-[#1a1a1a]/45 mb-1">{z.region}</span>
                  <span className="block font-bold mb-4">{z.city}</span>
                  <span className="block font-estedad font-black text-4xl tabular-nums min-h-[2.75rem]">{mounted ? hm(START, z.tz) : '‌'}</span>
                  <span className="block text-sm text-[#1a1a1a]/60 tabular-nums min-h-[1.25rem]">{mounted ? `تا ${hm(END, z.tz)}` : ''}</span>
                  <span className="block text-xs text-[#1a1a1a]/50 mt-2 min-h-[1rem]">{mounted ? dayLabel(START, z.tz) : ''}</span>
                </Reveal>
              ))}
              <Reveal delay={0.3} className="bg-[#1a1a1a] text-[#F2F0E9] p-6">
                <span className="block text-[11px] font-bold text-[#CCFF00] mb-1">{w.when.yours}</span>
                <span className="block font-bold mb-4 truncate" dir="ltr">{localZone ?? '‌'}</span>
                <span className="block font-estedad font-black text-4xl tabular-nums text-[#CCFF00] min-h-[2.75rem]">{mounted ? hm(START) : '‌'}</span>
                <span className="block text-sm text-[#F2F0E9]/60 tabular-nums min-h-[1.25rem]">{mounted ? `تا ${hm(END)}` : ''}</span>
                <span className="block text-xs text-[#F2F0E9]/50 mt-2 min-h-[1rem]">{mounted ? dayLabel(START) : ''}</span>
              </Reveal>
            </div>
          </section>
        )}

        {/* ===================================================== AGENDA + FORM */}
        <section className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-estedad font-black text-3xl md:text-5xl mb-12">{w.agenda.heading}</h2>
            </Reveal>
            <ol className="border-t border-[#1a1a1a]">
              {w.agenda.items.map((it, i) => (
                <Reveal key={it.title} delay={i * 0.05}>
                  <li className="group grid grid-cols-[auto_1fr] gap-6 py-7 border-b border-[#1a1a1a]/15">
                    <span className="font-estedad font-black text-4xl md:text-5xl text-[#1a1a1a]/15 transition-colors group-hover:text-[#1a1a1a] tabular-nums">
                      {toPersianDigits(String(i + 1).padStart(2, '0'))}
                    </span>
                    <div>
                      <h3 className="font-estedad font-bold text-xl md:text-2xl mb-2">{it.title}</h3>
                      <p className="text-[#1a1a1a]/70 leading-loose">{it.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-16">
              <h2 className="font-estedad font-black text-2xl md:text-3xl mb-6">{w.who.heading}</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {w.who.items.map((it) => (
                  <li key={it} className="flex gap-3 border border-[#1a1a1a]/15 p-5 leading-relaxed">
                    <Check className="w-5 h-5 shrink-0 mt-0.5 text-[#1a1a1a]" />
                    <span className="text-[#1a1a1a]/80">{it}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-5" id="register">
            <Reveal className="lg:sticky lg:top-28">
              <div className="border-2 border-[#1a1a1a] bg-[#F2F0E9] p-6 md:p-8 shadow-[8px_8px_0_0_#1a1a1a]">
                <AnimatePresence mode="wait" initial={false}>
                  {state === 'done' ? (
                    <motion.div
                      key="done"
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="py-6"
                      aria-live="polite"
                    >
                      <svg viewBox="0 0 52 52" className="w-14 h-14 mb-6" aria-hidden>
                        <circle cx="26" cy="26" r="25" fill="#CCFF00" />
                        <motion.path
                          d="M15 27 l7 7 l15 -16"
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth={4}
                          strokeLinecap="square"
                          initial={reduced ? false : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                        />
                      </svg>
                      <h2 className="font-estedad font-black text-2xl mb-3">{w.form.doneTitle}</h2>
                      <p className="leading-loose text-[#1a1a1a]/75">{onCalendar ? w.form.done : w.form.donePending}</p>
                      <a href={w.telegram.channel.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold underline underline-offset-4 decoration-[#CCFF00] decoration-2">
                        <Send className="w-4 h-4" /> {w.telegram.channel.label}
                      </a>
                    </motion.div>
                  ) : (
                    <motion.div key="form" exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                      <h2 className="font-estedad font-black text-2xl md:text-3xl mb-2">{w.form.heading}</h2>
                      <p className="text-sm leading-relaxed text-[#1a1a1a]/60 mb-7">{w.form.body}</p>
                      <form action={submit} className="grid gap-4">
                        <input type="hidden" name="event" value={w.eventLabel} />
                        <div className="hidden" aria-hidden>
                          <label>
                            وب‌سایت
                            <input name="website" tabIndex={-1} autoComplete="off" />
                          </label>
                        </div>
                        <div>
                          <label htmlFor="mt-name" className={label}>
                            {w.form.name} <span className="text-[11px] font-normal text-[#b91c1c]">{w.form.required}</span>
                          </label>
                          <input id="mt-name" name="name" required autoComplete="name" className={field} />
                        </div>
                        <div>
                          <label htmlFor="mt-email" className={label}>
                            {w.form.email} <span className="text-[11px] font-normal text-[#b91c1c]">{w.form.required}</span>
                          </label>
                          <input id="mt-email" name="email" type="email" required autoComplete="email" dir="ltr" className={`${field} text-left`} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="mt-phone" className={label}>
                              {w.form.phone} <span className="text-[11px] font-normal text-[#1a1a1a]/45">{w.form.optional}</span>
                            </label>
                            <input id="mt-phone" name="phone" autoComplete="tel" dir="ltr" className={`${field} text-left`} />
                          </div>
                          <div>
                            <label htmlFor="mt-residence" className={label}>
                              {w.form.residence} <span className="text-[11px] font-normal text-[#1a1a1a]/45">{w.form.optional}</span>
                            </label>
                            <input id="mt-residence" name="residence" autoComplete="country-name" className={field} />
                          </div>
                        </div>
                        <fieldset>
                          <legend className={`${label} w-full`}>
                            {w.form.interest.label} <span className="text-[11px] font-normal text-[#1a1a1a]/45">{w.form.optional}</span>
                          </legend>
                          <div className="grid grid-cols-2 gap-2">
                            {w.form.interest.options.map((o) => (
                              <label key={o} className="cursor-pointer">
                                <input type="radio" name="interest" value={o} className="peer sr-only" />
                                <span className="block border border-[#1a1a1a]/25 px-3 py-2.5 text-sm text-center transition-colors hover:border-[#1a1a1a] peer-checked:bg-[#1a1a1a] peer-checked:text-[#CCFF00] peer-checked:border-[#1a1a1a] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[#1a1a1a]">
                                  {o}
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <div>
                          <label htmlFor="mt-idea" className={label}>
                            {w.form.idea} <span className="text-[11px] font-normal text-[#1a1a1a]/45">{w.form.optional}</span>
                          </label>
                          <input id="mt-idea" name="startupIdea" className={field} />
                        </div>
                        <button
                          type="submit"
                          disabled={pending}
                          className="group mt-2 inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold transition-colors hover:bg-[#CCFF00] hover:text-black disabled:opacity-60"
                        >
                          {pending ? w.form.sending : w.form.submit}
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        </button>
                        {state === 'error' && (
                          <p className="text-sm text-[#b91c1c]" role="alert">
                            {message ?? w.form.error}
                          </p>
                        )}
                        <p className="text-xs leading-relaxed text-[#1a1a1a]/50">{w.form.privacy}</p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ============================================================ ARCHIVE */}
      <Archive />

      {/* =========================================================== TELEGRAM */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <Reveal>
          <h2 className="font-estedad font-black text-3xl md:text-4xl mb-10">{w.telegram.heading}</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          {[w.telegram.channel, w.telegram.support].map((t, i) => (
            <Reveal key={t.href} delay={i * 0.08}>
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between gap-6 p-7 border-2 border-[#1a1a1a] transition-colors ${i === 0 ? 'bg-[#1a1a1a] text-[#F2F0E9] hover:bg-[#CCFF00] hover:text-black' : 'hover:bg-[#1a1a1a] hover:text-[#F2F0E9]'}`}
              >
                <div>
                  <span className="block font-estedad font-black text-xl md:text-2xl mb-1">{t.label}</span>
                  <span className="block text-sm opacity-70">{t.body}</span>
                  <span className="block mt-3 font-bold" dir="ltr">{t.handle}</span>
                </div>
                <Send className="w-8 h-8 shrink-0 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Past meetups rail
// ---------------------------------------------------------------------------
function Archive() {
  const a = webinar.archive;
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // In RTL the rail starts at the right; "next" moves towards the left.
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <section id="archive" className="bg-[#1a1a1a] text-[#F2F0E9] py-16 md:py-24 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <Reveal>
            <h2 className="font-estedad font-black text-3xl md:text-5xl mb-3">{a.heading}</h2>
            <p className="text-[#F2F0E9]/60 max-w-xl leading-relaxed">{a.sub}</p>
          </Reveal>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => scroll(-1)} aria-label="قبلی" className="grid place-items-center w-12 h-12 border border-[#F2F0E9]/30 transition-colors hover:bg-[#F2F0E9] hover:text-black">
              <ArrowRight className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="بعدی" className="grid place-items-center w-12 h-12 border border-[#F2F0E9]/30 transition-colors hover:bg-[#F2F0E9] hover:text-black">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#CCFF00] text-black px-5 h-12 font-bold transition-colors hover:bg-[#F2F0E9]">
              <Youtube className="w-4 h-4" /> {a.all}
            </a>
          </div>
        </div>
      </div>

      <div ref={rail} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-8 px-4 md:px-8 pb-4 [scrollbar-width:thin]">
        {PAST_MEETUPS.map((m, i) => (
          <motion.a
            key={m.id}
            href={`https://www.youtube.com/watch?v=${m.id}&list=${PLAYLIST_URL.split('list=')[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group snap-start shrink-0 w-[78vw] sm:w-[340px] border border-[#F2F0E9]/15 bg-[#F2F0E9]/[0.03] transition-colors hover:border-[#CCFF00]"
            initial={reduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 5) * 0.06 }}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={`https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`}
                alt={`ضبط دورهمی شماره‌ی ${toPersianDigits(m.n)}`}
                fill
                sizes="(max-width: 640px) 78vw, 340px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10"></span>
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center w-14 h-14 rounded-full bg-[#CCFF00] text-black scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <Play className="w-6 h-6 fill-black" />
                </span>
              </span>
              <span className="absolute bottom-2 left-2 bg-black/80 px-1.5 py-0.5 text-xs tabular-nums" dir="ltr">
                {m.length}
              </span>
            </div>
            <div className="p-5 flex gap-4 items-start">
              <span className="font-estedad font-black text-4xl leading-none text-[#CCFF00]">{toPersianDigits(m.n)}</span>
              <div className="min-w-0">
                <span className="block font-bold">
                  {a.item} {toPersianDigits(m.n)}
                  {m.part ? ` · ${m.part}` : ''}
                </span>
                {m.note && <span className="block text-sm text-[#F2F0E9]/60 mt-1 leading-relaxed">{m.note}</span>}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
