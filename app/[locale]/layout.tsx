// ============================================================================
// Layout: Modernist Editorial
// Style: High Fashion, Asymmetric, Raw
// src/app/[locale]/layout.tsx
// ============================================================================
import type { Metadata } from "next";
import { DM_Serif_Display, Space_Grotesk, Vazirmatn } from "next/font/google";
import "../globals.css";

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

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

export const metadata: Metadata = {
  title: "Visa Roads | The Curated Path | Startup Visa | PNP",
  description: "Global mobility for the exceptional.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

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
        <NextIntlClientProvider messages={messages}>
          {/* Fixed Grain Overlay */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}