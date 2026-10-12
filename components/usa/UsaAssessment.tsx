'use client';

// ============================================================================
// Component: components/usa/UsaAssessment.tsx
// The US readiness form on /usa/assessment, both locales. The verdict updates
// as the founder ticks boxes — the point is that they learn where they stand
// before they give us anything — and the contact fields only send it on.
// Scoring lives in lib/usa/assessment.ts and is re-run on the server.
// ============================================================================
import React, { useMemo, useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { assess, type Degree, type O1Criterion, type Passport, type AssessmentResult } from '@/lib/usa/assessment';
import { sendUsaAssessment } from '@/app/[locale]/(public)/usa/assessment/actions';
import { trackLead } from '@/lib/analytics';

type Copy = {
  passportsTitle: string;
  passports: Record<Passport, string>;
  criteriaTitle: string;
  criteriaHint: string;
  criteria: Record<O1Criterion, string>;
  niwTitle: string;
  degreeLabel: string;
  degrees: Record<Degree, string>;
  nationalImportance: string;
  plan: string;
  resultTitle: string;
  gate: Record<AssessmentResult['gate'], string>;
  o1: Record<AssessmentResult['o1'], string>;
  niw: Record<AssessmentResult['niw'], string>;
  count: (n: number) => string;
  contactTitle: string;
  contactHint: string;
  name: string;
  email: string;
  phone: string;
  startup: string;
  submit: string;
  sending: string;
  done: string;
  error: string;
};

const COPY: Record<'en' | 'fa', Copy> = {
  en: {
    passportsTitle: '1. Which citizenships do you hold?',
    passports: {
      iran: 'Iranian',
      canada: 'Canadian (citizenship, not PR)',
      treaty: 'Another E-2 treaty country (UK, Germany, France, Türkiye …)',
      other: 'Another country',
    },
    criteriaTitle: '2. Which O-1A criteria can you document today?',
    criteriaHint: 'Tick only what you could prove with a document a stranger can verify. Self-published or paid items do not count.',
    criteria: {
      award: 'A nationally or internationally recognised prize or award for excellence',
      membership: 'Membership in an association that requires outstanding achievement to join',
      press: 'Articles about you or your work in major media or trade publications',
      judging: 'Judging the work of others — a competition, accelerator, grant panel, peer review',
      contribution: 'An original contribution of major significance, used outside your own company',
      authorship: 'Authorship of scholarly articles in professional journals or major media',
      critical: 'A critical role at an organisation with a distinguished reputation',
      salary: 'A salary or compensation that is high compared with others in your field',
    },
    niwTitle: '3. EB-2 NIW basics',
    degreeLabel: 'Highest qualification',
    degrees: {
      masters: "Master's degree or higher",
      bachelor5: "Bachelor's plus five years of progressive experience",
      none: 'Neither',
    },
    nationalImportance: 'My work is in a field with a credible claim to US national importance (health, energy, AI, manufacturing, security …)',
    plan: 'I have a concrete, documented plan for that work in the US',
    resultTitle: 'Where you stand',
    gate: {
      blocked:
        'Your passport decides this before your evidence does. US visa issuance to Iranian nationals is suspended under the current presidential proclamation, for both immigrant and non-immigrant visas. Evidence you build now still counts if you later hold a second citizenship — for most of our founders, that is Canada.',
      canadian: 'A Canadian passport opens E-2 alongside O-1A. TN is also Canadian-only, but it does not cover a founder who controls the company — it suits Canadian early hires, not you.',
      treaty: 'Check your country on the State Department treaty table: E-2 may be open to you alongside O-1A.',
      check: 'Check your nationality against the E-2 treaty table and the current travel restrictions before anything else.',
    },
    o1: {
      early: 'O-1A: early. Fewer than two criteria. This is a 9–12-month evidence-building job before an attorney is useful.',
      consult: 'O-1A: time to consult. Two criteria, or three that lean on salary. Work on a strong third before filing.',
      file: 'O-1A: file-ready profile. Three criteria beyond salary — the question now is how strong each exhibit is.',
    },
    niw: {
      'not-eligible': "NIW: not open yet. It needs a master's degree, or a bachelor's plus five years of progressive experience.",
      build: 'NIW: the degree gate is met. The case lives in the national-importance argument and the plan — that is what to build.',
      strong: 'NIW: worth a serious look. Degree, field and plan are all there; the Dhanasar argument is what an attorney will test.',
    },
    count: (n) => `${n} of 8 criteria ticked`,
    contactTitle: 'Send this to us',
    contactHint: 'We read every assessment ourselves. If the US route is realistic for you, we reply with what to build first; if it is not, we say so.',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone or WhatsApp (optional)',
    startup: 'Your startup in one or two sentences',
    submit: 'Send my assessment',
    sending: 'Sending…',
    done: 'Received. We will reply by email within a few working days.',
    error: 'Something went wrong. Please try again, or write to us on Telegram.',
  },
  fa: {
    passportsTitle: '۱. تابعیت کدام کشورها را دارید؟',
    passports: {
      iran: 'ایران',
      canada: 'کانادا (شهروندی، نه اقامت دائم)',
      treaty: 'کشور دیگری که معاهده‌ی E-2 دارد (بریتانیا، آلمان، فرانسه، ترکیه …)',
      other: 'کشور دیگر',
    },
    criteriaTitle: '۲. کدام معیارهای O-1A را امروز می‌توانید مستند کنید؟',
    criteriaHint: 'فقط چیزی را بزنید که با مدرکی قابل‌بررسی برای یک غریبه ثابت می‌شود. محتوای خودمنتشرشده یا پولی حساب نمی‌شود.',
    criteria: {
      award: 'جایزه‌ی ملی یا بین‌المللی شناخته‌شده برای برتری در کار',
      membership: 'عضویت در انجمنی که پذیرشش دستاورد برجسته می‌خواهد',
      press: 'مطلب درباره‌ی شما یا کارتان در رسانه‌ی اصلی یا نشریه‌ی تخصصی',
      judging: 'داوری کار دیگران: مسابقه، شتاب‌دهنده، پنل گرنت، داوری مقاله',
      contribution: 'نوآوری مهم و اصیل که بیرون از شرکت خودتان استفاده می‌شود',
      authorship: 'نویسندگی مقاله‌ی علمی در نشریه‌ی تخصصی یا رسانه‌ی اصلی',
      critical: 'نقش کلیدی در سازمانی با اعتبار شناخته‌شده',
      salary: 'حقوق یا درآمدی که نسبت به دیگران در حوزه‌تان بالاست',
    },
    niwTitle: '۳. شرایط پایه‌ی EB-2 NIW',
    degreeLabel: 'بالاترین مدرک',
    degrees: {
      masters: 'کارشناسی ارشد یا بالاتر',
      bachelor5: 'کارشناسی به‌علاوه‌ی ۵ سال سابقه‌ی پیش‌رونده',
      none: 'هیچ‌کدام',
    },
    nationalImportance: 'کار من در حوزه‌ای است که می‌توان اهمیت ملی آن را برای آمریکا نشان داد (سلامت، انرژی، هوش مصنوعی، تولید، امنیت …)',
    plan: 'برای ادامه‌ی همین کار در آمریکا برنامه‌ی مشخص و مستند دارم',
    resultTitle: 'جایگاه شما',
    gate: {
      blocked:
        'پاسپورت شما پیش از شواهدتان تصمیم می‌گیرد. طبق فرمان ریاست‌جمهوری فعلی، صدور ویزای مهاجرتی و غیرمهاجرتی برای اتباع ایران متوقف است. شواهدی که امروز می‌سازید از بین نمی‌رود و اگر بعداً تابعیت دوم داشته باشید به کار می‌آید؛ برای بیشتر فاندرهای ما، آن تابعیت کاناداست.',
      canadian: 'پاسپورت کانادا در کنار O-1A مسیر E-2 را هم باز می‌کند. TN هم مخصوص شهروندان کاناداست، اما فاندری را که شرکت را کنترل می‌کند پوشش نمی‌دهد؛ برای استخدام‌های اولیه‌ی کانادایی مناسب است، نه برای خودتان.',
      treaty: 'کشورتان را در جدول معاهده‌های وزارت خارجه‌ی آمریکا چک کنید: ممکن است E-2 هم در کنار O-1A برایتان باز باشد.',
      check: 'پیش از هر چیز، ملیت خود را در جدول معاهده‌های E-2 و فهرست محدودیت‌های سفر فعلی بررسی کنید.',
    },
    o1: {
      early: 'O-1A: زود است. کمتر از دو معیار دارید. این یعنی ۹ تا ۱۲ ماه ساختن شواهد، پیش از آنکه وکیل به کارتان بیاید.',
      consult: 'O-1A: وقت مشاوره است. دو معیار دارید، یا سه معیار که یکی‌اش حقوق است. پیش از ثبت، معیار سوم قوی بسازید.',
      file: 'O-1A: پروفایل آماده‌ی ثبت. سه معیار غیر از حقوق دارید؛ سؤال حالا قوت تک‌تک مدارک است.',
    },
    niw: {
      'not-eligible': 'NIW: هنوز باز نیست. کارشناسی ارشد، یا کارشناسی با ۵ سال سابقه‌ی پیش‌رونده لازم است.',
      build: 'NIW: شرط مدرک را دارید. پرونده روی استدلال اهمیت ملی و برنامه‌ی کار ساخته می‌شود؛ همین‌ها را باید ساخت.',
      strong: 'NIW: ارزش بررسی جدی دارد. مدرک، حوزه و برنامه هر سه هست؛ وکیل استدلال Dhanasar را محک می‌زند.',
    },
    count: (n) => `${n.toLocaleString('fa-IR')} از ۸ معیار`,
    contactTitle: 'ارزیابی را برای ما بفرستید',
    contactHint: 'همه‌ی ارزیابی‌ها را خودمان می‌خوانیم. اگر مسیر آمریکا برای شما واقع‌بینانه باشد، می‌گوییم اول چه چیزی را بسازید؛ اگر نباشد، همین را می‌گوییم.',
    name: 'نام و نام خانوادگی',
    email: 'ایمیل',
    phone: 'تلفن یا واتس‌اپ (اختیاری)',
    startup: 'استارتاپ شما در یکی دو جمله',
    submit: 'ارسال ارزیابی',
    sending: 'در حال ارسال…',
    done: 'دریافت شد. ظرف چند روز کاری با ایمیل پاسخ می‌دهیم.',
    error: 'مشکلی پیش آمد. دوباره امتحان کنید یا در تلگرام پیام بدهید.',
  },
};

const ORDER_CRITERIA: O1Criterion[] = ['press', 'judging', 'critical', 'contribution', 'award', 'membership', 'authorship', 'salary'];
const ORDER_PASSPORTS: Passport[] = ['iran', 'canada', 'treaty', 'other'];

export default function UsaAssessment({ locale }: { locale: 'en' | 'fa' }) {
  const c = COPY[locale];
  const [passports, setPassports] = useState<Passport[]>([]);
  const [criteria, setCriteria] = useState<O1Criterion[]>([]);
  const [degree, setDegree] = useState<Degree>('none');
  const [nationalImportance, setNi] = useState(false);
  const [plan, setPlan] = useState(false);
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const [pending, start] = useTransition();

  const r = useMemo(
    () => assess({ criteria, degree, nationalImportance, plan, passports }),
    [criteria, degree, nationalImportance, plan, passports],
  );
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const submit = (fd: FormData) =>
    start(async () => {
      const res = await sendUsaAssessment(fd);
      if (res.success) trackLead('usa_assessment', locale, res.eventId);
      setState(res.success ? 'done' : 'error');
    });

  const head = locale === 'fa' ? 'font-estedad font-black' : 'font-serif';
  const box = 'mt-1 h-5 w-5 shrink-0 accent-[#1a1a1a]';
  const input = 'border border-[#1a1a1a]/30 bg-transparent px-4 py-3 focus:border-[#1a1a1a] outline-none w-full';

  return (
    <section id="assessment" className="scroll-mt-28 border-t border-[#1a1a1a] pt-10">
      <form action={submit} className="grid gap-12">
        <input type="hidden" name="locale" value={locale} />

        <fieldset className="grid gap-3">
          <legend className={`${head} text-2xl md:text-3xl mb-4`}>{c.passportsTitle}</legend>
          {ORDER_PASSPORTS.map((p) => (
            <label key={p} className="flex gap-3 items-start cursor-pointer">
              <input type="checkbox" name="passports" value={p} className={box} checked={passports.includes(p)} onChange={() => setPassports(toggle(passports, p))} />
              <span>{c.passports[p]}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className={`${head} text-2xl md:text-3xl mb-2`}>{c.criteriaTitle}</legend>
          <p className="text-sm text-[#1a1a1a]/60 mb-2">{c.criteriaHint}</p>
          {ORDER_CRITERIA.map((k) => (
            <label key={k} className="flex gap-3 items-start cursor-pointer">
              <input type="checkbox" name="criteria" value={k} className={box} checked={criteria.includes(k)} onChange={() => setCriteria(toggle(criteria, k))} />
              <span>{c.criteria[k]}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="grid gap-4">
          <legend className={`${head} text-2xl md:text-3xl mb-2`}>{c.niwTitle}</legend>
          <label className="grid gap-2">
            <span className="text-sm font-bold">{c.degreeLabel}</span>
            <select name="degree" value={degree} onChange={(e) => setDegree(e.target.value as Degree)} className={input}>
              {(Object.keys(c.degrees) as Degree[]).map((d) => <option key={d} value={d}>{c.degrees[d]}</option>)}
            </select>
          </label>
          <label className="flex gap-3 items-start cursor-pointer">
            <input type="checkbox" name="nationalImportance" className={box} checked={nationalImportance} onChange={(e) => setNi(e.target.checked)} />
            <span>{c.nationalImportance}</span>
          </label>
          <label className="flex gap-3 items-start cursor-pointer">
            <input type="checkbox" name="plan" className={box} checked={plan} onChange={(e) => setPlan(e.target.checked)} />
            <span>{c.plan}</span>
          </label>
        </fieldset>

        <div aria-live="polite" className="bg-[#1a1a1a] text-[#F2F0E9] p-7 md:p-10 border-t-2 border-[#CCFF00] grid gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className={`${head} text-2xl md:text-3xl`}>{c.resultTitle}</h3>
            <span className="text-xs text-[#CCFF00]">{c.count(new Set(criteria).size)}</span>
          </div>
          {passports.length > 0 && <p className={r.gate === 'blocked' ? 'text-[#CCFF00] font-bold leading-relaxed' : 'leading-relaxed'}>{c.gate[r.gate]}</p>}
          <p className="leading-relaxed text-[#F2F0E9]/85">{c.o1[r.o1]}</p>
          <p className="leading-relaxed text-[#F2F0E9]/85">{c.niw[r.niw]}</p>
        </div>

        {state === 'done' ? (
          <p className="border-s-4 border-[#CCFF00] ps-6 py-4 font-bold">{c.done}</p>
        ) : (
          <fieldset className="grid gap-4 max-w-xl">
            <legend className={`${head} text-2xl md:text-3xl mb-2`}>{c.contactTitle}</legend>
            <p className="text-sm text-[#1a1a1a]/60 mb-2">{c.contactHint}</p>
            <input name="name" required placeholder={c.name} className={input} />
            <input name="email" type="email" required placeholder={c.email} className={input} dir="ltr" />
            <input name="phone" placeholder={c.phone} className={input} dir="ltr" />
            <textarea name="startup" rows={3} placeholder={c.startup} className={input} />
            <button type="submit" disabled={pending} className="inline-flex items-center justify-center gap-3 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-4 font-bold disabled:opacity-50 hover:bg-[#CCFF00] hover:text-black transition-colors">
              {pending ? c.sending : c.submit}
              <Send className="w-4 h-4" />
            </button>
            {state === 'error' && <p className="text-sm text-[#b91c1c]">{c.error}</p>}
          </fieldset>
        )}
      </form>
    </section>
  );
}
