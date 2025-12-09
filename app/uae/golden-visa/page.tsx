// ============================================================================
// Page Source: app/uae/golden-visa/page.tsx
// Version: 1.0.0 — UAE Golden Visa for Entrepreneurs Guide
// Purpose: Guide for UAE Golden Visa business requirements
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UAE Golden Visa for Entrepreneurs',
  description: 'Build a business that qualifies for UAE Golden Visa with expert guidance. Business mentorship only—NOT legal services.',
};

export default function UAEGoldenVisaPage() {
  const services = [
    {
      icon: '🎯',
      title: 'Business Setup Strategy',
      description: 'Develop a business model that meets UAE Golden Visa entrepreneur criteria and market requirements.',
      features: ['UAE market analysis', 'Business structure planning', 'Investment strategy', 'Compliance guidance'],
    },
    {
      icon: '📊',
      title: 'Investment Planning',
      description: 'Strategic planning for meeting investment requirements and building sustainable operations.',
      features: ['Investment structuring', 'Financial projections', 'ROI planning', 'Risk assessment'],
    },
    {
      icon: '🌍',
      title: 'Market Entry',
      description: 'Navigate the UAE business landscape and establish strong market presence.',
      features: ['Market research', 'Partnership opportunities', 'Competitive analysis', 'Growth strategy'],
    },
  ];

  return (
    <div>
      <HeroSection
        title="🇦🇪 Build Your Business for UAE Golden Visa"
        subtitle="Expert guidance for entrepreneurs pursuing UAE's prestigious 10-year Golden Visa. Business advisory only—NOT immigration legal services."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">UAE Golden Visa for Entrepreneurs</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            The UAE Golden Visa offers a 10-year renewable residence visa for entrepreneurs who
            establish businesses meeting specific criteria. This program provides long-term stability,
            no sponsor requirement, and the ability to sponsor family members.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold text-primary mb-2">10-Year Visa</h3>
              <p className="text-sm text-primary-dark/80">Long-term renewable residence</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="font-bold text-primary mb-2">Family Sponsorship</h3>
              <p className="text-sm text-primary-dark/80">Include spouse and children</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="font-bold text-primary mb-2">Business Ownership</h3>
              <p className="text-sm text-primary-dark/80">Project or company ownership required</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">How We Help</h2>
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
                <h3 className="text-xl font-bold text-primary mb-2">Important Notice</h3>
                <p className="text-primary-dark/80">
                  <strong>We are NOT a UAE immigration law firm.</strong> We provide business
                  advisory services only. For visa applications and legal matters, work with
                  licensed UAE immigration consultants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Build in the UAE?"
        description="Explore how we can help you develop a business that meets Golden Visa requirements."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
