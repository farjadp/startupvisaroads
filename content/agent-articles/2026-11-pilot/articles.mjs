// ============================================================================
// The High Impact Start-up Pilot series: nine hand-written articles, one
// about every six days from 10 Nov 2026 to 5 Jan 2027. Facts: FACTS.md.
// Build and check: node build.mjs   (writes ./out/*.json, fails on any number
// not in FACTS.md). Post: node scripts/post-agent-article.mjs out/*.json
//
// Each article has ONE reader and ONE angle, so the run does not read as the
// same news nine times:
//   en-1  news explained     what IRCC has actually said
//   fa-1  the same, for the Persian reader, written for Persian search
//   en-2  comparison         old programme vs pilot, field by field
//   fa-2  scam warning       nobody can reserve a place
//   en-3  business owner     four preparations that hold under any rules
//   fa-3  commitment certificate holders
//   en-4  data               what the (reported) numbers say about the pause
//   fa-4  the 2,000 / 12-month figures that circulate
//   en-5  decision           wait for the pilot, or take a route open today
// ============================================================================

const SRC = {
  notice: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html',
  binder: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/economic-immigration.html',
  about: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
  assessing: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/operational-bulletins-manuals/permanent-residence/economic-classes/start-business/assessing-application.html',
  press: 'https://immigration.ca/canada-plans-high-impact-start-up-visa-pilot-after-pausing-existing-program/',
  rbc: 'https://www.rbc.com/en/thought-leadership/wp-content/uploads/sites/27/2026/09/A-Smarter-Immigration-Strategy-Report-EN.pdf',
};
const a = (href, text) => (href.startsWith('/')
  ? `<a href="${href}">${text}</a>`
  : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`);
const PILOT = '/en/high-impact-startup-pilot';
const PILOT_FA = '/fa/high-impact-startup-pilot';

export const articles = [
  // ───────────────────────────────────────────────────────────── en-1
  {
    file: 'en-1-what-ircc-has-said',
    publishAt: '2026-11-10T14:00:00Z',
    locale: 'en',
    slug: 'high-impact-start-up-pilot-what-ircc-has-actually-said',
    title: 'High Impact Start-up Pilot: What IRCC Has Actually Said So Far',
    excerpt: 'Canada has paused the Start-up Visa and named a replacement, the High Impact Start-up Pilot. Three lines are the whole official record. Everything else is press or guesswork.',
    category: 'Canada Startup Visa',
    tags: ['High Impact Start-up Pilot', 'Start-up Visa', 'IRCC', 'Canada immigration news'],
    keyTakeaway: 'IRCC has named the High Impact Start-up Pilot as the replacement for the Start-up Visa, but has published no criteria, cap or opening date. Treat any number or date you see as unofficial.',
    summaryEn: 'What IRCC has officially said about the High Impact Start-up Pilot, what trade press adds, and what remains unpublished as of 5 November 2026.',
    faq: [
      { q: 'Is the High Impact Start-up Pilot open?', a: 'No. IRCC has published no criteria, intake or opening date, and there is nothing to file.' },
      { q: 'Has IRCC said when it will launch?', a: 'No. IRCC said in December 2025 that more information would come in 2026; none has been published as of 5 November 2026.' },
    ],
    internalLinks: [PILOT, '/en/startup-visa-canada'],
    content: `
<p>If you have been waiting for Canada to say what comes after the Start-up Visa, the honest summary is short: IRCC has said a replacement is coming, has given it a name, and has said almost nothing else. This piece lists what is on the record, who said it, and where the record stops. Everything below was checked on 5 November 2026.</p>

<h2>The record, in three lines</h2>
<ol>
<li><strong>December 2025.</strong> IRCC's notice on measures for entrepreneurs said "a new, targeted pilot for immigrant entrepreneurs is expected to follow", with more information communicated in 2026. ${a(SRC.notice, 'IRCC notice')}</li>
<li><strong>2026.</strong> IRCC's transition binder for the Deputy Minister lists the "launch of a new High Impact Start-up Pilot to replace the Start-Up Visa Program". It gives no date, criteria or targets. ${a(SRC.binder, 'IRCC transition binder')}</li>
<li><strong>Second-hand.</strong> The 2026-27 Departmental Plan, as quoted by immigration.ca, speaks of a "new high impact Start-Up Visa pilot" aimed at "elite entrepreneurs". ${a(SRC.press, 'immigration.ca')}</li>
</ol>

<h2>What the Start-up Visa status is now</h2>
<p>IRCC's own page says the Start-up Visa Program was paused on 30 June 2026. Applications accepted before the pause are still being processed, and an eligible applicant can still apply for an open work permit while theirs is assessed. The last way in was a valid 2025 commitment certificate and a filing by that date. ${a(SRC.about, 'IRCC, Start-up Visa Program')}</p>

<h2>What is not published</h2>
<ul>
<li>An opening date</li>
<li>Eligibility criteria and the application process</li>
<li>Intake or a cap</li>
<li>Processing time</li>
<li>Whether a designated organization (a venture fund, angel group or incubator) is still required</li>
<li>Whether an old commitment certificate counts for anything</li>
</ul>
<p>The one official number nearby is not about the pilot at all: the 2026 admissions target for all federal business programs together is 500.</p>

<h2>What you will see that is not official</h2>
<p>A cap of about 2,000 a year and a 12-month processing target circulate in trade press. Neither is on canada.ca. Plans that depend on them are plans built on a rumour.</p>

<h2>Our reading, marked as ours</h2>
<p>IRCC promised detail "in 2026" and none has come, so an opening this year looks unlikely. We expect 2027. That is our expectation, not an IRCC statement, and we will update it the day IRCC gives a date.</p>

<p>We keep a field-by-field record of what is stated, what is only reported and what is blank on our ${a(PILOT, 'High Impact Start-up Pilot page')}.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── fa-1
  {
    file: 'fa-1-pilot-chist',
    publishAt: '2026-11-17T08:00:00Z',
    locale: 'fa',
    slug: 'canada-high-impact-startup-pilot-chist',
    title: 'پایلوت High Impact Start-up کانادا چیست و چه زمانی باز می‌شود؟',
    excerpt: 'ویزای استارتاپ کانادا متوقف است و IRCC پایلوتی را برای جایگزینی آن اعلام کرده. چه چیزی رسمی است، چه چیزی فقط شنیده‌ایم، و چرا هنوز نمی‌شود برایش اقدام کرد.',
    category: 'Canada Startup Visa',
    tags: ['ویزای استارتاپ کانادا', 'پایلوت High Impact Start-up', 'IRCC'],
    keyTakeaway: 'IRCC پایلوت High Impact Start-up را به‌عنوان جایگزین ویزای استارتاپ نام برده، اما شرایط، ظرفیت و تاریخ بازشدن را منتشر نکرده است. برای ثبت‌نام زودهنگام پول ندهید: چیزی برای رزرو وجود ندارد.',
    summaryEn: 'Persian explainer of the High Impact Start-up Pilot: what IRCC has said, what is only reported, and what is unpublished as of 5 November 2026.',
    faq: [
      { q: 'پایلوت High Impact Start-up باز شده است؟', a: 'نه. IRCC شرایط و تاریخ بازشدن را منتشر نکرده و برای پایلوت چیزی برای ثبت وجود ندارد.' },
      { q: 'می‌شود برای پایلوت جا رزرو کرد؟', a: 'نه. هیچ‌کس نمی‌تواند جایی در آن رزرو کند.' },
    ],
    internalLinks: [PILOT_FA, '/fa/canada-startup-visa'],
    content: `
<p>اگر دنبال خبر ویزای استارتاپ کانادا هستید، اول این را بدانید: برنامه‌ی قدیمی متوقف است و جایگزینش هنوز باز نشده. این نوشته می‌گوید IRCC دقیقاً چه گفته، چه چیزی را فقط رسانه‌ها نوشته‌اند و چه چیزی هنوز خالی است. همه‌ی موارد در ۵ نوامبر ۲۰۲۶ بررسی شده است.</p>

<h2>برنامه‌ی قدیمی در چه وضعیتی است؟</h2>
<p>به بیان خود IRCC، برنامه‌ی ویزای استارتاپ از ۳۰ ژوئن ۲۰۲۶ متوقف است. پرونده‌هایی که پیش از آن پذیرفته شده‌اند همچنان بررسی می‌شوند و کسی که واجد شرایط باشد هنوز می‌تواند مجوز کار باز بگیرد. آخرین راه ورود، گواهی تعهد معتبر ۲۰۲۵ و ثبت پرونده تا همان تاریخ بود. ${a(SRC.about, 'IRCC، برنامه‌ی ویزای استارتاپ')}</p>

<h2>جایگزین چه نامی دارد؟</h2>
<p>سند انتقال معاون وزیر IRCC برای ۲۰۲۶ از «راه‌اندازی یک پایلوت جدید High Impact Start-up برای جایگزینی برنامه‌ی ویزای استارتاپ» نام می‌برد. اطلاعیه‌ی دسامبر ۲۰۲۵ هم قبلاً از «پایلوتی هدفمند برای کارآفرینان مهاجر» خبر داده بود. هر دو بدون تاریخ و بدون شرط‌اند. ${a(SRC.binder, 'سند انتقال IRCC')} · ${a(SRC.notice, 'اطلاعیه‌ی IRCC')}</p>

<h2>چه چیزی منتشر نشده؟</h2>
<ul>
<li>تاریخ بازشدن</li>
<li>شرایط پذیرش و روند درخواست</li>
<li>ظرفیت یا سقف</li>
<li>زمان پردازش</li>
<li>اینکه سازمان تأییدشده (صندوق سرمایه‌گذاری، گروه فرشته یا انکوباتور) هنوز لازم است یا نه</li>
<li>اینکه گواهی تعهد قدیمی به کاری می‌آید یا نه</li>
</ul>

<h2>برداشت ما، با همین برچسب</h2>
<p>IRCC گفته بود جزئیات در ۲۰۲۶ می‌آید و تا امروز چیزی نیامده. برنامه‌ای که هنوز شرط پذیرش ندارد باید اول شرط‌هایش را منتشر کند، پس بازشدن در امسال بعید است. انتظار ما ۲۰۲۷ است. این برداشت ماست، نه اعلام IRCC.</p>

<p>سابقه‌ی فیلد به فیلد را، با جوهر برای گفته‌ی IRCC، هایلایت برای گزارش رسانه‌ها و خط نقطه‌چین برای جاهای خالی، در ${a(PILOT_FA, 'صفحه‌ی پایلوت High Impact Start-up')} نگه می‌داریم.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── en-2
  {
    file: 'en-2-old-vs-new',
    publishAt: '2026-11-24T14:00:00Z',
    locale: 'en',
    slug: 'start-up-visa-vs-high-impact-start-up-pilot-field-by-field',
    title: 'Start-up Visa vs High Impact Start-up Pilot: Field by Field',
    excerpt: 'The old programme has published rules. The pilot has published a name. Here is the comparison, with the blanks left blank.',
    category: 'Canada Startup Visa',
    tags: ['High Impact Start-up Pilot', 'Start-up Visa', 'comparison'],
    keyTakeaway: 'Of the fields that define the Start-up Visa, capital minimums, language level and the designated-organization model, none has been published for the pilot yet.',
    summaryEn: 'A field-by-field comparison of the paused Start-up Visa and the announced High Impact Start-up Pilot, showing what IRCC has and has not published.',
    faq: [
      { q: 'What did the Start-up Visa require?', a: 'A commitment from a designated organization (CAD 200,000 from a venture fund or CAD 75,000 from an angel group), CLB 5 in all four skills and a qualifying business. The pilot\'s requirements are unpublished.' },
    ],
    internalLinks: [PILOT, '/en/startup-visa-canada/requirements'],
    content: `
<p>People ask whether the new pilot "keeps" the old rules. The only defensible answer is a table where one column is full and the other is mostly empty. The old column below is from IRCC's own manual for assessing Start-up Business Class applications. The pilot column is whatever IRCC has said, which is very little. Checked 5 November 2026.</p>

<table>
<thead><tr><th>Field</th><th>Start-up Visa (paused)</th><th>High Impact Start-up Pilot</th></tr></thead>
<tbody>
<tr><td>Status</td><td>Paused since 30 June 2026</td><td>Announced, not open</td></tr>
<tr><td>Who backs the founder</td><td>A designated organization: venture fund, angel group or incubator</td><td>Not published</td></tr>
<tr><td>Minimum committed capital</td><td>CAD 200,000 from a venture fund, CAD 75,000 from an angel group</td><td>Not published</td></tr>
<tr><td>Language</td><td>CLB 5 in all four skills, test under two years old</td><td>Not published</td></tr>
<tr><td>Ownership</td><td>Each applicant at least 10% of voting rights; applicants and the designated entity together more than 50%</td><td>Not published</td></tr>
<tr><td>Target applicant</td><td>Founders with a qualifying business and a commitment</td><td>"Elite entrepreneurs" (Departmental Plan, as reported)</td></tr>
<tr><td>Intake</td><td>A limit of 10 complete group applications per designated organization per year since 1 April 2024</td><td>Not published</td></tr>
</tbody>
</table>
<p>Sources: ${a(SRC.assessing, 'IRCC, assessing the application')}; ${a(SRC.binder, 'IRCC transition binder')}; ${a(SRC.press, 'immigration.ca')} for the Departmental Plan wording.</p>

<h2>How to read the empty cells</h2>
<p>An empty cell is not a hint. It is not "probably the same" or "probably tougher". Trade press expects a more selective pilot, with closer checks on the business and on designated organizations, but that is the author's inference from IRCC's wording, not IRCC's text.</p>

<h2>What the comparison is good for</h2>
<p>It tells you which parts of your preparation are safe to start now. Clean ownership, evidence of traction and a language result that will not expire matter under the old rules and will almost certainly matter under any new ones. It does not tell you what the pilot will ask for, because nobody can yet.</p>

<p>The same table, with sources linked per cell and a filter for the blanks, is on our ${a(PILOT, 'pilot page')}.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── fa-2
  {
    file: 'fa-2-no-reservations',
    publishAt: '2026-12-01T08:00:00Z',
    locale: 'fa',
    slug: 'canada-startup-pilot-no-reservation-scam-warning',
    title: 'رزرو جا در پایلوت استارتاپ کانادا؟ چرا هر وعده‌ای از این دست یعنی خطر',
    excerpt: 'برای پایلوتی که شرایطش منتشر نشده، هیچ‌کس نمی‌تواند جایی رزرو کند. این نوشته می‌گوید چرا، و چه نشانه‌هایی را باید جدی بگیرید.',
    category: 'Canada Startup Visa',
    tags: ['کلاهبرداری مهاجرتی', 'ویزای استارتاپ کانادا', 'پایلوت High Impact Start-up'],
    keyTakeaway: 'پایلوت هنوز شرط پذیرش ندارد و پرونده نمی‌پذیرد. هر کس برای «رزرو جا» یا «ثبت‌نام زودهنگام» پول می‌خواهد، چیزی می‌فروشد که وجود ندارد.',
    summaryEn: 'Persian warning that no one can reserve a place in the unpublished High Impact Start-up Pilot, with the signs to watch for.',
    faq: [
      { q: 'می‌شود برای پایلوت ثبت‌نام زودهنگام کرد؟', a: 'نه. IRCC شرایط و روند درخواست را منتشر نکرده و پرونده‌ای پذیرفته نمی‌شود.' },
    ],
    internalLinks: [PILOT_FA, '/fa/canada-startup-visa'],
    content: `
<p>هر بار که برنامه‌ای متوقف می‌شود و جایگزینش اعلام می‌شود، کسانی پیدا می‌شوند که «جا رزرو می‌کنند». برای پایلوت High Impact Start-up هم همین شروع شده. این نوشته فقط یک چیز را می‌گوید: چرا چنین چیزی ممکن نیست.</p>

<h2>چرا نمی‌شود رزرو کرد؟</h2>
<p>پایلوت هنوز شرط پذیرش ندارد. IRCC نه شرایط، نه روند درخواست، نه ظرفیت و نه تاریخ بازشدن را منتشر کرده است. ویزای استارتاپ قدیمی هم از ۳۰ ژوئن ۲۰۲۶ متوقف است. وقتی هیچ فرمی برای پر کردن و هیچ قاعده‌ای برای سنجیدن شما وجود ندارد، «جا» هم وجود ندارد. ${a(SRC.binder, 'سند انتقال IRCC')} · ${a(SRC.about, 'IRCC، برنامه‌ی ویزای استارتاپ')}</p>

<h2>نشانه‌هایی که باید جدی بگیرید</h2>
<ul>
<li>پرداخت برای «ثبت‌نام زودهنگام»، «اولویت در پایلوت» یا «رزرو ظرفیت».</li>
<li>تضمین پذیرش یا «تضمین سهمیه».</li>
<li>ادعای اینکه گواهی تعهد قدیمی یا پرونده‌ی قدیمی «به پایلوت منتقل می‌شود». IRCC چنین چیزی نگفته.</li>
<li>رقم‌هایی که فقط در گزارش رسانه‌ای آمده‌اند و منبع رسمی ندارند، مثل سقف ۲٬۰۰۰ نفر یا هدف ۱۲ ماه، به‌عنوان قطعیت.</li>
<li>فشار برای تصمیم فوری، به بهانه‌ی «پر شدن ظرفیت».</li>
</ul>

<h2>چه کار می‌شود کرد؟</h2>
<p>هر ادعایی درباره‌ی پایلوت را با صفحه‌های رسمی IRCC در canada.ca بسنجید. اگر در آنجا نیست، یعنی هنوز وجود ندارد. تا وقتی IRCC منتشر نکرده، کار درست این است که شواهد اثرگذاری کسب‌وکارتان را با تاریخ نگه دارید و مالکیت و مالکیت فکری را مرتب کنید. این‌ها در هر نسخه‌ای از قواعد به درد می‌خورد و پولی هم نمی‌خواهد.</p>

<p>آنچه رسمی است، آنچه فقط گزارش شده و آنچه هنوز منتشر نشده، در ${a(PILOT_FA, 'صفحه‌ی پایلوت')} جدا از هم آمده است.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── en-3
  {
    file: 'en-3-prepare',
    publishAt: '2026-12-08T14:00:00Z',
    locale: 'en',
    slug: 'prepare-for-canadas-high-impact-start-up-pilot-four-things',
    title: 'Preparing for Canada\'s High Impact Start-up Pilot: Four Things That Hold Under Any Rules',
    excerpt: 'Nobody knows the pilot\'s criteria. A founder can still prepare: four things the old programme asked for and any successor will almost certainly ask for too.',
    category: 'Mentorship & Business Planning',
    tags: ['High Impact Start-up Pilot', 'founder preparation', 'Start-up Visa'],
    keyTakeaway: 'Preparation that does not depend on the final rules: dated evidence of traction, a clean cap table, a language result timed to the opening, and a plan that does not rest on one door.',
    summaryEn: 'Four preparations for a founder waiting on the High Impact Start-up Pilot, drawn from what the old Start-up Business Class assessed and what IRCC has hinted about the new one.',
    faq: [
      { q: 'Can I start preparing before the criteria are published?', a: 'Yes, for things that mattered under the old rules and will likely matter again: evidence of traction, clean ownership and a language result. None of it is a reservation.' },
    ],
    internalLinks: [PILOT, '/en/which-path'],
    content: `
<p>This is for a founder who runs a real company and is deciding what to do with the months before the pilot opens. The honest framing: you cannot prepare for criteria that do not exist. You can prepare for the things any entrepreneur programme has to check. IRCC's only hint about the pilot's test is "elite entrepreneurs" and, in the trade press's reading, measurable economic impact. Checked 5 November 2026.</p>

<h2>1. Evidence of traction, kept dated</h2>
<p>Revenue, signed customers, usage and product milestones, each with a date and where it came from. If the test is impact, then impact is something you show, not something you describe. Keep it in a form someone outside the company can verify.</p>

<h2>2. A clean cap table and a real company</h2>
<p>The old programme looked hard at structure. Each applicant needed at least 10% of the voting rights, applicants and the designated organization together needed more than 50%, and investments had to be equity, not convertible debt. ${a(SRC.assessing, 'IRCC, assessing the application')} The pilot may differ, but founder agreements, IP assigned to the company and funds you can trace are the same homework either way.</p>

<h2>3. A language result that will not expire</h2>
<p>The old programme asked for CLB 5 in all four skills from a test taken under two years before filing. Expect the pilot to ask for at least that, and time the test to the opening, not before it. A result that expires while IRCC is still drafting is money spent twice.</p>

<h2>4. A plan that does not rest on one door</h2>
<p>The pilot has no opening date. We expect 2027, which is our inference. A founder who must move this year needs a plan that works if that is wrong. Compare the routes open today and treat the pilot as upside, not as the plan.</p>

<h2>What not to do</h2>
<p>Do not pay anyone to reserve a place. Nothing can be reserved, because nothing has been published to reserve against.</p>

<p>Our ${a(PILOT, 'pilot page')} lists what IRCC has stated and what is still blank, and we update it whenever IRCC publishes.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── fa-3
  {
    file: 'fa-3-certificate-holders',
    publishAt: '2026-12-15T08:00:00Z',
    locale: 'fa',
    slug: 'startup-visa-commitment-certificate-after-pause-what-now',
    title: 'گواهی تعهد ویزای استارتاپ دارید؟ بعد از توقف برنامه چه کار کنید',
    excerpt: 'اگر از یک سازمان تأییدشده گواهی تعهد گرفته‌اید، وضعیت شما به این بستگی دارد که پرونده را تا ۳۰ ژوئن ۲۰۲۶ ثبت کرده‌اید یا نه. این نوشته هر دو حالت را جدا می‌کند.',
    category: 'Canada Startup Visa',
    tags: ['گواهی تعهد', 'ویزای استارتاپ کانادا', 'سازمان تأییدشده'],
    keyTakeaway: 'پرونده‌ی ثبت‌شده‌ی ویزای استارتاپ هنوز بررسی می‌شود. گواهی تعهدی که پرونده‌اش ثبت نشده، به بیان IRCC برای ورود به برنامه‌ی قدیمی دیگر کار نمی‌کند و اینکه برای پایلوت به کاری بیاید یا نه، اعلام نشده است.',
    summaryEn: 'Persian guide for holders of a Start-up Visa commitment certificate: what applies if they filed before the pause, and what is unknown if they did not.',
    faq: [
      { q: 'گواهی تعهد من برای پایلوت معتبر است؟', a: 'نمی‌دانیم. IRCC نگفته که گواهی تعهد یا بخشی از روند قدیمی به پایلوت منتقل می‌شود یا نه.' },
    ],
    internalLinks: [PILOT_FA, '/fa/canada-startup-visa'],
    content: `
<p>این نوشته برای کسی است که از یک صندوق سرمایه‌گذاری، گروه فرشته یا انکوباتور تأییدشده گواهی تعهد گرفته بود. وضعیت شما بین دو حالت تقسیم می‌شود و هر کدام پاسخ جدایی دارد. همه‌ی موارد در ۵ نوامبر ۲۰۲۶ بررسی شده است.</p>

<h2>حالت اول: پرونده را ثبت کرده‌اید</h2>
<p>به بیان IRCC، پرونده‌هایی که پیش از توقف پذیرفته شده‌اند همچنان بررسی می‌شوند و اگر واجد شرایط باشید می‌توانید مجوز کار باز بگیرید. ${a(SRC.about, 'IRCC، برنامه‌ی ویزای استارتاپ')} گواهی تعهد شش ماه اعتبار داشت و به همین دلیل برخی پرونده‌ها تا ۳۰ ژوئن ۲۰۲۶ پذیرفته شد. ${a(SRC.assessing, 'IRCC، ارزیابی درخواست')}</p>

<h2>حالت دوم: گواهی دارید اما پرونده را ثبت نکرده‌اید</h2>
<p>سازمان‌های تأییدشده پس از ۳۱ دسامبر ۲۰۲۵ گواهی جدید صادر نمی‌کنند و آخرین راه ورود، گواهی معتبر ۲۰۲۵ و ثبت تا ۳۰ ژوئن ۲۰۲۶ بود. اگر این مهلت گذشته، برنامه‌ی قدیمی برای شما بسته است.</p>
<p>این‌که گواهی یا هر بخش دیگری از روند قدیمی به پایلوت منتقل شود، اعلام نشده است. IRCC درباره‌ی نقش سازمان تأییدشده در پایلوت هم چیزی نگفته. بر پایه‌ی این گواهی برای پایلوت خرج نکنید.</p>

<h2>چه چیزی را نگه دارید؟</h2>
<ul>
<li>نسخه‌ی گواهی، نامه‌ی حمایت و هر مدرکی که نشان می‌دهد سازمان پشت کسب‌وکارتان بوده.</li>
<li>مدرک سهامداری و توافق‌نامه‌ی بنیان‌گذاران.</li>
<li>شواهد اثرگذاری کسب‌وکار با تاریخ.</li>
</ul>
<p>این‌ها در هر نسخه‌ای از قواعد مفیدند و رزرو چیزی نیستند.</p>

<p>هر آنچه درباره‌ی پایلوت می‌دانیم و نمی‌دانیم در ${a(PILOT_FA, 'صفحه‌ی پایلوت')} است.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── en-4
  {
    file: 'en-4-the-numbers',
    publishAt: '2026-12-22T14:00:00Z',
    locale: 'en',
    slug: 'why-canada-paused-the-start-up-visa-what-the-numbers-show',
    title: 'Why Canada Paused the Start-up Visa: What the Numbers Show, and Who Reported Them',
    excerpt: 'IRCC says it paused the Start-up Visa to address a backlog. Reported admissions rose from 55 in 2015 to 5,605 in 2024, in a table IRCC has not published. Here is how to read it.',
    category: 'Canada Startup Visa',
    tags: ['Start-up Visa', 'High Impact Start-up Pilot', 'immigration data'],
    keyTakeaway: 'IRCC\'s stated reason is a backlog. The admissions figures that illustrate it come from immigration.ca without a named source, so treat them as reported, not official.',
    summaryEn: 'What IRCC says about why the Start-up Visa was paused, and how to read the reported admissions figures and the RBC critique.',
    faq: [
      { q: 'Why did IRCC pause the Start-up Visa?', a: 'To address the application backlog and wait times: more applications arrived than there were admission spaces.' },
    ],
    internalLinks: [PILOT, '/en/startup-visa-canada'],
    content: `
<p>The Start-up Visa pause is easier to understand with numbers, and harder to trust with them. The reason IRCC gives is plain. The numbers people quote to illustrate it mostly are not IRCC's. This piece separates the two. Checked 5 November 2026.</p>

<h2>What IRCC says</h2>
<p>IRCC's Start-up Visa page says the programme is paused to address its backlog and client wait times, and lists it among programmes where application intake outran the admission spaces available. IRCC's binder adds that it is still working on an inventory management strategy. ${a(SRC.about, 'IRCC, Start-up Visa Program')} · ${a(SRC.binder, 'IRCC transition binder')}</p>
<p>The one official figure in the binder is forward-looking: the 2026 admissions target for all federal business programs together is 500.</p>

<h2>What was reported</h2>
<p>immigration.ca, without naming its source, gives Start-up Visa admissions of 55 in 2015, 5,605 in 2024 and 1,425 in 2025, and reads the 2025 drop as tightening ahead of the pause. ${a(SRC.press, 'immigration.ca')} They are plausible and they fit IRCC's story, but they are not an IRCC table, so we cite them as reported.</p>

<h2>What a think-tank argues</h2>
<p>RBC's September 2026 report argues that the programme gave permanent residence on the strength of capital or incubator backing, without testing whether the business was real or succeeded, and suggests Canada pilot a temporary entrepreneurship pathway for founders with a track record. ${a(SRC.rbc, 'RBC Thought Leadership')} It is a recommendation, not policy.</p>

<h2>What this does and does not tell a founder</h2>
<p>It suggests why IRCC wants a more selective replacement. It does not tell you what the replacement will require. The pilot's criteria, cap and date are unpublished, and a reason for a change is not a specification for it.</p>

<p>Our ${a(PILOT, 'pilot page')} keeps official, reported and unpublished apart, so you can see which is which at a glance.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── fa-4
  {
    file: 'fa-4-rumoured-figures',
    publishAt: '2027-01-03T08:00:00Z',
    locale: 'fa',
    slug: 'canada-startup-pilot-rumoured-cap-and-processing-figures',
    title: 'سقف ۲٬۰۰۰ نفر و پردازش ۱۲ ماهه: ارقام پایلوت استارتاپ کانادا از کجا می‌آیند؟',
    excerpt: 'دو رقم درباره‌ی پایلوت می‌چرخد: سقف حدود ۲٬۰۰۰ نفر در سال و هدف ۱۲ ماه. هر دو گزارش رسانه‌ای‌اند و هیچ‌کدام در canada.ca نیست. این نوشته می‌گوید چه ارزشی دارند.',
    category: 'Canada Startup Visa',
    tags: ['پایلوت High Impact Start-up', 'ویزای استارتاپ کانادا', 'اخبار مهاجرت'],
    keyTakeaway: 'سقف حدود ۲٬۰۰۰ نفر و هدف ۱۲ ماه از رسانه‌های مهاجرتی آمده‌اند، نه از IRCC. تنها رقم رسمی نزدیک به این موضوع، هدف ۵۰۰ نفر برای همه‌ی برنامه‌های تجاری فدرال در ۲۰۲۶ است.',
    summaryEn: 'Persian piece on the two figures circulating about the pilot (a cap of about 2,000 a year, a 12-month target), which come from trade press and not from IRCC.',
    faq: [
      { q: 'سقف پایلوت ۲٬۰۰۰ نفر است؟', a: 'IRCC چنین رقمی منتشر نکرده است. این عدد از رسانه‌های مهاجرتی آمده و رسمی نیست.' },
    ],
    internalLinks: [PILOT_FA, '/fa/canada-startup-visa'],
    content: `
<p>در گروه‌ها و سایت‌ها دو رقم درباره‌ی پایلوت High Impact Start-up زیاد تکرار می‌شود: سقف حدود ۲٬۰۰۰ نفر در سال و پردازش در ۱۲ ماه. پرسش ساده است: این‌ها را چه کسی گفته؟ همه‌ی موارد در ۵ نوامبر ۲۰۲۶ بررسی شده است.</p>

<h2>منبع این دو رقم</h2>
<p>هر دو از گزارش‌های رسانه‌های مهاجرتی در دسامبر ۲۰۲۵ آمده‌اند. هیچ‌کدام در صفحه‌های IRCC در canada.ca نیست. سند انتقال معاون وزیر IRCC نام پایلوت را می‌آورد، اما تاریخ، شرط و ظرفیتی برایش نمی‌دهد. ${a(SRC.binder, 'سند انتقال IRCC')}</p>

<h2>تنها رقم رسمی نزدیک به موضوع</h2>
<p>هدف پذیرش ۲۰۲۶ برای همه‌ی برنامه‌های تجاری فدرال روی هم ۵۰۰ نفر است. این رقم درباره‌ی پایلوت نیست و نباید با سقف پایلوت اشتباه شود.</p>

<h2>چرا نباید روی این ارقام برنامه‌ریزی کرد؟</h2>
<ul>
<li>اگر سقف واقعاً ۲٬۰۰۰ باشد یا نباشد، شما نمی‌توانید از آن چیزی نتیجه بگیرید: شرط پذیرش هنوز معلوم نیست.</li>
<li>رقم ۱۲ ماه «هدف» است، نه تعهد. برنامه‌ای که باز نشده، هنوز زمان پردازش واقعی ندارد.</li>
<li>برنامه‌ی قدیمی هم زمان پردازش رسمی منتشرشده‌ای نداشت. IRCC در صفحه‌ی آن رقمی نمی‌دهد.</li>
</ul>

<h2>یک قاعده‌ی ساده</h2>
<p>رقمی را که منبع رسمی ندارد، فقط با نام گوینده‌اش نقل کنید و در تصمیم‌هایی که پول یا زمان می‌برند به حساب نیاورید. وقتی IRCC رقمی منتشر کند، این صفحه و بقیه‌ی نوشته‌ها همان روز عوض می‌شوند.</p>

<p>آنچه رسمی است و آنچه فقط گزارش شده، جدا از هم در ${a(PILOT_FA, 'صفحه‌ی پایلوت')} آمده است.</p>
`,
  },

  // ───────────────────────────────────────────────────────────── en-5
  {
    file: 'en-5-wait-or-move',
    publishAt: '2027-01-05T14:00:00Z',
    locale: 'en',
    slug: 'wait-for-canadas-high-impact-start-up-pilot-or-take-another-route',
    title: 'Wait for the High Impact Start-up Pilot, or Take a Route Open Today?',
    excerpt: 'A pilot with no published rules is not a plan. Here is a way to decide whether to wait for it, based on what you can control and what you cannot.',
    category: 'Canada Startup Visa',
    tags: ['High Impact Start-up Pilot', 'decision', 'Entrepreneur PNP'],
    keyTakeaway: 'Wait for the pilot only if waiting costs you nothing you cannot afford to lose. Otherwise treat it as upside and compare the routes that are open today.',
    summaryEn: 'A decision framework for founders: wait for the High Impact Start-up Pilot or pursue a route open today, given that the pilot has no published criteria or date.',
    faq: [
      { q: 'Should I wait for the High Impact Start-up Pilot?', a: 'Only if waiting is cheap for you. IRCC has published no date or criteria, and we expect 2027 as our own inference.' },
    ],
    internalLinks: [PILOT, '/en/pnp', '/en/which-path', '/en/country'],
    content: `
<p>This is for a founder who is deciding, right now, whether to put their plans on hold for the High Impact Start-up Pilot. We cannot make the decision for you. We can tell you what it depends on. Checked 5 November 2026; if IRCC has published anything since, the pilot page below is updated first.</p>

<h2>What you know</h2>
<ul>
<li>The Start-up Visa is paused and the pilot is announced as its replacement.</li>
<li>IRCC has published no opening date, criteria, cap or process.</li>
<li>Nobody can reserve a place.</li>
</ul>

<h2>What you are really deciding</h2>
<p>Waiting is not free, and it is not binary. Four questions settle most cases:</p>
<ol>
<li><strong>What does a year of delay cost you?</strong> Visa-dependent hires, a market window, a family timeline. If the cost is high, a plan that rests on an unpublished programme is a risk, not a plan.</li>
<li><strong>Can you prepare while you wait?</strong> Dated evidence of traction, clean ownership and a language result timed to the opening are all things you can do anyway.</li>
<li><strong>Does a route open today fit you?</strong> Several provinces run entrepreneur streams with their own rules and status; they are compared on our ${a('/en/pnp', 'Provincial Nominee Programs page')} and change faster than a pilot does.</li>
<li><strong>What happens if the pilot is more selective than you are ready for?</strong> Trade press expects a pilot for fewer, stronger applicants. If you are early stage, a fallback matters more.</li>
</ol>

<h2>A sane default</h2>
<p>Treat the pilot as upside. Do the preparation that helps under any rules, compare what is open today, and decide on a date: if IRCC has published nothing by then, the pilot stops being part of the plan until it does. Our own expectation of a 2027 launch is an inference, not a promise, and we would not bet a year on it.</p>

<p>Not sure which routes fit? Start with ${a('/en/which-path', 'which path is right for me')}, and keep an eye on our ${a(PILOT, 'High Impact Start-up Pilot page')}, which records what changes.</p>
`,
  },
];
