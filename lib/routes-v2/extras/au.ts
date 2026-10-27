// Australia: route depth and country profile for the app's v3 content
// (spec 2026-10-27). Every figure was read on its official or institutional
// page on 27 Oct 2026; notebook claims are leads only. Research and conflicts:
// docs/research/app-v3/au.md.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const NB = '9bb09871-6ea0-4803-894f-7eed5e5a9e34';

const NIV = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858';
const NIV_OVERVIEW = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa';
const NIV_PRIORITIES = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/priorities';
const NIV_ROUND = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/current-invitation-round';
const NIV_EOI = 'https://immi.homeaffairs.gov.au/help-support/departmental-forms/online-forms/national-innovation-visa-form';
const FORM_1000 = 'https://immi.homeaffairs.gov.au/form-listing/forms/1000.pdf';
const IMMIACCOUNT = 'https://online.immi.gov.au/lusc/login';
const HEALTH = 'https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/health';
const CHARACTER = 'https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/character';
const BIIP = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188';
const V189 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-tested';
const V190 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190';
const ROUNDS = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds';
const SKILLSELECT = 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect';
const V500 = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500';
const CRICOS = 'https://cricos.education.gov.au/';
const CITIZEN = 'https://immi.homeaffairs.gov.au/citizenship/become-a-citizen/permanent-resident';
const DUAL = 'https://immi.homeaffairs.gov.au/citizenship-subsite/anniversary/Pages/citizenship-history.aspx';

/** Every permanent route here leads to the same citizenship rule. */
const PR_TIMELINE: Timeline = {
  prAfterYears: 0,
  citizenshipAfterYears: 4,
  dualCitizenship: 'allowed',
  language: {
    en: 'Basic English for citizenship; the citizenship test needs 75% and all 5 values questions right.',
    fa: 'برای شهروندی انگلیسی پایه کافی است؛ در آزمون شهروندی باید ۷۵٪ نمره بگیرید و هر ۵ پرسش ارزش‌های استرالیایی را درست جواب دهید.',
  },
  note: {
    en: 'PR starts on grant (in Australia) or on first entry (outside). Citizenship needs 4 years of lawful residence, the last 12 months as PR, with no more than 12 months away in total and 90 days in the final year. Dual citizenship has been allowed since 2002.',
    fa: 'اقامت دائم از روز صدور (اگر در استرالیا باشید) یا از نخستین ورود (اگر بیرون باشید) شروع می‌شود. شهروندی ۴ سال اقامت قانونی می‌خواهد که ۱۲ ماه آخرش با اقامت دائم باشد؛ مجموع غیبت حداکثر ۱۲ ماه و در سال آخر حداکثر ۹۰ روز. تابعیت دوگانه از سال ۲۰۰۲ مجاز است.',
  },
  source: CITIZEN,
};

