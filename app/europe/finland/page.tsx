// ============================================================================
// Page Source: app/europe/finland/page.tsx
// Version: 1.0.0 — Finland Startup Visa Guide
// Purpose: Guide for Finnish startup permit
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finland Startup Permit',
  description: 'Build an innovative startup for Finland with expert business mentorship. NOT an immigration law firm.',
};

export default function FinlandPage() {
  return (
    <div>
      <HeroSection
        title="🇫🇮 Build Your Startup in Finland"
        subtitle="Expert business guidance for Finland's startup ecosystem. Develop a growth-focused business in Northern Europe."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">Finland Startup Permit</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            Finland offers opportunities for innovative entrepreneurs through its startup ecosystem.
            The program focuses on growth potential, innovation, and contribution to the Finnish economy.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-2">💡</div>
              <h3 className="font-bold text-primary mb-2">Innovation-Driven</h3>
              <p className="text-sm text-primary-dark/80">Focus on growth and innovation</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🌲</div>
              <h3 className="font-bold text-primary mb-2">Quality of Life</h3>
              <p className="text-sm text-primary-dark/80">High living standards and education</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🇪🇺</div>
              <h3 className="font-bold text-primary mb-2">EU Access</h3>
              <p className="text-sm text-primary-dark/80">Gateway to European markets</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Explore Finnish Opportunities"
        description="Discuss your business idea and Finnish market potential with our team."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
