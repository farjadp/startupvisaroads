// ============================================================================
// Component: components/Header.tsx
// Style: Editorial / Art Gallery
// Structure: Full Navigation Map matched to File System
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ChevronDown, User } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // State for mobile sub-menu toggles
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  
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
    setExpandedMobileMenu(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // ==========================================
  // NAVIGATION DATA STRUCTURE
  // ==========================================
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Advisory' },
    { href: '/mentorship', label: 'Mentorship' },
    { 
      label: 'Jurisdictions',
      key: 'jurisdictions',
      subLinks: [
        { header: 'North America' },
        { href: '/startup-visa-canada', label: 'Canada (SUV)' },
        { href: '/usa/eb1', label: 'USA (EB-1A)' },
        { href: '/usa/eb2-niw', label: 'USA (NIW)' },
        { href: '/usa/eb5', label: 'USA (EB-5)' },
        { header: 'EMEA' },
        { href: '/uae/golden-visa', label: 'UAE Golden Visa' },
        { href: '/europe/netherlands', label: 'Netherlands' },
        { href: '/europe/denmark', label: 'Denmark' },
        { href: '/europe/finland', label: 'Finland' },
      ]
    },
    { 
      label: 'The Firm',
      key: 'firm',
      subLinks: [
        { href: '/about', label: 'Our Story' },
        { href: '/blog', label: 'Journal' },
        { href: '/contact', label: 'Contact' },
      ]
    },
  ];

  // Colors Helper
  const getTextColor = () => {
    if (mobileMenuOpen) return 'text-[#F2F0E9]';
    if (scrolled) return 'text-[#F2F0E9]';
    return 'text-[#1a1a1a]';
  };

  const getBorderColor = () => {
    if (mobileMenuOpen) return 'border-[#F2F0E9]/20';
    if (scrolled) return 'border-[#F2F0E9]/20';
    return 'border-[#1a1a1a]/20';
  };

  const isActive = (href: string) => pathname === href;

  const toggleMobileSubMenu = (key: string) => {
    if (expandedMobileMenu === key) {
      setExpandedMobileMenu(null);
    } else {
      setExpandedMobileMenu(key);
    }
  };

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
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group">
                    {link.subLinks ? (
                        // Dropdown Trigger
                        <button className={`flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 cursor-pointer ${getTextColor()} hover:text-[#CCFF00]`}>
                            {link.label}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                    ) : (
                        // Normal Link
                        <Link
                            href={link.href!}
                            className={`relative font-sans text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${getTextColor()} hover:text-[#CCFF00]`}
                        >
                            {link.label}
                            {isActive(link.href!) && (
                                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#CCFF00]"></span>
                            )}
                        </Link>
                    )}

                    {/* Dropdown Menu (Desktop) */}
                    {link.subLinks && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-[#1a1a1a] border-t-2 border-[#CCFF00] p-8 min-w-[260px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                                <div className="flex flex-col gap-3">
                                    {link.subLinks.map((sub, i) => (
                                        sub.header ? (
                                            <span key={i} className="font-sans text-[10px] text-[#CCFF00] uppercase tracking-widest mt-3 mb-1 block select-none">
                                                {sub.header}
                                            </span>
                                        ) : (
                                            <Link 
                                                key={sub.href} 
                                                href={sub.href!}
                                                className="font-serif text-lg text-[#F2F0E9] hover:text-[#CCFF00] hover:translate-x-2 transition-all block whitespace-nowrap"
                                            >
                                                {sub.label}
                                            </Link>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              ))}
            </div>

            {/* 3. CTA & ACTIONS */}
            <div className="flex items-center gap-6">
                
                {/* Login Icon */}
                <Link href="/login" className={`hidden lg:block p-2 rounded-full border transition-all hover:bg-[#CCFF00] hover:text-[#1a1a1a] hover:border-[#CCFF00] ${getBorderColor()} ${getTextColor()}`}>
                    <User className="w-4 h-4" />
                </Link>

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

      {/* 4. MOBILE MENU OVERLAY */}
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
        <div className="flex flex-col h-full px-6 pt-32 pb-12 container mx-auto overflow-y-auto">
            
            {/* Links */}
            <nav className="flex flex-col space-y-6 mb-auto">
                {navLinks.map((link, idx) => (
                    <div key={link.label} className="border-b border-[#F2F0E9]/10 pb-4">
                        {link.subLinks ? (
                            // Mobile Dropdown Item
                            <div>
                                <button 
                                    onClick={() => toggleMobileSubMenu(link.key!)}
                                    className="w-full flex items-baseline justify-between gap-4 group text-left"
                                >
                                    <span className="flex items-baseline gap-4">
                                        <span className="font-sans text-xs font-bold text-[#CCFF00]">0{idx + 1}</span>
                                        <span className={`font-serif text-4xl md:text-6xl transition-colors ${expandedMobileMenu === link.key ? 'text-[#CCFF00]' : 'text-[#F2F0E9]'}`}>
                                            {link.label}
                                        </span>
                                    </span>
                                    <ChevronDown className={`w-6 h-6 text-[#F2F0E9] transition-transform duration-300 ${expandedMobileMenu === link.key ? 'rotate-180 text-[#CCFF00]' : ''}`} />
                                </button>
                                
                                {/* Sub-menu Links */}
                                <div className={`overflow-hidden transition-all duration-500 ${expandedMobileMenu === link.key ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-12 flex flex-col gap-4 border-l border-[#F2F0E9]/10 ml-2">
                                        {link.subLinks.map((sub, i) => (
                                            sub.header ? (
                                                <span key={i} className="font-sans text-xs text-[#CCFF00]/50 uppercase tracking-widest mt-2">
                                                    {sub.header}
                                                </span>
                                            ) : (
                                                <Link 
                                                    key={sub.href} 
                                                    href={sub.href!}
                                                    className="font-serif text-xl text-[#F2F0E9] hover:text-[#CCFF00] transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Normal Mobile Link
                            <Link
                                href={link.href!}
                                className="group flex items-baseline gap-4"
                            >
                                <span className="font-sans text-xs font-bold text-[#CCFF00]">0{idx + 1}</span>
                                <span className="font-serif text-4xl md:text-6xl text-[#F2F0E9] group-hover:text-[#CCFF00] group-hover:italic transition-all duration-300">
                                    {link.label}
                                </span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* Bottom Info */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mt-12">
                <div className="flex gap-4">
                    <Link href="/login" className="text-[#F2F0E9] font-sans text-xs uppercase tracking-widest border border-[#F2F0E9]/30 px-6 py-3 hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors">
                        Client Login
                    </Link>
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