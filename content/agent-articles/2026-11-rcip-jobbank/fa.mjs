// گزارش‌های فارسی. خواننده: نیروی کار ماهر یا خانواده‌ای که می‌خواهد بین جامعه‌های
// RCIP و شغل‌ها انتخاب کند. فارسی نوشته شده، ترجمه نیست. همه‌ی عددها از stats.json.
import { S, SRC, INDEX, GUIDE, EYEBROW, CHART_SOURCE, PROVINCE, a, fmt, dv, path, by, community, sector, occ, sname, oname, cname, listDate, listLink, barChart, pairedBarChart, scrollTable } from './lib.mjs';

const L = 'fa';
const f = fmt(L);
const O = S.overall;
const X = S.original;
const T = S.templates;
const M = S.meta;
const tpl = (title) => T.by_title.find((t) => t.title === title);
const sig = T.signatures[0];
const C = (name) => community(name);
const N = (name) => cname(L, name);
const src = CHART_SOURCE[L];
const ltr = (s) => `<bdi dir="ltr">${s}</bdi>`;

const CATEGORY = 'Work & Skilled Immigration';
const TAGS = ['data-report', 'RCIP', 'برنامه مهاجرتی روستایی کانادا', 'Job Bank', 'کار در کانادا'];

// ── بخش‌های مشترک ────────────────────────────────────────────────────────────

const methodBox = () => `
<h2>روش کار و محدودیت‌ها</h2>
<ul>
<li><strong>فقط یک ماه.</strong> این‌ها آگهی‌هایی است که اولین بار در اکتبر ${f.plain(2026)} منتشر شده‌اند. یک ماه وضعیت را نشان می‌دهد، نه روند را؛ استخدام پاییز هم با بهار فرق دارد.</li>
<li><strong>نام کارفرما در داده نیست.</strong> داده‌ی باز Job Bank نمی‌گوید آگهی را چه کسی گذاشته است. می‌شود آگهی‌ها را بر اساس جامعه، صنعت و شغل شمرد، ولی نمی‌شود فهمید آگهی از کارفرمای تأییدشده است یا نه. آگهی‌ای که این‌جا شمرده شده پیشنهاد کار نیست.</li>
<li><strong>تشخیص محل.</strong> هر آگهی با نام استان و شهر به جامعه‌اش وصل شده است. ${f.n(M.rows_without_city)} آگهی در فایل سراسری شهر نداشت و به هیچ جامعه‌ای نسبت داده نشد.</li>
<li><strong>صنعت خیلی از آگهی‌ها معلوم نیست.</strong> ${f.n(O.unknown_industry_postings)} آگهی از ${f.n(O.postings)} آگهی (${f.pc(O.unknown_industry_share_pct)}) از سایت‌های کاریابی دیگر آمده و کد صنعت ندارد.</li>
<li><strong>دستمزدها کف هستند.</strong> از هر آگهی کمترین دستمزدی را که نوشته برداشته‌ایم و به ساعت تبدیل کرده‌ایم. در ${f.n(O.wide_range_postings)} آگهی، سقف بازه‌ی دستمزد دست‌کم یک‌ونیم برابر کف آن است؛ پس دستمزد واقعی می‌تواند بالاتر باشد. میانه‌ای که از کمتر از ${f.n(M.method.min_n_for_median)} دستمزد به دست آمده با علامت «نمونه‌ی کوچک» مشخص شده است.</li>
<li><strong>آگهی‌های فروش دورکاری حذف شده‌اند.</strong> ${f.n(T.postings)} آگهی در واقع یک آگهی فروش دورکاری بود که در شهرهای سراسر کانادا تکرار شده بود. این‌ها را جدا شمرده‌ایم و در هیچ رتبه‌بندی و میانه‌ای نیاورده‌ایم.</li>
<li><strong>ردیف فهرست، نه تعداد کارفرما.</strong> عدد ${f.n(S.listings.total)} تعداد ردیف‌های فهرست کارفرمایان تأییدشده در ۱۴ جامعه است، همان‌طور که ما خوانده‌ایم. بعضی کارفرماها بیش از یک ردیف دارند و تعداد نام‌های متمایز ${f.n(S.listings.unique_employer_names)} است. تاریخ فهرست‌ها هم یکسان نیست.</li>
</ul>`;

const sources = (extra = '') => `
<h2>منابع</h2>
<ul>
<li>${a(SRC.jobBank, 'داده‌ی باز Job Bank')} (${ltr('Job Postings Advertised on Canada\'s National Job Bank Website')})، وزارت اشتغال و توسعه‌ی اجتماعی کانادا (ESDC)، فایل اکتبر ${f.plain(2026)}. حاوی اطلاعاتی با مجوز ${a(SRC.ogl, 'Open Government Licence – Canada')}.</li>
<li>فهرست کارفرمایان تأییدشده که هر یک از ۱۴ جامعه منتشر کرده است؛ تاریخ هر فهرست در ${a(path(L, 1), 'جدول بخش اول')} آمده است.</li>
<li>اداره‌ی مهاجرت کانادا (IRCC): ${a(SRC.irccPilot, 'صفحه‌ی نسخه‌ی آزمایشی برنامه')} و ${a(SRC.irccProgram, 'صفحه‌ی برنامه‌ی دائمی')}.</li>${extra}
</ul>
<p>محاسبه‌ها از ماست. VisaRoads نماینده یا مشاور مهاجرتی نیست و این نوشته مشاوره‌ی مهاجرتی به شمار نمی‌آید.</p>`;

const seriesNote = (part) => {
  const items = [
    [1, 'کار کجاست؟ مقایسه‌ی ۱۴ جامعه'],
    [2, 'کدام شغل‌ها استخدام می‌کنند و چقدر می‌دهند؟'],
    [3, 'کارفرمایان تأییدشده در برابر آگهی‌های باز، به تفکیک صنعت'],
  ];
  const line = items
    .map(([n, title]) => (n === part ? `<li><strong>بخش ${f.plain(n)}: ${title}</strong> (همین صفحه)</li>` : n < part ? `<li>بخش ${f.plain(n)}: ${a(path(L, n), title)}</li>` : `<li>بخش ${f.plain(n)}: ${title}</li>`))
    .join('\n');
  return `
<h2>این مجموعه</h2>
<ul>
${line}
</ul>
<p>همه‌ی بخش‌ها و گزارش ماه‌های بعد در صفحه‌ی ${a(INDEX[L], 'گزارش‌های آماری')} فهرست می‌شوند.</p>`;
};

// ── بخش ۱ ────────────────────────────────────────────────────────────────────

