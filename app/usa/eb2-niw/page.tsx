// ============================================================================
// Page Source: app/usa/eb2-niw/page.tsx
// Version: 1.0.0 — USA EB-2 NIW Guide for Entrepreneurs
// Purpose: Guide for building entrepreneurial credentials for EB-2 NIW
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA EB-2 NIW for Entrepreneurs',
  description: 'Build entrepreneurial credentials for EB-2 National Interest Waiver. Business advisory only—NOT legal immigration services.',
};

export default function EB2NIWPage() {
  const services = [
    {
      icon: '🎯',
      title: 'Business Impact Documentation',
      description: 'Develop and document business activities that demonstrate national interest and substantial merit.',
      features: ['Impact documentation', 'Achievement tracking', 'Publication strategy', 'Recognition building'],
    },
    {
      icon: '📊',
      title: 'Credential Building',
      description: 'Strategic guidance for building the professional credentials and recognition needed for NIW.',
      features: ['Expert positioning', 'Industry engagement', 'Thought leadership', 'Network development'],
    },
    {
      icon: '💡',
      title: 'National Interest Positioning',
      description: 'Frame your entrepreneurial work to demonstrate broader national or economic benefit.',
      features: ['Benefit articulation', 'Economic impact analysis', 'Innovation documentation', 'Case development'],
    },
  ];

  return (
    <div>
      <HeroSection
        title="🇺🇸 Build Your EB-2 NIW Case as an Entrepreneur"
        subtitle="Strategic business guidance for entrepreneurs pursuing EB-2 National Interest Waiver. Business advisory only—NOT legal immigration services."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">EB-2 NIW for Entrepreneurs</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            The EB-2 National Interest Waiver allows entrepreneurs and professionals with
            exceptional ability to self-petition for a green card by demonstrating their work
            benefits the United States. This path doesn't require employer sponsorship.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-bold text-primary mb-2">Advanced Degree or Exceptional Ability</h3>
              <p className="text-sm text-primary-dark/80">Educational or professional requirements</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🇺🇸</div>
              <h3 className="font-bold text-primary mb-2">National Interest</h3>
              <p className="text-sm text-primary-dark/80">Work must benefit the United States</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-bold text-primary mb-2">Self-Petition</h3>
              <p className="text-sm text-primary-dark/80">No employer sponsorship required</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">How We Help</h2>
            <p className="text-lg text-primary-dark/80">
              Business development services to strengthen your NIW case
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-accent/10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 border-2 border-accent">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Critical Legal Notice</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  <strong>We are NOT a US immigration law firm.</strong> EB-2 NIW requires
                  complex legal immigration work that MUST be handled by a licensed US immigration
                  attorney. We provide business advisory services to help you build credentials
                  and document impact—NOT legal immigration services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Build Your NIW Business Case"
        description="Discuss how to strengthen your entrepreneurial credentials for EB-2 NIW consideration."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
