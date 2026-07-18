// ============================================================================
// Express Entry Pathway Diagnostic — Page
// /app/[locale]/(public)/tools/express-entry/page.tsx
// ============================================================================

import type { Metadata } from 'next';
import { getTranslations, getMessages } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import DiagnosticTool from '@/components/express-entry/DiagnosticTool';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'fa';
  return buildMetadata({
    locale,
    path: '/tools/express-entry',
    title: isRtl
      ? 'تشخیص مسیر Express Entry | ابزارهای مهاجرتی'
      : 'Express Entry Pathway Diagnostic | Immigration Tools',
    description: isRtl
      ? 'امتیاز CRS خود را تخمین بزنید، واجد شرایط بودن برای دوره‌های دسته‌ای ۲۰۲۶ را بررسی کنید و بهترین مسیرهای مهاجرتی خود را بیابید.'
      : 'Estimate your CRS score, check your 2026 category draw eligibility, and get ranked pathway recommendations tailored to your profile.',
  });
}

export default async function ExpressEntryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ExpressEntry' });
  const messages = await getMessages({ locale });

  // Flatten the ExpressEntry namespace for the client component
  const eeMessages = (messages as Record<string, Record<string, string>>)['ExpressEntry'] ?? {};
  const isRtl = locale === 'fa';

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Page header */}
      <section className="pt-16 pb-12 border-b border-ink/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/40">
            {isRtl ? 'ابزارها / کانادا' : 'Tools / Canada'}
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">{t('page_title')}</h1>
        <p className="font-sans text-lg text-ink/60 max-w-xl">{t('page_subtitle')}</p>
      </section>

      {/* Tool */}
      <section className="py-12 max-w-3xl">
        <DiagnosticTool locale={locale} messages={eeMessages} />
      </section>
    </div>
  );
}
