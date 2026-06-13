// ============================================================================
// Layout: Modernist Editorial
// Style: High Fashion, Asymmetric, Raw
// src/app/[locale]/layout.tsx
// ============================================================================
import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk, Vazirmatn } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, buildAlternates, ogLocale, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

// English Fonts
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-serif",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

// Persian Font
const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazir",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'fa';
  const title = isRtl
    ? 'راه‌های ویزای استارتاپ | مهاجرت کارآفرینی و استارتاپ ویزا'
    : 'Startup Visa Roads | Startup Visa & Global Mobility Mentorship';
  const description = isRtl
    ? 'مشاوره و آماده‌سازی برای ویزای استارتاپ کانادا، PNP، EB-1/EB-2 NIW/EB-5 آمریکا و برنامه‌های کارآفرینی اروپا و استرالیا.'
    : 'Mentorship and startup readiness for the Canada Startup Visa, Provincial Nominee Programs, US EB-1/EB-2 NIW/EB-5, and European & Australian entrepreneur pathways.';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    alternates: buildAlternates('/', locale),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      url: `${SITE_URL}/${locale}`,
      title,
      description,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Validate locale (optional if handled by middleware, but good as fallback)
  if (!['en', 'fa'].includes(locale)) {
    // In a real scenario, middleware catches this, but for types/safety:
    // This file acts as the [locale] layout, so it should receive a valid locale.
  }

  const messages = await getMessages();
  const isRtl = locale === 'fa';

  // Choose fonts based on locale
  // For 'fa', we primarily want Vazir. For 'en', the serif and sans.
  // We'll inject all variables but apply the main font class on body.
  const fontVariables = `${dmSerif.variable} ${space.variable} ${vazir.variable}`;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={fontVariables}>
      <body className={`bg-[#F2F0E9] text-[#1a1a1a] min-h-screen flex flex-col antialiased selection:bg-[#CCFF00] selection:text-black ${isRtl ? 'font-vazir' : 'font-sans'}`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <NextIntlClientProvider messages={messages}>
          {/* Fixed Grain Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}