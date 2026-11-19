import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCTA from "@/components/ContactCTA";
import PageTracker from "@/components/PageTracker";
import AppBar from "@/components/AppBar";
import { appBarCopy } from "@/content/app-card";
import { ROUTES_V2 } from "@/lib/routes-v2";
import { setRequestLocale } from 'next-intl/server';

export default async function PublicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageTracker />
      <Header />
      <main className="flex-grow pt-24 md:pt-32">
        {children}
      </main>
      <ContactCTA />
      <Footer />
      {/* Phones only, after engagement; never on articles, forms or /app (lib/app-prompt.ts). */}
      <AppBar locale={locale === 'fa' ? 'fa' : 'en'} copy={appBarCopy(locale === 'fa' ? 'fa' : 'en', ROUTES_V2.length)} />
    </>
  );
}
