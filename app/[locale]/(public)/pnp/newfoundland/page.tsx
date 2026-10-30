// /pnp/newfoundland — Entrepreneur PNP guide; see components/pnp/pnpRoute.tsx.
import { pnpRoute } from '@/components/pnp/pnpRoute';
import { page as en } from '@/content/en/pnp-newfoundland';

const route = pnpRoute({ en, name: { fa: 'نیوفاندلند و لابرادور', en: 'Newfoundland and Labrador' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
