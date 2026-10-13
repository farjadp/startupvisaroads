// /pnp/nova-scotia — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-nova-scotia';
import { page as fa } from '@/content/fa/pnp-nova-scotia';

const route = pnpRoute({ en, fa, name: { fa: 'نوااسکوشیا', en: 'Nova Scotia' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
