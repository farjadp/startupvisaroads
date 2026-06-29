import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, CheckCircle, XCircle, Mail, MessageSquare, Users, Clock } from 'lucide-react';
import CampaignSendButton from './CampaignSendButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      groups: { include: { group: { select: { id: true, name: true, color: true } } } },
      logs: { orderBy: { sentAt: 'desc' }, take: 100 },
    },
  });

  if (!campaign) notFound();

  const sent = campaign.logs.filter((l) => l.status === 'SENT').length;
  const failed = campaign.logs.filter((l) => l.status === 'FAILED').length;
  const emailLogs = campaign.logs.filter((l) => l.channel === 'EMAIL');
  const smsLogs = campaign.logs.filter((l) => l.channel === 'SMS');

  const successRate = campaign.logs.length > 0
    ? Math.round((sent / campaign.logs.length) * 100)
    : 0;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/en/admin/marketing/campaigns"
          className="p-2 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-[#1a1a1a]">{campaign.name}</h1>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
              campaign.status === 'DONE' ? 'bg-green-100 text-green-700' :
              campaign.status === 'FAILED' ? 'bg-red-100 text-red-700' :
              campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-700' :
              campaign.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-700' :
              'bg-[#1a1a1a]/5 text-[#1a1a1a]/60'
            }`}>{campaign.status}</span>
            <span className="text-xs px-2 py-1 rounded font-bold bg-[#1a1a1a]/5 text-[#1a1a1a]/60">{campaign.type}</span>
          </div>
          {campaign.subject && (
            <p className="font-sans text-[#1a1a1a]/50 text-sm mt-1">Subject: {campaign.subject}</p>
          )}
        </div>
        {(campaign.status === 'DRAFT' || campaign.status === 'SCHEDULED') && (
          <CampaignSendButton campaignId={campaign.id} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Logs', value: campaign.logs.length, color: 'text-[#1a1a1a]', bg: 'bg-[#1a1a1a]/5' },
          { label: 'Sent', value: sent, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Failed', value: failed, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Success Rate', value: `${successRate}%`, color: successRate > 80 ? 'text-green-600' : 'text-orange-500', bg: successRate > 80 ? 'bg-green-50' : 'bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-6`}>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50 mb-1">{stat.label}</p>
            <p className={`font-serif text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {/* SVG Bar Chart */}
          {campaign.logs.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
              <h3 className="font-serif text-xl mb-4">Delivery Summary</h3>
              <div className="flex items-end gap-4 h-32">
                {/* Email bar */}
                {emailLogs.length > 0 && (
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '100px' }}>
                      <div
                        style={{ height: `${(emailLogs.filter(l => l.status === 'SENT').length / Math.max(emailLogs.length, 1)) * 100}px` }}
                        className="w-full bg-green-400 rounded-t-lg"
                      />
                      <div
                        style={{ height: `${(emailLogs.filter(l => l.status === 'FAILED').length / Math.max(emailLogs.length, 1)) * 100}px` }}
                        className="w-full bg-red-400 rounded-b-lg"
                      />
                    </div>
                    <div className="text-center">
                      <Mail className="w-4 h-4 mx-auto text-[#1a1a1a]/40 mb-1" />
                      <p className="text-xs font-bold font-sans text-[#1a1a1a]/60">Email</p>
                      <p className="text-xs text-[#1a1a1a]/40">{emailLogs.length} total</p>
                    </div>
                  </div>
                )}
                {/* SMS bar */}
                {smsLogs.length > 0 && (
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '100px' }}>
                      <div
                        style={{ height: `${(smsLogs.filter(l => l.status === 'SENT').length / Math.max(smsLogs.length, 1)) * 100}px` }}
                        className="w-full bg-blue-400 rounded-t-lg"
                      />
                      <div
                        style={{ height: `${(smsLogs.filter(l => l.status === 'FAILED').length / Math.max(smsLogs.length, 1)) * 100}px` }}
                        className="w-full bg-red-400 rounded-b-lg"
                      />
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-4 h-4 mx-auto text-[#1a1a1a]/40 mb-1" />
                      <p className="text-xs font-bold font-sans text-[#1a1a1a]/60">SMS</p>
                      <p className="text-xs text-[#1a1a1a]/40">{smsLogs.length} total</p>
                    </div>
                  </div>
                )}
                {/* Legend */}
                <div className="flex flex-col gap-2 text-xs font-sans pl-4 border-l border-[#1a1a1a]/5 self-center">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-400" /> Sent</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-400" /> SMS Sent</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-400" /> Failed</div>
                </div>
              </div>
            </div>
          )}

          {/* Logs table */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5">
              <h3 className="font-serif text-xl">Send Logs</h3>
            </div>
            <table className="w-full text-sm font-sans">
              <thead className="bg-[#1a1a1a]/[0.02] border-b border-[#1a1a1a]/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Contact ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Error</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {campaign.logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[#1a1a1a]/40 italic">
                      No send logs yet. Campaign has not been sent.
                    </td>
                  </tr>
                ) : campaign.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#1a1a1a]/[0.02]">
                    <td className="px-4 py-3 text-[#1a1a1a]/50 font-mono text-xs">{log.contactId.slice(0, 8)}…</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs">
                        {log.channel === 'EMAIL' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        {log.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold w-fit px-2 py-0.5 rounded-full ${log.status === 'SENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {log.status === 'SENT' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-red-500 text-xs max-w-xs truncate">{log.error ?? '—'}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/40 text-xs">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(log.sentAt).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Groups */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#1a1a1a]/40" /> Target Groups
            </h3>
            {campaign.groups.length === 0 ? (
              <p className="text-sm text-[#1a1a1a]/40 italic font-sans">No groups assigned.</p>
            ) : (
              <div className="space-y-2">
                {campaign.groups.map((cg) => (
                  <div key={cg.group.id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cg.group.color }} />
                    <span className="font-sans text-sm font-bold">{cg.group.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-3">
            <h3 className="font-serif text-lg">Timeline</h3>
            <div className="space-y-2 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/50">Created</span>
                <span className="font-bold">{new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
              {campaign.scheduledAt && (
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/50">Scheduled</span>
                  <span className="font-bold">{new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                </div>
              )}
              {campaign.sentAt && (
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/50">Sent</span>
                  <span className="font-bold">{new Date(campaign.sentAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
