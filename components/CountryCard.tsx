// ============================================================================
// Component Source: components/CountryCard.tsx
// Version: 1.0.0 — Country-Specific Visa Program Card
// Why: Display startup visa programs by country with key information
// Usage: Homepage, programs overview page
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - countryName: Name of the country
//   - programName: Name of the visa/program
//   - flagEmoji: Country flag emoji
//   - description: Brief program description
//   - highlights: Key program highlights
//   - link: Link to detailed program page
// ============================================================================

import React from 'react';
import Link from 'next/link';

interface CountryCardProps {
  countryName: string;
  programName: string;
  flagEmoji: string;
  description: string;
  highlights: string[];
  link: string;
}

/**
 * CountryCard Component
 *
 * Showcases country-specific startup visa programs with essential information.
 * Designed to help founders quickly understand program options and navigate
 * to detailed guidance pages.
 *
 * Design Principles:
 * - Visual hierarchy with flag and country name
 * - Scannable highlights for quick comparison
 * - Clear CTA to detailed program page
 * - Consistent with brand identity
 *
 * Information Architecture:
 * - Country identification (flag + name)
 * - Program name and type
 * - Brief description (1-2 sentences)
 * - 3-5 key highlights
 * - Link to comprehensive guide
 */
export default function CountryCard({
  countryName,
  programName,
  flagEmoji,
  description,
  highlights,
  link,
}: CountryCardProps) {
  return (
    <Link href={link} className="block h-full">
      <div className="card h-full flex flex-col group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-accent/30">
        {/* Country Header with Flag */}
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">{flagEmoji}</span>
          <div>
            <h3 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
              {countryName}
            </h3>
            <p className="text-sm text-primary-dark/70 font-medium">
              {programName}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-primary-dark/80 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Program Highlights */}
        <div className="flex-grow mb-4">
          <h4 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
            Key Highlights
          </h4>
          <ul className="space-y-2">
            {highlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-primary-dark/70"
              >
                <span className="text-secondary mr-2 mt-0.5 flex-shrink-0">
                  ▸
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-primary/10">
          <span className="text-accent font-semibold group-hover:text-accent-light transition-colors duration-300 inline-flex items-center">
            Explore Program Details
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
