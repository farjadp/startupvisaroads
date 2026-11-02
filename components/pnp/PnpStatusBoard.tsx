// ============================================================================
// components/pnp/PnpStatusBoard.tsx
// Every province and territory on one board, grouped by whether it is taking
// entrepreneurs today, with the federal context underneath. Data and sources
// live in lib/pnp-status.ts. Used on /en/pnp and /fa/pnp.
// ============================================================================
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from '@/navigation';
import { JURISDICTIONS, FEDERAL, PNP_CHECKED, type PnpTone } from '@/lib/pnp-status';
import { SUV_STATE } from '@/lib/canada-suv';
import { toPersianDigits, faDate, formatNumeral } from '@/lib/fa/format';

type Lang = 'en' | 'fa';

const GROUPS: { tone: PnpTone; en: string; fa: string; dot: string; chip: string }[] = [
  { tone: 'open', en: 'Taking entrepreneurs', fa: 'کارآفرین می‌پذیرد', dot: 'bg-[#4D7C0F]', chip: 'bg-[#CCFF00] text-[#1a1a1a]' },
  { tone: 'limited', en: 'Listed, little or no movement', fa: 'در فهرست، بی‌تحرک یا نامعلوم', dot: 'bg-[#B45309]', chip: 'bg-[#FDE7C7] text-[#1a1a1a]' },
  { tone: 'closed', en: 'Closed to entrepreneurs', fa: 'برای کارآفرین بسته', dot: 'bg-[#B91C1C]', chip: 'bg-[#1a1a1a] text-[#F2F0E9]' },
  { tone: 'none', en: 'No program', fa: 'بدون برنامه', dot: 'bg-[#1a1a1a]/40', chip: 'bg-[#1a1a1a]/10 text-[#1a1a1a]' },
];

