/* 
   PATH: src/components/HeroHorizon.tsx
   HARDWARE-ID: 00:1B:44:11:3A:B7
   TIMESTAMP: 2025-12-25 15:40 EST
   VERSION: v1.0.0 - Horizon Hero
   DESIGN: Split screen with a "Glass Card" floating effect. 
   CONCEPT: "Your passport is your IP."
*/

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Assuming you will add an image
import { ArrowRight, Plane, Globe2, Rocket } from 'lucide-react';

export default function HeroHorizon() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden px-6">
      
      {/* Background Decor: Abstract Blue Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Content */}
        <div>
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100">
              <Rocket size={14} />
              <span>For Series A+ Founders</span>
           </div>

           <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-[#0F172A] leading-[1.1] mb-8">
              Scale <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                 Beyond Borders.
              </span>
           </h1>

           <p className="font-body text-lg md:text-xl text-[#64748B] leading-relaxed mb-10 max-w-lg">
              We turn your startup's traction into a permanent residency visa. 
              Specialized advisory for Canada (SUV), UK (Innovator), and USA (O-1/EB-1).
           </p>

           <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-[#0F172A] text-white px-8 py-4 rounded-xl font-heading font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                 Start Your Journey <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 rounded-xl font-heading font-bold text-[#0F172A] border border-slate-200 hover:bg-white hover:border-blue-200 transition-all">
                 View Success Stories
              </button>
           </div>
           
           <div className="mt-12 flex items-center gap-4 text-sm text-[#64748B]">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                 ))}
              </div>
              <p>Trusted by 120+ Founders in 2024</p>
           </div>
        </div>

        {/* Right: Visual / Dashboard Illustration */}
        <div className="relative hidden lg:block h-[600px]">
           {/* Main Glass Card */}
           <div className="absolute top-10 right-10 w-full h-full glass-panel rounded-3xl p-8 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
              
              {/* Fake Dashboard UI */}
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Current Status</p>
                    <p className="text-2xl font-bold text-slate-800">Approved</p>
                 </div>
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Plane size={24} />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                       <Globe2 size={20}/>
                    </div>
                    <div>
                       <p className="font-bold text-slate-700">Canada SUV</p>
                       <p className="text-xs text-slate-400">Letter of Support Issued</p>
                    </div>
                 </div>
                 
                 <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center gap-4 opacity-60">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                       <Globe2 size={20}/>
                    </div>
                    <div>
                       <p className="font-bold text-slate-700">UK Innovator</p>
                       <p className="text-xs text-slate-400">Endorsement Pending</p>
                    </div>
                 </div>
              </div>

              {/* Decorative Map Image (Placeholder) */}
              <div className="mt-8 h-40 w-full bg-slate-100 rounded-xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop')] bg-cover opacity-50 grayscale"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Toronto, CA</span>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
}