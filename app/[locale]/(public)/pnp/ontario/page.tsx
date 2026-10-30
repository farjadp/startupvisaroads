// /pnp/ontario — closed Entrepreneur PNP, as a short status page; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-ontario';

const route = pnpRoute({ en, name: { fa: 'انتاریو', en: 'Ontario' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
