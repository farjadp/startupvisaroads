'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BookOpen, Sparkles } from 'lucide-react';

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/en/admin/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <aside className="w-64 bg-[#1a1a1a] text-[#F2F0E9] min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-[#333]">
      <div className="p-6 border-b border-[#333]">
        <Link href="/en/admin" className="font-serif text-2xl font-bold tracking-tight text-[#CCFF00]">
          S V R . <span className="text-sm font-sans font-normal text-white/50 tracking-widest uppercase ml-2">Console</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2 font-sans text-sm">
        <Link href="/en/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#CCFF00]/10 text-[#CCFF00]">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/en/admin/applications" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
          <FileText className="w-5 h-5" />
          Applications
        </Link>
        <Link href="/en/admin/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
          <Users className="w-5 h-5" />
          Clients
        </Link>
        <Link href="/en/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
          <BookOpen className="w-5 h-5" />
          Articles
        </Link>
        <Link href="/en/admin/ai-writer" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-[#CCFF00] hover:text-[#CCFF00] transition-colors border border-[#CCFF00]/20 bg-[#CCFF00]/5">
          <Sparkles className="w-5 h-5" />
          AI Writer
        </Link>
        <Link href="/en/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-[#333]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors font-sans text-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
