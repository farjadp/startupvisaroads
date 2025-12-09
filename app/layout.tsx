// ============================================================================
// Layout Source: app/layout.tsx
// Version: 1.0.0 — Root Application Layout
// Why: Main layout wrapper for all pages with global configuration
// Usage: Wraps all pages in the application
// Colors: Primary(#1c3b6e), Secondary(#f2b95e), Accent(#a81f93), Bg(#e7e8ec)
// Features:
//   - Global metadata and SEO configuration
//   - Header and Footer components
//   - Global styles and fonts
//   - Analytics and tracking (when implemented)
// ============================================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Configure Inter font with Latin subset
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Root Metadata Configuration
 *
 * SEO and AEO optimized metadata for the entire application.
 * Individual pages can override these defaults with their own metadata.
 *
 * SEO Best Practices:
 * - Clear, descriptive title and description
 * - Relevant keywords for startup visa mentorship
 * - Open Graph tags for social sharing
 * - Twitter Card support
 * - Favicon and app icons
 */
export const metadata: Metadata = {
  // Primary metadata
  title: {
    default: "Startup Visa Roads | Global Startup Mentorship & Business Readiness",
    template: "%s | Startup Visa Roads",
  },
  description:
    "Professional mentorship and business readiness for founders pursuing startup visa programs in Canada, Europe, UAE, and USA. We guide startups to investment readiness—we are NOT an immigration law firm.",
  keywords: [
    "startup visa mentorship",
    "business readiness",
    "startup visa canada",
    "entrepreneur visa europe",
    "startup advisory",
    "founder mentorship",
    "business plan development",
    "investment readiness",
    "global entrepreneurship",
  ],

  // Author and creator
  authors: [{ name: "Startup Visa Roads Team" }],
  creator: "Startup Visa Roads",
  publisher: "Startup Visa Roads",

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://startupvisaroads.com",
    siteName: "Startup Visa Roads",
    title: "Startup Visa Roads | Global Startup Mentorship",
    description:
      "Professional mentorship for founders pursuing startup visa programs worldwide. Business readiness guidance, NOT immigration legal services.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Startup Visa Roads - Global Startup Mentorship",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Startup Visa Roads | Global Startup Mentorship",
    description:
      "Professional mentorship for startup visa programs. Business readiness guidance, NOT legal services.",
    images: ["/og-image.jpg"],
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification tags (add your verification codes when available)
  verification: {
    google: "google-verification-code",
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code",
  },
};

/**
 * RootLayout Component
 *
 * The root layout component that wraps all pages in the application.
 * Provides consistent structure with header, main content area, and footer.
 *
 * Layout Structure:
 * - HTML with language attribute
 * - Font configuration
 * - Global styles
 * - Header (sticky navigation)
 * - Main content area (children)
 * - Footer
 *
 * Accessibility:
 * - Proper document structure
 * - Semantic HTML
 * - Skip to content link
 * - ARIA landmarks
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-accent text-white px-4 py-2 rounded-lg font-semibold"
        >
          Skip to main content
        </a>

        {/* Site Header */}
        <Header />

        {/* Main Content Area */}
        <main id="main-content" className="flex-grow pt-20">
          {children}
        </main>

        {/* Site Footer */}
        <Footer />
      </body>
    </html>
  );
}
