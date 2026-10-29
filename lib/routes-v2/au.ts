// VisaRoads v2 routes, Australia. Checked 27 Oct 2026 on immi.homeaffairs.gov.au
// (read in a browser: the site answers 403 to plain fetches). Research notes:
// docs/research/app-v3/au.md. Follow the rules in ./types.ts.
import type { RouteV2 } from './types';

const CHECKED = '2026-10-27';

const NIV = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858';
const NIV_PRIORITIES = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/priorities';
const NIV_ROUND = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/current-invitation-round';
const BIIP = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188';
const V189 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-tested';
const V190 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190';
const ROUNDS = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds';
const V500 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500';
const CITIZEN = 'https://immi.homeaffairs.gov.au/citizenship/become-a-citizen/permanent-resident';

const AU_CITIZENSHIP_LINE = {
  en: 'Citizenship after 4 years of lawful residence in Australia, the last 12 months as a permanent resident, with no more than 12 months away in total (90 days in the last year).',
  fa: 'شهروندی پس از ۴ سال اقامت قانونی در استرالیا که ۱۲ ماه آخر آن با اقامت دائم باشد؛ مجموع غیبت از کشور نباید از ۱۲ ماه بیشتر شود (و در سال آخر از ۹۰ روز).',
};

export const ROUTES_AU: RouteV2[] = [
  // ───────────────────────────── NATIONAL INNOVATION VISA ─────────────────────────────
  {
    key: 'au-niv',
    country: 'AU',
    family: 'startup',
    name: { en: 'National Innovation visa (subclass 858)', fa: 'ویزای نوآوری ملی استرالیا (National Innovation, subclass 858)' },
    agency: { en: 'Department of Home Affairs', fa: 'وزارت امور داخلی استرالیا (Department of Home Affairs)' },
    status: 'open',
    fact: {
      en: 'Invitation only, and a permanent visa from day one. In April to June 2026 the Department received 2,166 expressions of interest and issued 248 invitations; most went to Tier One sectors such as critical technologies.',
      fa: 'فقط با دعوت‌نامه، و از همان روز اول اقامت دائم است. در آوریل تا ژوئن ۲۰۲۶ وزارت امور داخلی ۲٬۱۶۶ ابراز تمایل (EOI) دریافت کرد و ۲۴۸ دعوت‌نامه فرستاد؛ بیشتر آن‌ها به بخش‌های ردهٔ اول مانند فناوری‌های حیاتی رسید.',
    },
    criteria: [
      {
        key: 'achievement',
        label: {
          en: 'Internationally recognised record of exceptional and outstanding achievement (profession, sport, arts, or academia and research)',
          fa: 'سابقهٔ دستاورد استثنایی و برجسته با شناخت بین‌المللی (در حرفه، ورزش، هنر یا پژوهش و دانشگاه)',
        },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Examples the Department lists: top-of-field awards, a national research grant, a PhD from a top-100 university with a high h-index, international patents, a record of backing successful ventures, leading a company to IPO, or earnings at or above the Fair Work high income threshold.',
          fa: 'نمونه‌هایی که خود وزارتخانه نام برده: جایزه‌های تراز اول جهانی، گرنت پژوهشی ملی، دکتری از یکی از ۱۰۰ دانشگاه برتر با h-index بالا، پتنت بین‌المللی، سابقهٔ حمایت از کسب‌وکارهای نوآور موفق، رساندن شرکت به عرضهٔ اولیه (IPO) یا درآمدی برابر یا بالاتر از سقف درآمد بالای Fair Work.',
        },
      },
      {
        key: 'still-prominent',
        label: { en: 'Still prominent: recent exceptional achievements', fa: 'برجستگی کنونی: دستاوردهای استثنایی تازه' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'nominator',
        label: {
          en: 'A nominator with a national reputation in your field signs Form 1000 (Australian citizen, permanent resident, eligible NZ citizen or Australian organisation)',
          fa: 'معرفی با شهرت ملی در رشتهٔ شما فرم ۱۰۰۰ (Form 1000) را امضا کند (شهروند یا مقیم دائم استرالیا، شهروند واجد شرایط نیوزیلند یا یک سازمان استرالیایی)',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'endorsement', op: 'true' },
        note: {
          en: 'Needed when you lodge the visa application, not for the EOI. Without it the application is not processed. A Form 1000 signed by a federal, state or territory government agency puts you in priority group 2.',
          fa: 'این فرم هنگام ثبت درخواست ویزا لازم است، نه در مرحلهٔ EOI. بدون آن درخواست بررسی نمی‌شود. اگر یک نهاد دولتی فدرال، ایالتی یا قلمرویی فرم ۱۰۰۰ را امضا کند، پرونده در گروه اولویت ۲ قرار می‌گیرد.',
        },
      },
      {
        key: 'priority-sector',
        label: {
          en: 'Achievements in a priority sector (Tier One: critical technologies, renewables and low-emission technologies, health industries)',
          fa: 'دستاورد در یکی از بخش‌های اولویت‌دار (ردهٔ اول: فناوری‌های حیاتی، انرژی‌های تجدیدپذیر و فناوری‌های کم‌انتشار، صنایع سلامت)',
        },
        weight: 2,
        scoreable: false,
        note: {
          en: 'Tier Two: agri-food and AgTech, defence and space, education, financial services and FinTech, infrastructure and transport, resources. Invitations follow this order under Ministerial Direction No. 120.',
          fa: 'ردهٔ دوم: کشاورزی و فناوری کشاورزی، دفاع و فضا، آموزش، خدمات مالی و فین‌تک، زیرساخت و حمل‌ونقل، منابع. دعوت‌نامه‌ها به همین ترتیب و طبق دستورالعمل وزارتی شمارهٔ ۱۲۰ صادر می‌شوند.',
        },
      },
      {
        key: 'establish',
        label: { en: 'Able to find work or become independently established in your field in Australia', fa: 'توانایی یافتن کار یا راه‌اندازی فعالیت مستقل در رشتهٔ خود در استرالیا' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'age',
        label: { en: 'Aged 18 to 54 at application (any age may apply)', fa: 'سن ۱۸ تا ۵۴ سال هنگام درخواست (هر سنی مجاز است)' },
        weight: 1,
        scoreable: true,
        test: { field: 'age', op: 'between', value: [18, 54] },
        note: {
          en: 'Under 18 or 55 and over: you must also show exceptional benefit to the Australian community, ongoing and realised shortly after arrival.',
          fa: 'زیر ۱۸ یا ۵۵ سال و بالاتر: باید سود استثنایی، پایدار و زودبازده برای جامعهٔ استرالیا را هم نشان دهید.',
        },
      },
      {
        key: 'english',
        label: { en: 'Functional English, or pay the second instalment (AUD 4,890 per adult)', fa: 'انگلیسی در سطح کاربردی (Functional)، یا پرداخت قسط دوم (۴٬۸۹۰ دلار استرالیا برای هر بزرگسال)' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    fees: [
      { label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 6_235, currency: 'AUD' },
      { label: { en: 'Second instalment, per adult without functional English', fa: 'قسط دوم، برای هر بزرگسال بدون انگلیسی کاربردی' }, amount: 4_890, currency: 'AUD' },
    ],
    processing: {
      text: {
        en: 'No fixed time. Invitation rounds run monthly; an EOI stays active for 2 years. Once invited you have 60 days to apply, and that cannot be extended.',
        fa: 'زمان ثابتی اعلام نشده است. دعوت‌نامه‌ها ماهانه صادر می‌شوند و هر EOI دو سال فعال می‌ماند. پس از دعوت ۶۰ روز برای ثبت درخواست فرصت دارید و این مهلت تمدید نمی‌شود.',
      },
      source: NIV_ROUND,
    },
    pr: {
      en: `Permanent residence on grant. ${AU_CITIZENSHIP_LINE.en}`,
      fa: `اقامت دائم از روز صدور ویزا. ${AU_CITIZENSHIP_LINE.fa}`,
    },
    sources: [
      { url: NIV, checked: CHECKED, label: 'Home Affairs, subclass 858' },
      { url: NIV_PRIORITIES, checked: CHECKED, label: 'NIV priorities, Ministerial Direction No. 120' },
      { url: NIV_ROUND, checked: CHECKED, label: 'NIV invitation round, April to June 2026' },
      { url: CITIZEN, checked: CHECKED, label: 'Citizenship by conferral' },
    ],
    verified: true,
    review:
      'Fee AUD 6,235 and second instalment AUD 4,890 read on the 858 page (rendered in a browser; WebFetch gets 403). Family member charges not printed on the page (Visa Pricing Estimator only). Processing time is a tool, not a figure: left out. Notebook cites Ministerial Direction 112; the Department now applies No. 120. Global Talent (858) was replaced by the NIV in Dec 2024, so no separate Global Talent route; Global Talent Employer Sponsored (GTES) is an employer agreement, not an individual route. `endorsement` stands in for the Form 1000 nominator; an accelerator letter is NOT a nominator unless the organisation signs Form 1000.',
  },

  // ───────────────────────────── BIIP (CLOSED) ─────────────────────────────
  {
    key: 'au-biip',
    country: 'AU',
    family: 'entrepreneur',
    name: { en: 'Business Innovation and Investment Program (subclass 188/888)', fa: 'برنامهٔ نوآوری و سرمایه‌گذاری تجاری (Business Innovation and Investment، subclass 188/888)' },
    agency: { en: 'Department of Home Affairs', fa: 'وزارت امور داخلی استرالیا (Department of Home Affairs)' },
    status: 'closed',
    fact: {
      en: 'Closed to new applications on 31 July 2024. Applications made before that date are still processed. For founders and investors, the National Innovation visa is now the route.',
      fa: 'از ۳۱ ژوئیهٔ ۲۰۲۴ درخواست تازه پذیرفته نمی‌شود. درخواست‌هایی که پیش از این تاریخ ثبت شده‌اند همچنان بررسی می‌شوند. اکنون مسیر بنیان‌گذاران و سرمایه‌گذاران، ویزای نوآوری ملی است.',
    },
    criteria: [
      {
        key: 'closed',
        label: { en: 'No new applications since 31 July 2024', fa: 'از ۳۱ ژوئیهٔ ۲۰۲۴ درخواست تازه پذیرفته نمی‌شود' },
        weight: 3,
        scoreable: false,
      },
    ],
    money: [],
    pr: {
      en: 'Closed to new applicants. Applications lodged before 31 July 2024 are still decided under the old rules.',
      fa: 'برای متقاضی تازه بسته است. درخواست‌هایی که پیش از ۳۱ ژوئیهٔ ۲۰۲۴ ثبت شده‌اند همچنان با قواعد قبلی بررسی می‌شوند.',
    },
    sources: [{ url: BIIP, checked: CHECKED, label: 'Home Affairs, subclass 188 (closure notice)' }],
    verified: true,
    review:
      'Closure date 31 July 2024 read on the 188 page. The notebook mentions an old AUD 1.25–5 million investment figure for 188: historical only, not used.',
  },

  // ───────────────────────────── SKILLED INDEPENDENT 189 ─────────────────────────────
  {
    key: 'au-skilled-189',
    country: 'AU',
    family: 'express',
    name: { en: 'Skilled Independent visa (subclass 189, points-tested)', fa: 'ویزای مهارتی مستقل (subclass 189، امتیازی)' },
    agency: { en: 'Department of Home Affairs (SkillSelect)', fa: 'وزارت امور داخلی استرالیا (سامانهٔ SkillSelect)' },
    status: 'open',
    fact: {
      en: '65 points is only the floor. In the 4 June 2026 round (10,000 invitations) the lowest score invited ran from 65 for some trades to 90–95 for occupations such as actuary, biotechnologist and electronics engineer.',
      fa: '۶۵ امتیاز فقط حداقل است. در دور ۴ ژوئن ۲۰۲۶ (۱۰٬۰۰۰ دعوت‌نامه) کمترین امتیاز دعوت‌شده از ۶۵ برای برخی مشاغل فنی تا ۹۰ و ۹۵ برای مشاغلی مانند آکچوئر، بیوتکنولوژیست و مهندس الکترونیک بود.',
    },
    criteria: [
      {
        key: 'age',
        label: { en: 'Under 45 when invited', fa: 'زیر ۴۵ سال در زمان دعوت' },
        weight: 3,
        scoreable: true,
        test: { field: 'age', op: 'lte', value: 44 },
        note: {
          en: 'If you turn 45 after the EOI but before an invitation, you will not be invited.',
          fa: 'اگر پس از ثبت EOI و پیش از دعوت ۴۵ ساله شوید، دعوتی دریافت نمی‌کنید.',
        },
      },
      {
        key: 'english',
        label: { en: 'At least competent English when invited', fa: 'دست‌کم انگلیسی در سطح Competent در زمان دعوت' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 7 },
        note: {
          en: 'The app maps competent English to CLB 7; check the accepted tests and scores with Home Affairs.',
          fa: 'اپ سطح Competent را معادل CLB ۷ گرفته است؛ آزمون‌ها و نمره‌های پذیرفته‌شده را در سایت وزارت امور داخلی بررسی کنید.',
        },
      },
      {
        key: 'occupation',
        label: { en: 'Occupation on the relevant skilled occupation list', fa: 'شغل شما در فهرست مشاغل مهارتی مربوط باشد' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'skills-assessment',
        label: { en: 'Suitable skills assessment for that occupation, obtained in the last 3 years', fa: 'ارزیابی مهارت (Skills Assessment) مناسب برای همان شغل که در ۳ سال اخیر گرفته شده باشد' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'points',
        label: { en: 'Points test: at least 65, and in practice the round cut-off for your occupation', fa: 'آزمون امتیاز: دست‌کم ۶۵ و در عمل حد نصاب دور دعوت برای شغل شما' },
        weight: 3,
        scoreable: false,
        note: {
          en: 'Ties are broken by the date your EOI reached its score.',
          fa: 'در امتیاز برابر، تاریخی که EOI شما به آن امتیاز رسیده تعیین‌کننده است.',
        },
      },
    ],
    money: [],
    fees: [
      { label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 6_135, currency: 'AUD' },
      { label: { en: 'Second instalment, per adult family member without functional English', fa: 'قسط دوم، برای هر عضو بزرگسال خانواده بدون انگلیسی کاربردی' }, amount: 4_885, currency: 'AUD' },
    ],
    processing: {
      text: {
        en: 'Under Ministerial Direction No. 122 the Department was processing (Oct 2026) applications lodged up to November 2025 from outside Australia, and up to June 2026 for priority sectors and onshore applicants.',
        fa: 'طبق دستورالعمل وزارتی شمارهٔ ۱۲۲، وزارتخانه در اکتبر ۲۰۲۶ درخواست‌های ثبت‌شده از خارج استرالیا تا نوامبر ۲۰۲۵ را بررسی می‌کرد، و برای بخش‌های اولویت‌دار و متقاضیان داخل استرالیا تا ژوئن ۲۰۲۶ را.',
      },
      source: V189,
    },
    pr: {
      en: `Permanent residence on grant. ${AU_CITIZENSHIP_LINE.en}`,
      fa: `اقامت دائم از روز صدور ویزا. ${AU_CITIZENSHIP_LINE.fa}`,
    },
    sources: [
      { url: V189, checked: CHECKED, label: 'Home Affairs, subclass 189 points-tested' },
      { url: ROUNDS, checked: CHECKED, label: 'SkillSelect invitation round, 4 June 2026' },
      { url: CITIZEN, checked: CHECKED, label: 'Citizenship by conferral' },
    ],
    verified: true,
    review:
      'Points table not read (the calculator is interactive), so no experience or education criterion is scored. CLB 7 ≈ competent English is our mapping, not a Home Affairs statement. Family member charge not printed.',
  },

  // ───────────────────────────── SKILLED NOMINATED 190 ─────────────────────────────
  {
    key: 'au-skilled-190',
    country: 'AU',
    family: 'express',
    name: { en: 'Skilled Nominated visa (subclass 190)', fa: 'ویزای مهارتی با نامزدی ایالتی (subclass 190)' },
    agency: {
      en: 'State or territory government (nomination); Department of Home Affairs (visa)',
      fa: 'دولت ایالت یا قلمرو (نامزدی)؛ وزارت امور داخلی استرالیا (ویزا)',
    },
    status: 'open',
    fact: {
      en: 'A state or territory must nominate you; each sets its own criteria and the nomination itself triggers the invitation. No occupation ceilings apply to 190.',
      fa: 'یک ایالت یا قلمرو باید شما را نامزد کند؛ هر کدام معیارهای خود را دارد و خودِ نامزدی دعوت‌نامه را صادر می‌کند. سقف شغلی (Occupation Ceiling) برای ۱۹۰ اعمال نمی‌شود.',
    },
    criteria: [
      {
        key: 'nomination',
        label: { en: 'Nominated by an Australian state or territory government agency', fa: 'نامزدی از سوی نهاد دولتی یکی از ایالت‌ها یا قلمروهای استرالیا' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'age',
        label: { en: 'Under 45 when invited', fa: 'زیر ۴۵ سال در زمان دعوت' },
        weight: 3,
        scoreable: true,
        test: { field: 'age', op: 'lte', value: 44 },
      },
      {
        key: 'english',
        label: { en: 'At least competent English when invited', fa: 'دست‌کم انگلیسی در سطح Competent در زمان دعوت' },
        weight: 3,
        scoreable: true,
        test: { field: 'englishClb', op: 'gte', value: 7 },
        note: {
          en: 'The app maps competent English to CLB 7.',
          fa: 'اپ سطح Competent را معادل CLB ۷ گرفته است.',
        },
      },
      {
        key: 'occupation',
        label: { en: 'Occupation on the relevant skilled list, with a suitable skills assessment', fa: 'شغل در فهرست مهارتی مربوط، همراه با ارزیابی مهارت مناسب' },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'points',
        label: { en: 'Points test: at least 65', fa: 'آزمون امتیاز: دست‌کم ۶۵' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [],
    fees: [
      { label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 6_140, currency: 'AUD' },
    ],
    processing: {
      text: {
        en: 'Under Ministerial Direction No. 122 the Department was processing (Oct 2026) offshore applications lodged up to February 2025, onshore up to January 2026 and priority sectors up to March 2026.',
        fa: 'طبق دستورالعمل وزارتی شمارهٔ ۱۲۲، وزارتخانه در اکتبر ۲۰۲۶ درخواست‌های خارج از استرالیا تا فوریهٔ ۲۰۲۵، داخل استرالیا تا ژانویهٔ ۲۰۲۶ و بخش‌های اولویت‌دار تا مارس ۲۰۲۶ را بررسی می‌کرد.',
      },
      source: V190,
    },
    pr: {
      en: `Permanent residence on grant. ${AU_CITIZENSHIP_LINE.en}`,
      fa: `اقامت دائم از روز صدور ویزا. ${AU_CITIZENSHIP_LINE.fa}`,
    },
    sources: [
      { url: V190, checked: CHECKED, label: 'Home Affairs, subclass 190' },
      { url: ROUNDS, checked: CHECKED, label: 'SkillSelect, state nominations' },
      { url: CITIZEN, checked: CHECKED, label: 'Citizenship by conferral' },
    ],
    verified: true,
    review:
      'Fee on the 190 page is AUD 6,140 (189 shows 6,135): as published, re-check on 1 July. State criteria not read state by state. Nomination points bonus not read on an official page: left out.',
  },

  // ───────────────────────────── STUDENT 500 ─────────────────────────────
  {
    key: 'au-student',
    country: 'AU',
    family: 'study',
    name: { en: 'Student visa (subclass 500)', fa: 'ویزای دانشجویی استرالیا (subclass 500)' },
    agency: { en: 'Department of Home Affairs', fa: 'وزارت امور داخلی استرالیا (Department of Home Affairs)' },
    status: 'open',
    fact: {
      en: 'Since 2 October 2026 most students can no longer bring a partner or children, and family cannot follow later. Funds: AUD 29,710 a year for living costs, plus a year of course fees and travel.',
      fa: 'از ۲ اکتبر ۲۰۲۶ بیشتر دانشجویان دیگر نمی‌توانند همسر یا فرزند را همراه بیاورند و اعضای خانواده بعداً هم نمی‌توانند ملحق شوند. تمکن: سالانه ۲۹٬۷۱۰ دلار استرالیا هزینهٔ زندگی، به‌علاوهٔ شهریهٔ یک سال و هزینهٔ سفر.',
    },
    criteria: [
      {
        key: 'coe',
        label: { en: 'Confirmation of Enrolment (CoE) in a full-time CRICOS-registered course', fa: 'تأییدیهٔ ثبت‌نام (CoE) در یک دورهٔ تمام‌وقت ثبت‌شده در CRICOS' },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
        note: {
          en: 'Without a CoE at lodgement the application is invalid.',
          fa: 'اگر هنگام ثبت درخواست CoE نداشته باشید، درخواست نامعتبر است.',
        },
      },
      {
        key: 'funds',
        label: { en: 'Living costs of AUD 29,710 for 12 months, plus course fees and travel', fa: 'هزینهٔ زندگی ۲۹٬۷۱۰ دلار استرالیا برای ۱۲ ماه، به‌علاوهٔ شهریه و سفر' },
        weight: 3,
        scoreable: true,
        test: { field: 'liquid', op: 'gte', value: 29_710, currency: 'AUD' },
        note: {
          en: 'Add the first 12 months of course fees and AUD 2,000 travel (AUD 3,000 from West Africa). The Department asks for evidence only in some cases, but you must be able to show it.',
          fa: 'شهریهٔ ۱۲ ماه اول و ۲٬۰۰۰ دلار سفر (از غرب آفریقا ۳٬۰۰۰ دلار) را هم اضافه کنید. وزارتخانه همیشه مدرک نمی‌خواهد، اما باید بتوانید نشانش دهید.',
        },
      },
      {
        key: 'genuine-student',
        label: { en: 'Genuine Student requirement: study is the main reason for the visa', fa: 'شرط دانشجوی واقعی (Genuine Student): تحصیل دلیل اصلی ویزا باشد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'oshc',
        label: { en: 'Overseas Student Health Cover (OSHC) for the whole stay', fa: 'بیمهٔ درمانی دانشجویان خارجی (OSHC) برای کل مدت اقامت' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'family',
        label: { en: 'No partner or children, unless you fall in an exemption category', fa: 'بدون همسر و فرزند، مگر در دسته‌های معاف' },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'living',
        label: { en: 'Living costs, student, 12 months', fa: 'هزینهٔ زندگی دانشجو، ۱۲ ماه' },
        amount: 29_710,
        currency: 'AUD',
        basis: 'perYear',
        shows: {
          en: 'Funds you can genuinely access; if someone else provides them, their identity, relationship and past support.',
          fa: 'پولی که واقعاً به آن دسترسی دارید؛ اگر کس دیگری تأمینش می‌کند، مدارک هویت، نسبت و حمایت‌های قبلی او.',
        },
      },
      { key: 'travel', label: { en: 'Travel (applying from outside Australia)', fa: 'سفر (درخواست از خارج استرالیا)' }, amount: 2_000, currency: 'AUD', basis: 'once' },
    ],
    fees: [{ label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 2_500, currency: 'AUD' }],
    processing: {
      text: {
        en: 'No fixed time; offshore applications lodged from 14 November 2025 are processed under Ministerial Direction No. 115.',
        fa: 'زمان ثابتی اعلام نشده؛ درخواست‌های خارج از کشور که از ۱۴ نوامبر ۲۰۲۵ ثبت شده‌اند طبق دستورالعمل وزارتی شمارهٔ ۱۱۵ بررسی می‌شوند.',
      },
      source: V500,
    },
    pr: {
      en: 'Temporary (up to 6 years, in line with the course). No direct path: graduates move to a Temporary Graduate visa (subclass 485) or a skilled or employer visa, then PR.',
      fa: 'موقت است (تا ۶ سال، به اندازهٔ دوره). مسیر مستقیمی به اقامت دائم ندارد: فارغ‌التحصیلان به ویزای فارغ‌التحصیلی موقت (subclass 485) یا ویزای مهارتی یا کارفرمایی می‌روند و از آنجا به اقامت دائم.',
    },
    sources: [
      { url: V500, checked: CHECKED, label: 'Home Affairs, subclass 500 (new rules from 2 Oct 2026)' },
    ],
    verified: true,
    review:
      'New 2 Oct 2026 family rule: exemption categories not listed here (see the Student visa changes page). Work limit 48 hours a fortnight in session. English test requirement not on the main page; not given. Partner AUD 10,394 / child AUD 4,449 / schooling AUD 13,502 only matter for exempt applicants (kept in extras).',
  },
];
