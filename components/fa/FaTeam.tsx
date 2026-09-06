// ============================================================================
// components/fa/FaTeam.tsx
// The Persian team page: hero + team grid with contact channels.
// ============================================================================
import React from 'react';
import { Send, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import { TEAM_MEMBERS } from '@/content/team';
import { page } from '@/content/fa/team';
import JsonLd from '@/components/JsonLd';
import { faWebPageJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/fa/content';
import { SITE_URL } from '@/lib/seo';

export default function FaTeam() {
  const p = page;

  return (
    <article className="w-full bg-[#F2F0E9] font-vazir">
      <JsonLd data={[
        faWebPageJsonLd(p),
        faqJsonLd(p.faqs),
        breadcrumbJsonLd(SITE_URL, [{ name: 'خانه', path: '' }, { name: 'تیم ما', path: '/team' }]),
      ]} />

      {/* HERO */}
      <header className="border-b border-[#1a1a1a]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#1a1a1a]/50 pt-8">
            <Link href="/" className="hover:text-[#1a1a1a]">خانه</Link>
            <span>/</span>
            <span className="text-[#1a1a1a]">تیم ما</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end pt-10 pb-14 md:pb-20">
            <div className="lg:col-span-7">
              <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{p.hero.eyebrow}</span>
              <h1 className="font-estedad font-black text-4xl md:text-6xl lg:text-[4.25rem] leading-[1.15] max-w-[18ch] [text-wrap:balance]">{p.hero.headline}</h1>
              <p className="mt-8 text-lg md:text-xl leading-[1.9] text-[#1a1a1a]/70 max-w-[60ch]">{p.hero.sub}</p>
            </div>
          </div>
        </div>
      </header>

      {/* TEAM GRID */}
      <div className="px-4 md:px-8 max-w-[1400px] mx-auto border-x border-[#1a1a1a]/10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-[#F2F0E9] p-8 md:p-10 flex flex-col justify-between min-h-[340px] group hover:bg-white transition-colors duration-300"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-estedad font-black text-3xl mb-1">{member.nameFa}</h2>
                    <p className="text-xs font-bold text-[#1a1a1a]/50">{member.roleFa}</p>
                  </div>
                  <span className="w-10 h-10 border border-[#1a1a1a]/20 flex items-center justify-center font-estedad text-lg text-[#1a1a1a]/30 group-hover:bg-[#CCFF00] group-hover:text-[#1a1a1a] group-hover:border-[#CCFF00] transition-all">
                    {member.nameFa.charAt(0)}
                  </span>
                </div>

                {member.locationFa && (
                  <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60 mb-6">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{member.locationFa}</span>
                  </div>
                )}

              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-[#1a1a1a]/10">
                {member.telegram && (
                  <a
                    href={member.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-xs border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {member.telegramHandle}
                  </a>
                )}
                {member.whatsapp && (
                  <a
                    href={member.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-bold text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    واتساپ
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLOSING */}
      <section className="py-24 border-t border-[#1a1a1a] bg-[#1a1a1a] text-[#F2F0E9]">
        <div className="px-4 md:px-8 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-estedad font-black text-4xl md:text-6xl leading-tight mb-10 max-w-[20ch] [text-wrap:balance]">می‌خواهید با ما گفت‌وگو کنید؟</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="group inline-flex items-center gap-4 bg-[#CCFF00] text-black px-8 py-5 hover:bg-[#F2F0E9] transition-colors duration-300">
                <span className="font-bold">صفحه‌ی تماس</span>
              </Link>
              <Link href="/which-path" className="group inline-flex items-center gap-3 border border-[#F2F0E9]/40 text-[#F2F0E9] px-6 py-4 hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors duration-300">
                <span className="font-bold">ارزیابی رایگان مسیر</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
