// ============================================================================
// Component: components/Header.tsx
// Style: Editorial / Art Gallery
// Behavior: Color inversion on scroll (Ink on Paper -> Paper on Ink)
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Advisory' },
    { href: '/programs', label: 'Programs' },
    { href: '/about', label: 'The Firm' },
  ];

  // Helper to determine text color based on scroll state
  const getTextColor = () => {
    if (mobileMenuOpen) return 'text-[#F2F0E9]'; // Always white in mobile menu
    if (scrolled) return 'text-[#F2F0E9]'; // White when scrolled (dark bg)
    return 'text-[#1a1a1a]'; // Black when top (light bg)
  };

  const getHoverColor = () => {
    if (scrolled || mobileMenuOpen) return 'hover:text-[#CCFF00]';
    return 'hover:text-[#1a1a1a]/60';
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          scrolled
            ? 'bg-[#1a1a1a] py-4 shadow-2xl border-b border-[#CCFF00]/20'
            : 'bg-transparent py-8 md:py-10'
        }`}
      >
        <nav className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
            
            {/* 1. BRAND LOGO */}
            <Link href="/" className="relative z-50 group">
              <span className={`font-serif text-3xl font-bold tracking-tight transition-colors duration-300 ${getTextColor()}`}>
                S V R
                <span className={`text-[#CCFF00] ${scrolled ? 'opacity-100' : 'opacity-0'} transition-opacity`}>.</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-sans text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${getTextColor()} ${getHoverColor()}`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#CCFF00]"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* 3. CTA & MENU TOGGLE */}
            <div className="flex items-center gap-6">
                
                {/* Desktop CTA */}
                <Link 
                    href="/contact" 
                    className={`hidden lg:flex items-center gap-3 font-sans text-xs font-bold uppercase tracking-widest px-6 py-3 border transition-all duration-300 group
                    ${scrolled 
                        ? 'border-[#CCFF00] text-[#1a1a1a] bg-[#CCFF00] hover:bg-white hover:border-white' 
                        : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00]'
                    }`}
                >
                    Start
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`relative z-50 p-1 transition-colors duration-300 ${getTextColor()}`}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-8 h-8 text-[#F2F0E9] hover:text-[#CCFF00] transition-colors" />
                    ) : (
                        <Menu className={`w-8 h-8 hover:scale-110 transition-transform`} />
                    )}
                </button>
            </div>
        </nav>
      </header>

      {/* 4. MOBILE MENU OVERLAY (The Magazine Cover Look) */}
      <div 
        className={`fixed inset-0 z-40 bg-[#1a1a1a] transition-all duration-700 cubic-bezier(0.76, 0, 0.24, 1) ${
          mobileMenuOpen ? 'clip-path-open' : 'clip-path-closed'
        }`}
        style={{
            clipPath: mobileMenuOpen 
                ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' 
                : 'polygon(0 0, 100% 0, 100% 0, 0 0)'
        }}
      >
        <div className="flex flex-col justify-between h-full px-6 pt-32 pb-12 container mx-auto">
            
            {/* Links */}
            <nav className="flex flex-col space-y-2">
                {navLinks.map((link, idx) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-baseline gap-4 border-b border-[#F2F0E9]/10 py-6"
                >
                    <span className="font-sans text-xs font-bold text-[#CCFF00]">0{idx + 1}</span>
                    <span className="font-serif text-5xl md:text-7xl text-[#F2F0E9] group-hover:text-[#CCFF00] group-hover:italic transition-all duration-300">
                        {link.label}
                    </span>
                </Link>
                ))}
            </nav>

            {/* Bottom Info */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="text-[#F2F0E9]/50 font-sans text-xs uppercase tracking-widest leading-loose">
                    Global Advisory<br/>
                    Est. 2024
                </div>
                <Link 
                    href="/contact"
                    className="w-full md:w-auto bg-[#CCFF00] text-[#1a1a1a] font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-colors text-center"
                >
                    Book Consultation
                </Link>
            </div>
        </div>
      </div>
    </>
  );
}