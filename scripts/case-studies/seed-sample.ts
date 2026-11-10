// ============================================================================
// scripts/case-studies/seed-sample.ts
// DEV ONLY. Seeds clearly fake case studies so the public and admin screens
// can be seen before a real decision is published. Every row is `sample: true`
// (public queries hide samples in production), every title starts "SAMPLE —",
// and every citation is the impossible year 2099 so no invented holding is
// ever attributed to a real decision.
//
//   npx tsx scripts/case-studies/seed-sample.ts
// ============================================================================
import { PrismaClient } from '@prisma/client';

try {
  process.loadEnvFile('.env');
} catch {
  // no .env file; rely on the environment
}

const url = process.env.DATABASE_URL ?? '';
if (process.env.NODE_ENV === 'production' || !url.startsWith('file:')) {
  console.error('seed-sample: refusing to run. Needs NODE_ENV != production and a SQLite DATABASE_URL (file:...).');
  process.exit(1);
}

const prisma = new PrismaClient();
const OFFICIAL = 'https://decisions.fct-cf.gc.ca/';
const COURT = 'Federal Court';

type Claim = { id: string; kind: string; text: string; paras: number[]; quote: string; verified: boolean };
const claim = (id: string, kind: string, text: string, paras: number[], quote: string, verified = true): Claim => ({
  id, kind, text, paras, quote, verified,
});

const SVU_EN: Claim[] = [
  claim('c1', 'fact', 'SAMPLE. The applicant held a letter of support from a designated business incubator.', [3], 'Sample quoted sentence one.'),
  claim('c2', 'fact', 'SAMPLE. The officer refused the permanent residence application after a peer review.', [5], 'Sample quoted sentence two.'),
  claim('c3', 'issue', 'SAMPLE. Was the refusal reasonable, given the reasons the officer wrote?', [9], 'Sample quoted sentence three.'),
  claim('c4', 'standard', 'SAMPLE. The Court reviewed the decision on the reasonableness standard.', [10], 'Sample quoted sentence four.'),
  claim('c5', 'holding', 'SAMPLE. The Court allowed the judicial review and sent the file back to a different officer.', [24], 'Sample quoted sentence five.'),
  claim('c6', 'error_found', 'SAMPLE. The reasons did not engage with the business plan the applicant filed.', [17, 18], 'Sample quoted sentence six.'),
  claim('c7', 'lesson', 'SAMPLE. Make sure the business plan answers each concern raised in a procedural fairness letter.', [17], 'Sample quoted sentence six.'),
];

const SVU_FA: Claim[] = [
  claim('c1', 'fact', 'نمونه. متقاضی نامه حمایت از یک انکوباتور تجاری تعیین‌شده داشت.', [3], 'جمله نقل‌قول نمونه یک.'),
  claim('c2', 'fact', 'نمونه. افسر پس از بازبینی همتا، درخواست اقامت دائم را رد کرد.', [5], 'جمله نقل‌قول نمونه دو.'),
  claim('c3', 'issue', 'نمونه. آیا با توجه به دلایل نوشته‌شده، رد درخواست معقول بود؟', [9], 'جمله نقل‌قول نمونه سه.'),
  claim('c4', 'standard', 'نمونه. دادگاه تصمیم را با معیار معقول بودن بررسی کرد.', [10], 'جمله نقل‌قول نمونه چهار.'),
  claim('c5', 'holding', 'نمونه. دادگاه بازبینی قضایی را پذیرفت و پرونده را به افسر دیگری برگرداند.', [24], 'جمله نقل‌قول نمونه پنج.'),
  claim('c6', 'error_found', 'نمونه. دلایل افسر به طرح کسب‌وکاری که متقاضی داده بود نپرداخته بود.', [17, 18], 'جمله نقل‌قول نمونه شش.'),
  claim('c7', 'lesson', 'نمونه. طرح کسب‌وکار باید به تک‌تک نگرانی‌های نامه انصاف رویه‌ای پاسخ دهد.', [17], 'جمله نقل‌قول نمونه شش.'),
];

const STUDY_EN: Claim[] = [
  claim('c1', 'fact', 'SAMPLE. The officer refused a study permit, doubting the applicant would leave at the end of the stay.', [4], 'Sample quoted sentence one.'),
  claim('c2', 'issue', 'SAMPLE. Was the refusal reasonable?', [8], 'Sample quoted sentence two.'),
  claim('c3', 'standard', 'SAMPLE. The Court applied the reasonableness standard.', [9], 'Sample quoted sentence three.'),
  claim('c4', 'holding', 'SAMPLE. The Court dismissed the judicial review; the refusal stands.', [21], 'Sample quoted sentence four.'),
  claim('c5', 'no_error', 'SAMPLE. The officer’s reasons were brief but explained why the study plan was not convincing.', [15], 'Sample quoted sentence five.'),
  claim('c6', 'lesson', 'SAMPLE. A study plan should explain why this programme fits the applicant’s past studies.', [15], 'Sample quoted sentence five.'),
];

