'use client';

// ============================================================================
// Component: components/fa/FaWebinar.tsx
// The Persian webinar page. Countdown from WEBINAR_DATE; when null or past,
// shows the next-session state instead of an expired timer. Registration
// posts to the existing registerWebinar action.
// ============================================================================
import React, { useEffect, useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { registerWebinar } from '@/app/[locale]/(public)/webinar/actions';
import { webinar, WEBINAR_DATE } from '@/content/fa/webinar';
import { toPersianDigits, faDate } from '@/lib/fa/format';

function useCountdown(target: string | null) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    if (!target) return;
    const t = new Date(target).getTime();
    const tick = () => {
      const diff = t - Date.now();
      if (diff <= 0) return setLeft(null);
      setLeft({ d: Math.floor(diff / 864e5), h: Math.floor((diff % 864e5) / 36e5), m: Math.floor((diff % 36e5) / 6e4) });
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export default function FaWebinar() {
  const w = webinar;
  const left = useCountdown(WEBINAR_DATE);
  const scheduled = WEBINAR_DATE !== null;
  const live = scheduled && left !== null;

  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const [ticket, setTicket] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = (data: FormData) =>
    start(async () => {
      const r = (await registerWebinar(data)) as { success: boolean; ticketNumber?: string };
      setTicket(r.ticketNumber ?? null);
      setState(r.success ? 'done' : 'error');
    });

  const input = 'border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none w-full';

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <header className="pt-10 pb-16 border-b border-[#1a1a1a]">
        <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{w.hero.eyebrow}</span>
        <h1 className="font-estedad font-black text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl mb-8">{w.hero.headline}</h1>
        <p className="text-lg md:text-xl leading-relaxed text-[#1a1a1a]/70 max-w-2xl">{w.hero.sub}</p>
      </header>

      <section className="py-12 border-b border-[#1a1a1a]/10">
        <span className="block text-xs font-bold text-[#1a1a1a]/50 mb-4">{w.when.label}</span>
        {live ? (
          <div className="flex flex-wrap items-end gap-8">
            <p className="font-estedad font-black text-2xl md:text-3xl">{faDate(WEBINAR_DATE as string)} · {w.when.tz}</p>
            <div className="flex gap-6" aria-live="polite">
              {[[left.d, w.when.countdown.days], [left.h, w.when.countdown.hours], [left.m, w.when.countdown.minutes]].map(([n, l]) => (
                <div key={String(l)} className="text-center">
                  <div className="font-estedad font-black text-4xl">{toPersianDigits(n as number)}</div>
                  <div className="text-xs text-[#1a1a1a]/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="border-s-4 border-[#CCFF00] ps-6 py-4 font-bold max-w-2xl">{scheduled ? w.when.expired : w.when.none}</p>
        )}
      </section>

      <section className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h2 className="font-estedad font-black text-3xl md:text-4xl mb-10">{w.agenda.heading}</h2>
          <ol className="space-y-8">
            {w.agenda.items.map((it, i) => (
              <li key={it.title} className="flex gap-5">
                <span className="shrink-0 h-fit text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">{toPersianDigits(String(i + 1).padStart(2, '0'))}</span>
                <div>
                  <h3 className="font-estedad font-bold text-xl mb-2">{it.title}</h3>
                  <p className="text-[#1a1a1a]/70 leading-relaxed">{it.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="font-estedad font-black text-2xl md:text-3xl mt-16 mb-6">{w.who.heading}</h2>
          <ul className="space-y-3">
            {w.who.items.map((it) => (
              <li key={it} className="flex gap-3"><span className="mt-3 w-2 h-2 bg-[#CCFF00] shrink-0"></span><span className="text-[#1a1a1a]/80">{it}</span></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 border border-[#1a1a1a] p-8 bg-[#F2F0E9]">
            <h2 className="font-estedad font-black text-2xl mb-2">{w.form.heading}</h2>
            <p className="text-sm text-[#1a1a1a]/60 mb-8">{w.form.body}</p>
            {state === 'done' ? (
              <div className="border-s-4 border-[#CCFF00] ps-6 py-4">
                <p className="font-bold">{w.form.done}</p>
                {ticket && <p className="text-sm text-[#1a1a1a]/60 mt-2">{w.form.ticket}: <span dir="ltr">{ticket}</span></p>}
              </div>
            ) : (
              <form action={submit} className="grid gap-4">
                <input name="name" required placeholder={w.form.name} className={input} />
                <input name="email" type="email" required placeholder={w.form.email} className={input} dir="ltr" />
                <input name="phone" required placeholder={w.form.phone} className={input} dir="ltr" />
                <input name="startupIdea" placeholder={w.form.idea} className={input} />
                <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold disabled:opacity-50 hover:bg-[#CCFF00] hover:text-black transition-colors">
                  {pending ? w.form.sending : w.form.submit}
                  <Send className="w-4 h-4" />
                </button>
                {state === 'error' && <p className="text-sm text-[#b91c1c]">{w.form.error}</p>}
              </form>
            )}
            <div className="mt-8 pt-6 border-t border-[#1a1a1a]/10 flex flex-col gap-2 text-sm">
              <a href={w.telegram.href} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#CCFF00]">{w.telegram.label}</a>
              <a href={w.telegram.direct} target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a]">{w.telegram.directLabel}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
