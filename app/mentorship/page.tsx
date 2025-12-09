// ============================================================================
// Page Source: app/mentorship/page.tsx
// Version: 1.0.0 — Mentorship Program Page
// Why: Detail one-on-one mentorship offerings and mentor profiles
// Purpose: Showcase mentorship value and connect founders with experienced guides
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Mentorship value proposition
//   2. Why Mentorship Matters - Benefits and outcomes
//   3. Our Mentors - Mentor profiles (placeholder)
//   4. Mentorship Areas - Topics covered
//   5. Program Structure - How mentorship works
//   6. Success Stories - Testimonials (placeholder)
//   7. CTA - Apply for mentorship
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import MentorCard from '@/components/MentorCard';
import ServiceCard from '@/components/ServiceCard';
import StepTimeline from '@/components/StepTimeline';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * Mentorship Page Metadata
 */
export const metadata: Metadata = {
  title: 'Mentorship',
  description:
    'One-on-one mentorship from experienced founders who have successfully built startups and navigated visa programs. Expert guidance for business development and growth.',
  openGraph: {
    title: 'Mentorship Programs | Startup Visa Roads',
    description:
      'Connect with experienced mentors who guide you through business development, market validation, and startup growth. Professional mentorship, NOT legal services.',
  },
};

/**
 * Mentorship Page Component
 *
 * Showcases mentorship programs and connects founders with experienced guides.
 *
 * Key Elements:
 * - Mentor profiles and credentials
 * - Mentorship topics and areas
 * - Program structure and commitment
 * - Success stories and outcomes
 * - Clear application/onboarding process
 */
