// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-assessment';
import { page as en } from '@/content/en/usa-assessment';

const route = usaRoute({ fa, en, name: { fa: 'ارزیابی آمادگی', en: 'Readiness assessment' }, withAssessment: true });
export const generateMetadata = route.generateMetadata;
export default route.Page;
