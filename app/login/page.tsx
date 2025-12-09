// ============================================================================
// Page Source: app/login/page.tsx
// Version: 1.0.0 — Login Page (UI Only)
// Why: Placeholder for future client portal or dashboard access
// Purpose: UI template for authentication (no backend logic)
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Note: This is UI only - backend authentication needs to be implemented
// ============================================================================

import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Login Page Metadata
 */
export const metadata: Metadata = {
  title: 'Login',
  description: 'Access your Startup Visa Roads client portal.',
};

/**
 * Login Page Component
 *
 * UI-only login form for future client portal.
 * Backend authentication must be implemented separately.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-32">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="card">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🚀</div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Client Portal
              </h1>
              <p className="text-primary-dark/60 text-sm">
                Access your mentorship dashboard
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-primary-dark/70">
                  <input
                    type="checkbox"
                    className="rounded border-primary/20 text-accent focus:ring-accent"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-accent w-full text-lg"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-primary-dark/60">
                  New to Startup Visa Roads?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                href="/contact"
                className="btn-outline w-full"
              >
                Schedule Free Consultation
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-primary-dark/60 mt-6">
            Having trouble logging in?{' '}
            <Link href="/contact" className="text-accent hover:text-accent-light">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
