// ============================================================================
// Page Source: app/blog/page.tsx
// Version: 1.0.0 — Blog List / Articles Page
// Why: Content marketing and SEO through helpful articles
// Purpose: Provide value, build authority, drive organic traffic
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Blog introduction
//   2. Featured Articles - Highlight top content
//   3. All Articles - Grid of blog posts
//   4. Categories - Filter by topic
// Note: This is a placeholder with sample articles
// ============================================================================

import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import type { Metadata } from 'next';

/**
 * Blog Page Metadata
 */
export const metadata: Metadata = {
  title: 'Blog & Resources',
  description:
    'Expert insights, guides, and resources for founders building startups and pursuing visa programs. Learn about business development, fundraising, and global entrepreneurship.',
  openGraph: {
    title: 'Blog & Resources | Startup Visa Roads',
    description:
      'Practical guides and insights for startup founders navigating business development and visa programs.',
  },
};

/**
 * Blog List Page Component
 *
 * Displays blog articles with filtering and categories.
 * Note: This is a placeholder - integrate with CMS or blog platform for production.
 */
export default function BlogPage() {
  // Sample blog posts (replace with real data/CMS)
  const posts = [
    {
      slug: 'business-plan-startup-visa',
      title: 'How to Create a Business Plan for Startup Visa Programs',
      excerpt:
        'Learn the essential elements of a strong business plan that meets the requirements of startup visa programs and impresses investors.',
      category: 'Business Planning',
      date: '2024-12-01',
      readTime: '8 min read',
      image: '📊',
    },
    {
      slug: 'canada-startup-visa-guide',
      title: 'Complete Guide to Canada\'s Start-Up Visa Program',
      excerpt:
        'Everything you need to know about Canada\'s Start-Up Visa program, from eligibility to designated organizations to application process.',
      category: 'Country Guides',
      date: '2024-11-28',
      readTime: '12 min read',
      image: '🇨🇦',
    },
    {
      slug: 'financial-projections-investors',
      title: 'Building Financial Projections That Investors Actually Believe',
      excerpt:
        'Common mistakes founders make with financial projections and how to create realistic, credible models that support your fundraising.',
      category: 'Finance',
      date: '2024-11-25',
      readTime: '10 min read',
      image: '💰',
    },
    {
      slug: 'market-research-validation',
      title: 'Market Research for Startup Visa Applications: A Practical Guide',
      excerpt:
        'How to conduct effective market research to validate your business idea and strengthen your visa application.',
      category: 'Business Planning',
      date: '2024-11-20',
      readTime: '9 min read',
      image: '🔍',
    },
    {
      slug: 'netherlands-startup-visa-requirements',
      title: 'Netherlands Startup Visa: Requirements and Process',
      excerpt:
        'An in-depth look at the Dutch startup visa program, including innovation requirements and facilitator selection.',
      category: 'Country Guides',
      date: '2024-11-15',
      readTime: '11 min read',
      image: '🇳🇱',
    },
    {
      slug: 'pitch-deck-best-practices',
      title: '10 Pitch Deck Slides Every Startup Visa Applicant Needs',
      excerpt:
        'Master the art of the pitch deck with our guide to the essential slides that tell your startup\'s story effectively.',
      category: 'Fundraising',
      date: '2024-11-10',
      readTime: '7 min read',
      image: '🎤',
    },
  ];

  const categories = ['All', 'Business Planning', 'Country Guides', 'Finance', 'Fundraising'];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Insights for Global Founders"
        subtitle="Practical guides, expert insights, and resources to help you build an investment-ready startup and navigate visa programs successfully."
        ctaText="Explore Articles"
        ctaLink="#articles"
      />

      {/* Categories Filter */}
      <section className="section bg-background pt-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  category === 'All'
                    ? 'bg-accent text-white'
                    : 'bg-white text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section id="articles" className="section bg-background pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group hover:shadow-2xl transition-all duration-300"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Image Placeholder */}
                <div className="text-6xl mb-4">{post.image}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-primary-dark/80 text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-primary-dark/60 pt-4 border-t border-primary/10">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section (Placeholder) */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto card border-2 border-accent">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Get Startup Insights Delivered
              </h2>
              <p className="text-primary-dark/80 mb-6">
                Join 5,000+ founders receiving weekly insights on building global startups
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button type="submit" className="btn-accent whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-primary-dark/60 mt-3">
                Unsubscribe anytime. Privacy policy applies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
