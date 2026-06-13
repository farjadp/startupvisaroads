import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'SVR',
    description: 'Mentorship and startup readiness for Startup Visa and global migration programs.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#F2F0E9',
    theme_color: '#1a1a1a',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
    ],
  };
}
