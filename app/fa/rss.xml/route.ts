import prisma from '@/lib/prisma';
import { SITE_URL, SITE_NAME, stripHtml } from '@/lib/seo';

export const revalidate = 600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function buildFeed(locale: 'en' | 'fa'): Promise<string> {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', locale },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { slug: true, title: true, excerpt: true, createdAt: true },
  });

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/${locale}/blog/${a.slug}`;
      const description = escapeXml(stripHtml(a.excerpt || a.title));
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${new Date(a.createdAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — مجله فارسی</title>
    <link>${SITE_URL}/fa/blog</link>
    <description>${escapeXml('تحلیل‌ها و راهنماهای ویزای استارتاپ و مهاجرت کارآفرینی')}</description>
    <language>fa-IR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const xml = await buildFeed('fa');
    return new Response(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
    });
  } catch (error) {
    console.error('Persian RSS feed error:', error);
    return new Response('Internal error', { status: 500 });
  }
}
