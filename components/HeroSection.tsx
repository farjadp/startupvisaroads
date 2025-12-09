// ============================================================================
// Component Source: components/HeroSection.tsx
// Version: 1.0.0 — Reusable Hero Section Component
// Why: Main hero section for all pages with consistent branding and messaging
// Usage: Homepage and key landing pages to establish trust and drive CTAs
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - title: Main headline text
//   - subtitle: Supporting text below title
//   - ctaText: Call-to-action button text
//   - ctaLink: Call-to-action button link
//   - backgroundImage: Optional background image URL
// ============================================================================

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  centered?: boolean;
}

/**
 * HeroSection Component
 *
 * A reusable hero section component that creates impact with clean typography,
 * brand-aligned colors, and clear calls-to-action. Designed to establish trust
 * and credibility while maintaining professional mentorship positioning.
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Optional background image with overlay
 * - Customizable CTA buttons
 * - SEO-optimized semantic HTML
 * - Smooth animations on load
 */
export default function HeroSection({
  title,
  subtitle,
  ctaText = "Schedule a Consultation",
  ctaLink = "/contact",
  backgroundImage,
  centered = true,
}: HeroSectionProps) {
  return (
    <section
      className={`relative min-h-[500px] flex items-center justify-center overflow-hidden ${
        backgroundImage ? 'bg-cover bg-center' : 'bg-gradient-primary'
      }`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      {/* Overlay for better text readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm"></div>
      )}

      {/* Content Container */}
      <div className="container-custom relative z-10">
        <div
          className={`max-w-4xl ${
            centered ? 'mx-auto text-center' : 'text-left'
          } animate-fade-in`}
        >
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-shadow">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed text-shadow">
            {subtitle}
          </p>

          {/* CTA Button */}
          {ctaText && ctaLink && (
            <div className="flex gap-4 justify-center items-center">
              <Link
                href={ctaLink}
                className="btn-accent inline-block text-lg transform hover:scale-105"
              >
                {ctaText}
              </Link>

              {/* Secondary CTA - Learn More */}
              <Link
                href="/about"
                className="btn-outline bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-primary inline-block text-lg"
              >
                Learn More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
