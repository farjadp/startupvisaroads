// ============================================================================
// lib/fa/path-quiz.ts
// Scoring for /fa/which-path. A pure function so it is testable and so the
// rules are readable in one place. This is triage, not advice: it picks
// which page the reader should read next and says why in two sentences.
//
// Since the Canada Start-up Visa closed to new applications (31 Dec 2025)
// the outcomes are: a European startup visa (Finland for teams, Estonia or
// Denmark for a solo founder), an Atlantic Canada entrepreneur stream when
// the money clears the thresholds, EB-2 NIW for research profiles, or
// `too-early` — a real answer, not a failure.
// ============================================================================

export type QuizAnswers = {
  /** هدف اصلی */
  goal: 'residency' | 'growth' | 'family';
  /** تیم: تنها یا با هم‌بنیان‌گذار */
  team: 'solo' | 'team';
  /** وضعیت کسب‌وکار */
  business: 'none' | 'idea' | 'mvp' | 'revenue';
  /** زبان: زیر CLB 5 / CLB 5–7 / بالای CLB 7 */
  language: 'low' | 'mid' | 'high';
  /** سرمایه‌ی قابل انتقال، دلار کانادا */
  capital: 'under50' | '50to200' | '200to500' | 'over500';
  /** پیشینه */
  background: 'none' | 'professional' | 'research';
  /** بازه‌ی زمانی */
  horizon: 'urgent' | 'medium' | 'long';
};

export type PathId = 'finland' | 'denmark' | 'estonia' | 'atlantic' | 'eb2niw' | 'too-early';

export type Recommendation = {
  path: PathId;
  title: string;
  why: string;
  href: string;
};

const RESULT: Record<PathId, { title: string; href: string }> = {
  finland: { title: 'ویزای استارتاپ فنلاند', href: '/europe/finland' },
  denmark: { title: 'ویزای استارتاپ دانمارک', href: '/europe/denmark' },
  estonia: { title: 'ویزای استارتاپ استونی', href: '/europe/estonia' },
  atlantic: { title: 'مسیر کارآفرینی نیوبرانزویک یا نوااسکوشیا', href: '/pnp/new-brunswick' },
  eb2niw: { title: 'EB-2 NIW آمریکا', href: '/usa-eb2-niw' },
  'too-early': { title: 'هنوز زود است — و این خبر خوبی است', href: '/mentorship' },
};

function result(path: PathId, why: string): Recommendation {
  return { path, ...RESULT[path], why };
}

