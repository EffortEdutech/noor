import { getNoorDataConfig } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { PwaStatusCard } from '../../components/PwaStatusCard';
import { NOOR_APP_BUILD_LABEL, NOOR_APP_VERSION } from '../../lib/app-version';

export default function SettingsPage() {
  const config = getNoorDataConfig();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Settings"
        title="NOOR foundation settings"
        subtitle="Review data configuration, app version, install status and offline readiness."
      />

      <NoorCard>
        <span className="noor-badge gold">Version</span>
        <h2>NOOR v{NOOR_APP_VERSION}</h2>
        <p className="noor-subtitle">{NOOR_APP_BUILD_LABEL}</p>
      </NoorCard>

      <PwaStatusCard />

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
