import { getTafseerEntries } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function TafseerPage() {
  const contentSource = await getServerNoorContentSource();
  const entries = await getTafseerEntries('demo-tafseer', 1, { source: contentSource });

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Tafseer"
        title="Understanding layer"
        subtitle={`This screen proves the tafseer resolver contract using runtime content source: ${contentSource}.`}
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
