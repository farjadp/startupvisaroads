// /pnp/new-brunswick — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-new-brunswick';
import { page as fa } from '@/content/fa/pnp-new-brunswick';

const route = pnpRoute({ en, fa, name: { fa: 'نیوبرانزویک', en: 'New Brunswick' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
