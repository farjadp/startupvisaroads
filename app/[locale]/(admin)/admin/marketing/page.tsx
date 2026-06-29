import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Megaphone, Users, Send, TrendingUp, Plus, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

export default async function MarketingDashboard() {
  const [totalContacts, totalGroups, campaigns] = await Promise.all([
    prisma.marketingContact.count(),
    prisma.marketingGroup.count(),
    prisma.campaign.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { logs: true } } },
    }),
  ]);

  const totalSent = await prisma.campaignLog.count({ where: { status: 'SENT' } });
  const totalFailed = await prisma.campaignLog.count({ where: { status: 'FAILED' } });

  const statusIcon = (status: string) => {
    switch (status) {
      case 'DONE': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'SENDING': return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'SCHEDULED': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-[#1a1a1a]/20" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'SENDING': return 'bg-blue-100 text-blue-700';
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-[#1a1a1a]/5 text-[#1a1a1a]/60';
    }
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Marketing</h1>
          <p className="font-sans text-[#1a1a1a]/60">Manage email and SMS campaigns.</p>
        </div>
        <Link
          href="/en/admin/marketing/campaigns/new"
          className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Contacts', value: totalContacts, icon: Users, color: 'bg-blue-50 text-blue-600', href: '/en/admin/marketing/contacts' },
          { label: 'Groups', value: totalGroups, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', href: '/en/admin/marketing/groups' },
          { label: 'Total Sent', value: totalSent, icon: Send, color: 'bg-green-50 text-green-600', href: '/en/admin/marketing/campaigns' },
          { label: 'Failed', value: totalFailed, icon: Megaphone, color: 'bg-red-50 text-red-500', href: '/en/admin/marketing/campaigns' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="font-serif text-4xl text-[#1a1a1a]">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { href: '/en/admin/marketing/contacts', label: 'Manage Contacts', desc: 'Add, import, and filter contacts', icon: Users, accent: '#3b82f6' },
          { href: '/en/admin/marketing/groups', label: 'Contact Groups', desc: 'Segment contacts by category', icon: TrendingUp, accent: '#8b5cf6' },
          { href: '/en/admin/marketing/settings', label: 'API Settings', desc: 'Configure Resend and Twilio', icon: Megaphone, accent: '#CCFF00' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm hover:shadow-md transition-all hover:border-[#1a1a1a]/10"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${item.accent}20`, color: item.accent === '#CCFF00' ? '#1a1a1a' : item.accent }}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans font-bold text-[#1a1a1a]">{item.label}</p>
              <p className="font-sans text-sm text-[#1a1a1a]/50 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex justify-between items-center">
          <h3 className="font-serif text-2xl text-[#1a1a1a]">Recent Campaigns</h3>
          <Link href="/en/admin/marketing/campaigns" className="text-sm font-sans text-[#1a1a1a]/50 hover:text-[#1a1a1a] underline">
            View All
          </Link>
        </div>
        <div>
          {campaigns.length === 0 ? (
            <div className="p-10 text-center text-[#1a1a1a]/40 font-sans italic">
              No campaigns yet. <Link href="/en/admin/marketing/campaigns/new" className="underline not-italic text-[#1a1a1a]/60">Create your first one →</Link>
            </div>
          ) : (
            <table className="w-full text-sm font-sans">
              <thead className="bg-[#1a1a1a]/[0.02] border-b border-[#1a1a1a]/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/en/admin/marketing/campaigns/${c.id}`} className="font-bold text-[#1a1a1a] hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded font-bold bg-[#1a1a1a]/5 text-[#1a1a1a]/70">{c.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit text-xs px-2 py-1 rounded-full font-bold ${statusColor(c.status)}`}>
                        {statusIcon(c.status)} {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#1a1a1a]/70">{c._count.logs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
