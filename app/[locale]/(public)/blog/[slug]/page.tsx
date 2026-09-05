import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as cheerio from 'cheerio';
import { Link } from '@/navigation';
import JsonLd from '@/components/JsonLd';
import { sanitizeHtml } from '@/lib/sanitize';
import { SITE_URL, articleJsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd, isDataImageUrl, selfLocalizedAlternates, stripHtml } from '@/lib/seo';
import { buildRelatedArticleBox, computeReadingTime, getArticleBySlug, getRecommendedService, getRelatedArticle, getSafeQuickFacts } from '@/lib/blog';
import { 
  Clock, 
  BarChart, 
  Target, 
  Sparkles, 
  Compass, 
  ClipboardList,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ScrollProgressBar, ShareButtons } from '@/components/blog/BlogClientHelper';
import { faDate, isoDate } from '@/lib/fa/format';
import { faCategoryLabel } from '@/lib/fa/categories';

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

  const articleLocale = article.locale === 'fa' ? 'fa' : 'en';
  const description = stripHtml(article.excerpt || article.title).slice(0, 200);
  const metadata = buildMetadata({
    title: article.title,
    description,
    path: `/blog/${article.slug}`,
    locale: articleLocale,
    image: article.coverImage,
    type: 'article',
    publishedTime: new Date(article.createdAt).toISOString(),
    modifiedTime: new Date(article.updatedAt).toISOString(),
    tags: article.tags.map((tag) => tag.name),
  });

  return {
    ...metadata,
    alternates: selfLocalizedAlternates(`/blog/${article.slug}`, articleLocale),
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
      const boxHtml = buildRelatedArticleBox({ locale, isRtl, article: relatedArticle });
      
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
      const boxHtml = buildRelatedArticleBox({ locale, isRtl, article: relatedArticle });
      cleanContent = cleanContent + boxHtml;
    }
  }
  
  // 2. Compute reading time from the visible article text
  const readingTime = computeReadingTime(cleanContent, locale);

  // 3. Define localized translations
  const t = isRtl ? {
    home: 'خانه',
    blog: 'مجله خبری',
    back: 'بازگشت به مجله',
    share: 'اشتراک‌گذاری مقاله',
    copied: 'کپی شد!',
    publishedOn: 'تاریخ انتشار',
    updatedOn: 'آخرین به‌روزرسانی',
    byline: 'نویسنده',
    author: 'تیم تحریریه استارتاپ ویزا رودز',
    readingTime: 'زمان مطالعه',
    level: 'سطح مقاله',
    suitableFor: 'مناسب برای',
    keyBenefit: 'دستاورد کلیدی',
    actionability: 'میزان کاربردی بودن',
    requirements: 'پیش‌نیازها',
    cardTitle: 'شناسنامه و اطلاعات سریع مقاله',
    relatedServiceBadge: 'سرویس پیشنهادی مرتبط',
    viewServiceBtn: 'مشاهده جزئیات سرویس',
    ctaTitle: 'آماده‌اید مسیر مهاجرتی خود را آغاز کنید؟',
    ctaDesc: 'با خدمات برنامه‌ریزی کسب‌وکار، مدل‌سازی مالی و آماده‌سازی پیچ‌دک آشنا شوید.',
    ctaBtn: 'تماس با تیم',
    takeaway: 'پاسخ کوتاه',
    faq: 'پرسش‌های پرتکرار',
  } : {
    home: 'Home',
    blog: 'Journal',
    back: 'Back to Journal',
    share: 'Share Article',
    copied: 'Copied!',
    publishedOn: 'Published',
    updatedOn: 'Updated',
    byline: 'By',
    author: 'Startup Visa Roads Editorial Team',
    readingTime: 'Reading Time',
    level: 'Article Level',
    suitableFor: 'Suitable For',
    keyBenefit: 'Key Benefit',
    actionability: 'Actionability Level',
    requirements: 'Requirements',
    cardTitle: 'Article Quick Facts',
    relatedServiceBadge: 'RECOMMENDED SERVICE',
    viewServiceBtn: 'View Service Details',
    ctaTitle: 'Ready to architect your startup path?',
    ctaDesc: 'Explore business planning, financial modelling, and pitch-deck preparation services.',
    ctaBtn: 'Contact the Team',
    takeaway: 'Key takeaway',
    faq: 'Frequently asked questions',
  };

  const safeQuickFacts = getSafeQuickFacts(quickFacts);
  const optionalFacts = [
    { key: 'level', label: t.level, icon: BarChart },
    { key: 'suitableFor', label: t.suitableFor, icon: Target },
    { key: 'actionability', label: t.actionability, icon: Compass },
    { key: 'keyBenefit', label: t.keyBenefit, icon: Sparkles },
    { key: 'requirements', label: t.requirements, icon: ClipboardList },
  ];

  // 4. Set up layout items using only computed or article-stored values
  const factsItems = [
    { label: t.readingTime, value: readingTime, icon: Clock },
    ...optionalFacts.flatMap((fact) => safeQuickFacts[fact.key]
      ? [{ label: fact.label, value: safeQuickFacts[fact.key], icon: fact.icon }]
      : []),
  ];

  // 5. Context-aware service recommender calculation
  const recommendedService = getRecommendedService(article.title, article.category?.name || '', locale);

  // 6. Sanitize HTML before rendering (defends against XSS from generated/edited content)
  const safeContent = sanitizeHtml(cleanContent);

  // 7. Build structured data (Article + Breadcrumb + FAQ) for SEO/AEO/GEO
  const articleLocale = article.locale === 'fa' ? 'fa' : 'en';
  const articleUrl = `${SITE_URL}/${articleLocale}/blog/${article.slug}`;
  let structuredFaq: { question: string; answer: string }[] = [];
  const rawFaq = (article as { faq?: string | null }).faq;
  if (rawFaq) {
    try {
      const parsed = JSON.parse(rawFaq) as { q: string; a: string }[];
      structuredFaq = parsed.filter((f) => f?.q && f?.a).map((f) => ({ question: f.q, answer: f.a }));
    } catch {}
  }
  const faqs = structuredFaq;
  const keyTakeaway = (article as { keyTakeaway?: string | null }).keyTakeaway ?? null;
  const structuredData = [
    articleJsonLd({
      title: article.title,
      description: stripHtml(article.excerpt || article.title).slice(0, 200),
      url: articleUrl,
      image: article.coverImage,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      locale: articleLocale,
      section: article.category ? (isRtl ? faCategoryLabel(article.category.slug, article.category.name) : article.category.name) : undefined,
      tags: article.tags.map((tg) => tg.name),
    }),
    breadcrumbJsonLd([
      { name: t.home, url: `${SITE_URL}/${locale}` },
      { name: t.blog, url: `${SITE_URL}/${locale}/blog` },
      ...(article.category ? [{ name: isRtl ? faCategoryLabel(article.category.slug, article.category.name) : article.category.name, url: `${SITE_URL}/${locale}/blog/category/${article.category.slug}` }] : []),
      { name: article.title, url: articleUrl },
    ]),
    faqJsonLd(faqs, articleLocale),
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
              <Link href={`/blog/category/${article.category.slug}`} className="hover:text-[#1a1a1a] font-bold transition-colors">
                {isRtl ? faCategoryLabel(article.category.slug, article.category.name) : article.category.name}
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
          <Link href={`/blog/category/${article.category.slug}`} className="inline-block mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors shadow-[2px_2px_0px_0px_#1a1a1a]">
              {isRtl ? faCategoryLabel(article.category.slug, article.category.name) : article.category.name}
            </span>
          </Link>
        )}
        <h1 className="font-serif text-4xl md:text-6xl mb-6 text-[#1a1a1a] leading-tight font-bold">
          {article.title}
        </h1>
        <div className="font-sans text-[#1a1a1a]/60 text-sm flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
          <span>{t.byline} <strong className="text-[#1a1a1a]">{t.author}</strong></span>
          <span aria-hidden="true">·</span>
          <span>
            {t.publishedOn}:{' '}
            <time dateTime={isoDate(article.createdAt)}>
              {isRtl
                ? faDate(article.createdAt)
                : new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </time>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.updatedOn}:{' '}
            <time dateTime={isoDate(article.updatedAt)}>
              {isRtl
                ? faDate(article.updatedAt)
                : new Date(article.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </time>
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-16 border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            unoptimized={isDataImageUrl(article.coverImage)}
            className="object-cover"
          />
        </div>
      )}

      {/* Key takeaway — the passage an answer engine quotes */}
      {keyTakeaway && (
        <div className="my-10 p-6 md:p-7 bg-[#1a1a1a] text-[#F2F0E9] rounded-2xl font-sans shadow-[4px_4px_0px_0px_#CCFF00]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] block mb-3">{t.takeaway}</span>
          <p className="font-serif text-lg md:text-xl leading-relaxed">{keyTakeaway}</p>
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

      {/* Structured FAQ (autopilot articles) */}
      {faqs.length > 0 && (
        <section className="my-12 font-sans" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-serif text-3xl font-bold text-[#1a1a1a] mb-6">{t.faq}</h2>
          <div className="divide-y divide-[#1a1a1a]/10 border-y border-[#1a1a1a]/10">
            {faqs.map((f, i) => (
              <details key={i} className="group py-4">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-[#1a1a1a] text-base md:text-lg">
                  <span>{f.question}</span>
                  <span className="text-[#1a1a1a]/40 group-open:rotate-45 transition-transform text-2xl leading-none shrink-0">+</span>
                </summary>
                <p className="mt-3 text-[#1a1a1a]/70 leading-relaxed text-sm md:text-base">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

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
