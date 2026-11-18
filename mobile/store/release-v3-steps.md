# انتشار متن v3 و بیلد ۱۱ — قدم‌به‌قدم (۱۷ نوامبر ۲۰۲۶)

متن همه‌ی فیلدها در `listing-v3.md` است، کنار همین فایل. ux-auditor آن را بررسی کرد: PASS WITH FIXES، و اصلاح‌ها اعمال شده است. QA روی بیلد ۱۱: گزارش در `docs/mobile/qa/2026-11-17-android-11.md`.

## گوگل پلی (همه را شما کلیک می‌کنید)

### ۱. بیلد ۱۱ به production
1. Play Console › VisaRoads › **Test and release › Production** را باز کنید. اگر نسخه‌ی ۱۱ در Internal یا Closed testing است، در همان track دکمه‌ی **Promote release › Production** را بزنید. اگر در هیچ track نیست: **Create new release** › **Add from library** › versionCode **11 (1.0.0)**.
2. در **Release notes** متن زیر را کامل paste کنید (پنج زبان، تگ‌ها همان زبان‌های لیستینگ است):

```
<en-US>
68 routes in 17 countries: Australia, Austria, Norway, Ireland, Sweden, Spain and Bulgaria are new. Home now opens on Today. Express Entry score calculator and the latest draws, in the app. News now reads inside the app. Route pages have four tabs: Do, Rules, Money, After. The assessment is two screens: still ten questions, each skippable, no account.
</en-US>
<fa>
۶۸ مسیر در ۱۷ کشور: استرالیا، اتریش، نروژ، ایرلند، سوئد، اسپانیا و بلغارستان تازه‌اند. «خانه» حالا با «امروز» باز می‌شود. ماشین‌حساب امتیاز اکسپرس اینتری و آخرین قرعه‌کشی‌ها داخل برنامه. اخبار حالا داخل برنامه خوانده می‌شود. صفحه‌ی هر مسیر چهار بخش دارد: کارها، قوانین، پول، پس از ورود. ارزیابی در دو صفحه است: هنوز ده سؤال، از هرکدام می‌شود گذشت، بدون حساب کاربری.
</fa>
<fr-FR>
68 parcours dans 17 pays : Australie, Autriche, Norvège, Irlande, Suède, Espagne et Bulgarie sont nouveaux. L’onglet Accueil s’ouvre sur « Aujourd’hui ». Calculateur de score Entrée express et derniers tirages dans l’application. Les actualités se lisent maintenant dans l’application. Les parcours ont quatre onglets : Faire, Règles, Argent, Après. L’évaluation tient sur deux écrans : toujours dix questions, chacune facultative, sans compte.
</fr-FR>
<zh-CN>
17 个国家 68 条路径：新增澳大利亚、奥地利、挪威、爱尔兰、瑞典、西班牙和保加利亚。“首页”现在打开的是“今天”。应用内可用快速通道分数计算器并查看最近抽签。资讯现在可在应用内阅读。路径页分四个标签：要做、规则、资金、之后。评估分两页：仍是十个问题，每题可选“不愿透露”，无需账号。
</zh-CN>
<ar>
68 مسارًا في 17 دولة: أستراليا والنمسا والنرويج وأيرلندا والسويد وإسبانيا وبلغاريا جديدة. «الرئيسية» تفتح الآن على «اليوم». حاسبة نقاط الدخول السريع وآخر السحوبات داخل التطبيق. الأخبار تُقرأ الآن داخل التطبيق. لكل مسار أربعة أقسام: المهام، القواعد، المال، بعد الوصول. التقييم على شاشتين: ما زال عشرة أسئلة، يمكن تخطي كل منها، بلا حساب.
</ar>```
3. **Next** › اگر خطا یا هشدار آمد، اسکرین‌شات بفرستید. **Staged rollout**: ۲۰٪. اگر بعد از ۲ روز در **Quality › Android vitals** کرش جدیدی نبود، در همان صفحه **Increase rollout › 100%** را بزنید.
4. **Publishing overview** › اگر «Changes not yet sent for review» دیدید › **Send changes for review**.

### ۲. متن لیستینگ (بدون بیلد)
**Grow users › Store presence › Main store listing**. برای هر زبان (en-US، fa، fr-FR، zh-CN، ar) از بخش «Google Play» همان زبان در `listing-v3.md` این‌ها را بگذارید:
- App name ← Title
- Short description ← Short description
- Full description ← همان Description بخش App Store همان زبان (یکی است)

**Save** را بزنید. این تغییر همراه با همان review (قدم ۱.۴) فرستاده می‌شود.

### ۳. گرافیک‌ها
بعداً اضافه می‌شود، وقتی اسکرین‌شات‌های جدید و feature graphic آماده شد. تا آن موقع به عکس‌های فعلی دست نزنید.

## اپ استور — فقط Promotional text، همین امروز
App Store Connect › VisaRoads › نسخه‌ی **1.0.0** (Ready for Distribution) › برای هر زبان، فیلد **Promotional Text** را با «Promotional text» همان زبان در `listing-v3.md` عوض کنید › **Save**. این فیلد review لازم ندارد.
- زبان انگلیسی در نسخه‌ی اول **English (Canada)** بود (en-CA)، نه en-US. متن را در زبانی بگذارید که در App Store Connect هست.
- فارسی در App Store Connect وجود ندارد.
- بقیه‌ی فیلدها (Description، What's New، Keywords، اسکرین‌شات‌ها) با نسخه‌ی **1.0.1** عوض می‌شوند. تصمیم ۱۷ نوامبر: 1.0.1 را وقتی می‌سازیم که اسکرین‌شات‌ها آماده باشد.
- What's New مربوط به 1.0.1 باید از نو نوشته شود. متن فعلی v3 تغییراتی را می‌شمارد که کاربران iOS از اول در 1.0.0 داشته‌اند.

## موارد باز
- fa What's New تاریخ میلادی دارد («۲۷ اکتبر»، «۹ نوامبر») اما اپ در فارسی تاریخ شمسی می‌نویسد. معادل شمسی: «۵ آبان» و «۱۸ آبان». تصمیمش با فرجاد است.
- نرخ‌های ECB از ۱۵ اکتبر ثابت مانده‌اند و حدود ۱۳ ژانویه‌ی ۲۰۲۷ در اپ پنهان می‌شوند. باید قبل از آن یک OTA نرخ‌ها را تازه کند.
- `privacy-app-section.md` و Data safety این‌ها را ذکر نمی‌کنند: درخواست draws، تصویرهای Google Cloud Storage و بررسی آپدیت Expo. باید جداگانه بررسی شود.
- برچسب خانواده‌ی `express` در اپ برای همه‌ی کشورها «Express Entry» است، حتی برای کارت قرمز-سفید-قرمز اتریش. این را می‌شود با OTA درست کرد.
- در صفحه‌ی نتیجه، بالای کارت اول یک مستطیل خاکستری تیره هست (عکس کشور، در شبیه‌ساز). همین کد الان روی گوشی‌ها و iOS هم هست. روی یک گوشی واقعی چک شود.
- بازبینی متن ar، zh و fr توسط کسی که زبان مادری‌اش است (فهرست در `listing-v3.md`، بند ۹).