export const EXTRAS_AU: Record<string, RouteExtras> = {
  // ───────────────────────────── NATIONAL INNOVATION VISA ─────────────────────────────
  'au-niv': {
    funds: [
      {
        key: 'vac',
        label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' },
        amount: 6_235,
        currency: 'AUD',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: NIV,
      },
      {
        key: 'second-instalment',
        label: { en: 'Second instalment, each adult without functional English (asked only before grant)', fa: 'قسط دوم، برای هر بزرگسال بدون انگلیسی کاربردی (فقط پیش از صدور ویزا خواسته می‌شود)' },
        amount: 4_890,
        currency: 'AUD',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: NIV,
      },
    ],
    steps: [
      {
        key: 'nominator',
        title: { en: 'Find a nominator', fa: 'معرف پیدا کنید' },
        detail: {
          en: 'A person or organisation with a national reputation in your field who will sign Form 1000. A state or federal government agency as nominator puts you in priority group 2.',
          fa: 'فرد یا سازمانی با شهرت ملی در رشتهٔ شما که فرم ۱۰۰۰ را امضا کند. اگر معرف یک نهاد دولتی ایالتی یا فدرال باشد، در گروه اولویت ۲ قرار می‌گیرید.',
        },
        link: FORM_1000,
      },
      {
        key: 'eoi',
        title: { en: 'Submit an Expression of Interest', fa: 'ابراز تمایل (EOI) ثبت کنید' },
        detail: {
          en: 'Online, with evidence of the achievements you claim. The EOI stays active for 2 years.',
          fa: 'به‌صورت آنلاین و همراه با مدارک دستاوردهایی که ادعا می‌کنید. EOI دو سال فعال می‌ماند.',
        },
        takes: { en: 'Active 2 years; rounds are monthly', fa: 'دو سال فعال؛ دورهای دعوت ماهانه' },
        link: NIV_EOI,
      },
      {
        key: 'invitation',
        title: { en: 'Wait for an invitation', fa: 'منتظر دعوت‌نامه بمانید' },
        detail: {
          en: 'Invitations follow the priority order of Ministerial Direction No. 120. An invitation is not a pre-assessment.',
          fa: 'دعوت‌نامه‌ها به ترتیب اولویت دستورالعمل وزارتی شمارهٔ ۱۲۰ صادر می‌شوند. دعوت به معنای ارزیابی اولیهٔ پرونده نیست.',
        },
        link: NIV_ROUND,
      },
      {
        key: 'apply',
        title: { en: 'Apply in ImmiAccount within 60 days', fa: 'ظرف ۶۰ روز در ImmiAccount درخواست دهید' },
        detail: {
          en: 'Attach the signed Form 1000 and the evidence. Without Form 1000 the application is not processed, and the 60 days cannot be extended.',
          fa: 'فرم ۱۰۰۰ امضاشده و مدارک را پیوست کنید. بدون فرم ۱۰۰۰ درخواست بررسی نمی‌شود و مهلت ۶۰ روزه تمدید نمی‌شود.',
        },
        takes: { en: '60 days from the invitation', fa: '۶۰ روز از تاریخ دعوت' },
        link: IMMIACCOUNT,
      },
      {
        key: 'health-character',
        title: { en: 'Health and character checks', fa: 'معاینهٔ پزشکی و بررسی سوءپیشینه' },
        detail: {
          en: 'Health checks for everyone applying; police certificates for each country where you spent 12 months or more in the last 10 years since age 16.',
          fa: 'معاینهٔ پزشکی برای همهٔ متقاضیان؛ گواهی عدم سوءپیشینه از هر کشوری که پس از ۱۶ سالگی و در ۱۰ سال اخیر ۱۲ ماه یا بیشتر در آن بوده‌اید.',
        },
        link: CHARACTER,
      },
      {
        key: 'grant',
        title: { en: 'Grant: permanent residence', fa: 'صدور ویزا: اقامت دائم' },
        detail: {
          en: 'The visa is linked digitally to your passport. You can travel in and out for 5 years; after that you need a Resident Return visa.',
          fa: 'ویزا به‌صورت دیجیتال به گذرنامه متصل می‌شود. تا ۵ سال می‌توانید آزادانه رفت‌وآمد کنید؛ پس از آن ویزای بازگشت مقیم (Resident Return) لازم است.',
        },
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport pages with photo, details, issue and expiry dates', fa: 'صفحه‌های گذرنامه با عکس، مشخصات و تاریخ صدور و انقضا' }, stage: 'visa' },
      { key: 'form-1000', label: { en: 'Form 1000 signed by your nominator', fa: 'فرم ۱۰۰۰ با امضای معرف' }, note: { en: 'Plus proof of the nominator’s status, or that the signatory may represent the organisation.', fa: 'به‌همراه مدرک وضعیت معرف، یا مدرکی که امضاکننده نمایندهٔ مجاز سازمان است.' }, stage: 'visa' },
      { key: 'achievement', label: { en: 'Evidence of exceptional achievement: awards, grants, publications, h-index, patents, IPO, earnings', fa: 'مدارک دستاورد استثنایی: جایزه، گرنت، مقاله، h-index، پتنت، عرضهٔ اولیه، درآمد' }, note: { en: 'Must match what you claimed in the EOI and show recent prominence.', fa: 'باید با ادعاهای EOI یکی باشد و برجستگی اخیر را نشان دهد.' }, stage: 'apply' },
      { key: 'establish', label: { en: 'Statement and letters showing you can work or set up in Australia', fa: 'شرح و نامه‌هایی که نشان دهد می‌توانید در استرالیا کار کنید یا فعالیت راه بیندازید' }, stage: 'visa' },
      { key: 'police', label: { en: 'Police certificates (each country with 12+ months in the last 10 years)', fa: 'گواهی عدم سوءپیشینه (هر کشوری با ۱۲ ماه یا بیشتر اقامت در ۱۰ سال اخیر)' }, stage: 'visa' },
      { key: 'english', label: { en: 'Functional English evidence, or a statement that you will pay the second instalment', fa: 'مدرک انگلیسی کاربردی، یا تعهد به پرداخت قسط دوم' }, stage: 'visa' },
      { key: 'family', label: { en: 'Partner and children: identity, relationship, character; Form 1229 consent where needed', fa: 'همسر و فرزندان: مدارک هویت، رابطه و سوءپیشینه؛ در صورت لزوم رضایت‌نامهٔ فرم ۱۲۲۹' }, stage: 'visa' },
    ],
    realities: [
      {
        key: 'odds',
        kind: 'challenge',
        title: { en: 'About one EOI in nine was invited', fa: 'از هر ۹ EOI حدود یکی دعوت شد' },
        detail: {
          en: 'April to June 2026: 2,166 EOIs and 248 invitations. 192 of them were priority 3 (Tier One sectors); fewer than 20 came from government nominations.',
          fa: 'آوریل تا ژوئن ۲۰۲۶: ۲٬۱۶۶ EOI و ۲۴۸ دعوت‌نامه. ۱۹۲ مورد در اولویت ۳ (بخش‌های ردهٔ اول) بود و کمتر از ۲۰ مورد از مسیر نامزدی دولتی.',
        },
        source: NIV_ROUND,
      },
      {
        key: 'no-accelerator',
        kind: 'myth',
        title: { en: 'Myth: you need an accelerator letter', fa: 'باور نادرست: نامهٔ شتاب‌دهنده لازم است' },
        detail: {
          en: 'What is required is a nominator who signs Form 1000. Links to Australian innovation hubs count as evidence, not as a requirement.',
          fa: 'آنچه لازم است معرفی است که فرم ۱۰۰۰ را امضا کند. ارتباط با مراکز نوآوری استرالیا فقط به‌عنوان مدرک ارزش دارد، نه شرط.',
        },
        source: NIV_PRIORITIES,
      },
      {
        key: 'no-team',
        kind: 'challenge',
        title: { en: 'There is no team application', fa: 'درخواست تیمی وجود ندارد' },
        detail: {
          en: 'Each co-founder needs his or her own record of exceptional achievement, EOI and nominator. Partners and dependent children can be included in one person’s application.',
          fa: 'هر هم‌بنیان‌گذار باید سابقهٔ دستاورد، EOI و معرف خودش را داشته باشد. همسر و فرزندان وابسته را می‌توان در پروندهٔ یک نفر آورد.',
        },
        source: NIV,
      },
      {
        key: 'state-route',
        kind: 'tip',
        title: { en: 'Founders: a government nominator moves you up', fa: 'بنیان‌گذاران: معرف دولتی شما را جلو می‌برد' },
        detail: {
          en: 'For entrepreneurs, the Department looks at promising activity leading to a business in Australia, especially when linked to an innovation hub, together with a government agency nomination (priority 2).',
          fa: 'برای کارآفرینان، وزارتخانه فعالیت امیدوارکننده‌ای را که به راه‌اندازی کسب‌وکار در استرالیا می‌رسد (به‌ویژه با پیوند به یک مرکز نوآوری) در کنار نامزدی یک نهاد دولتی بررسی می‌کند (اولویت ۲).',
        },
        source: NIV_PRIORITIES,
      },
      {
        key: 'no-capital',
        kind: 'myth',
        title: { en: 'Myth: there is a minimum investment', fa: 'باور نادرست: حداقل سرمایه‌گذاری دارد' },
        detail: {
          en: 'The NIV sets no investment or funds threshold. The old investor streams (subclass 188) closed on 31 July 2024.',
          fa: 'ویزای نوآوری ملی هیچ حداقل سرمایه یا تمکنی تعیین نکرده است. جریان‌های سرمایه‌گذاری قدیمی (subclass 188) از ۳۱ ژوئیهٔ ۲۰۲۴ بسته شده‌اند.',
        },
        source: BIIP,
      },
    ],
    timeline: PR_TIMELINE,
    quiz: [
      {
        key: 'invite',
        q: { en: 'Can you apply for the NIV without an invitation?', fa: 'آیا بدون دعوت‌نامه می‌توان برای ویزای نوآوری ملی درخواست داد؟' },
        options: [
          { en: 'Yes, at any time', fa: 'بله، هر زمان' },
          { en: 'No, an EOI and an invitation come first', fa: 'خیر، اول EOI و دعوت‌نامه لازم است' },
          { en: 'Only from inside Australia', fa: 'فقط از داخل استرالیا' },
        ],
        answer: 1,
        why: { en: 'The NIV is invitation-only; applications without an invitation are not accepted.', fa: 'این ویزا فقط با دعوت است و درخواست بدون دعوت پذیرفته نمی‌شود.' },
      },
      {
        key: 'window',
        q: { en: 'How long do you have to apply after an invitation?', fa: 'پس از دعوت چقدر برای ثبت درخواست وقت دارید؟' },
        options: [
          { en: '30 days', fa: '۳۰ روز' },
          { en: '60 days', fa: '۶۰ روز' },
          { en: '6 months', fa: '۶ ماه' },
          { en: '2 years', fa: '۲ سال' },
        ],
        answer: 1,
        why: { en: 'You must lodge within 60 days and the period cannot be extended.', fa: 'باید ظرف ۶۰ روز درخواست دهید و این مهلت تمدید نمی‌شود.' },
      },
      {
        key: 'form',
        q: { en: 'Which form must your nominator sign?', fa: 'معرف شما کدام فرم را باید امضا کند؟' },
        options: [
          { en: 'Form 80', fa: 'فرم ۸۰' },
          { en: 'Form 1000', fa: 'فرم ۱۰۰۰' },
          { en: 'Form 1229', fa: 'فرم ۱۲۲۹' },
        ],
        answer: 1,
        why: { en: 'Form 1000 is the Nomination for National Innovation visa, attached when you apply.', fa: 'فرم ۱۰۰۰ همان فرم نامزدی ویزای نوآوری ملی است که هنگام درخواست پیوست می‌شود.' },
      },
      {
        key: 'priority2',
        q: { en: 'What puts an applicant in priority group 2?', fa: 'چه چیزی متقاضی را در گروه اولویت ۲ قرار می‌دهد؟' },
        options: [
          { en: 'A Nobel-level award', fa: 'جایزه‌ای در حد نوبل' },
          { en: 'Form 1000 signed by a government agency', fa: 'فرم ۱۰۰۰ با امضای یک نهاد دولتی' },
          { en: 'Working in AgTech', fa: 'فعالیت در فناوری کشاورزی' },
        ],
        answer: 1,
        why: { en: 'Priority 2 is any sector nominated on Form 1000 by an Australian, state or territory government agency.', fa: 'اولویت ۲ برای هر بخشی است که یک نهاد دولتی فدرال، ایالتی یا قلمرویی آن را با فرم ۱۰۰۰ نامزد کرده باشد.' },
      },
      {
        key: 'fee',
        q: { en: 'What is the main applicant’s visa charge?', fa: 'هزینهٔ ویزای متقاضی اصلی چقدر است؟' },
        options: [
          { en: 'AUD 2,500', fa: '۲٬۵۰۰ دلار استرالیا' },
          { en: 'AUD 6,235', fa: '۶٬۲۳۵ دلار استرالیا' },
          { en: 'AUD 12,505', fa: '۱۲٬۵۰۵ دلار استرالیا' },
        ],
        answer: 1,
        why: { en: 'Home Affairs lists the NIV from AUD 6,235 for the main applicant.', fa: 'وزارت امور داخلی هزینهٔ این ویزا را برای متقاضی اصلی از ۶٬۲۳۵ دلار استرالیا اعلام کرده است.' },
      },
    ],
    media: [
      { notebookId: NB, kind: 'video', title: "The Founder's Guide to the National Innovation Visa (Subclass 858)" },
      { notebookId: NB, kind: 'slides', title: 'Australian NIV Strategic Blueprint' },
      { notebookId: NB, kind: 'slides', title: 'Australia National Innovation Visa Blueprint' },
      { notebookId: NB, kind: 'infographic', title: 'ویزای نوآوری ملی استرالیا ۲۰۲۶' },
      { notebookId: NB, kind: 'infographic', title: 'راهنمای ویزای نوآوری ملی استرالیا' },
    ],
  },

  // ───────────────────────────── BIIP (CLOSED) ─────────────────────────────
  'au-biip': {
    funds: [],
    steps: [
      {
        key: 'check-niv',
        title: { en: 'Look at the National Innovation visa instead', fa: 'به‌جای آن ویزای نوآوری ملی را بررسی کنید' },
        detail: {
          en: 'It names entrepreneurs and innovative investors among its targets and has no investment threshold.',
          fa: 'این ویزا کارآفرینان و سرمایه‌گذاران نوآور را جزو گروه‌های هدف خود نام برده و حداقل سرمایه‌گذاری ندارد.',
        },
        link: NIV_OVERVIEW,
      },
      {
        key: 'pending',
        title: { en: 'Already applied before 31 July 2024?', fa: 'پیش از ۳۱ ژوئیهٔ ۲۰۲۴ درخواست داده‌اید؟' },
        detail: {
          en: 'Your application is still processed. If you withdrew on or after that date, you may be entitled to a refund of the charge.',
          fa: 'درخواست شما همچنان بررسی می‌شود. اگر از آن تاریخ به بعد انصراف داده‌اید، ممکن است هزینه به شما برگردانده شود.',
        },
        link: BIIP,
      },
      {
        key: 'skilled',
        title: { en: 'Or check the points-tested skilled visas', fa: 'یا ویزاهای مهارتی امتیازی را بررسی کنید' },
        detail: {
          en: 'Subclass 189 and 190 are permanent and open, if your occupation is on the list and you are under 45.',
          fa: 'ویزاهای ۱۸۹ و ۱۹۰ دائم و باز هستند، به شرط آنکه شغلتان در فهرست باشد و زیر ۴۵ سال باشید.',
        },
        link: SKILLSELECT,
      },
      {
        key: 'priorities',
        title: { en: 'Read the NIV priority sectors before an EOI', fa: 'پیش از ثبت EOI بخش‌های اولویت‌دار NIV را بخوانید' },
        detail: {
          en: 'Invitations go first to top-of-field award holders, then government-nominated candidates, then Tier One and Tier Two sectors.',
          fa: 'دعوت‌نامه‌ها اول به برندگان جایزه‌های تراز اول، سپس نامزدهای نهادهای دولتی و بعد به بخش‌های ردهٔ اول و دوم می‌رسد.',
        },
        link: NIV_PRIORITIES,
      },
    ],
    documents: [],
    realities: [
      {
        key: 'closed',
        kind: 'myth',
        title: { en: 'Myth: you can still buy residence with AUD 5 million', fa: 'باور نادرست: هنوز می‌شود با ۵ میلیون دلار اقامت گرفت' },
        detail: {
          en: 'The Significant Investor stream (AUD 5 million) closed with the rest of BIIP on 31 July 2024. Advertisements that still sell it are out of date.',
          fa: 'جریان سرمایه‌گذار بزرگ (۵ میلیون دلار) هم همراه با کل برنامه از ۳۱ ژوئیهٔ ۲۰۲۴ بسته شد. تبلیغاتی که هنوز آن را می‌فروشند قدیمی‌اند.',
        },
        source: BIIP,
      },
      {
        key: 'successor',
        kind: 'tip',
        title: { en: 'Innovative investors now go through the NIV', fa: 'سرمایه‌گذاران نوآور اکنون از مسیر NIV می‌روند' },
        detail: {
          en: 'The NIV counts a track record of supporting successful innovative ventures as evidence, together with a government nomination.',
          fa: 'در ویزای نوآوری ملی، سابقهٔ حمایت از کسب‌وکارهای نوآور موفق، همراه با نامزدی دولتی، به‌عنوان مدرک پذیرفته می‌شود.',
        },
        source: NIV_PRIORITIES,
      },
      {
        key: 'refund',
        kind: 'tip',
        title: { en: 'Withdrawn applications may be refunded', fa: 'هزینهٔ درخواست‌های پس‌گرفته‌شده ممکن است برگردد' },
        detail: {
          en: 'If you withdrew a 188 application in the Business Innovation, Investor, Significant Investor or Entrepreneur streams on or after 31 July 2024, check the refund rules.',
          fa: 'اگر درخواست ۱۸۸ خود را در جریان‌های نوآوری تجاری، سرمایه‌گذار، سرمایه‌گذار بزرگ یا کارآفرین از ۳۱ ژوئیهٔ ۲۰۲۴ به بعد پس گرفته‌اید، قواعد بازپرداخت را بررسی کنید.',
        },
        source: BIIP,
      },
    ],
    timeline: { dualCitizenship: 'allowed', note: { en: 'Closed route; see the NIV or skilled visas for a path to PR.', fa: 'مسیر بسته است؛ برای اقامت دائم ویزای نوآوری ملی یا ویزاهای مهارتی را ببینید.' }, source: DUAL },
    quiz: [
      {
        key: 'closed-date',
        q: { en: 'When did BIIP close to new applications?', fa: 'برنامهٔ BIIP از چه تاریخی درخواست تازه نمی‌پذیرد؟' },
        options: [
          { en: '1 July 2023', fa: '۱ ژوئیهٔ ۲۰۲۳' },
          { en: '31 July 2024', fa: '۳۱ ژوئیهٔ ۲۰۲۴' },
          { en: '2 October 2026', fa: '۲ اکتبر ۲۰۲۶' },
        ],
        answer: 1,
        why: { en: 'Home Affairs: BIIP is closed as of 31 July 2024.', fa: 'طبق اعلام وزارت امور داخلی، BIIP از ۳۱ ژوئیهٔ ۲۰۲۴ بسته است.' },
      },
      {
        key: 'pending',
        q: { en: 'What happens to applications made before the closure?', fa: 'درخواست‌هایی که پیش از بسته‌شدن ثبت شده‌اند چه می‌شوند؟' },
        options: [
          { en: 'They are cancelled', fa: 'لغو می‌شوند' },
          { en: 'They are still processed', fa: 'همچنان بررسی می‌شوند' },
          { en: 'They move to the NIV automatically', fa: 'خودکار به NIV منتقل می‌شوند' },
        ],
        answer: 1,
        why: { en: 'Applications made before 31 July 2024 will still be processed.', fa: 'درخواست‌های ثبت‌شده پیش از ۳۱ ژوئیهٔ ۲۰۲۴ همچنان بررسی می‌شوند.' },
      },
      {
        key: 'sig',
        q: { en: 'How much did the closed Significant Investor stream require?', fa: 'جریان بستهٔ سرمایه‌گذار بزرگ چه مبلغی می‌خواست؟' },
        options: [
          { en: 'AUD 500,000', fa: '۵۰۰ هزار دلار استرالیا' },
          { en: 'AUD 1 million', fa: '۱ میلیون دلار استرالیا' },
          { en: 'AUD 5 million', fa: '۵ میلیون دلار استرالیا' },
        ],
        answer: 2,
        why: { en: 'It required at least AUD 5 million in complying investments.', fa: 'دست‌کم ۵ میلیون دلار سرمایه‌گذاری واجد شرایط لازم بود.' },
      },
      {
        key: 'successor',
        q: { en: 'Which open visa names innovative investors among its targets?', fa: 'کدام ویزای باز، سرمایه‌گذاران نوآور را جزو گروه‌های هدف خود نام برده است؟' },
        options: [
          { en: 'Student visa (500)', fa: 'ویزای دانشجویی (۵۰۰)' },
          { en: 'National Innovation visa (858)', fa: 'ویزای نوآوری ملی (۸۵۸)' },
          { en: 'Skilled Independent (189)', fa: 'ویزای مهارتی مستقل (۱۸۹)' },
        ],
        answer: 1,
        why: { en: 'Home Affairs lists global researchers, entrepreneurs, innovative investors, athletes and creatives for the NIV.', fa: 'وزارت امور داخلی پژوهشگران، کارآفرینان، سرمایه‌گذاران نوآور، ورزشکاران و هنرمندان را مخاطبان NIV معرفی کرده است.' },
      },
      {
        key: 'nominated',
        q: { en: 'Who had to nominate a BIIP applicant?', fa: 'متقاضی BIIP را چه کسی باید نامزد می‌کرد؟' },
        options: [
          { en: 'A state or territory government agency (or Austrade for some streams)', fa: 'نهاد دولتی یک ایالت یا قلمرو (یا Austrade برای برخی جریان‌ها)' },
          { en: 'A university', fa: 'یک دانشگاه' },
          { en: 'No one', fa: 'هیچ‌کس' },
        ],
        answer: 0,
        why: { en: 'The 188 page lists nomination by a state or territory agency or Austrade.', fa: 'در صفحهٔ ویزای ۱۸۸ نامزدی از سوی نهاد ایالتی یا قلمرویی یا Austrade ذکر شده است.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── SKILLED INDEPENDENT 189 ─────────────────────────────
  'au-skilled-189': {
    funds: [
      { key: 'vac', label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 6_135, currency: 'AUD', basis: 'once', per: 'person', kind: 'spend', source: V189 },
      { key: 'second-instalment', label: { en: 'Second instalment, each adult family member without functional English', fa: 'قسط دوم، برای هر عضو بزرگسال خانواده بدون انگلیسی کاربردی' }, amount: 4_885, currency: 'AUD', basis: 'once', per: 'spouse', kind: 'spend', source: V189 },
    ],
    steps: [
      {
        key: 'occupation',
        title: { en: 'Check your occupation is on the 189 list', fa: 'مطمئن شوید شغلتان در فهرست ۱۸۹ هست' },
        detail: { en: 'The list of eligible skilled occupations decides whether 189 is open to you at all.', fa: 'فهرست مشاغل مهارتی تعیین می‌کند که اصلاً ویزای ۱۸۹ برای شما باز است یا نه.' },
        link: V189,
      },
      {
        key: 'assessment',
        title: { en: 'Get a skills assessment', fa: 'ارزیابی مهارت بگیرید' },
        detail: { en: 'From the assessing authority for your occupation. It must be no older than 3 years when you are invited.', fa: 'از مرجع ارزیابی شغل خودتان. در زمان دعوت نباید بیش از ۳ سال از آن گذشته باشد.' },
      },
      {
        key: 'english',
        title: { en: 'Take an English test', fa: 'در آزمون زبان انگلیسی شرکت کنید' },
        detail: { en: 'At least competent English at invitation; higher scores earn points.', fa: 'در زمان دعوت دست‌کم سطح Competent؛ نمرهٔ بالاتر امتیاز بیشتری دارد.' },
      },
      {
        key: 'eoi',
        title: { en: 'Submit an EOI in SkillSelect', fa: 'در SkillSelect ابراز تمایل (EOI) ثبت کنید' },
        detail: { en: 'You get an indicative points score. The highest-ranked EOIs are invited first; ties go to the earlier date.', fa: 'امتیاز تقریبی به شما نشان داده می‌شود. EOIهای با امتیاز بالاتر زودتر دعوت می‌شوند و در امتیاز برابر، تاریخ زودتر مقدم است.' },
        link: SKILLSELECT,
      },
      {
        key: 'apply',
        title: { en: 'Apply within 60 days of the invitation', fa: 'ظرف ۶۰ روز پس از دعوت درخواست دهید' },
        detail: { en: 'In ImmiAccount, with evidence for every point you claimed. The invitation states the score you must prove.', fa: 'در ImmiAccount و با مدرک برای تک‌تک امتیازهایی که ادعا کرده‌اید. دعوت‌نامه امتیازی را که باید ثابت کنید مشخص می‌کند.' },
        link: IMMIACCOUNT,
      },
      {
        key: 'checks',
        title: { en: 'Health and character', fa: 'معاینهٔ پزشکی و سوءپیشینه' },
        detail: { en: 'For you and every family member applying; character for everyone 16 and over.', fa: 'برای شما و همهٔ اعضای خانواده؛ گواهی سوءپیشینه برای همهٔ افراد ۱۶ سال به بالا.' },
        link: HEALTH,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport and national identity card', fa: 'گذرنامه و کارت ملی' }, stage: 'visa' },
      { key: 'assessment', label: { en: 'Skills assessment letter', fa: 'نامهٔ ارزیابی مهارت' }, stage: 'visa' },
      { key: 'english', label: { en: 'English test result', fa: 'نتیجهٔ آزمون انگلیسی' }, stage: 'visa' },
      { key: 'points', label: { en: 'Evidence for each points claim (degrees, work references, payslips)', fa: 'مدرک هر ادعای امتیاز (مدارک تحصیلی، گواهی‌های کاری، فیش حقوقی)' }, stage: 'visa' },
      { key: 'police', label: { en: 'Police certificates', fa: 'گواهی عدم سوءپیشینه' }, stage: 'visa' },
      { key: 'family', label: { en: 'Relationship documents for partner and children', fa: 'مدارک رابطه برای همسر و فرزندان' }, stage: 'visa' },
    ],
    realities: [
      {
        key: 'cutoffs',
        kind: 'challenge',
        title: { en: '65 points rarely gets an invitation', fa: '۶۵ امتیاز به‌ندرت دعوت می‌گیرد' },
        detail: {
          en: 'In the 4 June 2026 round, many occupations needed 80 or more; 65 was enough only for some trades such as bricklayer, carpenter and electrician.',
          fa: 'در دور ۴ ژوئن ۲۰۲۶ بسیاری از مشاغل به ۸۰ امتیاز یا بیشتر نیاز داشتند؛ ۶۵ فقط برای برخی مشاغل فنی مانند آجرچین، نجار و برق‌کار کافی بود.',
        },
        source: ROUNDS,
      },
      {
        key: 'age45',
        kind: 'challenge',
        title: { en: 'Turning 45 before the invitation ends it', fa: '۴۵ ساله‌شدن پیش از دعوت، مسیر را می‌بندد' },
        detail: {
          en: 'If you turn 45 after the EOI but before an invitation, you will not be invited.',
          fa: 'اگر پس از ثبت EOI و پیش از دعوت ۴۵ ساله شوید، دیگر دعوتی دریافت نمی‌کنید.',
        },
        source: V189,
      },
      {
        key: 'offshore-wait',
        kind: 'challenge',
        title: { en: 'Offshore applicants wait longer', fa: 'متقاضیان خارج از استرالیا بیشتر منتظر می‌مانند' },
        detail: {
          en: 'Under Direction No. 122, in October 2026 offshore files lodged up to November 2025 were being processed, against June 2026 for onshore and priority-sector files.',
          fa: 'طبق دستورالعمل ۱۲۲، در اکتبر ۲۰۲۶ پرونده‌های خارج از کشور تا نوامبر ۲۰۲۵ بررسی می‌شدند، در حالی که پرونده‌های داخل کشور و بخش‌های اولویت‌دار تا ژوئن ۲۰۲۶.',
        },
        source: V189,
      },
      {
        key: 'no-sponsor',
        kind: 'tip',
        title: { en: 'No employer or state needed', fa: 'به کارفرما یا ایالت نیازی ندارید' },
        detail: {
          en: '189 needs no sponsor or nominator and lets you live and work anywhere in Australia.',
          fa: 'ویزای ۱۸۹ به حامی یا معرف نیاز ندارد و اجازهٔ زندگی و کار در هر جای استرالیا را می‌دهد.',
        },
        source: V189,
      },
    ],
    timeline: PR_TIMELINE,
    quiz: [
      {
        key: 'min',
        q: { en: 'What is the minimum points score for an invitation?', fa: 'حداقل امتیاز برای دعوت چند است؟' },
        options: [{ en: '50', fa: '۵۰' }, { en: '65', fa: '۶۵' }, { en: '80', fa: '۸۰' }],
        answer: 1,
        why: { en: 'Without 65 points you will not be invited, though most rounds need more.', fa: 'بدون ۶۵ امتیاز دعوت نمی‌شوید، هرچند بیشتر دورها امتیاز بالاتری می‌خواهند.' },
      },
      {
        key: 'age',
        q: { en: 'What is the age limit?', fa: 'محدودیت سنی چیست؟' },
        options: [
          { en: 'Under 40 when you apply', fa: 'زیر ۴۰ سال هنگام درخواست' },
          { en: 'Under 45 when invited', fa: 'زیر ۴۵ سال هنگام دعوت' },
          { en: 'No limit', fa: 'محدودیتی ندارد' },
        ],
        answer: 1,
        why: { en: 'You must be under 45 when invited.', fa: 'باید هنگام دعوت زیر ۴۵ سال باشید.' },
      },
      {
        key: 'english',
        q: { en: 'What English level is required at invitation?', fa: 'در زمان دعوت چه سطحی از انگلیسی لازم است؟' },
        options: [
          { en: 'Functional', fa: 'کاربردی (Functional)' },
          { en: 'Competent', fa: 'Competent' },
          { en: 'Superior', fa: 'Superior' },
        ],
        answer: 1,
        why: { en: 'At least competent English at the time of invitation.', fa: 'دست‌کم سطح Competent در زمان دعوت.' },
      },
      {
        key: 'tie',
        q: { en: 'Two EOIs have the same score. Who is invited first?', fa: 'دو EOI امتیاز برابر دارند. کدام زودتر دعوت می‌شود؟' },
        options: [
          { en: 'The younger applicant', fa: 'متقاضی جوان‌تر' },
          { en: 'The one that reached the score earlier', fa: 'آن که زودتر به این امتیاز رسیده' },
          { en: 'A random draw', fa: 'قرعه‌کشی' },
        ],
        answer: 1,
        why: { en: 'Ties are broken by the date of effect, when the EOI reached its score.', fa: 'تساوی با «تاریخ اثر» شکسته می‌شود؛ یعنی زمانی که EOI به آن امتیاز رسیده است.' },
      },
      {
        key: 'assessment-age',
        q: { en: 'How old can your skills assessment be at invitation?', fa: 'ارزیابی مهارت در زمان دعوت حداکثر چقدر می‌تواند قدیمی باشد؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '3 years', fa: '۳ سال' }, { en: '10 years', fa: '۱۰ سال' }],
        answer: 1,
        why: { en: 'It must have been obtained in the 3 years before the invitation (or less, if it says so).', fa: 'باید در ۳ سال پیش از دعوت گرفته شده باشد (یا کمتر، اگر خودش مدت کوتاه‌تری داشته باشد).' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── SKILLED NOMINATED 190 ─────────────────────────────
  'au-skilled-190': {
    funds: [
      { key: 'vac', label: { en: 'Visa application charge, main applicant', fa: 'هزینهٔ درخواست ویزا، متقاضی اصلی' }, amount: 6_140, currency: 'AUD', basis: 'once', per: 'person', kind: 'spend', source: V190 },
    ],
    steps: [
      {
        key: 'state',
        title: { en: 'Pick a state and read its criteria', fa: 'یک ایالت انتخاب کنید و معیارهایش را بخوانید' },
        detail: { en: 'Each state or territory decides whom it nominates, with its own occupation lists and conditions.', fa: 'هر ایالت یا قلمرو خودش تصمیم می‌گیرد چه کسی را نامزد کند و فهرست شغل و شرایط خود را دارد.' },
        link: V190,
      },
      {
        key: 'assessment',
        title: { en: 'Skills assessment and English test', fa: 'ارزیابی مهارت و آزمون انگلیسی' },
        detail: { en: 'Same as 189: a suitable skills assessment and at least competent English.', fa: 'مانند ۱۸۹: ارزیابی مهارت مناسب و دست‌کم انگلیسی سطح Competent.' },
      },
      {
        key: 'eoi',
        title: { en: 'Submit an EOI in SkillSelect, selecting the state', fa: 'در SkillSelect با انتخاب ایالت، EOI ثبت کنید' },
        detail: { en: 'Some states also ask for a separate registration of interest on their own site.', fa: 'برخی ایالت‌ها ثبت‌نام جداگانه‌ای هم در سایت خودشان می‌خواهند.' },
        link: SKILLSELECT,
      },
      {
        key: 'nomination',
        title: { en: 'Nomination triggers the invitation', fa: 'نامزدی، دعوت‌نامه را صادر می‌کند' },
        detail: { en: 'When the state nominates you in SkillSelect, the invitation is issued.', fa: 'وقتی ایالت شما را در SkillSelect نامزد کند، دعوت‌نامه صادر می‌شود.' },
        link: ROUNDS,
      },
      {
        key: 'apply',
        title: { en: 'Apply in ImmiAccount within 60 days', fa: 'ظرف ۶۰ روز در ImmiAccount درخواست دهید' },
        detail: { en: 'With evidence for every points claim, health checks and police certificates.', fa: 'با مدرک همهٔ امتیازها، معاینهٔ پزشکی و گواهی عدم سوءپیشینه.' },
        link: IMMIACCOUNT,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport and national identity card', fa: 'گذرنامه و کارت ملی' }, stage: 'visa' },
      { key: 'assessment', label: { en: 'Skills assessment letter', fa: 'نامهٔ ارزیابی مهارت' }, stage: 'visa' },
      { key: 'english', label: { en: 'English test result', fa: 'نتیجهٔ آزمون انگلیسی' }, stage: 'visa' },
      { key: 'state-docs', label: { en: 'Whatever the state asks for its nomination', fa: 'مدارکی که ایالت برای نامزدی می‌خواهد' }, stage: 'apply' },
      { key: 'points', label: { en: 'Evidence for each points claim', fa: 'مدرک هر ادعای امتیاز' }, stage: 'visa' },
      { key: 'police', label: { en: 'Police certificates', fa: 'گواهی عدم سوءپیشینه' }, stage: 'visa' },
    ],
    realities: [
      {
        key: 'no-ceiling',
        kind: 'tip',
        title: { en: 'No occupation ceilings', fa: 'سقف شغلی ندارد' },
        detail: { en: 'Occupation ceilings do not apply to 190; state priorities do.', fa: 'سقف شغلی برای ۱۹۰ اعمال نمی‌شود؛ اولویت‌های ایالت تعیین‌کننده است.' },
        source: ROUNDS,
      },
      {
        key: 'state-rules',
        kind: 'challenge',
        title: { en: 'Eight sets of rules', fa: 'هشت مجموعه قاعدهٔ متفاوت' },
        detail: { en: 'ACT, NSW, NT, Queensland, South Australia, Tasmania, Victoria and Western Australia each run their own process.', fa: 'هر یک از ACT، نیوساوث‌ولز، قلمرو شمالی، کوئینزلند، استرالیای جنوبی، تاسمانی، ویکتوریا و استرالیای غربی روند خود را دارند.' },
        source: V190,
      },
      {
        key: 'withdrawn',
        kind: 'challenge',
        title: { en: 'A withdrawn nomination can sink the application', fa: 'پس‌گرفتن نامزدی می‌تواند درخواست را از بین ببرد' },
        detail: { en: 'The 190 page warns about what happens if the state withdraws its nomination after you apply; keep to the commitments you made to the state.', fa: 'صفحهٔ ویزای ۱۹۰ دربارهٔ پیامد پس‌گرفتن نامزدی پس از ثبت درخواست هشدار می‌دهد؛ به تعهداتی که به ایالت داده‌اید پایبند بمانید.' },
        source: V190,
      },
      {
        key: 'wait',
        kind: 'challenge',
        title: { en: 'Long queue for offshore applicants', fa: 'صف طولانی برای متقاضیان خارج از کشور' },
        detail: { en: 'In October 2026 offshore 190 files lodged up to February 2025 were being processed.', fa: 'در اکتبر ۲۰۲۶ پرونده‌های ۱۹۰ خارج از کشور که تا فوریهٔ ۲۰۲۵ ثبت شده بودند بررسی می‌شدند.' },
        source: V190,
      },
    ],
    timeline: PR_TIMELINE,
    quiz: [
      {
        key: 'who',
        q: { en: 'Who must nominate you for a 190?', fa: 'چه کسی باید شما را برای ۱۹۰ نامزد کند؟' },
        options: [
          { en: 'An employer', fa: 'یک کارفرما' },
          { en: 'A state or territory government agency', fa: 'نهاد دولتی یک ایالت یا قلمرو' },
          { en: 'A university', fa: 'یک دانشگاه' },
        ],
        answer: 1,
        why: { en: '190 requires nomination by an Australian state or territory government agency.', fa: 'ویزای ۱۹۰ نامزدی از سوی نهاد دولتی یک ایالت یا قلمرو را لازم دارد.' },
      },
      {
        key: 'trigger',
        q: { en: 'What happens when a state nominates you in SkillSelect?', fa: 'وقتی ایالت شما را در SkillSelect نامزد می‌کند چه می‌شود؟' },
        options: [
          { en: 'You get PR immediately', fa: 'فوراً اقامت دائم می‌گیرید' },
          { en: 'An invitation to apply is issued', fa: 'دعوت‌نامهٔ درخواست صادر می‌شود' },
          { en: 'You must wait for a federal round', fa: 'باید منتظر دور فدرال بمانید' },
        ],
        answer: 1,
        why: { en: 'A state nomination in SkillSelect triggers the invitation.', fa: 'نامزدی ایالت در SkillSelect دعوت‌نامه را صادر می‌کند.' },
      },
      {
        key: 'ceiling',
        q: { en: 'Do occupation ceilings apply to 190?', fa: 'آیا سقف شغلی برای ۱۹۰ اعمال می‌شود؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'خیر' }],
        answer: 1,
        why: { en: 'Home Affairs states that occupation ceilings do not apply to subclass 190.', fa: 'وزارت امور داخلی اعلام کرده که سقف شغلی برای ۱۹۰ اعمال نمی‌شود.' },
      },
      {
        key: 'points',
        q: { en: 'What is the minimum points score?', fa: 'حداقل امتیاز چند است؟' },
        options: [{ en: '60', fa: '۶۰' }, { en: '65', fa: '۶۵' }, { en: '70', fa: '۷۰' }],
        answer: 1,
        why: { en: 'Like 189, you need at least 65 points.', fa: 'مانند ۱۸۹، دست‌کم ۶۵ امتیاز لازم است.' },
      },
      {
        key: 'fee',
        q: { en: 'What is the main applicant’s charge for 190?', fa: 'هزینهٔ ویزای ۱۹۰ برای متقاضی اصلی چقدر است؟' },
        options: [{ en: 'AUD 4,890', fa: '۴٬۸۹۰ دلار استرالیا' }, { en: 'AUD 6,140', fa: '۶٬۱۴۰ دلار استرالیا' }, { en: 'AUD 18,335', fa: '۱۸٬۳۳۵ دلار استرالیا' }],
        answer: 1,
        why: { en: 'Home Affairs lists 190 from AUD 6,140.', fa: 'وزارت امور داخلی هزینهٔ ۱۹۰ را از ۶٬۱۴۰ دلار استرالیا اعلام کرده است.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── STUDENT 500 ─────────────────────────────
  'au-student': {
    funds: [
      { key: 'living', label: { en: 'Living costs, student, 12 months', fa: 'هزینهٔ زندگی دانشجو، ۱۲ ماه' }, amount: 29_710, currency: 'AUD', basis: 'perYear', per: 'person', kind: 'show', source: V500 },
      { key: 'travel', label: { en: 'Travel, applying from outside Australia (West Africa: AUD 3,000)', fa: 'سفر، درخواست از خارج استرالیا (غرب آفریقا: ۳٬۰۰۰ دلار)' }, amount: 2_000, currency: 'AUD', basis: 'once', per: 'person', kind: 'show', source: V500 },
      { key: 'partner', label: { en: 'Partner living costs, 12 months (only if exempt from the 2 Oct 2026 family rule)', fa: 'هزینهٔ زندگی همسر، ۱۲ ماه (فقط برای معاف‌شدگان از قاعدهٔ خانوادهٔ ۲ اکتبر ۲۰۲۶)' }, amount: 10_394, currency: 'AUD', basis: 'perYear', per: 'spouse', kind: 'show', source: V500 },
      { key: 'child', label: { en: 'Child living costs, 12 months (only if exempt)', fa: 'هزینهٔ زندگی فرزند، ۱۲ ماه (فقط برای معاف‌شدگان)' }, amount: 4_449, currency: 'AUD', basis: 'perYear', per: 'child', kind: 'show', source: V500 },
      { key: 'schooling', label: { en: 'Schooling, each school-age child (only if exempt)', fa: 'هزینهٔ مدرسه برای هر فرزند در سن مدرسه (فقط برای معاف‌شدگان)' }, amount: 13_502, currency: 'AUD', basis: 'perYear', per: 'child', kind: 'show', source: V500 },
      { key: 'vac', label: { en: 'Visa application charge', fa: 'هزینهٔ درخواست ویزا' }, amount: 2_500, currency: 'AUD', basis: 'once', per: 'person', kind: 'spend', source: V500 },
    ],
    steps: [
      {
        key: 'course',
        title: { en: 'Choose a CRICOS-registered course', fa: 'یک دورهٔ ثبت‌شده در CRICOS انتخاب کنید' },
        detail: { en: 'Only full-time CRICOS courses lead to a student visa.', fa: 'فقط دوره‌های تمام‌وقت ثبت‌شده در CRICOS به ویزای دانشجویی می‌رسند.' },
        link: CRICOS,
      },
      {
        key: 'coe',
        title: { en: 'Accept the offer and get your CoE', fa: 'پذیرش را قبول کنید و CoE بگیرید' },
        detail: { en: 'The Confirmation of Enrolment must be in the application, or it is invalid.', fa: 'تأییدیهٔ ثبت‌نام باید همراه درخواست باشد، وگرنه درخواست نامعتبر است.' },
      },
      {
        key: 'oshc',
        title: { en: 'Buy Overseas Student Health Cover', fa: 'بیمهٔ درمانی دانشجویان خارجی (OSHC) بخرید' },
        detail: { en: 'For the whole stay, unless you fall in an exemption category.', fa: 'برای تمام مدت اقامت، مگر در دسته‌های معاف.' },
      },
      {
        key: 'funds',
        title: { en: 'Prepare evidence of funds', fa: 'مدارک تمکن را آماده کنید' },
        detail: { en: 'AUD 29,710 living costs, the first 12 months of fees and travel; funds you genuinely access.', fa: '۲۹٬۷۱۰ دلار هزینهٔ زندگی، شهریهٔ ۱۲ ماه اول و هزینهٔ سفر؛ پولی که واقعاً به آن دسترسی دارید.' },
        link: V500,
      },
      {
        key: 'apply',
        title: { en: 'Apply online in ImmiAccount', fa: 'در ImmiAccount آنلاین درخواست دهید' },
        detail: { en: 'From outside Australia unless you hold an eligible visa and meet an exemption.', fa: 'از خارج استرالیا، مگر اینکه ویزای واجد شرایط و معافیت داشته باشید.' },
        link: IMMIACCOUNT,
      },
      {
        key: 'biometrics',
        title: { en: 'Biometrics and health checks if asked', fa: 'بیومتریک و معاینهٔ پزشکی در صورت درخواست' },
        detail: { en: 'Follow the requests in ImmiAccount.', fa: 'درخواست‌های ImmiAccount را دنبال کنید.' },
        link: HEALTH,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport', fa: 'گذرنامه' }, stage: 'visa' },
      { key: 'coe', label: { en: 'Confirmation of Enrolment (CoE) for every course', fa: 'تأییدیهٔ ثبت‌نام (CoE) برای همهٔ دوره‌ها' }, stage: 'visa' },
      { key: 'gs', label: { en: 'Genuine Student answers', fa: 'پاسخ‌های شرط دانشجوی واقعی (Genuine Student)' }, stage: 'visa' },
      { key: 'funds', label: { en: 'Evidence of funds and of genuine access to them', fa: 'مدرک تمکن و دسترسی واقعی به آن' }, stage: 'visa' },
      { key: 'oshc', label: { en: 'OSHC policy', fa: 'بیمه‌نامهٔ OSHC' }, stage: 'visa' },
      { key: 'welfare', label: { en: 'Welfare arrangement if under 18', fa: 'ترتیبات سرپرستی برای زیر ۱۸ سال' }, stage: 'visa' },
    ],
    realities: [
      {
        key: 'family-rule',
        kind: 'challenge',
        title: { en: 'Family can no longer come along', fa: 'خانواده دیگر نمی‌تواند همراه بیاید' },
        detail: {
          en: 'From 2 October 2026 most students cannot include a partner or children, and family cannot apply later as subsequent entrants.',
          fa: 'از ۲ اکتبر ۲۰۲۶ بیشتر دانشجویان نمی‌توانند همسر یا فرزند را در پرونده بیاورند و اعضای خانواده بعداً هم نمی‌توانند جداگانه درخواست دهند.',
        },
        source: V500,
      },
      {
        key: 'work',
        kind: 'tip',
        title: { en: '48 hours a fortnight in session', fa: '۴۸ ساعت در هر دو هفته در طول ترم' },
        detail: {
          en: 'Unlimited for master’s by research and doctoral students.',
          fa: 'برای دانشجویان ارشد پژوهشی و دکتری محدودیتی ندارد.',
        },
        source: V500,
      },
      {
        key: 'not-work-funded',
        kind: 'myth',
        title: { en: 'Myth: part-time work will cover living costs', fa: 'باور نادرست: کار پاره‌وقت هزینهٔ زندگی را می‌دهد' },
        detail: {
          en: 'Home Affairs says not to rely on work to support yourself, and that real living costs may be much higher than the visa minimum.',
          fa: 'وزارت امور داخلی می‌گوید روی کار برای تأمین هزینه‌ها حساب نکنید و هزینهٔ واقعی زندگی ممکن است خیلی بیشتر از حداقل ویزا باشد.',
        },
        source: V500,
      },
      {
        key: 'no-pr',
        kind: 'challenge',
        title: { en: 'A student visa is not a PR path by itself', fa: 'ویزای دانشجویی به‌تنهایی مسیر اقامت دائم نیست' },
        detail: {
          en: 'After study you need another visa (Temporary Graduate 485, or a skilled or employer visa) before PR.',
          fa: 'پس از تحصیل برای رسیدن به اقامت دائم ویزای دیگری لازم است (فارغ‌التحصیلی موقت ۴۸۵، یا ویزای مهارتی یا کارفرمایی).',
        },
        source: V500,
      },
    ],
    timeline: {
      dualCitizenship: 'allowed',
      note: {
        en: 'Study time on a valid visa counts toward the 4 years of lawful residence for citizenship, but you also need 12 months as a permanent resident.',
        fa: 'سال‌های تحصیل با ویزای معتبر در ۴ سال اقامت قانونی برای شهروندی حساب می‌شود، اما ۱۲ ماه اقامت دائم هم لازم است.',
      },
      source: CITIZEN,
    },
    quiz: [
      {
        key: 'family',
        q: { en: 'Since 2 October 2026, can most students bring a partner?', fa: 'از ۲ اکتبر ۲۰۲۶ آیا بیشتر دانشجویان می‌توانند همسر بیاورند؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No, unless exempt', fa: 'خیر، مگر در دسته‌های معاف' }, { en: 'Only after 6 months', fa: 'فقط پس از ۶ ماه' }],
        answer: 1,
        why: { en: 'Most Student visa applicants can no longer include family members.', fa: 'بیشتر متقاضیان ویزای دانشجویی دیگر نمی‌توانند اعضای خانواده را بیاورند.' },
      },
      {
        key: 'living',
        q: { en: 'What is the 12-month living-cost figure for a student?', fa: 'رقم هزینهٔ زندگی ۱۲ ماهه برای دانشجو چقدر است؟' },
        options: [{ en: 'AUD 21,041', fa: '۲۱٬۰۴۱ دلار استرالیا' }, { en: 'AUD 29,710', fa: '۲۹٬۷۱۰ دلار استرالیا' }, { en: 'AUD 40,000', fa: '۴۰٬۰۰۰ دلار استرالیا' }],
        answer: 1,
        why: { en: 'Home Affairs lists AUD 29,710 for students.', fa: 'وزارت امور داخلی برای دانشجو ۲۹٬۷۱۰ دلار استرالیا اعلام کرده است.' },
      },
      {
        key: 'coe',
        q: { en: 'What makes an application invalid on lodgement?', fa: 'نبودِ چه چیزی درخواست را از همان ابتدا نامعتبر می‌کند؟' },
        options: [{ en: 'No CoE', fa: 'نداشتن CoE' }, { en: 'No job offer', fa: 'نداشتن پیشنهاد کار' }, { en: 'No IELTS 7', fa: 'نداشتن آیلتس ۷' }],
        answer: 0,
        why: { en: 'Without a Confirmation of Enrolment at lodgement the application is invalid.', fa: 'بدون تأییدیهٔ ثبت‌نام هنگام ثبت، درخواست نامعتبر است.' },
      },
      {
        key: 'work',
        q: { en: 'How much can you work while your course is in session?', fa: 'در طول ترم چقدر می‌توانید کار کنید؟' },
        options: [{ en: '20 hours a week', fa: '۲۰ ساعت در هفته' }, { en: '48 hours a fortnight', fa: '۴۸ ساعت در هر دو هفته' }, { en: 'No work', fa: 'اجازهٔ کار ندارید' }],
        answer: 1,
        why: { en: 'Up to 48 hours a fortnight when the course is in session.', fa: 'تا ۴۸ ساعت در هر دو هفته در طول ترم.' },
      },
      {
        key: 'fee',
        q: { en: 'What is the visa charge for the main applicant?', fa: 'هزینهٔ ویزا برای متقاضی اصلی چقدر است؟' },
        options: [{ en: 'AUD 710', fa: '۷۱۰ دلار استرالیا' }, { en: 'AUD 2,500', fa: '۲٬۵۰۰ دلار استرالیا' }, { en: 'AUD 6,135', fa: '۶٬۱۳۵ دلار استرالیا' }],
        answer: 1,
        why: { en: 'The Student visa costs from AUD 2,500.', fa: 'هزینهٔ ویزای دانشجویی از ۲٬۵۰۰ دلار استرالیا شروع می‌شود.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_AU: CountryProfile = {
  strengths: [
    {
      en: 'Several routes give permanent residence on grant (NIV, 189, 190), with no temporary stage to survive.',
      fa: 'چند مسیر (NIV، ۱۸۹ و ۱۹۰) از همان روز صدور اقامت دائم می‌دهند و مرحلهٔ موقتی ندارند.',
    },
    {
      en: 'Citizenship after 4 years of residence, with dual citizenship allowed.',
      fa: 'شهروندی پس از ۴ سال اقامت، با امکان تابعیت دوگانه.',
    },
    {
      en: 'English-speaking, with high human development (HDI rank 7) and incomes (GDP per head about USD 65,000).',
      fa: 'انگلیسی‌زبان، با توسعهٔ انسانی بالا (رتبهٔ ۷ در HDI) و درآمد بالا (تولید سرانه حدود ۶۵ هزار دلار).',
    },
    {
      en: 'The NIV rewards achievement, not capital: no investment threshold.',
      fa: 'ویزای نوآوری ملی به دستاورد امتیاز می‌دهد نه به سرمایه: حداقل سرمایه‌گذاری ندارد.',
    },
  ],
  weaknesses: [
    {
      en: 'Very selective: about one NIV expression of interest in nine was invited in mid-2026, and skilled cut-offs often exceed 80 points.',
      fa: 'بسیار گزینشی است: در میانهٔ ۲۰۲۶ از هر ۹ ابراز تمایل NIV حدود یکی دعوت شد و حد نصاب ویزاهای مهارتی اغلب بالای ۸۰ امتیاز است.',
    },
    {
      en: 'No dedicated route for early-stage founders since the business visas closed in July 2024.',
      fa: 'از زمان بسته‌شدن ویزاهای تجاری در ژوئیهٔ ۲۰۲۴، مسیر ویژه‌ای برای بنیان‌گذاران مراحل اولیه وجود ندارد.',
    },
    {
      en: 'Students can no longer bring a partner or children (from 2 Oct 2026), and living-cost proof is high.',
      fa: 'دانشجویان دیگر نمی‌توانند همسر و فرزند بیاورند (از ۲ اکتبر ۲۰۲۶) و تمکن لازم برای هزینهٔ زندگی بالاست.',
    },
    {
      en: 'Skilled routes stop at age 45, and offshore applicants wait longest in the processing queue.',
      fa: 'مسیرهای مهارتی در ۴۵ سالگی بسته می‌شوند و متقاضیان خارج از کشور بیشترین انتظار را در صف بررسی دارند.',
    },
  ],
  indicators: [
    { key: 'hdi', rank: 7, of: 193, value: 0.958, year: 2023, source: { url: 'https://hdr.undp.org/data-center/human-development-index', checked: '2026-10-27', label: 'UNDP HDR 2025, Table 1 (2023 data)' } },
    { key: 'happiness', rank: 15, year: 2025, source: { url: 'https://data.worldhappiness.report/table', checked: '2026-10-27', label: 'World Happiness Report dashboard, year 2025' } },
    { key: 'peace', rank: 20, of: 163, value: 1.602, year: 2026, source: { url: 'https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf', checked: '2026-10-27', label: 'Global Peace Index 2026' } },
    { key: 'innovation', rank: 20, of: 139, year: 2026, source: { url: 'https://www.wipo.int/gii-ranking/en/rank', checked: '2026-10-27', label: 'WIPO Global Innovation Index 2026' } },
    { key: 'gdp-per-capita', value: 65_130, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/AUS/indicator/NY.GDP.PCAP.CD?format=json&mrnev=1', checked: '2026-10-27', label: 'World Bank, GDP per capita (current US$)' } },
    { key: 'unemployment', value: 4.09, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/AUS/indicator/SL.UEM.TOTL.ZS?format=json&mrnev=1', checked: '2026-10-27', label: 'World Bank, unemployment (modelled ILO)' } },
  ],
};
