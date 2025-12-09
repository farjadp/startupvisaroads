// ============================================================================
// Page Source: app/europe/netherlands/page.tsx
// Version: 1.0.0 — Netherlands Startup Visa Guide
// Purpose: Guide for Dutch startup visa program
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Netherlands Startup Visa',
  description: 'Build an innovative business for the Dutch Startup Visa with expert mentorship. Business guidance only—NOT legal services.',
};

export default function NetherlandsPage() {
  return (
    <div>
      <HeroSection
        title="🇳🇱 Launch Your Startup in the Netherlands"
        subtitle="Expert business guidance for the Dutch Startup Visa. Develop an innovative business with facilitator support."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">Program Overview</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            The Netherlands Startup Visa allows non-EU entrepreneurs to establish innovative
            startups in the Netherlands. The program requires partnership with an experienced
            facilitator who mentors and supports your business development.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-primary mb-2">Innovation Required</h3>
              <p className="text-sm text-primary-dark/80">Must be innovative product or service</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-bold text-primary mb-2">Facilitator Needed</h3>
              <p className="text-sm text-primary-dark/80">Must work with approved facilitator</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-bold text-primary mb-2">1-Year Permit</h3>
              <p className="text-sm text-primary-dark/80">Initial permit for 12 months</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Build in the Netherlands?"
        description="Let's discuss your innovative business idea and Dutch market entry strategy."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
