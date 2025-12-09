// ============================================================================
// Page Source: app/services/page.tsx
// Version: 1.0.0 — Services Overview Page
// Why: Comprehensive overview of all mentorship and advisory services offered
// Purpose: Detail service offerings, pricing approaches, and engagement models
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Services value proposition
//   2. Core Services - Main offering categories
//   3. Service Details - In-depth descriptions
//   4. Engagement Models - How we work with clients
//   5. What's Included - Deliverables and expectations
//   6. What We DON'T Do - Clear boundaries (legal services)
//   7. CTA - Schedule consultation
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * Services Page Metadata
 *
 * SEO-optimized for service-related searches.
 * Emphasizes mentorship and business advisory (NOT legal services).
 */
export const metadata: Metadata = {
  title: 'Services',
  description:
    'Professional startup mentorship and business advisory services including business model development, investment readiness, financial planning, and strategic guidance. We are NOT an immigration law firm.',
  openGraph: {
    title: 'Our Services | Startup Visa Roads',
    description:
      'Comprehensive business development services for founders pursuing startup visa programs. Mentorship and advisory only—NOT legal services.',
  },
};

/**
 * Services Page Component
 *
 * Comprehensive overview of all services with clear scope definition.
 * Critical to establish what we DO and DON'T do.
 *
 * Key Messaging:
 * - Business mentorship and advisory
 * - NOT legal immigration services
 * - Clear deliverables and outcomes
 * - Transparent engagement models
 *
 * Content Strategy:
 * - Service categories with details
 * - What's included in each service
 * - Clear boundaries and limitations
 * - Social proof and trust indicators
 */
