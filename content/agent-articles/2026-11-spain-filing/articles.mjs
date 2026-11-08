// ============================================================================
// The Spain filing series: eight hand-written articles, an English piece every
// Thursday and its Persian twin two days later, 12 Nov to 5 Dec 2026. Facts:
// FACTS.md, read from six official pages on 8 Nov 2026. Build and check:
// node build.mjs (writes ./out/*.json, fails on any number not in FACTS.md).
// Post: node scripts/post-agent-article.mjs content/agent-articles/2026-11-spain-filing/out/*.json
//
// One reader and one angle each, so the run does not read as the same guide
// four times:
//   en-1 / fa-1  the filing itself     the sede electrónica, form, fee, NRC
//   en-2 / fa-2  the certificate       who can get one, three ways, and the
//                                      founder abroad who has no NIE
//   en-3 / fa-3  the law               what Ley 28/2022 rewrote in Ley 14/2013
//   en-4 / fa-4  the confusion         "startup certification" vs the permit
// ============================================================================

const SRC = {
  sede: 'https://sede.inclusion.gob.es/en/w/presentacion-solicitudes-autorizacion-residencia',
  uge: 'https://www.inclusion.gob.es/en/web/unidadgrandesempresas/solicitudes',
  video: 'https://www.mjusticia.gob.es/es/certificados-digitales-clave/obtencion-certificado-video',
  fnmt: 'https://www.sede.fnmt.gob.es/certificados/persona-fisica/obtener-certificado-software/acreditar-identidad',
  ley28: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2022-21739',
  ley14: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2013-10074',
  ley14c: 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074',
};
const a = (href, text) => (href.startsWith('/')
  ? `<a href="${href}">${text}</a>`
  : `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`);
const SPAIN = '/en/europe/spain';
const SPAIN_FA = '/fa/europe/spain';
const PATH = '/en/which-path';
const PATH_FA = '/fa/which-path';

