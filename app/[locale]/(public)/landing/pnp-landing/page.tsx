// ============================================================================
// Page: app/campaigns/pnp-signal/page.tsx
// Style: Analog Horror / "The Signal"
// Concept: Cold War Terminal, Decryption, Story-driven
// ============================================================================

"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Unlock, Radio, Crosshair, FileText, Send } from 'lucide-react';

export default function PNPSignalPage() {
  const [phase, setPhase] = useState<"LOCKED" | "DECRYPTING" | "ACCESS_GRANTED">("LOCKED");
  const [glitch, setGlitch] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  
  // Typing effect text
  const fullText = "FEDERAL GRID COMPROMISED. CRS 535+ UNATTAINABLE. REROUTING TO PROVINCIAL CHANNELS...";

  // Typing animation
  useEffect(() => {
    if (phase === "DECRYPTING" && textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (textIndex >= fullText.length) {
      setTimeout(() => setPhase("ACCESS_GRANTED"), 800);
    }
  }, [textIndex, phase]);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDecrypt = () => {
    setPhase("DECRYPTING");
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#ffb000] font-mono overflow-hidden relative selection:bg-[#ffb000] selection:text-black ${glitch ? 'translate-x-1' : ''}`}>
      
      {/* --- CRT OVERLAY EFFECTS --- */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-b from-transparent via-[#ffb000]/5 to-transparent bg-[length:100%_4px] animate-scanline"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"></div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="relative z-10 h-screen flex flex-col p-6 md:p-12 max-w-5xl mx-auto">
        
        {/* TOP BAR */}
        <header className="flex justify-between items-center border-b border-[#ffb000]/30 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 ${phase === "LOCKED" ? "animate-pulse" : ""}`} />
            <span className="text-xs tracking-widest uppercase">Signal: {phase === "ACCESS_GRANTED" ? "ESTABLISHED" : "INTERCEPTED"}</span>
          </div>
          <div className="text-xs opacity-50">
            LOC: CANADA_SECURE_NET // 45.4215° N
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-grow flex flex-col justify-center">
          
          {/* PHASE 1: LOCKED */}
          {phase === "LOCKED" && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="inline-block border border-[#ffb000] p-8 relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-l border-t border-[#ffb000]"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-[#ffb000]"></div>
                
                <Lock className="w-16 h-16 mx-auto mb-6 text-[#ffb000]" />
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">
                  RESTRICTED ACCESS
                </h1>
                <p className="text-sm md:text-lg opacity-80 max-w-lg mx-auto mb-8">
                  The information regarding provincial backdoors is classified. 
                  CRS scores below 500 require manual override.
                </p>
                
                <button 
                  onClick={handleDecrypt}
                  className="bg-[#ffb000] text-black px-8 py-4 font-bold uppercase hover:bg-white transition-colors flex items-center gap-2 mx-auto animate-pulse"
                >
                  <Terminal size={18} />
                  Initiate Decryption
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: DECRYPTING */}
          {phase === "DECRYPTING" && (
            <div className="max-w-2xl mx-auto w-full">
              <div className="font-mono text-xl md:text-2xl leading-relaxed text-[#ffb000] h-48">
                {fullText.slice(0, textIndex)}
                <span className="animate-blink inline-block w-3 h-6 bg-[#ffb000] ml-1 align-middle"></span>
              </div>
              <div className="w-full bg-[#ffb000]/20 h-1 mt-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#ffb000] transition-all duration-300" style={{ width: `${(textIndex / fullText.length) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-xs mt-2 opacity-50 uppercase">
                <span>Loading Protocols...</span>
                <span>{Math.round((textIndex / fullText.length) * 100)}%</span>
              </div>
            </div>
          )}

          {/* PHASE 3: THE DASHBOARD */}
          {phase === "ACCESS_GRANTED" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
              
              {/* LEFT: INTEL */}
              <div className="space-y-8 border-r border-[#ffb000]/20 pr-0 md:pr-8">
                <div>
                  <h2 className="text-2xl font-bold uppercase mb-4 flex items-center gap-2">
                    <Crosshair size={20} /> Target Acquisition
                  </h2>
                  <p className="text-sm opacity-80 leading-relaxed text-justify">
                    Federal selection is statistically improbable. We have identified (4) provincial streams operating with lower thresholds. These streams are time-sensitive.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { code: "OINP-TECH", stat: "ACTIVE", val: "<400 CRS" },
                    { code: "BC-PNP", stat: "WEEKLY", val: "Tech Pilot" },
                    { code: "AAIP-RURAL", stat: "URGENT", val: "No Score" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border border-[#ffb000]/30 p-4 hover:bg-[#ffb000]/10 cursor-crosshair transition-all">
                      <span className="font-bold">{item.code}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="opacity-60">[{item.stat}]</span>
                        <span className="text-white bg-[#ffb000]/20 px-1">{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: ACTION */}
              <div className="flex flex-col justify-center pl-0 md:pl-4">
                <div className="bg-[#ffb000]/5 border border-[#ffb000] p-6 relative">
                  <div className="absolute top-0 right-0 bg-[#ffb000] text-black text-[10px] px-2 py-1 font-bold">
                    SECURE CHANNEL
                  </div>
                  
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <FileText size={16} />
                    Submit Credentials
                  </h3>
                  
                  <form className="space-y-4">
                    <div className="relative group">
                      <span className="absolute left-3 top-3 text-[#ffb000]/50 text-xs">&gt;</span>
                      <input type="text" placeholder="CODENAME (NAME)" className="w-full bg-black border-b border-[#ffb000]/50 p-2 pl-6 outline-none focus:border-[#ffb000] text-[#ffb000] placeholder-[#ffb000]/30 font-mono uppercase" />
                    </div>
                    
                    <div className="relative group">
                      <span className="absolute left-3 top-3 text-[#ffb000]/50 text-xs">&gt;</span>
                      <input type="text" placeholder="FREQUENCY (EMAIL)" className="w-full bg-black border-b border-[#ffb000]/50 p-2 pl-6 outline-none focus:border-[#ffb000] text-[#ffb000] placeholder-[#ffb000]/30 font-mono uppercase" />
                    </div>

                    <div className="pt-4">
                      <button type="button" className="w-full bg-[#ffb000] text-black font-bold py-3 hover:bg-white transition-colors flex justify-center items-center gap-2 uppercase tracking-widest text-sm">
                        Transmit Data <Send size={14} />
                      </button>
                    </div>
                  </form>

                  <p className="mt-4 text-[10px] opacity-40 text-center">
                    // DATA WILL BE AUTOMATICALLY PURGED AFTER ANALYSIS
                  </p>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-[#ffb000]/30 pt-4 flex justify-between text-[10px] opacity-60 uppercase">
          <div>System: v.2.0.4</div>
          <div className="flex gap-4">
            <span>Latency: 12ms</span>
            <span>Encryption: ON</span>
          </div>
        </footer>

      </div>

      {/* CSS for Scanlines and Animations */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}