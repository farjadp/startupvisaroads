// /pnp/pei — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-pei';
import { page as fa } from '@/content/fa/pnp-pei';

const route = pnpRoute({ en, fa, name: { fa: 'جزیره‌ی پرنس ادوارد', en: 'Prince Edward Island' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
