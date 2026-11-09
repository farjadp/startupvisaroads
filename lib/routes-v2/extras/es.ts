// Spain: route depth and country profile (spec 2026-10-27). Figures read on
// 9 Nov 2026 on boe.es, the UGE pages and PDFs (inclusion.gob.es, in a
// browser), the Ministry of Inclusion study sheet, one.gob.es and the Spanish
// Consulate in London. No Gemini notebook for Spain, so `media` is empty.
// Fee amounts for tasa 790-038 are left out on purpose: the form prints them.
// Research: docs/research/app-v3/es.md.
import type { CountryProfile, RouteExtras, Timeline } from '../extras-types';

const CHECKED = '2026-11-09';

const BOE_14 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074';
const UGE_EMP = 'https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores';
const UGE_INST =
  'https://www.inclusion.gob.es/documents/1823432/1826098/Instrucciones+solicitud+emprendedores.pdf/3a4d0b60-71bf-1c53-9f9d-fff7f94cbf5d?t=1682675484705';
const SEDE = 'https://sede.inclusion.gob.es/en/w/presentacion-solicitudes-autorizacion-residencia';
const ENISA = 'https://www.enisa.es/';
const ONE_EMP = 'https://one.gob.es/en/procedures/application-entrepreneur-visa';
const LONDON = 'https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-para-emprendedor.aspx';
const UGE_TT = 'https://www.inclusion.gob.es/web/unidadgrandesempresas/teletrabajadores';
const UGE_TT_DOC = 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/informacion-documentacion-pagina-web-titular-v2';
const UGE_UMBRAL = 'https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/umbral-salarial.pdf';
const STUDY = 'https://www.inclusion.gob.es/web/migraciones/w/estancia-por-estudios';
const RD_1155 = 'https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099';
const CIVIL_CODE = 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763';
const IRPF = 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764';

const LANGUAGE = {
  en: 'None for the permit; forms and portals are in Spanish. Citizenship: DELE A2 Spanish and the CCSE constitutional and cultural test.',
  fa: 'برای اقامت شرط نیست، ولی فرم‌ها و سامانه‌ها اسپانیایی‌اند. برای تابعیت: آزمون زبان DELE سطح A2 و آزمون قانون اساسی و فرهنگ (CCSE).',
};

const CITIZENSHIP_NOTE = {
  en: 'Citizenship by residence needs ten years of legal, continuous residence (two for nationals of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea and Portugal, and Sephardic Jews). Everyone else must declare that they renounce their previous nationality.',
  fa: 'تابعیت از راه اقامت ده سال اقامت قانونی و پیوسته می‌خواهد (برای اتباع کشورهای آمریکای لاتین، آندورا، فیلیپین، گینه‌ی استوایی و پرتغال و یهودیان سفاردی دو سال). بقیه باید رسماً از تابعیت قبلی خود صرف‌نظر کنند.',
};

const timeline = (prAfterYears: number | undefined, source: string): Timeline => ({
  prAfterYears,
  citizenshipAfterYears: 10,
  dualCitizenship: 'restricted',
  language: LANGUAGE,
  note: CITIZENSHIP_NOTE,
  source,
});

/** Citizenship rules: Civil Code arts. 22 and 23. */
export const ES_CITIZENSHIP_SOURCE = CIVIL_CODE;

const SHARED_DOCS = [
  { key: 'passport', label: { en: 'Copy of the whole passport, every page', fa: 'کپی همه‌ی صفحه‌های گذرنامه' }, stage: 'apply' as const },
  { key: 'insurance', label: { en: 'Public or private health insurance with an insurer authorised in Spain', fa: 'بیمه‌ی درمانی دولتی یا خصوصی از بیمه‌گر مجاز در اسپانیا' }, stage: 'apply' as const },
  { key: 'fee', label: { en: 'Proof of payment of tasa 790 code 038 (the NRC reference)', fa: 'رسید پرداخت عوارض ۷۹۰ کد ۰۳۸ (کد مرجع NRC)' }, stage: 'apply' as const },
  { key: 'form', label: { en: 'Form MIT signed by the applicant (a scanned handwritten signature is accepted)', fa: 'فرم MIT با امضای متقاضی (امضای دستی اسکن‌شده پذیرفته است)' }, stage: 'apply' as const },
];