export default function MentorshipPage() {
  // Sample mentor profiles (replace with real data)
  const mentors = [
    {
      name: 'Sarah Johnson',
      title: 'SaaS Founder & Growth Strategist',
      bio: 'Built and scaled two SaaS companies to 7-figure ARR. Helped 50+ founders through the Canada Start-Up Visa program. Expertise in B2B software and product-market fit.',
      expertise: ['SaaS', 'Product Strategy', 'Growth Marketing', 'Fundraising'],
    },
    {
      name: 'Michael Chen',
      title: 'Serial Entrepreneur & VC Advisor',
      bio: '3 successful exits in fintech and e-commerce. Former VC partner with experience evaluating 1000+ startups. Specializes in business model innovation and financial planning.',
      expertise: ['Fintech', 'Business Models', 'Fundraising', 'Exit Strategy'],
    },
    {
      name: 'Priya Sharma',
      title: 'Tech Startup Founder & Innovation Lead',
      bio: 'Successfully navigated startup visa programs in 3 countries. Built AI/ML products used by Fortune 500 companies. Focus on technical founders and deep tech startups.',
      expertise: ['Deep Tech', 'AI/ML', 'International Expansion', 'Tech Strategy'],
    },
  ];

  // Mentorship focus areas
  const focusAreas = [
    {
      icon: '🎯',
      title: 'Business Model & Strategy',
      description:
        'Refine your business model, identify revenue streams, and develop a clear go-to-market strategy.',
      features: [
        'Business model canvas development',
        'Revenue model optimization',
        'Market positioning',
        'Competitive strategy',
      ],
    },
    {
      icon: '📈',
      title: 'Growth & Scaling',
      description:
        'Learn proven strategies for customer acquisition, retention, and sustainable growth.',
      features: [
        'Growth channel identification',
        'Customer acquisition strategies',
        'Unit economics optimization',
        'Scaling operations',
      ],
    },
    {
      icon: '💡',
      title: 'Product Development',
      description:
        'Build products that customers love through validated learning and iterative development.',
      features: [
        'Product-market fit validation',
        'MVP development guidance',
        'User research and feedback',
        'Feature prioritization',
      ],
    },
    {
      icon: '💰',
      title: 'Fundraising & Finance',
      description:
        'Master fundraising strategies, financial planning, and investor relations.',
      features: [
        'Pitch development and practice',
        'Investor targeting and outreach',
        'Cap table management',
        'Financial modeling',
      ],
    },
  ];

  // Mentorship program structure
  const programStructure = [
    {
      title: 'Initial Assessment',
      description:
        'Deep dive into your business, goals, and challenges. Match with the right mentor based on your needs.',
      details: [
        'Business concept review',
        'Goal setting session',
        'Mentor matching',
        'Customized mentorship plan',
      ],
    },
    {
      title: 'Regular Sessions',
      description:
        'Bi-weekly one-on-one sessions with your dedicated mentor (60-90 minutes each).',
      details: [
        '2 sessions per month',
        'Structured agenda',
        'Action items and homework',
        'Progress tracking',
      ],
    },
    {
      title: 'Ongoing Support',
      description:
        'Continuous access between sessions for quick questions and feedback.',
      details: [
        'Email support',
        'Document reviews',
        'Resource sharing',
        'Network introductions',
      ],
    },
    {
      title: 'Milestone Reviews',
      description:
        'Monthly progress reviews to celebrate wins and adjust strategy as needed.',
      details: [
        'Goal achievement tracking',
        'Strategy refinement',
        'Next milestone planning',
        'Success celebration',
      ],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Learn from Founders Who've Been There"
        subtitle="One-on-one mentorship from experienced entrepreneurs who have built successful startups and navigated visa programs worldwide."
        ctaText="Apply for Mentorship"
        ctaLink="/contact"
      />

      {/* Why Mentorship */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Mentorship Matters
            </h2>
            <p className="text-lg text-primary-dark/80 leading-relaxed">
              Building a startup is challenging, especially when navigating new markets and
              visa requirements. Our mentors provide guidance, accountability, and expertise
              to help you avoid common pitfalls and accelerate your progress.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Accelerate Progress
              </h3>
              <p className="text-primary-dark/80 text-sm">
                Learn from others' experiences and avoid costly mistakes. Move faster
                with proven strategies and frameworks.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Stay Accountable
              </h3>
              <p className="text-primary-dark/80 text-sm">
                Regular check-ins and milestone tracking keep you focused and motivated
                on the most important tasks.
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Expand Network
              </h3>
              <p className="text-primary-dark/80 text-sm">
                Get introductions to investors, partners, and other founders who can
                help you grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mentors */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Meet Our Mentors
            </h2>
            <p className="text-lg text-primary-dark/80">
              Experienced founders and operators who are invested in your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Mentorship Focus Areas
            </h2>
            <p className="text-lg text-primary-dark/80">
              Comprehensive guidance across all aspects of building and growing your startup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => (
              <ServiceCard key={index} {...area} />
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How Mentorship Works
            </h2>
            <p className="text-lg text-primary-dark/80">
              A structured yet flexible program designed to deliver real results
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <StepTimeline steps={programStructure} variant="vertical" />
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-primary-dark/80">
              Hear from founders who have benefited from our mentorship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card border-l-4 border-accent">
              <p className="text-primary-dark/80 italic mb-4">
                "The mentorship program was invaluable. My mentor helped me refine my
                business model and prepare documentation that impressed the designated
                organization. I couldn't have done it without this guidance."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                  AK
                </div>
                <div>
                  <div className="font-semibold text-primary">Alex K.</div>
                  <div className="text-sm text-primary-dark/60">
                    SaaS Founder, Canada Start-Up Visa
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-l-4 border-accent">
              <p className="text-primary-dark/80 italic mb-4">
                "Having a mentor who had actually been through the process was game-changing.
                The weekly sessions kept me accountable and focused on what really mattered
                for building a fundable business."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <div className="font-semibold text-primary">Maria P.</div>
                  <div className="text-sm text-primary-dark/60">
                    Fintech Founder, Netherlands Startup Visa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Work with a Mentor?"
        description="Apply for our mentorship program and get paired with an experienced founder who understands your goals and challenges."
        primaryCTA={{
          text: 'Apply for Mentorship',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'Explore All Services',
          link: '/services',
        }}
        variant="gradient"
      />
    </div>
  );
}
