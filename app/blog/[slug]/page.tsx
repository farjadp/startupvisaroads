// ============================================================================
// Page Source: app/blog/[slug]/page.tsx
// Version: 1.0.0 — Single Blog Post Page (Dynamic Route)
// Why: Display individual blog articles with full content
// Purpose: Provide value through detailed content, improve SEO
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Note: This is a template/placeholder - integrate with CMS for production
// ============================================================================

import React from 'react';
import Link from 'next/link';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * Generate Metadata for Blog Post
 * (In production, fetch from CMS based on slug)
 */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Blog Post | ${params.slug}`,
    description: 'Expert insights and guides for startup founders.',
  };
}

/**
 * Single Blog Post Page Component
 *
 * Displays full blog article content with formatting, images, and CTAs.
 * Note: This is a placeholder template. In production, fetch content from CMS.
 */
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Placeholder data (replace with CMS fetch based on params.slug)
  const post = {
    title: 'How to Create a Business Plan for Startup Visa Programs',
    category: 'Business Planning',
    date: '2024-12-01',
    readTime: '8 min read',
    author: 'David Martinez',
    content: `
      This is a placeholder blog post. In production, this content would be fetched
      from a CMS or database based on the slug parameter.

      ## Why Business Plans Matter

      A strong business plan is essential for startup visa applications. It demonstrates
      your understanding of the market, your strategy for success, and your ability to
      execute on your vision.

      ## Key Components

      1. **Executive Summary**: A compelling overview of your business
      2. **Market Analysis**: Deep understanding of your target market
      3. **Financial Projections**: Realistic revenue and expense forecasts
      4. **Team**: Showcase your team's capabilities
      5. **Competitive Advantage**: What makes you different

      ## Best Practices

      - Be realistic with projections
      - Show deep market understanding
      - Demonstrate traction where possible
      - Address risks honestly

      Remember: We are NOT an immigration law firm. This content is for business
      development guidance only.
    `,
  };

  return (
    <div>
      {/* Article Header */}
      <section className="section bg-background pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <Link
                href="/blog"
                className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold rounded-full hover:bg-accent hover:text-white transition-all duration-300"
              >
                ← Back to Blog
              </Link>
            </div>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-primary-dark/60 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-primary">{post.author}</span>
              </div>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section bg-white pt-0">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <div className="card">
                {/* Content (in production, render markdown or rich text from CMS) */}
                <div className="text-primary-dark/80 leading-relaxed space-y-6">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('##')) {
                      return (
                        <h2 key={index} className="text-2xl font-bold text-primary mt-8 mb-4">
                          {paragraph.replace('##', '').trim()}
                        </h2>
                      );
                    }
                    if (paragraph.trim().match(/^\d+\./)) {
                      const items = paragraph.split('\n').filter(line => line.trim());
                      return (
                        <ol key={index} className="list-decimal list-inside space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx}>{item.replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ol>
                      );
                    }
                    if (paragraph.trim().startsWith('-')) {
                      const items = paragraph.split('\n').filter(line => line.trim());
                      return (
                        <ul key={index} className="list-disc list-inside space-y-2">
                          {items.map((item, idx) => (
                            <li key={idx}>{item.replace(/^-\s*/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index}>
                        {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<').map((part, idx) => {
                          if (part.startsWith('strong>')) {
                            const text = part.replace('strong>', '').replace('</strong>', '');
                            return <strong key={idx}>{text}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            </article>

            {/* Share Section */}
            <div className="mt-12 p-6 bg-background rounded-xl">
              <h3 className="font-bold text-primary mb-3">Share this article</h3>
              <div className="flex gap-3">
                <button className="btn-outline text-sm">Share on Twitter</button>
                <button className="btn-outline text-sm">Share on LinkedIn</button>
                <button className="btn-outline text-sm">Copy Link</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts (Placeholder) */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">
              Related Articles
            </h2>
            <Link href="/blog" className="btn-primary">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Build Your Startup?"
        description="Get personalized guidance from our team of experienced mentors and business advisors."
        primaryCTA={{
          text: 'Schedule Consultation',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'View Services',
          link: '/services',
        }}
        variant="gradient"
      />
    </div>
  );
}
