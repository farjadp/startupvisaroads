// Netherlands: route depth (v3) and country profile. Research 2026-10-27, see
// docs/research/app-v3/nl.md. Every figure was read on the official page cited
// next to it on 2026-10-27. The Netherlands start-up notebook (0eb326f2-…) was
// used for leads only; its chat holds a third-party price list that is not
// official and must never reach the app.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-10-27';

const IND_STARTUP = 'https://ind.nl/en/residence-permits/work/start-up'; // updated 8 Jun 2026
const IND_SELF = 'https://ind.nl/en/residence-permits/work/residence-permit-self-employed-person'; // updated 13 Oct 2026
const IND_STUDY = 'https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education'; // updated 21 Sep 2026
const IND_AMOUNTS = 'https://ind.nl/en/required-amounts-income-requirements'; // self-employed 1 Jul–31 Dec 2026, study 2026
const IND_FEES = 'https://ind.nl/en/fees-costs-of-an-application';
const IND_INCOME = 'https://ind.nl/en/independent-sustainable-and-sufficient-income'; // updated 1 Jul 2026
const IND_PURPOSES = 'https://ind.nl/en/temporary-and-non-temporary-purposes-of-residence'; // updated 27 Mar 2026
const IND_PR = 'https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit'; // updated 20 May 2026
const IND_NATURALISATION = 'https://ind.nl/en/dutch-citizenship/becoming-a-dutch-national-through-naturalisation'; // updated 20 Oct 2026
const IND_RENOUNCE = 'https://ind.nl/en/renouncing-your-nationality'; // updated 8 Jun 2026
const RVO_FACILITATORS = 'https://english.rvo.nl/topics/residence-permit-foreign-startups/facilitator-startups'; // checked by RVO 26 Jun 2026
const RVO_STARTUP = 'https://english.rvo.nl/topics/residence-permit-foreign-startups';
const KVK_FEE = 'https://www.kvk.nl/en/registration/registration-fee/';
const KVK_REGISTER = 'https://www.kvk.nl/en/registration/new-business/';
const NL_NOTEBOOK = '0eb326f2-c885-4d97-b6bd-c63ac846ae2a';

const WORK_TIMELINE: Timeline = {
  prAfterYears: 5,
  citizenshipAfterYears: 5,
  dualCitizenship: 'restricted',
  language: {
    en: 'Civic integration exam at level A2 for permanent residence and for naturalisation.',
    fa: 'آزمون هم‌گرایی مدنی (civic integration) در سطح A2، هم برای اقامت دائم و هم برای تابعیت.',
  },
  note: {
    en: 'Self-employed and start-up permits are non-temporary, so they count toward the 5 years. Permanent residence also needs the income requirement. Naturalisation: 5 consecutive years with a valid permit, and you must renounce your current nationality unless an exemption applies (for example, married to a Dutch citizen when the Royal Decree is signed, or a country whose law or government does not allow it).',
    fa: 'اقامت خوداشتغالی و استارتاپی «غیرموقت» به شمار می‌روند و در ۵ سال حساب می‌شوند. اقامت دائم شرط درآمد هم دارد. تابعیت: ۵ سال پیاپی با اقامت معتبر، و باید تابعیت فعلی را کنار بگذارید مگر یکی از استثناها شامل حالتان شود (مثلاً ازدواج با شهروند هلندی در روز امضای فرمان سلطنتی تابعیت، یا کشوری که قانون یا دولتش ترک تابعیت را ممکن نمی‌کند).',
  },
  source: IND_NATURALISATION,
};

