// ============================================================================
// Page Source: app/contact/page.tsx
// Version: 1.0.0 — Contact & Consultation Booking Page
// Why: Primary conversion point for consultation bookings and inquiries
// Purpose: Make it easy for founders to reach out and schedule consultations
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Sections:
//   1. Hero - Contact value proposition
//   2. Contact Form - Lead capture (UI only, no backend)
//   3. Contact Information - Email, social, etc.
//   4. FAQ - Quick answers
//   5. Office Hours - Availability
// ============================================================================

import React from 'react';
import HeroSection from '@/components/HeroSection';
import FAQAccordion from '@/components/FAQAccordion';
import type { Metadata } from 'next';

/**
 * Contact Page Metadata
 */
export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Schedule a free consultation to discuss your startup idea and explore how we can help. Get in touch with our team for mentorship and business advisory services.',
  openGraph: {
    title: 'Contact Us | Startup Visa Roads',
    description:
      'Schedule your free consultation today. Let\'s discuss how we can help you build an investment-ready startup.',
  },
};

/**
 * Contact Page Component
 *
 * Primary conversion page with contact form and consultation scheduling.
 * Note: Form is UI only - backend integration required for production.
 */
export default function ContactPage() {
  const faqs = [
    {
      question: 'How much does a consultation cost?',
      answer:
        'The initial 30-minute discovery consultation is completely free with no obligation. This allows us to understand your needs and determine if we\'re a good fit.',
    },
    {
      question: 'How quickly can we get started?',
      answer:
        'After your initial consultation, we can typically begin working together within 1-2 weeks, depending on your schedule and our mentor availability.',
    },
    {
      question: 'What should I prepare for the consultation?',
      answer:
        'Come prepared with a brief overview of your business idea, target market, and which startup visa programs you\'re considering. Don\'t worry if things aren\'t fully formed—that\'s what we\'re here to help with!',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Let's Build Your Startup Together"
        subtitle="Schedule a free consultation to discuss your business idea and explore how we can help you achieve your entrepreneurial goals."
        ctaText="Scroll to Form"
        ctaLink="#contact-form"
      />

      {/* Contact Form & Info Section */}
      <section id="contact-form" className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                Schedule Your Free Consultation
              </h2>
              <p className="text-primary-dark/80 mb-8 leading-relaxed">
                Fill out the form below and we'll get back to you within 24 hours to
                schedule your consultation.
              </p>

              {/* Form (UI only - no backend) */}
              <form className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-primary mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Country/Program Interest */}
                <div>
                  <label
                    htmlFor="program"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Which program are you interested in? *
                  </label>
                  <select
                    id="program"
                    name="program"
                    required
                    className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select a program...</option>
                    <option value="canada">Canada Start-Up Visa</option>
                    <option value="denmark">Denmark Start-Up Visa</option>
                    <option value="netherlands">Netherlands Startup Visa</option>
                    <option value="finland">Finland Startup Visa</option>
                    <option value="uae-golden">UAE Golden Visa</option>
                    <option value="usa-eb2">USA EB-2 NIW</option>
                    <option value="usa-eb1">USA EB-1</option>
                    <option value="usa-eb5">USA EB-5</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>

                {/* Business Stage */}
                <div>
                  <label
                    htmlFor="stage"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Current Business Stage *
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    required
                    className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select stage...</option>
                    <option value="idea">Idea Stage</option>
                    <option value="mvp">Building MVP</option>
                    <option value="launched">Launched (Pre-Revenue)</option>
                    <option value="revenue">Generating Revenue</option>
                    <option value="growth">Growth Stage</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-primary mb-2"
                  >
                    Tell us about your business idea *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Briefly describe your business idea, target market, and what you're hoping to achieve..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-accent w-full text-lg"
                >
                  Request Consultation
                </button>

                <p className="text-xs text-primary-dark/60 text-center">
                  We typically respond within 24 hours. Your information is kept confidential.
                </p>
              </form>
            </div>

            {/* Contact Information & Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Other Ways to Reach Us
                </h3>

                {/* Email */}
                <div className="card mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">📧</span>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Email</h4>
                      <a
                        href="mailto:hello@startupvisaroads.com"
                        className="text-accent hover:text-accent-light transition-colors"
                      >
                        hello@startupvisaroads.com
                      </a>
                      <p className="text-sm text-primary-dark/60 mt-1">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="card mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🕐</span>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Office Hours
                      </h4>
                      <p className="text-sm text-primary-dark/80">
                        Monday - Friday: 9:00 AM - 6:00 PM EST
                      </p>
                      <p className="text-sm text-primary-dark/80">
                        Saturday: 10:00 AM - 2:00 PM EST
                      </p>
                      <p className="text-sm text-primary-dark/80">
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="card">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">🌐</span>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">
                        Connect With Us
                      </h4>
                      <div className="flex gap-3">
                        <a
                          href="https://linkedin.com"
                          className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                        <a
                          href="https://twitter.com"
                          className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-6">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <span>⚠️</span>
                  Important Notice
                </h4>
                <p className="text-sm text-primary-dark/80 leading-relaxed">
                  We are NOT an immigration law firm. For legal immigration advice,
                  please consult a licensed immigration attorney. We provide business
                  mentorship and advisory services only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Quick Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>
    </div>
  );
}
