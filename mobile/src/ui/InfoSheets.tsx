// About and Mentor as sheets (spec 2026-11-09 §3, auditor P1 #3): opened from
// inside a flow they cover the page instead of switching to the Me tab, so the
// reader never loses their place. The Me screens stay for Settings.
import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { AboutBody } from './AboutBody';
import { Disclaimer } from './kit';
import { MentorBody } from './MentorBody';
import { Sheet } from './Sheet';

export function AboutSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={t('about.title')}>
      <AboutBody />
    </Sheet>
  );
}

export function MentorSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={t('mentor.title')}>
      <MentorBody />
    </Sheet>
  );
}

/** The disclaimer whose "About us" link opens the About sheet in place. */
export function DisclaimerWithAbout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Disclaimer onAbout={() => setOpen(true)} />
      <AboutSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
