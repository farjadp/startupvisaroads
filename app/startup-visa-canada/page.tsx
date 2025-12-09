// ============================================================================
// Page Source: app/startup-visa-canada/page.tsx
// Version: 1.0.0 — Canada Start-Up Visa Program Guide
// Why: Comprehensive guide to building a business for Canada's SUV program
// Purpose: Inform founders about requirements and provide mentorship pathway
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Program overview
//   2. Program Requirements - Key eligibility criteria
//   3. Designated Organizations - Types and requirements
//   4. How We Help - Our specific services for SUV
//   5. Process Timeline - Step-by-step breakdown
//   6. Success Factors - What makes applications strong
//   7. FAQ - Canada SUV specific questions
//   8. CTA - Schedule consultation
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import StepTimeline from '@/components/StepTimeline';
import ServiceCard from '@/components/ServiceCard';
import FAQAccordion from '@/components/FAQAccordion';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

/**
 * Canada SUV Page Metadata
 */
export const metadata: Metadata = {
  title: 'Canada Start-Up Visa Program',
  description:
    'Build an investment-ready startup for Canada\'s Start-Up Visa program. Expert mentorship for business development, designated organization applications, and business readiness. We are NOT an immigration law firm.',
  openGraph: {
    title: 'Canada Start-Up Visa Program | Startup Visa Roads',
    description:
      'Professional mentorship to prepare your business for Canada\'s Start-Up Visa program and designated organization requirements.',
  },
};

/**
 * Canada Start-Up Visa Page Component
 *
 * Comprehensive guide to Canada's SUV program with focus on business preparation.
 * Clearly establishes our role as business mentors, NOT immigration attorneys.
 */
