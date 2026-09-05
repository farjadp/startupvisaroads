import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, collectionPageJsonLd, isDataImageUrl, localizedArchiveAlternates, SITE_URL } from '@/lib/seo';
import { computeReadingTime, getCategoryArchiveData } from '@/lib/blog';
import { faCategoryLabel } from '@/lib/fa/categories';

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getCategoryArchiveData(locale, slug);
  if (!data) {
    return { title: 'Not Found', robots: { index: false, follow: false } };
  }
  const { category, availableLocales } = data;
  const isRtl = locale === 'fa';
  const categoryName = isRtl ? faCategoryLabel(category.slug, category.name) : category.name;
  const path = `/blog/category/${slug}`;
  const metadata = buildMetadata({
    locale,
    path,
    title: isRtl ? `${categoryName} — مقالات` : `${categoryName} — Articles`,
    description: isRtl
      ? `جدیدترین راهنماها و تحلیل‌های دسته‌ی «${categoryName}» در راه‌های ویزای استارتاپ.`
      : `The latest guides and analysis in the "${categoryName}" collection from Startup Visa Roads.`,
  });
  return { ...metadata, alternates: localizedArchiveAlternates(path, locale, availableLocales) };
}

export default async function CategoryArchivePage({
  params 
}: { 
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const isRtl = locale === 'fa';

  const data = await getCategoryArchiveData(locale, slug);
  if (!data) {
    return notFound();
  }
  const { category, articles } = data;

  // Localized texts
  const t = isRtl ? {
    archiveTitle: 'آرشیو مجموعه',
    backToBlog: 'بازگشت به مجله خبری',
    articleCount: (count: number) => `${count} مقاله پیدا شد.`,
    readArticle: 'مطالعه مقاله',
    emptyState: 'هنوز مقاله‌ای در این مجموعه منتشر نشده است.',
  } : {
    archiveTitle: 'Collection Archive',
    backToBlog: 'Back to Journal',
    articleCount: (count: number) => `${count} ${count === 1 ? 'article' : 'articles'} found.`,
    readArticle: 'Read Article',
    emptyState: 'No articles have been published in this collection yet.',
  };

  const categoryName = isRtl ? faCategoryLabel(category.slug, category.name) : category.name;
  const categoryUrl = `${SITE_URL}/${locale}/blog/category/${category.slug}`;
  const categoryDescription = isRtl
    ? `جدیدترین راهنماها و تحلیل‌های دسته‌ی «${categoryName}» در راه‌های ویزای استارتاپ.`
    : `The latest guides and analysis in the "${categoryName}" collection from Startup Visa Roads.`;

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <JsonLd data={[
        collectionPageJsonLd({ title: categoryName, description: categoryDescription, url: categoryUrl, locale }),
        breadcrumbJsonLd([
          { name: isRtl ? 'خانه' : 'Home', url: `${SITE_URL}/${locale}` },
          { name: isRtl ? 'مجله خبری' : 'Journal', url: `${SITE_URL}/${locale}/blog` },
          { name: categoryName, url: categoryUrl },
        ]),
      ]} />
      {/* Editorial Header */}
      <div className="border-b-4 border-[#1a1a1a] pb-10 mb-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] px-3 py-1.5 rounded transition-all duration-200 border border-[#1a1a1a] mb-8"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          {t.backToBlog}
        </Link>
        <div className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-3">
          {t.archiveTitle}
        </div>
        <h1 className="font-serif text-4xl md:text-7xl mb-4 text-[#1a1a1a] leading-tight">
          {categoryName}
        </h1>
        <p className="text-sm font-sans text-[#1a1a1a]/50">
          {t.articleCount(articles.length)}
        </p>
      </div>

      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-20 border-2 border-[#1a1a1a] border-dashed rounded-2xl bg-[#1a1a1a]/[0.02]">
          <p className="font-sans text-[#1a1a1a]/60 text-lg">{t.emptyState}</p>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {articles.map(article => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
              <div className="relative aspect-video w-full bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-6 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] group-hover:shadow-[6px_6px_0px_0px_#CCFF00] group-hover:scale-[1.01] transition-all duration-300">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    unoptimized={isDataImageUrl(article.coverImage)}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-[#1a1a1a]/10 text-4xl">SVR.</div>
                )}
              </div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-2.5 py-1 rounded-full">
                  {categoryName}
                </span>
                <span className="text-xs text-[#1a1a1a]/50 font-sans flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {computeReadingTime(article.content, locale)}
                </span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-3 text-[#1a1a1a] leading-snug group-hover:text-[#CCFF00] group-hover:bg-[#1a1a1a] group-hover:px-1.5 transition-all duration-200 rounded inline-block">
                {article.title}
              </h2>
              <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              <div className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/80 group-hover:text-[#CCFF00] transition-colors flex items-center gap-1">
                {t.readArticle} &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
