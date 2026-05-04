import {
  DailyAyahCard,
  DailyHadithCard,
  KnowledgeSettingsPanel,
  NoorCard
} from '@noor/ui';
import { getDailyNoorContent } from '@noor/data';
import { ContinueGuidancePathCard } from '../../components/ContinueGuidancePathCard';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import { DailyGuidedSessionCard } from '../../components/DailyGuidedSessionCard';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';
import { ReflectionNotesPanel } from '../../components/ReflectionNotesPanel';
import { UniversalKnowledgeBar } from '../../components/UniversalKnowledgeBar';

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingBottom: 80
} as const;

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4
} as const;

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: '-0.02em'
} as const;

const subtitleStyle = {
  margin: '6px 0 0',
  color: '#64748b',
  fontSize: 13,
  lineHeight: 1.6
} as const;

export default async function TodayPage() {
  const daily = await getDailyNoorContent();

  return (
    <main className="noor-page noor-learning-page" style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Today</h1>
        <p style={subtitleStyle}>A calm daily learning space. Open one section, learn one thing, then continue.</p>
      </div>

      <KnowledgeSettingsPanel
        title="Today’s learning sections"
        subtitle="The page shows the structure first. Details stay hidden until you choose to open them."
        sections={[
          {
            id: 'today-start',
            icon: '🧭',
            title: 'Continue',
            summary: 'Resume your reading or guidance path without searching through the whole app.',
            chips: ['Reading progress', 'Guidance path'],
            children: (
              <div className="noor-clean-grid two">
                <ContinueReadingCard />
                <ContinueGuidancePathCard />
              </div>
            )
          },
          {
            id: 'today-guidance',
            icon: '📖',
            title: 'Daily learning',
            summary: 'Read one ayah and one hadith as a small guided session for today.',
            chips: ['Daily ayah', 'Daily hadith', 'Short session'],
            children: (
              <div className="noor-clean-stack">
                <DailyGuidedSessionCard />
                <div className="noor-clean-grid two">
                  <DailyAyahCard ayah={daily.ayah} />
                  <DailyHadithCard hadith={daily.hadith} />
                </div>
              </div>
            )
          },
          {
            id: 'today-reflect',
            icon: '✍️',
            title: 'Reflection',
            summary: 'Review recent notes and progress after the main reading is clear.',
            chips: ['Recent notes', 'Progress'],
            children: (
              <div className="noor-clean-grid two">
                <ReflectionNotesPanel limit={3} />
                <ReadingProgressPanel />
              </div>
            )
          },
          {
            id: 'today-deeper',
            icon: '🌿',
            title: 'Go deeper',
            summary: 'Open Quran, Tafseer, Hadith, or a journey only when you are ready for more.',
            chips: ['Quran', 'Tafseer', 'Hadith', 'Journeys'],
            children: (
              <div className="noor-clean-stack">
                <UniversalKnowledgeBar
                  title="Find a need, topic or reference"
                  subtitle="Use this when you want to move beyond today’s guided path."
                />
                <div className="noor-clean-grid three">
                  <NoorCard className="noor-link-card noor-quiet-action-card">
                    <span className="noor-badge emerald">Read</span>
                    <h3>Quran reader</h3>
                    <p className="noor-subtitle">Read with translation, tafseer support, and memorisation focus.</p>
                    <a className="noor-button" href="/learn/quran/1">Start with Al-Fatihah</a>
                  </NoorCard>

                  <NoorCard className="noor-link-card noor-quiet-action-card">
                    <span className="noor-badge gold">Understand</span>
                    <h3>Tafseer support</h3>
                    <p className="noor-subtitle">Understand the ayah while keeping the Quran as the centre.</p>
                    <a className="noor-button secondary" href="/learn/tafseer">Open Tafseer</a>
                  </NoorCard>

                  <NoorCard className="noor-link-card noor-quiet-action-card">
                    <span className="noor-badge emerald">Sunnah</span>
                    <h3>Hadith guidance</h3>
                    <p className="noor-subtitle">Read Hadith as practical guidance connected to reflection.</p>
                    <a className="noor-button secondary" href="/learn/hadith">Open Hadith</a>
                  </NoorCard>
                </div>
              </div>
            )
          }
        ]}
      />
    </main>
  );
}
