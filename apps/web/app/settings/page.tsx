import { getContentHealthReport, getNoorDataConfig } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { ContentHealthCard } from '../../components/ContentHealthCard';
import { ContentPipelineCard } from '../../components/ContentPipelineCard';
import { LocalBackupCard } from '../../components/LocalBackupCard';
import { PwaStatusCard } from '../../components/PwaStatusCard';
import { ReaderPreferencesPanel } from '../../components/ReaderPreferencesPanel';
import { ReleaseNotesCard } from '../../components/ReleaseNotesCard';
import { NOOR_APP_BUILD_LABEL, NOOR_APP_VERSION } from '../../lib/app-version';

export default async function SettingsPage() {
  const config = getNoorDataConfig();
  const contentHealth = await getContentHealthReport();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Settings"
        title="NOOR foundation settings"
        subtitle="Review data configuration, reader preferences, local backup, release notes, app version, content pipeline, install status, offline readiness and content integrity."
      />

      <NoorCard>
        <span className="noor-badge gold">Version</span>
        <h2>NOOR v{NOOR_APP_VERSION}</h2>
        <p className="noor-subtitle">{NOOR_APP_BUILD_LABEL}</p>
      </NoorCard>

      <ReleaseNotesCard />

      <ContentPipelineCard />

      <ReaderPreferencesPanel />

      <LocalBackupCard />

      <PwaStatusCard />

      <ContentHealthCard report={contentHealth} />

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
