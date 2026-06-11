import React from 'react';
import { Bell, Search } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-20 bg-[#F2F0E9] border-b border-[#1a1a1a]/10 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/40" />
          <input 
            type="text" 
            placeholder="Search clients, applications..." 
            className="w-full bg-white border border-[#1a1a1a]/10 rounded-full py-2 pl-10 pr-4 font-sans text-sm focus:outline-none focus:border-[#1a1a1a]/30 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f97316] rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-[#1a1a1a]/10 pl-6">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#CCFF00] flex items-center justify-center font-sans text-xs font-bold">
            AD
          </div>
          <div className="font-sans text-sm">
            <p className="font-bold text-[#1a1a1a] leading-none">Admin User</p>
            <p className="text-[#1a1a1a]/50 text-xs">Superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
