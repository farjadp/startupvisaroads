// ============================================================================
// Page: app/campaigns/pnp-brochure/page.tsx
// Style: "The Field Guide" / Interactive Deck
// Context: Updated with "Architecture" (Base vs Enhanced) and "Baseline" slides
// ============================================================================

"use client";

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Target,
  Cpu,
  Download,
  Share2,
  Shield,
  Layers,
  Scale,
  Map,
  Play,
  MapPin,
  X,
  FileText
} from 'lucide-react';
import VideoBriefing from '@/components/VideoBriefing'; // 1. Import
import StrategicAssessment from '@/components/PNPStrategicAssessment';


export default function PNPBrochurePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  // Updated total slides count
  const totalSlides = 7;
  const [assessmentOpen, setAssessmentOpen] = useState(false); // New State
  const [videoOpen, setVideoOpen] = useState(false);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const slides = [
    // SLIDE 0: COVER (RE-DESIGNED)
    {
      id: "COVER",
      content: (
        <div className="h-full flex flex-col justify-center items-start relative z-10">

          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-3 mb-8 animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] font-mono uppercase tracking-wider">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              Federal Gridlock: CRITICAL
            </div>
            <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-[10px] font-mono uppercase tracking-wider">
              Provincial Channels: ACTIVE
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-9xl font-black uppercase leading-[0.85] mb-8 tracking-tighter text-white">
            The PNP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-white">
              Override.
            </span>
          </h1>

          {/* Subtitle / Hook */}
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-12 border-l-2 border-white/10 pl-6">
            The Express Entry CRS score has broken the system. <br />
            This is the tactical manual for <strong>Founders</strong> and <strong>Talent</strong> to bypass the federal queue via Provincial Nomination.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={nextSlide}
              className="flex-1 flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-all group rounded-sm"
            >
              Initialize <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setVideoOpen(true)}
              className="flex-1 flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm"
            >
              <Play size={16} fill="currentColor" /> Intel Brief
            </button>
          </div>

          {/* Footer Metadata */}
          <div className="mt-16 flex items-center gap-4 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
            <span>Auth: Ashavid Inc.</span>
            <span className="text-blue-500">•</span>
            <span>Protocol: 2026.1</span>
            <span className="text-blue-500">•</span>
            <span>Status: Unclassified</span>
          </div>

          {/* Video Modal */}
          {videoOpen && (
            <div className="fixed inset-0 z-[60] bg-black/95 overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500 flex items-center justify-center p-4">
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50"
              >
                <X size={32} />
              </button>
              <div className="w-full max-w-5xl">
                <VideoBriefing
                  videoId="dQw4w9WgXcQ"
                  title="Strategic Briefing: The PNP Override"
                />
              </div>
            </div>
          )}
        </div>
      )
    },

    // SLIDE 1: THE ARCHITECTURE (RE-ENGINEERED)
    {
      id: "ARCH",
      title: "01 // THE STRATEGIC FORK",
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Choose Your Engine</h2>
              <p className="text-gray-400 text-sm md:text-base max-w-xl">
                PNP is not a single path. It splits into two distinct engines based on your primary asset:
                <strong> Human Capital (Talent)</strong> or <strong>Financial Capital (Business)</strong>.
              </p>
            </div>
            {/* Strategic Alert Badge */}
            <div className="hidden md:block bg-red-900/20 border border-red-500/30 px-3 py-2 rounded text-[10px] font-mono text-red-300">
              ⚠️ WARNING: Mixing these strategies leads to rejection.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pb-2 custom-scrollbar">

            {/* ENGINE A: SKILLED (Enhanced) */}
            <div className="bg-[#111] border border-blue-500/30 p-6 rounded-xl relative group hover:bg-blue-900/10 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded text-blue-400"><Cpu size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">The "Talent" Engine</h3>
                    <p className="text-xs text-blue-400 font-mono">Enhanced / Express Entry Linked</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-1 uppercase rounded-sm">High Speed</span>
              </div>

              <div className="space-y-4 text-sm text-gray-400 mb-6">
                <p className="leading-relaxed border-l-2 border-blue-500/50 pl-3">
                  You are selling your <strong>Skills</strong>. The province nominates you to fill a specific job vacancy (e.g. Tech, Health).
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex gap-2 text-xs"><span className="text-blue-500">➜</span> <strong>Mechanism:</strong> Grants +600 CRS Points instantly.</li>
                  <li className="flex gap-2 text-xs"><span className="text-blue-500">➜</span> <strong>Timeline:</strong> 6-9 Months (Federal Processing).</li>
                  <li className="flex gap-2 text-xs"><span className="text-blue-500">➜</span> <strong>Risk:</strong> Highly competitive. Usually requires a Job Offer.</li>
                </ul>
              </div>
            </div>

            {/* ENGINE B: BUSINESS (Base) */}
            <div className="bg-[#111] border border-orange-500/30 p-6 rounded-xl relative group hover:bg-orange-900/10 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded text-orange-400"><Layers size={24} /></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">The "Founder" Engine</h3>
                    <p className="text-xs text-orange-400 font-mono">Base / Paper-Based</p>
                  </div>
                </div>
                <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-1 uppercase rounded-sm">High Control</span>
              </div>

              <div className="space-y-4 text-sm text-gray-400 mb-6">
                <p className="leading-relaxed border-l-2 border-orange-500/50 pl-3">
                  You are selling your <strong>Capital & Execution</strong>. The province nominates you to create jobs and economic growth.
                </p>
                <ul className="space-y-2 pt-2">
                  <li className="flex gap-2 text-xs"><span className="text-orange-500">➜</span> <strong>Mechanism:</strong> Work Permit First → PR Later (Performance Based).</li>
                  <li className="flex gap-2 text-xs"><span className="text-orange-500">➜</span> <strong>Timeline:</strong> 18-24 Months (Slower but surer).</li>
                  <li className="flex gap-2 text-xs"><span className="text-orange-500">➜</span> <strong>Risk:</strong> Financial Audit & Active Management required.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SVR STRATEGY BOX */}
          <div className="mt-6 border-t border-white/10 pt-4 flex gap-4 items-center animate-in slide-in-from-bottom-2">
            <div className="bg-white/10 p-2 rounded-full"><Scale size={16} className="text-white" /></div>
            <p className="text-xs text-gray-500 italic leading-relaxed">
              <strong className="text-white not-italic">The SVR Verdict:</strong> If you have capital ($200k+), do not compete in the "Talent" pool against thousands of engineers.
              The "Founder" path allows you to <strong>buy your way out of the line</strong> by creating your own job.
            </p>
          </div>

        </div>
      )
    },


    // SLIDE 2: THE BASELINE (REFINED)
    {
      id: "REQS",
      title: "02 // FOUNDER PROTOCOL: MINIMUMS",
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">The "Hard" Floor</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              To activate the Entrepreneur Engine, you must clear these four non-negotiable hurdles.
              <span className="text-red-400"> Warning: These are entry limits, not winning scores.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">

            {/* 1. Net Worth */}
            <div className="bg-[#111] p-5 border-l-4 border-green-500 relative group hover:bg-[#1a1a1a] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Total Assets</span>
                <Shield size={14} className="text-green-500" />
              </div>
              <span className="text-2xl font-bold text-white block">$500k+ CAD</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                Must be verified by 3rd party forensic audit (KPMG/MNP). Crypto is often flagged.
              </p>
            </div>

            {/* 2. Liquidity */}
            <div className="bg-[#111] p-5 border-l-4 border-blue-500 relative group hover:bg-[#1a1a1a] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Liquid Capital</span>
                <Download size={14} className="text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-white block">$200k+ CAD</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                Cash available to deploy immediately. Real estate does not count as liquidity.
              </p>
            </div>

            {/* 3. Ownership */}
            <div className="bg-[#111] p-5 border-l-4 border-purple-500 relative group hover:bg-[#1a1a1a] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Equity Control</span>
                <Layers size={14} className="text-purple-500" />
              </div>
              <span className="text-2xl font-bold text-white block">33.3% Min</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                Or Senior Management experience (5+ years) if you don't own the business.
              </p>
            </div>

            {/* 4. The Trap (Presence) */}
            <div className="bg-[#111] p-5 border-l-4 border-red-500 relative group hover:bg-[#1a1a1a] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Active Mgmt</span>
                <MapPin size={14} className="text-red-500" />
              </div>
              <span className="text-2xl font-bold text-white block">75% Time</span>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                You must physically reside within 100km of your business. No "Passive Investment".
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 bg-white/5 p-3 rounded">
            <Scale size={12} />
            <span>NOTE: Skilled Workers (Talent Engine) do not need investment capital, only a Job Offer.</span>
          </div>
        </div>
      )
    },

    // SLIDE 3: THE MECHANISM (RE-ENGINEERED)
    {
      id: "MECH",
      title: "03 // THE ALGORITHM HACK",
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: The Logic */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Don't Compete.<br />
                <span className="text-blue-500">Override.</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                The Federal Express Entry system ranks you against 200,000+ others globally.
                If you aren't under 30 with a Master's degree and perfect English, you are invisible.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/5">
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Shield size={16} className="text-gray-500" /> The Federal Problem
                  </h4>
                  <p className="text-xs text-gray-500">
                    CRS Cut-off scores are consistently <strong>530+</strong>. Most qualified candidates naturally score <strong>440-480</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-900/10 border border-blue-500/30">
                  <h4 className="text-white font-bold text-sm mb-1 flex items-center gap-2">
                    <Target size={16} className="text-blue-400" /> The Provincial Solution
                  </h4>
                  <p className="text-xs text-blue-300/80">
                    Provinces don't care about the Federal cut-off. They can select you with a score as low as <strong>300</strong> if you fit their economy.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: The Simulation (Math Proof) */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>

              <div className="relative bg-[#050505] border border-white/10 rounded-2xl p-6 font-mono text-xs shadow-2xl">
                <div className="text-center text-gray-500 mb-6 border-b border-white/10 pb-2">
                     // CRS SCORE SIMULATION
                </div>

                {/* Scenario A: Alone */}
                <div className="mb-6 opacity-50 grayscale">
                  <div className="flex justify-between mb-1">
                    <span>Candidate Profile:</span>
                    <span>Master's / Age 34</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg mb-2">
                    <span>Standard Score:</span>
                    <span>472</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500 bg-red-900/10 px-3 py-2 rounded">
                    <Shield size={14} />
                    <span>RESULT: REJECTED (Cut-off 535)</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center my-4">
                  <div className="h-[1px] w-full bg-white/10"></div>
                  <span className="px-2 text-gray-600">+ PNP STRATEGY</span>
                  <div className="h-[1px] w-full bg-white/10"></div>
                </div>

                {/* Scenario B: With PNP */}
                <div className="relative">
                  <div className="absolute -left-2 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
                  <div className="pl-4">
                    <div className="flex justify-between mb-1 text-gray-300">
                      <span>Base Score:</span>
                      <span>472</span>
                    </div>
                    <div className="flex justify-between mb-2 text-blue-400 font-bold">
                      <span>Provincial Nomination:</span>
                      <span>+600</span>
                    </div>
                    <div className="flex justify-between text-white font-black text-3xl mb-3 tracking-tighter">
                      <span>TOTAL:</span>
                      <span>1072</span>
                    </div>
                    <div className="flex items-center gap-2 text-black bg-blue-500 px-3 py-2 rounded font-bold animate-pulse">
                      <Target size={14} />
                      <span>RESULT: INVITATION ISSUED</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )
    },

    // SLIDE 4: THE TARGETS (FINAL)
    {
      id: "TARGETS",
      title: "04 // STRATEGIC TARGETS",
      content: (
        <div className="h-full flex flex-col justify-center">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Select Your Battlefield</h2>
              <p className="text-gray-400 text-xs md:text-sm">Six primary zones offering the highest probability of nomination.</p>
            </div>
            {/* Legend */}
            <div className="hidden md:flex gap-3 text-[10px] font-mono uppercase text-gray-500 bg-white/5 px-3 py-1 rounded">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Tech Focus</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Family Tie</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Francophone</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto pb-4 pr-2 custom-scrollbar">

            {/* 1. ONTARIO (Tech) */}
            <div className="group bg-[#111] border border-white/10 hover:border-blue-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-900/50 text-blue-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Tech Draw
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity">ON</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ontario (OINP)</h3>
                  <p className="text-[10px] text-blue-400 font-mono">Stream: Human Capital</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Competition</span><span className="text-white">Very High</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-red-500 h-full w-[90%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Tech Score</span><span className="text-white">460 - 480 CRS</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> Software Engineers & Data Scientists. No job offer needed.
              </p>
            </div>

            {/* 2. BRITISH COLUMBIA (Tech) */}
            <div className="group bg-[#111] border border-white/10 hover:border-purple-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-900/50 text-purple-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Weekly Draws
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity">BC</div>
                <div>
                  <h3 className="text-lg font-bold text-white">British Columbia</h3>
                  <p className="text-[10px] text-purple-400 font-mono">Stream: Tech Pilot</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Speed</span><span className="text-white">Fastest</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[95%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Requirement</span><span className="text-white">Job Offer</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> 29 Priority Tech Occupations. Valid 1-year job offer required.
              </p>
            </div>

            {/* 3. ALBERTA (Tech) */}
            <div className="group bg-[#111] border border-white/10 hover:border-green-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-900/50 text-green-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Lowest Score
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-green-500 opacity-20 group-hover:opacity-100 transition-opacity">AB</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Alberta (AAIP)</h3>
                  <p className="text-[10px] text-green-400 font-mono">Stream: Accelerated Tech</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Difficulty</span><span className="text-white">Moderate</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[60%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Min Score</span><span className="text-white">300 CRS</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> Tech workers with a job offer. Lowest CRS cut-off in Canada.
              </p>
            </div>

            {/* 4. SASKATCHEWAN (Non-Tech) */}
            <div className="group bg-[#111] border border-white/10 hover:border-orange-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-900/50 text-orange-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Non-Tech
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-orange-500 opacity-20 group-hover:opacity-100 transition-opacity">SK</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Saskatchewan</h3>
                  <p className="text-[10px] text-orange-400 font-mono">Stream: Hard-to-Fill</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Language</span><span className="text-white">Low (CLB 4)</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[30%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Experience</span><span className="text-white">1 Year</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> Trades, Hospitality, Transport. Ideal for lower English scores.
              </p>
            </div>

            {/* 5. MANITOBA (Connection) */}
            <div className="group bg-[#111] border border-white/10 hover:border-cyan-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-900/50 text-cyan-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Connection
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-cyan-500 opacity-20 group-hover:opacity-100 transition-opacity">MB</div>
                <div>
                  <h3 className="text-lg font-bold text-white">Manitoba (MPNP)</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">Stream: Skilled Worker</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>Necessity</span><span className="text-white">Friend/Family</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-red-500 h-full w-[80%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Draws</span><span className="text-white">Regular</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> Candidates with a "Supporter" (Close friend/relative) in Manitoba.
              </p>
            </div>

            {/* 6. NEW BRUNSWICK (French) */}
            <div className="group bg-[#111] border border-white/10 hover:border-pink-500 p-5 rounded-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-pink-900/50 text-pink-300 text-[10px] font-bold px-3 py-1 uppercase rounded-bl-lg backdrop-blur-md">
                Bilingual
              </div>
              <div className="flex items-start gap-4 mb-3">
                <div className="text-3xl font-black text-pink-500 opacity-20 group-hover:opacity-100 transition-opacity">NB</div>
                <div>
                  <h3 className="text-lg font-bold text-white">New Brunswick</h3>
                  <p className="text-[10px] text-pink-400 font-mono">Stream: Strategic Initiative</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] text-gray-400"><span>French</span><span className="text-white">Huge Boost</span></div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full w-[50%]"></div></div>
                <div className="flex justify-between text-[10px] text-gray-400"><span>Events</span><span className="text-white">Online Job Fairs</span></div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed border-t border-white/10 pt-2">
                🎯 <strong>Target:</strong> Francophones (NCLC 5+) or those who attend NB recruitment events.
              </p>
            </div>

          </div>
        </div>
      )
    },



    // SLIDE 5: TIMELINE (RE-DESIGNED)
    {
      id: "EXEC",
      title: "05 // EXECUTION PROTOCOL",
      content: (
        <div className="h-full flex flex-col justify-center relative">
          {/* Background Deco */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

          <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
            <span className="text-blue-500">⚡</span> The Sequence
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full overflow-y-auto pr-4">

            {/* Left: The Steps */}
            <div className="space-y-6">

              {/* Step 1 */}
              <div className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 transition-all cursor-default">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Layers size={20} />
                  </div>
                  <div className="w-[1px] h-full bg-white/10 group-hover:bg-blue-500/50"></div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Phase 1: Strategic Injection (EOI)</h4>
                  <p className="text-xs text-gray-400 font-mono mt-1 mb-2">⏱ Timeline: Day 0-14</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    We don't just "apply". We engineer your profile. We map your NOC code to specific provincial shortages (e.g., Tech in BC, Health in ON) and submit an
                    <strong> Expression of Interest</strong> into the pool.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">📝 Profile Scoring</span>
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">🎯 NOC Selection</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all cursor-default">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center text-yellow-400 border border-yellow-500/30">
                    <FileText size={20} />
                  </div>
                  <div className="w-[1px] h-full bg-white/10 group-hover:bg-yellow-500/50"></div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Phase 2: The Golden Ticket (NOI)</h4>
                  <p className="text-xs text-gray-400 font-mono mt-1 mb-2">⏱ Timeline: 1-3 Months</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    The Province selects you. You receive a <strong>Notification of Interest (NOI)</strong>.
                    This is the critical "Win". You now have 45-60 days to submit a full, audit-proof legal application package to the province.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">📩 Invitation Recieved</span>
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">⚖️ Doc Submission</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500 hover:bg-green-500/10 transition-all cursor-default">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 border border-green-500/30">
                    <Target size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Phase 3: The Federal Boost (+600)</h4>
                  <p className="text-xs text-gray-400 font-mono mt-1 mb-2">⏱ Timeline: 3-6 Months</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Upon provincial approval, you receive the <strong>Nomination Certificate</strong>.
                    You upload this to your Express Entry profile. Your score jumps by exactly <span className="text-green-400 font-bold">+600 points</span>.
                    Federal ITA is now mathematically guaranteed.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">✅ Nomination Issued</span>
                    <span className="text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-gray-400">🍁 PR Application</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: The Visual / Terminal */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black rounded-2xl border border-white/10 p-6 flex flex-col font-mono text-xs overflow-hidden">

                {/* Fake Terminal Header */}
                <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-auto text-gray-500">admin@ashavid-console ~ %</span>
                </div>

                {/* Terminal Output */}
                <div className="space-y-4 text-green-400/80">
                  <p>
                    <span className="text-blue-400">➜</span> Initializing Candidate Assessment...<br />
                    <span className="text-gray-500">[OK] Human Capital Factors Verified.</span>
                  </p>
                  <p>
                    <span className="text-blue-400">➜</span> Scanning Provincial Streams...<br />
                    <span className="text-white">  ├── Ontario Tech Draw</span> <span className="text-yellow-500">[MATCH]</span><br />
                    <span className="text-gray-500">  ├── BC PNP Tech Pilot</span> [PENDING]<br />
                    <span className="text-gray-500">  └── Alberta Express Entry</span> [LOW PROBABILITY]
                  </p>
                  <p>
                    <span className="text-blue-400">➜</span> Simulating CRS Impact...<br />
                    <span className="text-gray-500">  Current Score: 410</span><br />
                    <span className="text-white">  After Nomination: 1010</span> <span className="text-green-500 blink"> [GUARANTEED]</span>
                  </p>
                  <div className="mt-8 p-4 bg-green-900/20 border border-green-500/50 rounded text-center">
                    STATUS: READY FOR DEPLOYMENT
                  </div>
                </div>

                {/* Abstract Map Overlay */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
                  <Map size={256} />
                </div>
              </div>
            </div>

          </div>
        </div>
      )
    },

    // SLIDE 6: ACTION (FINAL LAUNCH)
    {
      id: "ACTION",
      title: "06 // FINAL AUTHORIZATION",
      content: (
        <div className="h-full flex flex-col justify-center items-center relative">

          {/* Background Grid pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] animate-pulse"></div>

          <div className="relative z-10 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl">

            {/* Status Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                </div>
                <span className="font-mono text-xs text-green-400 font-bold tracking-widest">SYSTEM ONLINE</span>
              </div>
              <span className="font-mono text-xs text-gray-600">ID: GUEST_USER</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center leading-tight">
              Initialize <br />
              <span className="text-blue-500">Your Protocol.</span>
            </h2>

            <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
              You are one click away from generating your provincial strategy matrix.
              Data encryption active. No obligations.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setAssessmentOpen(true)} // <--- تغییر این خط
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-center py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-widest text-sm"
              >
                Start Assessment Sequence
              </button>
              <button className="block w-full bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold py-4 rounded-lg transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                <Download size={14} /> Download Field Manual (PDF)
              </button>
            </div>

          </div>
          {/* =========================================
          4. ASSESSMENT OVERLAY (FULL SCREEN)
      ========================================= */}
          {assessmentOpen && (
            <div className="fixed inset-0 z-[60] bg-[#F2F0E9] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500">

              {/* Close Button Header */}
              <div className="sticky top-0 left-0 w-full bg-[#F2F0E9]/90 backdrop-blur-md border-b border-[#1a1a1a]/10 p-4 flex justify-between items-center z-50">
                <span className="font-sans text-xs font-bold text-[#1a1a1a]/40 uppercase tracking-widest">
                  Ashavid Eligibility Engine
                </span>
                <button
                  onClick={() => setAssessmentOpen(false)}
                  className="flex items-center gap-2 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F2F0E9] px-4 py-2 rounded-full transition-colors font-bold text-xs uppercase tracking-wider border border-[#1a1a1a]/10"
                >
                  <X size={16} /> Close
                </button>
              </div>

              {/* The Form Container */}
              <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
                <div className="w-full">
                  <div className="text-center mb-12">
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#1a1a1a]">The Suitability Engine</h2>
                    <p className="font-sans text-[#1a1a1a]/60">Complete the diagnostic to unlock your report.</p>
                  </div>

                  {/* The StrategicAssessment Component */}
                  <StrategicAssessment />

                </div>
              </div>

            </div>
          )}
        </div>
      )
    }



  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col md:flex-row overflow-hidden">

      {/* Styles for animation */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>

      {/* 1. LEFT SIDEBAR / NAV (Desktop) - RE-DESIGNED */}
      <div className="hidden md:flex w-24 border-r border-white/10 flex-col justify-between py-10 items-center bg-[#050505] z-50">

        {/* Top: Indicator */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-blue-500 font-mono">PNP</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-blue-500 to-transparent"></div>
        </div>

        {/* Middle: Navigation Steps */}
        <div className="flex flex-col gap-6 relative">

          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5"></div>

          {slides.map((slide, idx) => (
            <div key={idx} className="relative group">
              <button
                onClick={() => setActiveSlide(idx)}
                className={`relative z-10 w-2.5 h-2.5 transition-all duration-300 border ${activeSlide === idx
                  ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] scale-125'
                  : 'bg-[#050505] border-gray-600 hover:border-white hover:bg-white'
                  }`}
                style={{ borderRadius: '1px' }} // Square aesthetic
              />

              {/* Hover Label (Tooltip) */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-white text-black px-2 py-1 text-[9px] font-bold font-mono uppercase tracking-widest border-l-2 border-blue-500">
                  {slide.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Versioning */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-[1px] bg-gradient-to-t from-gray-800 to-transparent"></div>
          <div className="text-[9px] text-gray-600 font-mono uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
            REF: 2026-X
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 relative flex flex-col">

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-white/10">
          <span className="font-bold">PNP BROCHURE</span>
          <span className="text-xs text-gray-500">{activeSlide + 1} / {totalSlides}</span>
        </div>

        {/* Dynamic Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Slide Content */}
        <div className="flex-1 p-6 md:p-16 relative z-10 overflow-y-auto">
          {/* Section Label */}
          {slides[activeSlide].title && (
            <div className="absolute top-8 left-8 md:left-16 text-xs font-mono text-blue-400 tracking-widest uppercase">
              {slides[activeSlide].title}
            </div>
          )}

          {/* Animated Render */}
          <div key={activeSlide} className="h-full animate-fade-in-up">
            {slides[activeSlide].content}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="bg-[#0a0a0a] border-t border-white/10 p-4 md:p-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="h-12 w-[1px] bg-white/10 mx-2 hidden md:block"></div>
            <div className="hidden md:block">
              <div className="text-xs text-gray-500 uppercase">Current Section</div>
              <div className="font-bold text-sm">{slides[activeSlide].id}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-8 max-w-xs hidden md:block">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white text-black px-6 py-3 rounded font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
            >
              {activeSlide === totalSlides - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

