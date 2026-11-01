// /pnp/bc — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-bc';
import { page as fa } from '@/content/fa/pnp-bc';

const route = pnpRoute({ en, fa, name: { fa: 'بریتیش کلمبیا', en: 'British Columbia' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
