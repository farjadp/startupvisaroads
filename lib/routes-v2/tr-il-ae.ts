import type { RouteV2 } from './types';

// Türkiye, Israel and the UAE. Research: v2-routes-tr-il-ae.md (15 Oct 2026),
// official government pages only. Page dates are in each source label.

const CHECKED = '2026-10-15';

export const ROUTES_TR_IL_AE: RouteV2[] = [
  // ───────────────────────────── TÜRKIYE ─────────────────────────────
  {
    key: 'tr-tech-visa',
    country: 'TR',
    family: 'startup',
    name: { en: 'Türkiye Tech Visa', fa: 'ویزای فناوری ترکیه (Türkiye Tech Visa)' },
    agency:
      'Ministry of Industry and Technology (programme; a technopark evaluates); Ministry of Labour and Social Security (work permit); Presidency of Migration Management (family residence)',
    status: 'open',
    fact: {
      en: 'The deciding step is whether a technopark (technology development zone) committee accepts the venture.',
      fa: 'گام تعیین‌کننده این است که کمیته‌ی یک تکنوپارک (منطقه‌ی توسعه‌ی فناوری) طرح را بپذیرد.',
    },
    criteria: [
      {
        key: 'partner-capital',
        label: {
          en: 'Share capital of at least TRY 500,000 per foreign partner',
          fa: 'سهم سرمایه‌ی دست‌کم ۵۰۰٬۰۰۰ لیر ترکیه برای هر شریک خارجی',
        },
        weight: 2,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 500000, currency: 'TRY' },
        note: {
          en: 'Unconfirmed for founders: Ministry of Labour criterion B.5.2 exempts foreigners working inside a technopark from the financial and employment criteria. It does not say whether company partners are covered.',
          fa: 'برای بنیان‌گذاران تأییدنشده است: معیار B.5.2 وزارت کار، خارجیانی را که در تکنوپارک کار می‌کنند از معیارهای مالی و اشتغال معاف می‌کند، اما روشن نمی‌کند که شرکای شرکت را هم در بر می‌گیرد یا نه.',
        },
      },
      {
        key: 'company-capital',
        label: {
          en: 'Company paid-in capital of at least TRY 500,000',
          fa: 'سرمایه‌ی پرداخت‌شده‌ی شرکت دست‌کم ۵۰۰٬۰۰۰ لیر ترکیه',
        },
        weight: 2,
        scoreable: false,
        note: {
          en: 'A company figure that depends on all partners, so it is not scored. Unconfirmed for founders, as above (technopark exemption, B.5.2).',
          fa: 'این رقم به همه‌ی شرکا بستگی دارد و امتیازدهی نمی‌شود. مانند معیار بالا، شمول آن بر بنیان‌گذاران به‌دلیل معافیت تکنوپارک (B.5.2) تأییدنشده است.',
        },
      },
      {
        key: 'partner-share',
        label: {
          en: 'Each foreign partner holds at least 20% of the company',
          fa: 'هر شریک خارجی دست‌کم ۲۰ درصد سهام شرکت را داشته باشد',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'usd-waiver',
        label: {
          en: 'Capital share of at least USD 100,000 (waives the TRY capital, share and five-employee rules)',
          fa: 'سهم سرمایه‌ی دست‌کم ۱۰۰٬۰۰۰ دلار آمریکا (که شرط سرمایه به لیر، سهم ۲۰ درصدی و استخدام پنج نفر را برمی‌دارد)',
        },
        weight: 2,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 100000, currency: 'USD' },
      },
      {
        key: 'turkish-employees',
        label: {
          en: 'At least 5 Turkish employees per foreign partner from month 7',
          fa: 'دست‌کم پنج کارمند ترک به‌ازای هر شریک خارجی از ماه هفتم',
        },
        weight: 1,
        scoreable: false,
        note: {
          en: 'Unconfirmed for founders inside a technopark (B.5.2).',
          fa: 'شمول آن بر بنیان‌گذاران مستقر در تکنوپارک (B.5.2) تأییدنشده است.',
        },
      },
      {
        key: 'team-size',
        label: { en: 'At most 5 founders per team', fa: 'حداکثر پنج بنیان‌گذار در هر تیم' },
        weight: 1,
        scoreable: false,
        note: {
          en: 'Derived from the 20% share rule; not published as a rule.',
          fa: 'از قاعده‌ی سهم ۲۰ درصدی نتیجه گرفته شده و به‌صورت قاعده منتشر نشده است.',
        },
      },
      {
        key: 'technopark-evaluation',
        label: {
          en: 'Technopark committee assesses the innovation, technology base and team',
          fa: 'ارزیابی نوآوری، پایه‌ی فناوری و تیم از سوی کمیته‌ی تکنوپارک',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'tech-business-model',
        label: {
          en: 'An innovative, technology-based business model (the Talent track asks for critical expertise in technology, with no measurable bar)',
          fa: 'مدل کسب‌وکار نوآورانه و مبتنی بر فناوری (مسیر استعداد «تخصص حیاتی در فناوری» می‌خواهد، بدون معیار قابل‌اندازه‌گیری)',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'company-in-3-months',
        label: {
          en: 'The company is set up within 3 months with the technopark firm the ministry assigns; otherwise the process lapses',
          fa: 'شرکت ظرف سه ماه با شرکت تکنوپارکی که وزارتخانه تعیین می‌کند ثبت شود؛ در غیر این صورت روند متوقف می‌شود',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'partner-capital',
        label: {
          en: 'Capital contributed per foreign partner (possibly waived inside a technopark, B.5.2)',
          fa: 'سرمایه‌ی آورده‌ی هر شریک خارجی (ممکن است در تکنوپارک طبق B.5.2 لازم نباشد)',
        },
        amount: 500000,
        currency: 'TRY',
        basis: 'once',
        shows: { en: 'Company capital and share records', fa: 'اسناد سرمایه و سهام شرکت' },
      },
      {
        key: 'usd-alternative',
        label: {
          en: 'Alternative capital share that waives the TRY test',
          fa: 'سهم سرمایه‌ی جایگزین که شرط سرمایه به لیر را برمی‌دارد',
        },
        amount: 100000,
        currency: 'USD',
        basis: 'once',
        shows: { en: 'Company capital and share records', fa: 'اسناد سرمایه و سهام شرکت' },
      },
    ],
    processing: {
      text: {
        en: 'Work permit processed within a maximum of 30 days; the work-permit exemption must be filed within 30 days; the company must be set up within 3 months.',
        fa: 'رسیدگی به اجازه‌ی کار حداکثر ۳۰ روز طول می‌کشد؛ درخواست معافیت از اجازه‌ی کار باید ظرف ۳۰ روز ثبت شود و شرکت باید ظرف سه ماه تأسیس شود.',
      },
      source: 'https://turkiyetechvisa.gov.tr/upload/Node/47630/files/Turkiye-Tech-Visa-Brochure.pdf',
    },
    pr: {
      en: 'A 3-year work permit; long-term residence after 8 years of continuous residence (Law 6458, Art. 42–43); the Turquoise Card is a separate application.',
      fa: 'اجازه‌ی کار سه‌ساله؛ اقامت بلندمدت پس از هشت سال اقامت پیوسته (قانون ۶۴۵۸، مواد ۴۲ و ۴۳)؛ کارت فیروزه‌ای درخواستی جداگانه است.',
    },
    sources: [
      { url: 'https://turkiyetechvisa.gov.tr/en/start-up', checked: CHECKED, label: 'Tech Visa start-up track (© 2024 only)' },
      { url: 'https://turkiyetechvisa.gov.tr/en/talent', checked: CHECKED, label: 'Tech Visa talent track (© 2024 only)' },
      {
        url: 'https://turkiyetechvisa.gov.tr/upload/Node/47630/files/Turkiye-Tech-Visa-Brochure.pdf',
        checked: CHECKED,
        label: 'Tech Visa brochure (PDF dated 2024-11-08)',
      },
      {
        url: 'https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/',
        checked: CHECKED,
        label: 'ÇSGB work-permit criteria C.1.1, C.1.2, B.5.2 (source of all capital and employee figures; no page date)',
      },
    ],
    verified: false,
    review:
      'UNCONFIRMED FOR FOUNDERS: the TRY 500,000 capital rule (and the company-capital, 20% share and 5-employee rules) come from ÇSGB C.1.1, but ÇSGB B.5.2 exempts foreigners who "work" in a technopark (with a positive Ministry of Industry opinion) from the employment and financial criteria. B.5.2 does not name company partners, so whether the capital rule binds Tech Visa founders, and whether the technopark exemption covers them, is unconfirmed. Source fix: the figures come from calismaizni.csgb.gov.tr, not turkiyetechvisa.gov.tr (which publishes no numbers); goc.gov.tr and turkiyetechvisa.gov.tr publish no thresholds. The old programmes.ts entry applies both rules as binding. Not encoded: technopark evaluation fee (amount not published); work-permit fee (not on pages read); age, degree, salary, product stage and valuation (not published). Max-5-founders is derived, not published.',
  },
  {
    key: 'tr-turquoise-card',
    country: 'TR',
    family: 'startup',
    name: { en: 'Turquoise Card (Turkuaz Kart)', fa: 'کارت فیروزه‌ای (Turkuaz Kart)' },
    agency: 'Ministry of Labour and Social Security, General Directorate of International Labour Force',
    status: 'open',
    fact: {
      en: 'The ministry decides by a points score whose criteria it does not publish.',
      fa: 'وزارتخانه بر پایه‌ی امتیازی تصمیم می‌گیرد که معیارهای آن را منتشر نمی‌کند.',
    },
    criteria: [
      {
        key: 'points-score',
        label: {
          en: 'Ministry points score (criteria not published)',
          fa: 'امتیاز وزارتخانه (معیارها منتشر نشده است)',
        },
        weight: 3,
        scoreable: false,
        note: {
          en: 'No investment, export, job or salary figure is published for this card.',
          fa: 'برای این کارت هیچ رقمی برای سرمایه‌گذاری، صادرات، اشتغال‌زایی یا حقوق منتشر نشده است.',
        },
      },
      {
        key: 'category',
        label: {
          en: 'Fits a category: highly qualified worker, highly qualified investor, scientist or researcher, international success in culture, arts or sport, or a person who promotes Türkiye',
          fa: 'قرار گرفتن در یکی از گروه‌ها: نیروی کار بسیار ماهر، سرمایه‌گذار بسیار واجد شرایط، دانشمند یا پژوهشگر، موفقیت بین‌المللی در فرهنگ، هنر یا ورزش، یا معرفی‌کننده‌ی ترکیه',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'discretion',
        label: {
          en: "The ministry's discretion and the advisory board's recommendation",
          fa: 'صلاحدید وزارتخانه و توصیه‌ی هیئت مشورتی',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'not-temporary-protection',
        label: {
          en: 'Not available to people under temporary protection',
          fa: 'برای افراد تحت حمایت موقت در دسترس نیست',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    pr: {
      en: 'A 3-year transition period; apply in its last 180 days and the card becomes indefinite. Holders are also eligible for exceptional citizenship (Law 5901, Art. 12).',
      fa: 'دوره‌ی گذار سه‌ساله؛ با درخواست در ۱۸۰ روز پایانی آن، کارت دائمی می‌شود. دارندگان کارت برای تابعیت استثنایی (قانون ۵۹۰۱، ماده‌ی ۱۲) نیز واجد شرایط‌اند.',
    },
    sources: [
      { url: 'https://www.csgb.gov.tr/uigm/en/turkuaz-kart/', checked: CHECKED, label: 'ÇSGB Turquoise Card, English (© 2024 only)' },
      { url: 'https://www.csgb.gov.tr/uigm/turkuaz-kart/', checked: CHECKED, label: 'ÇSGB Turkuaz Kart, Turkish (© 2026 only)' },
      {
        url: 'https://resmigazete.gov.tr/eskiler/2017/03/20170314-1.htm',
        checked: CHECKED,
        label: 'Turkuaz Kart Yönetmeliği, Resmî Gazete 2017-03-14',
      },
    ],
    verified: true,
    review:
      'Family set to startup per brief; the card itself is a points-based discretionary residence, not a founder programme. Do NOT reuse the USD 500k investment or USD 1M export figures: they belong to the citizenship and FDI regimes. Not encoded: money lines, processing time and the "valuable paper" card fee (holders pay only that fee; amount not on the page).',
  },
  {
    key: 'tr-company-formation',
    country: 'TR',
    family: 'entrepreneur',
    name: {
      en: 'Company formation: short-term residence and work permit',
      fa: 'تأسیس شرکت: اقامت کوتاه‌مدت و اجازه‌ی کار',
    },
    agency:
      'Presidency of Migration Management (residence, Law 6458 Art. 31(1)(c)); Ministry of Labour and Social Security (work permit)',
    status: 'open',
    fact: {
      en: 'The residence permit alone does not allow work; a managing foreign partner needs a work permit, which turns on TRY 500,000 of partner capital or the USD 100,000 alternative.',
      fa: 'اجازه‌ی اقامت به‌تنهایی مجوز کار نیست؛ شریک خارجی که شرکت را اداره می‌کند به اجازه‌ی کار نیاز دارد و شرط اصلی آن ۵۰۰٬۰۰۰ لیر سرمایه‌ی شریک یا جایگزین ۱۰۰٬۰۰۰ دلاری است.',
    },
    criteria: [
      {
        key: 'partner-capital',
        label: {
          en: "Foreign partner's capital of at least TRY 500,000 (for the work permit)",
          fa: 'سرمایه‌ی شریک خارجی دست‌کم ۵۰۰٬۰۰۰ لیر ترکیه (برای اجازه‌ی کار)',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 500000, currency: 'TRY' },
      },
      {
        key: 'company-capital',
        label: {
          en: 'Company paid-in capital of at least TRY 500,000 (new workplace)',
          fa: 'سرمایه‌ی پرداخت‌شده‌ی شرکت دست‌کم ۵۰۰٬۰۰۰ لیر ترکیه (محل کار جدید)',
        },
        weight: 2,
        scoreable: false,
        note: {
          en: 'A company figure that depends on all partners, so it is not scored.',
          fa: 'این رقم به همه‌ی شرکا بستگی دارد و امتیازدهی نمی‌شود.',
        },
      },
      {
        key: 'partner-share',
        label: { en: "Partner's share of at least 20%", fa: 'سهم شریک دست‌کم ۲۰ درصد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'usd-waiver',
        label: {
          en: 'Partner capital share of at least USD 100,000 (waives the rows above)',
          fa: 'سهم سرمایه‌ی شریک دست‌کم ۱۰۰٬۰۰۰ دلار آمریکا (که شرط‌های بالا را برمی‌دارد)',
        },
        weight: 2,
        scoreable: true,
        test: { field: 'investment', op: 'gte', value: 100000, currency: 'USD' },
      },
      {
        key: 'turkish-employees',
        label: {
          en: 'At least 5 Turkish employees per foreigner from month 7 of the first permit',
          fa: 'دست‌کم پنج کارمند ترک به‌ازای هر خارجی از ماه هفتم نخستین اجازه‌ی کار',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'net-sales',
        label: {
          en: 'Operating firm alternative: net sales of at least TRY 8,000,000',
          fa: 'جایگزین برای شرکت فعال: فروش خالص دست‌کم ۸٬۰۰۰٬۰۰۰ لیر ترکیه',
        },
        weight: 1,
        scoreable: true,
        test: { field: 'revenue', op: 'gte', value: 8000000, currency: 'TRY' },
      },
      {
        key: 'exports',
        label: {
          en: 'Operating firm alternative: exports of at least USD 150,000',
          fa: 'جایگزین برای شرکت فعال: صادرات دست‌کم ۱۵۰٬۰۰۰ دلار آمریکا',
        },
        weight: 1,
        scoreable: false,
        note: {
          en: 'The profile does not record exports.',
          fa: 'نمایه‌ی کاربر صادرات را ثبت نمی‌کند.',
        },
      },
      {
        key: 'employment-exemption',
        label: {
          en: 'Exemption from the employment rule for up to 5 foreigners: prior-year net sales of at least TRY 50,000,000',
          fa: 'معافیت از شرط اشتغال برای حداکثر پنج خارجی: فروش خالص سال گذشته دست‌کم ۵۰٬۰۰۰٬۰۰۰ لیر ترکیه',
        },
        weight: 1,
        scoreable: true,
        test: { field: 'revenue', op: 'gte', value: 50000000, currency: 'TRY' },
      },
      {
        key: 'wage-floor',
        label: {
          en: 'Wage of at least 3 × the gross minimum wage (other managers) or 5 × (top executives), per month',
          fa: 'حقوق ماهانه دست‌کم سه برابر حداقل دستمزد ناخالص (سایر مدیران) یا پنج برابر آن (مدیران ارشد)',
        },
        weight: 1,
        scoreable: false,
        note: {
          en: 'Set as a multiple of the minimum wage; no fixed amount is published.',
          fa: 'به‌صورت ضریبی از حداقل دستمزد تعیین شده و مبلغ ثابتی منتشر نشده است.',
        },
      },
      {
        key: 'company-documents',
        label: {
          en: 'Notarised company documents: activity certificate, tax registration, trade-registry gazette and signature circular',
          fa: 'اسناد محضری شرکت: گواهی فعالیت، ثبت مالیاتی، روزنامه‌ی ثبت تجاری و نمونه‌امضا',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'visa-insurance-address',
        label: {
          en: 'A visa matching the purpose of stay, health insurance for the full permit period, and an address in Türkiye',
          fa: 'ویزای متناسب با هدف اقامت، بیمه‌ی درمانی برای کل مدت اجازه و نشانی محل سکونت در ترکیه',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'criminal-record',
        label: { en: 'Criminal record, on request', fa: 'گواهی عدم سوءپیشینه، در صورت درخواست' },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'partner-capital',
        label: { en: 'Partner capital', fa: 'سرمایه‌ی شریک' },
        amount: 500000,
        currency: 'TRY',
        basis: 'once',
        shows: { en: 'Trade registry and capital records', fa: 'اسناد ثبت تجاری و سرمایه' },
      },
      {
        key: 'usd-waiver',
        label: { en: 'Alternative partner capital (waiver)', fa: 'سرمایه‌ی جایگزین شریک (معافیت)' },
        amount: 100000,
        currency: 'USD',
        basis: 'once',
        shows: { en: 'Trade registry and capital records', fa: 'اسناد ثبت تجاری و سرمایه' },
      },
    ],
    pr: {
      en: 'Short-term permits run up to 2 years at a time; long-term residence after 8 years of continuous residence (Art. 42–43), with every short-term year counting in full.',
      fa: 'اجازه‌ی اقامت کوتاه‌مدت هر بار حداکثر دو سال است؛ اقامت بلندمدت پس از هشت سال اقامت پیوسته (مواد ۴۲ و ۴۳) و هر سال اقامت کوتاه‌مدت به‌طور کامل محاسبه می‌شود.',
    },
    sources: [
      {
        url: 'https://en.goc.gov.tr/kurumlar/goc.gov.tr/files/law%20on%20foreigners%20and%20international%20protection(3).pdf',
        checked: CHECKED,
        label: 'Law 6458, English translation through the 2016 amendments',
      },
      {
        url: 'https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=0',
        checked: CHECKED,
        label: 'e-ikamet short-term residence document list (undated)',
      },
      {
        url: 'https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/',
        checked: CHECKED,
        label: 'ÇSGB work-permit criteria (no page date; thresholds effective 2025-01-01)',
      },
    ],
    verified: true,
    review:
      'Work-permit thresholds are published only by ÇSGB (calismaizni.csgb.gov.tr), not goc.gov.tr; flag if the app must cite only goc.gov.tr / turkiyetechvisa.gov.tr. en.goc.gov.tr residence pages returned 404/500; residence rules come from the 2016 Law 6458 translation and e-ikamet lists. Not encoded: personal funds for residence (income declaration, no figure); residence and card fees (set yearly in the Harçlar tariff, amounts not on pages read; e-ikamet appointments are free); processing time (not published).',
  },
  {
    key: 'tr-student',
    country: 'TR',
    family: 'study',
    name: { en: 'Student residence permit (Öğrenci İkamet İzni)', fa: 'اجازه‌ی اقامت تحصیلی (Öğrenci İkamet İzni)' },
    agency: 'Presidency of Migration Management (Law 6458, Art. 38–39)',
    status: 'open',
    fact: {
      en: 'You need admission to a degree programme at a Turkish higher-education institution; a Turkish language course alone does not qualify.',
      fa: 'باید در یک دوره‌ی دانشگاهی در مؤسسه‌ی آموزش عالی ترکیه پذیرش بگیرید؛ دوره‌ی زبان ترکی به‌تنهایی کافی نیست.',
    },
    criteria: [
      {
        key: 'degree-enrolment',
        label: {
          en: "Admission to an associate, bachelor's, master's or doctoral programme at a Turkish higher-education institution",
          fa: 'پذیرش در دوره‌ی کاردانی، کارشناسی، کارشناسی ارشد یا دکتری در مؤسسه‌ی آموزش عالی ترکیه',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'language-course',
        label: {
          en: 'A Turkish language course alone is not eligible; it needs a short-term permit instead',
          fa: 'دوره‌ی زبان ترکی به‌تنهایی واجد شرایط نیست و برای آن اجازه‌ی اقامت کوتاه‌مدت لازم است',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'student-certificate',
        label: { en: 'Student certificate from the institution', fa: 'گواهی دانشجویی از مؤسسه' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'address',
        label: { en: 'An address in Türkiye', fa: 'نشانی محل سکونت در ترکیه' },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'income-declaration',
        label: {
          en: 'An income declaration (no amount is set)',
          fa: 'اظهارنامه‌ی منبع درآمد (مبلغی تعیین نشده است)',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    pr: {
      en: 'Only half of student-permit time counts toward the 8 years for long-term residence (Art. 28(2)); a one-off short-term permit of up to 1 year can be requested within 6 months of graduating (Art. 31(1)(i)).',
      fa: 'تنها نیمی از مدت اقامت تحصیلی در هشت سال لازم برای اقامت بلندمدت محاسبه می‌شود (ماده‌ی ۲۸، بند ۲)؛ تا شش ماه پس از دانش‌آموختگی می‌توان یک‌بار اجازه‌ی اقامت کوتاه‌مدت تا یک سال گرفت (ماده‌ی ۳۱، بند ۱-ط).',
    },
    sources: [
      {
        url: 'https://en.goc.gov.tr/kurumlar/goc.gov.tr/files/law%20on%20foreigners%20and%20international%20protection(3).pdf',
        checked: CHECKED,
        label: 'Law 6458, English translation through the 2016 amendments',
      },
      {
        url: 'https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=5',
        checked: CHECKED,
        label: 'e-ikamet student residence document list (undated)',
      },
      {
        url: 'https://www.goc.gov.tr/kurumlar/goc.gov.tr/Yayinlar/Brosurler/Yabanci-Ogrenci-/Ogrenci-Ikamet-Izni-Basvuru-Sureci.pdf',
        checked: CHECKED,
        label: 'goc.gov.tr student residence brochure (undated)',
      },
    ],
    verified: true,
    review:
      'Not encoded: money lines (income declaration, no figure); processing time (not published); fees (not on goc pages; students are commonly fee-exempt and pay only the card fee, but this is not confirmed on a goc page).',
  },

  // ───────────────────────────── ISRAEL ─────────────────────────────
  {
    key: 'il-innovation-visa',
    country: 'IL',
    family: 'startup',
    name: {
      en: 'Innovation Visa for a Foreign Technology Entrepreneur',
      fa: 'ویزای نوآوری برای کارآفرین خارجی فناوری',
    },
    agency:
      'Israel Innovation Authority (recommends); Population and Immigration Authority, PIBA (grants the B/2 stay permit)',
    status: 'open',
    fact: {
      en: "The Israel Innovation Authority CEO's recommendation decides, after an examiner reviews the founder and the supporting framework.",
      fa: 'توصیه‌ی مدیرعامل سازمان نوآوری اسرائیل، پس از بررسی بنیان‌گذار و چارچوب پشتیبان از سوی کارشناس، تعیین‌کننده است.',
    },
    criteria: [
      {
        key: 'not-israeli',
        label: {
          en: 'Holds neither Israeli citizenship nor Israeli residency',
          fa: 'نداشتن تابعیت یا اقامت اسرائیل',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'supporting-framework',
        label: {
          en: 'A supporting framework (accelerator or host) with a support declaration',
          fa: 'چارچوب پشتیبان (شتاب‌دهنده یا میزبان) همراه با اعلامیه‌ی حمایت',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'endorsement', op: 'true' },
      },
      {
        key: 'living-funds',
        label: {
          en: 'A declaration of funds for living costs covering the whole stay (no amount published)',
          fa: 'اظهارنامه‌ی منابع مالی برای هزینه‌ی زندگی در کل مدت اقامت (مبلغی منتشر نشده است)',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'background',
        label: { en: "The entrepreneur's background and experience", fa: 'سوابق و تجربه‌ی کارآفرین' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'framework-value',
        label: { en: 'The value the supporting framework adds', fa: 'ارزش افزوده‌ی چارچوب پشتیبان' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'innovation',
        label: {
          en: 'A high degree of technological innovation and a feasible plan',
          fa: 'نوآوری فناورانه‌ی بالا و برنامه‌ی عملی',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'rnd-in-israel',
        label: { en: 'R&D to be done in Israel', fa: 'انجام تحقیق و توسعه در اسرائیل' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'global-potential',
        label: {
          en: 'Global business potential and the potential to build an industrial company in Israel',
          fa: 'ظرفیت کسب‌وکار جهانی و ظرفیت ساخت یک شرکت صنعتی در اسرائیل',
        },
        weight: 2,
        scoreable: false,
        note: {
          en: 'A professional examiner reviews; the IIA CEO decides; applications are handled first come, first served.',
          fa: 'کارشناس حرفه‌ای بررسی می‌کند، مدیرعامل سازمان نوآوری تصمیم می‌گیرد و درخواست‌ها به ترتیب رسیدن رسیدگی می‌شوند.',
        },
      },
    ],
    money: [],
    pr: {
      en: 'No permanent-residence route. The B/2 permit lasts up to 2 years and is not a work permit; founders then move to the B/1 expert visa (salary at least 2 × the average wage), capped at 63 months cumulative.',
      fa: 'مسیری به اقامت دائم ندارد. مجوز B/2 حداکثر دو سال است و اجازه‌ی کار نیست؛ سپس بنیان‌گذار باید به ویزای متخصص B/1 (حقوق دست‌کم دو برابر میانگین دستمزد) منتقل شود که سقف آن در مجموع ۶۳ ماه است.',
    },
    sources: [
      {
        url: 'https://innovationisrael.org.il/en/programs/tech-innovation-visa/',
        checked: CHECKED,
        label: 'Israel Innovation Authority, Innovation Visa (published 2026-05-18, modified 2026-06-21)',
      },
      {
        url: 'https://www.gov.il/BlobFolder/policy/experimental_procedure_for_visas_for_entrepreneurs_from_abroad/he/5.3.0029_eng.pdf',
        checked: CHECKED,
        label: 'PIBA pilot procedure 5.3.0029 (2016-08-01)',
      },
    ],
    verified: false,
    review:
      'CONFLICT, unresolved: IIA says the procedure was approved in 2024, but gov.il still hosts only the 2016 pilot procedure 5.3.0029 (time-limited to 3 years; says B/2 is not a work permit). The 2024 PIBA procedure text was not found. Not encoded: living-funds amount (declaration only, no figure); processing time and fees (not published). No grant comes with approval.',
  },
  {
    key: 'il-expert-b1',
    country: 'IL',
    family: 'entrepreneur',
    name: {
      en: 'B/1 Foreign High-Tech Expert visa',
      fa: 'ویزای متخصص خارجی فناوری پیشرفته (B/1)',
    },
    agency: 'Israel Innovation Authority with the Population and Immigration Authority (procedure 5.3.0041)',
    status: 'open',
    fact: {
      en: 'The employer applies, not you: you need an IIA-authorised high-tech employer paying at least twice the average wage.',
      fa: 'درخواست را کارفرما ثبت می‌کند، نه شما: باید کارفرمای فناوری پیشرفته‌ی مورد تأیید سازمان نوآوری دست‌کم دو برابر میانگین دستمزد به شما بپردازد.',
    },
    criteria: [
      {
        key: 'salary',
        label: {
          en: 'Salary of at least 2 × the average wage, about ILS 27,132 a month',
          fa: 'حقوق دست‌کم دو برابر میانگین دستمزد، حدود ۲۷٬۱۳۲ شِکِل در ماه',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 325584, currency: 'ILS' },
        note: {
          en: 'Calculated, not published by PIBA: 2 × ILS 13,566 (National Insurance average wage, 1 Jan 2026) = ILS 27,132 a month; the test uses 12 × that, ILS 325,584 a year. The commissioner may set a higher wage for some sectors.',
          fa: 'این رقم محاسبه‌شده است و اداره‌ی جمعیت و مهاجرت آن را منتشر نکرده: دو برابر ۱۳٬۵۶۶ شِکِل (میانگین دستمزد بیمه‌ی ملی در ۱ ژانویه‌ی ۲۰۲۶) برابر ۲۷٬۱۳۲ شِکِل در ماه است؛ آزمون از ۱۲ برابر آن، یعنی ۳۲۵٬۵۸۴ شِکِل در سال، استفاده می‌کند. ممکن است برای برخی بخش‌ها دستمزد بالاتری تعیین شود.',
        },
      },
      {
        key: 'authorised-employer',
        label: {
          en: 'A job with an IIA-authorised high-tech company (the employer applies)',
          fa: 'شغل در شرکت فناوری پیشرفته‌ی مورد تأیید سازمان نوآوری (کارفرما درخواست را ثبت می‌کند)',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
        note: {
          en: 'The profile records a job offer, not whether the employer is IIA-authorised.',
          fa: 'نمایه‌ی کاربر فقط پیشنهاد شغلی را ثبت می‌کند، نه تأیید کارفرما از سوی سازمان نوآوری را.',
        },
      },
      {
        key: 'visa-exempt-citizenship',
        label: {
          en: 'Citizenship of a visa-exempt country (fast track)',
          fa: 'تابعیت کشوری که از ویزا معاف است (مسیر سریع)',
        },
        weight: 2,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'salary',
        label: {
          en: 'Monthly gross salary (calculated as 2 × the average wage)',
          fa: 'حقوق ناخالص ماهانه (محاسبه‌شده به‌صورت دو برابر میانگین دستمزد)',
        },
        amount: 27132,
        currency: 'ILS',
        basis: 'month',
        approx: true,
        shows: { en: 'The employment contract', fa: 'قرارداد کار' },
      },
    ],
    processing: {
      text: {
        en: '6–10 business days on the expedited track.',
        fa: '۶ تا ۱۰ روز کاری در مسیر سریع.',
      },
      source: 'https://innovationisrael.org.il/en/programs/visas-for-foreign-high-tech-experts-incentive-program/',
    },
    pr: {
      en: 'No permanent-residence route. Up to 1 year, extendable yearly up to 5 years; the 2016 PIBA procedure gives 63 months in total.',
      fa: 'مسیری به اقامت دائم ندارد. حداکثر یک سال است و هر سال تا پنج سال تمدید می‌شود؛ دستورالعمل ۲۰۱۶ اداره‌ی جمعیت و مهاجرت در مجموع ۶۳ ماه می‌دهد.',
    },
    sources: [
      {
        url: 'https://innovationisrael.org.il/en/programs/visas-for-foreign-high-tech-experts-incentive-program/',
        checked: CHECKED,
        label: 'Israel Innovation Authority, high-tech experts programme (modified 2025-10-21)',
      },
      {
        url: 'https://www.gov.il/BlobFolder/policy/request_for_working_permit_expert_foreign_workers_procedure/en/5.3.0041en.pdf',
        checked: CHECKED,
        label: 'PIBA procedure 5.3.0041 (undated, older)',
      },
      {
        url: 'https://www.btl.gov.il/English%20Homepage/Mediniyut/GeneralInformation/Pages/AverageWage.aspx',
        checked: CHECKED,
        label: 'National Insurance Institute average wage (2026 figure)',
      },
    ],
    verified: false,
    review:
      'Included as entrepreneur because the notes position B/1 as the founder\'s required next step after the Innovation Visa (B/2); it is an employer-sponsored expert visa, so the founder\'s own company would need to be the IIA-authorised employer. Salary figure ILS 27,132 is calculated (2 × ILS 13,566), not published by PIBA, so verified=false. Duration conflict: IIA says up to 5 years; 2016 PIBA procedure says 63 months. Not encoded: fees (not on pages read).',
  },
  {
    key: 'il-student',
    country: 'IL',
    family: 'study',
    name: { en: 'Student visa (A/2)', fa: 'ویزای دانشجویی (A/2)' },
    agency: 'Population and Immigration Authority (PIBA)',
    status: 'open',
    fact: {
      en: 'You need an admission letter from an Israeli higher-education institution or yeshiva, with tuition paid.',
      fa: 'به نامه‌ی پذیرش از یک مؤسسه‌ی آموزش عالی یا یشیوای اسرائیل و پرداخت شهریه نیاز دارید.',
    },
    criteria: [
      {
        key: 'admission',
        label: {
          en: 'Admission letter from an Israeli higher-education institution or yeshiva',
          fa: 'نامه‌ی پذیرش از مؤسسه‌ی آموزش عالی یا یشیوای اسرائیل',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'tuition-paid',
        label: { en: 'Tuition paid', fa: 'پرداخت شهریه' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'not-resident',
        label: { en: 'Not an Israeli resident', fa: 'مقیم اسرائیل نباشد' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'means',
        label: {
          en: 'Proof of means of living (no amount set)',
          fa: 'مدرک تأمین هزینه‌ی زندگی (مبلغی تعیین نشده است)',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'documents',
        label: {
          en: 'Passport valid for the whole visa period, birth certificate, and a grade sheet for each yearly renewal',
          fa: 'گذرنامه‌ی معتبر برای کل مدت ویزا، شناسنامه و کارنامه برای هر تمدید سالانه',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    fees: [
      { label: { en: 'Fee per service', fa: 'هزینه‌ی هر خدمت' }, amount: 195, currency: 'ILS' },
    ],
    pr: {
      en: 'No permanent-residence route. Up to 1 year, renewable yearly.',
      fa: 'مسیری به اقامت دائم ندارد. حداکثر یک سال است و هر سال تمدید می‌شود.',
    },
    sources: [
      {
        url: 'https://www.gov.il/en/service/student_visa_application_type',
        checked: CHECKED,
        label: 'gov.il student visa service (updated 2024-02-13)',
      },
    ],
    verified: true,
    review:
      'Not encoded: living-costs amount (proof of means, no figure); tuition (amount varies, receipt only); processing time (not published). Online payment requires a card belonging to an Israeli citizen or resident.',
  },

  // ───────────────────────────── UAE ─────────────────────────────
  {
    key: 'ae-golden-investor',
    country: 'AE',
    family: 'entrepreneur',
    name: { en: 'Golden Visa: Investor', fa: 'ویزای طلایی: سرمایه‌گذار' },
    agency:
      'Federal Authority for Identity, Citizenship, Customs & Port Security (ICP); in Dubai, GDRFA Dubai (GDRFAD)',
    status: 'open',
    fact: {
      en: 'AED 2 million placed in one qualifying asset (bank deposit or fund, company capital, or property) is enough on its own.',
      fa: 'قرار دادن ۲ میلیون درهم در یکی از دارایی‌های واجد شرایط (سپرده‌ی بانکی یا صندوق، سرمایه‌ی شرکت یا ملک) به‌تنهایی کافی است.',
    },
    criteria: [
      {
        key: 'qualifying-investment',
        label: {
          en: 'At least AED 2,000,000 in one qualifying asset: a UAE bank deposit or investment fund, company capital or a partner\'s share, real estate, or a business paying at least AED 250,000 a year in federal tax',
          fa: 'دست‌کم ۲٬۰۰۰٬۰۰۰ درهم در یکی از دارایی‌های واجد شرایط: سپرده‌ی بانکی یا صندوق سرمایه‌گذاری در امارات، سرمایه‌ی شرکت یا سهم شریک، ملک، یا کسب‌وکاری که سالانه دست‌کم ۲۵۰٬۰۰۰ درهم مالیات فدرال می‌پردازد',
        },
        weight: 3,
        scoreable: true,
        openEnded: true,
        anyOf: [
          { field: 'liquid', op: 'gte', value: 2000000, currency: 'AED' },
          { field: 'investment', op: 'gte', value: 2000000, currency: 'AED' },
        ],
        note: {
          en: 'Any one option is enough. Scored on the deposit (cash and investments) and company-capital options only. Real estate (including bank-financed or off-plan from an approved developer) and the AED 250,000 federal-tax option also qualify but cannot be tested from the profile.',
          fa: 'یکی از گزینه‌ها کافی است. امتیاز فقط بر پایه‌ی گزینه‌های سپرده (پول نقد و سرمایه‌گذاری) و سرمایه‌ی شرکت محاسبه می‌شود. ملک (از جمله ملک با وام بانکی یا پیش‌فروش از سازنده‌ی تأییدشده) و گزینه‌ی مالیات فدرال ۲۵۰٬۰۰۰ درهمی نیز پذیرفته می‌شوند، اما از روی نمایه‌ی کاربر قابل‌سنجش نیستند.',
        },
      },
      {
        key: 'own-capital',
        label: {
          en: 'The capital is fully owned and not borrowed (ICP)',
          fa: 'سرمایه کاملاً متعلق به متقاضی است و قرضی نیست (ICP)',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'deposit-frozen',
        label: {
          en: 'A deposit is frozen for at least 2 years and cannot be withdrawn during the 10 years (GDRFAD)',
          fa: 'سپرده دست‌کم دو سال مسدود می‌ماند و در طول ده سال قابل برداشت نیست (GDRFAD)',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'lien-documents',
        label: {
          en: 'A lien registered on the property; an audited financial report and trade licence for a company; health insurance',
          fa: 'ثبت حق رهن روی ملک؛ گزارش مالی حسابرسی‌شده و مجوز تجاری برای شرکت؛ بیمه‌ی درمانی',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'qualifying-asset',
        label: {
          en: 'Deposit, company capital or property',
          fa: 'سپرده، سرمایه‌ی شرکت یا ملک',
        },
        amount: 2000000,
        currency: 'AED',
        basis: 'once',
        shows: {
          en: 'Bank letter, company audit, or Dubai Land Department title',
          fa: 'نامه‌ی بانک، حسابرسی شرکت یا سند اداره‌ی املاک دبی',
        },
      },
      {
        key: 'federal-tax',
        label: { en: 'Federal tax paid by the business', fa: 'مالیات فدرال پرداختی کسب‌وکار' },
        amount: 250000,
        currency: 'AED',
        basis: 'perYear',
        shows: { en: 'A letter from the Federal Tax Authority', fa: 'نامه‌ی سازمان مالیات فدرال' },
      },
    ],
    processing: {
      text: { en: '5 days.', fa: '۵ روز.' },
      source: 'https://www.gdrfad.gov.ae/en/services/8ea80da4-f43e-11eb-0320-0050569629e8',
    },
    fees: [
      { label: { en: 'Permit', fa: 'صدور مجوز' }, amount: 1100, currency: 'AED' },
      { label: { en: 'Knowledge Dirham', fa: 'درهم دانش' }, amount: 10, currency: 'AED' },
      { label: { en: 'Innovation Dirham', fa: 'درهم نوآوری' }, amount: 10, currency: 'AED' },
      { label: { en: 'In-country application', fa: 'درخواست از داخل کشور' }, amount: 500, currency: 'AED' },
      { label: { en: 'Delivery', fa: 'ارسال' }, amount: 20, currency: 'AED' },
      {
        label: { en: 'Each year the residence runs beyond 2 years', fa: 'به‌ازای هر سال اقامت بیش از دو سال' },
        amount: 100,
        currency: 'AED',
      },
    ],
    pr: {
      en: 'No permanent residence exists. A 10-year residence, renewable while the conditions are met, with no sponsor needed; citizenship is by nomination only.',
      fa: 'اقامت دائم وجود ندارد. اقامت ده‌ساله که تا زمانی که شرایط برقرار است تمدید می‌شود و به اسپانسر نیاز ندارد؛ تابعیت فقط از راه نامزدی داده می‌شود.',
    },
    sources: [
      {
        url: 'https://icp.gov.ae/en/services/uae-golden-residency/',
        checked: CHECKED,
        label: 'ICP Golden Residency (body "last updated September 10, 2026")',
      },
      {
        url: 'https://www.gdrfad.gov.ae/en/services/8ea80da4-f43e-11eb-0320-0050569629e8',
        checked: CHECKED,
        label: 'GDRFAD Golden Residence, investors (footer date only)',
      },
      {
        url: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa',
        checked: CHECKED,
        label: 'u.ae Golden Visa (updated 2026-07-28)',
      },
    ],
    verified: true,
    review:
      'TERM CONFLICT (5 vs 10 years): ICP and GDRFAD say 10 years; u.ae says 5 years for real-estate investors. Encoded as 10 (two of three official sources agree); re-check u.ae. The four investor options are one anyOf criterion; only deposit (liquid) and company capital (investment) are testable, real estate and federal tax are listed in the note but not scored, so a property- or tax-route investor will score low. Site footers on icp.gov.ae and gdrfad.gov.ae show today\'s date, not a page date.',
  },
  {
    key: 'ae-golden-entrepreneur',
    country: 'AE',
    family: 'startup',
    name: { en: 'Golden Visa: Entrepreneur', fa: 'ویزای طلایی: کارآفرین' },
    agency:
      'ICP or GDRFA Dubai; in Dubai, nomination by Dubai Future Foundation (DFF) is required',
    status: 'open',
    fact: {
      en: 'The two main ways in are an endorsement from an accredited incubator or authority, or AED 1 million in yearly revenue, and official sources disagree on whether the endorsement alone is enough.',
      fa: 'دو راه اصلی، تأیید یک انکوباتور معتبر یا نهاد دولتی، یا درآمد سالانه‌ی ۱ میلیون درهم است، و منابع رسمی درباره‌ی کافی‌بودن تأیید به‌تنهایی اختلاف دارند.',
    },
    criteria: [
      {
        key: 'entrepreneur-route',
        label: {
          en: 'One of: a UAE-registered SME in an approved field with annual revenue of at least AED 1,000,000; a business idea approved by an accredited incubator, the Ministry of Economy or a local authority; or previously founded and sold business(es) worth at least AED 7,000,000 in total',
          fa: 'یکی از این موارد: شرکت کوچک یا متوسط ثبت‌شده در امارات در حوزه‌ی تأییدشده با درآمد سالانه‌ی دست‌کم ۱٬۰۰۰٬۰۰۰ درهم؛ تأیید ایده‌ی کسب‌وکار از سوی انکوباتور معتبر، وزارت اقتصاد یا نهاد محلی؛ یا تأسیس و فروش کسب‌وکار(های) پیشین به ارزش مجموع دست‌کم ۷٬۰۰۰٬۰۰۰ درهم',
        },
        weight: 3,
        scoreable: true,
        openEnded: true,
        anyOf: [
          { field: 'revenue', op: 'gte', value: 1000000, currency: 'AED' },
          { field: 'endorsement', op: 'true' },
        ],
        note: {
          en: 'Any one option is enough. The sold-business option (AED 7,000,000 in total) also qualifies but cannot be tested from the profile, so it is not scored. Sources conflict on the incubator option: ICP treats it as standalone with no revenue needed; GDRFAD requires AED 2,000,000 of income for the incubator or Ministry of Economy project.',
          fa: 'یکی از گزینه‌ها کافی است. گزینه‌ی فروش کسب‌وکار پیشین (مجموع ۷٬۰۰۰٬۰۰۰ درهم) نیز پذیرفته می‌شود، اما از روی نمایه‌ی کاربر قابل‌سنجش نیست و امتیازدهی نمی‌شود. منابع درباره‌ی گزینه‌ی انکوباتور با هم تعارض دارند: ICP آن را مسیری مستقل و بدون شرط درآمد می‌داند، اما GDRFAD برای طرح مورد تأیید انکوباتور یا وزارت اقتصاد درآمد ۲٬۰۰۰٬۰۰۰ درهمی می‌خواهد.',
        },
      },
      {
        key: 'innovative',
        label: { en: 'The project is innovative or technical (u.ae)', fa: 'طرح نوآورانه یا فنی باشد (u.ae)' },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'dff-nomination',
        label: {
          en: 'In Dubai, nomination by Dubai Future Foundation; nomination is not final approval and GDRFA reviews last',
          fa: 'در دبی، نامزدی از سوی بنیاد آینده‌ی دبی؛ نامزدی به معنای تأیید نهایی نیست و بررسی پایانی با GDRFA است',
        },
        weight: 2,
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
        key: 'sme-revenue',
        label: { en: 'Annual SME revenue', fa: 'درآمد سالانه‌ی شرکت' },
        amount: 1000000,
        currency: 'AED',
        basis: 'perYear',
        shows: { en: 'Audited accounts', fa: 'صورت‌های مالی حسابرسی‌شده' },
      },
      {
        key: 'incubator-income',
        label: {
          en: 'Annual income on the incubator route (GDRFAD only; ICP sets none)',
          fa: 'درآمد سالانه در مسیر انکوباتور (فقط GDRFAD؛ ICP شرطی ندارد)',
        },
        amount: 2000000,
        currency: 'AED',
        basis: 'perYear',
        shows: { en: 'Audited accounts', fa: 'صورت‌های مالی حسابرسی‌شده' },
      },
      {
        key: 'prior-exit',
        label: { en: 'Prior exit value', fa: 'ارزش فروش کسب‌وکار پیشین' },
        amount: 7000000,
        currency: 'AED',
        basis: 'once',
        shows: { en: 'Sale documents', fa: 'اسناد فروش' },
      },
    ],
    processing: {
      text: { en: '5 days.', fa: '۵ روز.' },
      source: 'https://www.gdrfad.gov.ae/en/services/8ea80da7-f43e-11eb-0320-0050569629e8',
    },
    fees: [
      { label: { en: 'Permit', fa: 'صدور مجوز' }, amount: 1100, currency: 'AED' },
      { label: { en: 'Knowledge Dirham', fa: 'درهم دانش' }, amount: 10, currency: 'AED' },
      { label: { en: 'Innovation Dirham', fa: 'درهم نوآوری' }, amount: 10, currency: 'AED' },
      { label: { en: 'In-country application', fa: 'درخواست از داخل کشور' }, amount: 500, currency: 'AED' },
      { label: { en: 'Delivery', fa: 'ارسال' }, amount: 20, currency: 'AED' },
    ],
    pr: {
      en: 'No permanent residence. A 10-year renewable residence (u.ae says 5 years for entrepreneurs).',
      fa: 'اقامت دائم وجود ندارد. اقامت ده‌ساله‌ی قابل تمدید (u.ae برای کارآفرینان پنج سال ذکر کرده است).',
    },
    sources: [
      {
        url: 'https://icp.gov.ae/en/services/uae-golden-residency/',
        checked: CHECKED,
        label: 'ICP Golden Residency (body dated 2026-09-10)',
      },
      {
        url: 'https://www.gdrfad.gov.ae/en/services/8ea80da7-f43e-11eb-0320-0050569629e8',
        checked: CHECKED,
        label: 'GDRFAD Golden Residence, entrepreneurs (footer date only)',
      },
    ],
    verified: false,
    review:
      'CONFLICT, unresolved: incubator route. ICP = standalone, no revenue; GDRFAD = AED 2,000,000 income required. The 2018 decree AED 500,000 project value is outdated and on no current page; do not use it. TERM CONFLICT: ICP and GDRFAD say 10 years, u.ae says 5 for entrepreneurs; encoded as 10. Options are one anyOf criterion (revenue OR endorsement); the AED 7M sold-business option is not testable and is only in the note, so a founder qualifying that way will score low. Family = startup because this is the official UAE startup route. Abu Dhabi startup programmes (Hub71, ADIO) not checked: no page on allowed domains. u.ae is cited in the text but not in the notes\' source table for this route, so it is not listed as a source here.',
  },
  {
    key: 'ae-golden-talent',
    country: 'AE',
    family: 'talent',
    name: {
      en: 'Golden Visa: Specialists and Outstanding Talent',
      fa: 'ویزای طلایی: متخصصان و استعدادهای برجسته',
    },
    agency: 'ICP or GDRFA Dubai',
    status: 'open',
    fact: {
      en: 'You need a recommendation from a ministry or authority, or, as a specialist, a UAE job paying AED 30,000 a month at MOHRE level 1 or 2.',
      fa: 'به توصیه‌نامه‌ی یک وزارتخانه یا نهاد دولتی نیاز دارید، یا در گروه متخصصان، به شغلی در امارات با حقوق ماهانه‌ی ۳۰٬۰۰۰ درهم در سطح ۱ یا ۲ وزارت منابع انسانی (MOHRE).',
    },
    criteria: [
      {
        key: 'degree',
        label: {
          en: "Specialised professional: at least a bachelor's degree",
          fa: 'متخصص حرفه‌ای: دست‌کم مدرک کارشناسی',
        },
        weight: 2,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
      },
      {
        key: 'salary',
        label: {
          en: 'Specialised professional: salary of at least AED 30,000 a month',
          fa: 'متخصص حرفه‌ای: حقوق دست‌کم ۳۰٬۰۰۰ درهم در ماه',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 360000, currency: 'AED' },
        note: {
          en: 'The test uses 12 × AED 30,000 = AED 360,000 a year. A foreign-currency equivalent is accepted.',
          fa: 'آزمون از ۱۲ برابر ۳۰٬۰۰۰ درهم، یعنی ۳۶۰٬۰۰۰ درهم در سال، استفاده می‌کند. معادل آن به ارز خارجی نیز پذیرفته می‌شود.',
        },
      },
      {
        key: 'mohre-level',
        label: {
          en: 'Specialised professional: MOHRE occupational level 1 or 2',
          fa: 'متخصص حرفه‌ای: سطح شغلی ۱ یا ۲ وزارت منابع انسانی',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'uae-contract',
        label: {
          en: 'Specialised professional: a valid UAE work permit and employment contract',
          fa: 'متخصص حرفه‌ای: اجازه‌ی کار معتبر و قرارداد کار در امارات',
        },
        weight: 2,
        scoreable: true,
        test: { field: 'jobOffer', op: 'true' },
        note: {
          en: 'The profile records a job offer, not a UAE work permit already issued.',
          fa: 'نمایه‌ی کاربر پیشنهاد شغلی را ثبت می‌کند، نه اجازه‌ی کار صادرشده در امارات را.',
        },
      },
      {
        key: 'culture-experience',
        label: {
          en: 'Culture and arts: at least 5 years of professional experience',
          fa: 'فرهنگ و هنر: دست‌کم پنج سال تجربه‌ی حرفه‌ای',
        },
        weight: 1,
        scoreable: true,
        test: { field: 'workYears', op: 'gte', value: 5 },
      },
      {
        key: 'recommendation',
        label: {
          en: 'Recommendation from the Emirates Scientists Council, a ministry or a local authority',
          fa: 'توصیه‌نامه از شورای دانشمندان امارات، یک وزارتخانه یا نهاد محلی',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'awards-sport',
        label: {
          en: 'Awards and nominations, or leadership in a sports federation',
          fa: 'جوایز و نامزدی‌ها، یا جایگاه رهبری در یک فدراسیون ورزشی',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'innovators-digital',
        label: {
          en: 'Innovators and digital talent: categories listed, no criteria published',
          fa: 'نوآوران و استعدادهای دیجیتال: این گروه‌ها فهرست شده‌اند اما معیاری منتشر نشده است',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'salary',
        label: {
          en: 'Monthly salary, or the foreign-currency equivalent',
          fa: 'حقوق ماهانه، یا معادل آن به ارز خارجی',
        },
        amount: 30000,
        currency: 'AED',
        basis: 'month',
        shows: { en: 'The employment contract', fa: 'قرارداد کار' },
      },
    ],
    processing: {
      text: {
        en: '5 days, taken from comparable GDRFAD golden services; not published separately.',
        fa: '۵ روز، بر پایه‌ی خدمات مشابه ویزای طلایی GDRFAD؛ به‌طور جداگانه منتشر نشده است.',
      },
      source: 'https://www.gdrfad.gov.ae/en/services/2e7da546-f815-11eb-0320-0050569629e8',
    },
    fees: [
      { label: { en: 'Permit', fa: 'صدور مجوز' }, amount: 1100, currency: 'AED' },
      { label: { en: 'Knowledge Dirham', fa: 'درهم دانش' }, amount: 10, currency: 'AED' },
      { label: { en: 'Innovation Dirham', fa: 'درهم نوآوری' }, amount: 10, currency: 'AED' },
    ],
    pr: {
      en: 'No permanent residence. A 10-year renewable residence.',
      fa: 'اقامت دائم وجود ندارد. اقامت ده‌ساله‌ی قابل تمدید.',
    },
    sources: [
      {
        url: 'https://icp.gov.ae/en/services/uae-golden-residency/',
        checked: CHECKED,
        label: 'ICP Golden Residency (body dated 2026-09-10)',
      },
      {
        url: 'https://www.gdrfad.gov.ae/en/services/2e7da546-f815-11eb-0320-0050569629e8',
        checked: CHECKED,
        label: 'GDRFAD Golden Residence, talents (footer date only; not read in full)',
      },
    ],
    verified: true,
    review:
      'GDRFAD page not read in full. Processing time (5 days) is inferred from comparable GDRFAD golden services, not published for this category. Degree, salary, MOHRE level and contract apply to the specialist category only; 5-year experience applies to culture and arts only; the app should not combine categories into one score. TERM: encoded as 10 years per ICP/GDRFAD (u.ae lists 5 years for some Golden categories).',
  },
  {
    key: 'ae-green-freelancer',
    country: 'AE',
    family: 'entrepreneur',
    name: {
      en: 'Green Visa: Freelancer / Self-employed',
      fa: 'ویزای سبز: فریلنسر / خوداشتغال',
    },
    agency: 'ICP or GDRFA Dubai; a MOHRE freelance or self-employment permit is a prerequisite',
    status: 'open',
    fact: {
      en: 'You need AED 360,000 of freelance income and a degree; whether that income is per year or over two years combined is unclear.',
      fa: 'به ۳۶۰٬۰۰۰ درهم درآمد فریلنسری و مدرک دانشگاهی نیاز دارید؛ روشن نیست این درآمد سالانه است یا مجموع دو سال.',
    },
    criteria: [
      {
        key: 'education',
        label: {
          en: "At least a bachelor's degree or a specialised diploma",
          fa: 'دست‌کم مدرک کارشناسی یا دیپلم تخصصی',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'degree', op: 'in', value: ['bachelor', 'master', 'phd'] },
        note: {
          en: 'A specialised diploma also qualifies; the profile cannot record it, so holders should check the official page.',
          fa: 'دیپلم تخصصی نیز پذیرفته می‌شود؛ نمایه‌ی کاربر آن را ثبت نمی‌کند، پس دارندگان آن باید صفحه‌ی رسمی را بررسی کنند.',
        },
      },
      {
        key: 'income',
        label: {
          en: 'Freelance income of at least AED 360,000 over the previous 2 years',
          fa: 'درآمد فریلنسری دست‌کم ۳۶۰٬۰۰۰ درهم در دو سال گذشته',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'income', op: 'gte', value: 360000, currency: 'AED' },
        note: {
          en: 'Ambiguous: ICP says the annual income during the previous two years must be at least AED 360,000, without saying whether that is each year or both combined. The test uses the stricter, per-year reading. GDRFAD also accepts financial solvency throughout the stay instead.',
          fa: 'مبهم است: ICP می‌گوید درآمد سالانه در دو سال گذشته باید دست‌کم ۳۶۰٬۰۰۰ درهم باشد، اما روشن نمی‌کند هر سال یا مجموع دو سال. آزمون برداشت سخت‌گیرانه‌تر، یعنی هر سال، را به کار می‌برد. GDRFAD توانایی مالی در طول اقامت را نیز به‌جای آن می‌پذیرد.',
        },
      },
      {
        key: 'mohre-permit',
        label: {
          en: 'A MOHRE freelance or self-employment permit',
          fa: 'مجوز فریلنسری یا خوداشتغالی وزارت منابع انسانی (MOHRE)',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'solvency',
        label: {
          en: 'Financial solvency throughout the stay, as an alternative to the income test (GDRFAD)',
          fa: 'توانایی مالی در طول اقامت، به‌عنوان جایگزین شرط درآمد (GDRFAD)',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'passport',
        label: {
          en: 'A passport valid for at least 6 months',
          fa: 'گذرنامه با دست‌کم شش ماه اعتبار',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [
      {
        key: 'income',
        label: {
          en: 'Freelance income over the past 2 years (per year or in total: unclear)',
          fa: 'درآمد فریلنسری در دو سال گذشته (سالانه یا مجموع: نامشخص)',
        },
        amount: 360000,
        currency: 'AED',
        basis: 'perYear',
        shows: { en: 'Income statements', fa: 'صورت‌حساب‌های درآمد' },
      },
    ],
    processing: {
      text: { en: '48 hours.', fa: '۴۸ ساعت.' },
      source: 'https://gdrfad.gov.ae/en/services/f52024d1-b812-11ed-5210-4cd98f768936',
    },
    fees: [
      { label: { en: 'Permit', fa: 'صدور مجوز' }, amount: 200, currency: 'AED' },
      { label: { en: 'Knowledge Dirham', fa: 'درهم دانش' }, amount: 10, currency: 'AED' },
      { label: { en: 'Innovation Dirham', fa: 'درهم نوآوری' }, amount: 10, currency: 'AED' },
      { label: { en: 'In-country application', fa: 'درخواست از داخل کشور' }, amount: 500, currency: 'AED' },
      { label: { en: 'Delivery', fa: 'ارسال' }, amount: 20, currency: 'AED' },
      {
        label: { en: 'Each year beyond 2 years', fa: 'به‌ازای هر سال بیش از دو سال' },
        amount: 100,
        currency: 'AED',
      },
      {
        label: { en: 'Entry visa (plus 5% VAT)', fa: 'ویزای ورود (به‌علاوه‌ی ۵ درصد مالیات بر ارزش افزوده)' },
        amount: 200,
        currency: 'AED',
      },
    ],
    pr: {
      en: 'No permanent residence. A 5-year renewable residence that allows family sponsorship.',
      fa: 'اقامت دائم وجود ندارد. اقامت پنج‌ساله‌ی قابل تمدید با امکان اسپانسری خانواده.',
    },
    sources: [
      {
        url: 'https://icp.gov.ae/en/services/uae-green-residency/',
        checked: CHECKED,
        label: 'ICP Green Residency (body dated 2026-09-12)',
      },
      {
        url: 'https://gdrfad.gov.ae/en/services/f52024d1-b812-11ed-5210-4cd98f768936',
        checked: CHECKED,
        label: 'GDRFAD Green Residence, freelancers (footer date only)',
      },
    ],
    verified: false,
    review:
      'AMBIGUOUS, unresolved: AED 360,000 income. ICP: "the annual income ... during the previous two years must not be less than AED 360,000" — each year or both years combined is unclear (combined would mean AED 180,000 a year). Encoded per year (stricter); money basis set to year. GDRFAD also accepts financial solvency for the stay as an alternative. Specialised diploma is not a profile degree value.',
  },
  {
    key: 'ae-student',
    country: 'AE',
    family: 'study',
    name: {
      en: 'Study: Golden Visa for outstanding students, and the standard student residence',
      fa: 'تحصیل: ویزای طلایی دانشجویان برجسته و اقامت تحصیلی عادی',
    },
    agency: 'ICP or GDRFA Dubai; for the standard permit, GDRFAD with the institution as sponsor',
    status: 'open',
    fact: {
      en: 'The Golden route needs 95% at school, or a GPA of at least 3.5 from a top-100 or UAE Category A university, within 2 years of graduating; the standard permit needs enrolment at an accredited institution.',
      fa: 'مسیر طلایی به نمره‌ی ۹۵ درصد در دبیرستان، یا معدل دست‌کم ۳٫۵ از دانشگاهی در میان ۱۰۰ دانشگاه برتر جهان یا دانشگاه رده‌ی A امارات، در دو سال پس از دانش‌آموختگی نیاز دارد؛ اقامت تحصیلی عادی به ثبت‌نام در مؤسسه‌ی معتبر نیاز دارد.',
    },
    criteria: [
      {
        key: 'enrolment',
        label: {
          en: 'Standard permit: enrolment at an accredited UAE institution, which acts as sponsor',
          fa: 'اقامت عادی: ثبت‌نام در مؤسسه‌ی معتبر امارات که اسپانسر متقاضی می‌شود',
        },
        weight: 3,
        scoreable: true,
        test: { field: 'admission', op: 'true' },
      },
      {
        key: 'grade-12',
        label: {
          en: 'Golden: Grade 12 result of at least 95% at a UAE-licensed school',
          fa: 'طلایی: نمره‌ی دست‌کم ۹۵ درصد در پایه‌ی دوازدهم در مدرسه‌ی دارای مجوز امارات',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'top-100',
        label: {
          en: 'Golden: graduate of an international university ranked in the world top 100, with a GPA of at least 3.5 out of 4.0',
          fa: 'طلایی: دانش‌آموخته‌ی دانشگاهی بین‌المللی در میان ۱۰۰ دانشگاه برتر جهان، با معدل دست‌کم ۳٫۵ از ۴',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'uae-gpa',
        label: {
          en: 'Golden: GPA from a UAE university of at least 3.5 (Category A) or 3.8 (Category B), out of 4.0',
          fa: 'طلایی: معدل دست‌کم ۳٫۵ (رده‌ی A) یا ۳٫۸ (رده‌ی B) از ۴ در دانشگاه امارات',
        },
        weight: 3,
        scoreable: false,
      },
      {
        key: 'since-graduation',
        label: {
          en: 'Golden: no more than 2 years since graduation',
          fa: 'طلایی: حداکثر دو سال از دانش‌آموختگی گذشته باشد',
        },
        weight: 2,
        scoreable: false,
      },
      {
        key: 'attestation',
        label: {
          en: 'Golden: Ministry of Education attestation, approval through ICP, and (in Dubai) a Dubai residence file',
          fa: 'طلایی: تصدیق وزارت آموزش، تأیید از طریق ICP و (در دبی) پرونده‌ی اقامت دبی',
        },
        weight: 1,
        scoreable: false,
      },
      {
        key: 'family-sponsorship',
        label: {
          en: 'Golden: a high-school holder may sponsor parents only; a graduate needs a job, income and housing to sponsor a spouse or children',
          fa: 'طلایی: دارنده‌ی ویزا در مقطع دبیرستان فقط می‌تواند والدین را اسپانسر کند؛ دانش‌آموخته برای اسپانسری همسر یا فرزندان به شغل، درآمد و مسکن نیاز دارد',
        },
        weight: 1,
        scoreable: false,
      },
    ],
    money: [],
    processing: {
      text: {
        en: 'Golden: 5 days. Standard student permit: 48 hours.',
        fa: 'طلایی: ۵ روز. اقامت تحصیلی عادی: ۴۸ ساعت.',
      },
      source: 'https://www.gdrfad.gov.ae/en/services/f52024e0-b812-11ed-5210-4cd98f768936',
    },
    fees: [
      { label: { en: 'Golden: permit', fa: 'طلایی: صدور مجوز' }, amount: 1100, currency: 'AED' },
      { label: { en: 'Standard: permit', fa: 'عادی: صدور مجوز' }, amount: 200, currency: 'AED' },
      { label: { en: 'Knowledge Dirham (both)', fa: 'درهم دانش (هر دو)' }, amount: 10, currency: 'AED' },
      { label: { en: 'Innovation Dirham (both)', fa: 'درهم نوآوری (هر دو)' }, amount: 10, currency: 'AED' },
      {
        label: { en: 'In-country application (both)', fa: 'درخواست از داخل کشور (هر دو)' },
        amount: 500,
        currency: 'AED',
      },
      { label: { en: 'Delivery (both)', fa: 'ارسال (هر دو)' }, amount: 20, currency: 'AED' },
    ],
    pr: {
      en: 'No permanent residence. Golden: 10-year residence (u.ae says 5 years for school achievers); GDRFAD says student golden permits are not renewed after they expire.',
      fa: 'اقامت دائم وجود ندارد. طلایی: اقامت ده‌ساله (u.ae برای دانش‌آموزان ممتاز پنج سال ذکر کرده است)؛ به گفته‌ی GDRFAD، ویزای طلایی دانشجویی پس از پایان اعتبار تمدید نمی‌شود.',
    },
    sources: [
      {
        url: 'https://icp.gov.ae/en/services/uae-golden-residency/',
        checked: CHECKED,
        label: 'ICP Golden Residency (body dated 2026-09-10)',
      },
      {
        url: 'https://www.gdrfad.gov.ae/en/services/8ea80dad-f43e-11eb-0320-0050569629e8',
        checked: CHECKED,
        label: 'GDRFAD Golden Residence, students (footer date only)',
      },
      {
        url: 'https://www.gdrfad.gov.ae/en/services/f52024e0-b812-11ed-5210-4cd98f768936',
        checked: CHECKED,
        label: 'GDRFAD student residence permit (footer date only)',
      },
      {
        url: 'https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa',
        checked: CHECKED,
        label: 'u.ae Golden Visa (updated 2026-07-28)',
      },
    ],
    verified: true,
    review:
      'TERM CONFLICT (5 vs 10 years): ICP and GDRFAD say 10; u.ae says 5 for high-school achievers; encoded as 10. Golden criteria (school %, rank, GPA, years since graduation) are unscoreable: the profile has no grade, GPA or ranking field. Golden criteria are alternatives. Golden processing (5 days) comes from the GDRFAD golden page; the processing source points to the standard student permit page. Standard student permit has no published funds rule.',
  },
];
