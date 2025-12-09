// ============================================================================
// Page Source: app/europe/denmark/page.tsx
// Version: 1.0.0 — Denmark Start-Up Visa Program Guide
// Why: Guide for building businesses for Denmark's startup visa program
// Purpose: Inform founders about Danish program and provide mentorship pathway
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import StepTimeline from '@/components/StepTimeline';
import ServiceCard from '@/components/ServiceCard';
import FAQAccordion from '@/components/FAQAccordion';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Denmark Start-Up Visa',
  description:
    'Build an innovative startup for Denmark\'s Start-Up Visa program. Expert mentorship for business development and expert panel requirements. We are NOT an immigration law firm.',
};

export default function DenmarkStartupPage() {
  const services = [
    {
      icon: '🎯',
      title: 'Innovation-Focused Business Model',
      description:
        'Develop an innovative, scalable business model that meets Denmark\'s expert panel criteria.',
      features: [
        'Innovation assessment',
        'Scalability planning',
        'Nordic market research',
        'Business model refinement',
      ],
    },
    {
      icon: '📊',
      title: 'Expert Panel Application',
      description:
        'Prepare comprehensive documentation for the expert panel evaluation process.',
      features: [
        'Business plan development',
        'Innovation documentation',
        'Financial projections',
        'Market analysis',
      ],
    },
    {
      icon: '🌍',
      title: 'Nordic Market Entry',
      description:
        'Strategic guidance for entering and succeeding in the Danish and Nordic markets.',
      features: [
        'Market entry strategy',
        'Competitive landscape',
        'Partnership opportunities',
        'Local market insights',
      ],
    },
  ];

  const faqs = [
    {
      question: 'What is Denmark\'s Start-Up Visa program?',
      answer:
        'Denmark\'s Start-Up Denmark program allows non-EU entrepreneurs to establish innovative startups in Denmark. The program requires approval from an expert panel that evaluates the innovation potential and scalability of your business idea.',
    },
    {
      question: 'What does the expert panel evaluate?',
      answer:
        'The expert panel assesses your business idea based on innovation, scalability, financing plan, and potential for growth in Denmark. They look for truly innovative concepts that can create jobs and contribute to the Danish economy.',
    },
    {
      question: 'How long is the residence permit valid?',
      answer:
        'The initial residence permit is granted for 2 years with the possibility of extension. You must demonstrate progress in building your business and meeting your stated goals.',
    },
    {
      question: 'Can you help with the immigration process?',
      answer:
        'No. We are NOT an immigration law firm. We help you develop a strong business case for the expert panel. For visa applications and legal immigration matters, you must work with a licensed immigration attorney.',
    },
  ];

  return (
    <div>
      <HeroSection
        title="Launch Your Innovative Startup in Denmark"
        subtitle="Expert mentorship for building startups that meet Denmark's innovation criteria. Business guidance only—we are NOT immigration attorneys."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              🇩🇰 Start-Up Denmark Program
            </h2>
            <p className="text-lg text-primary-dark/80 leading-relaxed mb-8">
              Denmark offers a startup-friendly environment with strong support for innovation,
              access to Nordic markets, and high quality of life. The program requires expert
              panel approval and focuses on truly innovative business concepts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-bold text-primary mb-2">Innovation Focus</h3>
                <p className="text-sm text-primary-dark/80">
                  Must demonstrate genuine innovation and scalability
                </p>
              </div>
              <div className="card text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold text-primary mb-2">Expert Panel Review</h3>
                <p className="text-sm text-primary-dark/80">
                  Business evaluated by industry experts
                </p>
              </div>
              <div className="card text-center">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-bold text-primary mb-2">Nordic Access</h3>
                <p className="text-sm text-primary-dark/80">
                  Gateway to Nordic and EU markets
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              How We Help
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Build in Denmark?"
        description="Schedule a consultation to discuss your innovative business idea."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