export const EXTRAS_NL: Record<string, RouteExtras> = {
  // ───────────────────────────── START-UP ─────────────────────────────
  'nl-startup': {
    funds: [
      {
        key: 'founder-month',
        label: { en: 'Each founder, per month, gross incl. holiday allowance (1 Jul–31 Dec 2026)', fa: 'هر بنیان‌گذار، ماهانه، ناخالص با کمک‌هزینه‌ی تعطیلات (۱ ژوئیه تا ۳۱ دسامبر ۲۰۲۶)' },
        amount: 1_766.77,
        currency: 'EUR',
        basis: 'month',
        per: 'founder',
        kind: 'show',
        source: IND_AMOUNTS,
      },
      {
        key: 'founder-year',
        label: { en: 'Each founder, for the 1-year permit', fa: 'هر بنیان‌گذار، برای اقامت ۱ ساله' },
        amount: 21_201.24,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'show',
        approx: true,
        source: IND_AMOUNTS,
      },
      {
        key: 'ind-fee',
        label: { en: 'IND application fee, each founder', fa: 'هزینه‌ی درخواست IND، برای هر بنیان‌گذار' },
        amount: 423,
        currency: 'EUR',
        basis: 'once',
        per: 'founder',
        kind: 'spend',
        source: IND_FEES,
      },
      {
        key: 'kvk-fee',
        label: { en: 'KvK Trade Register registration', fa: 'ثبت در دفتر ثبت تجاری KvK' },
        amount: 85.15,
        currency: 'EUR',
        basis: 'once',
        per: 'team',
        kind: 'spend',
        source: KVK_FEE,
      },
      {
        key: 'spouse-fee',
        label: { en: 'Residence permit fee for a partner (stay with a family member)', fa: 'هزینه‌ی اقامت همسر یا شریک زندگی (اقامت نزد عضو خانواده)' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'spouse',
        kind: 'spend',
        source: IND_FEES,
      },
      {
        key: 'child-fee',
        label: { en: 'Residence permit fee for each child', fa: 'هزینه‌ی اقامت هر فرزند' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'child',
        kind: 'spend',
        source: IND_FEES,
      },
    ],
    steps: [
      {
        key: 'facilitator',
        title: { en: 'Find a facilitator on the RVO list and sign a contract', fa: 'یافتن تسهیل‌گر در فهرست RVO و امضای قرارداد' },
        detail: {
          en: 'RVO lists the recognised facilitators (31 on 26 June 2026). The facilitator may not hold a majority stake or be a relative up to the third degree.',
          fa: 'RVO فهرست تسهیل‌گرهای (facilitator) شناخته‌شده را منتشر می‌کند (۳۱ مورد در ۲۶ ژوئن ۲۰۲۶). تسهیل‌گر نباید سهام اکثریت داشته باشد یا تا درجه‌ی سوم از بستگان شما باشد.',
        },
        link: RVO_FACILITATORS,
      },
      {
        key: 'plan',
        title: { en: 'Write the step plan from idea to company', fa: 'نوشتن برنامه‌ی گام‌به‌گام از ایده تا شرکت' },
        detail: {
          en: 'The product must be innovative: new to the Netherlands, new technology, or a new way of organising. RVO assesses the plan and advises the IND.',
          fa: 'محصول باید نوآورانه باشد: تازه برای بازار هلند، فناوری جدید یا شیوه‌ی سازمان‌دهی نو. RVO برنامه را ارزیابی می‌کند و به IND نظر می‌دهد.',
        },
        link: IND_STARTUP,
      },
      {
        key: 'kvk',
        title: { en: 'Register in the KvK Trade Register', fa: 'ثبت در دفتر ثبت تجاری KvK' },
        detail: {
          en: 'Both you and the facilitator must be registered. The one-off KvK fee is EUR 85.15.',
          fa: 'هم شما و هم تسهیل‌گر باید ثبت شده باشید. هزینه‌ی یک‌باره‌ی KvK ۸۵٫۱۵ یورو است.',
        },
        link: KVK_REGISTER,
      },
      {
        key: 'funds',
        title: { en: 'Arrange the funds', fa: 'آماده‌کردن تمکن مالی' },
        detail: {
          en: 'Show EUR 1,766.77 a month for the year on a Dutch bank statement, or have the facilitator finance your stay for up to 1 year. The amount changes on 1 January and 1 July.',
          fa: 'ماهی ۱٬۷۶۶٫۷۷ یورو برای یک سال را با صورت‌حساب بانک هلندی نشان دهید، یا تسهیل‌گر هزینه‌ی اقامت را تا ۱ سال تأمین کند. این مبلغ در ۱ ژانویه و ۱ ژوئیه تغییر می‌کند.',
        },
        link: IND_AMOUNTS,
      },
      {
        key: 'apply',
        title: { en: 'Apply for the MVV and residence permit together', fa: 'درخواست هم‌زمان ویزای MVV و اقامت' },
        detail: {
          en: 'From abroad at the Dutch representation, or in the Netherlands if you need no MVV. The facilitator can apply online through the Business Portal. Forms 9541 and 7558. Fee EUR 423.',
          fa: 'از خارج در نمایندگی هلند، یا از داخل هلند اگر به MVV نیاز ندارید. تسهیل‌گر می‌تواند از راه Business Portal آنلاین درخواست بدهد. فرم‌های ۹۵۴۱ و ۷۵۵۸. هزینه ۴۲۳ یورو.',
        },
        takes: { en: 'Decision within 90 days; the IND can extend this', fa: 'تصمیم ظرف ۹۰ روز؛ IND می‌تواند تمدیدش کند' },
        link: IND_STARTUP,
      },
      {
        key: 'arrive',
        title: { en: 'Arrive, collect the permit, take the TB test if asked', fa: 'ورود، گرفتن کارت اقامت و آزمایش سل در صورت لزوم' },
        detail: {
          en: 'If your application said you would take a TB test, book the GGD within 3 months of receiving the permit and bring form 7604.',
          fa: 'اگر در درخواست اعلام کرده‌اید آزمایش سل می‌دهید، ظرف ۳ ماه پس از گرفتن اقامت از GGD وقت بگیرید و فرم ۷۶۰۴ را همراه ببرید.',
        },
        link: IND_STARTUP,
      },
      {
        key: 'switch',
        title: { en: 'Switch to the self-employed permit before the year ends', fa: 'تغییر به اقامت خوداشتغالی پیش از پایان سال' },
        detail: {
          en: 'The start-up permit cannot be extended. Apply for the self-employed permit with a facilitator declaration of at least 3 months of successful mentoring, or meet the standard self-employed requirements. Fee EUR 423.',
          fa: 'اقامت استارتاپی تمدید نمی‌شود. با اظهارنامه‌ی تسهیل‌گر درباره‌ی دست‌کم ۳ ماه راهبری موفق، یا با احراز شرایط عادی خوداشتغالی، برای اقامت خوداشتغالی درخواست بدهید. هزینه ۴۲۳ یورو.',
        },
        link: IND_SELF,
      },
    ],
    documents: [
      { key: 'form', label: { en: 'Application forms 9541 / 7558 (their checklist lists the full set)', fa: 'فرم‌های درخواست ۹۵۴۱ و ۷۵۵۸ (فهرست کامل مدارک در خود فرم است)' }, stage: 'apply' },
      { key: 'contract', label: { en: 'Signed contract with an RVO-listed facilitator', fa: 'قرارداد امضاشده با تسهیل‌گر فهرست‌شده در RVO' }, stage: 'apply' },
      { key: 'step-plan', label: { en: 'Step plan from idea to company', fa: 'برنامه‌ی گام‌به‌گام از ایده تا شرکت' }, stage: 'apply' },
      { key: 'kvk', label: { en: 'KvK registration for you and the facilitator', fa: 'ثبت KvK برای شما و تسهیل‌گر' }, stage: 'apply' },
      {
        key: 'funds',
        label: { en: 'Dutch bank statement, or the facilitator’s financing of your stay', fa: 'صورت‌حساب بانک هلندی، یا تأمین هزینه‌ی اقامت از سوی تسهیل‌گر' },
        stage: 'apply',
      },
      {
        key: 'legalised',
        label: { en: 'Foreign official documents legalised and translated (Dutch, English, French or German)', fa: 'اسناد رسمی خارجی، قانونی‌شده و ترجمه‌شده (هلندی، انگلیسی، فرانسوی یا آلمانی)' },
        stage: 'apply',
      },
      { key: 'tb-form', label: { en: 'TB referral form 7604, if you said you would take the test', fa: 'فرم ارجاع آزمایش سل ۷۶۰۴، اگر اعلام کرده‌اید آزمایش می‌دهید' }, stage: 'permit' },
      {
        key: 'facilitator-declaration',
        label: { en: 'Facilitator declaration: at least 3 months of successful mentoring', fa: 'اظهارنامه‌ی تسهیل‌گر: دست‌کم ۳ ماه راهبری موفق' },
        stage: 'renewal',
      },
    ],
    realities: [
      {
        key: 'not-extendable',
        kind: 'myth',
        title: { en: 'Myth: the start-up permit can be extended for a second year', fa: 'باور نادرست: اقامت استارتاپی یک سال دیگر تمدید می‌شود' },
        detail: {
          en: 'The IND says it cannot be extended. After one year you need the self-employed permit, which runs up to 2 years at a time.',
          fa: 'به گفته‌ی IND این اقامت تمدید نمی‌شود. پس از یک سال باید اقامت خوداشتغالی بگیرید که هر بار تا ۲ سال اعتبار دارد.',
        },
        source: IND_STARTUP,
      },
      {
        key: 'dutch-account',
        kind: 'myth',
        title: { en: 'Myth: any bank statement abroad proves the funds', fa: 'باور نادرست: صورت‌حساب هر بانکی در خارج کافی است' },
        detail: {
          en: 'The IND asks for a Dutch bank statement, or the facilitator finances your stay for up to a year.',
          fa: 'IND صورت‌حساب بانک هلندی می‌خواهد، یا اینکه تسهیل‌گر هزینه‌ی اقامت را تا یک سال بپردازد.',
        },
        source: IND_STARTUP,
      },
      {
        key: 'facilitator-rules',
        kind: 'challenge',
        title: { en: 'The facilitator is the gate', fa: 'تسهیل‌گر دروازه‌ی اصلی است' },
        detail: {
          en: 'Without a signed contract with one of the RVO-recognised facilitators there is no application. The facilitator must be financially healthy, not hold a majority, and not be family.',
          fa: 'بدون قرارداد امضاشده با یکی از تسهیل‌گرهای شناخته‌شده‌ی RVO درخواستی در کار نیست. تسهیل‌گر باید از نظر مالی سالم باشد، سهام اکثریت نداشته باشد و از خانواده‌ی شما نباشد.',
        },
        source: RVO_FACILITATORS,
      },
      {
        key: 'realistic-milestones',
        kind: 'tip',
        title: { en: 'Write milestones you can reach in a year', fa: 'مایلستون‌هایی بنویسید که در یک سال دست‌یافتنی باشند' },
        detail: {
          en: 'To switch you need the facilitator to declare at least 3 months of successful mentoring. Progress against your own step plan is what they can vouch for.',
          fa: 'برای تغییر وضعیت، تسهیل‌گر باید دست‌کم ۳ ماه راهبری موفق را تأیید کند. پیشرفت شما در برابر برنامه‌ی گام‌به‌گام خودتان همان چیزی است که می‌تواند تأییدش کند.',
        },
        source: IND_STARTUP,
      },
      {
        key: 'amount-moves',
        kind: 'challenge',
        title: { en: 'The required amount moves twice a year', fa: 'مبلغ لازم سالی دو بار تغییر می‌کند' },
        detail: {
          en: 'EUR 1,766.77 a month is valid from 1 July to 31 December 2026. Check the IND amounts page in the month you apply.',
          fa: '۱٬۷۶۶٫۷۷ یورو در ماه از ۱ ژوئیه تا ۳۱ دسامبر ۲۰۲۶ معتبر است. در ماهی که درخواست می‌دهید صفحه‌ی مبالغ IND را دوباره ببینید.',
        },
        source: IND_AMOUNTS,
      },
    ],
    timeline: WORK_TIMELINE,
    quiz: [
      {
        key: 'length',
        q: { en: 'How long is the start-up permit valid?', fa: 'اقامت استارتاپی هلند چه مدت اعتبار دارد؟' },
        options: [
          { en: '1 year, not extendable', fa: '۱ سال، بدون تمدید' },
          { en: '1 year, extendable once', fa: '۱ سال، یک‌بار قابل تمدید' },
          { en: '2 years', fa: '۲ سال' },
        ],
        answer: 0,
        why: { en: 'After the year you switch to the self-employed permit.', fa: 'پس از یک سال باید به اقامت خوداشتغالی تغییر وضعیت دهید.' },
      },
      {
        key: 'facilitator',
        q: { en: 'Which of these can be your facilitator?', fa: 'کدام‌یک می‌تواند تسهیل‌گر شما باشد؟' },
        options: [
          { en: 'Your uncle’s company', fa: 'شرکت عموی شما' },
          { en: 'An RVO-listed organisation with a minority stake', fa: 'سازمانی در فهرست RVO با سهم اقلیت' },
          { en: 'An investor holding 60%', fa: 'سرمایه‌گذاری با ۶۰ درصد سهام' },
        ],
        answer: 1,
        why: { en: 'No majority stake and no relatives up to the third degree.', fa: 'سهام اکثریت و خویشاوندی تا درجه‌ی سوم ممنوع است.' },
      },
      {
        key: 'funds',
        q: { en: 'How much per month must be available (1 Jul–31 Dec 2026)?', fa: 'ماهانه چه مبلغی باید در دسترس باشد (۱ ژوئیه تا ۳۱ دسامبر ۲۰۲۶)؟' },
        options: [
          { en: 'EUR 1,130.77', fa: '۱٬۱۳۰٫۷۷ یورو' },
          { en: 'EUR 1,766.77', fa: '۱٬۷۶۶٫۷۷ یورو' },
          { en: 'EUR 3,122', fa: '۳٬۱۲۲ یورو' },
        ],
        answer: 1,
        why: { en: 'The self-employed amount applies; 3,122 is for essential start-up staff.', fa: 'مبلغ خوداشتغالی ملاک است؛ ۳٬۱۲۲ مربوط به کارکنان ضروری استارتاپ است.' },
      },
      {
        key: 'fee',
        q: { en: 'What is the IND fee for the start-up permit?', fa: 'هزینه‌ی IND برای اقامت استارتاپی چقدر است؟' },
        options: [
          { en: 'EUR 254', fa: '۲۵۴ یورو' },
          { en: 'EUR 423', fa: '۴۲۳ یورو' },
          { en: 'EUR 1,139', fa: '۱٬۱۳۹ یورو' },
        ],
        answer: 1,
        why: { en: 'EUR 423, the same as the later switch to self-employed.', fa: '۴۲۳ یورو، همان هزینه‌ی تغییر بعدی به خوداشتغالی.' },
      },
      {
        key: 'who-advises',
        q: { en: 'Who assesses the step plan for the IND?', fa: 'چه نهادی برنامه‌ی گام‌به‌گام را برای IND ارزیابی می‌کند؟' },
        options: [
          { en: 'KvK', fa: 'KvK' },
          { en: 'RVO', fa: 'RVO' },
          { en: 'The municipality', fa: 'شهرداری' },
        ],
        answer: 1,
        why: { en: 'The IND page says the RVO assesses the step plan.', fa: 'طبق صفحه‌ی IND، برنامه را RVO ارزیابی می‌کند.' },
      },
    ],
    media: [
      { notebookId: NL_NOTEBOOK, kind: 'slides', title: 'Netherlands Startup Visa Blueprint' },
      { notebookId: NL_NOTEBOOK, kind: 'slides', title: 'Netherlands Startup Visa Strategic Blueprint' },
      { notebookId: NL_NOTEBOOK, kind: 'slides', title: 'Netherlands Strategic Founder Memo' },
      { notebookId: NL_NOTEBOOK, kind: 'infographic', title: 'راهنمای فرآیند ویزای استارتاپ هلند' },
      { notebookId: NL_NOTEBOOK, kind: 'infographic', title: 'نقشه راهبردی ویزای استارتاپ هلند' },
      { notebookId: NL_NOTEBOOK, kind: 'infographic', title: 'راهنمای کامل ویزای استارتاپ هلند' },
    ],
  },

  // ───────────────────────────── SELF-EMPLOYED ─────────────────────────────
  'nl-self-employed': {
    funds: [
      {
        key: 'ind-fee',
        label: { en: 'IND application fee (also when switching from start-up)', fa: 'هزینه‌ی درخواست IND (در تغییر از استارتاپ هم همین)' },
        amount: 423,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: IND_FEES,
      },
      {
        key: 'kvk-fee',
        label: { en: 'KvK Trade Register registration', fa: 'ثبت در دفتر ثبت تجاری KvK' },
        amount: 85.15,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: KVK_FEE,
      },
      {
        key: 'daft',
        label: { en: 'US or Japanese nationals under the treaty route: investment in the business', fa: 'اتباع آمریکا یا ژاپن در مسیر معاهده: سرمایه‌گذاری در کسب‌وکار' },
        amount: 4_500,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'invest',
        source: IND_SELF,
      },
      {
        key: 'spouse-fee',
        label: { en: 'Residence permit fee for a partner', fa: 'هزینه‌ی اقامت همسر یا شریک زندگی' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'spouse',
        kind: 'spend',
        source: IND_FEES,
      },
      {
        key: 'child-fee',
        label: { en: 'Residence permit fee for each child', fa: 'هزینه‌ی اقامت هر فرزند' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'child',
        kind: 'spend',
        source: IND_FEES,
      },
    ],
    steps: [
      {
        key: 'points',
        title: { en: 'Check the points', fa: 'بررسی امتیازها' },
        detail: {
          en: 'At least 30 points in each of personal experience, business plan and added value, or 45 and 45 in the first two. Turkish nationals, EU long-term residents and independent professions are assessed differently; US and Japanese nationals can use the treaty route.',
          fa: 'دست‌کم ۳۰ امتیاز در هر سه بخش سابقه‌ی شخصی، طرح کسب‌وکار و ارزش افزوده، یا ۴۵ و ۴۵ در دو بخش نخست. اتباع ترکیه، دارندگان اقامت بلندمدت اتحادیه‌ی اروپا و حرفه‌های مستقل به شکل دیگری ارزیابی می‌شوند؛ اتباع آمریکا و ژاپن می‌توانند از مسیر معاهده استفاده کنند.',
        },
        link: IND_SELF,
      },
      {
        key: 'plan',
        title: { en: 'Write the business plan with an income forecast', fa: 'نوشتن طرح کسب‌وکار با پیش‌بینی درآمد' },
        detail: {
          en: 'The plan must show business profit of at least EUR 1,766.77 gross a month including holiday allowance (1 Jul–31 Dec 2026). Freelancers need at least one commission in the Netherlands.',
          fa: 'طرح باید سود کسب‌وکار دست‌کم ۱٬۷۶۶٫۷۷ یورو ناخالص در ماه با کمک‌هزینه‌ی تعطیلات را نشان دهد (۱ ژوئیه تا ۳۱ دسامبر ۲۰۲۶). فریلنسرها دست‌کم یک سفارش در هلند لازم دارند.',
        },
        link: IND_AMOUNTS,
      },
      {
        key: 'kvk',
        title: { en: 'Register with the KvK and get any professional permits', fa: 'ثبت در KvK و گرفتن مجوزهای حرفه‌ای' },
        detail: {
          en: 'Some medical professions also need BIG registration.',
          fa: 'برخی حرفه‌های پزشکی ثبت BIG هم لازم دارند.',
        },
        link: KVK_REGISTER,
      },
      {
        key: 'documents',
        title: { en: 'Collect, legalise and translate documents', fa: 'جمع‌آوری، قانونی‌کردن و ترجمه‌ی مدارک' },
        detail: {
          en: 'Foreign official documents must be legalised and translated into Dutch, English, French or German. The form lists what is needed.',
          fa: 'اسناد رسمی خارجی باید قانونی و به هلندی، انگلیسی، فرانسوی یا آلمانی ترجمه شوند. فهرست مدارک در خود فرم آمده است.',
        },
        link: IND_SELF,
      },
      {
        key: 'apply',
        title: { en: 'Apply for the MVV and permit at the embassy', fa: 'درخواست MVV و اقامت در سفارت' },
        detail: {
          en: 'Forms 9531 and 7524. Send the application to the IND within 3 weeks and pay EUR 423 within 3 weeks of the date on the form.',
          fa: 'فرم‌های ۹۵۳۱ و ۷۵۲۴. درخواست را ظرف ۳ هفته به IND بفرستید و ۴۲۳ یورو را ظرف ۳ هفته از تاریخ فرم بپردازید.',
        },
        link: IND_SELF,
      },
      {
        key: 'decision',
        title: { en: 'Wait for the decision', fa: 'انتظار برای تصمیم' },
        detail: {
          en: 'If RVO or OCW advice is requested, the IND can extend the period.',
          fa: 'اگر IND از RVO یا OCW نظر بخواهد، مهلت می‌تواند تمدید شود.',
        },
        takes: { en: '90 days, extendable by up to 6 months', fa: '۹۰ روز، تا ۶ ماه قابل تمدید' },
        link: IND_SELF,
      },
      {
        key: 'arrive',
        title: { en: 'Travel with the MVV and collect the permit', fa: 'سفر با MVV و گرفتن کارت اقامت' },
        detail: {
          en: 'The permit is valid for up to 2 years at a time.',
          fa: 'اقامت هر بار حداکثر ۲ سال اعتبار دارد.',
        },
        link: IND_SELF,
      },
    ],
    documents: [
      { key: 'forms', label: { en: 'Forms 9531 / 7524 (or 7528 for EU long-term residents)', fa: 'فرم‌های ۹۵۳۱ و ۷۵۲۴ (یا ۷۵۲۸ برای دارندگان اقامت بلندمدت اتحادیه‌ی اروپا)' }, stage: 'apply' },
      { key: 'plan', label: { en: 'Business plan showing the income forecast', fa: 'طرح کسب‌وکار با پیش‌بینی درآمد' }, stage: 'apply' },
      { key: 'kvk', label: { en: 'KvK registration', fa: 'ثبت KvK' }, stage: 'apply' },
      { key: 'permits', label: { en: 'Permits the profession requires (BIG registration for some medical work)', fa: 'مجوزهای لازم برای حرفه (ثبت BIG برای برخی کارهای پزشکی)' }, stage: 'apply' },
      { key: 'commission', label: { en: 'Freelancers: proof of one or more commissions in the Netherlands', fa: 'فریلنسرها: مدرک دست‌کم یک سفارش در هلند' }, stage: 'apply' },
      {
        key: 'legalised',
        label: { en: 'Foreign official documents legalised and translated', fa: 'اسناد رسمی خارجی، قانونی‌شده و ترجمه‌شده' },
        stage: 'apply',
      },
      { key: 'facilitator', label: { en: 'Switching from start-up: facilitator declaration (3+ months of successful mentoring)', fa: 'تغییر از استارتاپ: اظهارنامه‌ی تسهیل‌گر (بیش از ۳ ماه راهبری موفق)' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'income-not-savings',
        kind: 'challenge',
        title: { en: 'The income test is a profit forecast, not savings', fa: 'شرط درآمد پیش‌بینی سود است، نه پس‌انداز' },
        detail: {
          en: 'The IND looks at the expected income in your business plan. Money in the bank does not replace it.',
          fa: 'IND درآمد مورد انتظار در طرح کسب‌وکار را می‌سنجد و موجودی بانکی جای آن را نمی‌گیرد.',
        },
        source: IND_INCOME,
      },
      {
        key: 'family-work',
        kind: 'tip',
        title: { en: 'Your family may work freely', fa: 'خانواده‌ی شما آزادانه می‌تواند کار کند' },
        detail: {
          en: 'Family members of a self-employed permit holder need no work permit (TWV); their card says “free to work”.',
          fa: 'اعضای خانواده‌ی دارنده‌ی اقامت خوداشتغالی به مجوز کار (TWV) نیاز ندارند و روی کارتشان «آزاد برای کار» درج می‌شود.',
        },
        source: IND_SELF,
      },
      {
        key: 'treaty',
        kind: 'tip',
        title: { en: 'US and Japanese nationals skip the points', fa: 'اتباع آمریکا و ژاپن از امتیازبندی معاف‌اند' },
        detail: {
          en: 'Under the Dutch-American and Dutch-Japanese treaties the IND asks for an investment of at least EUR 4,500 for most business forms.',
          fa: 'در چارچوب معاهده‌ی هلند و آمریکا و معاهده‌ی هلند و ژاپن، IND برای بیشتر شکل‌های کسب‌وکار دست‌کم ۴٬۵۰۰ یورو سرمایه‌گذاری می‌خواهد.',
        },
        source: IND_SELF,
      },
      {
        key: 'slow-advice',
        kind: 'challenge',
        title: { en: 'RVO advice can add months', fa: 'نظر RVO ممکن است ماه‌ها زمان ببرد' },
        detail: {
          en: 'The 90-day decision period can be extended by up to 6 months when the IND asks RVO or OCW for advice.',
          fa: 'مهلت ۹۰ روزه‌ی تصمیم وقتی IND از RVO یا OCW نظر بخواهد، تا ۶ ماه تمدید می‌شود.',
        },
        source: IND_SELF,
      },
    ],
    timeline: WORK_TIMELINE,
    quiz: [
      {
        key: 'points',
        q: { en: 'Which points result passes?', fa: 'کدام نتیجه‌ی امتیاز قبول است؟' },
        options: [
          { en: '30 / 30 / 30 across the three areas', fa: '۳۰ / ۳۰ / ۳۰ در سه بخش' },
          { en: '60 personal experience, 0 elsewhere', fa: '۶۰ در سابقه‌ی شخصی و صفر در بقیه' },
          { en: '20 / 20 / 50', fa: '۲۰ / ۲۰ / ۵۰' },
        ],
        answer: 0,
        why: { en: 'At least 30 in each area, or 45 + 45 in personal experience and business plan.', fa: 'دست‌کم ۳۰ در هر بخش، یا ۴۵ و ۴۵ در سابقه‌ی شخصی و طرح کسب‌وکار.' },
      },
      {
        key: 'income',
        q: { en: 'What must the business plan show per month?', fa: 'طرح کسب‌وکار باید ماهانه چه چیزی را نشان دهد؟' },
        options: [
          { en: 'EUR 1,766.77 gross profit incl. holiday allowance', fa: '۱٬۷۶۶٫۷۷ یورو سود ناخالص با کمک‌هزینه‌ی تعطیلات' },
          { en: 'EUR 5,942 salary', fa: '۵٬۹۴۲ یورو حقوق' },
          { en: 'Nothing; savings are enough', fa: 'هیچ؛ پس‌انداز کافی است' },
        ],
        answer: 0,
        why: { en: 'The IND amount for self-employed persons, valid 1 Jul–31 Dec 2026.', fa: 'مبلغ IND برای خوداشتغالی، معتبر از ۱ ژوئیه تا ۳۱ دسامبر ۲۰۲۶.' },
      },
      {
        key: 'validity',
        q: { en: 'How long is each self-employed permit valid?', fa: 'هر اقامت خوداشتغالی چه مدت اعتبار دارد؟' },
        options: [
          { en: 'Up to 1 year', fa: 'تا ۱ سال' },
          { en: 'Up to 2 years', fa: 'تا ۲ سال' },
          { en: '5 years', fa: '۵ سال' },
        ],
        answer: 1,
        why: { en: 'The IND page states a maximum of 2 years.', fa: 'صفحه‌ی IND حداکثر ۲ سال را ذکر می‌کند.' },
      },
      {
        key: 'family',
        q: { en: 'Does your partner need a work permit?', fa: 'آیا همسرتان به مجوز کار نیاز دارد؟' },
        options: [
          { en: 'Yes, a TWV', fa: 'بله، TWV' },
          { en: 'No, free to work', fa: 'نه، آزاد برای کار' },
          { en: 'Only for jobs over 16 hours', fa: 'فقط برای کار بیش از ۱۶ ساعت' },
        ],
        answer: 1,
        why: { en: 'Family members of self-employed holders may work without a TWV.', fa: 'اعضای خانواده‌ی دارنده‌ی اقامت خوداشتغالی بدون TWV کار می‌کنند.' },
      },
      {
        key: 'pr',
        q: { en: 'When can you apply for permanent residence?', fa: 'چه زمانی می‌توانید برای اقامت دائم درخواست دهید؟' },
        options: [
          { en: 'After 3 years', fa: 'پس از ۳ سال' },
          { en: 'After 5 consecutive years', fa: 'پس از ۵ سال پیاپی' },
          { en: 'After 8 years', fa: 'پس از ۸ سال' },
        ],
        answer: 1,
        why: { en: 'Five consecutive years on a non-temporary permit, plus civic integration at A2.', fa: 'پنج سال پیاپی با اقامت غیرموقت، به‌علاوه‌ی هم‌گرایی مدنی در سطح A2.' },
      },
    ],
    media: [],
  },

  // ───────────────────────────── STUDY ─────────────────────────────
  'nl-study': {
    funds: [
      {
        key: 'per-month',
        label: { en: 'Study norm per month, university or hbo (2026)', fa: 'نُرم تحصیلی ماهانه، دانشگاه یا hbo (۲۰۲۶)' },
        amount: 1_130.77,
        currency: 'EUR',
        basis: 'month',
        per: 'person',
        kind: 'show',
        source: IND_AMOUNTS,
      },
      {
        key: 'year',
        label: { en: 'For the first year', fa: 'برای سال اول' },
        amount: 13_569.24,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'show',
        source: IND_AMOUNTS,
      },
      {
        key: 'fee',
        label: { en: 'IND fee, paid through the institution', fa: 'هزینه‌ی IND، از طریق مؤسسه' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'person',
        kind: 'spend',
        source: IND_FEES,
      },
      {
        key: 'spouse-fee',
        label: { en: 'Residence permit fee for a partner', fa: 'هزینه‌ی اقامت همسر یا شریک زندگی' },
        amount: 254,
        currency: 'EUR',
        basis: 'once',
        per: 'spouse',
        kind: 'spend',
        source: IND_FEES,
      },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted by an IND-recognised sponsor', fa: 'پذیرش از مؤسسه‌ی اسپانسر شناخته‌شده‌ی IND' },
        detail: {
          en: 'Full-time, accredited programme at an institution the IND recognises as a sponsor. Only the institution can apply for you.',
          fa: 'برنامه‌ی تمام‌وقت و معتبر در مؤسسه‌ای که IND آن را اسپانسر شناخته است. فقط خود مؤسسه می‌تواند برایتان درخواست بدهد.',
        },
        link: IND_STUDY,
      },
      {
        key: 'funds',
        title: { en: 'Show the study norm', fa: 'نشان‌دادن نُرم تحصیلی' },
        detail: {
          en: 'EUR 1,130.77 a month, excluding tuition (2026).',
          fa: '۱٬۱۳۰٫۷۷ یورو در ماه، بدون شهریه (۲۰۲۶).',
        },
        link: IND_AMOUNTS,
      },
      {
        key: 'documents',
        title: { en: 'Collect, legalise and translate documents', fa: 'جمع‌آوری، قانونی‌کردن و ترجمه‌ی مدارک' },
        detail: {
          en: 'The institution gives you the list. Foreign documents must be legalised and translated into Dutch, English, French or German.',
          fa: 'فهرست را مؤسسه به شما می‌دهد. اسناد خارجی باید قانونی و به هلندی، انگلیسی، فرانسوی یا آلمانی ترجمه شوند.',
        },
        link: IND_STUDY,
      },
      {
        key: 'apply',
        title: { en: 'The institution applies and pays', fa: 'ثبت درخواست و پرداخت از سوی مؤسسه' },
        detail: { en: 'Form 7504, fee EUR 254.', fa: 'فرم ۷۵۰۴، هزینه ۲۵۴ یورو.' },
        takes: { en: 'Decision within 60 days (can be extended)', fa: 'تصمیم ظرف ۶۰ روز (قابل تمدید)' },
        link: IND_STUDY,
      },
      {
        key: 'mvv',
        title: { en: 'Collect the MVV and travel', fa: 'گرفتن MVV و سفر' },
        detail: {
          en: 'If approved, book the MVV appointment within 3 months, travel, then book an appointment to collect the residence document.',
          fa: 'در صورت تأیید، ظرف ۳ ماه برای MVV وقت بگیرید، سفر کنید و سپس برای گرفتن کارت اقامت وقت بگیرید.',
        },
        link: IND_STUDY,
      },
      {
        key: 'tb',
        title: { en: 'TB test, if the institution said so', fa: 'آزمایش سل، اگر مؤسسه اعلام کرده باشد' },
        detail: {
          en: 'Book the GGD within 3 months of receiving the permit.',
          fa: 'ظرف ۳ ماه پس از گرفتن اقامت از GGD وقت بگیرید.',
        },
        link: IND_STUDY,
      },
    ],
    documents: [
      { key: 'enrolment', label: { en: 'Proof of enrolment in a full-time accredited programme', fa: 'گواهی ثبت‌نام در برنامه‌ی تمام‌وقت و معتبر' }, stage: 'apply' },
      { key: 'funds', label: { en: 'Proof of funds for the study norm (often a deposit to the institution)', fa: 'مدرک تمکن برای نُرم تحصیلی (اغلب سپرده به حساب مؤسسه)' }, stage: 'apply' },
      { key: 'passport', label: { en: 'Valid passport', fa: 'گذرنامه‌ی معتبر' }, stage: 'apply' },
      {
        key: 'legalised',
        label: { en: 'Foreign documents legalised and translated (list from the institution)', fa: 'اسناد خارجی قانونی‌شده و ترجمه‌شده (فهرست از مؤسسه)' },
        stage: 'apply',
      },
      { key: 'mvv', label: { en: 'MVV (provisional residence permit)', fa: 'ویزای MVV (اجازه‌ی اقامت موقت ورود)' }, stage: 'visa' },
      { key: 'progress', label: { en: 'Study progress: at least 50% of credits each year', fa: 'پیشرفت تحصیلی: دست‌کم ۵۰ درصد واحدها در هر سال' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'family-no-work',
        kind: 'challenge',
        title: { en: 'Family can come but may not work', fa: 'خانواده می‌تواند بیاید اما اجازه‌ی کار ندارد' },
        detail: {
          en: 'The institution can apply for your family members, but they are not allowed to work in the Netherlands.',
          fa: 'مؤسسه می‌تواند برای اعضای خانواده‌تان درخواست بدهد، اما آنها اجازه‌ی کار در هلند ندارند.',
        },
        source: IND_STUDY,
      },
      {
        key: 'work-16',
        kind: 'tip',
        title: { en: '16 hours a week, full-time in summer', fa: '۱۶ ساعت در هفته، تابستان تمام‌وقت' },
        detail: {
          en: 'Employed work needs a TWV held by the employer. Self-employment needs no TWV but a KvK registration.',
          fa: 'کار کارمندی به TWV نیاز دارد که کارفرما می‌گیرد. خوداشتغالی TWV نمی‌خواهد اما ثبت KvK لازم است.',
        },
        source: IND_STUDY,
      },
      {
        key: 'progress',
        kind: 'challenge',
        title: { en: 'Pass half your credits every year', fa: 'هر سال دست‌کم نیمی از واحدها را بگذرانید' },
        detail: {
          en: 'Insufficient study progress (less than 50% of credits per year) puts the permit at risk.',
          fa: 'پیشرفت تحصیلی ناکافی (کمتر از ۵۰ درصد واحدها در سال) اقامت را به خطر می‌اندازد.',
        },
        source: IND_STUDY,
      },
      {
        key: 'temporary',
        kind: 'myth',
        title: { en: 'Myth: student years count toward permanent residence', fa: 'باور نادرست: سال‌های تحصیل در اقامت دائم حساب می‌شوند' },
        detail: {
          en: 'Study and the orientation year are temporary purposes. Permanent residence and naturalisation need a non-temporary permit, such as highly skilled migrant or self-employed.',
          fa: 'تحصیل و سال جست‌وجو (orientation year) هدف موقت به شمار می‌روند. اقامت دائم و تابعیت اقامت غیرموقت می‌خواهند، مثل نیروی متخصص (highly skilled migrant) یا خوداشتغالی.',
        },
        source: IND_PURPOSES,
      },
    ],
    timeline: {
      dualCitizenship: 'restricted',
      language: WORK_TIMELINE.language,
      note: {
        en: 'Study is a temporary purpose: it does not start the 5-year clock. After graduating you can apply for the orientation year (EUR 254), then a non-temporary permit such as highly skilled migrant (EUR 3,122 a month under the reduced criterion) or start-up.',
        fa: 'تحصیل هدف موقت است و شمارش ۵ سال را آغاز نمی‌کند. پس از فارغ‌التحصیلی می‌توانید اقامت سال جست‌وجو (۲۵۴ یورو) و سپس اقامت غیرموقت مثل نیروی متخصص (با معیار کاهش‌یافته ۳٬۱۲۲ یورو در ماه) یا استارتاپ بگیرید.',
      },
      source: IND_PURPOSES,
    },
    quiz: [
      {
        key: 'norm',
        q: { en: 'What is the 2026 study norm per month for university or hbo?', fa: 'نُرم تحصیلی ماهانه‌ی ۲۰۲۶ برای دانشگاه یا hbo چقدر است؟' },
        options: [
          { en: 'EUR 928.58', fa: '۹۲۸٫۵۸ یورو' },
          { en: 'EUR 1,130.77', fa: '۱٬۱۳۰٫۷۷ یورو' },
          { en: 'EUR 1,766.77', fa: '۱٬۷۶۶٫۷۷ یورو' },
        ],
        answer: 1,
        why: { en: '928.58 is the mbo norm; 1,766.77 is for the self-employed.', fa: '۹۲۸٫۵۸ نُرم mbo و ۱٬۷۶۶٫۷۷ مبلغ خوداشتغالی است.' },
      },
      {
        key: 'who-applies',
        q: { en: 'Who files the student permit application?', fa: 'درخواست اقامت تحصیلی را چه کسی ثبت می‌کند؟' },
        options: [
          { en: 'You, at the embassy', fa: 'خودتان، در سفارت' },
          { en: 'The recognised institution', fa: 'مؤسسه‌ی شناخته‌شده' },
          { en: 'The municipality', fa: 'شهرداری' },
        ],
        answer: 1,
        why: { en: 'Only the institution can apply for you.', fa: 'فقط مؤسسه می‌تواند برایتان درخواست بدهد.' },
      },
      {
        key: 'hours',
        q: { en: 'How much may a student work during term?', fa: 'دانشجو در طول ترم چقدر می‌تواند کار کند؟' },
        options: [
          { en: '16 hours a week', fa: '۱۶ ساعت در هفته' },
          { en: '20 hours a week', fa: '۲۰ ساعت در هفته' },
          { en: '90 hours a month', fa: '۹۰ ساعت در ماه' },
        ],
        answer: 0,
        why: { en: '16 hours a week, or full-time in June, July and August.', fa: '۱۶ ساعت در هفته، یا در ژوئن، ژوئیه و اوت تمام‌وقت.' },
      },
      {
        key: 'decision',
        q: { en: 'Within how many days must the IND decide?', fa: 'IND ظرف چند روز باید تصمیم بگیرد؟' },
        options: [
          { en: '30', fa: '۳۰' },
          { en: '60', fa: '۶۰' },
          { en: '90', fa: '۹۰' },
        ],
        answer: 1,
        why: { en: '60 days, which the IND can extend.', fa: '۶۰ روز، که IND می‌تواند تمدیدش کند.' },
      },
      {
        key: 'family',
        q: { en: 'Can a student’s partner work in the Netherlands?', fa: 'آیا همسر دانشجو می‌تواند در هلند کار کند؟' },
        options: [
          { en: 'Yes, freely', fa: 'بله، آزادانه' },
          { en: 'No', fa: 'نه' },
          { en: 'Only 16 hours a week', fa: 'فقط ۱۶ ساعت در هفته' },
        ],
        answer: 1,
        why: { en: 'The IND page says family members of students are not allowed to work.', fa: 'طبق صفحه‌ی IND اعضای خانواده‌ی دانشجو اجازه‌ی کار ندارند.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_NL: CountryProfile = {
  strengths: [
    {
      en: 'Highest English proficiency in the world (EF rank 1 of 123): you can live and work in English.',
      fa: 'بالاترین سطح انگلیسی در جهان (رتبه‌ی ۱ از ۱۲۳ در EF)؛ می‌توان به انگلیسی زندگی و کار کرد.',
    },
    {
      en: 'Permanent residence and citizenship both after 5 years, with Dutch at A2.',
      fa: 'اقامت دائم و تابعیت هر دو پس از ۵ سال، با زبان هلندی در سطح A2.',
    },
    {
      en: 'No yearly quota on the start-up permit; 31 recognised facilitators to choose from.',
      fa: 'اقامت استارتاپی سهمیه‌ی سالانه ندارد و ۳۱ تسهیل‌گر شناخته‌شده برای انتخاب هست.',
    },
    {
      en: 'Family members of self-employed permit holders may work freely.',
      fa: 'اعضای خانواده‌ی دارنده‌ی اقامت خوداشتغالی آزادانه کار می‌کنند.',
    },
    {
      en: 'Strong innovation economy (WIPO rank 7 of 139).',
      fa: 'اقتصاد نوآور (رتبه‌ی ۷ از ۱۳۹ در WIPO).',
    },
  ],
  weaknesses: [
    {
      en: 'The start-up permit lasts 1 year and cannot be extended; you must reach the self-employed permit in time.',
      fa: 'اقامت استارتاپی ۱ ساله است و تمدید نمی‌شود؛ باید به‌موقع به اقامت خوداشتغالی برسید.',
    },
    {
      en: 'Naturalisation usually means giving up your current nationality.',
      fa: 'تابعیت هلند معمولاً یعنی کنار گذاشتن تابعیت فعلی.',
    },
    {
      en: 'Income amounts change on 1 January and 1 July, so a figure can be wrong half the year.',
      fa: 'مبالغ درآمدی در ۱ ژانویه و ۱ ژوئیه تغییر می‌کنند و هر رقمی ممکن است نیمی از سال کهنه باشد.',
    },
    {
      en: 'Top income tax rate of 49.5% on income above EUR 78,426 (2026).',
      fa: 'بالاترین نرخ مالیات بر درآمد ۴۹٫۵ درصد برای درآمد بیش از ۷۸٬۴۲۶ یورو (۲۰۲۶).',
    },
    {
      en: 'Students’ family members may not work, and study years do not count toward permanent residence.',
      fa: 'خانواده‌ی دانشجو اجازه‌ی کار ندارد و سال‌های تحصیل در اقامت دائم حساب نمی‌شوند.',
    },
  ],
  indicators: [
    {
      key: 'hdi',
      rank: 8,
      of: 193,
      value: 0.955,
      year: 2023,
      source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/NLD', checked: CHECKED, label: 'UNDP HDR 2025, data for 2023' },
    },
    { key: 'happiness', rank: 7, year: 2026, source: { url: 'https://data.worldhappiness.report/table', checked: CHECKED, label: 'World Happiness Report 2026 (2023–2025 average), score 7.223' } },
    { key: 'peace', rank: 17, of: 163, value: 1.566, year: 2026, source: { url: 'https://www.visionofhumanity.org/maps/', checked: CHECKED, label: 'Global Peace Index 2026' } },
    {
      key: 'gdp-per-capita',
      value: 73_684,
      unit: 'USD',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/NLD/indicator/NY.GDP.PCAP.CD?format=json&mrv=1', checked: CHECKED, label: 'World Bank, current US$' },
    },
    {
      key: 'unemployment',
      value: 3.9,
      unit: '%',
      year: 2025,
      source: { url: 'https://api.worldbank.org/v2/country/NLD/indicator/SL.UEM.TOTL.ZS?format=json&mrv=1', checked: CHECKED, label: 'World Bank, modeled ILO estimate' },
    },
    { key: 'innovation', rank: 7, of: 139, year: 2026, source: { url: 'https://www.wipo.int/pressroom/en/articles/2026/article_0014.html', checked: CHECKED, label: 'WIPO Global Innovation Index 2026' } },
    { key: 'english', rank: 1, of: 123, year: 2025, source: { url: 'https://www.ef.com/wwen/epi/', checked: CHECKED, label: 'EF EPI 2025' } },
    {
      key: 'passport',
      rank: 4,
      value: 186,
      unit: 'destinations visa-free',
      year: 2026,
      source: { url: 'https://www.henleyglobal.com/passport-index/ranking', checked: CHECKED, label: 'Henley Passport Index 2026' },
    },
    {
      key: 'tax-top-rate',
      value: 49.5,
      unit: '%',
      year: 2026,
      source: {
        url: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/boxen_en_tarieven/box_1/box_1',
        checked: CHECKED,
        label: 'Belastingdienst, box 1, above EUR 78,426',
      },
    },
  ],
};

// Pages behind notes that the Timeline type cannot cite (it holds one source).
export const NL_TIMELINE_SOURCES = [IND_PR, IND_NATURALISATION, IND_RENOUNCE, IND_PURPOSES, RVO_STARTUP] as const;
