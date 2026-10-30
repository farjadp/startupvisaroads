// /pnp/bc — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-bc';

const route = pnpRoute({ en, name: { fa: 'بریتیش کلمبیا', en: 'British Columbia' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
