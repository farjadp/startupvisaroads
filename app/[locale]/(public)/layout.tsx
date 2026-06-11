import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
