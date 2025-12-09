// ============================================================================
// Page Source: app/usa/eb5/page.tsx
// Version: 1.0.0 — USA EB-5 Immigrant Investor Program Guide
// Purpose: Guide for EB-5 investment-based immigration
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93)
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'USA EB-5 Investor Program',
  description: 'Business planning for EB-5 immigrant investor program. Business advisory—NOT legal immigration services.',
};

export default function EB5Page() {
  return (
    <div>
      <HeroSection
        title="🇺🇸 EB-5 Immigrant Investor Program"
        subtitle="Business planning and investment strategy for EB-5. Business advisory only—NOT legal immigration services."
        ctaText="Schedule Consultation"
        ctaLink="/contact"
      />

      <section className="section bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary mb-6">EB-5 Immigrant Investor Program</h2>
          <p className="text-lg text-primary-dark/80 mb-6">
            The EB-5 program provides a path to US permanent residence through job-creating
            investments. Investors must invest capital in a new commercial enterprise that
            creates at least 10 full-time jobs for US workers.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-primary mb-2">Investment Required</h3>
              <p className="text-sm text-primary-dark/80">$800K-$1.05M minimum investment</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-bold text-primary mb-2">Job Creation</h3>
              <p className="text-sm text-primary-dark/80">10 full-time jobs required</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="font-bold text-primary mb-2">New Enterprise</h3>
              <p className="text-sm text-primary-dark/80">Must be new commercial venture</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">Direct Investment</h3>
              <p className="text-sm text-primary-dark/80 mb-3">
                Invest directly in your own business project, maintaining control and
                managing day-to-day operations.
              </p>
              <ul className="space-y-2 text-sm text-primary-dark/70">
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Full business control</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Direct job creation responsibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Hands-on management required</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-primary mb-3">Regional Center</h3>
              <p className="text-sm text-primary-dark/80 mb-3">
                Invest through USCIS-designated regional centers that pool investor funds
                for larger development projects.
              </p>
              <ul className="space-y-2 text-sm text-primary-dark/70">
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Passive investment option</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Indirect job creation allowed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">▸</span>
                  <span>Limited management involvement</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-accent/10 rounded-xl p-8 border-2 border-accent">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Critical Legal Notice</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  <strong>We are NOT a US immigration law firm.</strong> EB-5 is a complex
                  immigration program requiring specialized legal counsel from licensed
                  immigration attorneys. We provide business planning and advisory services
                  only—NOT legal immigration services. You must work with qualified EB-5
                  attorneys and potentially securities attorneys for compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-background">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">How We Can Help</h2>
          <p className="text-lg text-primary-dark/80 mb-8">
            For direct EB-5 investments, we can assist with:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-bold text-primary mb-2">Business Planning</h3>
              <p className="text-sm text-primary-dark/80">
                Develop comprehensive business plans for EB-5 compliant ventures
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-primary mb-2">Job Creation Planning</h3>
              <p className="text-sm text-primary-dark/80">
                Structure operations to meet job creation requirements
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-primary mb-2">Financial Modeling</h3>
              <p className="text-sm text-primary-dark/80">
                Create detailed financial projections and investment use plans
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Explore EB-5 Business Planning"
        description="Discuss your EB-5 investment goals and business planning needs."
        primaryCTA={{ text: 'Schedule Consultation', link: '/contact' }}
        variant="gradient"
      />
    </div>
  );
}
