import type { Metadata } from 'next';
import { metaFor } from '@/lib/pageMeta';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return metaFor('/unsubscribe', locale);
}

export default function UnsubscribeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
