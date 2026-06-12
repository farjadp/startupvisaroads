import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default async function CategoryArchivePage({ 
  params 
}: { 
  params: { locale: string; slug: string } 
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  const isRtl = locale === 'fa';

  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return notFound();
  }

  // Find articles belonging to this category
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: category.id
    },
    orderBy: { createdAt: 'desc' },
    include: { category: true, tags: true }
  });

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

  // Helper to get reading time
  const getReadingTime = (content: string) => {
    const match = content.match(/<script\s+type="application\/json"\s+id="quick-facts-data">([\s\S]*?)<\/script>/i);
    if (match) {
      try {
        const qf = JSON.parse(match[1].trim());
        if (qf.readingTime) return qf.readingTime;
      } catch (e) {}
    }
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const readMin = Math.ceil(wordCount / 200) || 1;
    return isRtl ? `${readMin} دقیقه مطالعه` : `${readMin} min read`;
  };

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl" dir={isRtl ? 'rtl' : 'ltr'}>
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
          {category.name}
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
              <div className="aspect-video w-full bg-[#1a1a1a]/5 rounded-2xl overflow-hidden mb-6 border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] group-hover:shadow-[6px_6px_0px_0px_#CCFF00] group-hover:scale-[1.01] transition-all duration-300">
                {article.coverImage ? (
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-[#1a1a1a]/10 text-4xl">SVR.</div>
                )}
              </div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] bg-[#1a1a1a] px-2.5 py-1 rounded-full">
                  {category.name}
                </span>
                <span className="text-xs text-[#1a1a1a]/50 font-sans flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getReadingTime(article.content)}
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
