// ============================================================================
// Page: app/blog/[slug]/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Feature Story"
// ============================================================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Share2, 
  Bookmark,
  User
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Intelligence | ${params.slug}`,
    description: 'Deep dive analysis for global founders.',
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  
  // Mock Data (In production, fetch via params.slug)
  const post = {
    title: 'The Death of "Passive" Residency: Why the EU is Closing Golden Visa Routes',
    subtitle: 'As Portugal and Spain tighten restrictions, the era of buying residency is ending. The future belongs to active founders.',
    category: 'Market Intelligence',
    date: 'DEC 08, 2024',
    readTime: '8 MIN READ',
    author: 'Kaveh Rezaei',
    authorRole: 'Managing Partner',
    content: [
      {
        type: 'intro',
        text: "For the last decade, the global mobility playbook was simple: Buy real estate, get a passport. It was transactional, passive, and for many, strictly a financial hedge. That era is officially over."
      },
      {
        type: 'heading',
        text: "The Shift to Meritocracy"
      },
      {
        type: 'paragraph',
        text: "The European Commission has long pressured member states to close loopholes that allowed wealthy individuals to bypass integration requirements. The result is a pivot toward 'Active Entrepreneurship'. Programs like the Netherlands Startup Visa and Finland's Fast Track are not looking for your capital—they are looking for your brain."
      },
      {
        type: 'quote',
        text: "Immigration is no longer a transaction. It is an audition. You are pitching your value to the state."
      },
      {
        type: 'heading',
        text: "Why Business Plans are the New Bank Statements"
      },
      {
        type: 'paragraph',
        text: "In the Golden Visa era, your bank statement was your most important document. In the Startup Visa era, it is your Business Plan. Officers are trained to look for scalability, innovation, and economic benefit. A generic SME model will be rejected instantly."
      },
      {
        type: 'paragraph',
        text: "Founders must now demonstrate a clear 'Go-to-Market' strategy that justifies their presence in the target country. Why Amsterdam? Why Helsinki? If your business could theoretically run from a laptop in Bali, you do not need a European visa in their eyes."
      }
    ]
  };

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HEADER & META STRIP
      ========================================= */}
      <section className="pt-32 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto max-w-5xl">
          
          {/* Breadcrumb */}
          <div className="mb-8">
             <Link href="/blog" className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest hover:text-[#CCFF00] hover:bg-[#1a1a1a] px-2 py-1 transition-colors -ml-2">
                <ArrowLeft size={12} /> Back to Journal
             </Link>
          </div>

          {/* Title Block */}
          <div className="mb-12">
             <span className="font-sans text-xs font-bold text-[#CCFF00] bg-[#1a1a1a] px-2 py-1 mb-6 inline-block uppercase tracking-widest">
                {post.category}
             </span>
             <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
                {post.title}
             </h1>
             <p className="font-serif text-xl md:text-2xl text-[#1a1a1a]/60 leading-relaxed max-w-3xl">
                {post.subtitle}
             </p>
          </div>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-[#1a1a1a]/20 py-6 font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-[#1a1a1a]">
                   <User size={16} />
                   <span>{post.author}</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                   <Calendar size={16} />
                   <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Clock size={16} />
                   <span>{post.readTime}</span>
                </div>
             </div>
             <div className="flex gap-4">
                <button className="hover:text-[#1a1a1a] transition-colors"><Share2 size={18} /></button>
                <button className="hover:text-[#1a1a1a] transition-colors"><Bookmark size={18} /></button>
             </div>
          </div>

        </div>
      </section>

      {/* =========================================
          2. CONTENT LAYOUT
      ========================================= */}
      <section className="py-20 px-6">
         <div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT: Sidebar / Context (Sticky) */}
            <div className="hidden lg:block lg:col-span-3">
               <div className="sticky top-32 space-y-12">
                  <div>
                     <span className="block font-sans text-[10px] uppercase tracking-widest opacity-40 mb-4">Author</span>
                     <div className="w-12 h-12 bg-[#1a1a1a] mb-4 overflow-hidden grayscale">
                        {/* Placeholder for Author Image */}
                        <Image 
                           src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop" 
                           alt={post.author} 
                           width={100} 
                           height={100} 
                           className="object-cover"
                        />
                     </div>
                     <p className="font-serif text-lg leading-none mb-1">{post.author}</p>
                     <p className="font-sans text-[10px] uppercase tracking-widest opacity-50">{post.authorRole}</p>
                  </div>
                  
                  <div>
                     <span className="block font-sans text-[10px] uppercase tracking-widest opacity-40 mb-4">In this dossier</span>
                     <ul className="space-y-4 font-serif text-sm opacity-60">
                        <li className="hover:text-[#1a1a1a] hover:underline decoration-[#CCFF00] cursor-pointer">The Shift to Meritocracy</li>
                        <li className="hover:text-[#1a1a1a] hover:underline decoration-[#CCFF00] cursor-pointer">Business Plans as Assets</li>
                        <li className="hover:text-[#1a1a1a] hover:underline decoration-[#CCFF00] cursor-pointer">Strategy for 2025</li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* RIGHT: Main Content */}
            <div className="lg:col-span-8 lg:col-start-5">
               <article className="space-y-8">
                  
                  {/* First Letter Drop Cap Styling */}
                  <div className="first-letter:float-left first-letter:text-7xl first-letter:font-serif first-letter:pr-4 first-letter:leading-[0.8]">
                     {post.content.map((block, index) => {
                        if (block.type === 'intro') {
                           return <p key={index} className="font-serif text-xl md:text-2xl leading-relaxed mb-8">{block.text}</p>
                        }
                        if (block.type === 'heading') {
                           return <h2 key={index} className="font-serif text-3xl md:text-4xl mt-16 mb-6">{block.text}</h2>
                        }
                        if (block.type === 'paragraph') {
                           return <p key={index} className="font-serif text-lg leading-loose text-[#1a1a1a]/80 mb-6">{block.text}</p>
                        }
                        if (block.type === 'quote') {
                           return (
                              <blockquote key={index} className="border-l-4 border-[#CCFF00] pl-6 my-12">
                                 <p className="font-serif text-2xl md:text-3xl italic leading-tight text-[#1a1a1a]">
                                    "{block.text}"
                                 </p>
                              </blockquote>
                           )
                        }
                     })}
                  </div>

                  <div className="mt-16 p-8 bg-[#1a1a1a] text-[#F2F0E9]">
                     <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-4">Executive Summary</h3>
                     <p className="font-sans text-sm leading-relaxed opacity-80">
                        Stop treating immigration as a passive investment. To secure EU residency in 2025, you must build a verifiable business case. SVR can audit your eligibility before you apply.
                     </p>
                  </div>

               </article>
            </div>

         </div>
      </section>

      {/* =========================================
          3. NEXT READ (Footer Nav)
      ========================================= */}
      <section className="border-t border-[#1a1a1a]">
         <Link href="/blog/canada-suv-vs-uk-innovator" className="group block bg-white hover:bg-[#CCFF00] transition-colors duration-500">
            <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
               <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4 group-hover:text-[#1a1a1a]">Up Next</span>
               <h2 className="font-serif text-4xl md:text-6xl group-hover:italic transition-all">
                  Canada SUV vs. UK Innovator
               </h2>
               <div className="mt-8 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  Read Article <ArrowRight size={16} />
               </div>
            </div>
         </Link>
      </section>

    </div>
  );
}