// ============================================================================
// Page: /team — the people behind Startup Visa Roads.
// Bilingual: English is rendered here; /fa/team uses FaPageLayout.
// ============================================================================
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Send, MessageCircle, Phone, MapPin } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { metaFor } from '@/lib/pageMeta';
import { buildMetadata } from '@/lib/seo';
import FaTeam from '@/components/fa/FaTeam';
import { page as faPage } from '@/content/fa/team';
import { faMeta } from '@/lib/fa/content';
import { TEAM_MEMBERS } from '@/content/team';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'fa') {
    return buildMetadata(faMeta(faPage, locale));
  }
  return metaFor('/team', locale);
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === 'fa') {
    return <FaTeam />;
  }

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">
      {/* HERO */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto max-w-[1400px]">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-4 h-4 bg-[#1a1a1a]"></span>
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">The Team</span>
          </div>
          <h1 className="font-serif text-[10vw] leading-[0.8] tracking-tighter mb-12">
            THE <br />
            <span className="pl-[10vw] italic text-[#1a1a1a]/40">PEOPLE.</span>
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                We are <span className="bg-[#CCFF00] px-2">founders</span>, not form-fillers.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-sans text-sm text-[#1a1a1a]/60 leading-relaxed text-justify max-w-md ml-auto">
                Every member of our team has built, scaled, or evaluated real startups.
                We are not lawyers or licensed immigration consultants — we are the people
                who sit on the business side of the table, preparing founders for the
                scrutiny of designated organizations and investment committees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="bg-[#F2F0E9] p-8 md:p-10 flex flex-col justify-between min-h-[340px] group hover:bg-white transition-colors duration-300"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-3xl mb-1">{member.name}</h2>
                      <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">{member.role}</p>
                    </div>
                    <span className="w-10 h-10 border border-[#1a1a1a]/20 flex items-center justify-center font-serif text-lg text-[#1a1a1a]/30 group-hover:bg-[#CCFF00] group-hover:text-[#1a1a1a] group-hover:border-[#CCFF00] transition-all">
                      {member.name.charAt(0)}
                    </span>
                  </div>

                  {member.location && (
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60 mb-6">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{member.location}</span>
                    </div>
                  )}

                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-[#1a1a1a]/10">
                  {member.telegram && (
                    <a
                      href={member.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
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
                      className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center border-t border-[#1a1a1a]/10">
        <div className="container mx-auto">
          <h2 className="font-serif text-5xl md:text-7xl mb-8">
            Want to talk?
          </h2>
          <p className="font-sans text-[#1a1a1a]/60 text-lg mb-12 max-w-xl mx-auto">
            Reach out to any of us directly, or use the contact page to send a message.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="bg-[#1a1a1a] text-[#F2F0E9] px-10 py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors inline-flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
