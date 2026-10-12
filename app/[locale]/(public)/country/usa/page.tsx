// ============================================================================
// Page: /en/country/usa — hub of the US cluster (content/en/usa.ts), paired
// with /fa/usa. Replaced the 2025 bespoke "National Interest" page on
// 2026-10-12. See components/usa/usaRoute.tsx.
// ============================================================================
import { usaRoute } from '@/components/usa/usaRoute';
import { page as en } from '@/content/en/usa';

const route = usaRoute({ en, name: { fa: 'آمریکا', en: 'United States' } });
export const generateMetadata = route.generateMetadata;
export default route.Page;
