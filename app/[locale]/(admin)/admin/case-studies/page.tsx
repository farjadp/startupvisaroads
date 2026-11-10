import React from 'react';
import CaseList from './_components/CaseList';
import SettingsPanel from './_components/SettingsPanel';
import ConsentsPanel from './_components/ConsentsPanel';

export const dynamic = 'force-dynamic';

// Page loads are protected by middleware.ts (admin_session JWT); every fetch in the
// client components goes to /api/admin/case-studies/**, which checks the session again.
export default function CaseStudiesAdminPage() {
  return (
    <div className="max-w-5xl space-y-10">
      <div>
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Case studies</h1>
        <p className="font-sans text-[#1a1a1a]/60">
          Court decisions and client cases posted by the case-study-writer agent. Nothing publishes until every claim is checked against its paragraph and you approve it.
        </p>
      </div>
      <CaseList />
      <SettingsPanel />
      <ConsentsPanel />
    </div>
  );
}
