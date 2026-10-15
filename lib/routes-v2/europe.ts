// VisaRoads v2 routes, Europe: Denmark, Finland, Estonia, Netherlands, Italy.
// Checked 15 Oct 2026. Research notes: side-session notes v2-routes-europe.md
// and funds-by-country-2026-10.md (not in the repo). Funds figures match
// lib/funds.ts. Follow the rules in ./types.ts.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-15';

export const ROUTES_EUROPE: RouteV2[] = [
  // ───────────────────────────── DENMARK ─────────────────────────────
  {
    key: 'dk-startup',
    country: 'DK',
    family: 'startup',
    name: { en: 'Start-up Denmark', fa: 'استارتاپ دانمارک (Start-up Denmark)' },
    agency: {
      en: 'Danish Business Authority (expert panel); SIRI (permit)',
      fa: 'اداره‌ی کسب‌وکار دانمارک (Danish Business Authority) با هیئت کارشناسان؛ SIRI برای اجازه‌ی اقامت',
    },
    status: 'limited',
    fact: {
      en: 'The expert panel must give your business plan an average score of at least 3.5 out of 5. Without panel approval you cannot apply to SIRI.',
      fa: 'پنل کارشناسان باید به طرح کسب‌وکار شما میانگین دست‌کم ۳٫۵ از ۵ بدهد. بدون تأیید پنل نمی‌توانید درخواست اقامت را به SIRI بدهید.',
    },
    criteria: [
      {
        key: 'team-size',
        label: { en: 'Team of up to 3 people sharing one business plan', fa: 'تیم حداکثر سه‌نفره با یک طرح کسب‌وکار مشترک' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'ownership',
        label: { en: 'Full or partial owner, active in running the company', fa: 'مالکیت کامل یا بخشی از شرکت و نقش فعال در اداره‌ی آن' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'Holding companies are excluded. No ownership percentage is set; it is assessed case by case.',
          fa: 'شرکت‌های هلدینگ پذیرفته نمی‌شوند. درصد مالکیت مشخصی تعیین نشده و هر پرونده جداگانه بررسی می‌شود.',
        },
      },
      {
        key: 'panel-score',
        label: { en: 'Panel score of at least 3.5 out of 5 (innovation, market, scalability, team)', fa: 'امتیاز دست‌کم ۳٫۵ از ۵ از پنل (نوآوری، بازار، مقیاس‌پذیری، تیم)' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'Three judges each grade four criteria from 1 to 5. You can only self-assess this.',
          fa: 'سه داور هر یک چهار معیار را از ۱ تا ۵ نمره می‌دهند. این مورد را فقط خودتان می‌توانید ارزیابی کنید.',
        },
      },
      {
        key: 'funds',
        label: { en: 'Funds for your first year in Denmark', fa: 'تمکن مالی برای سال اول اقامت در دانمارک' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 153_240, currency: 'DKK' },
        note: {
          en: 'DKK 153,240 is the single-applicant figure. With a spouse: DKK 306,480; with a spouse and children: DKK 356,904; with children and no spouse: DKK 203,664.',
          fa: '۱۵۳٬۲۴۰ کرون رقم متقاضی مجرد است. با همسر: ۳۰۶٬۴۸۰ کرون؛ با همسر و فرزند: ۳۵۶٬۹۰۴ کرون؛ با فرزند و بدون همسر: ۲۰۳٬۶۶۴ کرون.',
        },
      },
      {
        key: 'panel-approval',
        label: { en: 'Expert panel approval', fa: 'تأیید پنل کارشناسان' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'One appeal to the Danish Business Authority is possible.',
          fa: 'امکان یک‌بار اعتراض به اداره‌ی کسب‌وکار دانمارک وجود دارد.',
        },
      },
      {
        key: 'quota',
        label: { en: 'Annual quota of 75 people (1 Jan to 31 Dec, counted per person)', fa: 'سهمیه‌ی سالانه‌ی ۷۵ نفر (۱ ژانویه تا ۳۱ دسامبر، بر اساس تعداد نفرات)' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'single',
        label: { en: 'Single applicant', fa: 'متقاضی مجرد' },
        amount: 153_240,
        currency: 'DKK',
        basis: 'year',
        shows: {
          en: 'A bank statement in your name, showing currency, date and account holder. Each founder applies separately.',
          fa: 'صورت‌حساب بانکی به نام خودتان، با ارز، تاریخ و نام صاحب حساب. هر بنیان‌گذار جداگانه درخواست می‌دهد.',
        },
      },
      { key: 'with-spouse', label: { en: 'With a spouse', fa: 'با همسر' }, amount: 306_480, currency: 'DKK', basis: 'year' },
      { key: 'with-spouse-children', label: { en: 'With a spouse and children', fa: 'با همسر و فرزند' }, amount: 356_904, currency: 'DKK', basis: 'year' },
      { key: 'with-children-no-spouse', label: { en: 'With children, no spouse', fa: 'با فرزند و بدون همسر' }, amount: 203_664, currency: 'DKK', basis: 'year' },
    ],
    processing: {
      text: { en: 'Normally 2 months; up to 4 months if more information is needed.', fa: 'معمولاً ۲ ماه؛ اگر مدارک بیشتری لازم باشد تا ۴ ماه.' },
      source: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark',
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 3_060, currency: 'DKK' }],
    pr: {
      en: 'Permit for up to 2 years, then 3 years at a time after panel re-evaluation. Permanent residence after 8 years (4 if all supplementary requirements are met), with Danish test 2 and 3.5 years of full-time work or self-employment in the last 4.',
      fa: 'اقامت اولیه تا ۲ سال و سپس پس از ارزیابی دوباره‌ی پنل، هر بار ۳ سال. اقامت دائم پس از ۸ سال (۴ سال اگر همه‌ی شرایط تکمیلی برقرار باشد)، با قبولی در آزمون زبان دانمارکی سطح ۲ و ۳٫۵ سال کار تمام‌وقت یا خوداشتغالی در ۴ سال اخیر.',
    },
    sources: [
      { url: 'https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark', checked: CHECKED, label: 'SIRI, last updated 29-06-2026' },
      { url: 'https://startupdenmarkprogramme.dk/application-guide-startups', checked: CHECKED, label: 'Start-up Denmark application guide' },
      { url: 'https://nyidanmark.dk/en-GB/Applying/Permanent%20residence%20permit/Permanent%20residence', checked: CHECKED, label: 'SIRI, permanent residence' },
    ],
    verified: true,
    review:
      'Funds labelled the "2025 level" on a SIRI page updated 29-06-2026; re-check in January. The 3.5 panel bar and the four criteria come from the search-indexed text of startupdenmarkprogramme.dk (TLS failed on direct fetch) and the guide does not say whether 3.5 applies per criterion or overall: confirm. Status "limited" because of the 75-person yearly quota. No general Danish self-employed route found (not checked in depth); confirm before mapping "entrepreneur" to Start-up Denmark. Panel approval could be scored via the `endorsement` field; left unscored per the notes.',
  },
  {
    key: 'dk-study',
    country: 'DK',
    family: 'study',
    name: { en: 'Residence permit for higher education', fa: 'اقامت تحصیلی آموزش عالی دانمارک' },
    agency: {
      en: 'SIRI',
      fa: 'آژانس استخدام بین‌المللی و یکپارچگی دانمارک (SIRI)',
    },
    status: 'open',
    fact: {
      en: 'For applications filed on or after 1 Oct 2026, the post-study job-seeking period is 6 months or 1 year (3 years for PhDs), down from up to 3 years.',
      fa: 'برای درخواست‌هایی که از ۱ اکتبر ۲۰۲۶ به بعد ثبت می‌شوند، مهلت جست‌وجوی کار پس از تحصیل ۶ ماه یا ۱ سال است (برای دکتری ۳ سال)؛ پیش از آن تا ۳ سال بود.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Admitted to a full-time, state-approved or accredited higher-education programme', fa: 'پذیرش در یک برنامه‌ی تمام‌وقت آموزش عالی مورد تأیید دولت یا معتبر' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'Funds for your study months', fa: 'تمکن مالی برای ماه‌های تحصیل' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 89_112, currency: 'DKK' },
        note: {
          en: 'DKK 7,426 per month of study, capped at DKK 89,112 (12 months). A shorter programme needs less.',
          fa: '۷٬۴۲۶ کرون برای هر ماه تحصیل و حداکثر ۸۹٬۱۱۲ کرون (۱۲ ماه). برای دوره‌ی کوتاه‌تر مبلغ کمتری لازم است.',
        },
      },
      {
        key: 'language',
        label: { en: 'Enough of the teaching language to take part (no level set)', fa: 'تسلط کافی به زبان تدریس برای شرکت در کلاس‌ها (سطح مشخصی تعیین نشده)' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'under-18',
        label: { en: 'Under 18: parental consent and custody papers', fa: 'زیر ۱۸ سال: رضایت والدین و مدارک حضانت' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'approved-programme',
        label: { en: 'Institution and programme are state-approved', fa: 'مؤسسه و برنامه‌ی تحصیلی مورد تأیید دولت باشند' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'per-month',
        label: { en: 'Living costs per month of study', fa: 'هزینه‌ی زندگی برای هر ماه تحصیل' },
        amount: 7_426,
        currency: 'DKK',
        basis: 'month',
        shows: {
          en: 'A bank statement in your own name, no more than 30 days old. Only liquid assets count; parents’ accounts, crypto and portfolios do not. A scholarship or loan in your name counts.',
          fa: 'صورت‌حساب بانکی به نام خودتان که بیش از ۳۰ روز از صدورش نگذشته باشد. فقط دارایی نقد پذیرفته می‌شود؛ حساب والدین، رمزارز و سبد سهام قبول نیست. بورسیه یا وام به نام خودتان پذیرفته می‌شود.',
        },
      },
      { key: 'cap', label: { en: 'Maximum (12 months)', fa: 'سقف (۱۲ ماه)' }, amount: 89_112, currency: 'DKK', basis: 'once' },
    ],
    processing: {
      text: { en: 'Normally 2 months, up to 3.', fa: 'معمولاً ۲ ماه و حداکثر ۳ ماه.' },
      source: 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education',
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 3_060, currency: 'DKK' }],
    pr: {
      en: 'Study years count toward the general 8-year permanent residence rule.',
      fa: 'سال‌های تحصیل در قاعده‌ی کلی ۸ ساله‌ی اقامت دائم محاسبه می‌شوند.',
    },
    sources: [
      { url: 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education', checked: CHECKED, label: 'SIRI, last updated 01-10-2026' },
      { url: 'https://nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Self-support---SIRI', checked: CHECKED, label: 'SIRI, self-support' },
    ],
    verified: true,
    review:
      'New rule from 1 Oct 2026: post-study job-seeking is 6 months or 1 year (3 years for PhDs) for applications filed on or after that date; it was up to 3 years before. Funds are the 2026 level. CONFLICT: SIRI pages differ on whether proof of paid first-semester tuition replaces the funds proof. Work allowed 90 h/month, full-time Jun–Aug.',
  },

  // ───────────────────────────── FINLAND ─────────────────────────────
  {
    key: 'fi-startup',
    country: 'FI',
    family: 'startup',
    name: { en: 'Residence permit for a start-up entrepreneur', fa: 'اقامت کارآفرین استارتاپی فنلاند' },
    agency: {
      en: 'Migri (permit), after an Eligibility Statement from Business Finland',
      fa: 'اداره‌ی مهاجرت فنلاند (Migri) برای اجازه‌ی اقامت، پس از تأییدیه‌ی صلاحیت (Eligibility Statement) از Business Finland',
    },
    status: 'open',
    fact: {
      en: 'You need a positive Eligibility Statement from Business Finland first, no more than 4 months old when you apply. If it is negative, only the slower entrepreneur permit is left.',
      fa: 'ابتدا به نظر مثبت Business Finland (Eligibility Statement) نیاز دارید که هنگام درخواست بیش از ۴ ماه از صدورش نگذشته باشد. اگر نظر منفی باشد، فقط مسیر کندتر اقامت کارآفرینی باقی می‌ماند.',
    },
    criteria: [
      {
        key: 'team-size',
        label: { en: 'At least 2 founders, all moving to Finland', fa: 'دست‌کم دو بنیان‌گذار که همگی به فنلاند نقل مکان کنند' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'team-ownership',
        label: { en: 'The team holds at least 60% of the company', fa: 'تیم دست‌کم ۶۰ درصد شرکت را در اختیار داشته باشد' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'full-time',
        label: { en: 'Founders work full-time in the company', fa: 'بنیان‌گذاران تمام‌وقت در شرکت کار کنند' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'innovation',
        label: { en: 'Innovative and scalable, with potential for rapid international growth', fa: 'نوآور و مقیاس‌پذیر، با توان رشد سریع بین‌المللی' },
        weight: 2,
        scoreable: false,
        note: { en: 'Business Finland judges this; you can only self-assess.', fa: 'Business Finland درباره‌ی این مورد قضاوت می‌کند؛ شما فقط می‌توانید خودارزیابی کنید.' },
      },
      {
        key: 'resources',
        label: { en: 'Enough resources and funding for early-stage development (no figure published)', fa: 'منابع و سرمایه‌ی کافی برای مرحله‌ی اولیه‌ی توسعه (رقمی اعلام نشده)' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Personal funds for at least 12 months', fa: 'تمکن مالی شخصی برای دست‌کم ۱۲ ماه' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 12_360, currency: 'EUR' },
        note: {
          en: 'EUR 1,030 net per month outside the large cities (12,360 a year), EUR 1,090 in other large municipalities, EUR 1,210 in the Helsinki area. A 2-year first permit is possible if 24 months are covered.',
          fa: '۱٬۰۳۰ یورو خالص در ماه خارج از شهرهای بزرگ (۱۲٬۳۶۰ یورو در سال)، ۱٬۰۹۰ یورو در دیگر شهرهای بزرگ و ۱٬۲۱۰ یورو در منطقه‌ی هلسینکی. اگر ۲۴ ماه پوشش داده شود، اقامت اول می‌تواند ۲ ساله باشد.',
        },
      },
      {
        key: 'business-finland',
        label: { en: 'Positive Eligibility Statement from Business Finland', fa: 'نظر مثبت Business Finland' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'helsinki',
        label: { en: 'Helsinki metropolitan area, net', fa: 'منطقه‌ی شهری هلسینکی، خالص' },
        amount: 1_210,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Money in your own bank account: savings, a funding decision (e.g. Business Finland) or income lasting the whole stay. Cover at least 1 year.',
          fa: 'پول در حساب بانکی خودتان: پس‌انداز، تصمیم تأمین مالی (مثلاً از Business Finland) یا درآمدی که در تمام مدت اقامت ادامه داشته باشد. دست‌کم ۱ سال را پوشش دهد.',
        },
      },
      { key: 'large-city', label: { en: 'Other large municipalities, net', fa: 'دیگر شهرهای بزرگ، خالص' }, amount: 1_090, currency: 'EUR', basis: 'month' },
      { key: 'other-city', label: { en: 'Other municipalities, net', fa: 'دیگر شهرها، خالص' }, amount: 1_030, currency: 'EUR', basis: 'month' },
      { key: 'helsinki-2nd-adult', label: { en: 'Helsinki: second adult in the family, add', fa: 'هلسینکی: بزرگسال دوم خانواده، افزوده' }, amount: 610, currency: 'EUR', basis: 'month' },
      { key: 'helsinki-1st-child', label: { en: 'Helsinki: first child, add', fa: 'هلسینکی: فرزند اول، افزوده' }, amount: 610, currency: 'EUR', basis: 'month' },
      { key: 'helsinki-2nd-child', label: { en: 'Helsinki: second child, add', fa: 'هلسینکی: فرزند دوم، افزوده' }, amount: 480, currency: 'EUR', basis: 'month' },
      { key: 'helsinki-3rd-child', label: { en: 'Helsinki: third to fifth child, each, add', fa: 'هلسینکی: فرزند سوم تا پنجم، هر کدام، افزوده' }, amount: 360, currency: 'EUR', basis: 'month' },
    ],
    processing: {
      text: {
        en: 'Usually 2 weeks via fast track (first permits applied for from abroad). In a minority of cases 2 months, the legal maximum.',
        fa: 'معمولاً ۲ هفته از مسیر سریع (برای اقامت اول که از خارج از فنلاند درخواست شود). در موارد کمتر ۲ ماه، که سقف قانونی است.',
      },
      source: 'https://migri.fi/en/processing-times',
    },
    fees: [
      { label: { en: 'Application fee, online', fa: 'هزینه‌ی درخواست، آنلاین' }, amount: 650, currency: 'EUR' },
      { label: { en: 'Application fee, paper', fa: 'هزینه‌ی درخواست، کاغذی' }, amount: 800, currency: 'EUR' },
    ],
    pr: {
      en: 'Since 8 Jan 2026: 6 years plus 2 years’ work history and Finnish or Swedish B1, or 4 years with high income, a Finnish master’s or C1 language.',
      fa: 'از ۸ ژانویه‌ی ۲۰۲۶: ۶ سال اقامت همراه با ۲ سال سابقه‌ی کار و زبان فنلاندی یا سوئدی در سطح B1، یا ۴ سال همراه با درآمد بالا، مدرک کارشناسی ارشد فنلاند یا زبان در سطح C1.',
    },
    sources: [
      { url: 'https://migri.fi/en/start-up-entrepreneur', checked: CHECKED, label: 'Migri (blocked; search-indexed text)' },
      { url: 'https://migri.fi/en/working-in-finland/income-requirement', checked: CHECKED, label: 'Migri income requirement (blocked)' },
      { url: 'https://migri.fi/en/income-requirement-for-family-members-of-a-person-who-has-been-granted-a-residence-permit-in-finland', checked: CHECKED, label: 'Migri family income table (blocked)' },
      { url: 'https://www.startupinfinland.com/applying', checked: CHECKED, label: 'Business Finland' },
      { url: 'https://migri.fi/en/processing-fees-and-payment-methods', checked: CHECKED, label: 'Migri fees 2026' },
      { url: 'https://migri.fi/en/processing-times', checked: CHECKED },
      { url: 'https://migri.fi/en/permanent-residence-permit', checked: CHECKED },
      { url: 'https://intermin.fi/en/areas-of-expertise/migration/government-programme-measures-to-reform-migration-policy/permanent-residence-permits', checked: CHECKED },
    ],
    verified: false,
    review:
      'UNVERIFIED: migri.fi blocked automated access (Cloudflare 403). Every Migri figure (funds 1,030/1,090/1,210, family add-ons, fees, processing) comes from Migri’s own text as indexed by search; page dates not seen. Figures are kept because they are Migri’s published text and match lib/funds.ts, but the app must show the source until someone reads the pages in a browser. CONFLICT: family table gives +360 per child from the third; a note on the same page says +310. PR moved on 8 Jan 2026 to 6 years (plus 2 years’ work and B1) or 4 years with income ≥ EUR 40,000, a recognised master’s plus 2 years’ work, or C1 plus 3 years’ work. Whether the start-up permit is an A (continuous) permit is not published on the pages read. Funds test uses the lowest yearly figure (12,360); Helsinki is 14,520. Business Finland statement could be scored via `endorsement`; left unscored per the notes.',
  },
  {
    key: 'fi-self-employed',
    country: 'FI',
    family: 'entrepreneur',
    name: { en: 'Residence permit for an entrepreneur', fa: 'اقامت کارآفرینی (خوداشتغالی) فنلاند' },
    agency: {
      en: 'ELY Centre (partial decision); Migri (permit)',
      fa: 'مرکز ELY (تصمیم جزئی)؛ اداره‌ی مهاجرت فنلاند، Migri (اجازه‌ی اقامت)',
    },
    status: 'open',
    fact: {
      en: 'The ELY Centre must find the business profitable enough to support you. A negative ELY decision means a negative Migri decision; most refusals are on this ground.',
      fa: 'مرکز ELY باید کسب‌وکار شما را آن‌قدر سودآور بداند که هزینه‌ی زندگی‌تان را تأمین کند. تصمیم منفی ELY به تصمیم منفی Migri می‌انجامد و بیشتر ردها به همین دلیل است.',
    },
    criteria: [
      {
        key: 'business-registered',
        label: { en: 'Own Business ID and entry in the Trade Register (PRH)', fa: 'شناسه‌ی کسب‌وکار و ثبت در دفتر ثبت تجاری (PRH)' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Freelancers and invoicing-service "light entrepreneurs" are excluded.',
          fa: 'فریلنسرها و «کارآفرینان سبک» که از خدمات صدور صورت‌حساب استفاده می‌کنند پذیرفته نمی‌شوند.',
        },
      },
      {
        key: 'works-in-finland',
        label: { en: 'You work in the company in Finland; ownership alone is not enough', fa: 'خودتان در فنلاند در شرکت کار کنید؛ مالکیت به‌تنهایی کافی نیست' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'profitability',
        label: { en: 'Profitable business, with a 2-year forecast', fa: 'کسب‌وکار سودآور، همراه با پیش‌بینی مالی ۲ ساله' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Means for the permit period, from the business or savings', fa: 'تأمین هزینه‌ی دوره‌ی اقامت از درآمد کسب‌وکار یا پس‌انداز' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 12_360, currency: 'EUR' },
        note: {
          en: 'Same income requirement as the start-up permit: EUR 1,030 to 1,210 net per month, depending on the city.',
          fa: 'همان شرط درآمدی اقامت استارتاپی: ۱٬۰۳۰ تا ۱٬۲۱۰ یورو خالص در ماه، بسته به شهر.',
        },
      },
      {
        key: 'ely-decision',
        label: { en: 'Positive ELY Centre partial decision', fa: 'تصمیم مثبت اولیه‌ی مرکز ELY' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'helsinki',
        label: { en: 'Helsinki metropolitan area, net', fa: 'منطقه‌ی شهری هلسینکی، خالص' },
        amount: 1_210,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Income from the business or savings shown on a bank statement, covering the permit period.',
          fa: 'درآمد کسب‌وکار یا پس‌انداز که در صورت‌حساب بانکی دیده شود و کل دوره‌ی اقامت را پوشش دهد.',
        },
      },
      { key: 'large-city', label: { en: 'Other large municipalities, net', fa: 'دیگر شهرهای بزرگ، خالص' }, amount: 1_090, currency: 'EUR', basis: 'month' },
      { key: 'other-city', label: { en: 'Other municipalities, net', fa: 'دیگر شهرها، خالص' }, amount: 1_030, currency: 'EUR', basis: 'month' },
    ],
    processing: {
      text: {
        en: 'Usually 1 month at Migri, in a minority of cases 2 months. The two-stage process (ELY, then Migri) adds time.',
        fa: 'معمولاً ۱ ماه در Migri و در موارد کمتر ۲ ماه. فرایند دومرحله‌ای (ابتدا ELY و سپس Migri) زمان بیشتری می‌برد.',
      },
      source: 'https://migri.fi/en/processing-times',
    },
    fees: [
      { label: { en: 'First permit, online', fa: 'اقامت اول، آنلاین' }, amount: 750, currency: 'EUR' },
      { label: { en: 'First permit, paper', fa: 'اقامت اول، کاغذی' }, amount: 900, currency: 'EUR' },
    ],
    pr: {
      en: 'Since 8 Jan 2026: 6 years plus 2 years’ work history and Finnish or Swedish B1, or 4 years with high income, a Finnish master’s or C1 language.',
      fa: 'از ۸ ژانویه‌ی ۲۰۲۶: ۶ سال اقامت همراه با ۲ سال سابقه‌ی کار و زبان فنلاندی یا سوئدی در سطح B1، یا ۴ سال همراه با درآمد بالا، مدرک کارشناسی ارشد فنلاند یا زبان در سطح C1.',
    },
    sources: [
      { url: 'https://migri.fi/en/entrepreneur', checked: CHECKED, label: 'Migri (blocked; search-indexed text)' },
      { url: 'https://migri.fi/en/-/changes-to-finnish-immigration-service-processing-fees-as-of-1-january-2026', checked: CHECKED, label: 'Migri fees from 1 Jan 2026' },
      { url: 'https://migri.fi/en/working-in-finland/income-requirement', checked: CHECKED, label: 'Migri income requirement (blocked)' },
      { url: 'https://migri.fi/en/permanent-residence-permit', checked: CHECKED },
    ],
    verified: false,
    review:
      'UNVERIFIED: migri.fi blocked automated access (Cloudflare 403); the income requirement, fees and processing times are from Migri’s own search-indexed text. Kept in the data because they are Migri’s published figures, but the app must show the source until the pages are read in a browser. Processing figure is from an older snapshot of Migri’s table. PR moved on 8 Jan 2026 to 6 years (plus 2 years’ work and B1), or 4 years with income ≥ EUR 40,000, a recognised master’s plus 2 years’ work, or C1 plus 3 years’ work.',
  },
  {
    key: 'fi-study',
    country: 'FI',
    family: 'study',
    name: { en: 'Residence permit for studies', fa: 'اقامت تحصیلی فنلاند' },
    agency: {
      en: 'Migri',
      fa: 'اداره‌ی مهاجرت فنلاند (Migri)',
    },
    status: 'open',
    fact: {
      en: 'EUR 9,600 plus first-year tuition must be in your own account when you apply. Doubt about funds is the most common cause of delay.',
      fa: '۹٬۶۰۰ یورو به‌علاوه‌ی شهریه‌ی سال اول باید هنگام درخواست در حساب خودتان باشد. تردید درباره‌ی تمکن مالی رایج‌ترین دلیل تأخیر است.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'Accepted to a degree programme', fa: 'پذیرش در یک برنامه‌ی تحصیلی دانشگاهی' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'EUR 9,600 in your account for a stay of a year or more', fa: '۹٬۶۰۰ یورو در حساب برای اقامت یک‌ساله یا بیشتر' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 9_600, currency: 'EUR' },
      },
      {
        key: 'tuition',
        label: { en: 'First-year tuition paid or held on top of the EUR 9,600', fa: 'شهریه‌ی سال اول پرداخت شده یا علاوه بر ۹٬۶۰۰ یورو موجود باشد' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'per-month',
        label: { en: 'Living costs per month', fa: 'هزینه‌ی زندگی ماهانه' },
        amount: 800,
        currency: 'EUR',
        basis: 'month',
      },
      {
        key: 'year',
        label: { en: 'For a stay of a year or more, at application', fa: 'برای اقامت یک‌ساله یا بیشتر، هنگام درخواست' },
        amount: 9_600,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'In your own account and withdrawable in Finland, plus first-year tuition on top.',
          fa: 'در حساب خودتان و قابل برداشت در فنلاند، به‌علاوه‌ی شهریه‌ی سال اول.',
        },
      },
    ],
    processing: {
      text: {
        en: 'About 82% of positive decisions within 30 days; otherwise about 90 days. Legal maximum 3 months.',
        fa: 'حدود ۸۲ درصد تصمیم‌های مثبت ظرف ۳۰ روز؛ در غیر این صورت حدود ۹۰ روز. سقف قانونی ۳ ماه است.',
      },
      source: 'https://migri.fi/en/-/current-information-about-the-processing-of-students-residence-permit-applications-2026',
    },
    fees: [
      { label: { en: 'Application fee, online', fa: 'هزینه‌ی درخواست، آنلاین' }, amount: 600, currency: 'EUR' },
      { label: { en: 'Application fee, paper', fa: 'هزینه‌ی درخواست، کاغذی' }, amount: 750, currency: 'EUR' },
    ],
    pr: {
      en: 'Since 8 Jan 2026, a Finnish master’s (or university bachelor’s) degree plus A2 language gives a path to permanent residence with no residence period.',
      fa: 'از ۸ ژانویه‌ی ۲۰۲۶، مدرک کارشناسی ارشد (یا کارشناسی دانشگاهی) فنلاند همراه با زبان در سطح A2 بدون شرط مدت اقامت راه اقامت دائم را باز می‌کند.',
    },
    sources: [
      { url: 'https://migri.fi/en/income-requirement-for-students', checked: CHECKED, label: 'Migri (blocked; search-indexed text)' },
      { url: 'https://migri.fi/en/residence-permit-application-for-studies', checked: CHECKED },
      { url: 'https://migri.fi/en/-/current-information-about-the-processing-of-students-residence-permit-applications-2026', checked: CHECKED },
    ],
    verified: false,
    review:
      'UNVERIFIED: migri.fi blocked automated access (Cloudflare 403); EUR 800/month and 9,600, fees and processing figures are from Migri’s search-indexed text. Kept because they are Migri’s published figures; the app must show the source until the pages are read in a browser. The figure was EUR 560 before 1 Nov 2024; older reduced rates for free housing (EUR 400 / 270) may be stale and are not encoded. PR rules moved on 8 Jan 2026 (general rule now 6 years); the degree path here needs no residence period.',
  },

  // ───────────────────────────── ESTONIA ─────────────────────────────
  {
    key: 'ee-startup',
    country: 'EE',
    family: 'startup',
    name: { en: 'Temporary residence permit for a start-up entrepreneur', fa: 'اقامت موقت کارآفرین استارتاپی استونی' },
    agency: {
      en: 'Police and Border Guard Board (PPA); Startup Estonia’s Startup Committee evaluates the company',
      fa: 'اداره‌ی پلیس و مرزبانی استونی (PPA)؛ کمیته‌ی استارتاپ Startup Estonia شرکت را ارزیابی می‌کند',
    },
    status: 'open',
    fact: {
      en: 'The Startup Committee’s approval decides it. Personal funds are only self-declared when you sign the application.',
      fa: 'تأیید کمیته‌ی استارتاپ استونی تعیین‌کننده است. تمکن مالی شخصی فقط با امضای فرم درخواست اعلام می‌شود.',
    },
    criteria: [
      {
        key: 'company',
        label: { en: 'Company registered in the Estonian Business Register; you hold shares', fa: 'شرکت در دفتر ثبت تجاری استونی ثبت شده باشد و شما سهام‌دار باشید' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'company-age',
        label: { en: 'Company no more than 10 years old', fa: 'عمر شرکت حداکثر ۱۰ سال' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'stage',
        label: { en: 'Has an MVP and first traction', fa: 'محصول اولیه (MVP) و نخستین نشانه‌های استقبال بازار' },
        weight: 2,
        scoreable: true,
        test: { field: 'businessStage', op: 'in', value: ['mvp', 'revenue', 'established'] },
      },
      {
        key: 'nature',
        label: { en: 'Innovative, repeatable model with global growth potential', fa: 'مدل نوآور و تکرارپذیر با توان رشد جهانی' },
        weight: 2,
        scoreable: false,
        note: { en: 'Technology-based or online. You can only self-assess this.', fa: 'مبتنی بر فناوری یا آنلاین. این مورد را فقط خودتان می‌توانید ارزیابی کنید.' },
      },
      {
        key: 'income',
        label: { en: 'Legal income of 4 × the subsistence level (EUR 880 a month)', fa: 'درآمد قانونی معادل ۴ برابر حداقل معیشت (۸۸۰ یورو در ماه)' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 10_560, currency: 'EUR' },
        note: { en: 'EUR 880 a month, or EUR 10,560 a year.', fa: '۸۸۰ یورو در ماه، یعنی ۱۰٬۵۶۰ یورو در سال.' },
      },
      {
        key: 'committee',
        label: { en: 'Startup Committee approval (up to 10 working days)', fa: 'تأیید کمیته‌ی استارتاپ (تا ۱۰ روز کاری)' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'health-insurance',
        label: { en: 'Health insurance', fa: 'بیمه‌ی درمانی' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'per-month',
        label: { en: 'Income per applicant', fa: 'درآمد برای هر متقاضی' },
        amount: 880,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Sufficient legal income, confirmed by signing the application. For the D-visa stage, Startup Estonia asks for documents showing means for each month planned in Estonia.',
          fa: 'درآمد قانونی کافی که با امضای فرم درخواست تأیید می‌شود. برای مرحله‌ی ویزای D، Startup Estonia مدارکی می‌خواهد که تمکن برای هر ماه اقامت برنامه‌ریزی‌شده در استونی را نشان دهد.',
        },
      },
    ],
    processing: {
      text: { en: 'PPA decides within 90 days; the card follows within 30 days.', fa: 'PPA ظرف ۹۰ روز تصمیم می‌گیرد و کارت اقامت ظرف ۳۰ روز پس از آن صادر می‌شود.' },
      source: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs',
    },
    fees: [
      { label: { en: 'Business permit fee, in Estonia', fa: 'هزینه‌ی اقامت کسب‌وکار، در استونی' }, amount: 350, currency: 'EUR' },
      { label: { en: 'Business permit fee, abroad', fa: 'هزینه‌ی اقامت کسب‌وکار، خارج از استونی' }, amount: 380, currency: 'EUR' },
      { label: { en: 'Start-up D-visa', fa: 'ویزای D استارتاپی' }, amount: 80, currency: 'EUR' },
    ],
    pr: {
      en: 'Permit for up to 5 years. Long-term resident permit after 5 years, with stable income, health insurance and Estonian B1.',
      fa: 'اقامت تا ۵ سال. اقامت بلندمدت پس از ۵ سال، با درآمد پایدار، بیمه‌ی درمانی و زبان استونیایی در سطح B1.',
    },
    sources: [
      { url: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs', checked: CHECKED, label: 'PPA' },
      { url: 'https://startupestonia.ee/startup-visa/', checked: CHECKED, label: 'Startup Estonia' },
      { url: 'https://www.politsei.ee/en/instructions/state-fee-amounts/residence-permit-and-rights-of-residence', checked: CHECKED, label: 'PPA fees from 1 Jan 2025' },
      { url: 'https://www.riigiteataja.ee/akt/118122025022', checked: CHECKED, label: '2026 State Budget Act (subsistence level EUR 220)' },
      { url: 'https://www.politsei.ee/en/instructions/residence-permit-for-a-permanent-resident/long-term-resident-s-residence-permit', checked: CHECKED },
    ],
    verified: true,
    review:
      'politsei.ee gives "4 × subsistence level" with no euro figure; EUR 880 = 4 × 220 (2026 State Budget Act). Re-check with the 2027 Budget Act. CONFLICT: Startup Estonia FAQ still says EUR 800 (old EUR 200 level). The EUR 350/380 fee is inferred from the business TRP fee line; the fee table has no start-up line. D-visa EUR 80 is quoted by Startup Estonia. Long-term resident PPA fee EUR 185 not encoded. Startup Committee approval could be scored via `endorsement`; left unscored per the notes.',
  },
  {
    key: 'ee-entrepreneur',
    country: 'EE',
    family: 'entrepreneur',
    name: { en: 'Temporary residence permit for business (shareholder or sole proprietor)', fa: 'اقامت موقت کسب‌وکار استونی (سهام‌دار یا مالک انفرادی)' },
    agency: {
      en: 'Police and Border Guard Board (PPA)',
      fa: 'اداره‌ی پلیس و مرزبانی استونی (PPA)',
    },
    status: 'open',
    fact: {
      en: 'As a shareholder you need EUR 65,000 actually invested in the company’s activities in Estonia, not just held as share capital.',
      fa: 'به‌عنوان سهام‌دار باید ۶۵٬۰۰۰ یورو واقعاً در فعالیت‌های شرکت در استونی سرمایه‌گذاری شده باشد، نه اینکه فقط به‌صورت سرمایه‌ی ثبتی باشد.',
    },
    criteria: [
      {
        key: 'investment-shareholder',
        label: { en: 'Shareholder: at least EUR 65,000 invested in Estonia', fa: 'سهام‌دار: دست‌کم ۶۵٬۰۰۰ یورو سرمایه‌گذاری در استونی' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 65_000, currency: 'EUR' },
      },
      {
        key: 'investment-sole-proprietor',
        label: { en: 'Sole proprietor (alternative): at least EUR 16,000 invested in the Estonian business', fa: 'مالک انفرادی (مسیر جایگزین): دست‌کم ۱۶٬۰۰۰ یورو سرمایه‌گذاری در کسب‌وکار استونیایی' },
        weight: 3,
        scoreable: false,
        test: { field: 'investment', op: 'gte', value: 16_000, currency: 'EUR' },
        note: {
          en: 'An alternative to the shareholder route, so it is listed but not scored.',
          fa: 'این مسیر جایگزین مسیر سهام‌داری است؛ به همین دلیل فهرست شده ولی امتیاز ندارد.',
        },
      },
      {
        key: 'income-shareholder',
        label: { en: 'Shareholder: legal income of 6 × the subsistence level (EUR 1,320 a month)', fa: 'سهام‌دار: درآمد قانونی معادل ۶ برابر حداقل معیشت (۱٬۳۲۰ یورو در ماه)' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 15_840, currency: 'EUR' },
        note: { en: 'EUR 1,320 a month, or EUR 15,840 a year.', fa: '۱٬۳۲۰ یورو در ماه، یعنی ۱۵٬۸۴۰ یورو در سال.' },
      },
      {
        key: 'company-registered',
        label: { en: 'Company registered in the Estonian Business Register', fa: 'ثبت شرکت در دفتر ثبت تجاری استونی' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'business-plan',
        label: { en: 'Business plan in Estonian or English, with a 2-year forecast and CVs', fa: 'طرح کسب‌وکار به استونیایی یا انگلیسی، همراه با پیش‌بینی ۲ ساله و رزومه‌ها' },
        weight: 1,
        scoreable: false,
        note: {
          en: 'The plan also gives your reasons for settling in Estonia. PPA judges it.',
          fa: 'طرح باید دلایل شما برای اقامت در استونی را هم توضیح دهد. PPA درباره‌ی آن قضاوت می‌کند.',
        },
      },
    ],
    money: [
      {
        key: 'investment-shareholder',
        label: { en: 'Investment, shareholder', fa: 'سرمایه‌گذاری، سهام‌دار' },
        amount: 65_000,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'Invested in the company’s activities in Estonia. The page does not specify the form of the investment.',
          fa: 'سرمایه‌گذاری‌شده در فعالیت‌های شرکت در استونی. صفحه‌ی رسمی شکل سرمایه‌گذاری را مشخص نکرده است.',
        },
      },
      { key: 'investment-sole-proprietor', label: { en: 'Investment, sole proprietor', fa: 'سرمایه‌گذاری، مالک انفرادی' }, amount: 16_000, currency: 'EUR', basis: 'once' },
      {
        key: 'income-shareholder',
        label: { en: 'Income, shareholder', fa: 'درآمد، سهام‌دار' },
        amount: 1_320,
        currency: 'EUR',
        basis: 'month',
        shows: { en: 'Self-declared on the application.', fa: 'با اظهار خودتان در فرم درخواست.' },
      },
    ],
    processing: {
      text: { en: '90 days, plus 30 days for the card.', fa: '۹۰ روز، به‌علاوه‌ی ۳۰ روز برای صدور کارت.' },
      source: 'https://www.politsei.ee/en/instructions/residence-permit-for-business',
    },
    fees: [
      { label: { en: 'Application fee, in Estonia', fa: 'هزینه‌ی درخواست، در استونی' }, amount: 350, currency: 'EUR' },
      { label: { en: 'Application fee, abroad', fa: 'هزینه‌ی درخواست، خارج از استونی' }, amount: 380, currency: 'EUR' },
    ],
    pr: {
      en: 'Permit for up to 5 years. Long-term resident permit after 5 years, with stable income, health insurance and Estonian B1.',
      fa: 'اقامت تا ۵ سال. اقامت بلندمدت پس از ۵ سال، با درآمد پایدار، بیمه‌ی درمانی و زبان استونیایی در سطح B1.',
    },
    sources: [
      { url: 'https://www.politsei.ee/en/instructions/residence-permit-for-business', checked: CHECKED, label: 'PPA' },
      { url: 'https://www.politsei.ee/en/instructions/residence-permit-for-business/for-sole-proprietors', checked: CHECKED, label: 'PPA, sole proprietors' },
      { url: 'https://www.politsei.ee/en/instructions/state-fee-amounts/residence-permit-and-rights-of-residence', checked: CHECKED, label: 'PPA fees from 1 Jan 2025' },
      { url: 'https://www.riigiteataja.ee/akt/118122025022', checked: CHECKED, label: '2026 State Budget Act (subsistence level EUR 220)' },
    ],
    verified: true,
    review:
      'Scores the shareholder path; the sole-proprietor EUR 16,000 is an alternative, listed unscored. The sole-proprietor income multiple was not read on the page: not encoded. EUR 1,320 = 6 × 220 (2026 subsistence level); the yearly test value 15,840 is 1,320 × 12. Re-check with the 2027 Budget Act.',
  },
  {
    key: 'ee-study',
    country: 'EE',
    family: 'study',
    name: { en: 'Temporary residence permit for study', fa: 'اقامت موقت تحصیلی استونی' },
    agency: {
      en: 'Police and Border Guard Board (PPA)',
      fa: 'اداره‌ی پلیس و مرزبانی استونی (PPA)',
    },
    status: 'open',
    fact: {
      en: 'You need the school’s admission and invitation, plus a declared income of EUR 880 a month.',
      fa: 'به پذیرش و دعوت‌نامه‌ی مؤسسه‌ی آموزشی و اعلام درآمد ۸۸۰ یورو در ماه نیاز دارید.',
    },
    criteria: [
      {
        key: 'admission',
        label: { en: 'The school confirms admission and sends an invitation', fa: 'مؤسسه‌ی آموزشی پذیرش را تأیید کند و دعوت‌نامه بفرستد' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'income',
        label: { en: 'Legal income of 4 × the subsistence level (EUR 880 a month)', fa: 'درآمد قانونی معادل ۴ برابر حداقل معیشت (۸۸۰ یورو در ماه)' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 10_560, currency: 'EUR' },
        note: {
          en: 'EUR 880 a month, or EUR 10,560 a year. The form asks for legal income over the previous 6 months.',
          fa: '۸۸۰ یورو در ماه، یعنی ۱۰٬۵۶۰ یورو در سال. فرم درخواست درآمد قانونی ۶ ماه گذشته را می‌پرسد.',
        },
      },
      {
        key: 'study-length',
        label: { en: 'Study length (needed only if study lasts more than 1 year)', fa: 'مدت تحصیل (فقط اگر بیش از ۱ سال باشد لازم است)' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'per-month',
        label: { en: 'Income per month', fa: 'درآمد ماهانه' },
        amount: 880,
        currency: 'EUR',
        basis: 'month',
        shows: { en: 'Self-declared on the application.', fa: 'با اظهار خودتان در فرم درخواست.' },
      },
    ],
    processing: {
      text: { en: '90 days, plus 30 days for the card.', fa: '۹۰ روز، به‌علاوه‌ی ۳۰ روز برای صدور کارت.' },
      source: 'https://www.politsei.ee/en/instructions/residence-permit-for-study',
    },
    fees: [
      { label: { en: 'Application fee, in Estonia', fa: 'هزینه‌ی درخواست، در استونی' }, amount: 225, currency: 'EUR' },
      { label: { en: 'Application fee, abroad', fa: 'هزینه‌ی درخواست، خارج از استونی' }, amount: 255, currency: 'EUR' },
    ],
    pr: {
      en: 'Permit for the study period, up to 5 years. Long-term residence needs 5 years plus Estonian B1.',
      fa: 'اقامت به مدت دوره‌ی تحصیل و حداکثر ۵ سال. اقامت بلندمدت به ۵ سال اقامت و زبان استونیایی در سطح B1 نیاز دارد.',
    },
    sources: [
      { url: 'https://www.politsei.ee/en/instructions/residence-permit-for-study', checked: CHECKED, label: 'PPA' },
      { url: 'https://www.politsei.ee/files/2025-05/student-guide.pdf', checked: CHECKED, label: 'PPA student guide 2025' },
      { url: 'https://www.riigiteataja.ee/akt/118122025022', checked: CHECKED, label: '2026 State Budget Act (subsistence level EUR 220)' },
    ],
    verified: true,
    review:
      'CONFLICT: the 2025 PPA student guide says EUR 800 (old subsistence level); 880 = 4 × 220 for 2026. Fee is the general TRP fee (no study-specific line); CONFLICT: the student guide also mentions EUR 120 in one checklist. Post-study stay not published on the page read; how study years count toward long-term residence not read.',
  },

  // ─────────────────────────── NETHERLANDS ───────────────────────────
  {
    key: 'nl-startup',
    country: 'NL',
    family: 'startup',
    name: { en: 'Residence permit for a start-up', fa: 'اقامت استارتاپی هلند' },
    agency: {
      en: 'IND, on the advice of RVO',
      fa: 'اداره‌ی مهاجرت و تابعیت هلند (IND)، با نظر RVO',
    },
    status: 'open',
    fact: {
      en: 'You need a signed contract with an RVO-listed facilitator. The permit lasts 1 year and cannot be extended; then you switch to the self-employed permit.',
      fa: 'به قرارداد امضاشده با یک تسهیل‌گر (facilitator) فهرست‌شده در RVO نیاز دارید. این اقامت ۱ ساله است و تمدید نمی‌شود؛ پس از آن باید به اقامت خوداشتغالی تغییر وضعیت دهید.',
    },
    criteria: [
      {
        key: 'facilitator',
        label: { en: 'Signed contract with an RVO-listed facilitator', fa: 'قرارداد امضاشده با تسهیل‌گر فهرست‌شده در RVO' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'The facilitator cannot hold a majority stake or be a relative.',
          fa: 'تسهیل‌گر نباید سهام اکثریت داشته باشد یا از بستگان شما باشد.',
        },
      },
      {
        key: 'innovation',
        label: { en: 'Innovative: new to the Dutch market, new technology, or a new way of organising', fa: 'نوآوری: محصول تازه در بازار هلند، فناوری جدید یا شیوه‌ی سازمان‌دهی نو' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'step-plan',
        label: { en: 'Step plan from idea to company', fa: 'برنامه‌ی گام‌به‌گام از ایده تا شرکت' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'kvk',
        label: { en: 'You and the facilitator are registered in the Trade Register (KvK)', fa: 'شما و تسهیل‌گر در دفتر ثبت تجاری هلند (KvK) ثبت شده باشید' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'active-role',
        label: { en: 'An active role, not just shareholder or financier', fa: 'نقش فعال، نه صرفاً سهام‌دار یا تأمین‌کننده‌ی مالی' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Funds for the whole stay (1 year)', fa: 'تمکن مالی برای کل دوره‌ی اقامت (۱ سال)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 21_201, currency: 'EUR' },
        note: {
          en: 'EUR 1,766.77 gross a month including holiday allowance, about EUR 21,201 for a year. The facilitator may finance your stay instead.',
          fa: '۱٬۷۶۶٫۷۷ یورو ناخالص در ماه با احتساب کمک‌هزینه‌ی تعطیلات، یعنی حدود ۲۱٬۲۰۱ یورو برای یک سال. تسهیل‌گر هم می‌تواند هزینه‌ی اقامت شما را تأمین کند.',
        },
      },
      {
        key: 'rvo-advice',
        label: { en: 'Positive RVO advice', fa: 'نظر مثبت RVO' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'gross-per-month',
        label: { en: 'Per month, gross, including holiday allowance', fa: 'ماهانه، ناخالص، با احتساب کمک‌هزینه‌ی تعطیلات' },
        amount: 1_766.77,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'In a Dutch personal or business bank account (or a postbus or notary third-party account), or the facilitator finances your stay.',
          fa: 'در حساب بانکی شخصی یا تجاری در هلند (یا حساب صندوق پستی یا حساب امانی دفتر اسناد رسمی)، یا اینکه تسهیل‌گر هزینه‌ی اقامت شما را بپردازد.',
        },
      },
      { key: 'year', label: { en: 'For 1 year, about', fa: 'برای ۱ سال، حدوداً' }, amount: 21_201, currency: 'EUR', basis: 'once', approx: true },
    ],
    processing: {
      text: { en: 'Decision within 90 days (can be extended).', fa: 'تصمیم ظرف ۹۰ روز (قابل تمدید).' },
      source: 'https://ind.nl/en/residence-permits/work/start-up',
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 423, currency: 'EUR' }],
    pr: {
      en: 'After the start-up year, switch to the self-employed permit. Permanent residence after 5 continuous years, with the income test and civic integration at A2.',
      fa: 'پس از سال استارتاپی باید به اقامت خوداشتغالی تغییر وضعیت دهید. اقامت دائم پس از ۵ سال اقامت پیوسته، با شرط درآمد و آزمون هم‌گرایی مدنی در سطح A2.',
    },
    sources: [
      { url: 'https://ind.nl/en/residence-permits/work/start-up', checked: CHECKED, label: 'IND, updated 8 Jun 2026' },
      { url: 'https://ind.nl/en/required-amounts-income-requirements', checked: CHECKED, label: 'IND amounts, valid 1 Jul to 31 Dec 2026' },
      { url: 'https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit', checked: CHECKED, label: 'IND, updated 20 May 2026' },
    ],
    verified: true,
    review:
      'The start-up page links to the amounts page without naming a figure; mapping it to the self-employed amount (1,766.77) is inferred. Do not use the EUR 3,122 "essential personnel" amount for founders. Amounts change 1 Jan 2027. The family-member amount (EUR 2,523.96/month from 1 Jul 2026) is a separate permit; the repo’s old "≈29,700 family" is stale. A facilitator statement of ≥ 3 months’ successful mentoring earns up to 30 points in the self-employed scoring. Civic integration fee EUR 254 not encoded.',
  },
  {
    key: 'nl-self-employed',
    country: 'NL',
    family: 'entrepreneur',
    name: { en: 'Residence permit for a self-employed person (points system)', fa: 'اقامت خوداشتغالی هلند (نظام امتیازی)' },
    agency: {
      en: 'IND; RVO scores the essential interest to the Dutch economy',
      fa: 'اداره‌ی مهاجرت و تابعیت هلند (IND)؛ RVO «منفعت اساسی برای اقتصاد هلند» را امتیاز می‌دهد',
    },
    status: 'open',
    fact: {
      en: 'You need at least 30 points in each of three areas (personal experience, business plan, added value), or 45 + 45 in the first two. US nationals can use DAFT with an investment of at least EUR 4,500 instead.',
      fa: 'باید در هر سه بخش (سابقه‌ی شخصی، طرح کسب‌وکار، ارزش افزوده) دست‌کم ۳۰ امتیاز بگیرید، یا در دو بخش نخست ۴۵ و ۴۵. اتباع آمریکا می‌توانند به‌جای آن از معاهده‌ی DAFT با دست‌کم ۴٬۵۰۰ یورو سرمایه‌گذاری استفاده کنند.',
    },
    criteria: [
      {
        key: 'points-personal',
        label: { en: 'Points for personal experience: at least 30', fa: 'امتیاز سابقه‌ی شخصی: دست‌کم ۳۰' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Education, entrepreneurship, management experience and income. Alternative: 45 here and 45 for the business plan, with added value then set to 30.',
          fa: 'تحصیلات، سابقه‌ی کارآفرینی، تجربه‌ی مدیریت و درآمد. مسیر جایگزین: ۴۵ امتیاز در این بخش و ۴۵ در طرح کسب‌وکار، که در آن صورت ارزش افزوده ۳۰ در نظر گرفته می‌شود.',
        },
      },
      {
        key: 'points-plan',
        label: { en: 'Points for the business plan: at least 30', fa: 'امتیاز طرح کسب‌وکار: دست‌کم ۳۰' },
        weight: 3,
        scoreable: false,
        note: { en: 'Market analysis, organisation and financing.', fa: 'تحلیل بازار، سازمان‌دهی و تأمین مالی.' },
      },
      {
        key: 'points-added-value',
        label: { en: 'Points for added value: at least 30', fa: 'امتیاز ارزش افزوده: دست‌کم ۳۰' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Innovation (max 20), job creation (max 40), investment (max 40). Freelance self-employment does not count as job creation.',
          fa: 'نوآوری (حداکثر ۲۰)، اشتغال‌زایی (حداکثر ۴۰) و سرمایه‌گذاری (حداکثر ۴۰). خوداشتغالی فریلنسری اشتغال‌زایی به حساب نمی‌آید.',
        },
      },
      {
        key: 'business-income',
        label: { en: 'Business profit of EUR 1,766.77 gross a month, shown in the plan', fa: 'سود ناخالص کسب‌وکار ۱٬۷۶۶٫۷۷ یورو در ماه، در پیش‌بینی طرح' },
        weight: 3,
        scoreable: false,
        test: { field: 'income', op: 'gte', value: 21_201, currency: 'EUR' },
        note: {
          en: 'A forecast of income from the Dutch business, not savings, so your current income cannot decide it.',
          fa: 'این پیش‌بینی درآمد از کسب‌وکار در هلند است، نه پس‌انداز؛ بنابراین درآمد فعلی شما ملاک نیست.',
        },
      },
      {
        key: 'kvk',
        label: { en: 'KvK registration and any permits the profession needs', fa: 'ثبت در KvK و مجوزهای لازم برای حرفه' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'dutch-client',
        label: { en: 'Freelancers: at least one Dutch client commission', fa: 'فریلنسرها: دست‌کم یک سفارش از مشتری هلندی' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'rvo-judgement',
        label: { en: 'RVO’s judgement within each area', fa: 'قضاوت RVO در هر بخش' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'business-profit',
        label: { en: 'Gross profit from the business, per month, including holiday allowance', fa: 'سود ناخالص کسب‌وکار در ماه، با احتساب کمک‌هزینه‌ی تعطیلات' },
        amount: 1_766.77,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Income from the business in the business plan’s forecast. This is income, not savings.',
          fa: 'درآمد کسب‌وکار در پیش‌بینی طرح کسب‌وکار. این شرط درآمدی است، نه پس‌انداز.',
        },
      },
      {
        key: 'daft-investment',
        label: { en: 'US nationals under DAFT: investment', fa: 'اتباع آمریکا در چارچوب DAFT: سرمایه‌گذاری' },
        amount: 4_500,
        currency: 'EUR',
        basis: 'once',
      },
    ],
    processing: {
      text: { en: '90 days, extendable by up to 6 months if RVO advice is requested.', fa: '۹۰ روز؛ اگر نظر RVO خواسته شود تا ۶ ماه قابل تمدید است.' },
      source: 'https://ind.nl/en/residence-permits/work/residence-permit-self-employed-person',
    },
    fees: [{ label: { en: 'Application fee', fa: 'هزینه‌ی درخواست' }, amount: 423, currency: 'EUR' }],
    pr: {
      en: 'Permit for up to 2 years at a time. Permanent residence after 5 continuous years, with the income test and civic integration at A2.',
      fa: 'اقامت هر بار تا ۲ سال. اقامت دائم پس از ۵ سال اقامت پیوسته، با شرط درآمد و آزمون هم‌گرایی مدنی در سطح A2.',
    },
    sources: [
      { url: 'https://ind.nl/en/residence-permits/work/residence-permit-self-employed-person', checked: CHECKED, label: 'IND, updated 13 Oct 2026' },
      { url: 'https://wetten.overheid.nl/BWBR0012002', checked: CHECKED, label: 'Voorschrift Vreemdelingen 2000, Art. 3.20a and Annex 8a' },
      { url: 'https://ind.nl/en/documents/07-2022/dutch-scoring-system-business-of-essential-interest.pdf', checked: CHECKED, label: 'IND scoring system (2022)' },
      { url: 'https://ind.nl/en/required-amounts-income-requirements', checked: CHECKED, label: 'IND amounts, valid 1 Jul to 31 Dec 2026' },
    ],
    verified: true,
    review:
      'Points sub-scores cannot be computed: the sub-criterion maximums for personal experience and business plan were not read (IND PDF encoded; Annex 8a version read 2016-10-01), and the "300 total" could not be confirmed. Score only the 30/30/30 or 45/45 rule. Exemptions not encoded as criteria (no nationality field): Turkish nationals (business plan only), EU long-term residents, independent professions, US (DAFT) and Japanese treaty nationals (≥ EUR 4,500 for most business forms). Income test is a business-profit forecast, so it is unscored though its threshold is held in the test. Start-up holders switching pay a different fee (amount not published). Amount changes 1 Jan 2027.',
  },
  {
    key: 'nl-study',
    country: 'NL',
    family: 'study',
    name: { en: 'Student residence permit (university or higher professional education)', fa: 'اقامت تحصیلی هلند (دانشگاه یا آموزش عالی حرفه‌ای)' },
    agency: {
      en: 'IND; the recognised institution applies as sponsor',
      fa: 'اداره‌ی مهاجرت و تابعیت هلند (IND)؛ مؤسسه‌ی آموزشی شناخته‌شده به‌عنوان حامی درخواست می‌دهد',
    },
    status: 'open',
    fact: {
      en: 'EUR 1,130.77 a month, in practice EUR 13,569.24 for the first year, must be available before the institution files your application.',
      fa: 'مبلغ ۱٬۱۳۰٫۷۷ یورو در ماه، که در عمل برای سال اول ۱۳٬۵۶۹٫۲۴ یورو می‌شود، باید پیش از ثبت درخواست از سوی مؤسسه موجود باشد.',
    },
    criteria: [
      {
        key: 'recognised-sponsor',
        label: { en: 'Institution recognised by the IND as a sponsor', fa: 'مؤسسه‌ی آموزشی به‌عنوان اسپانسر مورد تأیید IND باشد' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'funds',
        label: { en: 'Funds for the first year (study norm 2026)', fa: 'تمکن مالی برای سال اول (نُرم تحصیلی ۲۰۲۶)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 13_569.24, currency: 'EUR' },
        note: {
          en: 'EUR 1,130.77 a month, excluding tuition. Often paid as a 12-month deposit into the institution’s account.',
          fa: '۱٬۱۳۰٫۷۷ یورو در ماه، بدون شهریه. اغلب به‌صورت سپرده‌ی ۱۲ ماهه به حساب مؤسسه پرداخت می‌شود.',
        },
      },
      {
        key: 'language',
        label: { en: 'Language: none for the permit; set by the institution', fa: 'زبان: برای اقامت شرطی ندارد؛ مؤسسه تعیین می‌کند' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'per-month',
        label: { en: 'Study norm per month, excluding tuition', fa: 'نُرم تحصیلی ماهانه، بدون شهریه' },
        amount: 1_130.77,
        currency: 'EUR',
        basis: 'month',
        shows: {
          en: 'Often a 12-month deposit into the institution’s account. A financier in the Netherlands is allowed at higher amounts (EUR 2,766.67 to 3,654.73 a month, depending on household).',
          fa: 'اغلب سپرده‌ی ۱۲ ماهه به حساب مؤسسه. تأمین‌کننده‌ی مالی مقیم هلند هم با مبالغ بالاتر پذیرفته می‌شود (۲٬۷۶۶٫۶۷ تا ۳٬۶۵۴٫۷۳ یورو در ماه، بسته به خانوار).',
        },
      },
      { key: 'year', label: { en: 'For the first year', fa: 'برای سال اول' }, amount: 13_569.24, currency: 'EUR', basis: 'once' },
    ],
    processing: {
      text: { en: '60 days (can be extended).', fa: '۶۰ روز (قابل تمدید).' },
      source: 'https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education',
    },
    fees: [{ label: { en: 'Application fee (paid via the institution)', fa: 'هزینه‌ی درخواست (از طریق مؤسسه پرداخت می‌شود)' }, amount: 254, currency: 'EUR' }],
    pr: {
      en: 'Permit for the study length plus 3 months (max 5 years), then the orientation-year permit. Study is a temporary purpose for permanent residence.',
      fa: 'اقامت به مدت دوره‌ی تحصیل به‌علاوه‌ی ۳ ماه (حداکثر ۵ سال) و سپس اقامت سال جست‌وجو (orientation year). تحصیل برای اقامت دائم هدفی موقت به شمار می‌رود.',
    },
    sources: [
      { url: 'https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education', checked: CHECKED, label: 'IND, updated 21 Sep 2026' },
      { url: 'https://ind.nl/en/income-requirements-study', checked: CHECKED },
      { url: 'https://ind.nl/en/required-amounts-income-requirements', checked: CHECKED },
    ],
    verified: true,
    review:
      'Study norm changes yearly on 1 Jan; the IND news page also mentions 1 Jul adjustments (minor CONFLICT). Admission is implied (the institution files) and not in the notes’ table, so no admission criterion. Study progress (≥ 50% of credits each year) applies after arrival, not at entry: not encoded. How study years count toward the 5-year PR clock was not checked. Work: 16 h/week or full-time Jun–Aug.',
  },

  // ───────────────────────────── ITALY ─────────────────────────────
  {
    key: 'it-startup',
    country: 'IT',
    family: 'startup',
    name: { en: 'Italia Startup Visa', fa: 'ویزای استارتاپی ایتالیا (Italia Startup Visa)' },
    agency: {
      en: 'ISV Technical Committee at MIMIT (nulla osta); consulate (visa); Questura (permit)',
      fa: 'کمیته‌ی فنی ISV در وزارت MIMIT (مجوز nulla osta)؛ کنسولگری (ویزا)؛ Questura (اجازه‌ی اقامت)',
    },
    status: 'open',
    fact: {
      en: 'The Committee’s nulla osta decides it. Within it, certified project funds of EUR 50,000 and previous-year income above about EUR 8,500 are hard floors.',
      fa: 'مجوز (nulla osta) کمیته تعیین‌کننده است. در این میان، ۵۰٬۰۰۰ یورو سرمایه‌ی تأییدشده برای پروژه و درآمد سال قبل بیش از حدود ۸٬۵۰۰ یورو حداقل‌های قطعی‌اند.',
    },
    criteria: [
      {
        key: 'project-funds',
        label: { en: 'At least EUR 50,000 available for the startup (whole team)', fa: 'دست‌کم ۵۰٬۰۰۰ یورو در دسترس برای استارتاپ (برای کل تیم)' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 50_000, currency: 'EUR' },
        note: {
          en: 'The guidelines call this purely indicative; the Committee may require more.',
          fa: 'رهنمودها این رقم را صرفاً تقریبی می‌دانند و کمیته ممکن است مبلغ بیشتری بخواهد.',
        },
      },
      {
        key: 'income',
        label: { en: 'Previous-year income above about EUR 8,500', fa: 'درآمد سال قبل بیش از حدود ۸٬۵۰۰ یورو' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 8_500, currency: 'EUR' },
        note: {
          en: 'The minimum for exemption from health-care co-payments. An income test, not savings.',
          fa: 'حداقل درآمد برای معافیت از سهم پرداختی خدمات درمانی. این شرط درآمدی است، نه پس‌انداز.',
        },
      },
      {
        key: 'team-size',
        label: { en: 'Up to 5 nulla osta per startup (10 exceptionally)', fa: 'حداکثر ۵ مجوز برای هر استارتاپ (در موارد استثنایی ۱۰)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'innovative-startup',
        label: { en: 'Innovative startup under Art. 25, DL 179/2012 (at least 1 of 3 indicators: R&D, qualified staff, IP)', fa: 'استارتاپ نوآور طبق ماده‌ی ۲۵ فرمان ۱۷۹/۲۰۱۲ (دست‌کم ۱ از ۳ شاخص: تحقیق و توسعه، نیروی متخصص، مالکیت فکری)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'joining-existing',
        label: { en: 'Joining an existing startup: EUR 100,000 own resources; company at least 3 years old', fa: 'پیوستن به استارتاپ موجود: ۱۰۰٬۰۰۰ یورو منابع شخصی و دست‌کم ۳ سال عمر شرکت' },
        weight: 2,
        scoreable: false,
        test: { field: 'investment', op: 'gte', value: 100_000, currency: 'EUR' },
        note: {
          en: 'Applies only if you join an existing startup, so it is listed but not scored.',
          fa: 'فقط در صورت پیوستن به استارتاپ موجود اعمال می‌شود؛ به همین دلیل فهرست شده ولی امتیاز ندارد.',
        },
      },
      {
        key: 'committee',
        label: { en: 'Committee approval (simple majority)', fa: 'تأیید کمیته (با اکثریت ساده)' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'excluded-activities',
        label: { en: 'Mainly consulting or brokerage activities are excluded (since Dec 2024)', fa: 'فعالیت‌های عمدتاً مشاوره‌ای یا واسطه‌گری پذیرفته نمی‌شوند (از دسامبر ۲۰۲۴)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'education-fit',
        label: { en: 'Education matching the project', fa: 'تناسب تحصیلات با پروژه' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'project-funds',
        label: { en: 'Project funds, per project', fa: 'سرمایه‌ی پروژه، برای هر پروژه' },
        amount: 50_000,
        currency: 'EUR',
        basis: 'once',
        shows: {
          en: 'Certified: a bank letter, an investor letter, or a crowdfunding platform.',
          fa: 'تأییدشده: نامه‌ی بانک، نامه‌ی سرمایه‌گذار یا پلتفرم تأمین مالی جمعی.',
        },
      },
      {
        key: 'prev-year-income',
        label: { en: 'Previous-year income, per applicant', fa: 'درآمد سال قبل، برای هر متقاضی' },
        amount: 8_500,
        currency: 'EUR',
        basis: 'prevYearIncome',
        approx: true,
        shows: { en: 'A tax return or certificate of minimum income for the previous year.', fa: 'اظهارنامه‌ی مالیاتی یا گواهی حداقل درآمد سال قبل.' },
      },
    ],
    processing: {
      text: {
        en: 'Nulla osta within 30 days. Consular visa time varies by consulate.',
        fa: 'مجوز (nulla osta) ظرف ۳۰ روز. زمان صدور ویزا در کنسولگری‌ها متفاوت است.',
      },
      source: 'https://italiastartupvisa.mise.gov.it/',
    },
    fees: [
      { label: { en: 'Permit kit postal bulletin', fa: 'فیش پستی کیت اقامت' }, amount: 30.46, currency: 'EUR' },
      { label: { en: 'Permit kit postal bulletin (second)', fa: 'فیش پستی کیت اقامت (دوم)' }, amount: 50, currency: 'EUR' },
      { label: { en: 'Revenue stamp', fa: 'تمبر مالیاتی' }, amount: 16, currency: 'EUR' },
    ],
    pr: {
      en: '1-year visa, then a 1-year permit, renewable for 2 years. EU long-term permit after 5 years of legal residence, with income at least the assegno sociale and Italian A2.',
      fa: 'ویزای ۱ ساله، سپس اقامت ۱ ساله که برای ۲ سال تمدید می‌شود. اقامت بلندمدت اتحادیه‌ی اروپا پس از ۵ سال اقامت قانونی، با درآمدی دست‌کم برابر assegno sociale و زبان ایتالیایی در سطح A2.',
    },
    sources: [
      { url: 'https://italiastartupvisa.mise.gov.it/', checked: CHECKED, label: 'MIMIT ISV portal' },
      { url: 'https://italiastartupvisa.mise.gov.it/media/documents/Guidelines%20ISV%20ENG%2020_03_2018%20def.pdf', checked: CHECKED, label: 'ISV Guidelines 20/03/2018' },
      { url: 'https://conschicago.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visa-categories-and-requirements/italia-start-up-visanational-long-term-visa/', checked: CHECKED, label: 'Consulate Chicago' },
      { url: 'https://ambmaputo.esteri.it/wp-content/uploads/2026/06/LAVORO-AUTONOMO-START-UP.pdf', checked: CHECKED, label: 'Consulate checklist 2026' },
      { url: 'https://www.poliziadistato.it/articolo/permesso-di-soggiorno-ue-per-soggiornanti-di-lungo-periodo.--carta-di-soggiorno-per-cittadini-stranieri', checked: CHECKED, label: 'Polizia di Stato, EU long-term permit' },
    ],
    verified: true,
    review:
      'CONFLICT: the ISV portal, the 2018 guidelines and the NY consulate say about EUR 8,500; the Chicago consulate says 8,400. Using 8,500 approx, as lib/funds.ts does. Whether ISV entries count against the 650/year self-employment quota (Circular 8047, 16 Oct 2025) is not confirmed; do not claim "outside quota". Consular visa fee not published on the portal. 2026 assegno sociale figure not read. The consulting/brokerage exclusion (Law 193/2024) and the EUR 100,000 joining rule come from the repo, per the notes. Prior link to Italy and the certified-incubator route not encoded. Committee approval could be scored via `endorsement`; left unscored per the notes.',
  },
  {
    key: 'it-self-employed',
    country: 'IT',
    family: 'entrepreneur',
    name: { en: 'Self-employment visa (lavoro autonomo)', fa: 'ویزای کار مستقل ایتالیا (lavoro autonomo)' },
    agency: {
      en: 'Questura (nulla osta); consulate (visa); quotas set by the DPCM flussi',
      fa: 'Questura (مجوز nulla osta)؛ کنسولگری (ویزا)؛ سهمیه‌ها را فرمان DPCM flussi تعیین می‌کند',
    },
    status: 'limited',
    fact: {
      en: 'Entries are capped at 650 a year for 2026–2028. What decides it is whether quota is left when the Questura issues the nulla osta.',
      fa: 'سهمیه‌ی ورود برای سال‌های ۲۰۲۶ تا ۲۰۲۸ سالانه ۶۵۰ نفر است. عامل تعیین‌کننده این است که هنگام صدور مجوز (nulla osta) از سوی Questura هنوز سهمیه باقی مانده باشد یا نه.',
    },
    criteria: [
      {
        key: 'income',
        label: { en: 'Previous-year income above about EUR 8,500', fa: 'درآمد سال قبل بیش از حدود ۸٬۵۰۰ یورو' },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 8_500, currency: 'EUR' },
        note: {
          en: 'The minimum for exemption from health-care co-payments. Bank guarantees are not accepted.',
          fa: 'حداقل درآمد برای معافیت از سهم پرداختی خدمات درمانی. ضمانت‌نامه‌ی بانکی پذیرفته نمی‌شود.',
        },
      },
      {
        key: 'activity-resources',
        label: { en: 'Resources for the activity of at least EUR 14,000 (Chamber of Commerce parameters)', fa: 'منابع دست‌کم ۱۴٬۰۰۰ یورو برای فعالیت (معیارهای اتاق بازرگانی)' },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 14_000, currency: 'EUR' },
      },
      {
        key: 'investor-plan',
        label: { en: 'Entrepreneur with an investment plan: at least EUR 500,000 and 3 new jobs', fa: 'کارآفرین با طرح سرمایه‌گذاری: دست‌کم ۵۰۰٬۰۰۰ یورو و ایجاد ۳ شغل جدید' },
        weight: 3,
        scoreable: false,
        test: { field: 'investment', op: 'gte', value: 500_000, currency: 'EUR' },
        note: {
          en: 'A separate contingent of 500 a year, an alternative to the general route, so it is listed but not scored.',
          fa: 'این مسیر سهمیه‌ی جداگانه‌ی سالانه ۵۰۰ نفر دارد و جایگزین مسیر عمومی است؛ به همین دلیل فهرست شده ولی امتیاز ندارد.',
        },
      },
      {
        key: 'professional-register',
        label: { en: 'Professionals: registered in the relevant Italian professional order or register', fa: 'صاحبان حرفه: ثبت در نظام یا دفتر حرفه‌ای مربوط در ایتالیا' },
        weight: 2,
        scoreable: false,
        note: { en: 'Health professions also need degree recognition.', fa: 'حرفه‌های درمانی به ارزش‌گذاری مدرک هم نیاز دارند.' },
      },
      {
        key: 'accommodation',
        label: { en: 'Suitable accommodation', fa: 'محل سکونت مناسب' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'quota',
        label: { en: 'Quota: 650 self-employment entries a year (2026–2028), 50 reserved for people of Italian origin', fa: 'سهمیه: سالانه ۶۵۰ ورود برای کار مستقل (۲۰۲۶ تا ۲۰۲۸)، که ۵۰ مورد آن برای افراد ایتالیایی‌تبار است' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Applications are accepted year-round while quota remains; there is no click day.',
          fa: 'تا زمانی که سهمیه باقی است، درخواست‌ها در طول سال پذیرفته می‌شوند و روز ثبت‌نام مشخصی (click day) ندارد.',
        },
      },
      {
        key: 'questura-nulla-osta',
        label: { en: 'Questura nulla osta, no more than 90 days old', fa: 'مجوز (nulla osta) از Questura که بیش از ۹۰ روز از صدورش نگذشته باشد' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'prev-year-income',
        label: { en: 'Previous-year income', fa: 'درآمد سال قبل' },
        amount: 8_500,
        currency: 'EUR',
        basis: 'prevYearIncome',
        approx: true,
        shows: { en: 'A tax return. Bank guarantees are not accepted.', fa: 'اظهارنامه‌ی مالیاتی. ضمانت‌نامه‌ی بانکی پذیرفته نمی‌شود.' },
      },
      {
        key: 'activity-resources',
        label: { en: 'Resources for the activity', fa: 'منابع لازم برای فعالیت' },
        amount: 14_000,
        currency: 'EUR',
        basis: 'once',
        shows: { en: 'Certified by the Chamber of Commerce.', fa: 'با تأیید اتاق بازرگانی.' },
      },
      { key: 'investor-plan', label: { en: 'Investor route', fa: 'مسیر سرمایه‌گذار' }, amount: 500_000, currency: 'EUR', basis: 'once' },
    ],
    pr: {
      en: 'EU long-term permit after 5 years of legal residence, with income at least the assegno sociale and Italian A2.',
      fa: 'اقامت بلندمدت اتحادیه‌ی اروپا پس از ۵ سال اقامت قانونی، با درآمدی دست‌کم برابر assegno sociale و زبان ایتالیایی در سطح A2.',
    },
    sources: [
      { url: 'https://consnewyork.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visas-to-enter-italy/independent-work/', checked: CHECKED, label: 'Consulate New York' },
      { url: 'https://www.lavoro.gov.it/documenti-e-norme/normativa/Circolare-8047-del-16102025', checked: CHECKED, label: 'Circular 8047, 16 Oct 2025' },
      { url: 'https://prefettura.interno.gov.it/it/prefetture/macerata/comunicazioni/dpcm-2-ottobre-2025-programmazione-dei-flussi-dingresso-2026-2028', checked: CHECKED, label: 'DPCM 2 Oct 2025, flussi 2026–2028' },
      { url: 'https://ambdhaka.esteri.it/wp-content/uploads/2026/07/Self-employment.pdf', checked: CHECKED, label: 'Embassy Dhaka checklist, Jul 2026' },
    ],
    verified: true,
    review:
      'CONFLICT on income: about EUR 8,500 (ISV portal, NY consulate) vs 8,400 (Chicago); using 8,500 approx, as lib/funds.ts does. Circular 8047 PDF and the Dhaka checklist are not machine-readable; figures from indexed text. The NY consulate says professionals’ requirements "are being updated". Processing: some consulates quote up to 120 days, officially not published, so no processing entry. Consular visa fee not published on the pages read. The EUR 14,000 is "triple the minimum social welfare yearly income" per the NY consulate.',
  },
  {
    key: 'it-study',
    country: 'IT',
    family: 'study',
    name: { en: 'Study visa (university enrolment)', fa: 'ویزای تحصیلی ایتالیا (ثبت‌نام دانشگاهی)' },
    agency: {
      en: 'Italian consulate (visa); pre-enrolment through Universitaly (MUR)',
      fa: 'کنسولگری ایتالیا (ویزا)؛ پیش‌ثبت‌نام از طریق Universitaly (وزارت MUR)',
    },
    status: 'open',
    fact: {
      en: 'You need EUR 10,179.85 of traceable funds for the year plus a pre-enrolment validated on Universitaly. Apply by 30 Nov 2026 for 2026/27.',
      fa: 'به ۱۰٬۱۷۹٫۸۵ یورو پول با منشأ قابل ردیابی برای یک سال و پیش‌ثبت‌نام تأییدشده در Universitaly نیاز دارید. برای سال تحصیلی ۲۰۲۶/۲۷ تا ۳۰ نوامبر ۲۰۲۶ درخواست دهید.',
    },
    criteria: [
      {
        key: 'pre-enrolment',
        label: { en: 'Pre-enrolment validated on Universitaly without reservation', fa: 'پیش‌ثبت‌نام بدون قید و شرط تأییدشده در Universitaly' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'funds',
        label: { en: 'Funds of EUR 10,179.85 a year (2026/27)', fa: 'تمکن مالی ۱۰٬۱۷۹٫۸۵ یورو در سال (۲۰۲۶/۲۷)' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 10_179.85, currency: 'EUR' },
        note: { en: 'About EUR 783.06 a month, excluding tuition and the return ticket.', fa: 'حدود ۷۸۳٫۰۶ یورو در ماه، بدون شهریه و بلیت بازگشت.' },
      },
      {
        key: 'tuition',
        label: { en: 'Tuition added on top of the funds if unpaid', fa: 'شهریه، در صورت پرداخت‌نشدن، به تمکن اضافه می‌شود' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'return-ticket',
        label: { en: 'Return ticket, separately', fa: 'بلیت بازگشت، جداگانه' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'genuine-funds',
        label: { en: 'The consulate finds the funds genuine', fa: 'کنسولگری منشأ تمکن را معتبر بداند' },
        weight: 2,
        scoreable: false,
        note: {
          en: 'A one-off deposit or the balance alone is not conclusive.',
          fa: 'یک واریز یک‌باره یا صرفِ موجودی حساب کافی نیست.',
        },
      },
    ],
    money: [
      {
        key: 'year',
        label: { en: 'Living costs per academic year', fa: 'هزینه‌ی زندگی برای هر سال تحصیلی' },
        amount: 10_179.85,
        currency: 'EUR',
        basis: 'perYear',
        shows: {
          en: 'Lawful, traceable sources: personal or family funds, a blocked account in your name, or a scholarship. Excludes tuition and the return ticket.',
          fa: 'از منابع قانونی و قابل ردیابی: پول شخصی یا خانوادگی، حساب مسدود به نام خودتان یا بورسیه. شهریه و بلیت بازگشت جداگانه است.',
        },
      },
    ],
    processing: {
      text: { en: 'Up to 90 days (Paris consulate). Apply by 30 Nov 2026 for 2026/27.', fa: 'تا ۹۰ روز (کنسولگری پاریس). برای سال تحصیلی ۲۰۲۶/۲۷ تا ۳۰ نوامبر ۲۰۲۶ درخواست دهید.' },
      source: 'https://consparigi.esteri.it/fr/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-studio-study-visa-visa-etudiant/',
    },
    fees: [{ label: { en: 'Type D study visa (Paris; consulates may vary)', fa: 'ویزای تحصیلی نوع D (پاریس؛ ممکن است در کنسولگری‌ها متفاوت باشد)' }, amount: 50, currency: 'EUR' }],
    pr: {
      en: 'EU long-term permit after 5 years of legal residence, with income at least the assegno sociale and Italian A2.',
      fa: 'اقامت بلندمدت اتحادیه‌ی اروپا پس از ۵ سال اقامت قانونی، با درآمدی دست‌کم برابر assegno sociale و زبان ایتالیایی در سطح A2.',
    },
    sources: [
      { url: 'https://consparigi.esteri.it/fr/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-studio-study-visa-visa-etudiant/', checked: CHECKED, label: 'Consulate Paris, AY 2026/27' },
      { url: 'https://ambaddisabeba.esteri.it/wp-content/uploads/2026/06/9.-STUDIO-Immatricolazione-ENG.pdf', checked: CHECKED, label: 'Embassy Addis Ababa, Jun 2026' },
      { url: 'https://ambabudhabi.esteri.it/wp-content/uploads/2026/07/GUIDELINES-and-UNIVERSITY-ENROLMENT-CHECKLIST-2026-27_rev2.pdf', checked: CHECKED, label: 'Embassy Abu Dhabi, Jul 2026' },
    ],
    verified: true,
    review:
      'Funds change each academic year; re-check for 2027/28. Return ticket: Jerusalem asks about EUR 500 extra (one consulate; not encoded). Kuala Lumpur refuses cash and guarantees from non-family members. Whether study years count toward the 5-year PR clock: confirm. Visa fee and processing are the Paris consulate’s figures.',
  },
];
