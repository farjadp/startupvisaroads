// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-o-1a-eb-1a-niw';
import { page as en } from '@/content/en/usa-o-1a-eb-1a-niw';

const route = usaRoute({ fa, en, name: { fa: 'O-1A، EB-1A یا NIW', en: 'O-1A, EB-1A or NIW' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
