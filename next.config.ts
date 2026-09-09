// ============================================================================
// Config Source: next.config.ts
// Version: 1.0.0 — Next.js Configuration
// Why: Configure Next.js for optimal performance and RTL support
// Features: Strict mode, image optimization, and security headers
// ============================================================================

import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  // Image optimization configuration.
  // Restricted to known hosts to avoid acting as an open image proxy.
  // (Generated/uploaded images are stored as inline base64 data URLs.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fal.media" },
      { protocol: "https", hostname: "*.fal.media" },
      { protocol: "https", hostname: "fal.run" },
      // Object storage (Google Cloud Storage / S3-compatible CDN)
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "*.storage.googleapis.com" },
      // Unsplash for editorial photography (Denmark page, etc.)
      { protocol: "https", hostname: "images.unsplash.com" },
      // YouTube thumbnails for the Persian video cards
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // Two English pages once described the same visa — /country/australia and
  // /australia/entrepreneur-stream were near-duplicates competing for the same
  // query. The country page is now the single Australian guide and the other
  // permanently redirects into it.
  async redirects() {
    return [
      { source: '/australia/entrepreneur-stream', destination: '/en/country/australia', permanent: true },
      { source: '/:locale(en|fa)/australia/entrepreneur-stream', destination: '/:locale/country/australia', permanent: true },
    ];
  },

  // Security and SEO headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
