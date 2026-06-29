import React from 'react';
import SettingsForm from '@/components/admin/SettingsForm';
import BackupSettings from '@/components/admin/BackupSettings';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Fetch existing settings
  const settingsList = await prisma.setting.findMany();
  const settingsDict: Record<string, string> = {};
  
  for (const s of settingsList) {
    settingsDict[s.key] = s.value;
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-8">
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Social Media Settings</h1>
          <p className="font-sans text-[#1a1a1a]/60">Manage API keys and integration credentials for automatic social publishing.</p>
        </div>

        <SettingsForm initialSettings={settingsDict} />
      </div>

      <BackupSettings />
    </div>
  );
}
