import { getContentHealthReport, getNoorDataConfig, getNoorResolverDiagnostics } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { CdnPromotionCard } from '../../components/CdnPromotionCard';
import { CdnPublishCard } from '../../components/CdnPublishCard';
import { CdnSmokeTestCard } from '../../components/CdnSmokeTestCard';
import { ContentHealthCard } from '../../components/ContentHealthCard';
import { ContentPipelineCard } from '../../components/ContentPipelineCard';
import { HadithImportCard } from '../../components/HadithImportCard';
import { LocalBackupCard } from '../../components/LocalBackupCard';
import { ProductionCdnPromotionCard } from '../../components/ProductionCdnPromotionCard';
import { PwaStatusCard } from '../../components/PwaStatusCard';
import { QuranImportCard } from '../../components/QuranImportCard';
import { QuranSourceGateCard } from '../../components/QuranSourceGateCard';
import { ReaderPreferencesPanel } from '../../components/ReaderPreferencesPanel';
import { ReleaseNotesCard } from '../../components/ReleaseNotesCard';
import { RoadmapControlCard } from '../../components/RoadmapControlCard';
import { RuntimeContentSourceCard } from '../../components/RuntimeContentSourceCard';
import { ScholarlyReviewConsoleCard } from '../../components/ScholarlyReviewConsoleCard';
import { IlmMateReviewConsoleCard } from '../../components/IlmMateReviewConsoleCard';
import { IlmMateReviewActionsCard } from '../../components/IlmMateReviewActionsCard';
import { IlmMatePromotionReadinessCard } from '../../components/IlmMatePromotionReadinessCard';
import { IlmMateEvidenceIntakeCard } from '../../components/IlmMateEvidenceIntakeCard';
import { IlmMateEvidenceCompletionCard } from '../../components/IlmMateEvidenceCompletionCard';
import { IlmMateEvidenceUpdateHelperCard } from '../../components/IlmMateEvidenceUpdateHelperCard';
import { IlmMateEvidenceTrialCard } from '../../components/IlmMateEvidenceTrialCard';
import { IlmMateReviewerDecisionTrialCard } from '../../components/IlmMateReviewerDecisionTrialCard';
import { IlmMateStagingCdnPackCard } from '../../components/IlmMateStagingCdnPackCard';
import { IlmMateRequiredEvidenceTrialCard } from '../../components/IlmMateRequiredEvidenceTrialCard';
import { IlmMateRequiredEvidenceAcceptanceCard } from '../../components/IlmMateRequiredEvidenceAcceptanceCard';
import { IlmMateStagingCdnCandidateCard } from '../../components/IlmMateStagingCdnCandidateCard';
import { SourceGovernanceCard } from '../../components/SourceGovernanceCard';
import { SourceIntakeCard } from '../../components/SourceIntakeCard';
import { TafseerImportCard } from '../../components/TafseerImportCard';
import { NOOR_APP_BUILD_LABEL, NOOR_APP_VERSION } from '../../lib/app-version';
import { getServerNoorContentSource } from '../../lib/runtime-content-source';import { NoorCdnStagingBranchHandoffCard } from "@/components/NoorCdnStagingBranchHandoffCard";


export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const contentSource = await getServerNoorContentSource();
  const config = getNoorDataConfig(contentSource);
  const contentHealth = await getContentHealthReport({ source: contentSource });
  const diagnostics = await getNoorResolverDiagnostics({ source: contentSource });

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Settings"
        title="NOOR foundation settings"
        subtitle="Review roadmap control, production CDN v1 promotion, scholarly review console, source gates, importers, runtime source, CDN publishing, release notes, app version, content pipeline, install status, offline readiness and content integrity."
      />

      <NoorCard>
        <span className="noor-badge gold">Version</span>
        <h2>NOOR v{NOOR_APP_VERSION}</h2>
        <p className="noor-subtitle">{NOOR_APP_BUILD_LABEL}</p>
      </NoorCard>

      <RoadmapControlCard />
      <ProductionCdnPromotionCard />
      <ScholarlyReviewConsoleCard />
      <IlmMateReviewConsoleCard />
      <IlmMateReviewActionsCard />
      <IlmMatePromotionReadinessCard />
      <IlmMateEvidenceIntakeCard />
      <IlmMateEvidenceCompletionCard />
      <IlmMateEvidenceUpdateHelperCard />
      <IlmMateEvidenceTrialCard />
      <IlmMateReviewerDecisionTrialCard />
      <IlmMateStagingCdnPackCard />
      <IlmMateRequiredEvidenceTrialCard />
      <IlmMateRequiredEvidenceAcceptanceCard />
      <IlmMateStagingCdnCandidateCard />
          <NoorCdnStagingBranchHandoffCard />
      <QuranSourceGateCard />
      <QuranImportCard />
      <TafseerImportCard />
      <HadithImportCard />
      <SourceIntakeCard />
      <RuntimeContentSourceCard initialSource={contentSource} config={config} diagnostics={diagnostics} />
      <CdnPublishCard />
      <CdnSmokeTestCard />
      <CdnPromotionCard />
      <SourceGovernanceCard />
      <ReleaseNotesCard />
      <ContentPipelineCard />
      <ReaderPreferencesPanel />
      <LocalBackupCard />
      <PwaStatusCard />
      <ContentHealthCard report={contentHealth} />

      <NoorCard>
        <h2>Data mode</h2>
        <p className="noor-subtitle"><strong>{config.mode}</strong> · {config.sourceLabel}</p>
        <div className="noor-divider" />
        <p className="noor-subtitle">Quran CDN: {config.quranCdnBase}</p>
        <p className="noor-subtitle">Tafseer CDN: {config.tafseerCdnBase}</p>
        <p className="noor-subtitle">Hadith CDN: {config.hadithCdnBase}</p>
        <p className="noor-subtitle">Manifest CDN: {config.manifestCdnBase}</p>
      </NoorCard>
    </main>
  );
}
