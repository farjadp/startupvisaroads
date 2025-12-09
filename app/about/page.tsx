// ============================================================================
// Page Source: app/about/page.tsx
// Version: 1.0.0 — About Us / Company Information Page
// Why: Build trust through transparency about mission, values, and team
// Purpose: Establish credibility and differentiate from immigration law firms
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Company mission and vision
//   2. Our Story - Origin and why we exist
//   3. Our Approach - How we're different
//   4. Values - Core principles
//   5. Team - Key people (placeholder)
//   6. CTA - Get started
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import MentorCard from '@/components/MentorCard';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * About Page Metadata
 */
export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Startup Visa Roads: our mission to help founders build investment-ready startups, our values, and our approach to mentorship. We are NOT an immigration law firm.',
  openGraph: {
    title: 'About Us | Startup Visa Roads',
    description:
      'Discover our story, mission, and the team behind Startup Visa Roads. Professional mentorship for global entrepreneurs.',
  },
};

/**
 * About Page Component
 *
 * Establishes trust and credibility through transparent communication
 * about mission, values, and team. Critical for differentiation.
 */
export default function AboutPage() {
  const values = [
    {
      icon: '🎯',
      title: 'Clarity & Honesty',
      description:
        'We communicate clearly about what we do and don\'t do. No overclaiming, no false promises—just honest guidance.',
    },
    {
      icon: '🤝',
      title: 'Founder-First',
      description:
        'Everything we do is designed to serve founders. Your success in building a real business is our only metric.',
    },
    {
      icon: '📚',
      title: 'Knowledge Sharing',
      description:
        'We believe in education and empowerment. We teach you to build, not create dependency on our services.',
    },
    {
      icon: '🌍',
      title: 'Global Perspective',
      description:
        'We understand the challenges of building across borders and bring international experience to every engagement.',
    },
  ];

  const team = [
    {
      name: 'David Martinez',
      title: 'Founder & Lead Mentor',
      bio: 'Serial entrepreneur with 3 successful exits. Helped 200+ founders navigate startup visa programs while building real businesses. Former VC partner.',
      expertise: ['Entrepreneurship', 'Fundraising', 'Strategy', 'Mentorship'],
    },
    {
      name: 'Lisa Thompson',
      title: 'Head of Business Development',
      bio: 'Expert in business model innovation and market entry strategies. 15 years experience in startup ecosystems across North America and Europe.',
      expertise: ['Business Models', 'Market Research', 'Go-to-Market', 'Product'],
    },
    {
      name: 'Raj Patel',
      title: 'Financial Planning Lead',
      bio: 'Former CFO of multiple venture-backed startups. Specializes in financial modeling, fundraising preparation, and investor relations.',
      expertise: ['Finance', 'Fundraising', 'Modeling', 'Investor Relations'],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Guiding Founders on Their Global Journey"
        subtitle="We're on a mission to help ambitious founders build investment-ready startups that create value, generate jobs, and transform industries worldwide."
        ctaText="Work With Us"
        ctaLink="/contact"
      />

      {/* Our Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Our Story
              </h2>
            </div>

            <div className="prose max-w-none">
              <div className="card mb-8">
                <p className="text-lg text-primary-dark/80 leading-relaxed mb-4">
                  Startup Visa Roads was born from a simple observation: many talented
                  founders with great ideas struggle not because they lack potential,
                  but because they lack the business foundation and guidance needed to
                  succeed in startup visa programs.
                </p>
                <p className="text-lg text-primary-dark/80 leading-relaxed mb-4">
                  Having personally navigated startup visa programs and worked with hundreds
                  of entrepreneurs, we recognized a critical gap in the market. While
                  immigration attorneys handle the legal aspects, founders often need help
                  with the business side: refining their model, creating professional
                  documentation, and building something investors actually want to fund.
                </p>
                <p className="text-lg text-primary-dark/80 leading-relaxed">
                  That's where we come in. We're <strong>mentors and business advisors</strong>—
                  NOT an immigration law firm. We focus exclusively on helping you build a
                  strong, viable business that meets the requirements of startup visa programs
                  and has real potential for success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How We're Different
            </h2>
            <p className="text-lg text-primary-dark/80">
              We take a unique approach to supporting founders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    We Focus on Business
                  </h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    Our sole focus is helping you build a strong, viable business.
                    We're not distracted by legal services we can't provide—we do
                    one thing and do it well.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Real Founder Experience
                  </h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    Our team consists of founders who have been in your shoes.
                    We've built companies, raised funding, and navigated the
                    same challenges you're facing.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Transparent & Honest
                  </h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    We're upfront about what we can and can't do. No false
                    promises, no visa guarantees, just honest guidance and
                    professional expertise.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">✅</span>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Long-Term Partnership
                  </h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    We're not just here for the application process. We support
                    you as you launch and grow your business, providing ongoing
                    mentorship and guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-primary-dark/80">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="text-5xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-primary-dark/80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-primary-dark/80">
              Experienced founders and operators dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <MentorCard key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-accent/10 border-2 border-accent rounded-xl p-8">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">⚠️</span>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    What We Are NOT
                  </h3>
                  <p className="text-primary-dark/80 leading-relaxed mb-4">
                    <strong>Startup Visa Roads is NOT an immigration law firm</strong> and
                    we do NOT provide immigration legal services. We are mentors and business
                    advisors who help you build strong, viable businesses.
                  </p>
                  <p className="text-primary-dark/80 leading-relaxed">
                    We do not complete visa applications, communicate with immigration
                    authorities, provide legal advice, or guarantee visa approvals. For all
                    legal immigration matters, you must work with a licensed immigration attorney.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Start Your Journey?"
        description="Let's discuss your business idea and explore how we can help you build something extraordinary."
        primaryCTA={{
          text: 'Schedule Free Consultation',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'View Our Services',
          link: '/services',
        }}
        variant="gradient"
      />
    </div>
  );
}
