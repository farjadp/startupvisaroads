import React from 'react';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as cheerio from 'cheerio';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { sanitizeHtml, extractFaqs } from '@/lib/sanitize';
import { SITE_URL, articleJsonLd, breadcrumbJsonLd, faqJsonLd, ogLocale } from '@/lib/seo';
import { getArticleBySlug, getRelatedArticle } from '@/lib/blog';
import { 
  Clock, 
  BarChart, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  ClipboardList,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ScrollProgressBar, ShareButtons } from '@/components/blog/BlogClientHelper';

// Helper function to map blog content to website services/programs
function getRecommendedService(title: string, categoryName: string, locale: string) {
  const contentToAnalyze = `${title} ${categoryName}`.toLowerCase();
  const isRtl = locale === 'fa';

  const services = [
    {
      keywords: ['canada', 'suv', 'startup visa', 'کانادا', 'استارتاپ کانادا'],
      path: '/startup-visa-canada',
      title: isRtl ? 'ویزای استارتاپ کانادا (SUV)' : 'Canada Startup Visa (SUV)',
      desc: isRtl 
        ? 'برنامه رسمی ویزای استارتاپ کانادا برای کارآفرینان نوآور به همراه پشتیبانی کامل در تدوین بیزینس پلن و دریافت نامه حمایتی.' 
        : 'The official Canada Startup Visa pathway for innovative founders. Complete support from business concept to letter of support.',
    },
    {
      keywords: ['work permit', 'startup work permit', 'مجوز کار', 'ورک پرمیت'],
      path: '/startupworkpermit',
      title: isRtl ? 'مجوز کار استارتاپی کانادا' : 'Canada Startup Work Permit',
      desc: isRtl 
        ? 'سریع‌ترین راه برای راه‌اندازی کسب‌وکار خود در کانادا در حین بررسی پرونده اقامت دائم.' 
        : 'Fast-track your business operations in Canada while your PR application is being processed.',
    },
    {
      keywords: ['netherlands', 'dutch', 'هلند', 'اقامت هلند'],
      path: '/europe/netherlands',
      title: isRtl ? 'ویزای استارتاپ هلند' : 'Netherlands Startup Visa',
      desc: isRtl 
        ? 'کارآفرینی در قلب اتحادیه اروپا. دریافت اقامت موقت هلند برای راه‌اندازی استارتاپ نوآورانه.' 
        : 'Establish your innovative business in the heart of Europe with a direct Dutch residency path.',
    },
    {
      keywords: ['finland', 'finnish', 'فنلاند', 'اقامت فنلاند'],
      path: '/europe/finland',
      title: isRtl ? 'ویزای استارتاپ فنلاند' : 'Finland Startup Visa',
      desc: isRtl 
        ? 'ورود به شادترین کشور دنیا با سیستم حمایتی بی‌نظیر برای استارتاپ‌های تکنولوژی.' 
        : 'Enter the world\'s happiest country with direct residency matching for innovative tech startups.',
    },
    {
      keywords: ['denmark', 'danish', 'دانمارک', 'اقامت دانمارک'],
      path: '/country/denmark',
      title: isRtl ? 'ویزای استارتاپ دانمارک' : 'Denmark Start-up Denmark',
      desc: isRtl 
        ? 'شتاب‌دهی کسب‌وکار در دانمارک با دسترسی به بازارهای پیشرفته اسکاندیناوی.' 
        : 'Accelerate your business in Denmark with direct access to advanced Nordic markets.',
    },
    {
      keywords: ['australia', 'استرالیا', 'ویزای کارآفرینی استرالیا'],
      path: '/australia/entrepreneur-stream',
      title: isRtl ? 'ویزای کارآفرینی استرالیا' : 'Australia Entrepreneur Pathway',
      desc: isRtl 
        ? 'دریافت اقامت استرالیا از طریق سرمایه‌گذاری و اجرای طرح‌های نوآورانه تجاری.' 
        : 'Secure Australian residency by developing and exporting innovative concepts to global markets.',
    },
    {
      keywords: ['eb1', 'eb-1', 'ای بی ۱'],
      path: '/usa/eb1',
      title: isRtl ? 'ویزای نخبگان آمریکا (EB-1)' : 'US EB-1 Extraordinary Ability',
      desc: isRtl 
        ? 'مسیر اقامت دائم ایالات متحده (گرین کارت) ویژه افراد با توانایی‌های خارق‌العاده علمی، تجاری و هنری.' 
        : 'Direct Green Card pathway for founders and professionals with extraordinary achievements.',
    },
    {
      keywords: ['eb2', 'eb-2', 'niw', 'ان آی دبلیو'],
      path: '/usa/eb2-niw',
      title: isRtl ? 'ویزای ملی منافع آمریکا (EB-2 NIW)' : 'US EB-2 National Interest Waiver',
      desc: isRtl 
        ? 'دریافت گرین کارت آمریکا بدون نیاز به اسپانسر شغلی، بر اساس اهمیت ملی طرح تجاری شما.' 
        : 'Secure your US Green Card based on the national interest of your business model, no sponsor required.',
    },
    {
      keywords: ['eb5', 'eb-5', 'ای بی ۵'],
      path: '/usa/eb5',
      title: isRtl ? 'ویزای سرمایه‌گذاری آمریکا (EB-5)' : 'US EB-5 Investor Green Card',
      desc: isRtl 
        ? 'مسیر مستقیم دریافت گرین کارت آمریکا از طریق سرمایه‌گذاری در پروژه‌های اشتغال‌زا.' 
        : 'Direct path to permanent US residency through targeted job-creating capital investments.',
    },
    {
      keywords: ['pnp', 'provincial', 'ontario', 'bc', 'alberta', 'ساسکاچوان', 'انتاریو', 'بریتیش کلمبیا'],
      path: '/pnp',
      title: isRtl ? 'برنامه‌های نامزدی استانی کانادا (PNP)' : 'Provincial Nominee Programs (PNP)',
      desc: isRtl 
        ? 'مهاجرت از طریق برنامه‌های استانی کانادا متناسب با سرمایه، تخصص و سوابق مدیریتی شما.' 
        : 'Tailored pathways to Canadian residency via provincial investment and entrepreneurial streams.',
    },
  ];

  // Search for matching keyword in title or category name
  for (const service of services) {
    if (service.keywords.some(kw => contentToAnalyze.includes(kw))) {
      return service;
    }
  }

  // Fallback to general advisory services page
  return {
    path: '/services',
    title: isRtl ? 'خدمات مشاوره بیزینس آرشیتکت' : 'Business Architect Services',
    desc: isRtl 
      ? 'تدوین و توسعه اسناد استراتژیک تجاری اعم از بیزینس پلن، مالی پروفرما و پیچ دک برای موفقیت در پرونده‌های مهاجرتی.' 
      : 'Transforming ideas into data-driven artifacts: Business Plans, Financial Projections, and Pitch Decks.',
  };
}