export function recommendPath(a: QuizAnswers): Recommendation {
  const hasBusiness = a.business === 'mvp' || a.business === 'revenue';
  const funded = a.capital === '200to500' || a.capital === 'over500';
  const langOk = a.language !== 'low';

  // Research profile with no operating business → NIW, whatever the capital.
  if (a.background === 'research' && !hasBusiness) {
    return result(
      'eb2niw',
      'سابقه‌ی پژوهشی شما دقیقاً همان چیزی است که معیار دوم Dhanasar می‌خواهد، و NIW به کارفرما یا سرمایه نیاز ندارد. پیش از هر اقدامی، وضعیت فعلی محدودیت ورود اتباع ایران به آمریکا را با وکیل بررسی کنید.',
    );
  }

  // Nothing to build on yet: no business and no relevant background.
  if (!hasBusiness && a.background === 'none') {
    return result(
      'too-early',
      'بدون کسب‌وکار در حال اجرا و بدون سابقه‌ی حرفه‌ای یا پژوهشی مشخص، هیچ‌کدام از مسیرهای باز امروز برای شما منطقی نیست — و هر کسی که خلاف این را بگوید، پول شما را می‌خواهد. اول یکی از این دو را بسازید؛ ما در همین مرحله کمک می‌کنیم.',
    );
  }

  // Idea-stage founder without funds → too early for Europe (they want an MVP), nothing for Atlantic.
  if (a.business === 'idea' && !funded) {
    return result(
      'too-early',
      'ایده به‌تنهایی برای Business Finland، پنل دانمارک یا کمیته‌ی استونی کافی نیست؛ همه‌ی آن‌ها محصول اولیه و شواهد بازار می‌خواهند. شش تا دوازده ماه ساختن MVP و گرفتن اولین کاربران، شما را از «زود است» به «آماده» می‌برد.',
    );
  }

  // Funded professional or founder who wants Canada-style permanence and can clear the thresholds.
  if (funded && a.background !== 'none' && (a.goal !== 'growth' || !hasBusiness)) {
    return result(
      'atlantic',
      'سرمایه‌ی قابل انتقال و سابقه‌ی مدیریت شما از آستانه‌های مسیرهای کارآفرینی آتلانتیک کانادا رد می‌شود: سرمایه‌گذاری ۱۵۰ هزار و دارایی خالص ۴۰۰ تا ۶۰۰ هزار دلار. مجوز کار در بازه‌ی چند ماه، اقامت دائم پس از اجرای تعهدات — و کانادا، که SUV دیگر به آن نمی‌رسد.',
    );
  }

  // Operating business with acceptable language → Europe, by team size.
  if (hasBusiness && langOk) {
    if (a.team === 'team') {
      return result(
        'finland',
        'کسب‌وکار در حال اجرا و تیم دو نفره، شما را دقیقاً در محدوده‌ی مجوز استارتاپ فنلاند قرار می‌دهد — همان منطق SUV کانادا، بدون سرمایه‌گذاری الزامی، با ارزیابی رایگان Business Finland. سؤال بعدی این است که آیا کسب‌وکارتان از نظر آن‌ها مقیاس‌پذیر بین‌المللی است.',
      );
    }
    if (a.horizon === 'urgent' || a.capital === 'under50') {
      return result(
        'estonia',
        'بنیان‌گذار تنها با محصول آماده و بودجه‌ی محدود یا عجله: استونی سریع‌ترین و ارزان‌ترین در است — تصمیم کمیته ظرف حدود ده روز کاری، تمکن ۸۰۰ یورو در ماه. از آن‌جا می‌توان به بازارهای بزرگ‌تر اروپا رشد کرد.',
      );
    }
    return result(
      'denmark',
      'بنیان‌گذار تنها با کسب‌وکار در حال اجرا و بودجه‌ی معقول: Start-up Denmark شما را می‌پذیرد، بدون شرط تیم فنلاند و بدون آستانه‌ی سرمایه‌ی ثابت. پنل کارشناسان بیزینس‌پلن را در حدود شش هفته می‌سنجد.',
    );
  }

  // Operating business but language below CLB 5.
  if (hasBusiness && !langOk) {
    return result(
      'too-early',
      'کسب‌وکار شما می‌تواند مسیر اروپا باشد، اما ارزیابی Business Finland، پنل دانمارک و کمیته‌ی استونی به انگلیسی است و بیزینس‌پلن انگلیسی روان می‌خواهد. زبان سریع‌ترین چیزی است که می‌توانید تغییر دهید؛ شش ماه تمرکز روی آن، این پاسخ را عوض می‌کند.',
    );
  }

  // Professional with no business and no threshold-clearing capital.
  if (a.background === 'professional') {
    return result(
      'too-early',
      'سابقه‌ی حرفه‌ای دارید، اما بدون کسب‌وکار در حال اجرا و بدون سرمایه‌ی در حد آستانه‌ی مسیرهای آتلانتیک، هیچ مسیر کارآفرینی امروز باز نیست. دو راه پیش روست: ساختن MVP برای اروپا، یا رساندن سرمایه‌ی قابل انتقال به حد آستانه برای کانادا.',
    );
  }

  return result(
    'too-early',
    'با پاسخ‌های فعلی، هیچ‌یک از مسیرهای باز امروز قابل توصیه نیست. این نتیجه‌ی بدی نیست؛ یعنی قبل از خرج کردن، باید یکی از سه چیز را بسازید: کسب‌وکار، زبان یا سرمایه.',
  );
}