function part1() {
  const cs = S.communities;
  const byVac = [...cs].sort(by('vacancies'));
  const byRate = [...cs].sort(by('postings_per_100_listings'));
  const nos = C('North Okanagan-Shuswap');
  const wk = C('West Kootenay');
  const sud = C('Sudbury');
  const tim = C('Timmins');
  const tb = C('Thunder Bay');
  const bra = C('Brandon');
  const mj = C('Moose Jaw');
  const nebc = C('Northeast BC (Peace Liard)');
  const nb = C('North Bay');
  const pic = C('Pictou County');
  const miners = occ('83100');
  const flag = (c) => (c.small_sample ? ' *' : '');

  const vacChart = barChart(
    byVac.map((c, i) => ({ label: N(c.name), value: c.vacancies, display: `${f.n(c.vacancies)} جای خالی · ${f.n(c.postings)} آگهی`, tone: i === 0 ? 'highlight' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'جای خالی آگهی‌شده در هر جامعه', caption: 'یک آگهی می‌تواند چند جای خالی داشته باشد. آگهی‌های فروش دورکاری حساب نشده‌اند.', source: src },
    L,
  );
  const rateChart = barChart(
    byRate.map((c, i) => ({ label: N(c.name), value: c.postings_per_100_listings, display: f.d(c.postings_per_100_listings), tone: i < 2 ? 'highlight' : c.postings < M.method.min_n_for_median ? 'hollow' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'آگهی به‌ازای هر ۱۰۰ ردیف فهرست کارفرمایان', caption: `سنجه‌ای تقریبی از داغی بازار کار نسبت به اندازه‌ی فهرست. میله‌های خط‌چین: کمتر از ${f.n(M.method.min_n_for_median)} آگهی.`, source: src },
    L,
  );

  const table = `
${scrollTable(`<table>
<thead><tr><th>جامعه</th><th>ردیف فهرست</th><th>آگهی</th><th>جای خالی</th><th>جای خالی در هر آگهی</th><th>میانه‌ی دستمزد (تعداد)</th><th>تمام‌وقت</th><th>آگهی در ۱۰۰ ردیف</th></tr></thead>
<tbody>
${byVac.map((c) => `<tr><td>${N(c.name)}، ${PROVINCE[L][c.province]}<br>${ltr(c.name)}</td><td>${f.n(c.listings)}</td><td>${f.n(c.postings)}</td><td>${f.n(c.vacancies)}</td><td>${f.r(c.vacancies_per_posting)}</td><td>${f.w(c.median_wage_hr)} (${f.n(c.wage_n)})${flag(c)}</td><td>${f.pc(c.full_time_share_pct)}</td><td>${f.d(c.postings_per_100_listings)}</td></tr>`).join('\n')}
<tr><td><strong>هر ۱۴ جامعه</strong></td><td><strong>${f.n(S.listings.total)}</strong></td><td><strong>${f.n(O.postings)}</strong></td><td><strong>${f.n(O.vacancies)}</strong></td><td><strong>${f.r(O.vacancies_per_posting)}</strong></td><td><strong>${f.w(O.median_wage_hr)} (${f.n(O.wage_n)})</strong></td><td><strong>${f.pc(O.full_time_share_pct)}</strong></td><td><strong>${f.d(O.postings_per_100_listings)}</strong></td></tr>
</tbody>
</table>`)}
<p>* کمتر از ${f.n(M.method.min_n_for_median)} دستمزد. این میانه را نشانه بگیرید، نه نرخ بازار.</p>`;

  const listTable = `
${scrollTable(`<table>
<thead><tr><th>جامعه</th><th>ردیف فهرست</th><th>نسخه‌ی فهرست</th><th>فهرست منتشرشده</th></tr></thead>
<tbody>
${cs.map((c) => `<tr><td>${N(c.name)}</td><td>${f.n(c.listings)}</td><td>${listDate(L, c.list_as_of)}</td><td>${a(listLink(c), ltr(new URL(c.list_source_url).hostname.replace(/^www\./, '')))}</td></tr>`).join('\n')}
</tbody>
</table>`)}`;

  const content = `
<p>وقتی بین چند شهر کوچک کانادا مردد هستید، اولین چیزی که می‌خواهید بدانید این است که کارفرماها واقعاً کجا آگهی می‌دهند. ما شمرده‌ایم. در اکتبر ${f.plain(2026)}، سایت Job Bank برای ۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا (RCIP) ${f.n(O.postings)} آگهی با ${f.n(O.vacancies)} جای خالی داشت. این عدد بعد از کنار گذاشتن ${f.n(T.postings)} نسخه از یک آگهی فروش دورکاری است. میانه‌ی دستمزد آگهی‌ها دست‌کم ${f.w(O.median_wage_hr)} در ساعت بود و ${f.pc(O.full_time_share_pct)} آن‌ها تمام‌وقت بودند.</p>
<p><strong>بیشترین جای خالی در ${N('North Okanagan-Shuswap')} در بریتیش کلمبیا بود: ${f.n(nos.vacancies)} جای خالی، یعنی نزدیک به یک‌چهارم کل (${f.pc(nos.share_of_vacancies_pct)}). بیشترین تعداد آگهی را ${N('Sudbury')} داشت، با ${f.n(sud.postings)} آگهی. نسبت به اندازه‌ی فهرست کارفرمایان تأییدشده، ${N('Brandon')} و ${N('Moose Jaw')} داغ‌ترین بازارها بودند و ${N('Thunder Bay')} از آرام‌ترین‌ها.</strong></p>
<p>این بخش اول از سه بخش است: جامعه‌ها را مقایسه می‌کند و می‌گوید داده از کجا آمده. بخش دوم سراغ شغل‌ها می‌رود و بخش سوم سراغ صنعت‌ها.</p>

<h2>چه چیزی را شمرده‌ایم؟</h2>
<p>دو منبع عمومی را کنار هم گذاشته‌ایم.</p>
<p>منبع اول ${a(SRC.jobBank, 'داده‌ی باز Job Bank')} است؛ فایل ماهانه‌ی آگهی‌های شغلی که وزارت اشتغال و توسعه‌ی اجتماعی کانادا با مجوز داده‌ی باز دولت منتشر می‌کند. فایل اکتبر برای کل کشور ${f.n(M.rows_in_national_file)} آگهی دارد. از این تعداد، ${f.n(M.matched_postings)} آگهی (${f.pc(M.matched_share_of_national_pct)}) به شهرهایی می‌رسد که ۱۴ جامعه‌ی RCIP را می‌سازند.</p>
<p>منبع دوم فهرست کارفرمایان تأییدشده‌ی هر جامعه است. در RCIP فقط پیشنهاد کار این کارفرماها به حساب می‌آید. روزی که فهرست‌ها را خواندیم، ۱۴ فهرست روی هم ${f.n(S.listings.total)} ردیف داشتند و اگر ردیف‌های تکراری شعبه‌ها را کنار بگذاریم، ${f.n(S.listings.unique_employer_names)} نام متمایز.</p>
<p>این دو منبع را نمی‌شود کارفرما به کارفرما به هم وصل کرد، چون داده‌ی باز نام کارفرما ندارد. پس این گزارش می‌گوید در هر جامعه چند شغل آگهی شده، در چه رشته‌هایی و با چه دستمزدی. نمی‌گوید کدام آگهی از کارفرمای تأییدشده است. این را خودتان باید پیش از هر اقدامی در فهرست جامعه نگاه کنید.</p>

<h2>کدام جامعه بیشترین جای خالی را داشت؟</h2>
${vacChart}
<p>سه نکته به چشم می‌آید.</p>
<p><strong>دو جامعه در مناطق داخلی بریتیش کلمبیا بزرگ‌اند.</strong> ${N('North Okanagan-Shuswap')} (شهرهای ورنون و سالمون آرم و اطرافشان) و ${N('West Kootenay')} با هم یک‌سوم همه‌ی جاهای خالی را دارند. بخشی از این عدد فصلی است: ${f.n(nos.seasonal_harvest_vacancies)} جای خالی در اولی و ${f.n(wk.seasonal_harvest_vacancies)} جای خالی در دومی برای برداشت محصول بود، و کار فصلی نمی‌تواند پیشنهاد کار RCIP باشد. بدون این‌ها هم ${f.n(nos.vacancies_excluding_harvest)} و ${f.n(wk.vacancies_excluding_harvest)} جای خالی باقی می‌ماند.</p>
<p><strong>${N('Timmins')} دسته‌جمعی استخدام می‌کند.</strong> فقط ${f.n(tim.postings)} آگهی داشت ولی ${f.n(tim.vacancies)} جای خالی؛ یعنی ${f.r(tim.vacancies_per_posting)} جای خالی در هر آگهی، که بین جامعه‌های بزرگ‌تر بالاترین نسبت است. دلیلش معدن است: ${f.n(miners.postings)} آگهی برای معدن‌کار زیرزمینی، هر کدام ${f.n(miners.largest_posting_vacancies)} نفر می‌خواست.</p>
<p><strong>بازار ${N('Sudbury')} پهن است، نه عمیق.</strong> در تعداد آگهی اول است (${f.n(sud.postings)}) ولی هر آگهی به‌طور میانگین ${f.r(sud.vacancies_per_posting)} جای خالی دارد: آگهی‌های زیاد، هر کدام برای یک نفر.</p>
${table}

<h2>کجا استخدام نسبت به فهرست کارفرمایان داغ‌تر است؟</h2>
<p>فهرست بلند کارفرمایان تأییدشده به معنی شغل باز زیاد نیست. اگر تعداد آگهی را بر تعداد ردیف‌های فهرست تقسیم کنیم، سنجه‌ای تقریبی به دست می‌آید.</p>
${rateChart}
<p>${N('Brandon')} به‌ازای هر ۱۰۰ ردیف فهرست ${f.d(bra.postings_per_100_listings)} آگهی داشت و ${N('Moose Jaw')} ${f.d(mj.postings_per_100_listings)} آگهی. در هر دو، بازار کار محلی از فهرست کارفرمایان تأییدشده بزرگ‌تر است؛ پس احتمالاً بخش قابل‌توجهی از آگهی‌ها مال کارفرماهایی است که تأییدشده نیستند. فهرست ${N('Brandon')} فقط ${f.n(bra.listings)} ردیف دارد.</p>
<p>${N('Thunder Bay')} برعکس است. بلندترین فهرست را دارد، با ${f.n(tb.listings)} ردیف، و فقط ${f.d(tb.postings_per_100_listings)} آگهی در هر ۱۰۰ ردیف. بخشی از دلیل در خود فهرست است: ${f.n(tb.listings_closed_to_new_applications)} ردیف، بیشترشان فست‌فود، پمپ‌بنزین و فروشگاه کوچک، زیر عنوان «تأییدشده، ولی فعلاً بیرون از RCIP سال ${f.plain(2026)}» آمده‌اند. ${N('North Okanagan-Shuswap')} هم کنار ${f.n(nos.listings_closed_to_new_applications)} ردیف فست‌فود و پمپ‌بنزین نوشته که فعلاً درخواست نمی‌پذیرد.</p>
<p>این سنجه را با احتیاط بخوانید. آگهی‌ها فقط مال کارفرمایان تأییدشده نیستند، حدود نیمی از آن‌ها کد صنعت ندارند و فهرست‌ها در تاریخ‌های متفاوتی خوانده شده‌اند.</p>

<h2>دستمزدها چه می‌گویند؟</h2>
<p>در مجموع ۱۴ جامعه، میانه‌ی دستمزد آگهی‌ها دست‌کم ${f.w(O.median_wage_hr)} در ساعت بود (از ${f.n(O.wage_n)} آگهی که دستمزد داشتند). بین جامعه‌هایی که نمونه‌ی کافی دارند، ${N('Northeast BC (Peace Liard)')} با ${f.w(nebc.median_wage_hr)} بالاترین بود و بعد از آن ${N('North Bay')} با ${f.w(nb.median_wage_hr)}. پایین‌ترین‌ها ${N('Pictou County')} (${f.w(pic.median_wage_hr)}) و ${N('Brandon')} (${f.w(bra.median_wage_hr)}) بودند.</p>
<p>سه جامعه آن‌قدر آگهی ندارند که بشود درباره‌ی دستمزدشان حرفی زد: ${N('Altona/Rhineland')} (${f.n(C('Altona/Rhineland').wage_n)} آگهی)، ${N('Claresholm')} (${f.n(C('Claresholm').wage_n)}) و ${N('Steinbach')} (${f.n(C('Steinbach').wage_n)}). میانه‌ی آن‌ها فقط برای کامل بودن جدول آمده است.</p>
<p>این عددها کمترین دستمزدی است که آگهی‌ها نوشته‌اند، نه حقوقی که مردم می‌گیرند. میانه‌ی هر جامعه هم بیشتر نشان می‌دهد آن ماه چه شغل‌هایی آگهی شده‌اند. مقایسه‌ی منصفانه‌تر، مقایسه‌ی شغل به شغل است که در بخش دوم می‌آید.</p>

<h2>چه چیزی را حذف کردیم و چقدر فرق کرد؟</h2>
<p>عددهای خام از یک جهت مشخص گمراه‌کننده بودند. ${f.n(tpl('inside sales representative').postings)} آگهی در هر ۱۴ جامعه یک عنوان داشتند، «inside sales representative»، و یک حقوق که تا دلار آخرش یکی بود: ${f.n(Number(sig.salary.split(' ')[0]))} دلار در سال، یعنی ${f.w(sig.wage_hr)} در ساعت. همین آگهی در فایل سراسری ${f.n(sig.national_postings)} بار تکرار شده، در ${f.n(sig.national_cities)} شهر از ${f.n(sig.national_provinces)} استان و قلمرو، و عنوان اصلی‌اش با کلمه‌ی «Remote» شروع می‌شود. ${f.n(dv(T.postings - tpl('inside sales representative').postings, 'templates.postings minus the inside-sales postings'))} آگهی دیگر هم یک آگهی فروش از خانه بود که زیر عنوان‌های «informatics consultant» و «retail sales representative» ثبت شده بود.</p>
<p>این‌ها شغل محلی نیستند. قاعده‌ی ما این است: آگهی‌ای که از سایت کاریابی دیگری آمده، اگر با همان عنوان و همان حقوق ثابت دست‌کم در ${f.n(M.method.template_min_provinces)} استان و ${f.n(M.method.template_min_cities)} شهر فایل سراسری تکرار شده باشد، کنار گذاشته می‌شود. بعد فهرست را دستی هم مرور کرده‌ایم.</p>
${scrollTable(`<table>
<thead><tr><th></th><th>پیش از پاک‌سازی</th><th>پس از پاک‌سازی</th></tr></thead>
<tbody>
<tr><td>آگهی</td><td>${f.n(X.postings)}</td><td>${f.n(O.postings)}</td></tr>
<tr><td>جای خالی</td><td>${f.n(X.vacancies)}</td><td>${f.n(O.vacancies)}</td></tr>
<tr><td>میانه‌ی دستمزد</td><td>${f.w(X.median_wage_hr)}</td><td>${f.w(O.median_wage_hr)}</td></tr>
<tr><td>تمام‌وقت</td><td>${f.pc(X.full_time_share_pct)}</td><td>${f.pc(O.full_time_share_pct)}</td></tr>
<tr><td>آگهی در ۱۰۰ ردیف فهرست</td><td>${f.d(X.postings_per_100_listings)}</td><td>${f.d(O.postings_per_100_listings)}</td></tr>
<tr><td>شغل اول از نظر جای خالی</td><td>فروشنده‌ی خرده‌فروشی، با میانه‌ی ${f.w(X.top_occupation.median_wage_hr)}</td><td>کارگر برداشت محصول (فصلی) و بعد راننده‌ی کامیون</td></tr>
</tbody>
</table>`)}
<p>تکرارهایی که به استخدام واقعی می‌خورد سر جایشان ماندند. دستمزد یکسان صندوق‌دار در پنج جامعه‌ی شمال انتاریو، آن هم در هشت تاریخ مختلف، استخدام عادی فروشگاه‌هاست، نه آگهی کپی‌شده.</p>

<h2>اگر دارید جامعه انتخاب می‌کنید، با این عددها چه کنید؟</h2>
<ul>
<li><strong>از فهرست کارفرمایان تأییدشده شروع کنید، نه از Job Bank.</strong> فقط پیشنهاد کارفرمای تأییدشده به حساب می‌آید. لینک فهرست‌ها پایین‌تر آمده است.</li>
<li><strong>به شکل شغل نگاه کنید.</strong> به گفته‌ی IRCC، پیشنهاد کار RCIP باید تمام‌وقت، غیرفصلی و بدون تاریخ پایان باشد. از ${f.n(O.postings)} آگهی، ${f.n(O.permanent_full_time_postings)} آگهی (${f.pc(O.permanent_full_time_share_pct)}) هم «تمام‌وقت» نوشته بودند و هم «دائمی»؛ ${f.n(O.term_not_stated_postings)} آگهی اصلاً نوع قرارداد را ننوشته بودند. شرط‌های کامل را در راهنمای ${a(GUIDE[L].rules, 'قواعد پیشنهاد کار RCIP')} نوشته‌ایم.</li>
<li><strong>با یک ماه، جامعه‌ها را رتبه‌بندی نکنید.</strong> جامعه‌ای که در اکتبر آرام است شاید بهار استخدام کند. این شمارش را هر ماه تکرار می‌کنیم تا الگو دیده شود.</li>
<li><strong>برنامه دائمی می‌شود.</strong> به گفته‌ی IRCC نسخه‌ی آزمایشی روز ${f.plain(1)} ژانویه‌ی ${f.plain(2027)} بسته می‌شود و برنامه‌ی دائمی همان روز شروع می‌شود؛ IRCC گفته قصد دارد با همان ۱۴ جامعه ادامه دهد. جزئیاتش را در ${a(GUIDE[L].permanent, 'این نوشته')} بخوانید.</li>
</ul>

<h2>فهرست هر جامعه کجاست؟</h2>
<p>هر جامعه فهرست خودش را منتشر می‌کند و هر وقت بخواهد به‌روزش می‌کند. شمارش ما از این نسخه‌هاست. تاریخ همان است که روی فهرست یا در نام فایلش آمده؛ اگر فهرست تاریخ نداشته، تاریخ نسخه‌ای است که ما خوانده‌ایم.</p>
${listTable}
<p>فهرست ${N('Claresholm')} وقتی آن را خواندیم تاریخ ژوئن ${f.plain(2025)} داشت و فهرست ${N('Altona/Rhineland')} تاریخ نداشت؛ پس تعداد ردیف‌های این دو ممکن است قدیمی باشد.</p>
${methodBox()}
${seriesNote(1)}
${sources()}`;

  return {
    file: 'fa-1-communities',
    part: 1,
    locale: L,
    slug: path(L, 1).split('/').pop(),
    title: 'بازار کار RCIP در اکتبر ۲۰۲۶: در ۱۴ جامعه‌ی برنامه، کار کجاست؟',
    excerpt: `در اکتبر ۲۰۲۶، Job Bank برای ۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا ${f.n(O.postings)} آگهی با ${f.n(O.vacancies)} جای خالی داشت. کدام جامعه‌ها بیشتر آگهی دادند، چقدر دستمزد نوشتند و این عددها کنار فهرست کارفرمایان تأییدشده چه معنایی دارد.`,
    category: CATEGORY,
    tags: TAGS,
    keyTakeaway: `در اکتبر ۲۰۲۶، پس از حذف ${f.n(T.postings)} آگهی کپی‌شده‌ی فروش دورکاری، Job Bank برای ۱۴ جامعه‌ی RCIP ${f.n(O.postings)} آگهی با ${f.n(O.vacancies)} جای خالی داشت. بیشترین جای خالی در ${N('North Okanagan-Shuswap')} بود (${f.n(nos.vacancies)}) و بیشترین آگهی در ${N('Sudbury')} (${f.n(sud.postings)}). میانه‌ی دستمزد آگهی‌ها دست‌کم ${f.w(O.median_wage_hr)} در ساعت بود. داده‌ی باز نام کارفرما ندارد؛ پس آگهی نشانه‌ی کارفرمای تأییدشده نیست.`,
    summaryEn: `Persian monthly data report comparing the 14 Rural Community Immigration Pilot communities with Job Bank open data for October 2026 and each community's designated-employer list: postings, vacancies, median wage, full-time share, postings per 100 listings, and the cleaning method and limits.`,
    faq: [
      { q: 'در اکتبر ۲۰۲۶ کدام جامعه‌ی RCIP بیشترین جای خالی را داشت؟', a: `${N('North Okanagan-Shuswap')} در بریتیش کلمبیا، با ${f.n(nos.vacancies)} جای خالی از ${f.n(nos.postings)} آگهی Job Bank. ${f.n(nos.seasonal_harvest_vacancies)} مورد از این جاهای خالی کار فصلی برداشت محصول بود.` },
      { q: 'آگهی Job Bank در یک جامعه‌ی RCIP یعنی کارفرما تأییدشده است؟', a: 'نه. داده‌ی باز Job Bank نام کارفرما ندارد و آگهی را نمی‌شود به کارفرمای تأییدشده وصل کرد. فهرست کارفرمایان تأییدشده را در سایت خود جامعه نگاه کنید.' },
      { q: '۱۴ جامعه‌ی RCIP چند کارفرمای تأییدشده دارند؟', a: `فهرست‌های ۱۴ جامعه، روزی که ما خواندیم، روی هم ${f.n(S.listings.total)} ردیف و ${f.n(S.listings.unique_employer_names)} نام متمایز داشتند. تاریخ فهرست‌ها یکسان نیست.` },
      { q: 'دستمزد شغل‌ها در جامعه‌های RCIP چقدر است؟', a: `میانه‌ی کمترین دستمزدی که آگهی‌های اکتبر ۲۰۲۶ نوشته بودند ${f.w(O.median_wage_hr)} در ساعت بود. این عدد کف دستمزد آگهی‌هاست، نه میانگین حقوق.` },
    ],
    internalLinks: [INDEX[L], GUIDE[L].rules, GUIDE[L].permanent],
    content,
  };
}

// ── بخش ۲ ────────────────────────────────────────────────────────────────────

function part2() {
  const occs = S.occupations;
  const K = S.clusters;
  const KC = S.clusters_combined;
  const harvest = occ('85101');
  const truck = occ('73300');
  const retail = occ('64100');
  const miners = occ('83100');
  const hdm = occ('72401');
  const lpn = occ('32101');
  const cooks = occ('63200');
  const fss = occ('62020');
  const scw = occ('42201');
  const farm = occ('84120');
  const teer = (t) => S.teer.find((x) => x.teer === t);
  const top = occs.slice(0, 15);
  const flag = (o) => (o.small_sample ? ' *' : '');

  const occChart = barChart(
    top.map((o) => ({ label: oname(L, o), value: o.vacancies, display: `${f.n(o.vacancies)} · ${f.w(o.median_wage_hr)}`, tone: o.seasonal ? 'hollow' : o.cluster ? 'highlight' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'شغل‌هایی با بیشترین جای خالی', caption: 'تعداد جای خالی و میانه‌ی کف دستمزد ساعتی. میله‌های روشن در سه گروه پایدار هستند؛ میله‌ی خط‌چین کار فصلی برداشت محصول است.', source: src },
    L,
  );
  const clusterRow = (label, k) => `<tr><td>${label}</td><td>${f.n(k.postings)}</td><td>${f.n(k.vacancies)}</td><td>${f.w(k.median_wage_hr)} (${f.n(k.wage_n)})</td><td>${f.pc(k.full_time_share_pct)}</td><td>${f.n(k.communities)}</td></tr>`;

  const content = `
<p>بخش اول این مجموعه نشان داد در اکتبر ${f.plain(2026)} در ۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا (RCIP) کجا آگهی شغل بوده است. سؤال این بخش برای بیشتر خواننده‌ها مهم‌تر است: در چه شغل‌هایی؟</p>
<p><strong>کمی بیش از نیمی از ${f.n(O.postings)} آگهی (${f.pc(KC.share_of_postings_pct)}) در سه گروه جا می‌گیرد: حرفه‌های فنی و حمل‌ونقل، خدمات غذایی، و سلامت و خدمات اجتماعی. گروه فنی و حمل‌ونقل از همه بزرگ‌تر است و میانه‌ی دستمزدش دست‌کم ${f.w(K.trades_transport.median_wage_hr)} در ساعت. خدمات غذایی از همه فراگیرتر است و کمترین دستمزد را دارد: ${f.w(K.food_service.median_wage_hr)}.</strong></p>
<p>شمارش از داده‌ی باز Job Bank است و ${f.n(T.postings)} آگهی کپی‌شده‌ی فروش دورکاری از آن کنار گذاشته شده. شغل‌ها با ${a(SRC.noc, 'طبقه‌بندی ملی مشاغل کانادا (NOC 2021)')} کدگذاری شده‌اند.</p>

<h2>کدام شغل‌ها بیشترین جای خالی را داشتند؟</h2>
${occChart}
${scrollTable(`<table>
<thead><tr><th>NOC</th><th>شغل</th><th>TEER</th><th>آگهی</th><th>جای خالی</th><th>میانه‌ی دستمزد (تعداد)</th><th>تعداد جامعه</th></tr></thead>
<tbody>
${top.map((o) => `<tr><td>${ltr(o.noc)}</td><td>${oname(L, o)}${o.seasonal ? ' (فصلی)' : ''}</td><td>${f.plain(o.teer)}</td><td>${f.n(o.postings)}</td><td>${f.n(o.vacancies)}</td><td>${f.w(o.median_wage_hr)} (${f.n(o.wage_n)})${flag(o)}</td><td>${f.n(o.communities)}</td></tr>`).join('\n')}
</tbody>
</table>`)}
<p>* کمتر از ${f.n(M.method.min_n_for_median)} دستمزد: میانه را فقط نشانه بگیرید.</p>
<p>پیش از هر چیز، دو ردیف این جدول هشدار لازم دارد.</p>
<p><strong>کارگر برداشت محصول بالای جدول است و باید کنارش گذاشت.</strong> ${f.n(harvest.postings)} آگهی ${f.n(harvest.vacancies)} نفر می‌خواست (یکی‌شان به‌تنهایی ${f.n(harvest.largest_posting_vacancies)} نفر) و همه در ${f.n(harvest.communities)} جامعه در مناطق داخلی بریتیش کلمبیا. این کار باغ میوه و تاکستان است و با فصل می‌آید و می‌رود. طبق قواعد IRCC پیشنهاد کار RCIP باید غیرفصلی باشد؛ پس این جاهای خالی، هر قدر هم زیاد، بیرون از برنامه‌اند.</p>
<p><strong>معدن‌کار زیرزمینی یک نوبت استخدام است، نه یک بازار.</strong> هر ${f.n(miners.vacancies)} جای خالی از ${f.n(miners.postings)} آگهی در ${f.n(miners.communities)} جامعه آمده، هر آگهی برای ${f.n(miners.largest_posting_vacancies)} نفر و با ${f.w(miners.median_wage_hr)} در ساعت. تقاضا واقعی است و دستمزدش خوب، ولی ممکن است ماه بعد اثری از آن نباشد.</p>

<h2>سه گروه پایدار کدام‌اند؟</h2>
<p>اگر جهش‌های یک‌باره را کنار بگذاریم، همین سه گروه در بیشتر جامعه‌ها تکرار می‌شوند.</p>
${scrollTable(`<table>
<thead><tr><th>گروه</th><th>آگهی</th><th>جای خالی</th><th>میانه‌ی دستمزد (تعداد)</th><th>تمام‌وقت</th><th>تعداد جامعه (از ۱۴)</th></tr></thead>
<tbody>
${clusterRow('حرفه‌های فنی و حمل‌ونقل', K.trades_transport)}
${clusterRow('خدمات غذایی', K.food_service)}
${clusterRow('سلامت و خدمات اجتماعی', K.health_social)}
</tbody>
</table>`)}
<p><strong>حرفه‌های فنی و حمل‌ونقل</strong> بزرگ‌ترین گروه است و تنها گروهی که در هر ۱۴ جامعه آگهی دارد؛ ${f.pc(K.trades_transport.full_time_share_pct)} آگهی‌هایش هم تمام‌وقت است. راننده‌ی کامیون در صدر است (${f.n(truck.vacancies)} جای خالی، میانه‌ی ${f.w(truck.median_wage_hr)}) و بعد مکانیک ماشین‌آلات سنگین (${f.n(hdm.vacancies)} جای خالی، ${f.w(hdm.median_wage_hr)})، مکانیک خودرو و کامیون، کارگر ساختمانی، نجار و جوشکار. چند تا از این حرفه‌ها در کانادا گواهی حرفه‌ای می‌خواهند. گرفتن این گواهی مسیری جدا از مهاجرت است و استان به استان فرق می‌کند.</p>
<p>آگهی‌های <strong>خدمات غذایی</strong> از همه پراکنده‌ترند. آشپز (${f.n(cooks.postings)} آگهی در ${f.n(cooks.communities)} جامعه) و سرپرست خدمات غذایی (${f.n(fss.postings)} آگهی در ${f.n(fss.communities)} جامعه) تقریباً همه‌جا آگهی دارند، با میانه‌ی ${f.w(cooks.median_wage_hr)} در ساعت. دو احتیاط لازم است: این‌ها پایین‌ترین دستمزدهای جدول‌اند، و دست‌کم دو جامعه در فهرست خودشان فست‌فودها را کنار گذاشته‌اند (بخش اول را ببینید).</p>
<p><strong>سلامت و خدمات اجتماعی</strong> کمتر از وزنی که در فهرست کارفرمایان تأییدشده دارد آگهی داده و فقط ${f.pc(K.health_social.full_time_share_pct)} آگهی‌هایش تمام‌وقت است. میانه‌ی دستمزد پرستار عملی (LPN) ${f.w(lpn.median_wage_hr)} است و مددکار خدمات اجتماعی ${f.w(scw.median_wage_hr)}. این داده دلیلش را نمی‌گوید. بعضی کارفرمایان سلامت در سایت خودشان آگهی می‌دهند؛ صفحه‌ی استخدامشان را هم ببینید.</p>

<h2>فروشنده‌ی خرده‌فروشی که اول بود چه شد؟</h2>
<p>در داده‌ی خام، شغل اول فروشنده‌ی خرده‌فروشی بود: ${f.n(X.top_occupation.postings)} آگهی با میانه‌ی دستمزد ${f.w(X.top_occupation.median_wage_hr)} در ساعت. این عدد را همان آگهی فروش دورکاری ساخته بود که در بخش اول توضیح دادیم. بعد از حذف آن، فروشنده‌ی خرده‌فروشی ${f.n(retail.postings)} آگهی و ${f.n(retail.vacancies)} جای خالی دارد، با میانه‌ی ${f.w(retail.median_wage_hr)}. این دستمزد عادی یک فروشگاه است و جایش در جدول پنجم است، نه اول.</p>

<h2>سطح مهارت شغل چه ربطی به RCIP دارد؟</h2>
<p>هر کد NOC در یکی از دسته‌های TEER از ۰ تا ۵ است (آموزش، تحصیل، تجربه و مسئولیت). طبق قواعد IRCC، TEER شغلی که به شما پیشنهاد می‌شود هم ${a(SRC.irccLanguage, 'حداقل نمره‌ی زبان')} را تعیین می‌کند و هم این‌که ${a(SRC.irccWorkExp, 'کدام سابقه‌ی کار قبول است')}.</p>
${scrollTable(`<table>
<thead><tr><th>TEER شغل</th><th>سهم از آگهی‌ها</th><th>جای خالی</th><th>حداقل سطح زبان (IRCC)</th></tr></thead>
<tbody>
<tr><td>۰ و ۱</td><td>${f.pc(teer(0).share_pct)} و ${f.pc(teer(1).share_pct)}</td><td>${f.n(teer(0).vacancies)} و ${f.n(teer(1).vacancies)}</td><td>${ltr('CLB 6')}</td></tr>
<tr><td>۲ و ۳</td><td>${f.pc(teer(2).share_pct)} و ${f.pc(teer(3).share_pct)}</td><td>${f.n(teer(2).vacancies)} و ${f.n(teer(3).vacancies)}</td><td>${ltr('CLB 5')}</td></tr>
<tr><td>۴ و ۵</td><td>${f.pc(teer(4).share_pct)} و ${f.pc(teer(5).share_pct)}</td><td>${f.n(teer(4).vacancies)} و ${f.n(teer(5).vacancies)}</td><td>${ltr('CLB 4')}</td></tr>
</tbody>
</table>`)}
<p>نزدیک به نیمی از آگهی‌ها در TEER ۲ و ۳ است؛ یعنی حرفه‌های فنی، سرپرست‌ها و شغل‌های تکنیسینی. برای شغل TEER ۵، IRCC فقط سابقه‌ی کار در همان کد پنج‌رقمی NOC را می‌پذیرد. پس این راه از آن‌چه نمره‌ی پایین زبانش نشان می‌دهد باریک‌تر است. جدول تطبیق سابقه‌ی کار را در راهنمای ${a(GUIDE[L].rules, 'قواعد پیشنهاد کار RCIP')} آورده‌ایم.</p>

<h2>آگهی در یکی از این شغل‌ها یعنی واجد شرایط RCIP؟</h2>
<p>به‌تنهایی نه. بین یک آگهی و پیشنهاد کاری که به درد RCIP بخورد چهار آزمون هست و این داده فقط درباره‌ی اولی چیزی می‌گوید.</p>
<ol>
<li><strong>شکل شغل.</strong> ${a(SRC.irccCandidate, 'به گفته‌ی IRCC')} پیشنهاد باید تمام‌وقت باشد (دست‌کم ۳۰ ساعت کار با حقوق در هفته)، غیرفصلی و بدون تاریخ پایان. ${f.pc(O.permanent_full_time_share_pct)} آگهی‌ها هم «تمام‌وقت» نوشته بودند و هم «دائمی».</li>
<li><strong>کارفرما.</strong> فقط کارفرمای تأییدشده می‌تواند پیشنهاد بدهد. داده‌ی باز نام کارفرما ندارد و ما نمی‌توانیم بگوییم کدام آگهی از این آزمون رد می‌شود.</li>
<li><strong>اولویت‌های جامعه.</strong> هر جامعه بخش‌ها و شغل‌های اولویت‌دار خودش را دارد و ${a(SRC.irccJobOffer, 'فقط در همان‌ها توصیه‌نامه می‌دهد')}. ما آگهی‌ها را با فهرست اولویت ۱۴ جامعه تطبیق نداده‌ایم و این فهرست‌ها عوض هم می‌شوند. پیش از تکیه بر هر شغلی از این گزارش، فهرست فعلی جامعه‌ی خودتان را بخوانید.</li>
<li><strong>دستمزد.</strong> طبق ${a(SRC.irccImm0247, 'راهنمای فرم پیشنهاد کار IRCC')}، دستمزد پیشنهادی با نرخ Job Bank برای همان شغل و همان منطقه سنجیده می‌شود. میانه‌های این گزارش کف دستمزدی است که آگهی‌ها نوشته‌اند و آن نرخ مرجع نیست.</li>
</ol>
<p>یک ردیف دیگر را هم با احتیاط بخوانید: ${f.n(farm.vacancies)} جای خالی «کارگر دامداری و اپراتور ماشین کشاورزی» فقط از یک آگهی آمده است.</p>
${methodBox()}
${seriesNote(2)}
${sources(`\n<li>وزارت اشتغال و توسعه‌ی اجتماعی کانادا: ${a(SRC.noc, 'طبقه‌بندی ملی مشاغل ۲۰۲۱ (NOC)')}.</li>`)}`;

  return {
    file: 'fa-2-occupations',
    part: 2,
    locale: L,
    slug: path(L, 2).split('/').pop(),
    title: 'بازار کار RCIP در اکتبر ۲۰۲۶: کدام شغل‌ها استخدام می‌کنند و چقدر می‌دهند؟',
    excerpt: `حرفه‌های فنی و حمل‌ونقل، خدمات غذایی، و سلامت و خدمات اجتماعی روی هم ${f.pc(KC.share_of_postings_pct)} آگهی‌های Job Bank در ۱۴ جامعه‌ی RCIP را می‌سازند. جای خالی و دستمزد شغل‌های اول جدول، و این‌که آگهی درباره‌ی واجد شرایط بودن چه می‌گوید و چه نمی‌گوید.`,
    category: CATEGORY,
    tags: [...TAGS, 'NOC 2021', 'TEER'],
    keyTakeaway: `از ${f.n(O.postings)} آگهی Job Bank در ۱۴ جامعه‌ی RCIP در اکتبر ۲۰۲۶، ${f.pc(KC.share_of_postings_pct)} در سه گروه بود: حرفه‌های فنی و حمل‌ونقل (میانه‌ی دستمزد دست‌کم ${f.w(K.trades_transport.median_wage_hr)} در ساعت)، خدمات غذایی (${f.w(K.food_service.median_wage_hr)}) و سلامت و خدمات اجتماعی (${f.w(K.health_social.median_wage_hr)}). بیشترین جای خالی مال کارگر برداشت محصول بود (${f.n(harvest.vacancies)})، ولی این کار فصلی است و پیشنهاد کار RCIP نمی‌تواند فصلی باشد. تا کارفرما، فهرست اولویت جامعه و دستمزد بررسی نشود، آگهی پیشنهاد واجد شرایط نیست.`,
    summaryEn: `Persian data report on the occupations (NOC 2021) advertised on Job Bank in the 14 Rural Community Immigration Pilot communities in October 2026: top occupations by vacancies with median minimum wages and sample sizes, three steady groups, the TEER distribution, and the IRCC tests a posting must still pass.`,
    faq: [
      { q: 'در جامعه‌های RCIP چه شغل‌هایی بیشتر تقاضا دارند؟', a: `در اکتبر ۲۰۲۶، اگر کار فصلی برداشت محصول را کنار بگذاریم، بیشترین جای خالی مال راننده‌ی کامیون (${f.n(truck.vacancies)})، سرپرست خدمات غذایی (${f.n(fss.vacancies)}) و آشپز (${f.n(cooks.vacancies)}) بود. شمارش از آگهی‌های Job Bank در ۱۴ جامعه است.` },
      { q: 'دستمزد حرفه‌های فنی در جامعه‌های RCIP چقدر است؟', a: `میانه‌ی کف دستمزد آگهی‌های گروه فنی و حمل‌ونقل ${f.w(K.trades_transport.median_wage_hr)} در ساعت بود (${f.n(K.trades_transport.wage_n)} آگهی). مکانیک ماشین‌آلات سنگین ${f.w(hdm.median_wage_hr)} و راننده‌ی کامیون ${f.w(truck.median_wage_hr)}.` },
      { q: 'کار فصلی کشاورزی به RCIP می‌رسد؟', a: 'نه. به گفته‌ی IRCC پیشنهاد کار RCIP باید غیرفصلی، تمام‌وقت و بدون تاریخ پایان باشد. آگهی‌های برداشت محصول در این گزارش شمرده شده‌اند ولی با برچسب «فصلی».' },
      { q: 'شغلی که در این فهرست هست خودبه‌خود واجد شرایط RCIP است؟', a: 'نه. کارفرما باید تأییدشده‌ی جامعه باشد، شغل باید در اولویت‌های همان جامعه باشد و دستمزد باید به نرخ Job Bank برای آن شغل و منطقه برسد.' },
    ],
    internalLinks: [INDEX[L], path(L, 1), GUIDE[L].rules],
    content,
  };
}

// ── بخش ۳ ────────────────────────────────────────────────────────────────────

function part3() {
  const secs = S.sectors;
  const U = S.sector_unknown;
  const food = sector('72');
  const health = sector('62');
  const retail = sector('44-45');
  const constr = sector('23');
  const manuf = sector('31-33');
  const whole = sector('41');
  const prof = sector('54');
  const admin = sector('56');
  const other = sector('81');
  const transp = sector('48-49');
  const mining = sector('21');
  const pub = sector('91');
  const agri = sector('11');
  const flag = (s) => (s.small_sample ? ' *' : '');
  const main = secs.filter((s) => s.listings >= 80 || ['21', '91', '11'].includes(s.code));

  const chart = pairedBarChart(
    main.map((s) => ({ label: sname(L, s), a: s.listing_share_pct, b: s.posting_share_of_known_pct, aDisplay: f.pc(s.listing_share_pct), bDisplay: f.pc(s.posting_share_of_known_pct) })),
    { a: 'سهم از ردیف‌های فهرست', b: 'سهم از آگهی‌ها' },
    { eyebrow: EYEBROW[L], title: 'فهرست کارفرمایان تأییدشده در برابر آگهی‌ها، به تفکیک صنعت', caption: 'سهم هر صنعت از ردیف‌های دسته‌بندی‌شده‌ی فهرست و از آگهی‌هایی که صنعت دارند. هر جا میله‌ی روشن بلندتر است، استخدام از فهرست جلوتر است.', source: src },
    L,
  );

  const content = `
<p>۱۴ جامعه‌ی برنامه‌ی مهاجرتی روستایی کانادا (RCIP) فهرست کارفرمایان تأییدشده منتشر می‌کنند؛ فقط پیشنهاد کار همین کارفرماها به حساب می‌آید. Job Bank هم نشان می‌دهد چه کسانی آگهی می‌دهند. اگر این دو را به تفکیک صنعت کنار هم بگذاریم، معلوم می‌شود فهرست کجا بلند ولی آرام است و استخدام کجا از فهرست جلو زده.</p>
<p><strong>«اقامت و غذا» در هر دو طرف بزرگ‌ترین صنعت است: ${f.n(food.listings)} ردیف فهرست و ${f.n(food.postings)} آگهی از آگهی‌هایی که صنعتشان معلوم است. «سلامت» دومین گروه بزرگ کارفرمایان تأییدشده است ولی در Job Bank کم آگهی می‌دهد. معدن، حمل‌ونقل، کشاورزی و اداره‌های محلی بیش از جای کوچکشان در فهرست‌ها جای خالی آگهی کرده‌اند.</strong></p>
<p>این بخش سوم گزارش اکتبر ${f.plain(2026)} است. پیش از عددها یک احتیاط: این دو منبع را نمی‌شود کارفرما به کارفرما به هم وصل کرد و ${f.pc(O.unknown_industry_share_pct)} آگهی‌ها اصلاً صنعت ندارند. پس همه‌ی نسبت‌های پایین از واقعیت کمترند. این جدول برای مقایسه‌ی صنعت‌ها با هم است، نه برای اندازه گرفتن یک صنعت.</p>

<h2>دو طرف را چطور هم‌تراز کردیم؟</h2>
<p>هر دو طرف را به بخش‌های ${a(SRC.naics, 'طبقه‌بندی صنایع آمریکای شمالی (NAICS)')} برده‌ایم. آگهی‌های Job Bank گاهی برچسب بخش دارند و گاهی زیربخش؛ برای همین «تعمیر و نگهداری» و «خدمات شخصی» را در «خدمات دیگر» گذاشته‌ایم و «خدمات کاریابی» و «مدیریت پسماند» را در خدمات اداری و پشتیبانی. طرف کارفرماها کار خود ماست: هر ردیف فهرست را از روی نام و اطلاعات عمومی کسب‌وکار به یک بخش نسبت داده‌ایم و ${f.n(S.listings.unclassified)} ردیف از ${f.n(S.listings.total)} ردیف دسته‌بندی نشد.</p>
<p>پیش از این هم‌ترازسازی، نسخه‌ی اول جدول نشان می‌داد معدن هیچ کارفرمای تأییدشده‌ای ندارد؛ فقط چون دو منبع نام این بخش را دو جور نوشته‌اند. معدن ${f.n(mining.listings)} ردیف در فهرست‌ها دارد.</p>

<h2>صنعت به صنعت، فهرست و آگهی کجا هستند؟</h2>
${chart}
${scrollTable(`<table>
<thead><tr><th>صنعت (بخش NAICS)</th><th>ردیف فهرست</th><th>سهم از فهرست</th><th>آگهی</th><th>جای خالی</th><th>آگهی در ۱۰۰ ردیف</th><th>میانه‌ی دستمزد (تعداد)</th></tr></thead>
<tbody>
${secs.map((s) => `<tr><td>${sname(L, s)}</td><td>${f.n(s.listings)}</td><td>${f.pc(s.listing_share_pct)}</td><td>${f.n(s.postings)}</td><td>${f.n(s.vacancies)}</td><td>${f.d(s.postings_per_100_listings)}</td><td>${s.wage_n ? `${f.w(s.median_wage_hr)} (${f.n(s.wage_n)})${flag(s)}` : 'ندارد'}</td></tr>`).join('\n')}
<tr><td>صنعت نامشخص</td><td>${f.n(U.listings)}</td><td></td><td>${f.n(U.postings)}</td><td>${f.n(U.vacancies)}</td><td></td><td></td></tr>
</tbody>
</table>`)}
<p>* کمتر از ${f.n(M.method.min_n_for_median)} دستمزد: فقط نشانه.</p>

<h2>کجا فهرست بلند است ولی استخدام آرام؟</h2>
<p><strong>سلامت و خدمات اجتماعی.</strong> ${f.n(health.listings)} ردیف فهرست (${f.pc(health.listing_share_pct)}) ولی ${f.n(health.postings)} آگهی؛ یعنی ${f.d(health.postings_per_100_listings)} آگهی در هر ۱۰۰ ردیف. دستمزدش خوب است، با میانه‌ی ${f.w(health.median_wage_hr)}. این داده دلیلش را نمی‌گوید. بعضی کارفرمایان سلامت در سایت خودشان آگهی می‌دهند؛ اگر رشته‌تان سلامت است، کنار Job Bank صفحه‌ی استخدام کارفرمایان تأییدشده را هم نگاه کنید.</p>
<p><strong>تولید صنعتی.</strong> ${f.n(manuf.listings)} ردیف فهرست و فقط ${f.n(manuf.postings)} آگهی؛ ${f.d(manuf.postings_per_100_listings)} در هر ۱۰۰ ردیف، که بین بخش‌های بزرگ کمترین نسبت است.</p>
<p><strong>خدمات تخصصی و عمده‌فروشی.</strong> ${f.n(prof.listings)} و ${f.n(whole.listings)} ردیف فهرست، در برابر ${f.n(prof.postings)} و ${f.n(whole.postings)} آگهی.</p>
<p>آرام بودن در Job Bank، آن هم در یک اکتبر، به معنی بسته بودن نیست. معنایش این است که در این بخش‌ها، فهرست کارفرمایان تأییدشده بیشتر از Job Bank نشان می‌دهد چه کسی ممکن است استخدام کند.</p>

<h2>کجا استخدام از فهرست جلوتر است؟</h2>
<p><strong>حمل‌ونقل و انبارداری.</strong> ${f.n(transp.listings)} ردیف فهرست و ${f.n(transp.postings)} آگهی، ولی ${f.n(transp.vacancies)} جای خالی؛ چون شرکت‌های باربری در هر آگهی چند راننده می‌خواهند. میانه‌ی دستمزد ${f.w(transp.median_wage_hr)} است.</p>
<p><strong>معدن.</strong> ${f.n(mining.listings)} ردیف فهرست و ${f.n(mining.postings)} آگهی با ${f.n(mining.vacancies)} جای خالی، در ${f.n(mining.communities_with_postings)} جامعه. میانه‌ی ${f.w(mining.median_wage_hr)} بالاترین میانه بین همه‌ی بخش‌هاست، البته با نمونه‌ی کوچک. همان‌طور که در بخش اول آمد، ${N('Timmins')} ${f.n(occ('83100').postings)} آگهی برای ${f.n(occ('83100').vacancies)} معدن‌کار زیرزمینی داشت.</p>
<p><strong>اداره‌ی عمومی.</strong> ${f.n(pub.postings)} آگهی در برابر ${f.n(pub.listings)} ردیف فهرست؛ یعنی آگهی بیشتر از ردیف. نهادهای عمومی این ماه بیش از تعداد ردیف‌هایشان آگهی دادند و کمتر در فهرست کارفرمایان تأییدشده هستند.</p>
<p><strong>اقامت و غذا.</strong> نسبتش معمولی است، ${f.d(food.postings_per_100_listings)} در هر ۱۰۰ ردیف، ولی حجمش از همه بیشتر: ${f.n(food.vacancies)} جای خالی با میانه‌ی دستمزد ${f.w(food.median_wage_hr)}.</p>

<h2>کشاورزی چه؟</h2>
<p>چشمگیرترین نسبت جدول مال کشاورزی است: ${f.n(agri.postings)} آگهی برای ${f.n(agri.listings)} ردیف فهرست، با ${f.n(agri.vacancies)} جای خالی. برای متقاضی RCIP اما کم‌فایده‌ترین عدد هم همین است. ${f.n(agri.harvest_vacancies)} مورد از این جاهای خالی کار برداشت محصول است. بخشی از کار برداشت هم زیر بخش‌های دیگر ثبت شده: ${f.n(retail.harvest_vacancies)} جای خالی تاکستان با کد خرده‌فروشی آمده و ${f.n(manuf.harvest_vacancies)} جای خالی با کد تولید صنعتی.</p>
<p>IRCC می‌گوید پیشنهاد کار RCIP باید غیرفصلی باشد. شغل تمام‌سال در مزرعه هم پیدا می‌شود، ولی این داده نمی‌تواند آن را تمیز از کار فصلی جدا کند و فقط ${f.n(agri.listings)} ردیف از فهرست‌ها مال کسب‌وکارهای کشاورزی، جنگل‌داری و ماهیگیری است.</p>

<h2>خواننده از این‌ها چه برداشتی بکند؟</h2>
<ul>
<li>فهرست‌های کارفرمایان تأییدشده بیشتر روی چهار بخش تکیه دارند: اقامت و غذا، سلامت، خرده‌فروشی و ساخت‌وساز. این چهار بخش ${f.n(dv(food.listings + health.listings + retail.listings + constr.listings, 'listings of sectors 72 + 62 + 44-45 + 23'))} ردیف از ${f.n(S.listings.classified)} ردیف دسته‌بندی‌شده را دارند.</li>
<li>اگر صنعت شما در فهرست هست ولی در Job Bank ساکت است، ابزار بهتر خود فهرست است. از آن برای شناختن کارفرماها استفاده کنید و به آگهی‌هایی درخواست بدهید که خودشان منتشر کرده‌اند. چند جامعه صریحاً از متقاضیان خواسته‌اند درخواست ناخواسته‌ی پیشنهاد کار نفرستند.</li>
<li>هر جا Job Bank شلوغ است ولی فهرست کوتاه، مثل اداره‌ی عمومی و کشاورزی، انتظار داشته باشید خیلی از آگهی‌ها مال کارفرماهایی باشد که نمی‌توانند پیشنهاد RCIP بدهند.</li>
<li>طبق ${a(SRC.irccDesignation, 'قواعد IRCC برای تأیید کارفرما')}، آژانس‌های کاریابی و تأمین نیرو اصلاً نمی‌توانند تأیید شوند؛ پس آگهی‌های «خدمات کاریابی» بیرون از برنامه‌اند.</li>
</ul>
<p>«خدمات دیگر» (${f.n(other.listings)} ردیف) و «خدمات اداری و پشتیبانی» (${f.n(admin.listings)} ردیف) در همه‌ی سنجه‌ها وسط جدول‌اند.</p>
${methodBox()}
${seriesNote(3)}
${sources(`\n<li>اداره‌ی آمار کانادا: ${a(SRC.naics, 'طبقه‌بندی صنایع آمریکای شمالی (NAICS Canada 2022)')}.</li>`)}`;

  return {
    file: 'fa-3-industries',
    part: 3,
    locale: L,
    slug: path(L, 3).split('/').pop(),
    title: 'بازار کار RCIP در اکتبر ۲۰۲۶: کارفرمایان تأییدشده و آگهی‌های باز در هر صنعت',
    excerpt: `در فهرست کارفرمایان تأییدشده‌ی ۱۴ جامعه‌ی RCIP، «اقامت و غذا» و «سلامت» بزرگ‌ترین گروه‌ها هستند، ولی سلامت در Job Bank آگهی کمی دارد. فهرست کجا بلند و آرام است، استخدام کجا از آن جلو زده و چرا عددهای کشاورزی گمراه‌کننده است.`,
    category: CATEGORY,
    tags: [...TAGS, 'کارفرمای تأییدشده', 'NAICS'],
    keyTakeaway: `فهرست‌های ۱۴ جامعه‌ی RCIP روی هم ${f.n(S.listings.total)} ردیف کارفرمای تأییدشده دارند و بزرگ‌ترین گروه‌ها «اقامت و غذا» (${f.n(food.listings)}) و «سلامت» (${f.n(health.listings)}) هستند. در Job Bank اکتبر ۲۰۲۶ هم بیشترین آگهی مال اقامت و غذا بود (${f.n(food.postings)})، ولی سلامت فقط ${f.d(health.postings_per_100_listings)} آگهی در هر ۱۰۰ ردیف داشت. حمل‌ونقل، معدن و اداره‌ی عمومی بیش از سهمشان در فهرست‌ها آگهی دادند. ${f.pc(O.unknown_industry_share_pct)} آگهی‌ها صنعت ندارند؛ پس همه‌ی نسبت‌ها از واقعیت کمترند.`,
    summaryEn: `Persian data report comparing designated-employer listings with Job Bank postings by NAICS sector in the 14 Rural Community Immigration Pilot communities, October 2026: where listings are large but postings few, where postings outrun listings, and why seasonal agriculture inflates the vacancy count.`,
    faq: [
      { q: 'بیشتر کارفرمایان تأییدشده‌ی RCIP در چه صنعت‌هایی هستند؟', a: `اقامت و غذا (${f.n(food.listings)} ردیف)، سلامت و خدمات اجتماعی (${f.n(health.listings)})، خرده‌فروشی (${f.n(retail.listings)}) و ساخت‌وساز (${f.n(constr.listings)})؛ شمارش از فهرست ۱۴ جامعه.` },
      { q: 'چرا آگهی‌های سلامت در جامعه‌های RCIP در Job Bank این‌قدر کم است؟', a: `در اکتبر ۲۰۲۶ بخش سلامت ${f.n(health.postings)} آگهی در برابر ${f.n(health.listings)} ردیف فهرست داشت. این داده دلیلش را نمی‌گوید. بعضی کارفرمایان سلامت در سایت خودشان آگهی می‌دهند؛ آن‌جا را هم ببینید.` },
      { q: 'از راه RCIP می‌شود در معدن کار پیدا کرد؟', a: `معدن ${f.n(mining.listings)} ردیف در فهرست کارفرمایان تأییدشده دارد. در اکتبر ۲۰۲۶، ${f.n(mining.postings)} آگهی با ${f.n(mining.vacancies)} جای خالی داشت که بخش زیادی از آن در چند آگهی بزرگ بود. واجد شرایط بودن هر شغل به کارفرما و فهرست اولویت جامعه بستگی دارد.` },
      { q: 'شغل‌های کشاورزی در جامعه‌های RCIP قبول است؟', a: 'کار فصلی برداشت محصول نه، چون IRCC پیشنهاد کار غیرفصلی می‌خواهد. بیشتر جاهای خالی کشاورزی در اکتبر ۲۰۲۶ کار برداشت بود.' },
    ],
    internalLinks: [INDEX[L], path(L, 1), path(L, 2), GUIDE[L].rules],
    content,
  };
}

export const articles = [part1(), part2(), part3()];
