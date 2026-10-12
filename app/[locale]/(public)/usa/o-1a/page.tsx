// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-o-1a';
import { page as en } from '@/content/en/usa-o-1a';

const route = usaRoute({ fa, en, name: { fa: 'O-1A', en: 'O-1A' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
