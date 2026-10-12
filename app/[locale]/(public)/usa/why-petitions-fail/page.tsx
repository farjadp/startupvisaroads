// US cluster — see components/usa/usaRoute.tsx.
import { usaRoute } from '@/components/usa/usaRoute';
import { page as fa } from '@/content/fa/usa-why-petitions-fail';
import { page as en } from '@/content/en/usa-why-petitions-fail';

const route = usaRoute({ fa, en, name: { fa: 'چرا پرونده‌ها رد می‌شوند', en: 'Why petitions fail' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
