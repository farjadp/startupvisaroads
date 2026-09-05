// ============================================================================
// Page: /contact — server wrapper that branches by locale. The English page
// is the original client component (ContactEn.tsx); /fa/contact is its own
// composition with the four Persian channels. Metadata for en stays in
// contact/layout.tsx via metaFor; fa overrides it here.
// ============================================================================
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import ContactEn from './ContactEn';
import FaContact from '@/components/fa/FaContact';
import { contact } from '@/content/fa/contact';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== 'fa') return {};
  return buildMetadata({ locale, path: contact.meta.path, title: contact.meta.title, description: contact.meta.description });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return locale === 'fa' ? <FaContact /> : <ContactEn />;
}
