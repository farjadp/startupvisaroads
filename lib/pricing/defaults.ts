// ============================================================================
// lib/pricing/defaults.ts
// The seed of the /pricing page (Farjad's brief, 23 Nov 2026). Rendered until
// the first save in /en/admin/pricing, and loaded into the admin form then.
//
// Prices: Farjad, 23 Nov 2026 — fixed VisaRoads fees (not "starting from"),
// our fee only, Canada published without waiting for a lawyer's review.
//
// Rules this file keeps:
//   - Every include, milestone label and duration Farjad has not decided is
//     TBD; a price line without an amount is null. TBD text never reaches a
//     production page (lib/pricing/resolve.ts drops it).
//   - Text drafted from the brief's suggestions but not yet approved carries
//     a trailing TBD marker: it shows in dev and in admin, not in production,
//     until Farjad deletes the marker.
//   - No "guarantee", no "immigration consulting": business mentoring, team
//     preparation, market research, business plan.
//   - Canada: never "Canada SUV" or "BC PNP package"; milestones tied to
//     business deliverables only; the lawyer line stays (lib/pricing/chrome.ts).
// ============================================================================
import { TBD, type PricingDoc } from './types';

export const READINESS_URL = 'https://readiness.visaroads.com';

const draft = (s: string) => `${s} ${TBD}`;

const EU_EXCLUDES_EN = ['Government fees (application and residence permit)', 'Lawyer’s fees', 'Translation and legalisation of documents', 'Company registration'];
const EU_EXCLUDES_FA = ['هزینه‌های دولتی (درخواست و اجازه‌ی اقامت)', 'هزینه‌ی وکیل', 'ترجمه و تأیید مدارک', 'ثبت شرکت'];
const CA_EXCLUDES_EN = ['The licensed lawyer’s fee and all immigration work', 'Government fees', 'Translation of documents', 'Company registration'];
const CA_EXCLUDES_FA = ['هزینه‌ی وکیل دارای مجوز و همه‌ی کار مهاجرتی پرونده', 'هزینه‌های دولتی', 'ترجمه‌ی مدارک', 'ثبت شرکت'];

