import React from 'react';
import { Users, FileText, Activity, Eye, ArrowUpRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  let totalViews = 0;
  let topPages: Array<{ path: string; _count: { path: number } }> = [];
  let dataWarning: string | null = null;

  try {
    totalViews = await prisma.pageView.count();
    const groupedPages = await prisma.pageView.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });
    topPages = groupedPages as Array<{ path: string; _count: { path: number } }>;
  } catch (error) {
    console.error('Admin dashboard analytics query failed:', error);
    dataWarning = 'Analytics data is temporarily unavailable. Authentication and admin navigation still work.';
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Dashboard Overview</h1>
          <p className="font-sans text-[#1a1a1a]/60">Real-time statistics and analytics.</p>
        </div>
      </div>

      {dataWarning && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          {dataWarning}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">Live Data</span>
          </div>
          <div>
            <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">Total Page Views</p>
            <h3 className="font-serif text-4xl text-[#1a1a1a]">{totalViews}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">Total Active Clients</p>
            <h3 className="font-serif text-4xl text-[#1a1a1a]">142</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">Pending Applications</p>
            <h3 className="font-serif text-4xl text-[#1a1a1a]">38</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-[#CCFF00]/20 text-[#1a1a1a] rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">System Health</p>
            <h3 className="font-serif text-4xl text-[#1a1a1a]">Optimal</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#1a1a1a]/5 flex justify-between items-center">
            <h3 className="font-serif text-2xl text-[#1a1a1a]">Top Visited Pages</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-[#1a1a1a]/5 text-[#1a1a1a]/60 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-bold">Page Path</th>
                  <th className="px-6 py-4 font-bold text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {topPages.map((page, i) => (
                  <tr key={i} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#1a1a1a]">{page.path}</td>
                    <td className="px-6 py-4 text-[#1a1a1a]/70 text-right font-bold">{page._count.path}</td>
                  </tr>
                ))}
                {topPages.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">No views recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#1a1a1a]/5 flex justify-between items-center">
            <h3 className="font-serif text-2xl text-[#1a1a1a]">Recent Clients</h3>
            <button className="font-sans text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] underline">View All</button>
          </div>
          <div className="p-0">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-[#1a1a1a]/5 text-[#1a1a1a]/60 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-bold">Client Name</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                <tr className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1a1a1a]">Ali Rezaei</td>
                  <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Under Review</span></td>
                </tr>
                <tr className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1a1a1a]">Sara Ahmadi</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Approved</span></td>
                </tr>
                <tr className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1a1a1a]">Mehdi Naderi</td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Document Collection</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
