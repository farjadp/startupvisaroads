import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, Mail, MessageSquare, Users } from 'lucide-react';
import { getCampaignQueueSummary } from '@/lib/campaign-queue/admin';
import {
  getCampaignLinkReport,
  getCampaignRecipientReport,
  getCampaignVersionReport,
} from '@/lib/campaign-queue/report';
import CampaignQueuePanel from './CampaignQueuePanel';
import { CampaignLinks, CampaignRecipients, CampaignVersions } from './CampaignReport';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ show?: string; q?: string; page?: string }>;
}

export default async function CampaignDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { show, q, page } = await searchParams;

  const [campaign, summary, byChannel, links, recipients, versions] = await Promise.all([
    prisma.campaign.findUnique({
      where: { id },
      include: {
        groups: { include: { group: { select: { id: true, name: true, color: true } } } },
      },
    }),
    getCampaignQueueSummary(id),
    prisma.campaignLog.groupBy({
      by: ['channel', 'status'],
      where: { campaignId: id },
      _count: { _all: true },
    }),
    getCampaignLinkReport(id),
    getCampaignRecipientReport(id, {
      show: typeof show === 'string' ? show : undefined,
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? page : undefined,
    }),
    getCampaignVersionReport(id),
  ]);

  if (!campaign || !summary) notFound();

  // Every figure here comes from database counts.
  const countFor = (channel: string, status?: string) =>
    byChannel
      .filter((row) => row.channel === channel && (!status || row.status === status))
      .reduce((sum, row) => sum + row._count._all, 0);
  const emailTotal = countFor('EMAIL');
  const smsTotal = countFor('SMS');
  const { sent, failed, opened: opens, clicked: clicks } = summary;
  const finished = sent + failed;

  const successRate = finished > 0 ? Math.round((sent / finished) * 100) : 0;
  const openRate = sent > 0 ? Math.round((opens / sent) * 100) : 0;
  const clickRate = sent > 0 ? Math.round((clicks / sent) * 100) : 0;

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
            <span className="text-xs px-2 py-1 rounded font-bold bg-[#1a1a1a]/5 text-[#1a1a1a]/60">{campaign.type}</span>
          </div>
          {campaign.subject && (
            <p className="font-sans text-[#1a1a1a]/50 text-sm mt-1">Subject: {campaign.subject}</p>
          )}
        </div>
      </div>

      <CampaignQueuePanel
        campaignId={campaign.id}
        summary={{ ...summary, nextSendAt: summary.nextSendAt?.toISOString() ?? null }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Sent', value: sent.toLocaleString('en-CA'), color: 'text-[#1a1a1a]', bg: 'bg-[#1a1a1a]/5' },
          { label: 'Opened', value: `${opens} (${openRate}%)`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Clicked', value: `${clicks} (${clickRate}%)`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Delivery Success', value: `${successRate}%`, color: successRate > 80 ? 'text-green-600' : 'text-orange-500', bg: successRate > 80 ? 'bg-green-50' : 'bg-orange-50' },
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
          {emailTotal + smsTotal > 0 && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
              <h3 className="font-serif text-xl mb-4">Delivery Summary</h3>
              <div className="flex items-end gap-4 h-32">
                {/* Email bar */}
                {emailTotal > 0 && (
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '100px' }}>
                      <div
                        style={{ height: `${(countFor('EMAIL', 'SENT') / emailTotal) * 100}px` }}
                        className="w-full bg-green-400 rounded-t-lg"
                      />
                      <div
                        style={{ height: `${(countFor('EMAIL', 'FAILED') / emailTotal) * 100}px` }}
                        className="w-full bg-red-400 rounded-b-lg"
                      />
                    </div>
                    <div className="text-center">
                      <Mail className="w-4 h-4 mx-auto text-[#1a1a1a]/40 mb-1" />
                      <p className="text-xs font-bold font-sans text-[#1a1a1a]/60">Email</p>
                      <p className="text-xs text-[#1a1a1a]/40">{emailTotal.toLocaleString('en-CA')} total</p>
                    </div>
                  </div>
                )}
                {/* SMS bar */}
                {smsTotal > 0 && (
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '100px' }}>
                      <div
                        style={{ height: `${(countFor('SMS', 'SENT') / smsTotal) * 100}px` }}
                        className="w-full bg-blue-400 rounded-t-lg"
                      />
                      <div
                        style={{ height: `${(countFor('SMS', 'FAILED') / smsTotal) * 100}px` }}
                        className="w-full bg-red-400 rounded-b-lg"
                      />
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-4 h-4 mx-auto text-[#1a1a1a]/40 mb-1" />
                      <p className="text-xs font-bold font-sans text-[#1a1a1a]/60">SMS</p>
                      <p className="text-xs text-[#1a1a1a]/40">{smsTotal.toLocaleString('en-CA')} total</p>
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

          <CampaignVersions versions={versions} />
          <CampaignLinks links={links} />
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

      <CampaignRecipients campaignId={campaign.id} report={recipients} />
    </div>
  );
}
