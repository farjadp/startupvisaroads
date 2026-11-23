// ============================================================================
// lib/pricing/defaults.ts
// The seed of the /pricing page (Farjad's brief, 23 Nov 2026). Rendered until
// the first save in /en/admin/pricing, and loaded into the admin form then.
//
// Rules this file keeps:
//   - Every amount, include, milestone label and duration Farjad has not
//     decided is TBD (or null for a price). TBD text never reaches a
//     production page (lib/pricing/resolve.ts drops it).
//   - Text drafted from the brief's suggestions but not yet approved carries
//     a trailing TBD marker: it shows in dev and in admin, not in production,
//     until Farjad deletes the marker.
//   - No "guarantee", no "immigration consulting": business mentoring, team
//     preparation, market research, business plan.
//   - Canada: never "Canada SUV" or "BC PNP package"; milestones tied to
//     business deliverables only; requiresLegalReview with legalReviewed false.
// ============================================================================
import { TBD, type PricingDoc } from './types';

export const READINESS_URL = 'https://readiness.visaroads.com';

const draft = (s: string) => `${s} ${TBD}`;

export const DEFAULT_PRICING: PricingDoc = {
  version: 1,
  groups: [
    {
      key: 'eu-finland',
      status: 'active',
      startingFrom: null,
      currency: 'EUR',
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/finland.webp',
      title: { en: 'Finland startup permit', fa: 'ویزای استارتاپ فنلاند' },
      summary: {
        en: 'Team preparation, market research and a business plan built for the assessment Business Finland makes of your startup.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلنی که برای ارزیابی Business Finland از استارتاپ شما ساخته می‌شود.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: {
        en: ['Government fees (application and residence permit)', 'Lawyer’s fees', 'Translation and legalisation of documents', 'Company registration'],
        fa: ['هزینه‌های دولتی (درخواست و اجازه‌ی اقامت)', 'هزینه‌ی وکیل', 'ترجمه و تأیید مدارک', 'ثبت شرکت'],
      },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Helsinki Cathedral under a clear sky', fa: 'کلیسای جامع هلسینکی زیر آسمان صاف' },
    },
    {
      key: 'eu-denmark',
      status: 'active',
      startingFrom: null,
      currency: 'EUR',
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/denmark.webp',
      title: { en: 'Startup Denmark', fa: 'استارتاپ دانمارک' },
      summary: {
        en: 'Team preparation, market research and a business plan built for the expert panel that scores Startup Denmark applications.',
        fa: 'آماده‌سازی تیم، تحقیق بازار و بیزینس‌پلنی که برای پنل کارشناسی ارزیاب Startup Denmark ساخته می‌شود.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: {
        en: ['Government fees (application and residence permit)', 'Lawyer’s fees', 'Translation and legalisation of documents', 'Company registration'],
        fa: ['هزینه‌های دولتی (درخواست و اجازه‌ی اقامت)', 'هزینه‌ی وکیل', 'ترجمه و تأیید مدارک', 'ثبت شرکت'],
      },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'Colourful houses along Nyhavn harbour in Copenhagen', fa: 'خانه‌های رنگی کنار بندر نی‌هاون در کپنهاگ' },
    },
    {
      key: 'ca-business-readiness',
      status: 'active',
      startingFrom: null,
      currency: 'CAD',
      requiresLegalReview: true,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/high-impact.webp',
      title: { en: 'Business readiness for Canada’s entrepreneur routes', fa: 'آمادگی بیزنسی برای مسیرهای کارآفرینی کانادا' },
      summary: {
        en: 'Business mentoring, market research and a business plan for founders on Canada’s entrepreneur routes. We prepare the business; the immigration file is not ours.',
        fa: 'منتورینگ بیزنس، تحقیق بازار و بیزینس‌پلن برای بنیان‌گذارانی که مسیرهای کارآفرینی کانادا را می‌روند. ما بیزنس را آماده می‌کنیم؛ پرونده‌ی مهاجرتی کار ما نیست.',
      },
      includes: { en: [TBD], fa: [TBD] },
      excludes: {
        en: ['The licensed lawyer’s fee and all immigration work', 'Government fees', 'Translation of documents', 'Company registration'],
        fa: ['هزینه‌ی وکیل دارای مجوز و همه‌ی کار مهاجرتی پرونده', 'هزینه‌های دولتی', 'ترجمه‌ی مدارک', 'ثبت شرکت'],
      },
      paymentMilestones: {
        en: [draft('Start of work'), draft('Delivery of the market research'), draft('Delivery of the business plan and documents')],
        fa: [draft('شروع کار'), draft('تحویل تحقیق بازار'), draft('تحویل بیزینس‌پلن و مدارک')],
      },
      duration: { en: TBD, fa: TBD },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: 'The Peace Tower on Parliament Hill, Ottawa', fa: 'برج صلح در پارلمان کانادا، اتاوا' },
    },
    {
      key: 'eu-other',
      status: 'soon',
      startingFrom: null,
      currency: 'EUR',
      requiresLegalReview: false,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '/fa/img/netherlands.webp',
      title: { en: 'Netherlands, Estonia, Spain', fa: 'هلند، استونی، اسپانیا' },
      summary: {
        en: 'Prices for these routes are not published yet. Tell us about your team and we will say whether, and how, we can help.',
        fa: 'قیمت این مسیرها هنوز منتشر نشده است. از تیم‌تان بگویید تا بگوییم می‌توانیم کمک کنیم یا نه، و چطور.',
      },
      includes: { en: [], fa: [] },
      excludes: { en: [], fa: [] },
      paymentMilestones: { en: [], fa: [] },
      duration: { en: '', fa: '' },
      ctaLabel: { en: 'Contact us', fa: 'با ما تماس بگیرید' },
      imageAlt: { en: 'Narrow multicoloured canal houses in Amsterdam', fa: 'خانه‌های باریک و رنگی کنار کانال در آمستردام' },
    },
    {
      key: 'us-founder',
      status: 'hidden',
      startingFrom: null,
      currency: 'EUR',
      requiresLegalReview: true,
      legalReviewed: false,
      ctaUrl: READINESS_URL,
      image: '',
      title: { en: 'US founder routes', fa: 'مسیرهای فاندر آمریکا' },
      summary: { en: TBD, fa: TBD },
      includes: { en: [TBD], fa: [TBD] },
      excludes: { en: [TBD], fa: [TBD] },
      paymentMilestones: { en: [TBD], fa: [TBD] },
      duration: { en: TBD, fa: TBD },
      ctaLabel: { en: 'Free readiness assessment', fa: 'ارزیابی آمادگی رایگان' },
      imageAlt: { en: '', fa: '' },
    },
  ],
  copy: {
    en: {
      hero: {
        eyebrow: 'Pricing',
        title: 'What preparing your team costs, before you call us',
        lede: 'Each route shows where our fee starts. Government fees and third-party costs are listed apart from it, so you can see the whole picture before any call.',
        cta: 'Free readiness assessment',
      },
      cards: {
        title: 'Routes and starting prices',
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
        intro: 'Nothing is paid on this website. After the free readiness assessment you receive the exact price, split into stages.',
        steps: [
          { title: 'Free readiness assessment', body: 'You tell us about your team and your idea. We tell you whether the route fits, and what the work would cost.' },
          { title: 'The exact price, in stages', body: 'Each route’s stages are listed on its card. Each stage is tied to a piece of work we deliver.' },
          { title: 'Fees for others stay separate', body: 'Government fees, the lawyer and translators are paid to them directly, at the time they ask for it.' },
        ],
      },
      faq: {
        title: 'Questions about price',
        items: [
          { q: 'Why do you give the exact price only after the assessment?', a: 'Because the work depends on your team: how far the idea is, what research exists, what the route asks for. A final price before anyone has looked at your business would be a guess. The starting price on each card is the floor.' },
          { q: 'Are government and lawyer fees included?', a: 'No. Our fee covers business work only. Government fees, the lawyer, translation and company registration are paid separately, to them.' },
          { q: 'In Canada, who does the immigration work?', a: 'A licensed lawyer handles the immigration part of the file, and the lawyer’s fee is separate. We prepare the business: mentoring, market research and the business plan.' },
          { q: 'Can you promise the visa will be granted?', a: 'No. The decision belongs to the government and the body that evaluates your business. Nobody can promise it, and you should be wary of anyone who does.' },
          { q: 'What if our team is not ready?', a: 'The assessment will say so. Then we tell you what is missing, and whether working on it first makes sense, before you pay for anything.' },
        ],
      },
      final: {
        title: 'Start with the free readiness assessment',
        body: 'A few questions about your team. You get an honest read on the route and the exact price.',
        cta: 'Free readiness assessment',
        partnerPrompt: 'Are you a business partner?',
        partnerLink: 'The partner page',
      },
    },
    fa: {
      hero: {
        eyebrow: 'قیمت‌ها',
        title: 'هزینه‌ی آماده‌سازی تیم، پیش از هر تماس',
        lede: 'برای هر مسیر نوشته‌ایم هزینه‌ی ما از کجا شروع می‌شود. هزینه‌های دولتی و هزینه‌ی دیگران جدا آمده تا قبل از هر تماسی تصویر کامل را ببینید.',
        cta: 'ارزیابی آمادگی رایگان',
      },
      cards: {
        title: 'مسیرها و قیمت شروع',
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
        intro: 'در این سایت هیچ پرداختی انجام نمی‌شود. بعد از ارزیابی آمادگی رایگان، قیمت دقیق را در چند مرحله دریافت می‌کنید.',
        steps: [
          { title: 'ارزیابی آمادگی رایگان', body: 'از تیم و ایده‌تان می‌گویید. ما می‌گوییم این مسیر به شما می‌خورد یا نه، و هزینه‌ی کار چقدر است.' },
          { title: 'قیمت دقیق، مرحله‌به‌مرحله', body: 'مراحل پرداخت هر مسیر روی کارت همان مسیر آمده است. هر مرحله به بخشی از کاری که تحویل می‌دهیم بسته است.' },
          { title: 'هزینه‌ی دیگران جداست', body: 'هزینه‌های دولتی، وکیل و مترجم مستقیم به خودشان و هر وقت خودشان بخواهند پرداخت می‌شود.' },
        ],
      },
      faq: {
        title: 'پرسش‌های رایج درباره‌ی قیمت',
        items: [
          { q: 'چرا قیمت دقیق را بعد از ارزیابی می‌گویید؟', a: 'چون کار به تیم شما بستگی دارد: ایده کجاست، چه تحقیقی انجام شده و مسیر چه می‌خواهد. قیمت نهایی پیش از دیدن کسب‌وکار شما فقط حدس است. قیمت شروعِ روی هر کارت، کفِ هزینه است.' },
          { q: 'هزینه‌های دولتی و وکیل جزو قیمت است؟', a: 'نه. هزینه‌ی ما فقط برای کار بیزنسی است. هزینه‌های دولتی، وکیل، ترجمه و ثبت شرکت جدا و مستقیم به خودشان پرداخت می‌شود.' },
          { q: 'در کانادا کار مهاجرتی را چه کسی انجام می‌دهد؟', a: 'بخش مهاجرتی پرونده را وکیل دارای مجوز انجام می‌دهد و هزینه‌ی وکیل جداست. کار ما آماده‌سازی بیزنس است: منتورینگ، تحقیق بازار و بیزینس‌پلن.' },
          { q: 'قبولی ویزا را قول می‌دهید؟', a: 'نه. تصمیم با دولت و نهادی است که کسب‌وکار شما را ارزیابی می‌کند. هیچ‌کس نمی‌تواند قولش را بدهد و به کسی که قولش را می‌دهد شک کنید.' },
          { q: 'اگر تیم ما آماده نباشد چه؟', a: 'ارزیابی همین را نشان می‌دهد. آن وقت می‌گوییم چه چیزی کم است و آیا اول کار روی آن منطقی است، پیش از آنکه بابت چیزی پولی بدهید.' },
        ],
      },
      final: {
        title: 'از ارزیابی آمادگی رایگان شروع کنید',
        body: 'چند سؤال درباره‌ی تیم‌تان. یک ارزیابی صادقانه از مسیر و قیمت دقیق می‌گیرید.',
        cta: 'ارزیابی آمادگی رایگان',
        partnerPrompt: 'شریک تجاری هستید؟',
        partnerLink: 'صفحه‌ی همکاری',
      },
    },
  },
};
