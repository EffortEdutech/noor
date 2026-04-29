import { getHadithCollections, getHadithItems } from '@noor/data';
import { HadithCard, NoorCard, PageHeader } from '@noor/ui';

export default async function HadithPage() {
  const collections = await getHadithCollections();
  const firstCollection = collections[0];
  const items = firstCollection ? await getHadithItems(firstCollection.id) : [];

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Hadith"
        title="Hadith resolver"
        subtitle="Collection and item resolvers are ready for later CDN-backed Hadith datasets."
      />

      <section className="noor-grid">
        {collections.map((collection) => (
          <NoorCard key={collection.id}>
            <span className="noor-badge emerald">{collection.language}</span>
            <h2>{collection.name}</h2>
            <p className="noor-subtitle">{collection.description}</p>
          </NoorCard>
        ))}
      </section>

      <section className="noor-stack">
        {items.map((hadith) => <HadithCard key={hadith.id} hadith={hadith} />)}
      </section>
    </main>
  );
}
