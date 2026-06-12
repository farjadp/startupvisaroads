// ============================================================================
// Component: components/Header.tsx
// Style: Editorial / Art Gallery
// Structure: Full Navigation Map matched to File System
// ============================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/navigation'; // Use internationalized navigation
import { Menu, X, ArrowRight, ChevronDown, User, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false); // State for language dropdown

  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // State for mobile sub-menu toggles
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  // Close dropdown when clicking outside
  const langMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setLangMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangMenuOpen(false);
  };

  // ==========================================
  // NAVIGATION DATA STRUCTURE
  // ==========================================
  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('advisory') },
    {
      label: t('jurisdictions'),
      key: 'jurisdictions',
      subLinks: [
        { header: t('canada') },
        { href: '/country/canada', label: t('canada_profile') },
        { href: '/startup-visa-canada', label: t('suv') },
        { href: '/pnp', label: t('pnp') },

        { header: t('usa') },
        { href: '/country/usa', label: t('usa_profile') },
        { href: '/usa/eb2-niw', label: t('eb2') },
        { href: '/usa/eb1', label: t('eb1') },

        { header: t('europe') },
        { href: '/country/denmark', label: t('denmark') },
        { href: '/country/finland', label: t('finland') },
        { href: '/europe/netherlands', label: t('netherlands') },

        { header: t('global') },
        { href: '/country/uae', label: t('uae') },
        { href: '/australia/entrepreneur-stream', label: t('australia') },
        { href: '/country', label: t('view_all') },
      ]
    },
    { href: '/mentorship', label: t('mentorship') },
    { href: '/blog', label: t('blog') },
    {
      label: t('firm'),
      key: 'firm',
      subLinks: [
        { href: '/about', label: t('our_story') },
        { href: '/contact', label: t('contact') },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${scrolled
            ? 'dir-ltr bg-[#1a1a1a] py-4 shadow-2xl border-b border-[#CCFF00]/20'
            : 'dir-ltr bg-transparent py-8 md:py-10'
          }`}
      >
        <nav className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* 1. BRAND LOGO */}
          <Link href="/" className="relative z-50 group">
            <span className={`font-serif text-3xl font-bold tracking-tight transition-colors duration-300 ${getTextColor()}`}>
              Visa Roads Inc.
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
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
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
                  <div className="absolute top-full rtl:right-1/2 rtl:translate-x-1/2 ltr:left-1/2 ltr:-translate-x-1/2 pt-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-start">
                    <div className="bg-[#1a1a1a] border-t-2 border-[#CCFF00] p-8 min-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative max-h-[80vh] overflow-y-auto">
                      <div className="flex flex-col gap-3">
                        {link.subLinks.map((sub, i) => (
                          sub.header ? (
                            <div key={i} className="mt-4 first:mt-0 pb-1 mb-1 border-b border-[#F2F0E9]/10">
                              <span className="font-sans text-[10px] text-[#CCFF00] uppercase tracking-widest block select-none">
                                {sub.header}
                              </span>
                            </div>
                          ) : (
                            <Link
                              key={sub.href}
                              href={sub.href!}
                              className="font-serif text-lg text-[#F2F0E9] hover:text-[#CCFF00] hover:translate-x-2 rtl:hover:-translate-x-2 transition-all block whitespace-nowrap opacity-80 hover:opacity-100"
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

            {/* Language / Globe Dropdown - Replaces previous LanguageSwitcher and Map Link */}
            <div className="hidden lg:block relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`p-2 rounded-full border transition-all hover:bg-[#CCFF00] hover:text-[#1a1a1a] hover:border-[#CCFF00] ${getBorderColor()} ${getTextColor()} ${langMenuOpen ? 'bg-[#CCFF00] text-[#1a1a1a] border-[#CCFF00]' : ''}`}
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Dropdown Box */}
              <div className={`absolute top-full right-0 mt-4 min-w-[140px] bg-[#1a1a1a] border-t-2 border-[#CCFF00] shadow-2xl p-4 transition-all duration-300 ${langMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => switchLocale('en')}
                    className={`text-start font-sans text-xs font-bold uppercase tracking-widest py-2 px-2 transition-colors ${locale === 'en' ? 'text-[#CCFF00]' : 'text-[#F2F0E9] hover:text-[#CCFF00]/70'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLocale('fa')}
                    className={`text-start font-sans text-xs font-bold uppercase tracking-widest py-2 px-2 transition-colors ${locale === 'fa' ? 'text-[#CCFF00]' : 'text-[#F2F0E9] hover:text-[#CCFF00]/70'}`}
                  >
                    Farsi (فارسی)
                  </button>
                </div>
              </div>
            </div>

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
              {t('contact')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
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
        className={`fixed inset-0 z-40 bg-[#1a1a1a] transition-all duration-700 cubic-bezier(0.76, 0, 0.24, 1) ${mobileMenuOpen ? 'clip-path-open' : 'clip-path-closed'
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
                      className="w-full flex items-baseline justify-between gap-4 group text-start"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-sans text-xs font-bold text-[#CCFF00]">0{idx + 1}</span>
                        <span className={`font-serif text-4xl md:text-5xl transition-colors ${expandedMobileMenu === link.key ? 'text-[#CCFF00]' : 'text-[#F2F0E9]'}`}>
                          {link.label}
                        </span>
                      </span>
                      <ChevronDown className={`w-6 h-6 text-[#F2F0E9] transition-transform duration-300 ${expandedMobileMenu === link.key ? 'rotate-180 text-[#CCFF00]' : ''}`} />
                    </button>

                    {/* Sub-menu Links */}
                    <div className={`overflow-hidden transition-all duration-500 ${expandedMobileMenu === link.key ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-12 flex flex-col gap-3 border-l border-[#F2F0E9]/10 ml-2 border-s border-e-0 rtl:mr-2 rtl:ml-0 rtl:border-r rtl:border-l-0 rtl:pr-12 rtl:pl-0">
                        {link.subLinks.map((sub, i) => (
                          sub.header ? (
                            <span key={i} className="font-sans text-[10px] text-[#CCFF00]/70 uppercase tracking-widest mt-4 first:mt-0">
                              {sub.header}
                            </span>
                          ) : (
                            <Link
                              key={sub.href}
                              href={sub.href!}
                              className="font-serif text-lg text-[#F2F0E9] hover:text-[#CCFF00] transition-colors"
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
                    <span className="font-serif text-4xl md:text-5xl text-[#F2F0E9] group-hover:text-[#CCFF00] group-hover:italic transition-all duration-300">
                      {link.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mt-12">
            <div className="flex gap-4 items-center">
              <Link href="/login" className="text-[#F2F0E9] font-sans text-xs uppercase tracking-widest border border-[#F2F0E9]/30 px-6 py-3 hover:bg-[#F2F0E9] hover:text-[#1a1a1a] transition-colors">
                {t('client_login')}
              </Link>
            </div>
            {/* Mobile Language Switcher (Simple) */}
            <div className="lg:hidden flex gap-4">
              <button onClick={() => switchLocale('en')} className={`${locale === 'en' ? 'text-[#CCFF00]' : 'text-[#F2F0E9]'}`}>EN</button>
              <span className="text-[#F2F0E9]/20">/</span>
              <button onClick={() => switchLocale('fa')} className={`${locale === 'fa' ? 'text-[#CCFF00]' : 'text-[#F2F0E9]'}`}>FA</button>
            </div>

            <Link
              href="/contact"
              className="w-full md:w-auto bg-[#CCFF00] text-[#1a1a1a] font-sans text-sm font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-colors text-center"
            >
              {t('book_consultation')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}