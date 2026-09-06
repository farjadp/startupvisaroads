// ============================================================================
// Component: components/fa/FaContact.tsx
// The Persian contact page: four channels, a form, the booking calendar.
// ============================================================================
import React from 'react';
import { ArrowLeft, Send, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Link } from '@/navigation';
import FaContactForm from './FaContactForm';
import { contact, BOOKING_IFRAME_URL } from '@/content/fa/contact';
import { TEAM_MEMBERS } from '@/content/team';

export default function FaContact() {
  const c = contact;
  return (
    <div className="w-full px-4 md:px-8 border-x border-[#1a1a1a]/10 max-w-[1400px] mx-auto bg-[#F2F0E9] font-vazir">
      <header className="pt-10 pb-16 border-b border-[#1a1a1a]">
        <span className="inline-block text-[11px] font-bold text-black bg-[#CCFF00] px-2 py-1 mb-6">{c.hero.eyebrow}</span>
        <h1 className="font-estedad font-black text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl mb-8">{c.hero.headline}</h1>
        <p className="text-lg md:text-xl leading-relaxed text-[#1a1a1a]/70 max-w-2xl">{c.hero.sub}</p>
      </header>

      <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20 my-16">
        {c.channels.map((ch) => {
          const ext = /^https?:/.test(ch.cta.href);
          const cls = 'group inline-flex items-center gap-2 font-bold border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors';
          return (
            <div key={ch.n} className="bg-[#F2F0E9] p-8 md:p-12 flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="inline-block text-xs font-bold text-[#CCFF00] bg-black px-2 py-1 mb-6">{ch.n}</span>
                <h2 className="font-estedad font-black text-3xl mb-4">{ch.title}</h2>
                <p className="text-[#1a1a1a]/70 leading-relaxed max-w-md">{ch.body}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                {ext ? (
                  <a href={ch.cta.href} target="_blank" rel="noopener noreferrer" className={cls}><Send className="w-4 h-4" />{ch.cta.label}</a>
                ) : ch.cta.href.startsWith('#') ? (
                  <a href={ch.cta.href} className={cls}>{ch.cta.label}<ArrowLeft className="w-4 h-4" /></a>
                ) : (
                  <Link href={ch.cta.href} className={cls}>{ch.cta.label}<ArrowLeft className="w-4 h-4" /></Link>
                )}
                {'secondary' in ch && ch.secondary && (
                  <a href={ch.secondary.href} {...(ch.secondary.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })} className="text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] self-end" dir="ltr">{ch.secondary.label}</a>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="py-16 border-t border-[#1a1a1a]/10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="font-estedad font-black text-3xl md:text-4xl mb-4">{c.form.heading}</h2>
          <p className="text-[#1a1a1a]/70 leading-relaxed">{c.form.body}</p>
        </div>
        <div className="lg:col-span-8"><FaContactForm /></div>
      </section>

      {/* Team direct contact */}
      {c.teamSection && (
        <section className="py-16 border-t border-[#1a1a1a]/10">
          <div className="mb-10">
            <h2 className="font-estedad font-black text-3xl md:text-4xl mb-4">{c.teamSection.heading}</h2>
            <p className="text-[#1a1a1a]/70 leading-relaxed max-w-2xl">{c.teamSection.body}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]/20 border border-[#1a1a1a]/20">
            {TEAM_MEMBERS.filter((m) => m.telegram || m.whatsapp || m.phoneNumbers?.length).map((member) => (
              <div key={member.id} className="bg-[#F2F0E9] p-6 md:p-8 flex flex-col justify-between min-h-[240px] group hover:bg-white transition-colors duration-300">
                <div>
                  <h3 className="font-estedad font-black text-2xl mb-1">{member.nameFa}</h3>
                  <p className="text-xs font-bold text-[#1a1a1a]/50 mb-4">{member.roleFa}</p>
                  {member.locationFa && (
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60 mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{member.locationFa}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 pt-3 border-t border-[#1a1a1a]/10">
                  {member.telegram && (
                    <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-xs border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                      <Send className="w-3.5 h-3.5" />
                      {member.telegramHandle}
                    </a>
                  )}
                  {member.whatsapp && (
                    <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      واتساپ
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-left">
            <Link href="/team" className="inline-flex items-center gap-2 font-bold text-xs border-b border-[#1a1a1a] pb-0.5 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
              {c.teamSection.teamPageLink}
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      <section id="booking" className="py-16 border-t border-[#1a1a1a]/10 scroll-mt-28">
        <h2 className="font-estedad font-black text-3xl md:text-4xl mb-4">{c.booking.heading}</h2>
        <p className="text-[#1a1a1a]/70 leading-relaxed mb-8 max-w-xl">{c.booking.body}</p>
        <div className="border border-[#1a1a1a] bg-white" dir="ltr">
          <iframe src={BOOKING_IFRAME_URL} title={c.booking.heading} width="100%" height="800" className="w-full border-0 bg-white" />
        </div>
      </section>

      <p className="py-12 text-xs text-[#1a1a1a]/50 max-w-2xl">{c.disclaimer}</p>
    </div>
  );
}
