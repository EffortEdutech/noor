import type { ReactNode } from 'react';
import {
  DailyAyahCard,
  DailyHadithCard,
  NoorCard
} from '@noor/ui';
import { getDailyNoorContent } from '@noor/data';
import { ContinueGuidancePathCard } from '../../components/ContinueGuidancePathCard';
import { ContinueReadingCard } from '../../components/ContinueReadingCard';
import { DailyGuidedSessionCard } from '../../components/DailyGuidedSessionCard';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';
import { ReflectionNotesPanel } from '../../components/ReflectionNotesPanel';
import { UniversalKnowledgeBar } from '../../components/UniversalKnowledgeBar';

function LearningSection({
  icon,
  title,
  summary,
  preview,
  children,
  defaultOpen = false
}: {
  icon: string;
  title: string;
  summary: string;
  preview: string[];
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="noor-learning-section" open={defaultOpen}>
      <summary>
        <span className="noor-learning-icon" aria-hidden="true">{icon}</span>
        <span className="noor-learning-summary-main">
          <strong>{title}</strong>
          <span>{summary}</span>
          <span className="noor-learning-preview">
            {preview.map((item) => <em key={item}>{item}</em>)}
          </span>
        </span>
        <span className="noor-learning-chevron" aria-hidden="true">▸</span>
      </summary>
      <div className="noor-learning-body">{children}</div>
    </details>
  );
}

export default async function TodayPage() {
  const daily = await getDailyNoorContent();

  return (
    <main className="noor-page noor-learning-page">
      <header className="noor-production-header">
        <span className="noor-kicker">Today</span>
        <h1>Open one learning section.</h1>
        <p>
          Today is a calm starting point. It shows the available learning sections first, then lets you open only the part you want to read.
        </p>
      </header>

      <section className="noor-learning-intro" aria-label="Today recommendation">
        <div>
          <span className="noor-kicker">Recommended first</span>
          <h2>Continue your current path before opening more content.</h2>
          <p>
            A serious learning interface should reduce decisions. Begin with continuation, then move to daily reading, reflection, or deeper study.
          </p>
        </div>
        <a className="noor-button primary" href="#today-continue">Start</a>
      </section>

      <section className="noor-learning-list" aria-label="Today learning sections">
        <div id="today-continue">
          <LearningSection
            icon="🧭"
            title="Continue"
            summary="Resume from the last meaningful place instead of browsing the whole app again."
            preview={["Reading", "Guidance path"]}
            defaultOpen
          >
            <div className="noor-learning-card-grid two">
              <ContinueReadingCard />
              <ContinueGuidancePathCard />
            </div>
          </LearningSection>
        </div>

        <LearningSection
          icon="📖"
          title="Daily reading"
          summary="Read one short daily session. Keep the Quran and Hadith visible only after you choose to open this section."
          preview={["Ayah", "Hadith", "Short session"]}
        >
          <div className="noor-clean-stack">
            <DailyGuidedSessionCard />
            <div className="noor-learning-card-grid two">
              <DailyAyahCard ayah={daily.ayah} />
              <DailyHadithCard hadith={daily.hadith} />
            </div>
          </div>
        </LearningSection>

        <LearningSection
          icon="✍️"
          title="Reflect"
          summary="Review your notes and progress after reading, not before."
          preview={["Notes", "Progress"]}
        >
          <div className="noor-learning-card-grid two">
            <ReflectionNotesPanel limit={3} />
            <ReadingProgressPanel />
          </div>
        </LearningSection>

        <LearningSection
          icon="🌿"
          title="Go deeper"
          summary="Open Quran, Tafseer, Hadith or a journey when today’s main step is already clear."
          preview={["Quran", "Tafseer", "Hadith", "Journeys"]}
        >
          <UniversalKnowledgeBar
            title="Search only when you know what you want"
            subtitle="Use this for a topic, question, Surah, ayah reference, or Hadith reminder."
          />
          <div className="noor-learning-card-grid three">
            <NoorCard className="noor-link-card">
              <span className="noor-badge emerald">Read</span>
              <h3>Quran reader</h3>
              <p>Open a calm Quran reading surface with Surah and Ayah navigation.</p>
              <a className="noor-button secondary" href="/learn/quran/1">Start Al-Fatihah</a>
            </NoorCard>
            <NoorCard className="noor-link-card">
              <span className="noor-badge gold">Understand</span>
              <h3>Tafseer</h3>
              <p>Read explanation after the ayah is clear.</p>
              <a className="noor-button secondary" href="/learn/tafseer">Open Tafseer</a>
            </NoorCard>
            <NoorCard className="noor-link-card">
              <span className="noor-badge emerald">Sunnah</span>
              <h3>Hadith</h3>
              <p>Connect Prophetic guidance with practice and reflection.</p>
              <a className="noor-button secondary" href="/learn/hadith">Open Hadith</a>
            </NoorCard>
          </div>
        </LearningSection>
      </section>
    </main>
  );
}
