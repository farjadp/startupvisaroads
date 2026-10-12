// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-founder-readiness';
import { page as en } from '@/content/en/usa-founder-readiness';

const route = usaRoute({ fa, en, name: { fa: 'برنامه‌ی آمادگی', en: 'Readiness programme' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
