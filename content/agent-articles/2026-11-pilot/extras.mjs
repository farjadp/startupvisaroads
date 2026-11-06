// Method and guidance sections added to each article before its closing link
// paragraph. They carry no new facts: they tell the reader how to check, what
// to ask, and how to decide. Merged by build.mjs.
const a = (href, text) => (href.startsWith('/') ? `<a href="${href}">${text}</a>` : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`);
const IRCC_ABOUT = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html';
const IRCC_NOTICE = 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/immigration-measures-entrepreneurs.html';
const GAZETTE = 'https://gazette.gc.ca/rp-pr/p1/2025/2025-12-20/html/index-eng.html';

export const extras = {
  'en-1-what-ircc-has-said': `
<h2>How to check this yourself</h2>
<p>You do not need to take our word for any of it. Three pages hold the official record, and each takes a minute to read:</p>
<ul>
<li>The ${a(IRCC_ABOUT, 'Start-up Visa Program page')}, for the programme's status and the date of the pause.</li>
<li>The ${a(IRCC_NOTICE, 'December 2025 notice on measures for entrepreneurs')}, for what closed and what was promised.</li>
<li>The ${a(GAZETTE, 'Canada Gazette index for 20 December 2025')}, which lists new Ministerial Instructions on the Start-up Business Class. The index shows the title only; the text of those instructions is not something we have read, and we do not describe it.</li>
</ul>
<p>If a claim about the pilot is not on a page like these, it is reporting or opinion. That is not the same as being wrong, but it is not the same as being official either.</p>

<h2>What to do with this today</h2>
<p>Nothing needs filing and nothing needs paying. If someone offers you a place in the pilot, ask them for the IRCC page that says such a place exists. There is no such page.</p>`,

  'fa-1-pilot-chist': `
<h2>خودتان چطور بررسی کنید؟</h2>
<p>لازم نیست حرف ما را بپذیرید. سابقه‌ی رسمی در سه صفحه است و خواندن هر کدام یک دقیقه طول می‌کشد:</p>
<ul>
<li>${a(IRCC_ABOUT, 'صفحه‌ی برنامه‌ی ویزای استارتاپ')}، برای وضعیت برنامه و تاریخ توقف.</li>
<li>${a(IRCC_NOTICE, 'اطلاعیه‌ی دسامبر ۲۰۲۵ درباره‌ی اقدامات مربوط به کارآفرینان')}، برای آنچه بسته شد و آنچه وعده داده شد.</li>
<li>${a(GAZETTE, 'فهرست Canada Gazette در ۲۰ دسامبر ۲۰۲۵')}، که از دستورالعمل وزارتی جدید برای Start-up Business Class نام می‌برد. فهرست فقط عنوان را می‌دهد و متن آن دستورالعمل را ما نخوانده‌ایم و درباره‌اش حرف نمی‌زنیم.</li>
</ul>
<p>اگر ادعایی درباره‌ی پایلوت در صفحه‌هایی از این دست نیست، گزارش یا نظر است. این لزوماً غلط بودن نیست، اما رسمی بودن هم نیست.</p>

<h2>امروز چه کار کنید؟</h2>
<p>چیزی برای ثبت و چیزی برای پرداخت نیست. اگر کسی جایی در پایلوت به شما پیشنهاد کرد، صفحه‌ی IRCC را که می‌گوید چنین جایی وجود دارد از او بخواهید. چنین صفحه‌ای نیست.</p>`,

  'en-2-old-vs-new': `
<h2>What each column's source can and cannot tell you</h2>
<p>The old column comes from a manual written for officers assessing real applications, so it is precise: capital minimums, ownership thresholds, a language level. The pilot column comes from planning documents, so it is general: a name, a target group, a direction. Comparing a precise document with a general one will always make the pilot look like it is "missing" things. It is not missing them. They have not been written yet.</p>

<h2>A caution about "faster"</h2>
<p>Some commentary suggests the pilot may process stronger candidates faster. IRCC has not said so, and the old programme published no processing time either, so "faster than what?" has no answer. We do not put any processing figure in the table for that reason.</p>

<h2>What to watch for</h2>
<p>When IRCC publishes the pilot's rules, the first things to compare are the same ones in this table: who backs the founder, what capital that backer must commit, what language level applies, and how many places exist. If any of those arrive, a blank in the table becomes a filled cell, with its source.</p>`,

  'fa-2-no-reservations': `
<h2>اگر پولی داده‌اید</h2>
<ul>
<li>همین حالا پرداخت‌های بعدی را متوقف کنید.</li>
<li>از طرف مقابل کتباً بخواهید صفحه‌ی IRCC را که چنین «جایی» را توضیح می‌دهد نشان دهد. اگر نتوانست، این جواب خودش نتیجه است.</li>
<li>همه‌ی مکاتبات، قراردادها و رسیدها را نگه دارید.</li>
<li>اگر با کارت یا از راه بانک پرداخته‌اید، با بانک تماس بگیرید و بپرسید چه راهی برای اعتراض به پرداخت دارد.</li>
</ul>

<h2>پرسشی که همه‌ی ادعاها را می‌سنجد</h2>
<p>«این را کجای canada.ca نوشته‌اند؟» اگر پاسخ یک صفحه‌ی مشخص با تاریخ نیست، ادعا رسمی نیست. این پرسش درباره‌ی هر رقم و هر وعده‌ی پایلوت جواب می‌دهد، چه از طرف شرکت باشد چه از طرف یک کانال یا گروه.</p>`,

  'en-3-prepare': `
<h2>A one-page evidence log</h2>
<p>The simplest useful tool is a single document that a stranger could audit. One row per claim, four columns:</p>
<table>
<thead><tr><th>Claim</th><th>Date</th><th>Source</th><th>Where the proof is</th></tr></thead>
<tbody>
<tr><td>Signed customer</td><td>When the contract was signed</td><td>Contract or signed order</td><td>The file or folder</td></tr>
<tr><td>Monthly revenue</td><td>The month</td><td>Bank or payment-processor statement</td><td>The exported statement</td></tr>
<tr><td>Product milestone</td><td>Release date</td><td>Release notes or repository history</td><td>The link or the file</td></tr>
<tr><td>Ownership</td><td>Date of the last change</td><td>Cap table and shareholder agreement</td><td>The signed documents</td></tr>
</tbody>
</table>
<p>It costs a few hours now and saves weeks when a programme finally asks. It also makes one thing obvious early: which of your claims you can prove and which you only believe.</p>`,

  'fa-3-certificate-holders': `
<h2>پرسش‌هایی که از سازمان حامی بپرسید</h2>
<p>سازمان تأییدشده‌ی شما بهترین منبع اطلاعات درباره‌ی وضعیت خودتان است. این‌ها را از او بپرسید و پاسخ را کتبی بگیرید:</p>
<ul>
<li>آیا گواهی شما به پرونده‌ی ثبت‌شده منجر شد یا نه؟ سند آن کجاست؟</li>
<li>آیا از پایلوت آینده اطلاعاتی دارند که منتشر نشده؟ اگر دارند، منبعش چیست؟ اگر منبع رسمی نیست، همان‌طور با آن رفتار کنید.</li>
<li>آیا تعهد مالی آنها هنوز برقرار است و تا چه زمانی؟ این برای هر مسیر بعدی مهم است، چه پایلوت و چه مسیری دیگر.</li>
</ul>
<p>پاسخی را که از ایشان می‌شنوید، با ادعای IRCC یکی نکنید. حرف سازمان حامی تا وقتی در صفحه‌ی رسمی نیامده، نظر یک نهاد خصوصی است.</p>`,

  'en-4-the-numbers': `
<h2>Three questions to ask of any number about the pilot</h2>
<ol>
<li><strong>Who published it?</strong> IRCC, or someone describing IRCC? A figure with no named source, however plausible, is not evidence.</li>
<li><strong>What does it measure?</strong> The 500 target is for all federal business programs together. It is not the pilot's cap. Mixing the two is the most common mistake we see.</li>
<li><strong>Would the decision change if it were wrong?</strong> If a number would move money or time, it needs an official source. If it would not, it can stay an interesting rumour.</li>
</ol>

<h2>Why the distinction matters</h2>
<p>A pause is a fact. A reason for the pause is IRCC's account. A table of admissions is someone else's compilation. A critique is an argument. A pilot's criteria are, so far, nothing. Treating all five as the same kind of thing is how a rumour about a cap becomes a plan.</p>`,

  'fa-4-rumoured-figures': `
<h2>سه پرسش برای هر عدد درباره‌ی پایلوت</h2>
<ol>
<li><strong>چه کسی منتشر کرده؟</strong> خود IRCC یا کسی که درباره‌ی IRCC نوشته؟ عددی که منبع مشخص ندارد، هرچند معقول به نظر برسد، سند نیست.</li>
<li><strong>دقیقاً چه چیزی را می‌سنجد؟</strong> هدف ۵۰۰ نفر برای همه‌ی برنامه‌های تجاری فدرال است، نه سقف پایلوت. خلط این دو رایج‌ترین اشتباه است.</li>
<li><strong>اگر غلط باشد، تصمیم عوض می‌شود؟</strong> اگر عددی پول یا زمان جابه‌جا می‌کند، منبع رسمی می‌خواهد. اگر نه، می‌تواند یک شایعه‌ی جالب بماند.</li>
</ol>

<h2>تفاوت این‌ها مهم است</h2>
<p>توقف یک واقعیت است. دلیل توقف، روایت IRCC است. جدول پذیرش‌ها گردآوری کس دیگری است. نقد RBC یک استدلال است. و شرایط پایلوت تا امروز هیچ است. اگر همه را یک نوع چیز بدانید، شایعه‌ی سقف به برنامه‌ی شما تبدیل می‌شود.</p>`,

  'en-5-wait-or-move': `
<h2>Three founders, three different answers</h2>
<ul>
<li><strong>Early stage, no revenue.</strong> Trade press expects a selective pilot. If that reading is right, you are the profile least likely to be helped by waiting. The better use of the time is building the traction that any programme will look for, and keeping an open route as the real plan.</li>
<li><strong>Funded, with customers and a clean company.</strong> You are the profile the pilot is expected to suit. You can afford to prepare and watch. Keep the evidence log current, time your language test to the opening, and keep an alternative alive in case 2027 slips.</li>
<li><strong>Time-constrained: a family deadline, a hire you cannot make without status, a market window.</strong> Do not build on an unpublished programme. Compare routes open today now; if the pilot opens in time, you can still look at it.</li>
</ul>
<p>None of these is advice for your case. They show the shape of the reasoning: waiting is a bet that makes sense when it is cheap to lose.</p>`,
};
