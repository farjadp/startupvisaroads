// ============================================================================
// Layout: Modernist Editorial
// Style: High Fashion, Asymmetric, Raw
// ============================================================================

import type { Metadata } from "next";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google"; 
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Headings: Bodoni Moda (High contrast, luxury, editorial)
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
});

// Body: Space Grotesk (Tech but quirky, "human" feel)
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
    <html lang="en" className={`${bodoni.variable} ${space.variable}`}>
      <body className="bg-[#F2F0E9] text-[#1a1a1a] min-h-screen flex flex-col antialiased selection:bg-[#CCFF00] selection:text-black">
        {/* Fixed Grain Overlay for "Paper" feel */}
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