export default function ServicesPage() {
  // Core service offerings
  const coreServices = [
    {
      icon: '🎯',
      title: 'Business Model Development',
      description:
        'Transform your startup idea into a clear, viable business model that stands up to investor and program scrutiny.',
      features: [
        'Market opportunity analysis',
        'Revenue model design',
        'Value proposition refinement',
        'Competitive landscape assessment',
        'Customer segment identification',
      ],
      link: '#business-model',
    },
    {
      icon: '📊',
      title: 'Business Plan Creation',
      description:
        'Comprehensive business plans that meet the stringent requirements of startup visa programs and investors.',
      features: [
        'Executive summary crafting',
        'Market analysis and research',
        'Financial projections (3-5 years)',
        'Operational planning',
        'Risk assessment and mitigation',
      ],
      link: '#business-plan',
    },
    {
      icon: '💰',
      title: 'Financial Planning & Projections',
      description:
        'Professional financial models and projections that demonstrate business viability and growth potential.',
      features: [
        'Revenue and expense modeling',
        'Cash flow projections',
        'Break-even analysis',
        'Funding requirement calculations',
        'Unit economics optimization',
      ],
      link: '#financial-planning',
    },
    {
      icon: '🎤',
      title: 'Pitch Deck Development',
      description:
        'Compelling pitch decks designed to win over investors, accelerators, and designated organizations.',
      features: [
        'Story arc development',
        'Visual design and layout',
        'Data visualization',
        'Competitive positioning',
        'Ask and use of funds clarity',
      ],
      link: '#pitch-deck',
    },
    {
      icon: '🔍',
      title: 'Market Research & Validation',
      description:
        'Evidence-based market research to validate your business concept and identify opportunities.',
      features: [
        'Target market sizing',
        'Customer discovery interviews',
        'Competitor analysis',
        'Industry trend research',
        'Market entry strategy',
      ],
      link: '#market-research',
    },
    {
      icon: '🧭',
      title: 'Strategic Mentorship',
      description:
        'One-on-one guidance from experienced founders who understand the startup visa landscape.',
      features: [
        'Regular mentorship sessions',
        'Goal setting and tracking',
        'Strategic decision support',
        'Accountability and milestones',
        'Network introductions',
      ],
      link: '/mentorship',
    },
  ];

  // What's included in our services
  const included = [
    {
      icon: '✅',
      title: 'Professional Documentation',
      items: [
        'Business plans (20-40 pages)',
        'Executive summaries',
        'Financial models (Excel)',
        'Pitch decks (10-15 slides)',
        'Market research reports',
      ],
    },
    {
      icon: '✅',
      title: 'Expert Guidance',
      items: [
        'Experienced mentor assignment',
        'Regular progress meetings',
        'Unlimited email support',
        'Document reviews and feedback',
        'Strategic planning sessions',
      ],
    },
    {
      icon: '✅',
      title: 'Resources & Templates',
      items: [
        'Financial modeling templates',
        'Business plan frameworks',
        'Market research guides',
        'Pitch deck templates',
        'Milestone tracking tools',
      ],
    },
  ];

  // What we DON'T do (critical boundaries)
  const notIncluded = [
    {
      icon: '❌',
      title: 'Immigration Legal Services',
      description:
        'We are NOT immigration attorneys and do NOT provide legal advice, complete visa applications, or communicate with immigration authorities on your behalf.',
    },
    {
      icon: '❌',
      title: 'Visa Guarantees',
      description:
        'We cannot and do not guarantee visa approvals. All visa decisions are made by government authorities and depend on many factors beyond business readiness.',
    },
    {
      icon: '❌',
      title: 'Attorney Representation',
      description:
        'We do not represent you in legal matters or before immigration agencies. You must work with a licensed immigration attorney for all legal aspects.',
    },
    {
      icon: '❌',
      title: 'Document Filing',
      description:
        'We do not file visa applications, communicate with embassies, or handle any official immigration paperwork. These tasks must be done by you and your attorney.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Professional Startup Mentorship & Business Advisory"
        subtitle="Comprehensive services to transform your idea into an investment-ready business. We develop your business—NOT your visa application."
        ctaText="Explore Our Services"
        ctaLink="#core-services"
      />

      {/* Important Notice */}
      <section className="section bg-accent/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 border-2 border-accent shadow-lg">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Important Service Scope Notice
                </h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  <strong>Startup Visa Roads is NOT an immigration law firm.</strong> We provide
                  business mentorship and advisory services only. We do NOT provide legal advice,
                  complete visa applications, or guarantee visa approvals. For all legal immigration
                  matters, you must work with a licensed immigration attorney.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section id="core-services" className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-primary-dark/80">
              Comprehensive business development services tailored for startup founders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What's Included
            </h2>
            <p className="text-lg text-primary-dark/80">
              Everything you need to build a strong, viable business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {included.map((category, index) => (
              <div key={index} className="card">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-primary-dark/80"
                    >
                      <span className="text-secondary mr-2">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We DON'T Do */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What We DON'T Do
            </h2>
            <p className="text-lg text-primary-dark/80">
              Clear boundaries to set proper expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {notIncluded.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-red-200"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-dark/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Process */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How We Work Together
            </h2>
            <p className="text-lg text-primary-dark/80">
              A collaborative, structured approach to business development
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">
                1. Discovery Call
              </h3>
              <p className="text-primary-dark/80 leading-relaxed">
                Free 30-minute consultation to understand your goals, assess your
                business idea, and determine if we're a good fit.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">
                2. Customized Proposal
              </h3>
              <p className="text-primary-dark/80 leading-relaxed">
                Tailored service package and timeline based on your specific needs,
                starting point, and target program requirements.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">
                3. Active Engagement
              </h3>
              <p className="text-primary-dark/80 leading-relaxed">
                Collaborative work sessions, regular check-ins, and continuous
                feedback as we develop your business documentation.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">
                4. Delivery & Support
              </h3>
              <p className="text-primary-dark/80 leading-relaxed">
                Final deliverables with optional ongoing mentorship as you launch
                your business and work with your immigration attorney.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Build Your Business?"
        description="Schedule a free consultation to discuss your startup idea and explore which services are right for you."
        primaryCTA={{
          text: 'Schedule Free Consultation',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'Learn About Mentorship',
          link: '/mentorship',
        }}
        variant="gradient"
      />
    </div>
  );
}
