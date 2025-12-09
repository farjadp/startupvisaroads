// ============================================================================
// Component Source: components/Header.tsx
// Version: 1.0.0 — Main Site Header with Navigation
// Why: Consistent site-wide navigation with brand identity and CTA
// Usage: All pages via root layout
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Features:
//   - Sticky navigation
//   - Mobile responsive menu
//   - Brand logo/name
//   - Main navigation links
//   - Prominent CTA button
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Header Component
 *
 * Main site navigation header with sticky positioning and mobile-responsive
 * design. Provides clear navigation structure and prominent CTA.
 *
 * Navigation Structure:
 * - Home
 * - Services
 * - Programs (dropdown/mega menu)
 * - Mentorship
 * - About
 * - Blog
 * - Contact (CTA)
 *
 * Design Features:
 * - Sticky header that stays visible on scroll
 * - Mobile hamburger menu
 * - Active page highlighting
 * - Smooth transitions
 * - Brand-aligned styling
 *
 * Accessibility:
 * - Semantic HTML navigation
 * - ARIA labels for mobile menu
 * - Keyboard navigation support
 * - Focus indicators
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position for header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Navigation links configuration
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/mentorship', label: 'Mentorship' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
  ];

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                Startup Visa Roads
              </h1>
              <p className="text-xs text-primary-dark/60">
                Mentorship & Business Readiness
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-300 link-hover pb-1 ${
                  isActive(link.href)
                    ? 'text-accent'
                    : 'text-primary hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link href="/contact" className="btn-accent">
              Schedule Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-primary hover:text-accent transition-colors duration-300"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary/10 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium py-2 transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-accent'
                      : 'text-primary hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile CTA */}
              <Link
                href="/contact"
                className="btn-accent text-center mt-2"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
