/* 
   PATH: src/components/HeroFlightRadar.tsx
   TIMESTAMP: 2025-12-25 17:00 EST
   VERSION: v1.0.0 - Flight Radar Command
   DESIGN: Dark World Map with animated flight paths and moving planes.
   CONCEPT: "Global Traffic Control for Founders."
*/

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plane } from 'lucide-react';

export default function HeroFlightRadar() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] pt-20">
      
      {/* ==============================================
          1. THE LIVING MAP BACKGROUND
      ============================================== */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 md:opacity-60">
        <svg
          viewBox="0 0 1000 450"
          className="w-full h-full max-w-[1400px] object-contain stroke-none fill-[#1e293b]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS for Gradients & Icons */}
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.6)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </linearGradient>
            
            {/* The Plane Icon to be animated */}
            <path id="planeIcon" d="M20 10 L15 25 L25 25 Z" fill="#fff" transform="rotate(90) scale(0.8)" />
            <filter id="glow">
               <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>

          {/* WORLD MAP SILHOUETTE (Simplified Low Poly) */}
          <path d="M165.5 137.2c-2.3-1.6-4.5-3.3-4.5-5.9 0-1.8 1.1-3.2 2.5-4.4 3.7-3.1 8.8-4.5 13.5-5.7 3.3-.8 6.6-1.7 9.8-2.6 1.8-.5 3.5-1.1 5.3-1.6 2.5-.7 4.9-1.9 7.4-2.5 1.6-.4 3.3-.6 4.9-.7 3.3-.2 6.6.3 9.9.5 2.1.1 4.2.3 6.3.2 2.5-.1 5-.9 7.3-1.9 2.1-.9 3.9-2.3 5.6-3.8 1.4-1.3 2.7-2.7 3.9-4.2 1.9-2.2 3.5-4.7 4.7-7.4 1.1-2.4 1.8-4.9 2.5-7.5.4-1.6.8-3.2 1.3-4.8.9-2.9 2-5.7 3.3-8.4 1.2-2.4 2.6-4.7 4.3-6.8 1.4-1.8 3.2-3.3 5.3-4.3 2.4-1.2 5.1-1.6 7.7-1.8 3.5-.2 7 .3 10.4 1.2 2.1.5 4.1 1.4 6.1 2.4 2.3 1.1 4.5 2.5 6.4 4.3 1.7 1.6 3.1 3.5 4.2 5.6 1 1.9 1.7 3.9 2.2 6 .3 1.2.5 2.4.6 3.7.1 1.8.2 3.7-.4 5.4-.5 1.6-1.6 2.9-2.8 4-1.4 1.3-3 2.3-4.7 3.1-2.8 1.3-5.8 1.9-8.8 2.2-2.1.2-4.2.2-6.3-.2-1.8-.3-3.6-.9-5.3-1.7-1.6-.8-3-2-4.2-3.4-.9-1.1-1.6-2.4-2.1-3.7-.4-1.1-.6-2.2-.6-3.4 0-1.6.3-3.1.9-4.6.9-2.1 2.3-3.9 4.1-5.4 1.5-1.3 3.3-2.2 5.2-2.8 2.5-.8 5.1-.8 7.7-.4 2.2.3 4.3 1.2 6.2 2.4 1.7 1.1 3.2 2.6 4.3 4.3 1 1.5 1.6 3.2 2 5 .3 1.3.4 2.7.4 4 0 2.2-.4 4.3-1.1 6.3-1 2.8-2.6 5.3-4.8 7.3-1.8 1.7-4 2.9-6.4 3.6-2.8.8-5.7.9-8.6.6-2.2-.3-4.3-.9-6.3-1.9-1.9-1-3.6-2.4-5.1-4-1.3-1.4-2.3-3.1-3.1-4.9-.7-1.5-1.1-3.2-1.3-4.8-.1-1.3-.1-2.6.2-3.9.4-1.6 1.2-3.1 2.3-4.3 1.3-1.4 2.9-2.4 4.7-3 2.1-.7 4.3-.8 6.5-.5 2.5.3 4.9 1.3 6.9 2.8 1.7 1.3 3 3 3.9 4.9.8 1.6 1.2 3.4 1.4 5.2.1 1.5.1 3-.2 4.5-.4 1.8-1.2 3.5-2.3 4.9-1.3 1.7-3 3-4.9 3.9-2.3 1.1-4.9 1.4-7.4 1.2-2.2-.2-4.3-.9-6.2-2-1.8-1.1-3.3-2.7-4.5-4.5-1.1-1.6-1.8-3.5-2.2-5.4-.3-1.5-.4-3-.2-4.6.2-1.8.8-3.5 1.8-5 1.1-1.6 2.6-2.9 4.3-3.8 2-.9 4.2-1.3 6.4-1.2 2.5.1 4.9.9 7 2.2 1.9 1.2 3.4 2.9 4.5 4.8 1 1.7 1.5 3.6 1.7 5.5.1 1.4 0 2.9-.3 4.3-.5 1.8-1.4 3.4-2.6 4.8-1.4 1.6-3.2 2.8-5.1 3.6-2.3.9-4.8 1.1-7.2.7-2.1-.3-4.1-1.2-5.9-2.4-1.7-1.2-3.1-2.9-4.1-4.7-.9-1.7-1.4-3.5-1.5-5.4-.1-1.4.1-2.9.6-4.2.6-1.7 1.7-3.2 3.1-4.4 1.5-1.3 3.3-2.1 5.3-2.5 2.3-.4 4.7-.3 7 .4 2.1.6 4 1.8 5.5 3.3 1.4 1.4 2.4 3.1 3 5 .5 1.5.7 3.1.6 4.7-.1 1.9-.6 3.7-1.4 5.4-1 1.9-2.4 3.6-4.1 4.8-1.8 1.3-3.9 2.1-6.1 2.3-2.5.3-5.1.1-7.5-.7-2.1-.7-4-1.9-5.6-3.4-1.5-1.4-2.6-3.2-3.3-5.1-.6-1.6-.9-3.3-.9-5 0-1.9.4-3.7 1.2-5.4 1-1.9 2.4-3.5 4.1-4.7 1.9-1.4 4.1-2.2 6.4-2.5 2.6-.3 5.3 0 7.8.9 2.2.8 4.1 2.2 5.7 3.9 1.4 1.5 2.5 3.3 3.1 5.3.5 1.6.7 3.3.6 5-.1 2-.6 4-1.6 5.7-1.1 2-2.7 3.7-4.6 4.9-2.1 1.4-4.5 2.2-6.9 2.3-2.8.2-5.6-.4-8.1-1.6-2.2-1.1-4.1-2.8-5.6-4.8-1.3-1.8-2.2-3.9-2.7-6-.4-1.7-.5-3.5-.3-5.2.3-2 1-3.9 2.1-5.6 1.3-1.9 3-3.4 5-4.4 2.3-1.1 4.8-1.5 7.4-1.4 2.9.1 5.7.9 8.2 2.3 2.1 1.3 3.9 3.1 5.1 5.3 1.1 1.9 1.6 4 1.7 6.2.1 1.7-.2 3.4-.8 5-.8 2-2 3.8-3.6 5.3-1.7 1.6-3.7 2.7-5.9 3.3-2.5.7-5.1.8-7.7.3-2.3-.4-4.5-1.5-6.3-3-1.7-1.4-3-3.2-3.8-5.2-.7-1.8-1-3.7-1-5.6 0-2.2.5-4.3 1.5-6.2 1.2-2.1 2.9-3.9 4.9-5.1 2.2-1.3 4.8-1.9 7.3-1.8 2.9.1 5.6 1.1 8 2.7 2.1 1.5 3.8 3.5 4.9 5.8 1 2 1.5 4.2 1.5 6.4 0 1.8-.3 3.6-1 5.2-.8 2-2 3.8-3.7 5.1-1.8 1.5-4 2.4-6.3 2.8-2.6.5-5.3.3-7.8-.5-2.2-.7-4.2-2-5.9-3.6-1.5-1.6-2.7-3.5-3.4-5.6-.6-1.8-.9-3.8-.8-5.7.1-2.2.7-4.3 1.8-6.1 1.3-2.1 3.1-3.8 5.2-4.9 2.3-1.2 4.9-1.7 7.5-1.5 2.9.2 5.6 1.3 7.9 2.9 2 1.5 3.6 3.5 4.6 5.8 1 2.1 1.3 4.4 1.2 6.7-.2 1.9-.6 3.7-1.4 5.4-1 1.9-2.4 3.5-4.2 4.7-1.9 1.3-4.1 2.1-6.4 2.2-2.6.2-5.2-.3-7.6-1.3-2.1-.9-3.9-2.4-5.3-4.2-1.3-1.7-2.1-3.7-2.6-5.8-.4-1.7-.5-3.5-.3-5.2z" />
          
          {/* 
             LOCATIONS (City Pulsing Dots) 
             Coordinates approx based on viewBox 0 0 1000 450
          */}
          
          {/* Toronto */}
          <circle cx="280" cy="140" r="3" fill="#fff" className="animate-pulse">
             <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* London */}
          <circle cx="485" cy="115" r="3" fill="#fff" className="animate-pulse">
             <animate attributeName="r" values="3;6;3" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>

          {/* Dubai */}
          <circle cx="610" cy="180" r="3" fill="#fff" className="animate-pulse">
             <animate attributeName="r" values="3;6;3" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>

          {/* New York */}
          <circle cx="295" cy="150" r="3" fill="#fff" className="animate-pulse">
             <animate attributeName="r" values="3;6;3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </circle>

           {/* San Francisco */}
           <circle cx="190" cy="160" r="3" fill="#fff" className="animate-pulse">
             <animate attributeName="r" values="3;6;3" dur="2s" begin="0.2s" repeatCount="indefinite" />
          </circle>


          {/* 
             FLIGHT PATHS & PLANES 
             Using quadratic bezier curves (Q) for arcs
          */}

          {/* Route 1: Toronto -> London */}
          <path id="route1" d="M280 140 Q 380 60 485 115" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <circle r="3" fill="#06B6D4" filter="url(#glow)">
             <animateMotion dur="4s" repeatCount="indefinite" path="M280 140 Q 380 60 485 115" rotate="auto" />
          </circle>

          {/* Route 2: London -> Dubai */}
          <path id="route2" d="M485 115 Q 550 130 610 180" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" strokeDasharray="4 4" />
          <circle r="3" fill="#6366F1" filter="url(#glow)">
             <animateMotion dur="5s" repeatCount="indefinite" path="M485 115 Q 550 130 610 180" rotate="auto" />
          </circle>

          {/* Route 3: Dubai -> Toronto (Long Haul) */}
          <path id="route3" d="M610 180 Q 450 30 280 140" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" strokeDasharray="2 6" />
          <circle r="3" fill="#fff" filter="url(#glow)">
             <animateMotion dur="8s" repeatCount="indefinite" path="M610 180 Q 450 30 280 140" rotate="auto" />
          </circle>

          {/* Route 4: SF -> New York */}
          <path id="route4" d="M190 160 Q 240 140 295 150" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
          <circle r="3" fill="#06B6D4" filter="url(#glow)">
             <animateMotion dur="3s" repeatCount="indefinite" path="M190 160 Q 240 140 295 150" rotate="auto" />
          </circle>

        </svg>
        
        {/* Radial Gradient overlay to fade map at edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020617_100%)]"></div>
      </div>


      {/* ==============================================
          2. THE CONTENT (Glass Interface)
      ============================================== */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Radar Status Badge */}
        <div className="flex items-center gap-2 mb-8 bg-[#0F172A]/80 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-in slide-in-from-top-4 duration-700">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 font-mono">
              Live Air Traffic • Startup Mobility
           </span>
        </div>

        <h1 className="text-center font-heading text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] tracking-tighter text-white mb-8 drop-shadow-2xl">
           <span className="block">BORDER</span>
           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 animate-pulse-slow">
              LESS
           </span>
        </h1>

        <p className="text-center max-w-xl text-slate-400 text-lg leading-relaxed mb-12">
           Don't let geography limit your valuation. 
           We move high-growth startups from restricted jurisdictions to 
           <span className="text-white font-bold"> Tier-1 Ecosystems.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
           <Link href="/contact" className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#020617] font-bold text-lg uppercase tracking-widest transition-all clip-path-polygon flex items-center gap-3">
              <Plane className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              Start Migration
           </Link>
           
           <button className="px-8 py-4 border border-white/20 hover:border-white text-white font-bold text-lg uppercase tracking-widest transition-all">
              Track Application
           </button>
        </div>

      </div>

      {/* Decorative Footer Data */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-[#020617]/90 backdrop-blur-sm py-4 hidden md:block">
         <div className="container mx-auto flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <div>
               <span className="text-cyan-500">TOR</span> 43.65°N — Active
            </div>
            <div>
               <span className="text-cyan-500">LDN</span> 51.50°N — Inbound
            </div>
            <div>
               <span className="text-cyan-500">DXB</span> 25.20°N — Outbound
            </div>
            <div>
               <span className="text-cyan-500">NYC</span> 40.71°N — Holding
            </div>
         </div>
      </div>

    </section>
  );
}