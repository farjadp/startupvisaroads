import React from 'react';
import CaseReview from '../_components/CaseReview';

export const dynamic = 'force-dynamic';

// Protected by middleware.ts like every /[locale]/admin page; the data comes from
// GET /api/admin/case-studies/[id] on the client.
export default async function CaseStudyReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseReview id={id} />;
}
