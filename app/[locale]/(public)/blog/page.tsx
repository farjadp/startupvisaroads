import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/navigation';
import { Clock } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { blogJsonLd, buildMetadata, collectionPageJsonLd, isDataImageUrl, selfLocalizedAlternates, SITE_URL } from '@/lib/seo';
import { buildBlogPageHref, computeReadingTime, getBlogIndexData } from '@/lib/blog';
import BlogSearchInput from '@/components/blog/BlogSearchInput';
import { faCategoryLabel } from '@/lib/fa/categories';

export const revalidate = 600;

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const query = await searchParams;
  const isRtl = locale === 'fa';
  const isQueryVariant = Boolean(query.category || query.q || (query.page && query.page !== '1'));
  const canonicalPath = query.category ? `/blog/category/${query.category}` : '/blog';
  const metadata = buildMetadata({
    locale,
    path: canonicalPath,
    title: isRtl ? 'مجله — راهنماها و تحلیل‌های ویزای استارتاپ' : 'The Journal — Startup Visa Guides & Analysis',
    description: isRtl
      ? 'آخرین تحلیل‌ها، راهنماهای گام‌به‌گام مهاجرت استارتاپی و به‌روزرسانی قوانین مهاجرتی جهان.'
      : 'Insights, step-by-step guides, and regulatory updates on global startup visas and mobility.',
    noindex: isQueryVariant,
    nofollow: false,
  });
  return query.category
    ? { ...metadata, alternates: selfLocalizedAlternates(canonicalPath, locale) }
    : metadata;
}

