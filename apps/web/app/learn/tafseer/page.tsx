import { getTafseerEntries } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';

export default async function TafseerPage() {
  const entries = await getTafseerEntries('demo-tafseer', 1);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Tafseer"
        title="Understanding layer"
        subtitle="This Sprint 2 screen proves the tafseer resolver contract before loading a full tafseer corpus."
      />

      <section className="noor-stack">
        {entries.map((entry) => (
          <NoorCard key={entry.id}>
            <div className="noor-row">
              <span className="noor-badge gold">{entry.sourceLabel}</span>
              <span className="noor-reference">{entry.surah}:{entry.fromAyah}-{entry.toAyah}</span>
            </div>
            <h2>{entry.title}</h2>
            <p className="noor-subtitle">{entry.body}</p>
          </NoorCard>
        ))}
      </section>
    </main>
  );
}