export const EXTRAS_ES: Record<string, RouteExtras> = {
  'es-entrepreneur': {
    funds: [
      { key: 'applicant', label: { en: 'Means, applicant (100% of IPREM)', fa: 'تمکن مالی، متقاضی (۱۰۰ درصد IPREM)' }, amount: 600, currency: 'EUR', basis: 'month', per: 'founder', kind: 'show', source: ONE_EMP },
      { key: 'family', label: { en: 'Means, each family member (50% of IPREM)', fa: 'تمکن مالی، هر عضو خانواده (۵۰ درصد IPREM)' }, amount: 300, currency: 'EUR', basis: 'month', per: 'spouse', kind: 'show', source: ONE_EMP },
      { key: 'child', label: { en: 'Means, each child (50% of IPREM)', fa: 'تمکن مالی، هر فرزند (۵۰ درصد IPREM)' }, amount: 300, currency: 'EUR', basis: 'month', per: 'child', kind: 'show', source: ONE_EMP },
    ],
    steps: [
      {
        key: 'enisa',
        title: { en: 'File the project on the ENISA portal', fa: 'طرح را در پورتال ENISA ثبت کنید' },
        detail: {
          en: 'Register, choose the residence permit for entrepreneurs and complete the questionnaire; it can be saved and finished over several sessions. All technical documents on the project go to ENISA this way.',
          fa: 'ثبت‌نام کنید، گزینه‌ی اقامت کارآفرینان را بزنید و پرسش‌نامه را پر کنید؛ می‌شود ذخیره کرد و در چند نوبت تمامش کرد. همه‌ی اسناد فنی طرح از همین راه به ENISA می‌رسد.',
        },
        link: ENISA,
      },
      {
        key: 'file',
        title: { en: 'Prepare the immigration file', fa: 'پرونده‌ی مهاجرتی را آماده کنید' },
        detail: {
          en: 'Sign form MIT, pay tasa 790-038 (point 7) and keep the 22-character NRC, scan the whole passport, and add means and insurance. Inside Spain on a short stay, add criminal record certificates for the last two years and a five-year declaration.',
          fa: 'فرم MIT را امضا کنید، عوارض ۷۹۰-۰۳۸ (بند ۷) را بپردازید و کد ۲۲ نویسه‌ای NRC را نگه دارید، کل گذرنامه را اسکن کنید و مدرک تمکن و بیمه را اضافه کنید. اگر با اقامت کوتاه در اسپانیا هستید، گواهی عدم سوءپیشینه‌ی دو سال اخیر و اظهارنامه‌ی پنج‌ساله هم لازم است.',
        },
        link: UGE_INST,
      },
      {
        key: 'apply',
        title: { en: 'Apply electronically to the UGE', fa: 'درخواست را الکترونیکی به UGE بدهید' },
        detail: {
          en: 'Through the Ministry e-office, with a digital certificate or Cl@ve, yours or a legal representative’s. Attachments: 24 MB in total.',
          fa: 'از سامانه‌ی الکترونیکی وزارتخانه، با گواهی دیجیتال یا Cl@ve خودتان یا نماینده‌ی قانونی. حجم کل پیوست‌ها ۲۴ مگابایت.',
        },
        link: SEDE,
      },
      {
        key: 'decision',
        title: { en: 'ENISA report and UGE decision', fa: 'گزارش ENISA و تصمیم UGE' },
        detail: {
          en: 'The UGE asks ENISA for its report (10 working days) and decides within 20 days of filing. No answer in time means the permit is granted.',
          fa: 'UGE از ENISA گزارش می‌خواهد (۱۰ روز کاری) و ظرف ۲۰ روز از ثبت تصمیم می‌گیرد. اگر در این مدت پاسخی نیاید، اقامت پذیرفته‌شده است.',
        },
        takes: { en: '20 days by law', fa: '۲۰ روز طبق قانون' },
        link: BOE_14,
      },
      {
        key: 'visa',
        title: { en: 'From abroad: the residence visa', fa: 'از خارج: ویزای اقامت' },
        detail: {
          en: 'With the permit, apply at the consulate where you live: originals, criminal record certificates (London asks for five years, no older than six months), insurance. The visa is valid for one year.',
          fa: 'با اقامت صادرشده در کنسولگری محل اقامت‌تان درخواست بدهید: اصل مدارک، گواهی عدم سوءپیشینه (لندن پنج سال و حداکثر شش ماه از صدور را می‌خواهد) و بیمه. ویزا یک سال اعتبار دارد.',
        },
        takes: { en: '10 working days, longer under Visa Code art. 22 consultation', fa: '۱۰ روز کاری؛ برای مشمولان رایزنی ماده‌ی ۲۲ کد ویزا بیشتر' },
        link: LONDON,
      },
      {
        key: 'start',
        title: { en: 'Start the business and keep it active', fa: 'کسب‌وکار را راه بیندازید و فعال نگه دارید' },
        detail: {
          en: 'Your passport is enough to register with Social Security for the first six months. Renewal (two years at a time) checks that the conditions still hold; it can be filed up to 90 days after expiry, with a possible fine.',
          fa: 'در شش ماه اول گذرنامه برای ثبت‌نام در تأمین اجتماعی کافی است. در تمدید (هر بار دو سال) بررسی می‌شود که شرایط هنوز برقرار باشد؛ تا ۹۰ روز پس از انقضا هم می‌شود درخواست داد، با احتمال جریمه.',
        },
        link: BOE_14,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'means', label: { en: 'Proof of sufficient economic resources for you and your family', fa: 'مدرک منابع مالی کافی برای خود و خانواده' }, stage: 'apply' },
      {
        key: 'record',
        label: { en: 'Criminal record certificates (if in Spain on a stay of up to six months) and a five-year declaration', fa: 'گواهی عدم سوءپیشینه (اگر با اقامت تا شش ماه در اسپانیا هستید) و اظهارنامه‌ی پنج‌ساله' },
        note: { en: 'From abroad it goes to the consulate with the visa application.', fa: 'از خارج، این گواهی همراه درخواست ویزا به کنسولگری می‌رود.' },
        stage: 'apply',
      },
      { key: 'plan', label: { en: 'Business plan and CV, through the ENISA portal', fa: 'طرح کسب‌وکار و رزومه، از راه پورتال ENISA' }, stage: 'apply' },
      { key: 'visa-form', label: { en: 'National visa form, photo, passport valid one more year, the UGE permit', fa: 'فرم ویزای ملی، عکس، گذرنامه با دست‌کم یک سال اعتبار و اقامت صادرشده‌ی UGE' }, stage: 'visa' },
      { key: 'family', label: { en: 'Marriage or birth certificates, legalised or apostilled, with sworn Spanish translation', fa: 'عقدنامه یا شناسنامه، قانونی‌شده یا با آپوستیل، همراه ترجمه‌ی رسمی اسپانیایی' }, stage: 'visa' },
      { key: 'renewal', label: { en: 'Renewal: a new ENISA questionnaire on the company, form MIT and the fee', fa: 'تمدید: پرسش‌نامه‌ی تازه‌ی ENISA درباره‌ی شرکت، فرم MIT و عوارض' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'no-investment',
        kind: 'myth',
        title: { en: '“You must invest a minimum amount”', fa: '«حداقل سرمایه‌گذاری لازم است»' },
        detail: { en: 'The UGE states there is no minimum investment or job creation. The plan must still show where its money comes from.', fa: 'UGE صریحاً می‌گوید حداقل سرمایه‌گذاری و اشتغال‌زایی ندارد. ولی طرح باید نشان دهد پولش از کجا می‌آید.' },
        source: UGE_EMP,
      },
      {
        key: 'nomad-figure',
        kind: 'myth',
        title: { en: '“Entrepreneurs need EUR 34,188 a year”', fa: '«کارآفرین ۳۴٬۱۸۸ یورو در سال لازم دارد»' },
        detail: { en: 'That is 200% of the minimum wage, the teleworker rule. For entrepreneurs, consulates and one.gob.es use 100% of the IPREM a month.', fa: 'این ۲۰۰ درصد حداقل دستمزد و قاعده‌ی دورکاران است. برای کارآفرین، کنسولگری‌ها و one.gob.es ۱۰۰ درصد IPREM در ماه را ملاک می‌گیرند.' },
        source: ONE_EMP,
      },
      {
        key: 'certificate',
        kind: 'challenge',
        title: { en: 'Filing needs a Spanish digital certificate', fa: 'ثبت درخواست گواهی دیجیتال اسپانیایی می‌خواهد' },
        detail: { en: 'Every Ley 14/2013 filing is electronic. Without a certificate or Cl@ve, a legal representative files for you.', fa: 'همه‌ی درخواست‌های قانون ۱۴/۲۰۱۳ الکترونیکی است. بدون گواهی دیجیتال یا Cl@ve، نماینده‌ی قانونی به جای شما ثبت می‌کند.' },
        source: UGE_INST,
      },
      {
        key: 'silence',
        kind: 'tip',
        title: { en: 'Twenty days, then silence means yes', fa: 'بیست روز، بعد سکوت یعنی بله' },
        detail: { en: 'Art. 76 deems the permit granted if the UGE does not decide within 20 days of electronic filing. File a complete case so the clock is not stopped by a request for documents.', fa: 'طبق ماده‌ی ۷۶ اگر UGE ظرف ۲۰ روز از ثبت الکترونیکی تصمیم نگیرد، اقامت پذیرفته‌شده است. پرونده را کامل بفرستید تا درخواست مدرک تکمیلی ساعت را متوقف نکند.' },
        source: BOE_14,
      },
      {
        key: 'consultation',
        kind: 'challenge',
        title: { en: 'Ten consular days are not for every passport', fa: 'ده روز کنسولی برای همه‌ی گذرنامه‌ها نیست' },
        detail: { en: 'Art. 75.5 excludes applicants subject to Visa Code art. 22 prior consultation; they fall under the Visa Code’s general deadlines.', fa: 'بند ۵ ماده‌ی ۷۵ متقاضیان مشمول رایزنی پیشین ماده‌ی ۲۲ کد ویزا را استثنا می‌کند؛ مهلت آن‌ها همان مهلت عمومی کد ویزاست.' },
        source: BOE_14,
      },
      {
        key: 'tax',
        kind: 'tip',
        title: { en: 'The newcomers’ tax regime covers this route', fa: 'رژیم مالیاتی تازه‌واردها این مسیر را هم می‌گیرد' },
        detail: { en: 'Art. 93 of the income tax law includes people who come for an art. 70 entrepreneurial activity: 24% up to EUR 600,000, for the year of arrival and five more, if not resident in the five years before.', fa: 'ماده‌ی ۹۳ قانون مالیات بر درآمد کسانی را که برای فعالیت کارآفرینانه‌ی ماده‌ی ۷۰ می‌آیند هم شامل می‌شود: ۲۴ درصد تا ۶۰۰٬۰۰۰ یورو، برای سال ورود و پنج سال بعد، به شرط اینکه در پنج سال قبل مقیم نبوده باشید.' },
        source: IRPF,
      },
    ],
    timeline: timeline(5, BOE_14),
    quiz: [
      {
        key: 'investment',
        q: { en: 'What minimum investment does the UGE require?', fa: 'UGE چه حداقل سرمایه‌گذاری‌ای می‌خواهد؟' },
        options: [{ en: 'None', fa: 'هیچ' }, { en: 'EUR 30,000', fa: '۳۰٬۰۰۰ یورو' }, { en: 'EUR 50,000', fa: '۵۰٬۰۰۰ یورو' }],
        answer: 0,
        why: { en: 'There is no minimum investment or job creation.', fa: 'حداقل سرمایه‌گذاری و اشتغال‌زایی وجود ندارد.' },
      },
      {
        key: 'enisa',
        q: { en: 'Who reports on whether the activity is innovative?', fa: 'چه نهادی درباره‌ی نوآورانه بودن فعالیت گزارش می‌دهد؟' },
        options: [{ en: 'The consulate', fa: 'کنسولگری' }, { en: 'ENISA', fa: 'ENISA' }, { en: 'The town hall', fa: 'شهرداری' }],
        answer: 1,
        why: { en: 'The UGE asks ENISA for a mandatory report, due in 10 working days.', fa: 'UGE گزارش الزامی را از ENISA می‌خواهد که باید ظرف ۱۰ روز کاری برسد.' },
      },
      {
        key: 'deadline',
        q: { en: 'What happens if the UGE does not decide within 20 days?', fa: 'اگر UGE ظرف ۲۰ روز تصمیم نگیرد چه می‌شود؟' },
        options: [{ en: 'The application lapses', fa: 'درخواست باطل می‌شود' }, { en: 'It counts as granted', fa: 'پذیرفته‌شده حساب می‌شود' }, { en: 'It counts as refused', fa: 'ردشده حساب می‌شود' }],
        answer: 1,
        why: { en: 'Art. 76: silence means the permit is granted.', fa: 'ماده‌ی ۷۶: سکوت یعنی اقامت پذیرفته شده است.' },
      },
      {
        key: 'length',
        q: { en: 'How long is the first entrepreneur permit?', fa: 'نخستین اقامت کارآفرینی چند سال است؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '2 years', fa: '۲ سال' }, { en: '3 years', fa: '۳ سال' }],
        answer: 2,
        why: { en: 'Three years, then two-year renewals.', fa: 'سه سال، سپس تمدیدهای دوساله.' },
      },
      {
        key: 'pr',
        q: { en: 'When is permanent residence possible?', fa: 'اقامت دائم کی ممکن است؟' },
        options: [{ en: 'After 3 years', fa: 'پس از ۳ سال' }, { en: 'After 5 years', fa: 'پس از ۵ سال' }, { en: 'After 10 years', fa: 'پس از ۱۰ سال' }],
        answer: 1,
        why: { en: 'Art. 69 allows permanent residence at five years.', fa: 'ماده‌ی ۶۹ اقامت دائم را پس از پنج سال ممکن می‌داند.' },
      },
    ],
    media: [],
  },

  'es-digital-nomad': {
    funds: [
      { key: 'applicant', label: { en: 'Income, applicant (200% of SMI)', fa: 'درآمد، متقاضی (۲۰۰ درصد SMI)' }, amount: 34_188, currency: 'EUR', basis: 'perYear', per: 'person', kind: 'show', source: UGE_TT_DOC },
      { key: 'second', label: { en: 'Household of two, added (75% of SMI)', fa: 'خانوار دونفره، اضافه (۷۵ درصد SMI)' }, amount: 12_820, currency: 'EUR', basis: 'perYear', per: 'spouse', kind: 'show', approx: true, source: UGE_TT_DOC },
      { key: 'further', label: { en: 'Each further member (25% of SMI)', fa: 'هر عضو بیشتر (۲۵ درصد SMI)' }, amount: 4_273, currency: 'EUR', basis: 'perYear', per: 'child', kind: 'show', approx: true, source: UGE_TT_DOC },
    ],
    steps: [
      {
        key: 'check',
        title: { en: 'Check your work relationship', fa: 'رابطه‌ی کاری‌تان را بسنجید' },
        detail: { en: 'At least three months with a company outside Spain that has been active for at least a year, and work that can be done remotely.', fa: 'دست‌کم سه ماه کار با شرکتی خارج از اسپانیا که دست‌کم یک سال فعال بوده، و کاری که از راه دور انجام‌شدنی است.' },
        link: UGE_TT,
      },
      {
        key: 'documents',
        title: { en: 'Gather proof', fa: 'مدارک را جمع کنید' },
        detail: { en: 'Contract, company registry certificate, employer letter authorising work from Spain with salary in euros, three months of payslips or invoices with matching bank statements, degree or proof of three years’ experience.', fa: 'قرارداد، گواهی ثبت شرکت، نامه‌ی کارفرما برای کار از اسپانیا با حقوق به یورو، فیش یا فاکتور سه ماه اخیر با صورت‌حساب بانکی منطبق، و مدرک دانشگاهی یا گواهی سه سال سابقه.' },
        link: UGE_TT_DOC,
      },
      {
        key: 'social-security',
        title: { en: 'Settle Social Security', fa: 'وضعیت تأمین اجتماعی را روشن کنید' },
        detail: { en: 'Employees: the foreign employer registers with Spanish Social Security; freelancers: a commitment to join RETA. Or a certificate of applicable legislation from a treaty country.', fa: 'کارمند: کارفرمای خارجی در تأمین اجتماعی اسپانیا ثبت می‌شود؛ فریلنسر: تعهد عضویت در RETA. یا گواهی قانون حاکم از کشوری که با اسپانیا موافقت‌نامه دارد.' },
        link: UGE_TT_DOC,
      },
      {
        key: 'apply',
        title: { en: 'Apply: visa abroad or permit in Spain', fa: 'درخواست: ویزا از خارج یا اقامت از داخل' },
        detail: { en: 'From abroad, a visa of up to one year at the consulate. If lawfully in Spain, a permit of up to three years from the UGE, filed electronically.', fa: 'از خارج، ویزای حداکثر یک‌ساله از کنسولگری. اگر قانونی در اسپانیا هستید، اقامت حداکثر سه‌ساله از UGE با درخواست الکترونیکی.' },
        takes: { en: 'UGE: 20 days, silence means granted', fa: 'UGE: ۲۰ روز، سکوت یعنی پذیرش' },
        link: SEDE,
      },
      {
        key: 'renew',
        title: { en: 'Move from visa to permit, then renew', fa: 'از ویزا به اقامت بروید و تمدید کنید' },
        detail: { en: 'Within 60 days before the visa expires, apply for the permit; then renew for two years at a time while the conditions hold.', fa: 'در ۶۰ روز پیش از پایان ویزا برای اقامت درخواست بدهید؛ سپس تا وقتی شرایط برقرار است هر بار دو سال تمدید کنید.' },
        link: BOE_14,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'contract', label: { en: 'Employment or service contract of at least three months', fa: 'قرارداد کار یا خدمات با سابقه‌ی دست‌کم سه ماه' }, stage: 'apply' },
      { key: 'company', label: { en: 'Registry certificate showing the company active for at least a year', fa: 'گواهی ثبت که فعالیت شرکت را دست‌کم یک سال نشان دهد' }, stage: 'apply' },
      { key: 'letter', label: { en: 'Employer letter: remote work from Spain allowed, duties, salary in euros', fa: 'نامه‌ی کارفرما: اجازه‌ی دورکاری از اسپانیا، شرح وظایف، حقوق به یورو' }, stage: 'apply' },
      { key: 'income', label: { en: 'Three months of payslips or invoices and matching bank certificates', fa: 'فیش حقوقی یا فاکتور سه ماه و گواهی بانکی منطبق' }, stage: 'apply' },
      { key: 'qualification', label: { en: 'Degree, or proof of three years of experience', fa: 'مدرک تحصیلی یا گواهی سه سال سابقه' }, stage: 'apply' },
      { key: 'cv', label: { en: 'CV', fa: 'رزومه' }, stage: 'apply' },
      { key: 'record', label: { en: 'Criminal record certificates for the last two years and a five-year declaration', fa: 'گواهی عدم سوءپیشینه‌ی دو سال اخیر و اظهارنامه‌ی پنج‌ساله' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'spanish-clients',
        kind: 'challenge',
        title: { en: 'Little room for Spanish clients', fa: 'جای کمی برای مشتری اسپانیایی' },
        detail: { en: 'Employees may work only for companies outside Spain; freelancers may take Spanish clients for up to 20% of their work.', fa: 'کارمند فقط برای شرکت خارج از اسپانیا می‌تواند کار کند؛ فریلنسر تا ۲۰ درصد کارش می‌تواند مشتری اسپانیایی داشته باشد.' },
        source: BOE_14,
      },
      {
        key: 'insurance',
        kind: 'challenge',
        title: { en: 'No travel insurance, no co-payments', fa: 'بیمه‌ی مسافرتی و بیمه‌ی با مشارکت در هزینه قبول نیست' },
        detail: { en: 'The UGE rejects travel policies, reimbursement-only policies and policies with co-payments or waiting periods.', fa: 'UGE بیمه‌ی مسافرتی، بیمه‌ی فقط بازپرداختی و بیمه‌ی دارای مشارکت در هزینه یا دوره‌ی انتظار را نمی‌پذیرد.' },
        source: UGE_TT_DOC,
      },
      {
        key: 'savings',
        kind: 'tip',
        title: { en: 'Savings can top up a lower salary', fa: 'پس‌انداز می‌تواند کسری حقوق را جبران کند' },
        detail: { en: 'If income is below the threshold, bank certificates of savings covering the gap for the whole permit are accepted.', fa: 'اگر درآمد کمتر از آستانه است، گواهی بانکی پس‌اندازی که فاصله را برای کل مدت اقامت بپوشاند پذیرفته می‌شود.' },
        source: UGE_TT_DOC,
      },
      {
        key: 'tax',
        kind: 'tip',
        title: { en: 'Remote employees can use the newcomers’ regime', fa: 'کارمند دورکار می‌تواند از رژیم تازه‌واردها استفاده کند' },
        detail: { en: 'Art. 93 of the income tax law names employees holding the international teleworking visa.', fa: 'ماده‌ی ۹۳ قانون مالیات بر درآمد کارمندان دارای ویزای دورکاری بین‌المللی را صریحاً نام می‌برد.' },
        source: IRPF,
      },
    ],
    timeline: timeline(5, BOE_14),
    quiz: [
      {
        key: 'income',
        q: { en: 'Income needed by the applicant in 2026?', fa: 'درآمد لازم برای متقاضی در ۲۰۲۶؟' },
        options: [{ en: 'EUR 17,094 a year', fa: '۱۷٬۰۹۴ یورو در سال' }, { en: 'EUR 34,188 a year', fa: '۳۴٬۱۸۸ یورو در سال' }, { en: 'EUR 60,000 a year', fa: '۶۰٬۰۰۰ یورو در سال' }],
        answer: 1,
        why: { en: '200% of the 2026 minimum wage of EUR 17,094 a year.', fa: '۲۰۰ درصد حداقل دستمزد ۲۰۲۶ که سالانه ۱۷٬۰۹۴ یوروست.' },
      },
      {
        key: 'months',
        q: { en: 'How long must the work relationship have lasted?', fa: 'رابطه‌ی کاری باید از چه مدت پیش برقرار باشد؟' },
        options: [{ en: '1 month', fa: '۱ ماه' }, { en: '3 months', fa: '۳ ماه' }, { en: '12 months', fa: '۱۲ ماه' }],
        answer: 1,
        why: { en: 'At least the last three months.', fa: 'دست‌کم سه ماه اخیر.' },
      },
      {
        key: 'spain-share',
        q: { en: 'What share of a freelancer’s work may be for Spanish clients?', fa: 'فریلنسر چه سهمی از کارش را می‌تواند برای مشتری اسپانیایی انجام دهد؟' },
        options: [{ en: 'None', fa: 'هیچ' }, { en: 'Up to 20%', fa: 'تا ۲۰ درصد' }, { en: 'Up to 50%', fa: 'تا ۵۰ درصد' }],
        answer: 1,
        why: { en: 'Up to 20% of total professional activity.', fa: 'تا ۲۰ درصد کل فعالیت حرفه‌ای.' },
      },
      {
        key: 'experience',
        q: { en: 'Without a degree, how much experience is needed?', fa: 'بدون مدرک دانشگاهی چند سال سابقه لازم است؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '3 years', fa: '۳ سال' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: 'Three years of professional experience.', fa: 'سه سال سابقه‌ی حرفه‌ای.' },
      },
      {
        key: 'permit',
        q: { en: 'Longest first permit when applying inside Spain?', fa: 'طولانی‌ترین اقامت اول وقتی از داخل اسپانیا درخواست می‌دهید؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '3 years', fa: '۳ سال' }, { en: '5 years', fa: '۵ سال' }],
        answer: 1,
        why: { en: 'Up to three years, then two-year renewals.', fa: 'حداکثر سه سال، سپس تمدید دوساله.' },
      },
    ],
    media: [],
  },

  'es-blue-card': {
    funds: [],
    steps: [
      {
        key: 'offer',
        title: { en: 'Get a qualifying offer', fa: 'پیشنهاد کار واجد شرایط بگیرید' },
        detail: { en: 'At least six months of highly qualified work paying at least EUR 41,356.36 a year (EUR 33,085.09 reduced threshold where it applies).', fa: 'دست‌کم شش ماه کار بسیار تخصصی با حقوق سالانه‌ی دست‌کم ۴۱٬۳۵۶٫۳۶ یورو (یا آستانه‌ی کاهش‌یافته‌ی ۳۳٬۰۸۵٫۰۹ یورو در موارد مجاز).' },
        link: UGE_UMBRAL,
      },
      {
        key: 'qualification',
        title: { en: 'Prove the qualification', fa: 'مدرک یا سابقه را ثابت کنید' },
        detail: { en: 'A degree of at least three years (EQF 6), or five years of relevant experience (three within the last seven for IT). Regulated professions need recognition.', fa: 'مدرک دست‌کم سه‌ساله (سطح ۶ چارچوب اروپایی) یا پنج سال سابقه‌ی مرتبط (در فناوری اطلاعات سه سال در هفت سال اخیر). حرفه‌های مقرراتی ارزشیابی مدرک می‌خواهند.' },
        link: BOE_14,
      },
      {
        key: 'apply',
        title: { en: 'Employer or you apply to the UGE', fa: 'کارفرما یا خودتان به UGE درخواست بدهید' },
        detail: { en: 'Filed electronically by the company or the professional; the company is registered with the UGE for three renewable years.', fa: 'درخواست را شرکت یا خود متخصص الکترونیکی ثبت می‌کند؛ شرکت برای سه سال قابل تمدید در UGE ثبت می‌شود.' },
        takes: { en: '20 days, silence means granted', fa: '۲۰ روز، سکوت یعنی پذیرش' },
        link: SEDE,
      },
      {
        key: 'visa',
        title: { en: 'Visa, then the TIE card', fa: 'ویزا و سپس کارت TIE' },
        detail: { en: 'If you need a visa, the consulate issues it with no extra requirements. Permits over six months need a foreigner identity card (TIE).', fa: 'اگر ویزا لازم دارید، کنسولگری بدون شرط اضافه صادرش می‌کند. اقامت بیش از شش ماه کارت اقامت (TIE) می‌خواهد.' },
        link: BOE_14,
      },
    ],
    documents: [
      ...SHARED_DOCS,
      { key: 'contract', label: { en: 'Employment contract or firm offer of at least six months', fa: 'قرارداد کار یا پیشنهاد قطعی دست‌کم شش‌ماهه' }, stage: 'apply' },
      { key: 'degree', label: { en: 'Degree certificate, or proof of professional experience', fa: 'مدرک تحصیلی یا گواهی سابقه‌ی حرفه‌ای' }, stage: 'apply' },
      { key: 'recognition', label: { en: 'Recognition (homologación) for regulated professions', fa: 'ارزشیابی مدرک (homologación) برای حرفه‌های مقرراتی' }, stage: 'apply' },
    ],
    realities: [
      {
        key: 'threshold-moves',
        kind: 'challenge',
        title: { en: 'The salary floor moves', fa: 'کف حقوق ثابت نیست' },
        detail: { en: 'It follows the INE average salary; the UGE updated it in June 2026 to EUR 41,356.36.', fa: 'کف حقوق از میانگین دستمزد اداره‌ی آمار (INE) پیروی می‌کند؛ UGE آن را در ژوئن ۲۰۲۶ به ۴۱٬۳۵۶٫۳۶ یورو رساند.' },
        source: UGE_UMBRAL,
      },
      {
        key: 'graduates',
        kind: 'tip',
        title: { en: 'Recent graduates pay a lower floor', fa: 'فارغ‌التحصیل تازه کف پایین‌تری دارد' },
        detail: { en: 'A qualification obtained within three years of applying allows the reduced threshold of EUR 33,085.09.', fa: 'مدرکی که در سه سال پیش از درخواست گرفته شده، آستانه‌ی کاهش‌یافته‌ی ۳۳٬۰۸۵٫۰۹ یورو را ممکن می‌کند.' },
        source: UGE_UMBRAL,
      },
      {
        key: 'unemployment',
        kind: 'challenge',
        title: { en: 'Losing the job has a clock', fa: 'از دست دادن کار مهلت دارد' },
        detail: { en: 'The card can be withdrawn after three months of unemployment in the first two years, six months after that.', fa: 'کارت پس از سه ماه بیکاری در دو سال اول، و پس از شش ماه بیکاری بعد از آن، ممکن است لغو شود.' },
        source: BOE_14,
      },
      {
        key: 'tax',
        kind: 'tip',
        title: { en: 'Newcomers’ tax regime', fa: 'رژیم مالیاتی تازه‌واردها' },
        detail: { en: 'A move for an employment contract qualifies for art. 93: 24% up to EUR 600,000 for the year of arrival and five more.', fa: 'جابه‌جایی برای قرارداد کار مشمول ماده‌ی ۹۳ است: ۲۴ درصد تا ۶۰۰٬۰۰۰ یورو برای سال ورود و پنج سال بعد.' },
        source: IRPF,
      },
    ],
    timeline: timeline(5, BOE_14),
    quiz: [
      {
        key: 'salary',
        q: { en: 'General Blue Card salary floor since June 2026?', fa: 'کف عمومی حقوق کارت آبی از ژوئن ۲۰۲۶؟' },
        options: [{ en: 'EUR 33,085.09', fa: '۳۳٬۰۸۵٫۰۹ یورو' }, { en: 'EUR 41,356.36', fa: '۴۱٬۳۵۶٫۳۶ یورو' }, { en: 'EUR 53,625', fa: '۵۳٬۶۲۵ یورو' }],
        answer: 1,
        why: { en: 'EUR 41,356.36 a year; 33,085.09 is the reduced threshold.', fa: 'سالانه ۴۱٬۳۵۶٫۳۶ یورو؛ ۳۳٬۰۸۵٫۰۹ آستانه‌ی کاهش‌یافته است.' },
      },
      {
        key: 'contract',
        q: { en: 'Minimum contract length?', fa: 'حداقل مدت قرارداد؟' },
        options: [{ en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }],
        answer: 1,
        why: { en: 'At least six months.', fa: 'دست‌کم شش ماه.' },
      },
      {
        key: 'experience',
        q: { en: 'Experience accepted instead of a degree (outside IT)?', fa: 'سابقه‌ی جایگزین مدرک (به‌جز فناوری اطلاعات)؟' },
        options: [{ en: '3 years', fa: '۳ سال' }, { en: '5 years', fa: '۵ سال' }, { en: '10 years', fa: '۱۰ سال' }],
        answer: 1,
        why: { en: 'Five years of relevant experience; three for IT.', fa: 'پنج سال سابقه‌ی مرتبط؛ در فناوری اطلاعات سه سال.' },
      },
      {
        key: 'decision',
        q: { en: 'UGE decision deadline?', fa: 'مهلت تصمیم UGE؟' },
        options: [{ en: '20 days', fa: '۲۰ روز' }, { en: '3 months', fa: '۳ ماه' }, { en: '6 months', fa: '۶ ماه' }],
        answer: 0,
        why: { en: '20 days from electronic filing; silence means granted.', fa: '۲۰ روز از ثبت الکترونیکی؛ سکوت یعنی پذیرش.' },
      },
      {
        key: 'length',
        q: { en: 'Longest first permit?', fa: 'طولانی‌ترین اقامت اول؟' },
        options: [{ en: '1 year', fa: '۱ سال' }, { en: '3 years', fa: '۳ سال' }, { en: '4 years', fa: '۴ سال' }],
        answer: 1,
        why: { en: 'Three years, or the contract plus three months if shorter.', fa: 'سه سال، یا اگر قرارداد کوتاه‌تر است مدت آن به‌علاوه‌ی سه ماه.' },
      },
    ],
    media: [],
  },

  'es-study': {
    funds: [
      { key: 'student', label: { en: 'Student, per month (100% of IPREM)', fa: 'دانشجو، ماهانه (۱۰۰ درصد IPREM)' }, amount: 600, currency: 'EUR', basis: 'month', per: 'person', kind: 'show', source: STUDY },
      { key: 'spouse', label: { en: 'First family member, per month (75% of IPREM)', fa: 'نخستین عضو خانواده، ماهانه (۷۵ درصد IPREM)' }, amount: 450, currency: 'EUR', basis: 'month', per: 'spouse', kind: 'show', source: STUDY },
      { key: 'child', label: { en: 'Each further member, per month (50% of IPREM)', fa: 'هر عضو بعدی، ماهانه (۵۰ درصد IPREM)' }, amount: 300, currency: 'EUR', basis: 'month', per: 'child', kind: 'show', source: STUDY },
    ],
    steps: [
      {
        key: 'admission',
        title: { en: 'Get admitted and pay registration', fa: 'پذیرش بگیرید و شهریه‌ی ثبت‌نام را بپردازید' },
        detail: { en: 'A full-time higher education programme leading to a degree; non-university programmes need at least 50% in person.', fa: 'دوره‌ی تمام‌وقت آموزش عالی منجر به مدرک؛ دوره‌های غیردانشگاهی دست‌کم ۵۰ درصد حضوری.' },
        link: STUDY,
      },
      {
        key: 'documents',
        title: { en: 'Gather the documents', fa: 'مدارک را جمع کنید' },
        detail: { en: 'Passport valid for a year, means, insurance, admission, and for stays over six months a criminal record certificate covering five years. Foreign documents legalised or apostilled and translated.', fa: 'گذرنامه با یک سال اعتبار، تمکن، بیمه، پذیرش، و برای اقامت بیش از شش ماه گواهی عدم سوءپیشینه‌ی پنج سال. اسناد خارجی قانونی‌شده یا با آپوستیل و ترجمه‌شده.' },
        link: STUDY,
      },
      {
        key: 'visa',
        title: { en: 'Apply at the consulate two months ahead', fa: 'دو ماه زودتر در کنسولگری درخواست بدهید' },
        detail: { en: 'At the consulate covering where you live, at least two months before studies start. Collect the visa within two months of the decision.', fa: 'در کنسولگری حوزه‌ی محل اقامت، دست‌کم دو ماه پیش از شروع تحصیل. ویزا را ظرف دو ماه از ابلاغ تصمیم بگیرید.' },
        takes: { en: 'Decision within one month', fa: 'تصمیم ظرف یک ماه' },
        link: STUDY,
      },
      {
        key: 'tie',
        title: { en: 'Get the TIE within a month of arrival', fa: 'ظرف یک ماه پس از ورود کارت TIE بگیرید' },
        detail: { en: 'For stays over six months, request the foreigner identity card in person at the police.', fa: 'برای اقامت بیش از شش ماه، کارت اقامت را حضوری از پلیس درخواست کنید.' },
        link: STUDY,
      },
      {
        key: 'job-search',
        title: { en: 'After graduating: up to 24 months to find work or start up', fa: 'پس از فارغ‌التحصیلی: تا ۲۴ ماه برای کاریابی یا راه‌اندازی' },
        detail: { en: 'Graduates at EQF level 6 or above apply electronically from 60 days before to 90 days after the stay expires; 20 days to decide, silence means granted.', fa: 'فارغ‌التحصیل سطح ۶ یا بالاتر از ۶۰ روز پیش تا ۹۰ روز پس از پایان اقامت الکترونیکی درخواست می‌دهد؛ ۲۰ روز مهلت تصمیم و سکوت یعنی پذیرش.' },
        link: BOE_14,
      },
    ],
    documents: [
      { key: 'passport', label: { en: 'Passport valid for at least one year', fa: 'گذرنامه با دست‌کم یک سال اعتبار' }, stage: 'visa' },
      { key: 'admission', label: { en: 'Admission letter and proof that registration fees are paid', fa: 'نامه‌ی پذیرش و رسید پرداخت شهریه‌ی ثبت‌نام' }, stage: 'visa' },
      { key: 'means', label: { en: 'Proof of means for the stay and the return trip', fa: 'مدرک تمکن برای دوره‌ی اقامت و بازگشت' }, stage: 'visa' },
      { key: 'insurance', label: { en: 'Health insurance with an insurer authorised in Spain', fa: 'بیمه‌ی درمانی از بیمه‌گر مجاز در اسپانیا' }, stage: 'visa' },
      { key: 'record', label: { en: 'Criminal record certificate for the last five years (stays over six months)', fa: 'گواهی عدم سوءپیشینه‌ی پنج سال اخیر (اقامت بیش از شش ماه)' }, stage: 'visa' },
      { key: 'fee', label: { en: 'Visa fee, paid on application', fa: 'هزینه‌ی ویزا، هنگام درخواست' }, stage: 'visa' },
      { key: 'renewal', label: { en: 'Each year: proof of registration for the new course', fa: 'هر سال: مدرک ثبت‌نام در سال تحصیلی جدید' }, stage: 'renewal' },
    ],
    realities: [
      {
        key: 'thirty-hours',
        kind: 'tip',
        title: { en: 'Work up to 30 hours a week', fa: 'تا ۳۰ ساعت در هفته کار' },
        detail: { en: 'Higher-education students may work employed or self-employed without another permit, if compatible with studies; going over 30 hours can end the stay.', fa: 'دانشجوی آموزش عالی بدون مجوز دیگر می‌تواند کارمندی یا خوداشتغالی کند، به شرط سازگاری با تحصیل؛ بیش از ۳۰ ساعت ممکن است اقامت را لغو کند.' },
        source: RD_1155,
      },
      {
        key: 'family-no-work',
        kind: 'challenge',
        title: { en: 'Family members cannot work', fa: 'اعضای خانواده اجازه‌ی کار ندارند' },
        detail: { en: 'Relatives on a student’s permit may not work during its validity.', fa: 'خانواده‌ی همراه دانشجو در مدت اعتبار اقامت اجازه‌ی کار ندارند.' },
        source: STUDY,
      },
      {
        key: 'whole-course',
        kind: 'myth',
        title: { en: '“You renew every year”', fa: '«هر سال باید تمدید کنید»' },
        detail: { en: 'For higher education the stay lasts the whole programme; you only show each year’s registration.', fa: 'در آموزش عالی، اقامت برای کل دوره صادر می‌شود؛ فقط ثبت‌نام هر سال را نشان می‌دهید.' },
        source: STUDY,
      },
      {
        key: 'job-search',
        kind: 'tip',
        title: { en: 'Two years to find a job or start a company', fa: 'دو سال برای کار پیدا کردن یا راه‌اندازی شرکت' },
        detail: { en: 'Ley 14/2013 DA 17 allows up to 24 months after a degree at EQF level 6 or above.', fa: 'بند الحاقی ۱۷ قانون ۱۴/۲۰۱۳ پس از مدرک سطح ۶ یا بالاتر تا ۲۴ ماه فرصت می‌دهد.' },
        source: BOE_14,
      },
    ],
    timeline: {
      citizenshipAfterYears: 10,
      dualCitizenship: 'restricted',
      language: LANGUAGE,
      note: {
        en: 'Study years count at 50% towards EU long-term residence, if you hold a residence permit when you apply. Citizenship needs ten years of legal residence.',
        fa: 'سال‌های تحصیل با ضریب ۵۰ درصد برای اقامت بلندمدت اتحادیه‌ی اروپا حساب می‌شود، به شرط اینکه هنگام درخواست اقامت داشته باشید. تابعیت ده سال اقامت قانونی می‌خواهد.',
      },
      source: RD_1155,
    },
    quiz: [
      {
        key: 'hours',
        q: { en: 'Weekly work limit for higher-education students?', fa: 'سقف کار هفتگی دانشجوی آموزش عالی؟' },
        options: [{ en: '20 hours', fa: '۲۰ ساعت' }, { en: '30 hours', fa: '۳۰ ساعت' }, { en: 'No limit', fa: 'بدون سقف' }],
        answer: 1,
        why: { en: '30 hours a week under Real Decreto 1155/2024.', fa: '۳۰ ساعت در هفته طبق آیین‌نامه‌ی ۱۱۵۵/۲۰۲۴.' },
      },
      {
        key: 'funds',
        q: { en: 'Monthly means for the student?', fa: 'تمکن ماهانه‌ی دانشجو؟' },
        options: [{ en: 'EUR 450', fa: '۴۵۰ یورو' }, { en: 'EUR 600', fa: '۶۰۰ یورو' }, { en: 'EUR 1,221', fa: '۱٬۲۲۱ یورو' }],
        answer: 1,
        why: { en: '100% of the IPREM, EUR 600 a month.', fa: '۱۰۰ درصد IPREM، یعنی ۶۰۰ یورو در ماه.' },
      },
      {
        key: 'deadline',
        q: { en: 'How early must you apply at the consulate?', fa: 'چقدر زودتر باید در کنسولگری درخواست داد؟' },
        options: [{ en: '2 weeks', fa: '۲ هفته' }, { en: '2 months', fa: '۲ ماه' }, { en: '6 months', fa: '۶ ماه' }],
        answer: 1,
        why: { en: 'At least two months before studies start.', fa: 'دست‌کم دو ماه پیش از شروع تحصیل.' },
      },
      {
        key: 'job-search',
        q: { en: 'Job-search time after a bachelor’s or higher?', fa: 'فرصت کاریابی پس از کارشناسی یا بالاتر؟' },
        options: [{ en: '6 months', fa: '۶ ماه' }, { en: '12 months', fa: '۱۲ ماه' }, { en: '24 months', fa: '۲۴ ماه' }],
        answer: 2,
        why: { en: 'Up to 24 months under Ley 14/2013 DA 17.', fa: 'تا ۲۴ ماه طبق بند الحاقی ۱۷ قانون ۱۴/۲۰۱۳.' },
      },
      {
        key: 'family',
        q: { en: 'May a student’s spouse work in Spain?', fa: 'همسر دانشجو در اسپانیا اجازه‌ی کار دارد؟' },
        options: [{ en: 'Yes', fa: 'بله' }, { en: 'No', fa: 'نه' }],
        answer: 1,
        why: { en: 'Family members are not authorised to work.', fa: 'اعضای خانواده اجازه‌ی کار ندارند.' },
      },
    ],
    media: [],
  },
};

export const PROFILE_ES: CountryProfile = {
  strengths: [
    { en: 'Startup route with no minimum investment and a 20-day legal decision, where silence means yes.', fa: 'مسیر استارتاپی بدون حداقل سرمایه‌گذاری و با تصمیم قانونی ۲۰ روزه که سکوت در آن یعنی پذیرش.' },
    { en: 'Family can apply with the main applicant and be decided together.', fa: 'خانواده می‌تواند هم‌زمان با متقاضی اصلی درخواست بدهد و هم‌زمان تصمیم بگیرد.' },
    { en: 'A remote-work permit and a 24-month post-study search permit.', fa: 'اقامت دورکاری و اقامت ۲۴ ماهه‌ی کاریابی پس از تحصیل.' },
    { en: 'Newcomers’ tax regime: 24% up to EUR 600,000 for six tax years.', fa: 'رژیم مالیاتی تازه‌واردها: ۲۴ درصد تا ۶۰۰٬۰۰۰ یورو برای شش سال مالیاتی.' },
  ],
  weaknesses: [
    { en: 'Citizenship takes ten years for most nationalities, and most must renounce their previous nationality.', fa: 'تابعیت برای بیشتر ملیت‌ها ده سال طول می‌کشد و بیشترشان باید از تابعیت قبلی صرف‌نظر کنند.' },
    { en: 'All Ley 14/2013 filings are electronic and in Spanish, needing a digital certificate or a representative.', fa: 'همه‌ی درخواست‌های قانون ۱۴/۲۰۱۳ الکترونیکی و اسپانیایی است و گواهی دیجیتال یا نماینده می‌خواهد.' },
    { en: 'Unemployment is high: 10.4% in 2025.', fa: 'بیکاری بالاست: ۱۰٫۴ درصد در ۲۰۲۵.' },
    { en: 'GDP per head is well below northern Europe, at about USD 38,600 in 2025.', fa: 'تولید سرانه بسیار پایین‌تر از شمال اروپاست: حدود ۳۸٬۶۰۰ دلار در ۲۰۲۵.' },
  ],
  indicators: [
    { key: 'hdi', rank: 28, of: 193, value: 0.918, year: 2023, source: { url: 'https://hdr.undp.org/data-center/specific-country-data#/countries/ESP', checked: CHECKED, label: 'UNDP HDR 2025 (2023 data)' } },
    { key: 'gdp-per-capita', value: 38_627, unit: 'USD', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/ESP/indicator/NY.GDP.PCAP.CD?format=json', checked: CHECKED, label: 'World Bank' } },
    { key: 'unemployment', value: 10.4, unit: '%', year: 2025, source: { url: 'https://api.worldbank.org/v2/country/ESP/indicator/SL.UEM.TOTL.ZS?format=json', checked: CHECKED, label: 'World Bank (ILO estimate)' } },
    { key: 'innovation', rank: 28, of: 139, year: 2026, source: { url: 'https://www.wipo.int/web-publications/global-innovation-index-2026/en/gii-2026-results.html', checked: CHECKED, label: 'WIPO GII 2026' } },
  ],
};

