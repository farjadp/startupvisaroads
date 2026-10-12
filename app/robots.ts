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
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
