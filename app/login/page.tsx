// ============================================================================
// Page: app/login/page.tsx
// Style: Editorial / Art Gallery
// Concept: "The Vault" (Client Access)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Access | SVR',
  description: 'Secure entry for existing clients.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F2F0E9] text-[#1a1a1a]">
      
      {/* =========================================
          LEFT: BRAND / VISUAL
      ========================================= */}
      <div className="lg:w-1/2 bg-[#1a1a1a] text-[#F2F0E9] p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
         {/* Decorative Background Element */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CCFF00]/5 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="relative z-10">
            <Link href="/" className="inline-block mb-12">
               <span className="font-serif text-3xl font-bold tracking-tight">S V R .</span>
            </Link>
            <h1 className="font-serif text-6xl md:text-8xl leading-none mb-8">
               CLIENT <br/>
               <span className="text-[#CCFF00] italic">PORTAL.</span>
            </h1>
            <p className="font-sans text-sm opacity-60 max-w-md leading-relaxed">
               Secure access to your roadmap, financial models, and application status. 
               Restricted to active retainer clients only.
            </p>
         </div>

         <div className="relative z-10 mt-12 lg:mt-0">
            <div className="flex items-center gap-3 opacity-50">
               <ShieldCheck className="w-5 h-5" />
               <span className="font-sans text-xs uppercase tracking-widest">256-bit Encrypted Environment</span>
            </div>
         </div>
      </div>

      {/* =========================================
          RIGHT: THE FORM
      ========================================= */}
      <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center">
         
         <div className="max-w-md w-full mx-auto">
            <div className="mb-12">
               <span className="font-sans text-xs font-bold bg-[#1a1a1a] text-[#F2F0E9] px-2 py-1 uppercase tracking-widest">Authorized Entry</span>
            </div>

            <form className="space-y-10">
               
               {/* Email */}
               <div className="group">
                  <label className="block font-sans text-xs font-bold uppercase tracking-widest mb-3 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a]">
                     Access ID / Email
                  </label>
                  <input 
                     type="email" 
                     className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-2xl placeholder:text-[#1a1a1a]/20" 
                     placeholder="client@startup.com"
                  />
               </div>

               {/* Password */}
               <div className="group">
                  <div className="flex justify-between items-baseline mb-3">
                     <label className="block font-sans text-xs font-bold uppercase tracking-widest opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#1a1a1a]">
                        Passkey
                     </label>
                     <Link href="#" className="font-sans text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
                        Forgot?
                     </Link>
                  </div>
                  <input 
                     type="password" 
                     className="w-full bg-transparent border-b border-[#1a1a1a]/20 py-3 focus:outline-none focus:border-[#1a1a1a] transition-colors font-serif text-2xl placeholder:text-[#1a1a1a]/20" 
                     placeholder="••••••••"
                  />
               </div>

               {/* Submit */}
               <button className="w-full bg-[#1a1a1a] text-[#F2F0E9] py-5 font-sans font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-3 group">
                  <Lock className="w-4 h-4" />
                  Enter Portal
               </button>

            </form>

            {/* Footer Links */}
            <div className="mt-12 pt-12 border-t border-[#1a1a1a]/10 text-center">
               <p className="font-sans text-xs text-[#1a1a1a]/60 mb-4">Not a client yet?</p>
               <Link href="/contact" className="inline-flex items-center gap-2 font-serif text-xl border-b border-[#1a1a1a] pb-1 hover:text-[#1a1a1a]/60 transition-colors">
                  Apply for Representation <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>

      </div>

    </div>
  );
}