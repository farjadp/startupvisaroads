# انتشار متن v3 و بیلد ۱۱ — قدم‌به‌قدم (۱۷ نوامبر ۲۰۲۶)

متن همه‌ی فیلدها در `listing-v3.md` است، کنار همین فایل. ux-auditor آن را بررسی کرد: PASS WITH FIXES، و اصلاح‌ها اعمال شده است. QA روی بیلد ۱۱: گزارش در `docs/mobile/qa/2026-11-17-android-11.md`.

## گوگل پلی (همه را شما کلیک می‌کنید)

### ۱. بیلد ۱۲ (1.0.1) به production
0. فایل AAB بیلد ۱۲ را از EAS دانلود کنید (لینک در بخش «لینک‌ها» پایین همین صفحه). بیلد ۱۲ همان کد بیلد ۱۱ است و فقط نسخه‌اش 1.0.1 شده. **بیلد ۱۱ را دیگر promote نکنید.** اگر قبلاً آن را فرستاده‌اید، اشکالی ندارد: بیلد ۱۲ جای آن را می‌گیرد.
1. Play Console › VisaRoads › **Test and release › Production** › **Create new release** › **Upload** › فایل `.aab` بیلد ۱۲.
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

### ۳. گرافیک‌ها (از PR #108، پوشه‌ی `mobile/store/build-v3/play/`)
در **Main store listing**، برای هر زبان:
- **Phone screenshots**: عکس‌های قبلی را حذف کنید و هشت فایل `screenshots/<زبان>/01-today.png` تا `08-news.png` را به همین ترتیب آپلود کنید. نام پوشه‌ها: `en-US`، `fa`، `fr-FR`، `zh-CN`، `ar`.
- **Feature graphic**: فایل `feature-graphic.png`. فعلاً فقط نسخه‌ی انگلیسی آن هست و برای همه‌ی زبان‌ها همان می‌ماند.
- **App icon**: فایل `icon-512.png`، فقط اگر با آیکون فعلی فرق دارد.

## اپ استور — قدم ۱: Promotional text، همین امروز
App Store Connect › VisaRoads › نسخه‌ی **1.0.0** (Ready for Distribution) › برای هر زبان، فیلد **Promotional Text** را با «Promotional text» همان زبان در `listing-v3.md` عوض کنید › **Save**. این فیلد review لازم ندارد.
- زبان انگلیسی در نسخه‌ی اول **English (Canada)** بود (en-CA)، نه en-US. متن را در زبانی بگذارید که در App Store Connect هست.
- فارسی در App Store Connect وجود ندارد.

## اپ استور — قدم ۲: نسخه‌ی 1.0.1 و Submit for Review
بیلد iOS 1.0.1 (9) در ۱۷ نوامبر با `eas submit` به App Store Connect فرستاده شد (runtime `7cf56aa4`). پردازشش در TestFlight حدود ۱۰ تا ۳۰ دقیقه طول می‌کشد.
1. App Store Connect › VisaRoads › کنار **iOS App** دکمه‌ی **+** › شماره‌ی نسخه را **1.0.1** بنویسید.
2. برای هر زبان (English، French، Chinese Simplified، Arabic) از بخش App Store همان زبان در `listing-v3.md` این فیلدها را پر کنید:
   - **What's New in This Version** ← «What's New, App Store 1.0.1»
   - **Description** ← Description
   - **Keywords** ← Keywords
   - **Promotional Text** ← از قدم ۱
3. **Screenshots** (از PR #108، پوشه‌ی `mobile/store/build-v3/app-store/screenshots/`): برای هر زبان، عکس‌های قبلی را پاک کنید.
   - بخش **6.9" Display**: هشت فایل پوشه‌ی `<زبان>/6.9in/` را به ترتیب `01` تا `08` بکشید.
   - بخش **6.5" Display**: فایل‌های پوشه‌ی `<زبان>/6.5in/` را بگذارید. اگر App Store Connect فقط 6.9" خواست، این بخش لازم نیست.
   - نام پوشه‌ها `en-US`، `fr-FR`، `zh-Hans` و `ar-SA` است. پوشه‌ی `en-US` را برای زبان انگلیسی‌ای بگذارید که در App Store Connect دارید (احتمالاً English (Canada)).
4. بخش **Build** › **+** › بیلد **1.0.1 (9)** را انتخاب کنید. اگر سؤال export compliance پرسید، جوابش «None of the algorithms mentioned» است؛ این مورد در `ITSAppUsesNonExemptEncryption=false` تنظیم شده است.
5. **Add for Review** › **Submit for Review**. بخش «App Review Information» را تغییر ندهید، مگر اینکه ایراد گرفت.
- **Name** و **Subtitle** را فقط اگر با متن v3 فرق دارند عوض کنید. این دو فیلد هم همراه همین نسخه بررسی می‌شوند.

## موارد باز
- fa What's New تاریخ میلادی دارد («۲۷ اکتبر»، «۹ نوامبر») اما اپ در فارسی تاریخ شمسی می‌نویسد. معادل شمسی: «۵ آبان» و «۱۸ آبان». تصمیمش با فرجاد است.
- نرخ‌های ECB از ۱۵ اکتبر ثابت مانده‌اند و حدود ۱۳ ژانویه‌ی ۲۰۲۷ در اپ پنهان می‌شوند. باید قبل از آن یک OTA نرخ‌ها را تازه کند.
- `privacy-app-section.md` و Data safety این‌ها را ذکر نمی‌کنند: درخواست draws، تصویرهای Google Cloud Storage و بررسی آپدیت Expo. باید جداگانه بررسی شود.
- برچسب خانواده‌ی `express` در اپ برای همه‌ی کشورها «Express Entry» است، حتی برای کارت قرمز-سفید-قرمز اتریش. این را می‌شود با OTA درست کرد.
- در صفحه‌ی نتیجه، بالای کارت اول یک مستطیل خاکستری تیره هست (عکس کشور، در شبیه‌ساز). همین کد الان روی گوشی‌ها و iOS هم هست. روی یک گوشی واقعی چک شود.
- بازبینی متن ar، zh و fr توسط کسی که زبان مادری‌اش است (فهرست در `listing-v3.md`، بند ۹).

## بعد از انتشار — OTA دو بار منتشر می‌شود
از وقتی 1.0.1 روی گوشی‌ها برود، دو runtime فعال داریم: 1.0.0 (iOS `99a8c4c3`، اندروید `38452566`) و 1.0.1 (iOS `7cf56aa4`، اندروید `c525597e`). هر آپدیت OTA را دو بار منتشر کنید: یک بار از main، و یک بار از یک worktree تمیزِ main که در آن `version` به 1.0.0 برگردانده شده است. روشش در `mobile/RELEASE.md` نوشته شده.

## لینک‌ها
- بیلد اندروید ۱۲: https://expo.dev/accounts/ashavid/projects/visaroads/builds/f507aef2-f84e-43be-a40e-85438059cb2b
- فایل AAB بیلد ۱۲ (دانلود مستقیم): https://expo.dev/artifacts/eas/DfvnBDOtAquQ8qNiaxvCa513lT0UwI7ol56ACbcUwkQ.aab
- بیلد iOS 1.0.1 (9): https://expo.dev/accounts/ashavid/projects/visaroads/builds/36fd44c8-ee97-46fc-9f79-fb5ed4af4d2e