export default async function BlogPage({
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string; q?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const activeCategorySlug = resolvedSearchParams.category;
  const searchQuery = resolvedSearchParams.q;
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const pageSize = 6;

  const isRtl = locale === 'fa';

  // Localized text translations
  const t = isRtl ? {
    title: 'مجله',
    subtitle: 'آخرین تحلیل‌ها، راهنماهای گام‌به‌گام مهاجرت استارتاپی و قوانین مهاجرتی روز دنیا.',
    allArticles: 'همه مقالات',
    readArticle: 'مطالعه مقاله',
    emptyState: 'هیچ مقاله‌ای در این دسته‌بندی پیدا نشد.',
    featured: 'مقاله برگزیده جدید',
    latest: 'آخرین مقالات منتشر شده',
    readingTime: 'زمان مطالعه',
    next: 'بعدی',
    prev: 'قبلی',
    pageOf: 'صفحه {current} از {total}',
    search: 'جستجو در مقالات...',
  } : {
    title: 'The Journal',
    subtitle: 'Insights, step-by-step guides, and regulatory updates on global startup visas and mobility.',
    allArticles: 'All Articles',
    readArticle: 'Read Article',
    emptyState: 'No articles found in this category.',
    featured: 'Featured Article',
    latest: 'Latest Publications',
    readingTime: 'Reading Time',
    next: 'Next',
    prev: 'Previous',
    pageOf: 'Page {current} of {total}',
    search: 'Search articles...',
  };

  const { categories, totalCount, featuredArticle, gridArticles } = await getBlogIndexData({
    locale,
    activeCategorySlug,
    searchQuery,
    page,
    pageSize,
  });

  // Calculate total pages safely
  const isFiltered = Boolean(activeCategorySlug || searchQuery);
  const totalPages = totalCount > 0
    ? (isFiltered
        ? Math.ceil(totalCount / pageSize)
        : 1 + Math.ceil(Math.max(0, totalCount - (pageSize + 1)) / pageSize))
    : 1;
  const paginationFilters = { category: activeCategorySlug, q: searchQuery };

  const pageUrl = `${SITE_URL}/${locale}/blog`;
  const pageDescription = isRtl
    ? 'آخرین تحلیل‌ها، راهنماهای گام‌به‌گام مهاجرت استارتاپی و به‌روزرسانی قوانین مهاجرتی جهان.'
    : 'Insights, step-by-step guides, and regulatory updates on global startup visas and mobility.';

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <JsonLd data={[
        collectionPageJsonLd({ title: t.title, description: pageDescription, url: pageUrl, locale }),
        blogJsonLd({ title: t.title, description: pageDescription, url: pageUrl, locale }),
      ]} />
      {/* Editorial Header */}
      <div className="border-b-4 border-[#1a1a1a] pb-12 mb-12">
        <h1 className="font-serif text-5xl md:text-8xl mb-6 text-[#1a1a1a] tracking-tight uppercase">
          {t.title}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-[#1a1a1a]/70 leading-relaxed font-sans">
          {t.subtitle}
        </p>
      </div>

      {/* Category Filter Bar & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16 border-b border-[#1a1a1a]/10 pb-6 sticky top-20 bg-[#F2F0E9] z-10 py-2">
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/blog"
            className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider rounded-full border-2 border-[#1a1a1a] transition-all duration-200 ${
              !activeCategorySlug 
                ? 'bg-[#1a1a1a] text-[#CCFF00] shadow-[2px_2px_0px_0px_#1a1a1a]' 
                : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00]'
            }`}
          >
            {t.allArticles}
          </Link>
          {categories.map(category => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider rounded-full border-2 border-[#1a1a1a] transition-all duration-200 ${
                activeCategorySlug === category.slug 
                  ? 'bg-[#1a1a1a] text-[#CCFF00] shadow-[2px_2px_0px_0px_#1a1a1a]' 
                  : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00]'
              }`}
            >
              {isRtl ? faCategoryLabel(category.slug, category.name) : category.name}
            </Link>
          ))}
        </div>
        <Suspense fallback={<div className="w-full md:w-[300px] h-10 bg-[#1a1a1a]/5 rounded-full animate-pulse" />}>
          <BlogSearchInput placeholder={t.search} isRtl={isRtl} />
        </Suspense>
      </div>

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="text-center py-20 border-2 border-[#1a1a1a] border-dashed rounded-2xl bg-[#1a1a1a]/[0.02]">
          <p className="font-sans text-[#1a1a1a]/60 text-lg">{t.emptyState}</p>
        </div>
      )}

      {/* Featured Article Hero (only on page 1 and when not filtering categories) */}
      {featuredArticle && (
        <div className="mb-20">
          <div className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] inline-block animate-pulse"></span>
            {t.featured}
          </div>
          <Link href={`/blog/${featuredArticle.slug}`} className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="relative md:col-span-7 aspect-video w-full bg-[#1a1a1a]/5 rounded-3xl overflow-hidden border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] group-hover:shadow-[6px_6px_0px_0px_#CCFF00] group-hover:scale-[1.01] transition-all duration-300">
              {featuredArticle.coverImage ? (
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 58vw, 100vw"
                  unoptimized={isDataImageUrl(featuredArticle.coverImage)}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-[#1a1a1a]/10 text-7xl">SVR.</div>
              )}
            </div>
            <div className="md:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {featuredArticle.category && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-3 py-1.5 rounded-full">
                    {isRtl ? faCategoryLabel(featuredArticle.category.slug, featuredArticle.category.name) : featuredArticle.category.name}
                  </span>
                )}
                <span className="text-xs text-[#1a1a1a]/50 font-sans flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {computeReadingTime(featuredArticle.content, locale)}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl mb-4 text-[#1a1a1a] leading-tight group-hover:text-[#CCFF00] group-hover:bg-[#1a1a1a] group-hover:px-2 transition-all duration-200 rounded inline-block">
                {featuredArticle.title}
              </h2>
              <p className="font-sans text-[#1a1a1a]/70 text-base md:text-lg mb-6 leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>
              <div className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a] underline group-hover:text-[#CCFF00] group-hover:bg-[#1a1a1a] group-hover:no-underline px-2 py-1 inline-block w-fit rounded transition-all duration-200">
                {t.readArticle} &rarr;
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid Articles */}
      {gridArticles.length > 0 && (
        <div>
          {featuredArticle && (
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-8 border-b border-[#1a1a1a]/10 pb-4">
              {t.latest}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {gridArticles.map(article => (
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
                  {article.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-2.5 py-1 rounded-full">
                      {isRtl ? faCategoryLabel(article.category.slug, article.category.name) : article.category.name}
                    </span>
                  )}
                  <span className="text-xs text-[#1a1a1a]/50 font-sans flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {computeReadingTime(article.content, locale)}
                  </span>
                </div>
                <h4 className="font-serif text-2xl md:text-3xl mb-3 text-[#1a1a1a] leading-snug group-hover:text-[#CCFF00] group-hover:bg-[#1a1a1a] group-hover:px-1.5 transition-all duration-200 rounded inline-block">
                  {article.title}
                </h4>
                <p className="font-sans text-[#1a1a1a]/60 text-sm leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/80 group-hover:text-[#CCFF00] transition-colors flex items-center gap-1">
                  {t.readArticle} &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-24 pt-8 border-t border-[#1a1a1a]/10">
          <div className="font-sans text-sm text-[#1a1a1a]/60">
            {t.pageOf.replace('{current}', String(page)).replace('{total}', String(totalPages))}
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href={page > 1 ? buildBlogPageHref(page - 1, paginationFilters) : '#'}
              className={`px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#1a1a1a] transition-all duration-200 ${
                page > 1
                  ? 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] active:translate-y-0.5'
                  : 'opacity-40 cursor-not-allowed pointer-events-none'
              }`}
            >
              &larr; {t.prev}
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <Link
                  key={p}
                  href={buildBlogPageHref(p, paginationFilters)}
                  className={`w-10 h-10 flex items-center justify-center font-sans text-xs font-bold rounded-xl border-2 border-[#1a1a1a] transition-all duration-200 ${
                    page === p
                      ? 'bg-[#1a1a1a] text-[#CCFF00] shadow-[2px_2px_0px_0px_#1a1a1a]'
                      : 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00]'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            <Link
              href={page < totalPages ? buildBlogPageHref(page + 1, paginationFilters) : '#'}
              className={`px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#1a1a1a] transition-all duration-200 ${
                page < totalPages 
                  ? 'bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] active:translate-y-0.5' 
                  : 'opacity-40 cursor-not-allowed pointer-events-none'
              }`}
            >
              {t.next} &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
