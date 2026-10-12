// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa';

const route = usaRoute({ fa, name: { fa: 'آمریکا', en: 'United States' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