export const articles = [
  // ───────────────────────────────────────────────────────────── en-1
  {
    file: 'en-1-filing-online',
    publishAt: '2026-11-12T10:00:00Z',
    locale: 'en',
    slug: 'spain-entrepreneur-permit-how-to-file-online-sede-electronica',
    title: 'Spain Entrepreneur Permit: How the Online Filing Actually Works',
    excerpt: 'Every Spanish entrepreneur permit under Law 14/2013 is filed online, at the migration ministry\'s electronic office. The form, the fee code, the NRC number and the signing software, taken from the ministry\'s own pages.',
    category: 'European Visas',
    tags: ['Spain startup visa', 'Ley 14/2013', 'UGE', 'sede electrónica', 'tasa 790 038'],
    keyTakeaway: 'There is no paper route. The application, and every later document, goes through the Ministry of Inclusion\'s electronic office with a digital certificate, form MI-T, and the NRC code from fee form 790-038.',
    summaryEn: 'A walk through the official online filing of Spain\'s entrepreneur residence permit: the procedure page, the forms, the fee and the signing software, with the ministry\'s pages as the only source.',
    faq: [
      { q: 'Can I file the Spanish entrepreneur permit on paper or at a consulate?', a: 'No. The UGE states that applications under Law 14/2013, and all related documents, must be submitted electronically through the ministry\'s electronic office. The consulate only comes in later, for the visa.' },
      { q: 'What is the NRC?', a: 'The Número de Referencia Completo, the reference you receive after paying fee form 790 code 038. The electronic office asks for it when you file; without it the application cannot be presented.' },
      { q: 'Which form do I use?', a: 'Model MI-T for the permit holder. Family members use MI-F. People in the audiovisual sector have their own MI-T-Audiovisual. One model covers every Law 14/2013 authorisation.' },
    ],
    internalLinks: [SPAIN, PATH],
    content: `
<p>Most guides to Spain's entrepreneur permit stop at the business plan. The part that trips people up is smaller and duller: actually getting the file into the system. Spain does not accept this application on paper, by email or at a counter. It goes through one web page, with one form, one fee receipt and one piece of signing software. This piece walks through that page as the ministry publishes it. Everything here was checked on 8 November 2026 against the ${a(SRC.sede, 'procedure page of the Ministry of Inclusion\'s electronic office')} and the ${a(SRC.uge, 'UGE\'s "Solicitudes" page')}.</p>

<h2>One rule before anything else: it is all electronic</h2>
<p>The Unidad de Grandes Empresas y Colectivos Estratégicos (UGE), the unit that decides these files, puts it in one sentence. Applications for authorisations under Law 14/2013, and all documentation related to them, including corrections, extra documents, appeals and communications, must be submitted by electronic means through the ministry's electronic office. That covers the first filing and everything after it. If the UGE asks you for a missing document, the answer goes back through the same office.</p>
<p>The consulate is not an alternative. Under the law as amended in 2022, a founder outside Spain files a single application with the UGE that starts the permit first and the visa second, consecutively. The consulate's part comes after the UGE has decided.</p>

<h2>The procedure page, and what it is called</h2>
<p>The electronic office lists the procedure under a long name: "Presentation of applications for residence authorization for international mobility (Authorizations regulated by Law 14/2013, to support entrepreneurs and their internationalization)". Its SIA code, the number Spain's administration gives every procedure, is 202099. If you are searching the office's catalogue and cannot find "entrepreneur", search for that code or for "movilidad internacional". The managing unit is the Subdirección General de Gestión y Coordinación de Flujos Migratorios, inside the Dirección General de Migraciones.</p>
<p>The page states its legal basis: Title V, Section Two of Law 14/2013, articles 63 to 76, plus Order PCM/1238/2021, which published the Council of Ministers' agreement of 2 November 2021 setting out the procedure instructions. Those are the texts the office applies. Anything a consultant tells you that is not in them is practice, not rule.</p>
<p>One honest warning the page gives about itself: the English version is a machine translation. Where a word looks odd, the Spanish page is the one that counts.</p>

<h2>The three forms</h2>
<ul>
<li><strong>MI-T</strong>: the application model for the permit holder. This is the one an entrepreneur fills in.</li>
<li><strong>MI-F</strong>: the model for family members, filed together with yours or afterwards.</li>
<li><strong>MI-T-Audiovisual</strong>: a separate holder model for people in the audiovisual sector. Not for founders.</li>
</ul>
<p>The UGE adds that one application model is common to every authorisation under Law 14/2013, so the entrepreneur, the highly qualified professional and the researcher all start from the same MI-T. What differs is the box you tick and the documents you attach. The UGE also publishes a few side models that a founder may need: an affidavit that a family bond still exists, and a responsible declaration that your means are sufficient.</p>

<h2>The fee and the NRC</h2>
<p>The fee is paid on tax form 790, code 038. On that form, point 7 is "Application for international mobility authorisations (Law 14/2013)", with separate lines for an initial residence authorisation and a renewed one, each for the holder and for dependent family members. You generate the form, which prints the current amount, and pay it. We do not quote the amount, because the form sets it and it changes from year to year.</p>
<p>What matters for the filing is what the payment gives you: the NRC, the Número de Referencia Completo. The procedure page says plainly that at the end of the payment you must obtain the NRC, which is necessary for the presentation of the file. In practice this means the fee is paid before you open the application, not after. A file without an NRC does not go in.</p>

<h2>The signing software</h2>
<p>The office signs documents with Autofirma, the Spanish administration's signing application. The procedure page keeps a troubleshooting note that is worth reading before you start rather than at midnight on the day: if access or signing fails, check that you have Autofirma version 1.9.0, and if not, download and install it from firmaelectronica.gob.es; then clear the browser cache or hard-refresh. The office also links a manual on validating the signature in PDF documents, useful when a notary or bank questions a signed file later.</p>

<h2>The order to do things in</h2>
<ol>
<li>Get a digital certificate, yours or your legal representative's. The UGE says you will need one to apply; the next article in this series is about who can get one and how.</li>
<li>Install Autofirma and check the version.</li>
<li>Generate and pay form 790-038 under point 7, and keep the NRC.</li>
<li>Fill in MI-T, and MI-F for each family member.</li>
<li>Open the procedure in the electronic office, attach everything, sign, submit, and keep the receipt.</li>
</ol>
<p>From the moment of electronic filing, the UGE's legal deadline to decide runs, and if it does not decide in time the permit is granted by administrative silence. That clock is the reason to file complete: a request for a missing document stops it. Our ${a(SPAIN, 'Spain guide')} covers the deadlines and the ENISA report in full, and ${a(PATH, 'the route finder')} tells you whether Spain is the right file to open at all.</p>`,
  },

  // ───────────────────────────────────────────────────────────── fa-1
  {
    file: 'fa-1-sabt-online',
    publishAt: '2026-11-14T06:00:00Z',
    locale: 'fa',
    slug: 'spain-entrepreneur-permit-online-filing-sede-fa',
    title: 'ثبت درخواست اقامت کارآفرینی اسپانیا؛ سامانه، فرم، کد پرداخت',
    excerpt: 'درخواست اقامت کارآفرینی اسپانیا فقط آنلاین ثبت می‌شود، در دفتر الکترونیکی وزارت مهاجرت. فرم MI-T، فرم پرداخت ۷۹۰ کد ۰۳۸، کد NRC و نرم‌افزار امضا، همه از صفحه‌های خود وزارتخانه.',
    category: 'European Visas',
    tags: ['ویزای استارتاپ اسپانیا', 'قانون ۱۴/۲۰۱۳', 'UGE', 'دفتر الکترونیکی', 'تاسا ۷۹۰'],
    keyTakeaway: 'راه کاغذی وجود ندارد. درخواست و هر مدرکی که بعداً می‌فرستید از دفتر الکترونیکی وزارت می‌گذرد، با گواهی دیجیتال، فرم MI-T و کد NRC که بعد از پرداخت فرم ۷۹۰-۰۳۸ می‌گیرید.',
    summaryEn: 'Persian walk-through of the official online filing of Spain\'s entrepreneur residence permit: the sede electrónica procedure, forms MI-T and MI-F, fee form 790-038, the NRC and Autofirma.',
    faq: [
      { q: 'می‌شود درخواست را کاغذی یا در کنسولگری داد؟', a: 'نه. UGE می‌گوید درخواست‌های قانون ۱۴/۲۰۱۳ و همه‌ی مدارک مربوط به آن‌ها باید از راه الکترونیکی و از دفتر الکترونیکی وزارت ثبت شوند. کنسولگری بعداً و فقط برای ویزا وارد ماجرا می‌شود.' },
      { q: 'NRC چیست؟', a: 'شماره‌ی مرجع کاملی که بعد از پرداخت فرم ۷۹۰ کد ۰۳۸ می‌گیرید. سامانه هنگام ثبت درخواست آن را می‌خواهد و بدون آن پرونده ثبت نمی‌شود.' },
      { q: 'کدام فرم را پر کنم؟', a: 'فرم MI-T برای خود متقاضی. اعضای خانواده فرم MI-F را پر می‌کنند. یک فرم برای همه‌ی مجوزهای قانون ۱۴/۲۰۱۳ مشترک است.' },
    ],
    internalLinks: [SPAIN_FA, PATH_FA],
    content: `
<p>بیشتر راهنماهای اقامت کارآفرینی اسپانیا در طرح کسب‌وکار تمام می‌شوند. اما جایی که خیلی‌ها گیر می‌کنند کوچک‌تر و خسته‌کننده‌تر است: رساندن پرونده به سامانه. اسپانیا این درخواست را روی کاغذ، با ایمیل یا پشت باجه قبول نمی‌کند. همه‌چیز از یک صفحه‌ی وب می‌گذرد، با یک فرم، یک رسید پرداخت و یک نرم‌افزار امضا. این مطلب همان صفحه را قدم‌به‌قدم می‌خواند، آن‌طور که خود وزارتخانه منتشر کرده است. همه‌ی آنچه می‌خوانید در ۸ نوامبر ۲۰۲۶ با ${a(SRC.sede, 'صفحه‌ی رویه در دفتر الکترونیکی وزارت شمول')} و ${a(SRC.uge, 'صفحه‌ی «Solicitudes» واحد UGE')} مطابقت داده شده است.</p>

<h2>یک قاعده پیش از هر چیز: همه‌چیز الکترونیکی است</h2>
<p>واحد شرکت‌های بزرگ و گروه‌های راهبردی (UGE)، همان واحدی که درباره‌ی این پرونده‌ها تصمیم می‌گیرد، قاعده را در یک جمله گفته است: درخواست‌های مجوزهای قانون ۱۴/۲۰۱۳ و همه‌ی مدارک مربوط به آن‌ها، از رفع نقص و مدرک تکمیلی گرفته تا اعتراض و مکاتبه، باید از راه الکترونیکی و از دفتر الکترونیکی وزارت ثبت شوند. این هم ثبت اولیه را می‌گیرد و هم هر چیزی را که بعدش می‌آید. اگر UGE مدرکی را کم داشت، جواب از همان مسیر برمی‌گردد.</p>
<p>کنسولگری جایگزین نیست. طبق قانون پس از اصلاح سال ۲۰۲۲، کسی که بیرون از اسپانیاست یک درخواست واحد به UGE می‌دهد که اول مجوز اقامت را راه می‌اندازد و بعد ویزا را، پشت سر هم. نوبت کنسولگری بعد از تصمیم UGE است.</p>

<h2>صفحه‌ی رویه و اسمش</h2>
<p>دفتر الکترونیکی این رویه را با نامی طولانی فهرست کرده است: «ارائه‌ی درخواست مجوز اقامت تحرک بین‌المللی (مجوزهای موضوع قانون ۱۴/۲۰۱۳ حمایت از کارآفرینان و بین‌المللی‌سازی آن‌ها)». کد SIA آن، شماره‌ای که دولت اسپانیا به هر رویه می‌دهد، ۲۰۲۰۹۹ است. اگر در فهرست دفتر دنبال «کارآفرین» می‌گردید و پیدا نمی‌کنید، همین کد یا عبارت «movilidad internacional» را جست‌وجو کنید. واحد مدیریت‌کننده، معاونت مدیریت و هماهنگی جریان‌های مهاجرتی در اداره‌ی کل مهاجرت است.</p>
<p>صفحه مبنای قانونی خودش را هم گفته است: عنوان پنجم، بخش دوم قانون ۱۴/۲۰۱۳، مواد ۶۳ تا ۷۶، به‌علاوه‌ی دستور PCM/1238/2021 که مصوبه‌ی هیئت وزیران در ۲ نوامبر ۲۰۲۱ درباره‌ی دستورالعمل رویه را منتشر کرد. دفتر همین متن‌ها را اجرا می‌کند. هر چیزی که مشاور بگوید و در این متن‌ها نباشد، رویه‌ی عملی است نه قاعده.</p>
<p>صفحه یک هشدار صادقانه درباره‌ی خودش دارد: نسخه‌ی انگلیسی ترجمه‌ی ماشینی است. هر جا کلمه‌ای عجیب به نظر رسید، نسخه‌ی اسپانیایی معتبر است.</p>

<h2>سه فرم</h2>
<ul>
<li><strong>MI-T</strong>: فرم درخواست خود متقاضی. همین را کارآفرین پر می‌کند.</li>
<li><strong>MI-F</strong>: فرم اعضای خانواده، همراه فرم شما یا بعد از آن.</li>
<li><strong>MI-T-Audiovisual</strong>: فرم جداگانه برای شاغلان بخش سمعی‌بصری. به کارآفرینان ربطی ندارد.</li>
</ul>
<p>UGE اضافه می‌کند که یک فرم برای همه‌ی مجوزهای قانون ۱۴/۲۰۱۳ مشترک است؛ یعنی کارآفرین، متخصص بسیار ماهر و پژوهشگر همه از همین MI-T شروع می‌کنند. تفاوت در گزینه‌ای است که علامت می‌زنید و مدارکی که پیوست می‌کنید. UGE چند فرم جانبی هم دارد که ممکن است به کار بیاید: اظهارنامه‌ی ادامه‌ی پیوند خانوادگی و اظهارنامه‌ی کفایت منابع مالی.</p>

<h2>هزینه و کد NRC</h2>
<p>هزینه با فرم مالیاتی ۷۹۰، کد ۰۳۸ پرداخت می‌شود. در این فرم، بند ۷ «درخواست مجوزهای تحرک بین‌المللی (قانون ۱۴/۲۰۱۳)» است، با ردیف‌های جدا برای اقامت اولیه و تمدید، هر کدام برای متقاضی اصلی و اعضای خانواده. فرم را می‌سازید، مبلغ روز روی آن چاپ می‌شود و پرداخت می‌کنید. ما مبلغ را نمی‌نویسیم، چون فرم آن را تعیین می‌کند و هر سال عوض می‌شود.</p>
<p>چیزی که برای ثبت پرونده مهم است، نتیجه‌ی پرداخت است: NRC یا «شماره‌ی مرجع کامل». صفحه‌ی رویه صریح می‌گوید در پایان پرداخت باید NRC را بگیرید و این شماره برای ارائه‌ی پرونده لازم است. در عمل یعنی هزینه را پیش از باز کردن درخواست می‌پردازید، نه بعدش. پرونده‌ی بدون NRC ثبت نمی‌شود.</p>

<h2>نرم‌افزار امضا</h2>
<p>دفتر الکترونیکی مدارک را با Autofirma امضا می‌کند، برنامه‌ی امضای دولت اسپانیا. صفحه‌ی رویه یک یادداشت رفع اشکال دارد که بهتر است پیش از شروع بخوانید نه نیمه‌شبِ روز ثبت: اگر ورود یا امضا خطا داد، ببینید نسخه‌ی Autofirma شما 1.9.0 هست یا نه؛ اگر نیست از firmaelectronica.gob.es دانلود و نصب کنید و بعد حافظه‌ی نهان مرورگر را پاک کنید. دفتر راهنمایی هم برای اعتبارسنجی امضا در فایل‌های PDF گذاشته که وقتی بعداً دفترخانه یا بانک به فایل امضاشده شک کند به کار می‌آید.</p>

<h2>ترتیب کارها</h2>
<ol>
<li>گواهی دیجیتال بگیرید، برای خودتان یا نماینده‌ی قانونی‌تان. UGE می‌گوید برای درخواست به آن نیاز دارید؛ مطلب بعدی این مجموعه درباره‌ی همین است که چه کسی می‌تواند گواهی بگیرد و چطور.</li>
<li>Autofirma را نصب کنید و نسخه‌اش را چک کنید.</li>
<li>فرم ۷۹۰-۰۳۸ را زیر بند ۷ بسازید و بپردازید و NRC را نگه دارید.</li>
<li>MI-T را پر کنید، و برای هر عضو خانواده یک MI-F.</li>
<li>رویه را در دفتر الکترونیکی باز کنید، همه‌چیز را پیوست کنید، امضا کنید، بفرستید و رسید را نگه دارید.</li>
</ol>
<p>از لحظه‌ی ثبت الکترونیکی، مهلت قانونی UGE برای تصمیم شروع می‌شود و اگر در مهلت تصمیم نگیرد، مجوز با سکوت اداری صادرشده حساب می‌شود. همین ساعت دلیل کامل فرستادن پرونده است: درخواست مدرک کم، ساعت را نگه می‌دارد. ${a(SPAIN_FA, 'راهنمای اسپانیای ما')} مهلت‌ها و گزارش ENISA را کامل توضیح داده و ${a(PATH_FA, 'مسیریاب')} می‌گوید اصلاً اسپانیا پرونده‌ی درستی برای شما هست یا نه.</p>`,
  },

  // ───────────────────────────────────────────────────────────── en-2
  {
    file: 'en-2-digital-certificate',
    publishAt: '2026-11-19T10:00:00Z',
    locale: 'en',
    slug: 'spain-digital-certificate-fnmt-for-entrepreneur-permit-applicants',
    title: 'The Spanish Digital Certificate: Who Can Get One, and What a Founder Abroad Does Without a NIE',
    excerpt: 'The UGE says you need an electronic certificate to file. The FNMT gives three ways to prove your identity for one, and every one of them asks for a DNI or NIE. What that means for a founder who has neither yet.',
    category: 'European Visas',
    tags: ['Spain startup visa', 'digital certificate', 'FNMT', 'NIE', 'legal representative'],
    keyTakeaway: 'An FNMT natural-person certificate requires a DNI or NIE, in person at an accreditation office or a Spanish consulate, or by video identification. A founder outside Spain with no NIE files through a legal representative who holds a certificate.',
    summaryEn: 'What the FNMT and the Justice ministry publish about getting a Spanish digital certificate: the three identification routes, the documents each asks of a foreign citizen, and the consequence for an entrepreneur applicant who has no NIE yet.',
    faq: [
      { q: 'Can I get a Spanish digital certificate with only a passport?', a: 'Not from the FNMT. Its identity page lists, for a foreign citizen, a Foreigner Identification Card showing the NIE plus passport, or the official document granting the NIF/NIE plus passport. The video route asks for a DNI or NIE number at the first step.' },
      { q: 'Can a friend in Spain get the certificate for me?', a: 'Only if your signature on the certificate contract has been legitimised before a notary first. The FNMT says a power of attorney is not accepted for this.' },
      { q: 'Can I get the certificate at a Spanish consulate?', a: 'Yes. The FNMT says identity for the citizen certificate can be accredited at Spain\'s career consular offices abroad. You still need the request code from the online step, and the office will ask for your identity documents.' },
    ],
    internalLinks: [SPAIN, PATH],
    content: `
<p>The first article in this series ended on the one thing you need before the Spanish entrepreneur permit can be filed: an electronic certificate. The UGE's page says so in as many words. This article is about the certificate itself, as the two authorities that issue and explain it describe it: the ${a(SRC.fnmt, 'FNMT\'s "Acreditar identidad" page')} and the ${a(SRC.video, 'Justice ministry\'s page on video identification')}. Both were read on 8 November 2026. The point that matters most for a founder comes at the end, and it is not good news for everyone.</p>

<h2>What the certificate is</h2>
<p>The Fábrica Nacional de Moneda y Timbre (FNMT) issues the "certificado de persona física", the natural-person certificate most people in Spain use to sign and file with the administration. Getting one has four steps on the FNMT's own page: configure your computer, request the certificate online, prove your identity, download the certificate. The third step is where a foreign applicant either passes or stops.</p>

<h2>Route one: an accreditation office in Spain</h2>
<p>After the online request you receive a request code by email. You then go in person to an identity accreditation office. The FNMT says it has more than 2,400 of them across Spain, with an office locator on its site, and that offices of the tax agency, Social Security and some others require an appointment. It also says, in bold, that this certificate cannot be requested at Correos post offices. Once an office has accredited you, the download is available immediately and the FNMT advises downloading at once.</p>
<p>What a foreign citizen brings, in the FNMT's words:</p>
<ul>
<li>the request code from the email, and</li>
<li>a Foreigner Identification Card (the red, green or white card) showing the NIE, together with the passport, or</li>
<li>the official document granting the NIF or NIE, together with the passport.</li>
</ul>
<p>The FNMT adds that the NIE document is accepted whether or not it is still in date; what the office is verifying is that you hold the number. The applicant must be at least 18, or an emancipated minor, and the identity document must be the original and valid, or an officially certified copy.</p>

<h2>Route two: a Spanish consulate abroad</h2>
<p>The same page says that if you are abroad you can accredit your identity at Spain's career consular offices, and lists the consulates where the citizen certificate can be handled. Customs registries do not count. The document requirements do not change by moving the appointment to a consulate: the office is still checking a NIE or NIF document against a passport.</p>

<h2>Route three: video identification</h2>
<p>The Justice ministry's page describes a fully remote route. You install the FNMT configurator, start the request, and at the request step you enter the holder's DNI or NIE, first surname and an email address; the request code arrives by email and you set a password that will be asked again at download. For identification you enter the request code and a mobile number, confirm an SMS, scan a QR code with the phone, show both sides of your identity document to the camera, and record a video selfie with a liveness check. The FNMT then reviews the evidence and emails you when the certificate can be downloaded. Forget the password and you start again.</p>
<p>Notice the first field of the request: DNI or NIE. The remote route is remote, but it is not a way round the identity number.</p>

<h2>If you cannot go yourself</h2>
<p>The FNMT allows a third person to accredit your identity on your behalf, but with one condition: your signature on the certificate contract must first be legitimised before a notary. It then answers the obvious question on the same page: a power of attorney is not valid for this; what is required is the notarial legitimation of your signature. If you are planning to send someone, ask the FNMT's page, not a forum, what that person must carry.</p>

<h2>The consequence for a founder abroad</h2>
<p>Put the three routes together and the pattern is clear. Every route verifies a Spanish identity number. A founder who lives outside Spain and has never held a NIE is not the person any of these pages describes. That is why, in practice, the entrepreneur permit is so often filed by a legal representative: the law as amended in 2022 says the application is made by the applicant or through a legal representative, electronically, with the UGE. The representative's certificate signs; your documents are the content.</p>
<p>Two provisions of the 2022 Startups Law point the same way and are worth knowing. One says Spain will facilitate issuing the NIE to people applying under this law, with a dedicated web page for appointments. The other, added to article 76, says that for the first six months of residence a passport is enough to register with Social Security when the holder has no NIE yet. The first is a promise about the number; the second is a workaround for one specific use of it. Neither gives you a certificate before you have a number.</p>

<h2>What to do with this</h2>
<ol>
<li>If you already hold a NIE from an earlier stay or purchase, you can get the certificate yourself: online request, then an accreditation office in Spain or a consulate, or the video route.</li>
<li>If you do not, decide early who your legal representative will be, and confirm that they hold a valid certificate. The filing in our ${a(SPAIN, 'Spain guide')} assumes exactly this.</li>
<li>Do not pay anyone for "a certificate without a NIE". The FNMT's own page is the test: if the documents you have are not on its list, the office will not accredit you.</li>
</ol>
<p>Whether Spain is the right file to open is a separate question, and ${a(PATH, 'the route finder')} answers it in a few minutes.</p>`,
  },

  // ───────────────────────────────────────────────────────────── fa-2
  {
    file: 'fa-2-govahi-digital',
    publishAt: '2026-11-21T06:00:00Z',
    locale: 'fa',
    slug: 'spain-digital-certificate-without-nie-fa',
    title: 'گواهی دیجیتال اسپانیا؛ چه کسی می‌تواند بگیرد و بدون NIE چه می‌شود',
    excerpt: 'UGE می‌گوید برای ثبت درخواست به گواهی الکترونیکی نیاز دارید. FNMT سه راه برای احراز هویت دارد و هر سه، DNI یا NIE می‌خواهند. برای کارآفرینی که هنوز هیچ‌کدام را ندارد این یعنی چه.',
    category: 'European Visas',
    tags: ['ویزای استارتاپ اسپانیا', 'گواهی دیجیتال', 'FNMT', 'NIE', 'نماینده قانونی'],
    keyTakeaway: 'گواهی شخص حقیقی FNMT بدون DNI یا NIE صادر نمی‌شود؛ نه در دفتر احراز هویت، نه در کنسولگری، نه با ویدئو. کارآفرینی که بیرون از اسپانیاست و NIE ندارد، از طریق نماینده‌ی قانونیِ دارای گواهی پرونده را ثبت می‌کند.',
    summaryEn: 'Persian explainer of the FNMT and Justice-ministry pages on the Spanish digital certificate: the three identification routes, the documents a foreign citizen needs, and why a founder abroad without a NIE files through a legal representative.',
    faq: [
      { q: 'با پاسپورت تنها می‌شود گواهی دیجیتال اسپانیا گرفت؟', a: 'از FNMT نه. صفحه‌ی احراز هویت آن برای شهروند خارجی کارت شناسایی اتباع خارجی با NIE به‌همراه پاسپورت، یا سند رسمی اعطای NIF/NIE به‌همراه پاسپورت را می‌خواهد. مسیر ویدئویی هم در همان قدم اول شماره‌ی DNI یا NIE می‌پرسد.' },
      { q: 'دوستم در اسپانیا می‌تواند به جای من گواهی بگیرد؟', a: 'فقط اگر امضای شما زیر قرارداد گواهی، پیش‌تر نزد دفتر اسناد رسمی تصدیق شده باشد. FNMT می‌گوید وکالت‌نامه برای این کار پذیرفته نمی‌شود.' },
      { q: 'در کنسولگری اسپانیا می‌شود گواهی گرفت؟', a: 'بله. FNMT می‌گوید احراز هویت برای گواهی شهروندی در دفاتر کنسولی حرفه‌ای اسپانیا در خارج انجام می‌شود. کد درخواستِ مرحله‌ی آنلاین را لازم دارید و دفتر مدارک هویتی را می‌خواهد.' },
    ],
    internalLinks: [SPAIN_FA, PATH_FA],
    content: `
<p>مطلب اول این مجموعه به چیزی ختم شد که پیش از ثبت اقامت کارآفرینی اسپانیا لازم دارید: گواهی الکترونیکی. صفحه‌ی UGE همین را با همین کلمات گفته است. این مطلب درباره‌ی خود گواهی است، آن‌طور که دو مرجع صادرکننده و توضیح‌دهنده‌اش می‌گویند: ${a(SRC.fnmt, 'صفحه‌ی «Acreditar identidad» در FNMT')} و ${a(SRC.video, 'صفحه‌ی وزارت دادگستری درباره‌ی احراز هویت ویدئویی')}. هر دو در ۸ نوامبر ۲۰۲۶ خوانده شده‌اند. نکته‌ای که برای کارآفرین از همه مهم‌تر است آخر مطلب آمده و برای همه خبر خوبی نیست.</p>

<h2>گواهی چیست</h2>
<p>ضراب‌خانه‌ی ملی اسپانیا (FNMT) «گواهی شخص حقیقی» را صادر می‌کند؛ همان گواهی‌ای که بیشتر مردم در اسپانیا برای امضا و ثبت در سامانه‌های دولتی به کار می‌برند. گرفتنش طبق صفحه‌ی خود FNMT چهار قدم دارد: پیکربندی رایانه، درخواست آنلاین، احراز هویت، دانلود گواهی. قدم سوم جایی است که متقاضی خارجی یا رد می‌شود یا می‌ماند.</p>

<h2>راه اول: دفتر احراز هویت در اسپانیا</h2>
<p>بعد از درخواست آنلاین، کد درخواست با ایمیل می‌رسد. بعد خودتان به یکی از دفاتر احراز هویت می‌روید. FNMT می‌گوید بیش از ۲٬۴۰۰ دفتر در سراسر اسپانیا دارد، با مکان‌یاب دفاتر در سایتش، و دفاتر سازمان مالیات، تأمین اجتماعی و بعضی دفاتر دیگر نوبت قبلی می‌خواهند. با حروف درشت هم نوشته که این گواهی را نمی‌شود از دفاتر پست Correos درخواست کرد. وقتی دفتر هویت شما را تأیید کرد، دانلود فوراً فعال می‌شود و FNMT توصیه می‌کند همان موقع دانلود کنید.</p>
<p>شهروند خارجی، به گفته‌ی FNMT، این‌ها را می‌برد:</p>
<ul>
<li>کد درخواستی که با ایمیل رسیده، و</li>
<li>کارت شناسایی اتباع خارجی (کارت قرمز، سبز یا سفید) که NIE روی آن باشد، همراه پاسپورت، یا</li>
<li>سند رسمی اعطای NIF یا NIE، همراه پاسپورت.</li>
</ul>
<p>FNMT اضافه می‌کند که سند NIE چه معتبر باشد چه منقضی پذیرفته می‌شود؛ دفتر فقط می‌خواهد مطمئن شود شماره را دارید. متقاضی باید دست‌کم ۱۸ سال داشته باشد یا صغیر رشید باشد، و مدرک هویتی باید اصل و معتبر باشد یا رونوشت برابر اصل رسمی.</p>

<h2>راه دوم: کنسولگری اسپانیا در خارج</h2>
<p>همان صفحه می‌گوید اگر در خارج هستید می‌توانید در دفاتر کنسولی حرفه‌ای اسپانیا هویتتان را تأیید کنید و فهرست کنسولگری‌هایی را که گواهی شهروندی را انجام می‌دهند آورده است. دفاتر گمرکی حساب نمی‌شوند. با جابه‌جا شدن نوبت به کنسولگری، مدارک عوض نمی‌شود: دفتر همچنان سند NIE یا NIF را با پاسپورت تطبیق می‌دهد.</p>

<h2>راه سوم: احراز هویت ویدئویی</h2>
<p>صفحه‌ی وزارت دادگستری مسیری کاملاً از راه دور را توضیح می‌دهد. پیکربندی‌کننده‌ی FNMT را نصب می‌کنید، درخواست را شروع می‌کنید و در مرحله‌ی درخواست، DNI یا NIE دارنده، نام خانوادگی اول و یک ایمیل وارد می‌کنید؛ کد درخواست با ایمیل می‌رسد و رمزی می‌سازید که هنگام دانلود دوباره پرسیده می‌شود. برای احراز هویت، کد درخواست و شماره‌ی موبایل را وارد می‌کنید، پیامک را تأیید می‌کنید، کد QR را با گوشی اسکن می‌کنید، هر دو روی مدرک هویتی را به دوربین نشان می‌دهید و یک ویدئوی سلفی با آزمون زنده‌بودن می‌گیرید. FNMT شواهد را بررسی می‌کند و با ایمیل خبر می‌دهد که گواهی آماده‌ی دانلود است. رمز را فراموش کنید، از اول شروع می‌کنید.</p>
<p>به اولین فیلد درخواست دقت کنید: DNI یا NIE. مسیر ویدئویی از راه دور است، اما دور زدنِ شماره‌ی هویتی نیست.</p>

<h2>اگر خودتان نمی‌توانید بروید</h2>
<p>FNMT اجازه می‌دهد شخص ثالثی به جای شما احراز هویت کند، با یک شرط: امضای شما زیر قرارداد گواهی باید پیش‌تر نزد دفتر اسناد رسمی تصدیق شده باشد. بعد در همان صفحه به پرسش بدیهی جواب می‌دهد: وکالت‌نامه برای این کار معتبر نیست؛ آنچه لازم است تصدیق امضای شما نزد دفترخانه است. اگر قرار است کسی را بفرستید، از صفحه‌ی FNMT بپرسید چه چیزی همراه داشته باشد، نه از فروم‌ها.</p>

<h2>نتیجه برای کارآفرینِ بیرون از اسپانیا</h2>
<p>سه راه را کنار هم بگذارید، الگو روشن است: هر سه یک شماره‌ی هویتی اسپانیایی را تأیید می‌کنند. کارآفرینی که بیرون از اسپانیا زندگی می‌کند و هیچ‌وقت NIE نداشته، آدمی نیست که این صفحه‌ها توصیفش می‌کنند. به همین دلیل است که در عمل اقامت کارآفرینی را اغلب نماینده‌ی قانونی ثبت می‌کند: قانون پس از اصلاح ۲۰۲۲ می‌گوید درخواست را خود متقاضی یا نماینده‌ی قانونی‌اش، به‌صورت الکترونیکی، به UGE می‌دهد. گواهی نماینده امضا می‌کند؛ مدارک شما محتواست.</p>
<p>دو مقرره‌ی قانون استارتاپ ۲۰۲۲ هم به همین سمت اشاره می‌کنند و دانستنشان به کار می‌آید. یکی می‌گوید اسپانیا صدور NIE را برای متقاضیان این قانون تسهیل می‌کند، با یک صفحه‌ی وب اختصاصی برای نوبت. دیگری که به ماده‌ی ۷۶ اضافه شده می‌گوید در شش ماه اول اقامت، وقتی دارنده هنوز NIE ندارد، پاسپورت برای ثبت‌نام در تأمین اجتماعی کافی است. اولی وعده‌ای درباره‌ی شماره است؛ دومی راه‌حلی برای یک کاربرد مشخص آن. هیچ‌کدام پیش از داشتن شماره به شما گواهی نمی‌دهد.</p>

<h2>با این اطلاعات چه کنید</h2>
<ol>
<li>اگر از اقامت یا خرید قبلی NIE دارید، می‌توانید خودتان گواهی بگیرید: درخواست آنلاین، بعد دفتر احراز هویت در اسپانیا یا کنسولگری، یا مسیر ویدئویی.</li>
<li>اگر ندارید، زود تصمیم بگیرید نماینده‌ی قانونی‌تان کیست و مطمئن شوید گواهی معتبر دارد. مسیر ثبت در ${a(SPAIN_FA, 'راهنمای اسپانیای ما')} دقیقاً همین را فرض گرفته است.</li>
<li>به کسی برای «گواهی بدون NIE» پول ندهید. صفحه‌ی خود FNMT محک است: اگر مدارکتان در فهرست آن نیست، دفتر هویتتان را تأیید نمی‌کند.</li>
</ol>
<p>این‌که اصلاً اسپانیا پرونده‌ی درستی برای شماست یا نه، پرسش جداگانه‌ای است و ${a(PATH_FA, 'مسیریاب')} چند دقیقه‌ای جوابش را می‌دهد.</p>`,
  },

  // ───────────────────────────────────────────────────────────── en-3
  {
    file: 'en-3-what-the-startups-law-changed',
    publishAt: '2026-11-26T10:00:00Z',
    locale: 'en',
    slug: 'what-spains-startups-law-28-2022-changed-in-the-entrepreneur-permit',
    title: 'What Spain\'s Startups Law Changed in the Entrepreneur Permit, Article by Article',
    excerpt: 'Law 28/2022 rewrote the entrepreneur chapter of Law 14/2013. Read side by side in the Official State Gazette, the two texts show exactly what moved: the permit\'s length, the ENISA report, the criminal-record rule, and a visa that disappeared.',
    category: 'European Visas',
    tags: ['Ley 28/2022', 'Ley 14/2013', 'Spain startup visa', 'BOE', 'ENISA'],
    keyTakeaway: 'Since the Startups Law, the entrepreneur permit is three years with a two-year renewal and permanent residence at five, the report comes from ENISA within ten working days, and the one-year preparatory visa of old article 68 no longer exists.',
    summaryEn: 'A field-by-field comparison of Spain\'s Law 14/2013 as originally published and as amended by Law 28/2022, using the two BOE texts, for the articles that govern the entrepreneur residence permit.',
    faq: [
      { q: 'Which text of Law 14/2013 applies to me?', a: 'The consolidated text on boe.es, which already contains the 2022 amendments. The original 2013 text is useful only to see what changed, and some older guides still quote it.' },
      { q: 'Did the Startups Law create the entrepreneur permit?', a: 'No. The permit dates from Law 14/2013. Law 28/2022 changed how long it lasts, who writes the report, how fast, and how the application is filed from abroad.' },
      { q: 'Is the one-year "entrepreneur visa" to prepare a business still available?', a: 'No. That was article 68 of the 2013 text, and Law 28/2022 deleted it.' },
    ],
    internalLinks: [SPAIN, PATH],
    content: `
<p>Two documents on boe.es tell the whole legal story of Spain's entrepreneur permit. The first is ${a(SRC.ley14, 'Law 14/2013 as originally published')} in September 2013. The second is ${a(SRC.ley28, 'Law 28/2022, the Startups Law')}, published on 22 December 2022 and in force the next day, whose fifth final provision rewrote the chapter of the 2013 law that founders depend on. This article reads them side by side. We quote the gazette, not a summary of it, and everything was checked on 8 November 2026. If you want the text that applies today in one place, use the ${a(SRC.ley14c, 'consolidated version')} of Law 14/2013; the original is here to show what moved.</p>

<h2>Who the section covers</h2>
<p>Original article 61 opened the international mobility section to five groups: investors, entrepreneurs, highly qualified professionals, researchers and intra-company transferees, and excluded EU citizens and people with EU free-movement rights. The 2022 law added a sixth letter, international teleworkers, and built a new chapter for them. Nothing changed for entrepreneurs here except the company they keep.</p>

<h2>The general requirements, and one real change</h2>
<p>Original article 62 set the conditions every applicant meets: not in Spain irregularly, at least 18, no criminal record in Spain or in the countries lived in during the last five years, not flagged for refusal in the Schengen area, public or private health insurance with an insurer authorised in Spain, sufficient means for yourself and your family, and the fee paid. Family could apply jointly: spouse, children under 18, and adult children unable to support themselves.</p>
<p>The 2022 law touched one letter. The criminal-record requirement now covers the last two years of residence, and is paired with a responsible declaration that there have been no convictions in the last five. The five-year horizon did not disappear; it moved from certificates to a signed statement. Consulates may still ask for more, as our guide notes, but the law's own wording is two plus five.</p>

<h2>The permit's length: from silence to three years</h2>
<p>Original article 69 created the residence authorisation for business activity, valid throughout Spain, and said nothing about how long it lasted; the general renewal rule in article 76 spoke of two-year periods. The rewritten article 69 is specific. The permit is valid for three years. After that it can be renewed for two years, and permanent residence can be obtained at five. The same article now says how the application is made: by the applicant or a legal representative, electronically, with the UGE; and, for a founder outside Spain, through a single application that starts the authorisation and then the visa, consecutively.</p>

<h2>The report: from "the competent body" to ENISA, in ten working days</h2>
<p>Original article 70 defined entrepreneurial activity as innovative with special economic interest for Spain, evidenced by a favourable report from "the competent body of the central administration". It told that body to weigh job creation in Spain first, then the applicant's profile, the business plan and the added value.</p>
<p>The 2022 text changes three things. The activity must be innovative and/or of special economic interest, so either limb will do. The report comes from ENISA, by name; the UGE requests it ex officio, it is mandatory, and it must be issued within ten working days. And the assessment criteria are restated without the "job creation first" instruction: the applicant's profile and involvement, with each partner assessed whether or not they need a visa; the business plan, with the project, the product or service and its financing, including the investment required and its possible sources; and the elements that add value for the Spanish economy, innovation or investment opportunities. A founder outside Spain applies for the visa once the permit is granted.</p>

<h2>The visa that disappeared</h2>
<p>Original article 68 offered a one-year visa to enter Spain for the sole or main purpose of carrying out the preparatory steps for an entrepreneurial activity, with a path from that visa into the residence permit. The 2022 law deleted article 68 outright. Any page still offering a "one-year entrepreneur visa to prepare your business" is describing a provision that no longer exists.</p>

<h2>Two additions founders rarely hear about</h2>
<ul>
<li><strong>Article 76.4, new.</strong> For the first six months of residence, a passport is enough to register with Social Security when the holder does not yet have a NIE. It is the reason you can start paying contributions before your card arrives.</li>
<li><strong>Additional provision 21, new.</strong> Spain is to facilitate issuing the NIE to applicants under this law, with a dedicated web page for appointments. A promise in the law; check the ministry's pages for how it has been implemented.</li>
</ul>
<p>Two more are worth a line. Additional provision 20 ordered instructions with the specific requirements for each visa and permit by 31 March 2023, and said the means thresholds would be referenced to the minimum wage (SMI). Additional provision 17 lets graduates at EQF level 6 or above stay up to 24 months after their studies to look for work or start a business.</p>

<h2>What did not change</h2>
<p>Article 76's core stayed: the UGE processes the file by electronic means, the Dirección General de Migraciones grants it, the maximum period to decide is 20 days from filing, silence means granted, decisions are reasoned and open to an administrative appeal. Article 75.5's consular deadline of 10 working days, with its exception for applicants subject to prior consultation under the Visa Code, is also the 2013 wording.</p>

<h2>How to use the two texts</h2>
<ol>
<li>Read the consolidated text for the rule. Read the original only to understand an older article, consultant note or forum post that quotes "the law" and seems to contradict it.</li>
<li>When a source cites article 68, or a two-year permit, or a report from "the competent body", it is quoting 2013. Ask for the date.</li>
<li>Both BOE pages carry a permanent ELI link. Cite that, not a screenshot.</li>
</ol>
<p>Our ${a(SPAIN, 'Spain guide')} applies the current text to a real file, and ${a(PATH, 'the route finder')} tells you whether that file is yours to open.</p>`,
  },

  // ───────────────────────────────────────────────────────────── fa-3
  {
    file: 'fa-3-ghanun-startup-che-taghir-dad',
    publishAt: '2026-11-28T06:00:00Z',
    locale: 'fa',
    slug: 'spain-startups-law-28-2022-changes-entrepreneur-permit-fa',
    title: 'قانون استارتاپ اسپانیا چه چیزی را در اقامت کارآفرینی عوض کرد؟ ماده‌به‌ماده',
    excerpt: 'قانون ۲۸/۲۰۲۲ فصل کارآفرینی قانون ۱۴/۲۰۱۳ را از نو نوشت. وقتی دو متن را در روزنامه‌ی رسمی اسپانیا کنار هم بخوانید، دقیقاً معلوم می‌شود چه جابه‌جا شد: مدت اقامت، گزارش ENISA، قاعده‌ی سوءپیشینه و ویزایی که حذف شد.',
    category: 'European Visas',
    tags: ['قانون ۲۸/۲۰۲۲', 'قانون ۱۴/۲۰۱۳', 'ویزای استارتاپ اسپانیا', 'BOE', 'ENISA'],
    keyTakeaway: 'از قانون استارتاپ به بعد، اقامت کارآفرینی سه‌ساله است با تمدید دوساله و اقامت دائم در پنج سال، گزارش را ENISA ظرف ده روز کاری می‌دهد، و ویزای یک‌ساله‌ی آماده‌سازی در ماده‌ی ۶۸ قدیم دیگر وجود ندارد.',
    summaryEn: 'Persian field-by-field comparison of Spain\'s Law 14/2013 as published and as amended by Law 28/2022, from the two BOE texts, for the articles governing the entrepreneur residence permit.',
    faq: [
      { q: 'کدام متن قانون ۱۴/۲۰۱۳ برای من معتبر است؟', a: 'متن تلفیقی در boe.es که اصلاحات ۲۰۲۲ را در خود دارد. متن اصلی ۲۰۱۳ فقط برای این به کار می‌آید که ببینید چه عوض شده؛ بعضی راهنماهای قدیمی هنوز از آن نقل می‌کنند.' },
      { q: 'اقامت کارآفرینی را قانون استارتاپ ساخت؟', a: 'نه. این اقامت از قانون ۱۴/۲۰۱۳ است. قانون ۲۸/۲۰۲۲ مدتش، نویسنده‌ی گزارش، سرعت و نحوه‌ی ثبت از خارج را عوض کرد.' },
      { q: 'ویزای یک‌ساله‌ی «کارآفرین» برای آماده‌سازی کسب‌وکار هنوز هست؟', a: 'نه. آن ماده‌ی ۶۸ متن ۲۰۱۳ بود و قانون ۲۸/۲۰۲۲ حذفش کرد.' },
    ],
    internalLinks: [SPAIN_FA, PATH_FA],
    content: `
<p>دو سند در boe.es تمام داستان حقوقی اقامت کارآفرینی اسپانیا را می‌گویند. اولی ${a(SRC.ley14, 'قانون ۱۴/۲۰۱۳ به همان شکلی که در سپتامبر ۲۰۱۳ منتشر شد')}. دومی ${a(SRC.ley28, 'قانون ۲۸/۲۰۲۲، قانون استارتاپ')} که در ۲۲ دسامبر ۲۰۲۲ منتشر شد و از فردایش اجرا شد و مقرره‌ی نهایی پنجمش فصلی از قانون ۲۰۱۳ را که کارآفرینان به آن تکیه دارند از نو نوشت. این مطلب آن دو را کنار هم می‌خواند. از خود روزنامه‌ی رسمی نقل می‌کنیم نه از خلاصه‌اش، و همه‌چیز در ۸ نوامبر ۲۰۲۶ بررسی شده است. اگر متن امروز را یک‌جا می‌خواهید، ${a(SRC.ley14c, 'نسخه‌ی تلفیقی')} قانون ۱۴/۲۰۱۳ را ببینید؛ متن اصلی این‌جاست تا نشان دهد چه جابه‌جا شد.</p>

<h2>این بخش شامل چه کسانی است</h2>
<p>ماده‌ی ۶۱ اصلی، بخش تحرک بین‌المللی را برای پنج گروه باز کرد: سرمایه‌گذاران، کارآفرینان، متخصصان بسیار ماهر، پژوهشگران و انتقال درون‌شرکتی، و شهروندان اتحادیه‌ی اروپا و دارندگان حق آزادی رفت‌وآمد اروپایی را کنار گذاشت. قانون ۲۰۲۲ بند ششمی اضافه کرد، دورکاران بین‌المللی، و فصلی تازه برایشان ساخت. برای کارآفرینان این‌جا چیزی عوض نشد جز هم‌نشین‌هایشان.</p>

<h2>شرایط عمومی و یک تغییر واقعی</h2>
<p>ماده‌ی ۶۲ اصلی شرایطی را گذاشت که هر متقاضی باید داشته باشد: نبودنِ غیرقانونی در اسپانیا، دست‌کم ۱۸ سال، نداشتن سوءپیشینه در اسپانیا و کشورهای محل اقامت در پنج سال گذشته، نبودن در فهرست ممنوع‌الورودهای شنگن، بیمه‌ی درمانی دولتی یا خصوصی از بیمه‌گر مجاز در اسپانیا، منابع مالی کافی برای خود و خانواده، و پرداخت هزینه. خانواده می‌توانست هم‌زمان درخواست بدهد: همسر، فرزندان زیر ۱۸ سال و فرزندان بزرگ‌سالی که نمی‌توانند خرج خود را بدهند.</p>
<p>قانون ۲۰۲۲ به یک بند دست زد. شرط سوءپیشینه حالا دو سال آخر اقامت را می‌گیرد و کنارش یک اظهارنامه‌ی مسئولانه می‌آید که در پنج سال گذشته محکومیتی نبوده است. افق پنج‌ساله ناپدید نشد؛ از گواهی به اظهارنامه‌ی امضاشده منتقل شد. کنسولگری‌ها ممکن است همچنان بیشتر بخواهند، همان‌طور که راهنمای ما گفته، اما متن قانون «دو به‌علاوه‌ی پنج» است.</p>

<h2>مدت اقامت: از سکوت تا سه سال</h2>
<p>ماده‌ی ۶۹ اصلی مجوز اقامت برای فعالیت اقتصادی را ساخت، معتبر در سراسر اسپانیا، و درباره‌ی مدتش چیزی نگفت؛ قاعده‌ی عمومی تمدید در ماده‌ی ۷۶ از دوره‌های دوساله حرف می‌زد. ماده‌ی ۶۹ بازنویسی‌شده دقیق است. مجوز سه سال اعتبار دارد. بعد از آن دو سال تمدید می‌شود و در پنج سال می‌توان اقامت دائم گرفت. همین ماده حالا می‌گوید درخواست چطور داده می‌شود: توسط خود متقاضی یا نماینده‌ی قانونی، الکترونیکی، به UGE؛ و برای کارآفرینِ بیرون از اسپانیا، با یک درخواست واحد که اول مجوز و بعد ویزا را پشت سر هم راه می‌اندازد.</p>

<h2>گزارش: از «مرجع صلاحیت‌دار» تا ENISA، در ده روز کاری</h2>
<p>ماده‌ی ۷۰ اصلی فعالیت کارآفرینانه را فعالیتی نوآورانه با منفعت اقتصادی ویژه برای اسپانیا تعریف کرد که گزارش مثبت «مرجع صلاحیت‌دار دولت مرکزی» آن را تأیید کند، و به آن مرجع گفت اول اشتغال‌زایی در اسپانیا را بسنجد، بعد پروفایل متقاضی، طرح کسب‌وکار و ارزش افزوده را.</p>
<p>متن ۲۰۲۲ سه چیز را عوض می‌کند. فعالیت باید نوآورانه باشد و/یا منفعت اقتصادی ویژه داشته باشد؛ یعنی هر کدام کافی است. گزارش را ENISA می‌دهد، با اسم؛ UGE خودش آن را درخواست می‌کند، الزامی است و باید ظرف ده روز کاری صادر شود. و معیارها بدون دستور «اول اشتغال‌زایی» بازنویسی شده‌اند: پروفایل متقاضی و میزان درگیری‌اش در پروژه، با ارزیابی تک‌تک شرکا چه ویزا بخواهند چه نه؛ طرح کسب‌وکار با شرح پروژه، محصول یا خدمت و تأمین مالی آن، شامل سرمایه‌ی لازم و منابع احتمالی؛ و عناصری که برای اقتصاد اسپانیا ارزش افزوده، نوآوری یا فرصت سرمایه‌گذاری می‌سازند. کارآفرینِ بیرون از اسپانیا پس از صدور مجوز برای ویزا اقدام می‌کند.</p>

<h2>ویزایی که ناپدید شد</h2>
<p>ماده‌ی ۶۸ اصلی ویزایی یک‌ساله پیشنهاد می‌کرد برای ورود به اسپانیا با هدف اصلی انجام مقدمات یک فعالیت کارآفرینانه، با راهی از آن ویزا به مجوز اقامت. قانون ۲۰۲۲ ماده‌ی ۶۸ را یکسره حذف کرد. هر صفحه‌ای که هنوز «ویزای یک‌ساله‌ی کارآفرین برای آماده‌سازی کسب‌وکار» می‌فروشد، مقرره‌ای را توصیف می‌کند که دیگر نیست.</p>

<h2>دو اضافه که کارآفرینان کمتر می‌شنوند</h2>
<ul>
<li><strong>ماده‌ی ۷۶ بند ۴، جدید.</strong> در شش ماه اول اقامت، وقتی دارنده هنوز NIE ندارد، پاسپورت برای ثبت‌نام در تأمین اجتماعی کافی است. همین است که می‌گذارد پیش از رسیدن کارت، حق بیمه بدهید.</li>
<li><strong>مقرره‌ی الحاقی ۲۱، جدید.</strong> اسپانیا باید صدور NIE را برای متقاضیان این قانون تسهیل کند، با یک صفحه‌ی وب اختصاصی برای نوبت. وعده‌ای در متن قانون؛ اجرایش را در صفحه‌های وزارت دنبال کنید.</li>
</ul>
<p>دو مورد دیگر هم یک خط می‌ارزند. مقرره‌ی الحاقی ۲۰ دستور داد دستورالعمل شرایط اختصاصی هر ویزا و مجوز تا ۳۱ مارس ۲۰۲۳ تدوین شود و آستانه‌های تمکن مالی به حداقل دستمزد (SMI) ارجاع داده شود. مقرره‌ی الحاقی ۱۷ به فارغ‌التحصیلان سطح ۶ چارچوب اروپایی و بالاتر اجازه می‌دهد تا ۲۴ ماه بعد از تحصیل برای کاریابی یا راه‌اندازی کسب‌وکار بمانند.</p>

<h2>چه چیزی عوض نشد</h2>
<p>هسته‌ی ماده‌ی ۷۶ ماند: UGE پرونده را الکترونیکی رسیدگی می‌کند، اداره‌ی کل مهاجرت صادر می‌کند، حداکثر مهلت تصمیم ۲۰ روز از ثبت است، سکوت یعنی موافقت، تصمیم‌ها مستدل‌اند و قابل اعتراض اداری. مهلت ده روز کاری کنسولی در ماده‌ی ۷۵ بند ۵، با استثنایش برای متقاضیانِ مشمول استعلام قبلی طبق کد ویزا، هم همان متن ۲۰۱۳ است.</p>

<h2>دو متن را چطور به کار ببرید</h2>
<ol>
<li>قاعده را از متن تلفیقی بخوانید. متن اصلی را فقط برای فهمیدن ماده‌ی قدیمی، یادداشت مشاور یا پست فرومی بخوانید که از «قانون» نقل می‌کند و به نظر با آن ناسازگار است.</li>
<li>وقتی منبعی از ماده‌ی ۶۸، یا اقامت دوساله، یا گزارش «مرجع صلاحیت‌دار» حرف می‌زند، دارد از ۲۰۱۳ نقل می‌کند. تاریخش را بپرسید.</li>
<li>هر دو صفحه‌ی BOE پیوند دائمی ELI دارند. همان را استناد کنید، نه اسکرین‌شات را.</li>
</ol>
<p>${a(SPAIN_FA, 'راهنمای اسپانیای ما')} متن امروز را روی یک پرونده‌ی واقعی پیاده کرده و ${a(PATH_FA, 'مسیریاب')} می‌گوید آن پرونده مال شما هست یا نه.</p>`,
  },

  // ───────────────────────────────────────────────────────────── en-4
  {
    file: 'en-4-startup-certification-vs-permit',
    publishAt: '2026-12-03T10:00:00Z',
    locale: 'en',
    slug: 'enisa-startup-certification-vs-entrepreneur-permit-report-spain',
    title: 'Two ENISA Reports, Two Different Things: Startup Certification vs the Entrepreneur Permit',
    excerpt: 'ENISA appears in two Spanish laws. Under the Startups Law it certifies companies as "emerging" for tax and corporate benefits, within three months. Under Law 14/2013 it reports on a founder\'s project for a residence permit, within ten working days. Founders mix them up constantly.',
    category: 'European Visas',
    tags: ['ENISA', 'empresa emergente', 'Ley 28/2022', 'Spain startup visa', 'startup certification'],
    keyTakeaway: 'Startup certification under Law 28/2022 is for a company that already exists and meets seven conditions, decided in up to three months. The report for the entrepreneur permit under Law 14/2013 is about your project and profile, issued in ten working days. You do not need the first to get the second.',
    summaryEn: 'Explains the difference between ENISA\'s certification of an "empresa emergente" under Spain\'s Law 28/2022 and ENISA\'s report on an entrepreneur residence permit under Law 14/2013, from the two BOE texts.',
    faq: [
      { q: 'Do I need my company certified as a startup to get the entrepreneur permit?', a: 'No. The permit\'s report under article 70 of Law 14/2013 assesses your profile, business plan and added value. Startup certification under article 4 of Law 28/2022 is a separate procedure for an existing company seeking the Startups Law\'s benefits.' },
      { q: 'What counts as an "empresa emergente"?', a: 'Article 3 of Law 28/2022 lists seven conditions that must all be met, including being no more than five years old (seven in some sectors), never having paid dividends, not being listed, having its seat or a permanent establishment in Spain, and having 60% of staff employed in Spain.' },
      { q: 'How long does each ENISA procedure take?', a: 'Certification: up to three months from a complete application, with positive silence if ENISA does not answer. The permit report: ten working days from the UGE\'s request.' },
    ],
    internalLinks: [SPAIN, PATH],
    content: `
<p>A sentence we hear from founders more than any other about Spain goes roughly: "I need to get my startup certified by ENISA for the visa." It is half right, and the wrong half costs months. ENISA, Spain's Empresa Nacional de Innovación, does two different jobs under two different laws, and the one the sentence describes is not the one the permit needs. This article separates them using the texts themselves: ${a(SRC.ley28, 'Law 28/2022, the Startups Law')}, and ${a(SRC.ley14, 'Law 14/2013')} as amended by it. Both read on 8 November 2026.</p>

<h2>Job one: certifying a company as "emerging"</h2>
<p>The Startups Law applies to "empresas emergentes", and article 3 defines them. A company qualifies only if it meets every one of these conditions:</p>
<ol>
<li>It is newly created, or no more than five years have passed since its incorporation deed was registered; seven years for biotechnology, energy, industrial and other strategic sectors, or for companies that developed their own technology designed entirely in Spain.</li>
<li>It did not come out of a merger, spin-off or transformation of companies that were not themselves startups.</li>
<li>It has never distributed dividends.</li>
<li>It is not listed on a regulated market.</li>
<li>Its registered office or a permanent establishment is in Spain.</li>
<li>60% of its workforce is on employment contracts in Spain.</li>
<li>It runs an innovative project with a scalable business model, as article 4 defines it.</li>
</ol>
<p>Article 4 is where ENISA comes in. A founder who wants the law's benefits asks ENISA to evaluate the company against articles 3 and 6 and for the innovative and scalable character of the model. ENISA has up to three months from a complete application; if it does not answer, the request counts as granted by positive silence, and the clock stops while documents are requested. The criteria are a list any investor would recognise: innovation, including public funding received in the last three years and R&amp;D spend over the last two years, or one for younger firms; market attractiveness and traction; stage, from prototype to minimum viable product to market; scalability of users, operations or revenue; competition and differentiation; the team; dependence on suppliers and leases; customers. ENISA may refuse where the model raises reputational, regulatory, ethical or speculative doubts, and must publish a procedure guide.</p>
<p>Notice what this is about: a legal person, already incorporated, with staff, accounts and a registration date. The benefits that follow, in tax, corporate and labour law, are for that company.</p>

<h2>Job two: reporting on a founder's project for a residence permit</h2>
<p>Law 14/2013, article 70 as rewritten in 2022, asks a different question. An entrepreneurial activity, for the residence permit, is one that is innovative and/or of special economic interest for Spain, and the evidence is a favourable report from ENISA. The UGE requests that report itself when you file; it is mandatory, and it must be issued within ten working days. What ENISA weighs here is: your professional profile and involvement, with each partner assessed whether or not they need a visa; your business plan, describing the project, the product or service and its financing, including the investment required and the possible sources; and the elements that bring added value, innovation or investment opportunities to Spain.</p>
<p>Nothing in that list is a company age, a dividend history, a listing or a payroll percentage. It is a project and a person. You can be assessed before the company exists, which is exactly the position of most applicants.</p>

<h2>Side by side</h2>
<ul>
<li><strong>Legal basis.</strong> Certification: articles 3 and 4 of Law 28/2022. Permit report: article 70 of Law 14/2013.</li>
<li><strong>Subject.</strong> Certification: an incorporated company. Permit report: a founder and a plan.</li>
<li><strong>Test.</strong> Certification: seven conditions, all required, plus innovative and scalable. Permit report: innovative and/or of special economic interest.</li>
<li><strong>Clock.</strong> Certification: up to three months, positive silence. Permit report: ten working days from the UGE's request; the permit decision itself has its own 20-day clock at the UGE.</li>
<li><strong>Who asks ENISA.</strong> Certification: the founders, directly. Permit report: the UGE, ex officio, after you file.</li>
<li><strong>What you get.</strong> Certification: access to the Startups Law's benefits. Permit report: the document the UGE needs to grant residence.</li>
</ul>

<h2>Why the confusion exists</h2>
<p>The same agency, the same word "innovative", the same year. Law 28/2022 both created the certification and rewrote the permit's article 70 to name ENISA, so pages written in 2023 often describe the two in one breath. Add that ENISA runs one portal, and a founder reading "apply to ENISA" cannot tell which door is meant. The permit's door is opened by the UGE when you file; the certification's door you open yourself, later, with a company.</p>

<h2>What to do</h2>
<ol>
<li>For the permit, prepare what article 70 names: your profile, a plan with product, financing and sources, and the value for Spain. File with the UGE; it will ask ENISA.</li>
<li>Do not wait for, or pay for, "startup certification" before filing. It is not a prerequisite, and you cannot hold it for a company that does not exist yet.</li>
<li>Once you have incorporated in Spain, read article 3 against your company. If all seven conditions hold, certification under article 4 becomes a real option for the benefits it unlocks, a separate decision for a later day.</li>
</ol>
<p>The ${a(SPAIN, 'Spain guide')} walks the permit file in order, and ${a(PATH, 'the route finder')} says whether Spain is the file to open.</p>`,
  },

  // ───────────────────────────────────────────────────────────── fa-4
  {
    file: 'fa-4-do-gozaresh-enisa',
    publishAt: '2026-12-05T06:00:00Z',
    locale: 'fa',
    slug: 'enisa-startup-certification-vs-entrepreneur-permit-fa',
    title: 'دو گزارش ENISA، دو چیز متفاوت؛ گواهی استارتاپ در برابر اقامت کارآفرینی',
    excerpt: 'ENISA در دو قانون اسپانیا حضور دارد. طبق قانون استارتاپ، شرکت‌ها را ظرف سه ماه به‌عنوان «شرکت نوپا» گواهی می‌کند برای مزایای مالیاتی و شرکتی. طبق قانون ۱۴/۲۰۱۳، درباره‌ی پروژه‌ی یک کارآفرین برای اقامت ظرف ده روز کاری گزارش می‌دهد. کارآفرینان مدام این دو را قاطی می‌کنند.',
    category: 'European Visas',
    tags: ['ENISA', 'شرکت نوپا', 'قانون ۲۸/۲۰۲۲', 'ویزای استارتاپ اسپانیا', 'گواهی استارتاپ'],
    keyTakeaway: 'گواهی استارتاپ طبق قانون ۲۸/۲۰۲۲ برای شرکتی است که وجود دارد و هفت شرط را دارد و تا سه ماه طول می‌کشد. گزارش اقامت کارآفرینی طبق قانون ۱۴/۲۰۱۳ درباره‌ی پروژه و پروفایل شماست و ده روز کاری. برای دومی به اولی نیاز ندارید.',
    summaryEn: 'Persian explainer separating ENISA\'s certification of an "empresa emergente" under Law 28/2022 from ENISA\'s report on the entrepreneur residence permit under Law 14/2013, from the BOE texts.',
    faq: [
      { q: 'برای اقامت کارآفرینی باید شرکتم گواهی استارتاپ بگیرد؟', a: 'نه. گزارش اقامت طبق ماده‌ی ۷۰ قانون ۱۴/۲۰۱۳ پروفایل، طرح کسب‌وکار و ارزش افزوده‌ی شما را می‌سنجد. گواهی استارتاپ طبق ماده‌ی ۴ قانون ۲۸/۲۰۲۲ رویه‌ای جداست برای شرکتی موجود که مزایای قانون استارتاپ را می‌خواهد.' },
      { q: '«شرکت نوپا» یعنی چه؟', a: 'ماده‌ی ۳ قانون ۲۸/۲۰۲۲ هفت شرط می‌گذارد که همه باید برقرار باشند، از جمله عمر حداکثر پنج سال (هفت سال در بعضی بخش‌ها)، سود تقسیم‌نکرده، بورسی‌نبودن، دفتر مرکزی یا شعبه‌ی دائم در اسپانیا، و ۶۰ درصد کارکنان با قرارداد کار در اسپانیا.' },
      { q: 'هر کدام چقدر طول می‌کشد؟', a: 'گواهی: تا سه ماه از درخواست کامل، و اگر ENISA جواب ندهد سکوت مثبت است. گزارش اقامت: ده روز کاری از درخواست UGE.' },
    ],
    internalLinks: [SPAIN_FA, PATH_FA],
    content: `
<p>جمله‌ای که درباره‌ی اسپانیا بیش از هر جمله‌ی دیگری از کارآفرینان می‌شنویم تقریباً این است: «باید استارتاپم را از ENISA گواهی بگیرم تا ویزا بدهند.» نیمی‌اش درست است و نیمه‌ی غلطش ماه‌ها هزینه دارد. ENISA، شرکت ملی نوآوری اسپانیا، دو کار متفاوت زیر دو قانون متفاوت انجام می‌دهد و آنچه این جمله توصیف می‌کند همانی نیست که اقامت لازم دارد. این مطلب این دو را با خود متن‌ها از هم جدا می‌کند: ${a(SRC.ley28, 'قانون ۲۸/۲۰۲۲، قانون استارتاپ')} و ${a(SRC.ley14, 'قانون ۱۴/۲۰۱۳')} که همان قانون اصلاحش کرد. هر دو در ۸ نوامبر ۲۰۲۶ خوانده شده‌اند.</p>

<h2>کار اول: گواهی «شرکت نوپا»</h2>
<p>قانون استارتاپ برای «empresa emergente» نوشته شده و ماده‌ی ۳ تعریفش می‌کند. شرکتی واجد شرایط است که همه‌ی این شرط‌ها را با هم داشته باشد:</p>
<ol>
<li>تازه‌تأسیس باشد، یا از ثبت سند تأسیسش بیش از پنج سال نگذشته باشد؛ هفت سال برای زیست‌فناوری، انرژی، صنعت و بخش‌های راهبردی دیگر، یا شرکت‌هایی که فناوری اختصاصی‌شان را تماماً در اسپانیا طراحی کرده‌اند.</li>
<li>از ادغام، تجزیه یا تبدیل شرکت‌هایی که خودشان نوپا نبوده‌اند بیرون نیامده باشد.</li>
<li>هیچ‌وقت سود تقسیم نکرده باشد.</li>
<li>در بازار بورس تنظیم‌شده پذیرفته نشده باشد.</li>
<li>دفتر ثبتی یا شعبه‌ی دائمش در اسپانیا باشد.</li>
<li>۶۰ درصد کارکنانش قرارداد کار در اسپانیا داشته باشند.</li>
<li>پروژه‌ی کارآفرینانه‌ی نوآورانه با مدل کسب‌وکار مقیاس‌پذیر داشته باشد، به تعریف ماده‌ی ۴.</li>
</ol>
<p>ماده‌ی ۴ جایی است که ENISA وارد می‌شود. کارآفرینی که مزایای قانون را می‌خواهد از ENISA می‌خواهد شرکت را با مواد ۳ و ۶ و با معیار نوآورانه و مقیاس‌پذیر بودن مدل بسنجد. ENISA از درخواست کامل تا سه ماه فرصت دارد؛ اگر جواب ندهد، درخواست با سکوت مثبت پذیرفته‌شده حساب می‌شود و تا وقتی مدرکی خواسته شده ساعت می‌ایستد. معیارها فهرستی است که هر سرمایه‌گذاری می‌شناسد: نوآوری، شامل بودجه‌ی عمومی دریافتی در سه سال گذشته و هزینه‌ی تحقیق و توسعه در دو سال گذشته یا یک سال برای شرکت‌های جوان‌تر؛ جذابیت بازار و کشش؛ مرحله‌ی عمر، از نمونه‌ی اولیه تا محصول حداقلی تا ورود به بازار؛ مقیاس‌پذیری کاربر، عملیات یا درآمد؛ رقبا و تمایز؛ تیم؛ وابستگی به تأمین‌کنندگان و اجاره‌ها؛ مشتریان. ENISA می‌تواند جایی که مدل تردید اعتباری، نظارتی، اخلاقی یا سفته‌بازانه ایجاد می‌کند رد کند و باید راهنمای رویه منتشر کند.</p>
<p>دقت کنید موضوع چیست: یک شخص حقوقی، ثبت‌شده، با کارکنان، حساب‌ها و تاریخ ثبت. مزایایی که در مالیات، حقوق شرکت‌ها و کار به دنبال می‌آید برای آن شرکت است.</p>

<h2>کار دوم: گزارش درباره‌ی پروژه‌ی یک کارآفرین برای اقامت</h2>
<p>ماده‌ی ۷۰ قانون ۱۴/۲۰۱۳، به شکل بازنویسی‌شده‌ی ۲۰۲۲، پرسش دیگری می‌پرسد. فعالیت کارآفرینانه برای اقامت، فعالیتی است نوآورانه و/یا با منفعت اقتصادی ویژه برای اسپانیا، و شاهدش گزارش مثبت ENISA است. وقتی پرونده را ثبت می‌کنید، UGE خودش این گزارش را درخواست می‌کند؛ الزامی است و باید ظرف ده روز کاری صادر شود. آنچه ENISA این‌جا می‌سنجد: پروفایل حرفه‌ای شما و میزان درگیری‌تان، با ارزیابی تک‌تک شرکا چه ویزا بخواهند چه نه؛ طرح کسب‌وکار شما با شرح پروژه، محصول یا خدمت و تأمین مالی آن، شامل سرمایه‌ی لازم و منابع احتمالی؛ و عناصری که برای اسپانیا ارزش افزوده، نوآوری یا فرصت سرمایه‌گذاری می‌آورند.</p>
<p>در این فهرست نه عمر شرکت هست، نه سابقه‌ی تقسیم سود، نه بورس و نه درصد کارکنان. پروژه است و آدم. می‌توانید پیش از آن‌که شرکت وجود داشته باشد ارزیابی شوید، و وضعیت بیشتر متقاضیان دقیقاً همین است.</p>

<h2>کنار هم</h2>
<ul>
<li><strong>مبنای قانونی.</strong> گواهی: مواد ۳ و ۴ قانون ۲۸/۲۰۲۲. گزارش اقامت: ماده‌ی ۷۰ قانون ۱۴/۲۰۱۳.</li>
<li><strong>موضوع.</strong> گواهی: شرکت ثبت‌شده. گزارش اقامت: کارآفرین و طرح.</li>
<li><strong>آزمون.</strong> گواهی: هفت شرط، همه لازم، به‌علاوه‌ی نوآورانه و مقیاس‌پذیر. گزارش اقامت: نوآورانه و/یا منفعت اقتصادی ویژه.</li>
<li><strong>زمان.</strong> گواهی: تا سه ماه، سکوت مثبت. گزارش اقامت: ده روز کاری از درخواست UGE؛ خود تصمیم اقامت هم ساعت ۲۰ روزه‌ی خودش را در UGE دارد.</li>
<li><strong>چه کسی از ENISA می‌خواهد.</strong> گواهی: خود بنیان‌گذاران، مستقیم. گزارش اقامت: UGE، رأساً، بعد از ثبت شما.</li>
<li><strong>نتیجه.</strong> گواهی: دسترسی به مزایای قانون استارتاپ. گزارش اقامت: سندی که UGE برای صدور اقامت لازم دارد.</li>
</ul>

<h2>چرا این اشتباه پیش می‌آید</h2>
<p>یک نهاد، یک کلمه‌ی «نوآورانه»، یک سال. قانون ۲۸/۲۰۲۲ هم گواهی را ساخت و هم ماده‌ی ۷۰ اقامت را بازنویسی کرد تا اسم ENISA در آن بیاید؛ برای همین صفحه‌هایی که در ۲۰۲۳ نوشته شده‌اند اغلب هر دو را در یک نفس می‌گویند. اضافه کنید که ENISA یک درگاه دارد و کارآفرینی که می‌خواند «به ENISA درخواست بده» نمی‌فهمد کدام در منظور است. درِ اقامت را UGE هنگام ثبت پرونده‌ی شما باز می‌کند؛ درِ گواهی را خودتان بعداً با یک شرکت باز می‌کنید.</p>

<h2>چه کنید</h2>
<ol>
<li>برای اقامت، آنچه ماده‌ی ۷۰ نام می‌برد آماده کنید: پروفایلتان، طرحی با محصول، تأمین مالی و منابع، و ارزش برای اسپانیا. به UGE بدهید؛ خودش از ENISA می‌پرسد.</li>
<li>پیش از ثبت، منتظر «گواهی استارتاپ» نمانید و برایش پول ندهید. پیش‌نیاز نیست و برای شرکتی که هنوز وجود ندارد نمی‌شود گرفتش.</li>
<li>وقتی در اسپانیا شرکت ثبت کردید، ماده‌ی ۳ را با شرکتتان بسنجید. اگر هر هفت شرط برقرار بود، گواهی ماده‌ی ۴ برای مزایایی که باز می‌کند گزینه‌ای واقعی می‌شود؛ تصمیمی جدا برای روزی دیگر.</li>
</ol>
<p>${a(SPAIN_FA, 'راهنمای اسپانیای ما')} پرونده‌ی اقامت را به ترتیب جلو می‌برد و ${a(PATH_FA, 'مسیریاب')} می‌گوید اسپانیا پرونده‌ی درستی برای شما هست یا نه.</p>`,
  },
];
