import { getNoorDataConfig } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';

export default function SettingsPage() {
  const config = getNoorDataConfig();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Settings"
        title="NOOR foundation settings"
        subtitle="Sprint 0–2 uses a safe mock-first data configuration."
      />
      <NoorCard>
        <h2>Data mode</h2>
        <p className="noor-subtitle"><strong>{config.mode}</strong></p>
        <div className="noor-divider" />
        <p className="noor-subtitle">Quran CDN: {config.quranCdnBase}</p>
        <p className="noor-subtitle">Tafseer CDN: {config.tafseerCdnBase}</p>
        <p className="noor-subtitle">Hadith CDN: {config.hadithCdnBase}</p>
      </NoorCard>
    </main>
  );
}