// Incrementally regenerate article pages (ISR) — fast, cacheable, SEO-friendly.
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, locale: true },
    });
    return articles.map((a) => ({ locale: a.locale === 'fa' ? 'fa' : 'en', slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article || article.status !== 'PUBLISHED') {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }

  // Single-locale article: canonical points at its own locale to avoid
  // duplicate content if it is reachable under both /en and /fa prefixes.
  const articleLocale = article.locale === 'fa' ? 'fa' : 'en';
  const canonical = `${SITE_URL}/${articleLocale}/blog/${article.slug}`;
  const description = (article.excerpt || article.title).slice(0, 200);

  return {
    title: article.title,
    description,
    alternates: { canonical, languages: { [articleLocale]: canonical } },
    openGraph: {
      type: 'article',
      url: canonical,
      title: article.title,
      description,
      locale: ogLocale(articleLocale),
      publishedTime: new Date(article.createdAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      tags: article.tags.map((t) => t.name),
      images: article.coverImage ? [{ url: article.coverImage, alt: article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug, locale);

  if (!article || article.status !== 'PUBLISHED') {
    return notFound();
  }

  const relatedArticle = await getRelatedArticle(article);

  const isRtl = locale === 'fa';

  // 1. Extract metadata, clean content, and inject related article box using Cheerio
  let quickFacts: Record<string, string> | null = null;
  let cleanContent = article.content;

  try {
    const $ = cheerio.load(cleanContent, null, false);
    
    // Attempt to extract JSON from script tag
    const scriptTag = $('#quick-facts-data');
    if (scriptTag.length > 0) {
      try {
        quickFacts = JSON.parse(scriptTag.text().trim());
        scriptTag.remove();
      } catch (e) {
        console.error('Failed to parse quick facts JSON tag:', e);
      }
    }

    // Always strip old HTML quick-facts-card representation if it exists
    $('.quick-facts-card').remove();

    // Inject Related Article recommendation box using Cheerio!
    if (relatedArticle) {
      const label = isRtl ? 'مطالعه پیشنهادی' : 'RECOMMENDED READING';
      const boxHtml = `
        <div class="my-8 p-6 bg-[#1a1a1a]/[0.03] ${isRtl ? 'border-r-4 text-right' : 'border-l-4 text-left'} border-[#CCFF00] font-sans not-prose rounded-lg" dir="${isRtl ? 'rtl' : 'ltr'}">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 block mb-2">${label}</span>
          <a href="/${locale}/blog/${relatedArticle.slug}" class="font-serif text-xl font-bold text-[#1a1a1a] hover:text-[#CCFF00] transition-colors block mb-1">${relatedArticle.title}</a>
          ${relatedArticle.excerpt ? `<p class="text-xs text-[#1a1a1a]/60 line-clamp-2 mt-1 leading-relaxed">${relatedArticle.excerpt}</p>` : ''}
        </div>
      `;
      
      const paragraphs = $('p');
      if (paragraphs.length > 3) {
        paragraphs.eq(2).after(boxHtml);
      } else {
        $.root().append(boxHtml);
      }
    }
    
    cleanContent = $.html();
  } catch (e) {
    console.error('Failed to load or parse content via cheerio, falling back to regex:', e);
    // Fallback regex cleanup
    const scriptRegex = /<script\s+type="application\/json"\s+id="quick-facts-data">([\s\S]*?)<\/script>/i;
    const match = cleanContent.match(scriptRegex);
    if (match) {
      try {
        quickFacts = JSON.parse(match[1].trim());
      } catch (err) {}
      cleanContent = cleanContent.replace(scriptRegex, '');
    }
    cleanContent = cleanContent.replace(/<div\s+class="quick-facts-card"[\s\S]*?<\/div>\s*<\/div>/gi, '');

    // Fallback injection: append to end
    if (relatedArticle) {
      const label = isRtl ? 'مطالعه پیشنهادی' : 'RECOMMENDED READING';
      const boxHtml = `
        <div class="my-8 p-6 bg-[#1a1a1a]/[0.03] ${isRtl ? 'border-r-4 text-right' : 'border-l-4 text-left'} border-[#CCFF00] font-sans not-prose rounded-lg" dir="${isRtl ? 'rtl' : 'ltr'}">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/40 block mb-2">${label}</span>
          <a href="/${locale}/blog/${relatedArticle.slug}" class="font-serif text-xl font-bold text-[#1a1a1a] hover:text-[#CCFF00] transition-colors block mb-1">${relatedArticle.title}</a>
          ${relatedArticle.excerpt ? `<p class="text-xs text-[#1a1a1a]/60 line-clamp-2 mt-1 leading-relaxed">${relatedArticle.excerpt}</p>` : ''}
        </div>
      `;
      cleanContent = cleanContent + boxHtml;
    }
  }
  
  // 2. Compute word count and reading time fallbacks
  const wordCount = cleanContent.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readMin = Math.ceil(wordCount / 200) || 1;

  // 3. Define localized translations
  const t = isRtl ? {
    home: 'خانه',
    blog: 'مجله خبری',
    back: 'بازگشت به مجله',
    share: 'اشتراک‌گذاری مقاله',
    copied: 'کپی شد!',
    publishedOn: 'تاریخ انتشار',
    readingTime: 'زمان مطالعه',
    level: 'سطح مقاله',
    suitableFor: 'مناسب برای',
    compliance: 'تطابق رسمی قوانین',
    keyBenefit: 'دستاورد کلیدی',
    status: 'آخرین وضعیت قوانین',
    actionability: 'میزان کاربردی بودن',
    requirements: 'پیش‌نیازها',
    cardTitle: 'شناسنامه و اطلاعات سریع مقاله',
    relatedServiceBadge: 'سرویس پیشنهادی مرتبط',
    viewServiceBtn: 'مشاهده جزئیات سرویس',
    ctaTitle: 'آماده‌اید مسیر مهاجرتی خود را آغاز کنید؟',
    ctaDesc: 'با بیزینس پلن‌های حرفه‌ای، مدل‌های مالی پروفرما و دفاعیه پیچ دک شانس خود را در دریافت پذیرش به حداکثر برسانید.',
    ctaBtn: 'ثبت درخواست مشاوره رایگان',
  } : {
    home: 'Home',
    blog: 'Journal',
    back: 'Back to Journal',
    share: 'Share Article',
    copied: 'Copied!',
    publishedOn: 'Published on',
    readingTime: 'Reading Time',
    level: 'Article Level',
    suitableFor: 'Suitable For',
    compliance: 'Official Compliance',
    keyBenefit: 'Key Benefit',
    status: 'Regulations Status',
    actionability: 'Actionability Level',
    requirements: 'Requirements',
    cardTitle: 'Article Quick Facts',
    relatedServiceBadge: 'RECOMMENDED SERVICE',
    viewServiceBtn: 'View Service Details',
    ctaTitle: 'Ready to architect your startup path?',
    ctaDesc: 'Accelerate your global mobility with investor-grade business documents, financial models, and strategic immigration advisor review.',
    ctaBtn: 'Request Free Advisory',
  };

  const defaultFacts = isRtl ? {
    readingTime: `${readMin} دقیقه مطالعه`,
    level: 'کاربردی / راهبردی',
    suitableFor: 'کارآفرینان و کارجویان متخصص',
    compliance: '۹۵٪ (دستورالعمل‌های رسمی)',
    keyBenefit: 'شفافیت در انتخاب مسیر',
    status: 'تایید شده برای قوانین ۲۰۲۶',
    actionability: 'بالا (نقشه راه عملی)',
    requirements: 'ایده و کانسپت تجاری',
  } : {
    readingTime: `${readMin} min read`,
    level: 'Strategic / Practical',
    suitableFor: 'Founders & Skilled Workers',
    compliance: '95% (Official Guidelines)',
    keyBenefit: 'Pathway selection clarity',
    status: 'Validated for 2026 regulations',
    actionability: 'High (Actionable Roadmap)',
    requirements: 'Business Concept / Idea',
  };

  const facts = { ...defaultFacts, ...quickFacts };

  // 4. Set up layout items with icons
  const factsItems = [
    { label: t.readingTime, value: facts.readingTime, icon: Clock },
    { label: t.level, value: facts.level, icon: BarChart },
    { label: t.suitableFor, value: facts.suitableFor, icon: Target },
    { label: t.compliance, value: facts.compliance, icon: ShieldCheck },
    { label: t.actionability, value: facts.actionability, icon: Compass },
    { label: t.keyBenefit, value: facts.keyBenefit, icon: Sparkles },
    { label: t.requirements, value: facts.requirements, icon: ClipboardList },
    { label: t.status, value: facts.status, icon: RefreshCw },
  ];

  // 5. Context-aware service recommender calculation
  const recommendedService = getRecommendedService(article.title, article.category?.name || '', locale);

  // 6. Sanitize HTML before rendering (defends against XSS from generated/edited content)
  const safeContent = sanitizeHtml(cleanContent);

  // 7. Build structured data (Article + Breadcrumb + FAQ) for SEO/AEO/GEO
  const articleLocale = article.locale === 'fa' ? 'fa' : 'en';
  const articleUrl = `${SITE_URL}/${articleLocale}/blog/${article.slug}`;
  const faqs = extractFaqs(safeContent);
  const structuredData = [
    articleJsonLd({
      title: article.title,
      description: (article.excerpt || article.title).slice(0, 200),
      url: articleUrl,
      image: article.coverImage,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      locale: articleLocale,
      section: article.category?.name,
      tags: article.tags.map((tg) => tg.name),
    }),
    breadcrumbJsonLd([
      { name: t.home, url: `${SITE_URL}/${locale}` },
      { name: t.blog, url: `${SITE_URL}/${locale}/blog` },
      ...(article.category ? [{ name: article.category.name, url: `${SITE_URL}/${locale}/blog/category/${article.category.slug}` }] : []),
      { name: article.title, url: articleUrl },
    ]),
    faqJsonLd(faqs),
  ];

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-3xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <JsonLd data={structuredData} />
      {/* Scroll Progress Bar Client Component */}
      <ScrollProgressBar />

      {/* Breadcrumbs & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1a1a1a]/10 pb-8 mb-12">
        <nav className="text-xs font-sans text-[#1a1a1a]/50 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1a1a1a] transition-colors">{t.home}</Link>
          <span className="text-[10px] text-[#1a1a1a]/30">&rarr;</span>
          <Link href="/blog" className="hover:text-[#1a1a1a] transition-colors">{t.blog}</Link>
          {article.category && (
            <>
              <span className="text-[10px] text-[#1a1a1a]/30">&rarr;</span>
              <Link href={`/blog?category=${article.category.slug}`} className="hover:text-[#1a1a1a] font-bold transition-colors">
                {article.category.name}
              </Link>
            </>
          )}
        </nav>

        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] px-3.5 py-1.5 rounded border border-[#1a1a1a] transition-all duration-200 w-fit"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          {t.back}
        </Link>
      </div>

      {/* Main Title Header */}
      <div className="mb-12 text-center md:text-start">
        {article.category && (
          <Link href={`/blog?category=${article.category.slug}`} className="inline-block mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_0px_#1a1a1a]">
              {article.category.name}
            </span>
          </Link>
        )}
        <h1 className="font-serif text-4xl md:text-6xl mb-6 text-[#1a1a1a] leading-tight font-bold">
          {article.title}
        </h1>
        <p className="font-sans text-[#1a1a1a]/50 text-sm">
          {t.publishedOn}: {new Date(article.createdAt).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="aspect-video w-full rounded-3xl overflow-hidden mb-16 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a]">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Premium Brutalist Quick Facts Card */}
      <div 
        className="relative my-12 p-6 md:p-8 bg-[#1a1a1a]/[0.02] border-2 border-[#1a1a1a] rounded-2xl shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#CCFF00] transition-all duration-300 font-sans"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2F0E9] bg-[#1a1a1a] px-4 py-1.5 rounded-full absolute -top-3 start-6 border border-[#1a1a1a]">
          {t.cardTitle}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          {factsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col group p-2 rounded-xl hover:bg-[#1a1a1a]/[0.03] transition-colors duration-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1a1a] text-[#CCFF00] mb-3 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold block">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-[#1a1a1a] mt-1.5 leading-snug">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render HTML content safely */}
      <article
        className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:font-bold prose-a:text-[#1a1a1a] prose-a:underline max-w-none text-[#1a1a1a]/80"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* Context-Aware Recommended Service Card */}
      <div 
        className="relative my-12 p-6 md:p-8 bg-[#1a1a1a]/[0.02] border-2 border-[#1a1a1a] rounded-2xl shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[6px_6px_0px_0px_#CCFF00] transition-all duration-300 font-sans"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50 bg-[#F2F0E9] border border-[#1a1a1a]/20 px-3 py-1 rounded-full absolute -top-3 start-6">
          {t.relatedServiceBadge}
        </span>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex-1">
            <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-2">
              {recommendedService.title}
            </h3>
            <p className="text-sm text-[#1a1a1a]/70 leading-relaxed max-w-xl">
              {recommendedService.desc}
            </p>
          </div>
          <Link 
            href={recommendedService.path}
            className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] text-[#F2F0E9] px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all duration-200 shrink-0 shadow-[3px_3px_0px_0px_rgba(26,26,26,0.15)] hover:shadow-none"
          >
            {t.viewServiceBtn}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
      </div>

      {/* Contact Call-To-Action Card */}
      <div 
        className="relative my-12 p-8 bg-[#1a1a1a] text-[#F2F0E9] rounded-3xl shadow-[6px_6px_0px_0px_#CCFF00] font-sans overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#CCFF00]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-3">
              {t.ctaTitle}
            </h3>
            <p className="text-sm text-[#F2F0E9]/70 leading-relaxed max-w-xl">
              {t.ctaDesc}
            </p>
          </div>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#1a1a1a] px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#F2F0E9] transition-all duration-200 shrink-0 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-none"
          >
            {t.ctaBtn}
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
      </div>
      
      {/* Article Footer: Tags and Sharing Options */}
      <div className="mt-16 pt-8 border-t border-[#1a1a1a]/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          {article.tags.length > 0 && (
            <>
              <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag.id} className="bg-[#1a1a1a]/5 px-3.5 py-1.5 rounded-full font-sans text-xs text-[#1a1a1a]/70">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Social Share Client Component */}
        <ShareButtons title={article.title} labels={{ share: t.share, copied: t.copied }} />
      </div>
    </div>
  );
}
