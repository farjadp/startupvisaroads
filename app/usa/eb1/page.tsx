// ============================================================================
// Page Source: app/usa/eb1/page.tsx
// Version: 1.0.0 — USA EB-1 Extraordinary Ability Guide
// Purpose: Guide for entrepreneurs pursuing EB-1 classification
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA EB-1 Extraordinary Ability',
  description: 'Build extraordinary credentials in entrepreneurship and business. Business advisory—NOT legal immigration services.',
};

export default function EB1Page() {
  return (
    <div>
      <HeroSection
        title="🇺🇸 EB-1 Extraordinary Ability for Entrepreneurs"
        subtitle="Build world-class entrepreneurial credentials. Business guidance only—NOT legal immigration services."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">EB-1A Extraordinary Ability</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            The EB-1A category is for individuals with extraordinary ability in business,
            demonstrated through sustained national or international acclaim. This is the
            most prestigious employment-based green card category.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-bold text-primary mb-2">Extraordinary Ability</h3>
              <p className="text-sm text-primary-dark/80">Top of your field requirement</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-primary mb-2">Sustained Acclaim</h3>
              <p className="text-sm text-primary-dark/80">Documented achievements required</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-bold text-primary mb-2">Self-Petition</h3>
              <p className="text-sm text-primary-dark/80">No employer needed</p>
            </div>
          </div>

          <div className="mt-12 bg-accent/10 rounded-xl p-8 border-2 border-accent">
            <h3 className="text-xl font-bold text-primary mb-4">Important Legal Notice</h3>
            <p className="text-primary-dark/80">
              <strong>We are NOT a US immigration law firm.</strong> EB-1 cases require
              sophisticated legal work by licensed immigration attorneys. We provide business
              advisory to help you build credentials—NOT legal services.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Explore EB-1 Credential Building"
        description="Discuss building extraordinary achievements in your entrepreneurial journey."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
