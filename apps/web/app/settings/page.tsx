import { getContentHealthReport, getNoorDataConfig, getNoorResolverDiagnostics } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { AiSettingsPanel } from '../../components/AiSettingsPanel';
import { CdnPromotionCard } from '../../components/CdnPromotionCard';
import { CdnPublishCard } from '../../components/CdnPublishCard';
import { CdnSmokeTestCard } from '../../components/CdnSmokeTestCard';
import { ContentHealthCard } from '../../components/ContentHealthCard';
import { ContentPipelineCard } from '../../components/ContentPipelineCard';
import { HadithImportCard } from '../../components/HadithImportCard';
import { IlmMateEvidenceCompletionCard } from '../../components/IlmMateEvidenceCompletionCard';
import { IlmMateEvidenceIntakeCard } from '../../components/IlmMateEvidenceIntakeCard';
import { IlmMateEvidenceTrialCard } from '../../components/IlmMateEvidenceTrialCard';
import { IlmMateEvidenceUpdateHelperCard } from '../../components/IlmMateEvidenceUpdateHelperCard';
import { IlmMatePromotionReadinessCard } from '../../components/IlmMatePromotionReadinessCard';
import { IlmMateRequiredEvidenceAcceptanceCard } from '../../components/IlmMateRequiredEvidenceAcceptanceCard';
import { IlmMateRequiredEvidenceTrialCard } from '../../components/IlmMateRequiredEvidenceTrialCard';
import { IlmMateReviewActionsCard } from '../../components/IlmMateReviewActionsCard';
import { IlmMateReviewConsoleCard } from '../../components/IlmMateReviewConsoleCard';
import { IlmMateReviewerDecisionTrialCard } from '../../components/IlmMateReviewerDecisionTrialCard';
import { IlmMateStagingCdnCandidateCard } from '../../components/IlmMateStagingCdnCandidateCard';
import { IlmMateStagingCdnPackCard } from '../../components/IlmMateStagingCdnPackCard';
import { LanguageSettingsPanel } from '../../components/LanguageSettingsPanel';
import { LocalBackupCard } from '../../components/LocalBackupCard';
import { NoorCdnStagingAcceptanceCard } from '../../components/NoorCdnStagingAcceptanceCard';
import { NoorCdnStagingBranchHandoffCard } from '@/components/NoorCdnStagingBranchHandoffCard';
import { NoorCdnStagingRuntimeTestCard } from '../../components/NoorCdnStagingRuntimeTestCard';
import { NoorStagingBrowserQaCard } from '../../components/NoorStagingBrowserQaCard';
import { ProductionCdnApprovalGateCard } from '../../components/ProductionCdnApprovalGateCard';
import { ProductionCdnPromotionCard } from '../../components/ProductionCdnPromotionCard';
import { PwaStatusCard } from '../../components/PwaStatusCard';
import { QuranImportCard } from '../../components/QuranImportCard';
import { QuranSourceGateCard } from '../../components/QuranSourceGateCard';
import { ReaderPreferencesPanel } from '../../components/ReaderPreferencesPanel';
import { ReleaseNotesCard } from '../../components/ReleaseNotesCard';
import { RoadmapControlCard } from '../../components/RoadmapControlCard';
import { RuntimeContentSourceCard } from '../../components/RuntimeContentSourceCard';
import { ScholarlyReviewConsoleCard } from '../../components/ScholarlyReviewConsoleCard';
import { SettingsTabs, type SettingsTabSection } from '../../components/SettingsTabs';
import { SourceGovernanceCard } from '../../components/SourceGovernanceCard';
import { SourceIntakeCard } from '../../components/SourceIntakeCard';
import { TafseerImportCard } from '../../components/TafseerImportCard';
import { NOOR_APP_BUILD_LABEL, NOOR_APP_VERSION } from '../../lib/app-version';
import { getAiAssistantStatus } from '../../lib/ai/status';
import { getServerNoorContentSource } from '../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const contentSource = await getServerNoorContentSource();
  const config = getNoorDataConfig(contentSource);
  const contentHealth = await getContentHealthReport({ source: contentSource });
  const diagnostics = await getNoorResolverDiagnostics({ source: contentSource });
  const aiStatus = getAiAssistantStatus();

  const sections: SettingsTabSection[] = [
    {
      id: 'preferences',
      label: 'Preferences',
      eyebrow: 'Reader',
      title: 'Reader and learning preferences',
      description: 'Keep normal learner settings separate from source, AI, and developer controls.',
      children: (
        <>
          <ReaderPreferencesPanel />
        </>
      )
    },
    {
      id: 'language',
      label: 'Language',
      eyebrow: 'Multilanguage',
      title: 'Language foundation',
      description: 'Set the platform language direction for Quran, tafseer, and AI-generated learning support.',
      children: (
        <>
          <LanguageSettingsPanel />
        </>
      )
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      eyebrow: 'OpenAI',
      title: 'AI reflection and teaching assistant',
      description: 'Configure AI status and guardrails without exposing API keys to the browser.',
      children: (
        <>
          <AiSettingsPanel status={aiStatus} />
        </>
      )
    },
    {
      id: 'content-source',
      label: 'Content Source',
      eyebrow: 'Runtime',
      title: 'Runtime content source',
      description: 'Switch between mock, local CDN, and external CDN sources and inspect resolver diagnostics.',
      children: (
        <>
          <RuntimeContentSourceCard initialSource={contentSource} config={config} diagnostics={diagnostics} />
          <NoorCard>
            <h2>Data mode</h2>
            <p className="noor-subtitle"><strong>{config.mode}</strong> · {config.sourceLabel}</p>
            <div className="noor-divider" />
            <p className="noor-subtitle">Quran CDN: {config.quranCdnBase}</p>
            <p className="noor-subtitle">Tafseer CDN: {config.tafseerCdnBase}</p>
            <p className="noor-subtitle">Hadith CDN: {config.hadithCdnBase}</p>
            <p className="noor-subtitle">Manifest CDN: {config.manifestCdnBase}</p>
          </NoorCard>
        </>
      )
    },
    {
      id: 'system',
      label: 'System',
      eyebrow: 'App',
      title: 'System status',
      description: 'App version, install status, local backup, and content health for normal maintenance.',
      children: (
        <>
          <NoorCard>
            <span className="noor-badge gold">Version</span>
            <h2>NOOR v{NOOR_APP_VERSION}</h2>
            <p className="noor-subtitle">{NOOR_APP_BUILD_LABEL}</p>
          </NoorCard>
          <PwaStatusCard />
          <LocalBackupCard />
          <ContentHealthCard report={contentHealth} />
        </>
      )
    },
    {
      id: 'dev-log',
      label: 'Dev Log',
      eyebrow: 'Developer',
      title: 'Developer controls and content pipeline',
      description: 'Roadmap, importers, review console, CDN promotion, staging, and source-governance tools are grouped here so normal settings stay clean.',
      children: (
        <>
          <RoadmapControlCard />
          <ProductionCdnPromotionCard />
          <ProductionCdnApprovalGateCard />
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
          <NoorCdnStagingRuntimeTestCard />
          <NoorCdnStagingAcceptanceCard />
          <NoorStagingBrowserQaCard />
          <QuranSourceGateCard />
          <QuranImportCard />
          <TafseerImportCard />
          <HadithImportCard />
          <SourceIntakeCard />
          <CdnPublishCard />
          <CdnSmokeTestCard />
          <CdnPromotionCard />
          <SourceGovernanceCard />
          <ReleaseNotesCard />
          <ContentPipelineCard />
        </>
      )
    }
  ];

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Settings"
        title="NOOR settings"
        subtitle="Manage reader preferences, language, AI assistant status, content source, system health, and developer tools from separate tabs."
      />

      <SettingsTabs sections={sections} defaultTab="preferences" />
    </main>
  );
}
