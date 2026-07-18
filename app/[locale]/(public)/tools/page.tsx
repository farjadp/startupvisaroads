// ============================================================================
// Tools Hub Page
// /app/[locale]/(public)/tools/page.tsx
// ============================================================================

import type { Metadata } from 'next';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { ArrowUpRight, Calculator, MapPin } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'fa';
  return buildMetadata({
    locale,
    path: '/tools',
    title: isRtl ? 'ابزارهای مهاجرتی | راه‌های ویزا' : 'Immigration Tools | Visa Roads',
    description: isRtl
      ? 'ابزارهای ارزیابی شخصی رایگان برای درک مسیرهای مهاجرت به کانادا و دیگر کشورها.'
      : 'Free self-assessment tools to understand your immigration pathways before booking a consultation.',
  });
}

export default async function ToolsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tools' });
  const isRtl = locale === 'fa';

  const tools = [
    {
      id: 'express-entry',
      href: '/tools/express-entry' as const,
      icon: <Calculator size={20} />,
      name: t('express_entry_name'),
      desc: t('express_entry_desc'),
      tag: 'Canada',
      tagColor: 'bg-acid text-ink',
    },
    // Future tools will be added here
  ];

  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <section className="pt-16 pb-12 border-b border-ink/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/40">{isRtl ? 'ابزارها' : 'Tools'}</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-ink mb-4">{t('hub_title')}</h1>
        <p className="font-sans text-lg text-ink/60 max-w-xl">{t('hub_subtitle')}</p>
      </section>

      {/* Tools grid */}
      <section className="py-12">
        <div className="grid gap-px bg-ink/10 border border-ink/10">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col md:flex-row md:items-center gap-4 p-8 bg-paper hover:bg-acid/5 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-ink/40 group-hover:text-ink transition-colors">{tool.icon}</div>
                  <h2 className="font-serif text-2xl text-ink group-hover:underline underline-offset-2">
                    {tool.name}
                  </h2>
                  <span className={`font-mono text-[10px] px-2 py-0.5 uppercase tracking-wider ${tool.tagColor}`}>
                    {tool.tag}
                  </span>
                </div>
                <p className="font-sans text-sm text-ink/60 max-w-2xl">{tool.desc}</p>
              </div>
              <ArrowUpRight size={20} className="text-ink/20 group-hover:text-ink transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
