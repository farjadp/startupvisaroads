import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/startupworkpermit', locale);
}

export default function SegmentLayout({ children }: { children: ReactNode }) {
  return children;
}
