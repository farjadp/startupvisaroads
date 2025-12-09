// ============================================================================
// Component Source: components/ServiceCard.tsx
// Version: 1.0.0 — Service Offering Card Component
// Why: Display mentorship services with clear value propositions
// Usage: Services page, homepage features section
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - icon: Icon/emoji representing the service
//   - title: Service name
//   - description: Brief service description
//   - features: List of key features
//   - link: Optional link to detailed service page
// ============================================================================

import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features?: string[];
  link?: string;
}

/**
 * ServiceCard Component
 *
 * Displays individual mentorship services with clean, professional styling.
 * Emphasizes value proposition and key features to build trust and clarity.
 *
 * Design Philosophy:
 * - Clean, card-based layout for easy scanning
 * - Clear hierarchy: icon → title → description → features
 * - Hover effects for interactivity
 * - Brand-aligned color palette
 *
 * Accessibility:
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - Focus states for keyboard navigation
 */
export default function ServiceCard({
  icon,
  title,
  description,
  features = [],
  link,
}: ServiceCardProps) {
  const CardContent = (
    <div className="card h-full flex flex-col group hover:border-primary/20 border border-transparent transition-all duration-300">
      {/* Icon */}
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>

      {/* Description */}
      <p className="text-primary-dark/80 mb-4 flex-grow leading-relaxed">
        {description}
      </p>

      {/* Features List */}
      {features.length > 0 && (
        <ul className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start text-sm text-primary-dark/70"
            >
              <span className="text-accent mr-2 mt-1 flex-shrink-0">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Link/CTA */}
      {link && (
        <div className="mt-auto pt-4">
          <span className="text-accent font-semibold group-hover:text-accent-light transition-colors duration-300 inline-flex items-center">
            Learn More
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );

  // If link provided, wrap in Link component
  if (link) {
    return (
      <Link href={link} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  // Otherwise, return static card
  return CardContent;
}
