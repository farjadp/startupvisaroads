import React from 'react';
import { notFound } from 'next/navigation';
import SourceDetail from '@/components/admin/SourceDetail';
import { sourceDetail } from '@/lib/knowledge/admin';

export const dynamic = 'force-dynamic';

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = await sourceDetail(id);
  if (!source) return notFound();
  return <SourceDetail source={source} />;
}
