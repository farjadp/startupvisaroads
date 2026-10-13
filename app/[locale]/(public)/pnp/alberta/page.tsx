// /pnp/alberta — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-alberta';
import { page as fa } from '@/content/fa/pnp-alberta';

const route = pnpRoute({ en, fa, name: { fa: 'آلبرتا', en: 'Alberta' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
