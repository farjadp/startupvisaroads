import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import CampaignEditForm from './CampaignEditForm';

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) notFound();

  const back = `/en/admin/marketing/campaigns/${id}`;
  const alreadyLogged = await prisma.campaignLog.count({ where: { campaignId: id } });
  const editable = ['DRAFT', 'SCHEDULED', 'PAUSED', 'SENDING'].includes(campaign.status);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href={back} aria-label="Back to campaign" className="p-2 rounded-xl border border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a]">Edit campaign</h1>
          <p className="font-sans text-sm text-[#1a1a1a]/50 mt-1">{campaign.name}</p>
        </div>
      </div>

      {editable ? (
        <CampaignEditForm
          campaign={{
            id: campaign.id,
            name: campaign.name,
            type: campaign.type,
            subject: campaign.subject ?? '',
            body: campaign.body,
            smsBody: campaign.smsBody ?? '',
            contentVersion: campaign.contentVersion,
          }}
          alreadyLogged={alreadyLogged}
          backHref={back}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 font-sans text-sm text-[#1a1a1a]/70">
          {campaign.status === 'QUEUED'
            ? 'Pause this campaign first, then come back to edit it.'
            : 'This campaign has finished, so there is nobody left to send an edited version to.'}{' '}
          <Link href={back} className="font-bold underline">Back to campaign</Link>
        </div>
      )}
    </div>
  );
}