export const DEFAULT_PRICING: PricingDoc = {
  version: 1,
  groups: [
    {
      key: 'eu-nordic',
      status: 'active',
      currency: 'EUR',
      prices: [
        { label: { en: 'Per family', fa: 'هر خانواده' }, amount: 20000 },
        { label: { en: 'Two families applying together', fa: 'دو خانواده هم‌زمان' }, amount: 30000 },
        { label: { en: 'Full team (three families)', fa: 'تیم کامل (سه خانواده)' }, amount: 40000 },
      ],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/finland.webp',
      title: { en: 'Finland, Denmark and the Netherlands', fa: 'فنلاند، دانمارک و هلند' },
      summary: {
        en: 'Team preparation, market research and a business plan built for the body that assesses your startup in each country.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلنی که برای نهاد ارزیاب استارتاپ در هر کشور ساخته می‌شود.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: EU_EXCLUDES_EN, fa: EU_EXCLUDES_FA },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Helsinki Cathedral under a clear sky', fa: 'کلیسای جامع هلسینکی زیر آسمان صاف' },
    },
    {
      key: 'eu-spain-italy',
      status: 'active',
      currency: 'EUR',
      prices: [{ label: { en: 'Our fee', fa: 'هزینه‌ی ما' }, amount: 15000 }],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/spain.webp',
      title: { en: 'Spain and Italy', fa: 'اسپانیا و ایتالیا' },
      summary: {
        en: 'Team preparation, market research and a business plan built for the body that assesses your startup in each country.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلنی که برای نهاد ارزیاب استارتاپ در هر کشور ساخته می‌شود.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: EU_EXCLUDES_EN, fa: EU_EXCLUDES_FA },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Gran Vía and the Metropolis Building in Madrid', fa: 'خیابان گران‌ویا و ساختمان متروپلیس در مادرید' },
    },
    {
      key: 'eu-belgium-bulgaria',
      status: 'active',
      currency: 'EUR',
      prices: [{ label: { en: 'Our fee', fa: 'هزینه‌ی ما' }, amount: 12000 }],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/belgium.webp',
      title: { en: 'Belgium and Bulgaria', fa: 'بلژیک و بلغارستان' },
      summary: {
        en: 'Team preparation, market research and a business plan built for the body that assesses your startup in each country.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلنی که برای نهاد ارزیاب استارتاپ در هر کشور ساخته می‌شود.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: EU_EXCLUDES_EN, fa: EU_EXCLUDES_FA },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Antwerp skyline with the Cathedral of Our Lady', fa: 'نمای آنتورپ با کلیسای جامع بانوی ما' },
    },
    {
      key: 'tr-tech-visa',
      status: 'active',
      currency: 'USD',
      prices: [
        { label: { en: 'Per family', fa: 'هر خانواده' }, amount: 8000 },
        { label: { en: 'Full team (up to four families)', fa: 'تیم کامل (حداکثر چهار خانواده)' }, amount: 25000 },
      ],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/turkey.webp',
      title: { en: 'Türkiye Tech Visa', fa: 'تک‌ویزای ترکیه' },
      summary: {
        en: 'Team preparation, market research and a business plan for the Turkish Tech Visa evaluation.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلن برای ارزیابی تک‌ویزای ترکیه.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: EU_EXCLUDES_EN, fa: EU_EXCLUDES_FA },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Istanbul skyline, old and new', fa: 'خط آسمان استانبول، قدیم و جدید' },
    },
    {
      key: 'ca-pnp',
      status: 'active',
      currency: 'CAD',
      prices: [
        { label: { en: 'British Columbia', fa: 'بریتیش کلمبیا' }, amount: 75000 },
        { label: { en: 'Alberta', fa: 'آلبرتا' }, amount: 70000 },
        { label: { en: 'Other provinces', fa: 'سایر استان‌ها' }, amount: 60000 },
      ],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/bc.webp',
      title: { en: 'Business readiness for Canada’s provincial entrepreneur streams', fa: 'آمادگی بیزنسی برای مسیرهای کارآفرینی استانی کانادا' },
      summary: {
        en: 'Business mentoring, market research and a business plan for founders on a provincial entrepreneur stream (PNP). We prepare the business; the immigration file is not ours.',
        fa: 'منتورینگ بیزنس، تحقیق بازار و بیزینس‌پلن برای بنیان‌گذارانی که مسیر کارآفرینی استانی (PNP) را می‌روند. ما بیزنس را آماده می‌کنیم؛ پرونده‌ی مهاجرتی کار ما نیست.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: CA_EXCLUDES_EN, fa: CA_EXCLUDES_FA },
      paymentMilestones: {
        en: [draft('Start of work'), draft('Delivery of the market research'), draft('Delivery of the business plan and documents')],
        fa: [draft('شروع کار'), draft('تحویل تحقیق بازار'), draft('تحویل بیزینس‌پلن و مدارک')],
      },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Vancouver skyline between the water and the mountains', fa: 'خط آسمان ونکوور میان دریا و کوه' },
    },
    {
      key: 'ca-high-impact',
      status: 'active',
      currency: 'CAD',
      prices: [
        { label: { en: 'Per family, first quarter of 2027', fa: 'هر خانواده، سه‌ماهه‌ی اول ۲۰۲۷' }, amount: 88000 },
        { label: { en: 'Per family, from the second quarter of 2027', fa: 'هر خانواده، از سه‌ماهه‌ی دوم ۲۰۲۷' }, amount: 133000 },
      ],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/high-impact.webp',
      title: { en: 'Business readiness for the High Impact Start-up Pilot', fa: 'آمادگی بیزنسی برای پایلوت High Impact Start-up' },
      summary: {
        en: 'Business mentoring, market research and a business plan for founders preparing for Canada’s High Impact Start-up Pilot. We prepare the business; the immigration file is not ours.',
        fa: 'منتورینگ بیزنس، تحقیق بازار و بیزینس‌پلن برای بنیان‌گذارانی که برای پایلوت High Impact Start-up کانادا آماده می‌شوند. ما بیزنس را آماده می‌کنیم؛ پرونده‌ی مهاجرتی کار ما نیست.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: CA_EXCLUDES_EN, fa: CA_EXCLUDES_FA },
      paymentMilestones: {
        en: [draft('Start of work'), draft('Delivery of the market research'), draft('Delivery of the business plan and documents')],
        fa: [draft('شروع کار'), draft('تحویل تحقیق بازار'), draft('تحویل بیزینس‌پلن و مدارک')],
      },
      duration: { en: TBD, fa: TBD },
      note: { en: 'IRCC has announced this pilot but has not opened it yet.', fa: 'IRCC این پایلوت را اعلام کرده ولی هنوز باز نشده است.' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'The Peace Tower on Parliament Hill, Ottawa', fa: 'برج صلح در پارلمان کانادا، اتاوا' },
    },
    {
      key: 'us-founder',
      status: 'active',
      currency: 'USD',
      prices: [{ label: { en: 'Our fee', fa: 'هزینه‌ی ما' }, amount: 55000 }],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '',
      title: { en: 'US founder routes', fa: 'مسیرهای فاندر آمریکا' },
      summary: {
        en: 'Business mentoring, market research and the business case behind a US founder petition. We prepare the business; the petition is not ours.',
        fa: 'منتورینگ بیزنس، تحقیق بازار و پرونده‌ی بیزنسی پشت پتیشن فاندر در آمریکا. ما بیزنس را آماده می‌کنیم؛ پتیشن کار ما نیست.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: {
        en: ['The US immigration attorney’s fee and all legal work', 'USCIS filing fees', 'Translation of documents', 'Company formation'],
        fa: ['هزینه‌ی وکیل مهاجرت آمریکا و همه‌ی کار حقوقی', 'هزینه‌های ثبت USCIS', 'ترجمه‌ی مدارک', 'ثبت شرکت'],
      },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: '', fa: '' },
    },
    {
      key: 'other-routes',
      status: 'soon',
      currency: 'EUR',
      prices: [],
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/estonia.webp',
      title: { en: 'Other routes', fa: 'مسیرهای دیگر' },
      summary: {
        en: 'Prices for other routes are not published yet. Tell us about your team and we will say whether, and how, we can help.',
        fa: 'قیمت مسیرهای دیگر هنوز منتشر نشده است. از تیم‌تان بگویید تا بگوییم می‌توانیم کمک کنیم یا نه، و چطور.',
      },
      includes: { en: [], fa: [] },
      excludes: { en: [], fa: [] },
      paymentMilestones: { en: [], fa: [] },
      duration: { en: '', fa: '' },
      note: { en: '', fa: '' },
      ctaLabel: { en: 'Contact us', fa: 'با ما تماس بگیرید' },
      imageAlt: { en: 'A medieval street in Tallinn’s Old Town', fa: 'کوچه‌ای قرون‌وسطایی در شهر قدیم تالین' },
    },
  ],
  copy: {
    en: {
      hero: {
        eyebrow: 'Pricing',
        title: 'What preparing your team costs, before you call us',
        lede: 'Each route shows our fee, per family and per team. Government fees and third-party costs are listed apart from it, so you can see the whole picture before any call.',
        cta: 'Free readiness assessment',
      },
      cards: {
        title: 'Routes and prices',
        intro: 'Our fee is for business work: team preparation, market research and the business plan. Everything else is billed by someone else and shown separately.',
      },
      comparison: {
        title: 'VisaRoads and a typical consultant',
        intro: 'A fair, general comparison. It names no firm, and many consultants do some of this well.',
        usHeading: 'VisaRoads',
        typicalHeading: 'A typical consultant',
        rows: [
          { label: draft('A team of 3–4 mentors per file'), us: draft('Yes'), typical: draft('Usually one adviser') },
          { label: draft('Market research and choosing the idea or business model'), us: draft('Part of the work'), typical: draft('Usually the client brings the idea') },
          { label: draft('Preparing the team for the interview or business evaluation'), us: draft('Rehearsals with the mentors'), typical: draft('Varies') },
          { label: draft('A business plan and documents built on that country’s criteria'), us: draft('Written for the evaluating body'), typical: draft('Often a general template') },
          { label: draft('Support after arrival'), us: TBD, typical: draft('Varies') },
        ],
      },
      extras: {
        title: 'Costs billed apart from our fee',
        intro: 'These are paid to governments or to other providers, never to VisaRoads. Their amounts are set by them.',
        items: [
          { title: 'Government fees', body: 'Application, residence permit and any other fee set by the government of the country you apply to.' },
          { title: 'Lawyer', body: 'Where a route needs a lawyer, you engage and pay the lawyer directly.' },
          { title: 'Translation and legalisation', body: 'Certified translation of documents and, where required, their legalisation.' },
          { title: 'Company registration', body: 'Registering the company and the local costs that come with it.' },
        ],
      },
      payment: {
        title: 'How payment works',
        intro: 'Nothing is paid on this website. The free readiness assessment comes first; you pay only once we agree the route fits your team.',
        steps: [
          { title: 'Free readiness assessment', body: 'You tell us about your team and your idea. We tell you honestly whether the route fits.' },
          { title: 'Our fee, in stages', body: 'The fee on the route’s card is paid in stages, each tied to a piece of work we deliver.' },
          { title: 'Fees for others stay separate', body: 'Government fees, the lawyer and translators are paid to them directly, at the time they ask for it.' },
        ],
      },
      faq: {
        title: 'Questions about price',
        items: [
          { q: 'Why do you publish your prices?', a: 'So you can decide before any call whether our fee fits your budget. The free readiness assessment then tells you whether the route fits your team, before you pay anything.' },
          { q: 'How do the family and team prices work?', a: 'Where a card shows more than one price, the fee depends on how many families apply together: one family, two families at the same time, or a full team. Each card lists its own tiers.' },
          { q: 'Are government and lawyer fees included?', a: 'No. Our fee covers business work only. Government fees, the lawyer, translation and company registration are paid separately, to them.' },
          { q: 'In Canada, who does the immigration work?', a: 'A licensed lawyer handles the immigration part of the file, and the lawyer’s fee is separate. We prepare the business: mentoring, market research and the business plan.' },
          { q: 'Can you promise the visa will be granted?', a: 'No. The decision belongs to the government and the body that evaluates your business. Nobody can promise it, and you should be wary of anyone who does.' },
          { q: 'What if our team is not ready?', a: 'The assessment will say so. Then we tell you what is missing, and whether working on it first makes sense, before you pay for anything.' },
        ],
      },
      final: {
        title: 'Start with the free readiness assessment',
        body: 'A few questions about your team. You get an honest read on whether the route fits, before you pay anything.',
        cta: 'Free readiness assessment',
        partnerPrompt: 'Are you a business partner?',
        partnerLink: 'The partner page',
      },
    },
    fa: {
      hero: {
        eyebrow: 'قیمت‌ها',
        title: 'هزینه‌ی آماده‌سازی تیم، پیش از هر تماس',
        lede: 'برای هر مسیر هزینه‌ی ما را نوشته‌ایم، برای هر خانواده و برای تیم. هزینه‌های دولتی و هزینه‌ی دیگران جدا آمده تا قبل از هر تماسی تصویر کامل را ببینید.',
        cta: 'ارزیابی آمادگی رایگان',
      },
      cards: {
        title: 'مسیرها و قیمت‌ها',
        intro: 'هزینه‌ی ما برای کار بیزنسی است: آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلن. بقیه‌ی هزینه‌ها را دیگران می‌گیرند و جدا نوشته شده است.',
      },
      comparison: {
        title: 'VisaRoads و یک مشاور معمول',
        intro: 'مقایسه‌ای کلی و منصفانه. اسم هیچ مؤسسه‌ای در آن نیست و بسیاری از مشاوران بخشی از این کارها را خوب انجام می‌دهند.',
        usHeading: 'VisaRoads',
        typicalHeading: 'یک مشاور معمول',
        rows: [
          { label: draft('تیم ۳ تا ۴ منتور برای هر پرونده'), us: draft('بله'), typical: draft('معمولاً یک نفر') },
          { label: draft('تحقیق بازار و انتخاب ایده یا مدل کسب‌وکار'), us: draft('بخشی از کار'), typical: draft('معمولاً ایده با خود متقاضی است') },
          { label: draft('آماده‌سازی تیم برای مصاحبه یا ارزیابی بیزنسی'), us: draft('تمرین با منتورها'), typical: draft('متفاوت') },
          { label: draft('بیزینس‌پلن و مدارک بر اساس معیارهای همان کشور'), us: draft('نوشته‌شده برای نهاد ارزیاب'), typical: draft('اغلب یک قالب کلی') },
          { label: draft('همراهی بعد از رسیدن'), us: TBD, typical: draft('متفاوت') },
        ],
      },
      extras: {
        title: 'هزینه‌هایی که جدا از هزینه‌ی ما پرداخت می‌شود',
        intro: 'این هزینه‌ها به دولت‌ها یا ارائه‌دهندگان دیگر پرداخت می‌شود، نه به VisaRoads. مبلغشان را هم خودشان تعیین می‌کنند.',
        items: [
          { title: 'هزینه‌های دولتی', body: 'هزینه‌ی درخواست، اجازه‌ی اقامت و هر هزینه‌ی دیگری که دولت کشور مقصد تعیین می‌کند.' },
          { title: 'وکیل', body: 'هر جا مسیر به وکیل نیاز داشته باشد، قرارداد و پرداخت مستقیم با خود وکیل است.' },
          { title: 'ترجمه و تأیید مدارک', body: 'ترجمه‌ی رسمی مدارک و، هر جا لازم باشد، تأیید آن‌ها.' },
          { title: 'ثبت شرکت', body: 'ثبت شرکت و هزینه‌های محلی آن.' },
        ],
      },
      payment: {
        title: 'پرداخت چطور انجام می‌شود',
        intro: 'در این سایت هیچ پرداختی انجام نمی‌شود. اول ارزیابی آمادگی رایگان است؛ فقط وقتی پرداخت می‌کنید که هر دو مطمئن باشیم مسیر به تیم شما می‌خورد.',
        steps: [
          { title: 'ارزیابی آمادگی رایگان', body: 'از تیم و ایده‌تان می‌گویید. ما صادقانه می‌گوییم این مسیر به شما می‌خورد یا نه.' },
          { title: 'هزینه‌ی ما، مرحله‌به‌مرحله', body: 'هزینه‌ای که روی کارت هر مسیر آمده در چند مرحله پرداخت می‌شود و هر مرحله به بخشی از کاری که تحویل می‌دهیم بسته است.' },
          { title: 'هزینه‌ی دیگران جداست', body: 'هزینه‌های دولتی، وکیل و مترجم مستقیم به خودشان و هر وقت خودشان بخواهند پرداخت می‌شود.' },
        ],
      },
      faq: {
        title: 'پرسش‌های رایج درباره‌ی قیمت',
        items: [
          { q: 'چرا قیمت‌ها را منتشر می‌کنید؟', a: 'تا پیش از هر تماسی خودتان ببینید هزینه‌ی ما با بودجه‌تان جور است یا نه. بعد ارزیابی آمادگی رایگان، پیش از هر پرداختی، می‌گوید این مسیر به تیم شما می‌خورد یا نه.' },
          { q: 'قیمت خانواده و تیم چطور حساب می‌شود؟', a: 'هر جا روی کارت بیش از یک قیمت آمده، هزینه به تعداد خانواده‌هایی بستگی دارد که با هم اقدام می‌کنند: یک خانواده، دو خانواده‌ی هم‌زمان یا یک تیم کامل. هر کارت پله‌های خودش را دارد.' },
          { q: 'هزینه‌های دولتی و وکیل جزو قیمت است؟', a: 'نه. هزینه‌ی ما فقط برای کار بیزنسی است. هزینه‌های دولتی، وکیل، ترجمه و ثبت شرکت جدا و مستقیم به خودشان پرداخت می‌شود.' },
          { q: 'در کانادا کار مهاجرتی را چه کسی انجام می‌دهد؟', a: 'بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد و هزینه‌ی وکیل جداست. کار ما آماده‌سازی بیزنس است: منتورینگ، تحقیق بازار و بیزینس‌پلن.' },
          { q: 'قبولی ویزا را قول می‌دهید؟', a: 'نه. تصمیم با دولت و نهادی است که کسب‌وکار شما را ارزیابی می‌کند. هیچ‌کس نمی‌تواند قولش را بدهد و به کسی که قولش را می‌دهد شک کنید.' },
          { q: 'اگر تیم ما آماده نباشد چه؟', a: 'ارزیابی همین را نشان می‌دهد. آن وقت می‌گوییم چه چیزی کم است و آیا اول کار روی آن منطقی است، پیش از آنکه بابت چیزی پولی بدهید.' },
        ],
      },
      final: {
        title: 'از ارزیابی آمادگی رایگان شروع کنید',
        body: 'چند سؤال درباره‌ی تیم‌تان. پیش از هر پرداختی، یک ارزیابی صادقانه می‌گیرید که مسیر به شما می‌خورد یا نه.',
        cta: 'ارزیابی آمادگی رایگان',
        partnerPrompt: 'شریک تجاری هستید؟',
        partnerLink: 'صفحه‌ی همکاری',
      },
    },
  },
};
