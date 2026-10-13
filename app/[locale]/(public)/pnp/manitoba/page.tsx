// /pnp/manitoba — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-manitoba';
import { page as fa } from '@/content/fa/pnp-manitoba';

const route = pnpRoute({ en, fa, name: { fa: 'منیتوبا', en: 'Manitoba' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
