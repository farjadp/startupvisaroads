// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-e-2';
import { page as en } from '@/content/en/usa-e-2';

const route = usaRoute({ fa, en, name: { fa: 'E-2', en: 'E-2' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
