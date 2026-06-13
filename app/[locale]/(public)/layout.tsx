import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
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
      <Footer />
    </>
  );
}
