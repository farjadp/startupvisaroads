// ============================================================================
// Layout: Modernist Editorial
// Style: High Fashion, Asymmetric, Raw
// ============================================================================
import type { Metadata } from "next";
// تغییر: ایمپورت کردن DM Serif Display به جای Bodoni
import { DM_Serif_Display, Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// تغییر: استفاده از DM Serif Display
// این فونت بولد، قدرتمند و کلاسیک است اما حس "تحریری" ندارد.
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400", // این فونت تک‌وزن است که برای تیترها عالی است
  display: "swap",
  variable: "--font-serif", // نام متغیر را ساده‌تر کردیم
});

// همان فونت قبلی برای متن‌ها (عالی است، نگهش دارید)
const space = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "S V R | The Curated Path",
  description: "Global mobility for the exceptional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // تغییر: اعمال متغیر فونت جدید
    <html lang="en" className={`${dmSerif.variable} ${space.variable}`}>
      <body className="bg-[#F2F0E9] text-[#1a1a1a] min-h-screen flex flex-col antialiased selection:bg-[#CCFF00] selection:text-black font-sans">
        {/* Fixed Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        <Header />
        <main className="flex-grow pt-24 md:pt-32">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}