const fmtDate = (iso: string, lang: Lang) =>
  lang === 'fa' ? faDate(iso) : new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function PnpStatusBoard({ lang }: { lang: Lang }) {
  const fa = lang === 'fa';
  const n = (x: number) => (fa ? formatNumeral(x, '٬') : x.toLocaleString('en-US'));
  const checked = fmtDate(PNP_CHECKED, lang);
  const suvPaused = fmtDate(SUV_STATE.pausedOn, lang);

  return (
    <section id="pnp-status" aria-labelledby="pnp-status-h" dir={fa ? 'rtl' : 'ltr'} className="scroll-mt-28 border-t border-[#1a1a1a]/10 px-4 py-20 md:py-24">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/55">
        {fa ? <>وضعیت در <time dateTime={PNP_CHECKED}>{checked}</time></> : <>Status on <time dateTime={PNP_CHECKED}>{checked}</time></>}
      </p>
      <h2 id="pnp-status-h" className={`mb-4 max-w-[22ch] text-4xl leading-tight md:text-5xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>
        {fa ? 'کدام استان امروز کارآفرین می‌پذیرد؟' : 'Which provinces take entrepreneurs today?'}
      </h2>
      <p className={`mb-10 max-w-3xl text-[#1a1a1a]/70 ${fa ? 'text-lg leading-[1.9]' : 'font-sans leading-relaxed'}`}>
        {fa
          ? `از ۱۳ استان و سرزمین کانادا، ${toPersianDigits(JURISDICTIONS.filter((j) => j.tone === 'open').length)} جا امروز پرونده‌ی کارآفرینی می‌گیرند (کبک فقط با فرانسه‌ی سطح ۷). هر خط به صفحه‌ی رسمی همان استان پیوند دارد.`
          : `Of Canada's 13 provinces and territories, ${JURISDICTIONS.filter((j) => j.tone === 'open').length} are taking entrepreneur files today (Quebec only with level-7 French). Every line links to that jurisdiction's official page.`}
      </p>

      <div className="grid grid-cols-1 gap-px border border-[#1a1a1a]/15 bg-[#1a1a1a]/15 lg:grid-cols-2">
        {GROUPS.map((g) => {
          const list = JURISDICTIONS.filter((j) => j.tone === g.tone);
          return (
            <div key={g.tone} className={`bg-[#F2F0E9] p-6 md:p-8 ${g.tone === 'open' ? 'lg:row-span-3' : ''}`}>
              <h3 className="mb-5 flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${g.chip}`}>{fa ? toPersianDigits(list.length) : list.length}</span>
                <span className={fa ? 'font-estedad text-xl font-black' : 'font-serif text-2xl'}>{fa ? g.fa : g.en}</span>
              </h3>
              <ul className="grid gap-4">
                {list.map((j) => (
                  <li key={j.code} className="grid grid-cols-[auto_1fr] gap-x-3">
                    <span aria-hidden="true" className={`mt-2 h-2 w-2 rounded-full ${g.dot}`} />
                    <div>
                      <p className="font-bold">
                        {j.href && (fa ? j.faGuide : true) ? (
                          <Link href={j.href} className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">{j.name[lang]}</Link>
                        ) : j.href ? (
                          <a href={`/en${j.href}`} hrefLang="en" className="underline decoration-[#1a1a1a]/30 underline-offset-4 hover:decoration-[#1a1a1a]">{j.name[lang]}</a>
                        ) : (
                          j.name[lang]
                        )}
                      </p>
                      <p className={`text-sm text-[#1a1a1a]/70 ${fa ? 'leading-[1.9]' : 'leading-relaxed'}`}>
                        {j.note[lang]}{' '}
                        <a href={j.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
                          {fa ? 'منبع رسمی' : 'Official source'} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <dl className="mt-px grid grid-cols-1 gap-px border border-t-0 border-[#1a1a1a]/15 bg-[#1a1a1a]/15 md:grid-cols-3">
        <div className="bg-[#1a1a1a] p-6 text-[#F2F0E9]">
          <dt className="text-xs font-bold text-[#CCFF00]">{fa ? 'هدف PNP در ۲۰۲۶' : 'PNP target, 2026'}</dt>
          <dd className={`mt-2 text-3xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>{n(FEDERAL.pnpTarget2026)}</dd>
          <dd className="mt-1 text-xs text-[#F2F0E9]/60">{fa ? 'اقامت دائم، همه‌ی استان‌ها و همه‌ی مسیرها' : 'Permanent residents, all provinces and streams'}</dd>
        </div>
        <div className="bg-[#1a1a1a] p-6 text-[#F2F0E9]">
          <dt className="text-xs font-bold text-[#CCFF00]">{fa ? 'سهمیه‌ی کسب‌وکار فدرال' : 'Federal business quota'}</dt>
          <dd className={`mt-2 text-3xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>{n(FEDERAL.businessPerYear)}</dd>
          <dd className="mt-1 text-xs text-[#F2F0E9]/60">{fa ? 'در سال، ۲۰۲۶ تا ۲۰۲۸' : 'Per year, 2026 to 2028'}</dd>
        </div>
        <div className="bg-[#1a1a1a] p-6 text-[#F2F0E9]">
          <dt className="text-xs font-bold text-[#CCFF00]">{fa ? 'استارتاپ ویزای فدرال' : 'Federal Start-up Visa'}</dt>
          <dd className={`mt-2 text-3xl ${fa ? 'font-estedad font-black' : 'font-serif'}`}>{fa ? 'متوقف' : 'Paused'}</dd>
          <dd className="mt-1 text-xs text-[#F2F0E9]/60">{fa ? `از ${suvPaused}` : `Since ${suvPaused}`}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-[#1a1a1a]/50">
        {fa ? 'ارقام فدرال از ' : 'Federal figures from '}
        <a href={FEDERAL.source} target="_blank" rel="noopener noreferrer" className="underline">{fa ? 'برنامه‌ی سطوح مهاجرت ۲۰۲۶ تا ۲۰۲۸ (IRCC)' : 'IRCC Immigration Levels Plan 2026–2028'}</a>
        {fa ? '. استان‌ها قواعد را بی‌اعلام تغییر می‌دهند؛ روز ارسال پرونده صفحه‌ی رسمی را دوباره ببینید.' : '. Provinces change rules without notice; check the official page on the day you file.'}
      </p>
    </section>
  );
}
