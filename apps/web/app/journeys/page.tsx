import { getJourneyIndex } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { JourneyList } from '../../components/JourneyList';

export default async function JourneysPage() {
  const journeys = await getJourneyIndex();

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Journeys"
        title="Learn through guided paths."
        subtitle="Journeys turn Quran, Tafseer, Hadith and reflection into small repeatable steps. Progress is saved locally on this device."
      />

      <NoorCard variant="soft">
        <div className="noor-row">
          <span className="noor-badge gold">Sprint 5</span>
          <span className="noor-reference">Zero-budget · local-first</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          Start with Foundations of NOOR, then continue into prayer, guidance, protection and remembrance.
          Later, this same journey engine can load curated learning paths from the CDN data layer.
        </p>
      </NoorCard>

      <JourneyList journeys={journeys} />
    </main>
  );
}
