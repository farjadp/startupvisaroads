// app/contact/page.tsx
"use client"; // اضافه شد چون از هوک‌های کلاینت و هندلر فرم استفاده می‌کنیم

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Clock, 
  ShieldAlert,
  Send,
  Linkedin,
  Twitter,
  ChevronDown // اضافه شده برای دراپ‌داون‌ها
} from 'lucide-react';

// نکته: Metadata در کامپوننت‌های "use client" کار نمی‌کند. 
// اگر نیاز به متادیتا دارید، باید این فایل را layout.tsx کنید یا use client را حذف و فرم را در کامپوننت جدا بگذارید.
// اما برای سادگی فعلاً همین ساختار را حفظ می‌کنیم (بدون اکسپورت metadata).

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // شبیه‌سازی ارسال
    setTimeout(() => {
      alert("Application Protocol Initiated. We will contact you shortly.");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#F2F0E9] text-[#1a1a1a]">

      {/* =========================================
          1. HERO: TYPE-DRIVEN
      ========================================= */}
      <section className="pt-32 pb-20 px-6 border-b border-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-8">
             <span className="w-4 h-4 bg-[#1a1a1a]"></span>
             <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">Inquiry</span>
          </div>

          <h1 className="font-serif text-[12vw] leading-[0.8] tracking-tighter mb-12">
            INITIATE <br/>
            <span className="pl-[10vw] md:pl-[15vw] italic text-[#1a1a1a]/40">PROTOCOL.</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-12 items-end">
             <p className="font-serif text-3xl md:text-4xl leading-tight max-w-2xl">
                We accept a limited number of clients per quarter. <br/>
                Tell us about your ambition.
             </p>
          </div>
        </div>
      </section>

      {/* =========================================
          2. THE FORM & INFO SPLIT
      ========================================= */}
      <section className="min-h-screen border-b border-[#1a1a1a]">
         <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* LEFT: Contact Info (Sticky) */}
            <div className="bg-[#1a1a1a] text-[#F2F0E9] p-8 md:p-12 lg:p-24 flex flex-col justify-between min-h-[50vh] lg:min-h-screen lg:sticky lg:top-0">
               <div>
                  <span className="font-sans text-xs font-bold text-[#CCFF00] mb-8 block uppercase tracking-widest">Direct Line</span>
                  
                  <div className="space-y-12">
                     <div className="group">
                        <h3 className="font-serif text-3xl mb-2 flex items-center gap-3">
                           <Mail className="w-6 h-6 text-[#CCFF00]" /> Email
                        </h3>
                        <a href="mailto:hello@svr.com" className="font-sans text-lg opacity-60 hover:opacity-100 hover:text-[#CCFF00] transition-all">
                           hello@svr.com
                        </a>
                     </div>

                     <div className="group">
                        <h3 className="font-serif text-3xl mb-2 flex items-center gap-3">
                           <MapPin className="w-6 h-6 text-[#CCFF00]" /> HQ
                        </h3>
                        <address className="not-italic font-sans text-lg opacity-60">
                           100 King St W, Suite 5600<br/>
                           Toronto, ON M5X 1C9
                        </address>
                     </div>

                     <div className="group">
                        <h3 className="font-serif text-3xl mb-2 flex items-center gap-3">
                           <Clock className="w-6 h-6 text-[#CCFF00]" /> Hours
                        </h3>
                        <p className="font-sans text-lg opacity-60">
                           Mon - Fri: 09:00 - 18:00 EST<br/>
                           Async Support: 24/7
                        </p>
                     </div>
                  </div>
               </div>

               <div className="mt-20">
                  <span className="font-sans text-xs font-bold text-[#CCFF00] mb-6 block uppercase tracking-widest">Connect</span>
                  <div className="flex gap-4">
                     <Link href="#" className="w-12 h-12 border border-[#F2F0E9]/20 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all">
                        <Linkedin size={20} />
                     </Link>
                     <Link href="#" className="w-12 h-12 border border-[#F2F0E9]/20 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all">
                        <Twitter size={20} />
                     </Link>
                  </div>
               </div>
            </div>

            {/* RIGHT: The Form */}
            <div className="bg-[#F2F0E9] p-8 md:p-12 lg:p-24 border-t border-[#1a1a1a] lg:border-t-0 lg:border-l">
               <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 mb-12 inline-block uppercase tracking-widest">Application Form</span>
               
               <form onSubmit={handleSubmit} className="space-y-12">
                  
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="group relative">
                        <label htmlFor="firstName" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a] transition-opacity">First Name</label>
                        <input id="firstName" required type="text" className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-2xl placeholder:text-[#1a1a1a]/20" placeholder="Enter name" />
                     </div>
                     <div className="group relative">
                        <label htmlFor="lastName" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a] transition-opacity">Last Name</label>
                        <input id="lastName" required type="text" className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-2xl placeholder:text-[#1a1a1a]/20" placeholder="Enter surname" />
                     </div>
                  </div>

                  <div className="group relative">
                     <label htmlFor="email" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a] transition-opacity">Email Address</label>
                     <input id="email" required type="email" className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-2xl placeholder:text-[#1a1a1a]/20" placeholder="founder@company.com" />
                  </div>

                  {/* Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="group relative">
                        <label htmlFor="jurisdiction" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Jurisdiction</label>
                        <div className="relative">
                           <select id="jurisdiction" className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pr-8 focus:outline-none focus:border-[#1a1a1a] font-serif text-xl appearance-none rounded-none cursor-pointer hover:bg-[#1a1a1a]/5 transition-colors">
                              <option>Canada (SUV)</option>
                              <option>USA (EB1 / NIW)</option>
                              <option>UK (Innovator)</option>
                              <option>Europe (General)</option>
                              <option>Undecided</option>
                           </select>
                           {/* Custom Arrow */}
                           <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" />
                        </div>
                     </div>
                     <div className="group relative">
                        <label htmlFor="stage" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Stage</label>
                        <div className="relative">
                           <select id="stage" className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 pr-8 focus:outline-none focus:border-[#1a1a1a] font-serif text-xl appearance-none rounded-none cursor-pointer hover:bg-[#1a1a1a]/5 transition-colors">
                              <option>Idea Phase</option>
                              <option>MVP Built</option>
                              <option>Revenue Generating</option>
                              <option>Series A+</option>
                           </select>
                           {/* Custom Arrow */}
                           <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  {/* Message */}
                  <div className="group relative">
                     <label htmlFor="vision" className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a] transition-opacity">The Vision</label>
                     <textarea id="vision" rows={4} className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-4 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-xl resize-none placeholder:text-[#1a1a1a]/20" placeholder="Briefly describe your business model and goals..."></textarea>
                  </div>

                  {/* Submit */}
                  <div className="pt-8">
                     <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="w-full bg-[#1a1a1a] text-[#F2F0E9] py-6 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {isSubmitting ? "TRANSMITTING..." : "SUBMIT APPLICATION"} 
                        {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                     </button>
                     <p className="mt-6 text-center text-xs font-sans text-[#1a1a1a]/40">
                        By submitting, you agree to our privacy policy. We reply within 24h.
                     </p>
                  </div>
               </form>
            </div>

         </div>
      </section>

      {/* =========================================
          3. FAQ
      ========================================= */}
      <section className="py-24 px-6 bg-white">
         <div className="container mx-auto max-w-3xl">
            <h2 className="font-serif text-4xl mb-12 text-center">Common Queries</h2>
            
            <div className="space-y-4">
               {[
                  { q: "Is the first consultation free?", a: "Yes. We offer a complimentary 20-minute discovery call to assess mutual fit." },
                  { q: "Do you handle the legal filing?", a: "No. We handle business strategy, documentation, and mentorship. We refer you to partner law firms for the legal submission." },
                  { q: "How long is the waitlist?", a: "Currently 2-3 weeks for new client onboarding due to high demand." }
               ].map((item, i) => (
                  <details key={i} className="group border-b border-[#1a1a1a]/10 pb-6 cursor-pointer">
                     <summary className="flex justify-between items-center font-serif text-xl list-none hover:text-[#1a1a1a]/60 transition-colors">
                        {item.q}
                        <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 group-open:bg-[#CCFF00] group-open:text-[#1a1a1a] transition-colors transform group-open:rotate-180 inline-block text-center min-w-[24px]">+</span>
                     </summary>
                     <p className="mt-4 font-sans text-sm text-[#1a1a1a]/60 leading-relaxed max-w-xl animate-in slide-in-from-top-2 duration-300">
                        {item.a}
                     </p>
                  </details>
               ))}
            </div>
         </div>
      </section>

      {/* =========================================
          4. DISCLAIMER
      ========================================= */}
      <section className="py-12 px-6 bg-[#F2F0E9]">
         <div className="container mx-auto max-w-4xl border border-[#1a1a1a]/10 p-6 bg-white flex gap-4 items-start">
            <ShieldAlert className="shrink-0 w-6 h-6 text-[#b91c1c]" />
            <div>
               <p className="font-sans text-xs text-[#1a1a1a]/60 text-justify leading-relaxed">
                  <strong>Non-Legal Disclaimer:</strong> Startup Visa Roads acts solely as a business consultancy. 
                  We do not provide legal advice or representation. All immigration forms must be filed by a licensed attorney or consultant.
               </p>
            </div>
         </div>
      </section>

    </div>
  );
}