// ============================================================================
// Component Source: components/MentorCard.tsx
// Version: 1.0.0 — Mentor/Team Member Profile Card
// Why: Showcase mentors and advisors to build trust and credibility
// Usage: About page, mentorship page, team section
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Props:
//   - name: Mentor's full name
//   - title: Professional title/role
//   - bio: Short biography (2-3 sentences)
//   - expertise: Array of expertise areas
//   - imageUrl: Optional profile image URL
//   - linkedIn: Optional LinkedIn profile URL
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MentorCardProps {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  imageUrl?: string;
  linkedIn?: string;
}

/**
 * MentorCard Component
 *
 * Displays mentor/advisor profiles with professional credibility markers.
 * Designed to build trust through clear presentation of expertise and
 * professional background.
 *
 * Trust-Building Elements:
 * - Professional headshot (when available)
 * - Clear title and role
 * - Concise bio highlighting relevant experience
 * - Specific areas of expertise
 * - Optional LinkedIn verification
 *
 * Design Philosophy:
 * - Clean, professional layout
 * - Emphasis on credibility over marketing
 * - Easy-to-scan expertise tags
 * - Subtle hover effects for interactivity
 */
export default function MentorCard({
  name,
  title,
  bio,
  expertise,
  imageUrl,
  linkedIn,
}: MentorCardProps) {
  return (
    <div className="card h-full flex flex-col group">
      {/* Profile Image or Placeholder */}
      <div className="mb-4 relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary to-accent">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} - ${title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-white">
            👤
          </div>
        )}
      </div>

      {/* Name and Title */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-primary mb-1">{name}</h3>
        <p className="text-sm font-medium text-accent">{title}</p>
      </div>

      {/* Bio */}
      <p className="text-sm text-primary-dark/80 mb-4 leading-relaxed flex-grow">
        {bio}
      </p>

      {/* Expertise Tags */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
          Expertise
        </h4>
        <div className="flex flex-wrap gap-2">
          {expertise.map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium hover:bg-primary hover:text-white transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* LinkedIn Link */}
      {linkedIn && (
        <div className="mt-auto pt-4 border-t border-primary/10">
          <Link
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-light transition-colors duration-300 inline-flex items-center text-sm font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            View LinkedIn Profile
          </Link>
        </div>
      )}
    </div>
  );
}
