// The US cluster's pages, both locales — rendered by components/usa/UsaCluster.
// The paths are the same in both locales except the hub and NIW, which predate
// the cluster.
type Item = { en: string; fa: string; enPath: string; faPath: string; enNote: string; faNote: string };

export const USA_CLUSTER: Item[] = [
  { en: 'US routes for founders', fa: 'مسیرهای آمریکا برای فاندرها', enPath: '/country/usa', faPath: '/usa', enNote: 'Seven routes compared', faNote: 'مقایسه‌ی هفت مسیر' },
  { en: 'O-1A for founders', fa: 'O-1A برای فاندرها', enPath: '/usa/o-1a', faPath: '/usa/o-1a', enNote: 'The eight criteria and how to build three', faNote: 'هشت معیار و ساختن سه‌تا' },
  { en: 'EB-2 NIW', fa: 'EB-2 NIW', enPath: '/usa/eb2-niw', faPath: '/usa-eb2-niw', enNote: 'Green card without an employer', faNote: 'گرین‌کارت بدون کارفرما' },
  { en: 'E-2 treaty investor', fa: 'ویزای E-2', enPath: '/usa/e-2', faPath: '/usa/e-2', enNote: 'No legal minimum — what "substantial" means', faNote: 'حداقل قانونی ندارد؛ «قابل‌توجه» یعنی چه' },
  { en: 'Why good founder petitions fail', fa: 'چرا پرونده‌های خوب رد می‌شوند', enPath: '/usa/why-petitions-fail', faPath: '/usa/why-petitions-fail', enNote: 'Six patterns behind RFEs and denials', faNote: 'شش الگوی پشت RFE و رد' },
  { en: 'O-1A, EB-1A or NIW first?', fa: 'O-1A یا EB-1A یا NIW؟', enPath: '/usa/o-1a-eb-1a-niw', faPath: '/usa/o-1a-eb-1a-niw', enNote: 'The order that fits your profile', faNote: 'ترتیب درست برای پروفایل شما' },
  { en: 'US readiness assessment', fa: 'ارزیابی آمادگی آمریکا', enPath: '/usa/assessment', faPath: '/usa/assessment', enNote: 'Where you stand, in two minutes', faNote: 'جایگاه شما در دو دقیقه' },
  { en: 'Founder readiness programme', fa: 'برنامه‌ی آمادگی پرونده‌ی فاندر', enPath: '/usa/founder-readiness', faPath: '/usa/founder-readiness', enNote: 'What we build before the attorney files', faNote: 'آنچه پیش از وکیل می‌سازیم' },
];