export default function CanadaSUVPage() {
  const services = [
    {
      icon: '🎯',
      title: 'Business Model for Canadian Market',
      description:
        'Develop a business model that appeals to Canadian designated organizations and demonstrates market viability.',
      features: [
        'Canadian market analysis',
        'Competitive landscape research',
        'Revenue model optimization',
        'Scalability planning',
      ],
    },
    {
      icon: '📊',
      title: 'Designated Org Application Prep',
      description:
        'Prepare compelling business documentation for designated organization applications (incubators, angel groups, VC funds).',
      features: [
        'Business plan development',
        'Pitch deck creation',
        'Financial projections',
        'Application materials review',
      ],
    },
    {
      icon: '🤝',
      title: 'Letter of Support Strategy',
      description:
        'Strategic guidance on selecting and approaching designated organizations for letters of support.',
      features: [
        'Organization matching',
        'Application strategy',
        'Pitch preparation',
        'Follow-up guidance',
      ],
    },
  ];

  const processSteps = [
    {
      title: 'Business Assessment & Planning',
      description:
        'Evaluate your business idea for SUV suitability and create a roadmap for designated organization applications.',
      details: [
        'Assess business model viability',
        'Identify target designated organizations',
        'Create application timeline',
        'Set milestone goals',
      ],
    },
    {
      title: 'Market Research & Validation',
      description:
        'Conduct thorough Canadian market research to strengthen your business case.',
      details: [
        'Canadian market size analysis',
        'Competitor research',
        'Customer validation',
        'Market entry strategy',
      ],
    },
    {
      title: 'Documentation Development',
      description:
        'Create professional business plans, financial models, and pitch materials.',
      details: [
        'Comprehensive business plan',
        '5-year financial projections',
        'Investor-ready pitch deck',
        'Executive summary',
      ],
    },
    {
      title: 'Designated Org Application',
      description:
        'Apply to designated organizations for letter of support (you work directly with organizations).',
      details: [
        'Submit applications',
        'Present to review panels',
        'Respond to questions',
        'Secure letter of support',
      ],
    },
    {
      title: 'Legal Immigration Process',
      description:
        'Work with immigration attorney for visa application (we provide ongoing business mentorship).',
      details: [
        'Engage licensed immigration attorney',
        'Submit visa application',
        'Provide additional documentation',
        'Receive visa decision',
      ],
    },
  ];

  const faqs = [
    {
      question: 'What is Canada\'s Start-Up Visa program?',
      answer:
        'The Start-Up Visa (SUV) program allows foreign entrepreneurs to immigrate to Canada if they have a business supported by a designated Canadian organization (venture capital fund, angel investor group, or business incubator). The program requires a letter of support from a designated organization and leads to permanent residence.',
    },
    {
      question: 'What are designated organizations?',
      answer:
        'Designated organizations are Canadian venture capital funds, angel investor groups, and business incubators approved by the Canadian government to participate in the SUV program. They evaluate business proposals and provide letters of support for qualifying startups. There are specific investment requirements: $200,000 CAD from a VC fund or $75,000 CAD from an angel group.',
    },
    {
      question: 'Can you help me get a letter of support?',
      answer:
        'We help you prepare a strong business case that appeals to designated organizations. This includes market research, business planning, financial modeling, and pitch development. However, you apply directly to designated organizations—we cannot guarantee letters of support, as those decisions rest entirely with the organizations.',
    },
    {
      question: 'Do you handle the visa application?',
      answer:
        'No. We are NOT an immigration law firm. Once you secure a letter of support from a designated organization, you must work with a licensed Canadian immigration attorney to handle your visa application. We provide ongoing business mentorship while your attorney handles all legal immigration matters.',
    },
    {
      question: 'What makes a strong SUV application?',
      answer:
        'Strong applications demonstrate: 1) a scalable, innovative business model, 2) clear Canadian market opportunity, 3) experienced founding team, 4) realistic financial projections, 5) competitive advantage, and 6) commitment to building in Canada. We help you develop all these elements.',
    },
    {
      question: 'How long does the SUV process take?',
      answer:
        'Timelines vary significantly. Business preparation typically takes 2-4 months. Designated organization application review can take 1-6 months depending on the organization. The immigration process after securing a letter of support typically takes 12-18 months, though this varies and is handled by your immigration attorney.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Build Your Startup for Canada's Start-Up Visa"
        subtitle="Expert mentorship to develop an investment-ready business that meets designated organization requirements. Business guidance only—we are NOT immigration attorneys."
        ctaText="Schedule SUV Consultation"
        ctaLink="/contact"
      />

      {/* Program Overview */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                🇨🇦 Canada Start-Up Visa Program
              </h2>
              <p className="text-lg text-primary-dark/80 leading-relaxed">
                A pathway to permanent residence for innovative entrepreneurs supported by Canadian designated organizations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold text-primary mb-2">Permanent Residence</h3>
                <p className="text-sm text-primary-dark/80">
                  Direct pathway to Canadian PR for you and your family
                </p>
              </div>
              <div className="card text-center">
                <div className="text-3xl mb-2">💼</div>
                <h3 className="font-bold text-primary mb-2">No Net Worth Requirement</h3>
                <p className="text-sm text-primary-dark/80">
                  No minimum personal net worth required
                </p>
              </div>
              <div className="card text-center">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-bold text-primary mb-2">Support Required</h3>
                <p className="text-sm text-primary-dark/80">
                  Letter of support from designated organization needed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              How We Prepare You for Success
            </h2>
            <p className="text-lg text-primary-dark/80">
              Business development services tailored for Canada's Start-Up Visa program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              The SUV Journey
            </h2>
            <p className="text-lg text-primary-dark/80">
              From business concept to permanent residence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <StepTimeline steps={processSteps} variant="vertical" />
          </div>
        </div>
      </section>

      {/* Key Requirements */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Key Requirements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-3">
                  For Business Support
                </h3>
                <ul className="space-y-2 text-sm text-primary-dark/80">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>$200,000 CAD investment from designated VC fund, OR</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>$75,000 CAD investment from designated angel group, OR</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>Acceptance into designated business incubator program</span>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-primary mb-3">
                  For Visa Eligibility
                </h3>
                <ul className="space-y-2 text-sm text-primary-dark/80">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>Letter of support from designated organization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>Language proficiency (CLB 5 minimum)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>Sufficient settlement funds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">▸</span>
                    <span>Medical and security clearance</span>
                  </li>
                </ul>
              </div>
            </div>
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
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="section bg-accent/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 border-2 border-accent">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Important Legal Notice
                </h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  <strong>Startup Visa Roads is NOT a Canadian immigration law firm</strong> and
                  does NOT provide immigration legal services. We provide business mentorship and
                  advisory services to help you prepare a strong business case. For legal immigration
                  advice and visa applications, you must work with a licensed Canadian immigration
                  attorney or RCIC (Regulated Canadian Immigration Consultant).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Build Your Canadian Startup?"
        description="Schedule a consultation to discuss your business idea and explore how we can help you prepare for Canada's Start-Up Visa program."
        primaryCTA={{
          text: 'Schedule Free Consultation',
          link: '/contact',
        }}
        secondaryCTA={{
          text: 'View All Programs',
          link: '/',
        }}
        variant="gradient"
      />
    </div>
  );
}
