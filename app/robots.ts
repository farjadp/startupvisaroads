import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 86400;

const DISALLOW = ['/api/', '/en/admin', '/fa/admin', '/admin'];

// Explicitly welcome AI/answer engines (GEO/AEO). A crawler that matches a
// named group ignores the `*` group entirely, so each one repeats DISALLOW.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
];

// ByteDance's crawler feeds its own model training. It sends no visitors to
// a site like this one and has a record of heavy crawling, so it is shut out
// (decided 13 Oct 2026; delete this group to readmit it).
const BLOCKED_AGENTS = ['Bytespider'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
      ...BLOCKED_AGENTS.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