const C11_EN: Claim[] = [
  claim('c1', 'fact', 'SAMPLE. The applicant asked for a C11 work permit to run a business in Canada.', [3], 'Sample quoted sentence one.', false),
  claim('c2', 'holding', 'SAMPLE. The Court allowed the judicial review.', [19], 'Sample quoted sentence two.', false),
  claim('c3', 'error_found', 'SAMPLE. The officer did not explain why the business would bring no significant benefit.', [14], 'Sample quoted sentence three.'),
];

const lessons = (ids: string[]) => JSON.stringify(ids.map((id) => ({ claimId: id })));

type Row = {
  groupKey: string; locale: 'en' | 'fa'; slug: string; status: string; title: string; excerpt: string;
  keyTakeaway: string; citation: string; decisionDate: Date; route: string; outcome: 'allowed' | 'dismissed';
  claims: Claim[]; faq: { question: string; answer: string }[];
};

const now = new Date();
const ROWS: Row[] = [
  {
    groupKey: 'sample-2099-fc-1', locale: 'en', slug: 'start-up-visa-2099-fc-1', status: 'PUBLISHED',
    title: 'SAMPLE — Start-up visa refusal sent back for a fresh decision',
    excerpt: 'Sample data for layout review. Not a real decision.',
    keyTakeaway: 'SAMPLE. The Court sent the file back because the reasons ignored the business plan.',
    citation: '2099 FC 1', decisionDate: new Date('2099-01-15T00:00:00Z'), route: 'start-up-visa', outcome: 'allowed',
    claims: SVU_EN,
    faq: [{ question: 'SAMPLE. Did the Court grant the visa?', answer: 'SAMPLE. No. It sent the file back to a different officer.' }],
  },
  {
    groupKey: 'sample-2099-fc-1', locale: 'fa', slug: 'start-up-visa-2099-fc-1', status: 'PUBLISHED',
    title: 'SAMPLE — نمونه: ریجکتی استارتاپ ویزا برای تصمیم تازه برگشت',
    excerpt: 'داده نمونه برای بررسی صفحه. رأی واقعی نیست.',
    keyTakeaway: 'نمونه. دادگاه پرونده را برگرداند چون دلایل افسر به طرح کسب‌وکار نپرداخته بود.',
    citation: '2099 FC 1', decisionDate: new Date('2099-01-15T00:00:00Z'), route: 'start-up-visa', outcome: 'allowed',
    claims: SVU_FA,
    faq: [{ question: 'نمونه. آیا دادگاه ویزا را صادر کرد؟', answer: 'نمونه. نه. پرونده را به افسر دیگری برگرداند.' }],
  },
  {
    groupKey: 'sample-2099-fc-2', locale: 'en', slug: 'study-permit-2099-fc-2', status: 'PUBLISHED',
    title: 'SAMPLE — Study permit refusal upheld on judicial review',
    excerpt: 'Sample data for layout review. Not a real decision.',
    keyTakeaway: 'SAMPLE. Brief reasons were enough here; the refusal stands.',
    citation: '2099 FC 2', decisionDate: new Date('2099-02-10T00:00:00Z'), route: 'study-permit', outcome: 'dismissed',
    claims: STUDY_EN, faq: [],
  },
  {
    groupKey: 'sample-2099-fc-3', locale: 'en', slug: 'work-permit-c11-2099-fc-3', status: 'IN_REVIEW',
    title: 'SAMPLE — C11 work permit refusal sent back',
    excerpt: 'Sample data for the admin review screen. Not a real decision.',
    keyTakeaway: 'SAMPLE. Two claims are still unchecked.',
    citation: '2099 FC 3', decisionDate: new Date('2099-03-05T00:00:00Z'), route: 'work-permit-c11', outcome: 'allowed',
    claims: C11_EN, faq: [],
  },
];

async function main() {
  for (const r of ROWS) {
    const published = r.status === 'PUBLISHED';
    const data = {
      groupKey: r.groupKey,
      type: 'FC_DECISION',
      status: r.status,
      title: r.title,
      excerpt: r.excerpt,
      content: '<p>SAMPLE</p>',
      keyTakeaway: r.keyTakeaway,
      court: COURT,
      citation: r.citation,
      decisionDate: r.decisionDate,
      route: r.route,
      country: 'canada',
      outcome: r.outcome,
      officialUrl: OFFICIAL,
      claims: JSON.stringify(r.claims),
      lessons: lessons(r.claims.filter((c) => c.kind === 'lesson').map((c) => c.id)),
      faq: JSON.stringify(r.faq),
      sample: true,
      aiModel: 'sample',
      approvedBy: published ? 'sample-seed' : null,
      approvedAt: published ? now : null,
      publishedAt: published ? now : null,
      withdrawnAt: null,
    };
    await prisma.caseStudy.upsert({
      where: { locale_slug: { locale: r.locale, slug: r.slug } },
      create: { locale: r.locale, slug: r.slug, ...data },
      update: data,
    });
    console.log(`seeded ${r.locale}/${r.slug} (${r.status})`);
  }
}

main()
  .catch((e) => {
    console.error('seed-sample failed', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
