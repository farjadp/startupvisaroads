// ============================================================================
// Page Source: app/page.tsx
// Version: 1.0.0 — Homepage / Landing Page
// Why: Main entry point showcasing value proposition and guiding users to key areas
// Purpose: Convert visitors into consultation bookings through trust and clarity
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Clear value proposition and primary CTA
//   2. Trust Indicators - Social proof and credentials
//   3. Services Overview - Core offerings
//   4. Popular Programs - Country-specific visa programs
//   5. How It Works - Process timeline
//   6. Testimonials - Social proof
//   7. FAQ - Address common concerns
//   8. Final CTA - Conversion point
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CountryCard from '@/components/CountryCard';
import StepTimeline from '@/components/StepTimeline';
import FAQAccordion from '@/components/FAQAccordion';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * Homepage Metadata
 *
 * SEO-optimized metadata specific to the homepage.
 * Emphasizes main value propositions and target keywords.
 */
export const metadata: Metadata = {
  title: 'Home',
  description:
    'Startup Visa Roads provides professional mentorship and business readiness guidance for founders pursuing startup visa programs in Canada, Europe, UAE, and USA. Expert advisory, NOT immigration law services.',
  openGraph: {
    title: 'Startup Visa Roads | Professional Startup Mentorship',
    description:
      'Transform your startup idea into a visa-ready business with expert mentorship. We guide founders through business development—we are NOT an immigration law firm.',
  },
};

/**
 * Homepage Component
 *
 * The main landing page designed to:
 * 1. Establish trust and credibility
 * 2. Clearly communicate value proposition
 * 3. Showcase services and programs
 * 4. Address common questions and concerns
 * 5. Drive consultations through strategic CTAs
 *
 * Content Strategy:
 * - Clear differentiation: mentorship, NOT legal services
 * - Benefit-focused messaging
 * - Social proof and trust indicators
 * - Scannable, organized content
 * - Multiple conversion points
 *
 * User Journey:
 * Hero → Trust → Services → Programs → Process → Social Proof → FAQ → CTA
 */
