import { getHadithCollections, getHadithItems } from '@noor/data';
import { HadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function HadithPage() {
  const contentSource = await getServerNoorContentSource();
  const collections = await getHadithCollections({ source: contentSource });
  const firstCollection = collections[0];
  const items = firstCollection ? await getHadithItems(firstCollection.id, { source: contentSource }) : [];

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Hadith"
        title="Hadith resolver"
        subtitle={`Collection and item resolvers are active with runtime content source: ${contentSource}.`}
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
