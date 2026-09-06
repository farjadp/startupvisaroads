// ============================================================================
// Page: Home
// Style: Typography-driven, Editorial, "Less is More"
// src/app/[locale]/page.tsx
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { Link } from '@/navigation';
import Image from 'next/image';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import prisma from '@/lib/prisma';
import FaHome from '@/components/fa/FaHome';
import { home as faHome } from '@/content/fa/home';
import { faImageUrl } from '@/lib/fa/content';

// The journal strip below reads the database. Without this the page is
// prerendered once at build time — where Prisma cannot reach the DB — and the
// empty result is served for a year (s-maxage=31536000). Five minutes is well
// inside the autopilot's publishing cadence.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'fa';
  return buildMetadata({
    locale,
    path: '/',
    title: isRtl ? faHome.meta.title : 'Startup Visa Mentorship for Founding Teams',
    image: isRtl ? faImageUrl('home') : undefined,
    description: isRtl
      ? faHome.meta.description
      : 'We mentor startup teams through startup visa and entrepreneur immigration routes in Denmark, the Netherlands, Finland and Canada: business plan, financial model, pitch deck and interview practice. Not immigration lawyers — we build the business case the evaluating body reads.',
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: 'Hero' });
   
   // Fetch latest 3 published articles
   let latestArticles: any[] = [];
   try {
      latestArticles = await prisma.article.findMany({
         where: { status: 'PUBLISHED', locale },
         orderBy: { createdAt: 'desc' },
         take: 3,
         include: { category: true }
      });
   } catch (error) {
      console.warn("Could not fetch latest articles. If this is a build step, this is expected:", error);
   }

   // /fa is its own site, not a translation of this page.
   if (locale === 'fa') {
      return <FaHome articles={latestArticles} />;
   }

   return (
      <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9]">

         {/* =========================================
          1. HERO: Big & Bold (No Images)
      ========================================= */}
         <section className="min-h-[80vh] flex flex-col justify-between pb-12">

            {/* Top Meta Data */}
            <div className="flex justify-between items-start border-t border-[#1a1a1a] pt-4">
               {/* dangerouslySetInnerHTML used for <br/> tags in translation */}
               <span className="font-sans text-xs uppercase tracking-widest">{t('est')}</span>
               <span
                  className="font-sans text-xs uppercase tracking-widest text-end hidden md:block"
                  dangerouslySetInnerHTML={{ __html: t.raw('locations') }}
               />
            </div>

            {/* Massive Headline */}
            <div className="mt-20">
               <h1 className="font-serif text-[15vw] leading-[0.8] tracking-tighter mix-blend-difference text-[#1a1a1a]">
                  {t('title_first')}<br />
                  <span className="ms-[15vw] italic font-light text-[#1a1a1a]/60">{t('title_second')}</span>
               </h1>
            </div>

            {/* Bottom Hero Interactions */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-10 mt-12">
               <div className="max-w-md">
                  <p className="font-sans text-lg md:text-xl leading-relaxed">
                     {t('subtitle')}
                  </p>
               </div>

               <Link href="/book-meeting" className="group flex items-center gap-4 bg-[#1a1a1a] text-[#F2F0E9] px-8 py-6 rounded-none hover:bg-[#CCFF00] hover:text-black transition-colors duration-300">
                  <span className="font-sans font-bold uppercase tracking-wider">{t('cta')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2 transition-transform" />
               </Link>
            </div>
         </section>


         {/* =========================================
          2. THE TICKER (Minimal)
      ========================================= */}
         <div className="border-y border-[#1a1a1a] py-6 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap flex gap-24">
               {["Strategy", "Legal", "Capital", "Mobility", "Growth"].map((item, i) => (
                  <span key={i} className="font-serif text-4xl md:text-6xl italic text-[#1a1a1a]/20">
                     {item}
                  </span>
               ))}
               {["Strategy", "Legal", "Capital", "Mobility", "Growth"].map((item, i) => (
                  <span key={`dup-${i}`} className="font-serif text-4xl md:text-6xl italic text-[#1a1a1a]/20">
                     {item}
                  </span>
               ))}
            </div>
         </div>


         {/* =========================================
          3. DESTINATIONS GRID (New Visual Section)
      ========================================= */}
         <section className="py-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <h2 className="font-serif text-5xl md:text-7xl">
                  Startup visa <br/> <span className="italic text-[#1a1a1a]/40">routes.</span>
               </h2>
               <p className="font-sans text-[#1a1a1a]/60 max-w-sm text-right mb-4 hidden md:block">
                  The four routes we prepare startup teams for. Each one is judged by its own body — and each judges a different thing.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { name: "Denmark", program: "Start-up Denmark", img: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=2070&auto=format&fit=crop", href: "/country/denmark" },
                  { name: "Netherlands", program: "Startup Visa", img: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=2070&auto=format&fit=crop", href: "/europe/netherlands" },
                  { name: "Finland", program: "Startup Permit", img: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=2070&auto=format&fit=crop", href: "/country/finland" },
                  { name: "Canada", program: "Entrepreneur PNP", img: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=2118&auto=format&fit=crop", href: "/pnp" }
               ].map((dst, i) => (
                  <Link href={dst.href as any} key={i} className="group relative h-[500px] overflow-hidden bg-[#1a1a1a] cursor-pointer block border border-[#1a1a1a]/10 hover:shadow-2xl transition-shadow">
                     <Image 
                        src={dst.img}
                        alt={dst.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                     <div className="absolute bottom-8 left-8 text-[#F2F0E9] transform group-hover:-translate-y-2 transition-transform duration-500">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-2 block">{dst.program}</span>
                        <h3 className="font-serif text-4xl">{dst.name}</h3>
                     </div>
                     <div className="absolute top-8 right-8 bg-[#CCFF00] text-[#1a1a1a] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <ArrowUpRight className="w-6 h-6" />
                     </div>
                  </Link>
               ))}
            </div>
         </section>

         {/* =========================================
          4. EDITORIAL CONTENT (Grid)
      ========================================= */}
         <section className="py-24 border-t border-[#1a1a1a]/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

               {/* Sidebar / Sticky Title */}
               <div className="lg:col-span-4">
                  <div className="sticky top-12">
                     <h2 className="font-serif text-5xl mb-6">The <br /> Methodology</h2>
                     <div className="w-12 h-1 bg-[#CCFF00] mb-6"></div>
                     <p className="font-sans text-sm text-[#1a1a1a]/60 max-w-xs">
                        Our approach is clinical, not administrative. We diagnose your business model's compatibility with global markets before we draft a single document.
                     </p>
                  </div>
               </div>

               {/* Content List */}
               <div className="lg:col-span-8 space-y-20">

                  {/* Item 01 */}
                  <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                     <div className="flex justify-between items-baseline mb-4">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">01</span>
                        <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                     </div>
                     <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Audit & Strategy</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                        A ruthless evaluation of your startup's scalability. We identify the weak points in your IP strategy and financial projections before the immigration officer does.
                     </p>
                  </div>

                  {/* Item 02 */}
                  <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                     <div className="flex justify-between items-baseline mb-4">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">02</span>
                        <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                     </div>
                     <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Endorsement</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                        Securing the "Letter of Support". We leverage our deep relationships with Incubators and Angel Networks in Canada and the UK to get your foot in the door.
                     </p>
                  </div>

                  {/* Item 03 */}
                  <div className="group border-b border-[#1a1a1a]/20 pb-12 cursor-pointer">
                     <div className="flex justify-between items-baseline mb-4">
                        <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1">03</span>
                        <ArrowDownRight className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
                     </div>
                     <h3 className="font-serif text-4xl md:text-6xl mb-4 group-hover:italic transition-all">Deployment</h3>
                     <p className="font-sans text-lg text-[#1a1a1a]/70 max-w-xl">
                        Landing is just the beginning. We handle incorporation, banking setup, and initial hiring to ensure you hit the ground running.
                     </p>
                  </div>

               </div>
            </div>
         </section>


         {/* =========================================
          4. THE PROGRAMME (What eight weeks produces)
      ========================================= */}
         <section className="py-24 bg-[#1a1a1a] text-[#F2F0E9] -mx-4 md:-mx-8 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-[1400px] mx-auto">
               {[
                  { value: "01", label: "Choose the route", desc: "Your team, product and resources against what each authority actually rewards." },
                  { value: "02", label: "Document the business", desc: "Business plan and financial model to the standard the evaluating body reads." },
                  { value: "03", label: "Build the pitch", desc: "Ten slides that work in ten minutes, rehearsed until it is second nature." },
                  { value: "04", label: "Rehearse the interview", desc: "The evaluation panel's real questions, in English, with blunt feedback." }
               ].map((stat, i) => (
                  <div key={i} className="group border-l border-[#CCFF00]/20 pl-6 hover:border-[#CCFF00] transition-colors duration-500">
                     <h3 className="font-serif text-5xl md:text-6xl text-[#CCFF00] mb-4 group-hover:scale-105 origin-left transition-transform duration-500">
                        {stat.value}
                     </h3>
                     <h4 className="font-sans text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</h4>
                     <p className="font-sans text-xs text-[#F2F0E9]/60 leading-relaxed max-w-[200px]">{stat.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* =========================================
          5. IMAGE / STATEMENT SECTION
      ========================================= */}
         <section className="py-20">
            <div className="relative w-full h-[60vh] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
               {/* This would ideally be a high-grain Black & White photo of architecture */}
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125"></div>

               <div className="relative z-10 text-center p-8 border border-[#CCFF00]/50 backdrop-blur-sm max-w-3xl">
                  <p className="font-serif text-3xl md:text-5xl text-[#F2F0E9] leading-tight italic">
                     "In a world of closed borders, <br />
                     <span className="text-[#CCFF00] not-italic">audacity</span> is the only visa you need."
                  </p>
               </div>
            </div>
         </section>



         {/* =========================================
          6. THE FOUNDER & FAQ
      ========================================= */}
         <section className="py-32 border-t border-[#1a1a1a]/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

               {/* Left: Founder Note */}
               <div>
                  <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6 inline-block">THE PARTNER</span>
                  <h3 className="font-serif text-4xl mb-8 leading-tight">
                     "Immigration is not paperwork. It is <span className="italic border-b-2 border-[#CCFF00]">architecture</span>."
                  </h3>
                  <div className="font-sans text-lg text-[#1a1a1a]/70 space-y-6 leading-relaxed">
                     <p>
                        Most agencies treat you like a case number. We treat you like a unicorn.
                        The global market is ruthless, and you need a strategy that covers IP, tax residency, and capital structure.
                     </p>
                     <p>
                        I built SVR to be the firm I wish I had when I was scaling my first company.
                     </p>
                  </div>

                  <div className="mt-12 flex items-center gap-6">
                     {/* Placeholder for Signature or Photo */}
                     <div className="w-16 h-16 bg-[#1a1a1a] rounded-full grayscale overflow-hidden">
                        {/* <Image src="/founder.jpg" ... /> */}
                     </div>
                     <div>
                        <p className="font-serif text-xl font-bold">Kaveh R.</p>
                        <p className="font-sans text-xs uppercase tracking-widest text-[#1a1a1a]/50">Managing Partner</p>
                     </div>
                  </div>
               </div>

               {/* Right: Minimal FAQ */}
               <div className="space-y-0">
                  <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6 inline-block">QUERIES</span>

                  {[
                     { q: "What is the minimum capital required?", a: "It varies by jurisdiction. For Canada/UK, usually between $50k to $150k in available liquid assets." },
                     { q: "Do you guarantee success?", a: "No one ethically can. However, we audit your case before applying. If we take you on, it's because we see a 95%+ probability." },
                     { q: "Can I bring my co-founders?", a: "Yes. Most programs allow up to 5 co-founders and their families on a single startup application." },
                     { q: "How long is the process?", a: "Expect 12-18 months for Permanent Residency tracks. Work permits can be issued in as little as 3 months." }
                  ].map((item, i) => (
                     <div key={i} className="border-b border-[#1a1a1a]/20 py-8 group">
                        <details className="cursor-pointer">
                           <summary className="list-none flex justify-between items-center font-serif text-2xl hover:text-[#555] transition-colors">
                              {item.q}
                              <span className="font-sans text-sm text-[#CCFF00] bg-black px-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                           </summary>
                           <p className="mt-4 font-sans text-[#1a1a1a]/60 leading-relaxed max-w-md">
                              {item.a}
                           </p>
                        </details>
                     </div>
                  ))}
               </div>

            </div>
         </section>



         {/* =========================================
          7. INSIGHTS & JOURNAL
      ========================================= */}
         {latestArticles.length > 0 && (
         <section className="py-24 border-t border-[#1a1a1a]/10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <div>
                  <span className="font-sans text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6 inline-block">THE JOURNAL</span>
                  <h2 className="font-serif text-5xl">Market <span className="italic text-[#1a1a1a]/40">Insights.</span></h2>
               </div>
               <Link href="/blog" className="hidden md:flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">
                  View All Articles <ArrowRight size={16} />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {latestArticles.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group block cursor-pointer">
                     <div className="relative aspect-[4/3] overflow-hidden mb-6 border border-[#1a1a1a]/10">
                        {post.coverImage ? (
                           <Image 
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                           />
                        ) : (
                           <div className="w-full h-full bg-[#1a1a1a]/5 flex items-center justify-center font-serif text-[#1a1a1a]/20 text-4xl">SVR.</div>
                        )}
                     </div>
                     <div className="flex items-center gap-4 mb-4">
                        {post.category && (
                           <span className="font-sans text-[10px] font-bold text-[#1a1a1a] border border-[#1a1a1a] px-2 py-1 uppercase tracking-widest">{post.category.name}</span>
                        )}
                        <span className="font-sans text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
                           {new Date(post.createdAt).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                     </div>
                     <h3 className="font-serif text-2xl leading-snug group-hover:text-[#CCFF00] transition-colors">{post.title}</h3>
                  </Link>
               ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
               <Link href="/blog" className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest border-b border-[#1a1a1a] pb-1">
                  View All Articles <ArrowRight size={16} />
               </Link>
            </div>
         </section>
         )}

         {/* =========================================
          8. FOOTER CTA (Minimal)
      ========================================= */}
         <section className="py-32 flex flex-col items-center justify-center text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] mb-6 text-[#1a1a1a]/50">Accepting New Applications</p>
            <Link href="/book-meeting" className="relative group">
               <h2 className="font-serif text-6xl md:text-9xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#555] transition-all cursor-pointer text-[#1a1a1a]">
                  GET IN TOUCH
               </h2>
               <div className="h-2 w-0 bg-[#CCFF00] group-hover:w-full transition-all duration-500 ease-out mt-4"></div>
            </Link>
         </section>

      </div>
   );
}