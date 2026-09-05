// ============================================================================
// lib/fa/path-quiz.ts
// Scoring for /fa/which-path. A pure function so it is testable and so the
// rules are readable in one place. This is triage, not advice: it picks
// which page the reader should read next and says why in two sentences.
//
// The four outcomes map to the four Persian path pages. `too-early` is a
// real answer, not a failure — telling an idea-stage founder with no funds
// to come back later is the honest recommendation.
// ============================================================================

export type QuizAnswers = {
  /** هدف اصلی */
  goal: 'residency' | 'growth' | 'family';
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

export type PathId = 'suv' | 'pnp' | 'eb2niw' | 'too-early';

export type Recommendation = {
  path: PathId;
  title: string;
  why: string;
  href: string;
};

const RESULT: Record<PathId, { title: string; href: string }> = {
  suv: { title: 'ویزای استارتاپ کانادا', href: '/canada-startup-visa' },
  pnp: { title: 'برنامه‌های استانی کانادا', href: '/pnp' },
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
      'بدون کسب‌وکار در حال اجرا و بدون سابقه‌ی حرفه‌ای یا پژوهشی مشخص، هیچ‌کدام از سه مسیر امروز برای شما باز نیست — و هر کسی که خلاف این را بگوید، پول شما را می‌خواهد. اول یکی از این دو را بسازید؛ ما در همین مرحله کمک می‌کنیم.',
    );
  }

  // Idea-stage founder without funds → too early for SUV, nothing for PNP.
  if (a.business === 'idea' && !funded && a.background !== 'professional') {
    return result(
      'too-early',
      'ایده به‌تنهایی برای سازمان تأییدشده‌ی کانادایی کافی نیست؛ آن‌ها محصول اولیه و شواهد بازار می‌خواهند. شش تا دوازده ماه ساختن MVP و گرفتن اولین کاربران، شما را از «زود است» به «آماده» می‌برد.',
    );
  }

  // Operating business with acceptable language.
  if (hasBusiness && langOk) {
    if (funded && a.horizon === 'urgent') {
      return result(
        'pnp',
        'کسب‌وکار در حال اجرا و سرمایه‌ی قابل انتقال دارید، اما صف چندساله‌ی ویزای استارتاپ با بازه‌ی زمانی شما نمی‌خواند. مسیرهای کارآفرینی استانی با مجوز کار اولیه، سریع‌تر شما را به کانادا می‌رسانند.',
      );
    }
    return result(
      'suv',
      'کسب‌وکار در حال اجرا و زبان در حد قابل قبول، شما را در محدوده‌ی ویزای استارتاپ قرار می‌دهد — بدون نیاز به سرمایه‌گذاری کلان. سؤال بعدی این است که آیا کسب‌وکارتان از نظر یک سازمان تأییدشده «استارتاپ نوآورانه» است یا نه.',
    );
  }

  // Operating business but language below CLB 5.
  if (hasBusiness && !langOk) {
    if (funded) {
      return result(
        'pnp',
        'کسب‌وکار و سرمایه دارید، اما زبان زیر CLB 5 در ویزای استارتاپ را می‌بندد و در مصاحبه‌ی سازمان تأییدشده مشکل‌ساز می‌شود. برخی مسیرهای کارآفرینی استانی آستانه‌ی زبان پایین‌تری دارند — و زبان را همزمان بالا ببرید.',
      );
    }
    return result(
      'too-early',
      'کسب‌وکار شما می‌تواند مسیر ویزای استارتاپ باشد، اما زبان زیر CLB 5 امروز آن در را می‌بندد. زبان سریع‌ترین چیزی است که می‌توانید تغییر دهید؛ شش ماه تمرکز روی آن، این پاسخ را عوض می‌کند.',
      );
  }

  // Professional with no business.
  if (a.background === 'professional') {
    if (funded && a.goal !== 'growth') {
      return result(
        'pnp',
        'سابقه‌ی حرفه‌ای و سرمایه‌ی قابل انتقال، شما را برای مسیرهای کارآفرینی استانی مناسب می‌کند — خرید یا ساختن یک کسب‌وکار در استانی که به آن نیاز دارد. زبان هرچه بالاتر، انتخاب استان گسترده‌تر.',
      );
    }
    if (a.language === 'high') {
      return result(
        'pnp',
        'متخصص با زبان قوی و بدون کسب‌وکار، پروفایل کلاسیک مسیرهای مهارتی استانی و اکسپرس انتری است. سؤال درست «چطور امتیاز بالا ببرم» نیست؛ «کدام استان به تخصص من نیاز دارد» است.',
      );
    }
    return result(
      'too-early',
      'سابقه‌ی حرفه‌ای دارید، اما بدون کسب‌وکار، بدون سرمایه‌ی کلان و با زبان متوسط، هیچ مسیری امروز به‌راحتی باز نیست. زبان را به بالای CLB 7 برسانید — این به‌تنهایی مسیر مهارتی استانی را برایتان باز می‌کند.',
    );
  }

  return result(
    'too-early',
    'با پاسخ‌های فعلی، هیچ‌یک از سه مسیر امروز قابل توصیه نیست. این نتیجه‌ی بدی نیست؛ یعنی قبل از خرج کردن، باید یکی از سه چیز را بسازید: کسب‌وکار، زبان یا سابقه.',
  );
}
