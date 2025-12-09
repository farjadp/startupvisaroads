// ============================================================================
// Component Source: components/CTASection.tsx
// Version: 1.0.0 — Call-to-Action Section Component
// Why: Drive conversions with compelling CTAs throughout the site
// Usage: End of pages, between sections, conversion points
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - title: CTA headline
//   - description: Supporting text
//   - primaryCTA: Primary button config (text + link)
//   - secondaryCTA: Optional secondary button config
//   - variant: Visual style ('default', 'gradient', 'minimal')
// ============================================================================

import React from 'react';
import Link from 'next/link';

interface CTAButton {
  text: string;
  link: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
  variant?: 'default' | 'gradient' | 'minimal';
}

/**
 * CTASection Component
 *
 * Prominent call-to-action sections designed to drive user engagement
 * and conversions at key decision points throughout the site.
 *
 * Conversion Principles:
 * - Clear value proposition
 * - Single primary action (with optional secondary)
 * - Contrasting colors for visibility
 * - Action-oriented copy
 * - Low friction (direct links, no forms in CTA)
 *
 * Variants:
 * - default: Standard CTA with card styling
 * - gradient: Bold gradient background for high-impact placement
 * - minimal: Subtle styling for repeated CTAs
 *
 * Strategic Placement:
 * - End of informational pages
 * - After value propositions
 * - Between major content sections
 * - Exit intent areas
 */
export default function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
}: CTASectionProps) {
  // Variant-specific styling
  const variantStyles = {
    default: 'bg-white card',
    gradient: 'bg-gradient-to-br from-primary via-accent to-primary-light text-white',
    minimal: 'bg-background-light border-2 border-primary/20 rounded-xl p-8',
  };

  const textColorClass = variant === 'gradient' ? 'text-white' : 'text-primary';
  const descColorClass = variant === 'gradient' ? 'text-white/90' : 'text-primary-dark/80';

  return (
    <section className="section">
      <div className="container-custom">
        <div
          className={`${variantStyles[variant]} max-w-4xl mx-auto text-center animate-fade-in`}
        >
          {/* Title */}
          <h2
            className={`text-3xl md:text-4xl font-bold ${textColorClass} mb-4`}
          >
            {title}
          </h2>

          {/* Description */}
          <p className={`text-lg md:text-xl ${descColorClass} mb-8 leading-relaxed`}>
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Link
              href={primaryCTA.link}
              className={`${
                variant === 'gradient'
                  ? 'bg-white text-primary hover:bg-background-light'
                  : 'btn-accent'
              } inline-block text-lg transform hover:scale-105 transition-all duration-300 py-3 px-8 rounded-lg font-bold shadow-lg hover:shadow-xl`}
            >
              {primaryCTA.text}
            </Link>

            {/* Secondary CTA (Optional) */}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.link}
                className={`${
                  variant === 'gradient'
                    ? 'border-2 border-white text-white hover:bg-white hover:text-primary'
                    : 'btn-outline'
                } inline-block text-lg transition-all duration-300 py-3 px-8 rounded-lg font-semibold`}
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>

          {/* Trust Indicator */}
          {variant !== 'minimal' && (
            <p className="text-sm mt-6 opacity-70">
              {variant === 'gradient' ? (
                <span className="text-white/80">
                  ✓ Professional mentorship · No immigration law services
                </span>
              ) : (
                <span className="text-primary-dark/60">
                  ✓ Professional mentorship · No immigration law services
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
