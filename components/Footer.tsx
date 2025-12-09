// ============================================================================
// Component Source: components/Footer.tsx
// Version: 1.0.0 — Main Site Footer
// Why: Consistent site-wide footer with links, contact info, and disclaimers
// Usage: All pages via root layout
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Features:
//   - Contact information
//   - Quick links navigation
//   - Social media links
//   - Legal disclaimers
//   - Newsletter signup (placeholder)
// ============================================================================

import React from 'react';
import Link from 'next/link';

/**
 * Footer Component
 *
 * Comprehensive site footer providing navigation, contact information,
 * and critical legal disclaimers. Reinforces brand identity and trust.
 *
 * Footer Sections:
 * - Brand and mission statement
 * - Quick links (services, programs, company)
 * - Contact information
 * - Social media links
 * - Legal disclaimers
 * - Copyright notice
 *
 * Critical Disclaimers:
 * - NOT an immigration law firm
 * - NOT offering legal services
 * - Mentorship and business advisory only
 * - No visa guarantees
 *
 * Design Philosophy:
 * - Clean, organized layout
 * - Easy-to-scan sections
 * - Clear hierarchy
 * - Brand-consistent styling
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🚀</span>
              <h3 className="text-xl font-bold">Startup Visa Roads</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Professional mentorship and business readiness guidance for
              founders pursuing startup visa programs worldwide.
            </p>
            <p className="text-secondary font-semibold text-sm">
              Building Global Startups
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-secondary">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="/mentorship"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Mentorship Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Visa Programs */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-secondary">
              Visa Programs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/startup-visa-canada"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Canada Startup Visa
                </Link>
              </li>
              <li>
                <Link
                  href="/europe/denmark"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Denmark Startup Visa
                </Link>
              </li>
              <li>
                <Link
                  href="/europe/netherlands"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  Netherlands Startup Visa
                </Link>
              </li>
              <li>
                <Link
                  href="/uae/golden-visa"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  UAE Golden Visa
                </Link>
              </li>
              <li>
                <Link
                  href="/usa/eb2-niw"
                  className="text-white/80 hover:text-secondary transition-colors duration-300 text-sm"
                >
                  USA EB-2 NIW
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-secondary">
              Get In Touch
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-white/80">
                <span>📧</span>
                <a
                  href="mailto:hello@startupvisaroads.com"
                  className="hover:text-secondary transition-colors duration-300"
                >
                  hello@startupvisaroads.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/80">
                <span>💬</span>
                <span>Live chat available 9AM-6PM EST</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer Section */}
      <div className="border-t border-white/20">
        <div className="container-custom py-6">
          <div className="bg-accent/20 rounded-lg p-4 mb-6">
            <h5 className="font-bold text-secondary mb-2 flex items-center gap-2">
              <span>⚠️</span>
              Important Disclaimer
            </h5>
            <p className="text-sm text-white/90 leading-relaxed">
              <strong>Startup Visa Roads is NOT an immigration law firm and does NOT provide immigration legal services.</strong>
              {' '}We are a mentorship and business advisory service helping founders build
              investment-ready startups. We do not process visa applications, provide
              legal advice, or guarantee visa approvals. For legal immigration matters,
              please consult a licensed immigration attorney.
            </p>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>
              © {currentYear} Startup Visa Roads. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-secondary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-secondary transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