export default function HomePage() {
  // Services data for cards
  const services = [
    {
      icon: '🎯',
      title: 'Business Model Development',
      description:
        'Refine your startup idea into a viable, scalable business model that meets investor and visa program requirements.',
      features: [
        'Market validation and research',
        'Revenue model optimization',
        'Competitive analysis',
        'Value proposition refinement',
      ],
      link: '/services',
    },
    {
      icon: '📊',
      title: 'Investment Readiness',
      description:
        'Prepare your startup for investor scrutiny and visa program evaluation with professional business documentation.',
      features: [
        'Business plan development',
        'Financial projections',
        'Pitch deck creation',
        'Investment materials',
      ],
      link: '/services',
    },
    {
      icon: '🧭',
      title: 'Mentorship & Strategy',
      description:
        'One-on-one guidance from experienced founders who have successfully navigated startup visa programs.',
      features: [
        'Regular mentorship sessions',
        'Strategic planning',
        'Milestone tracking',
        'Personalized guidance',
      ],
      link: '/mentorship',
    },
  ];

  // Popular visa programs
  const popularPrograms = [
    {
      countryName: 'Canada',
      programName: 'Start-Up Visa Program',
      flagEmoji: '🇨🇦',
      description:
        'Build a business that qualifies for Canada\'s Start-Up Visa program with support from designated organizations.',
      highlights: [
        'No net worth requirements',
        'Permanent residence pathway',
        'Family inclusion',
        'Designated organization support needed',
      ],
      link: '/startup-visa-canada',
    },
    {
      countryName: 'Denmark',
      programName: 'Start-Up Denmark',
      flagEmoji: '🇩🇰',
      description:
        'Launch your innovative startup in Denmark\'s thriving ecosystem with expert mentorship and business development.',
      highlights: [
        'Expert panel evaluation',
        '2-year residence permit',
        'Access to Nordic markets',
        'Strong startup ecosystem',
      ],
      link: '/europe/denmark',
    },
    {
      countryName: 'Netherlands',
      programName: 'Dutch Start-Up Visa',
      flagEmoji: '🇳🇱',
      description:
        'Develop an innovative business for the Dutch market with guidance from experienced mentors and facilitators.',
      highlights: [
        'One-year residence permit',
        'Facilitator requirement',
        'Innovation focus',
        'EU market access',
      ],
      link: '/europe/netherlands',
    },
    {
      countryName: 'UAE',
      programName: 'Golden Visa for Entrepreneurs',
      flagEmoji: '🇦🇪',
      description:
        'Build a business that qualifies for UAE\'s prestigious Golden Visa program with strategic business planning.',
      highlights: [
        '10-year renewable visa',
        'No sponsor needed',
        'Family sponsorship',
        'Investment requirements',
      ],
      link: '/uae/golden-visa',
    },
  ];

  // Process steps
  const processSteps = [
    {
      title: 'Initial Consultation',
      description:
        'We assess your startup idea, background, and goals to determine the best path forward.',
      details: [
        'Evaluate your business concept',
        'Discuss target programs',
        'Identify gaps and opportunities',
        'Create personalized roadmap',
      ],
    },
    {
      title: 'Business Development',
      description:
        'Work with mentors to refine your business model, conduct market research, and validate your idea.',
      details: [
        'Market validation',
        'Business model refinement',
        'Competitive analysis',
        'Product-market fit assessment',
      ],
    },
    {
      title: 'Documentation Preparation',
      description:
        'Create professional business documentation including business plans, financial projections, and pitch materials.',
      details: [
        'Comprehensive business plan',
        '3-5 year financial projections',
        'Executive summary',
        'Market research reports',
      ],
    },
    {
      title: 'Launch & Support',
      description:
        'Ongoing mentorship as you launch your business and navigate the visa application process (with your attorney).',
      details: [
        'Implementation support',
        'Milestone tracking',
        'Strategy adjustments',
        'Continued mentorship',
      ],
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'Are you an immigration law firm?',
      answer:
        'No. Startup Visa Roads is NOT an immigration law firm and we do NOT provide immigration legal services. We are a mentorship and business advisory service that helps founders build investment-ready startups. For legal immigration matters, you must work with a licensed immigration attorney.',
    },
    {
      question: 'What exactly do you help with?',
      answer:
        'We help founders develop strong, viable businesses that meet the requirements of various startup visa programs. This includes business model development, market research, business plan creation, financial projections, and strategic mentorship. We prepare you from a business readiness perspective.',
    },
    {
      question: 'Do you guarantee visa approval?',
      answer:
        'No. We cannot and do not guarantee visa approvals. Visa decisions are made by government immigration authorities and depend on many factors. We help you build the strongest possible business case, but the final decision rests with immigration officials and must be handled through proper legal channels.',
    },
    {
      question: 'Who should work with you?',
      answer:
        'Founders with serious business ideas who are considering or actively pursuing startup visa programs. You should have a genuine interest in building a real business, not just obtaining a visa. Our services are most valuable for those who need help refining their business model and creating professional documentation.',
    },
    {
      question: 'How long does the process take?',
      answer:
        'The business development process typically takes 2-4 months depending on your starting point and goals. This includes refining your business model, conducting research, and creating comprehensive documentation. The actual visa application timeline varies by country and program.',
    },
    {
      question: 'What happens after I\'m business-ready?',
      answer:
        'Once your business documentation is complete, you\'ll work with a licensed immigration attorney to handle the legal aspects of your visa application. We can provide ongoing business mentorship as you launch and grow your startup, but all legal immigration matters must be handled by qualified legal professionals.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Build Your Global Startup with Expert Mentorship"
        subtitle="Professional business guidance for founders pursuing startup visa programs worldwide. We develop your business—not your visa application."
        ctaText="Schedule Free Consultation"
        ctaLink="/contact"
      />

      {/* Trust Indicators Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Trusted Business Mentorship for Global Founders
            </h2>
            <p className="text-lg text-primary-dark/80">
              We are mentors and business advisors—<strong>NOT an immigration law firm</strong>.
              Our focus is helping you build a strong, viable business.
            </p>
          </div>

          {/* Stats/Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <div className="text-primary-dark/70">Founders Mentored</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <div className="text-primary-dark/70">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <div className="text-primary-dark/70">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How We Help Founders
            </h2>
            <p className="text-lg text-primary-dark/80">
              Comprehensive business development services to prepare your startup for success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Programs Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Popular Startup Visa Programs
            </h2>
            <p className="text-lg text-primary-dark/80">
              Explore opportunities in top entrepreneurship destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPrograms.map((program, index) => (
              <CountryCard key={index} {...program} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Mentorship Process
            </h2>
            <p className="text-lg text-primary-dark/80">
              A structured approach to building your investment-ready startup
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <StepTimeline steps={processSteps} variant="vertical" />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-primary-dark/80">
              Clear answers to common questions about our services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Build Your Global Startup?"
        description="Schedule a free consultation to discuss your business idea and explore how we can help you achieve your entrepreneurial goals."
        primaryCTA={{
          text: 'Schedule Free Consultation',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'Learn About Our Services',
          link: '/services',
        }}
        variant="gradient"
      />
    </div>
  );
}
