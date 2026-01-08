// ============================================================================
// Page: app/blog/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Journal" (Intelligence & Insights)
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Search, 
  Clock,
  Calendar
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Journal | SVR',
  description: 'Intelligence on global mobility, venture capital, and sovereign strategy.',
};

export default function BlogPage() {
  
  // Mock Data: Featured Article
  const featuredPost = {
    slug: 'the-death-of-golden-visas',
    title: 'The End of Passive Residency: Why "Golden Visas" Are Dying Out',
    excerpt: 'The EU is cracking down on cash-for-passport schemes. The future belongs to active entrepreneurs, not passive investors. Here is how the landscape is shifting in 2025.',
    category: 'Market Intelligence',
    date: 'DEC 08, 2024',
    readTime: '8 MIN',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
  };

  // Mock Data: Standard Articles
  const posts = [
    {
      slug: 'canada-suv-vs-uk-innovator',
      title: 'Canada SUV vs. UK Innovator: A Comparative Audit',
      excerpt: 'Analyzing the capital requirements, settlement timelines, and PR pathways of the two most popular English-speaking startup programs.',
      category: 'Comparative Analysis',
      date: 'NOV 28, 2024',
      readTime: '12 MIN',
    },
    {
      slug: 'financial-modeling-for-immigration',
      title: 'Financial Fiction: Why Your 5-Year Projections Are Getting Rejected',
      excerpt: 'Immigration officers are trained to spot "hockey stick" charts that lack fundamental unit economics. Learn how to model for compliance.',
      category: 'Technical Guide',
      date: 'NOV 15, 2024',
      readTime: '10 MIN',
    },
    {
      slug: 'netherlands-facilitator-guide',
      title: 'The Facilitator Paradox: Navigating the Dutch Startup Ecosystem',
      excerpt: 'How to secure a mentorship agreement with a recognized facilitator when you have no local network in Amsterdam.',
      category: 'Country Deep Dive',
      date: 'NOV 02, 2024',
      readTime: '6 MIN',
    },
    {
      slug: 'eb1a-evidence-strategy',
      title: 'Building the "Einstein" Portfolio: Evidence Strategy for EB-1A',
      excerpt: 'You don\'t need a Nobel Prize. You need a paper trail. How to document your "sustained national acclaim" effectively.',
      category: 'US Immigration',
      date: 'OCT 20, 2024',
      readTime: '15 MIN',
    },
  ];

  const categories = ['All', 'Strategy', 'Capital', 'Policy', 'Case Studies'];

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: THE MASTHEAD
      ========================================= */}
      <section className="pt-32 pb-12 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">SVR Intelligence</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
             <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter">
               THE <br/>
               <span className="pl-[5vw] italic text-[#1a1a1a]/40">JOURNAL.</span>
             </h1>
             
             {/* Filter System */}
             <div className="flex flex-wrap gap-4 mb-4 md:mb-8">
                {categories.map((cat, i) => (
                   <button key={i} className={`font-sans text-xs font-bold uppercase tracking-widest border border-[#1a1a1a] px-4 py-2 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-colors ${i === 0 ? 'bg-[#1a1a1a] text-[#F2F0E9]' : ''}`}>
                      {cat}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. FEATURED ARTICLE (The Lead Story)
      ========================================= */}
      <section className="border-b border-[#1a1a1a] group cursor-pointer">
         <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Side */}
            <div className="relative h-[60vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-[#1a1a1a] overflow-hidden">
               <Image 
                  src={featuredPost.image} 
                  alt="Featured Article"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
               />
               <div className="absolute top-6 left-6">
                  <span className="bg-[#CCFF00] text-[#1a1a1a] px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest">
                     Featured
                  </span>
               </div>
            </div>

            {/* Content Side */}
            <div className="p-12 lg:p-24 flex flex-col justify-center hover:bg-[#fff] transition-colors">
               <div className="flex items-center gap-4 mb-6 font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">
                  <span>{featuredPost.date}</span>
                  <span className="w-1 h-1 bg-[#1a1a1a] rounded-full"></span>
                  <span>{featuredPost.category}</span>
               </div>
               
               <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight group-hover:underline decoration-[#CCFF00] decoration-4 underline-offset-8">
                  {featuredPost.title}
               </h2>
               
               <p className="font-sans text-lg text-[#1a1a1a]/70 leading-relaxed mb-12 max-w-xl">
                  {featuredPost.excerpt}
               </p>

               <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Analysis <ArrowRight size={16} />
               </div>
            </div>

         </div>
      </section>

      {/* =========================================
          3. THE FEED (Grid System)
      ========================================= */}
      <section className="py-0">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post, i) => (
               <Link href={`/blog/${post.slug}`} key={i} className="group border-b border-[#1a1a1a] odd:border-r p-12 hover:bg-[#1a1a1a] hover:text-[#F2F0E9] transition-all duration-300 flex flex-col justify-between min-h-[400px]">
                  
                  <div>
                     <div className="flex justify-between items-start mb-8">
                        <span className="font-sans text-xs font-bold border border-[#1a1a1a] group-hover:border-[#F2F0E9] px-2 py-1 uppercase tracking-widest">
                           {post.category}
                        </span>
                        <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-[#CCFF00]" />
                     </div>
                     
                     <h3 className="font-serif text-3xl md:text-4xl mb-6 leading-tight group-hover:italic transition-all">
                        {post.title}
                     </h3>
                     
                     <p className="font-sans text-sm opacity-60 group-hover:opacity-80 leading-relaxed max-w-md">
                        {post.excerpt}
                     </p>
                  </div>

                  <div className="mt-12 flex items-center gap-6 font-sans text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-[#CCFF00]">
                     <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
                     <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime}</span>
                  </div>

               </Link>
            ))}
         </div>
      </section>

      {/* =========================================
          4. NEWSLETTER (Editorial Box)
      ========================================= */}
      <section className="bg-[#1a1a1a] text-[#F2F0E9] py-32 px-6 text-center border-t border-[#CCFF00]">
         <div className="container mx-auto max-w-2xl">
            <h2 className="font-serif text-5xl mb-6">Briefing.</h2>
            <p className="font-sans text-[#F2F0E9]/60 text-lg mb-12">
               Weekly intelligence for global founders. No fluff. Just strategy.
            </p>
            
            <form className="flex flex-col md:flex-row gap-0 border-b border-[#F2F0E9]/30 focus-within:border-[#CCFF00] transition-colors pb-2">
               <input 
                  type="email" 
                  placeholder="founder@company.com" 
                  className="bg-transparent border-none outline-none text-2xl font-serif placeholder:text-[#F2F0E9]/20 w-full text-center md:text-left"
               />
               <button className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] hover:text-white transition-colors mt-4 md:mt-0 whitespace-nowrap">
                  Subscribe
               </button>
            </form>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-[#F2F0E9]/30">
               Join 12,000+ Subscribers • Unsubscribe anytime
            </p>
         </div>
      </section>

    </div>
  );
}