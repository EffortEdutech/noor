import Link from 'next/link';
import { getHadithCollections, getHadithItems } from '@noor/data';
import { HadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

type HadithViewMode = 'by_book' | 'by_chapter';

type SearchParamValue = string | string[] | undefined;

type HadithPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

type HadithCollectionWithView = Awaited<ReturnType<typeof getHadithCollections>>[number] & {
  sourceView?: HadithViewMode;
  viewMode?: HadithViewMode;
  sourcePath?: string;
  sourceBook?: string;
  sourceScope?: string;
  itemCount?: number;
  tags?: string[];
};

type HadithCollectionResolved = HadithCollectionWithView & {
  resolvedView: HadithViewMode | 'legacy';
  renderKey: string;
};

type HadithItemWithCanonical = Awaited<ReturnType<typeof getHadithItems>>[number] & {
  canonicalHadithId?: string;
  viewItemId?: string;
  sourceView?: HadithViewMode;
  sourcePath?: string;
};

function firstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function normalizeView(value: SearchParamValue): HadithViewMode {
  return firstValue(value) === 'by_chapter' ? 'by_chapter' : 'by_book';
}

function inferCollectionView(collection: HadithCollectionWithView): HadithViewMode | 'legacy' {
  if (collection.sourceView === 'by_book' || collection.viewMode === 'by_book') return 'by_book';
  if (collection.sourceView === 'by_chapter' || collection.viewMode === 'by_chapter') return 'by_chapter';

  const haystack = [
    collection.id,
    collection.name,
    collection.description,
    collection.sourcePath,
    collection.sourceBook,
    collection.sourceScope,
    ...(collection.tags ?? [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (
    haystack.includes('by-chapter') ||
    haystack.includes('by_chapter') ||
    haystack.includes('/by_chapter/') ||
    haystack.includes('hadith/db/by_chapter')
  ) {
    return 'by_chapter';
  }

  if (
    haystack.includes('by-book') ||
    haystack.includes('by_book') ||
    haystack.includes('/by_book/') ||
    haystack.includes('hadith/db/by_book')
  ) {
    return 'by_book';
  }

  return 'legacy';
}

function buildCollectionHref(view: HadithViewMode, collectionId?: string) {
  const params = new URLSearchParams({ view });
  if (collectionId) params.set('collection', collectionId);
  return `/learn/hadith?${params.toString()}`;
}

function dedupeHadithItems(items: HadithItemWithCanonical[]) {
  const seen = new Set<string>();
  const deduped: HadithItemWithCanonical[] = [];

  for (const item of items) {
    const dedupeKey = item.canonicalHadithId ?? `${item.collectionId}:${item.id}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push(item);
  }

  return deduped;
}

function collectionBadgeLabel(view: HadithCollectionResolved['resolvedView']) {
  if (view === 'by_chapter') return 'By chapter';
  if (view === 'by_book') return 'By book';
  return 'Collection';
}

export default async function HadithPage({ searchParams }: HadithPageProps) {
  const params = (await searchParams) ?? {};
  const activeView = normalizeView(params.view);
  const selectedCollectionId = firstValue(params.collection);
  const contentSource = await getServerNoorContentSource();
  const collections = (await getHadithCollections({ source: contentSource })) as HadithCollectionWithView[];

  const collectionsWithView: HadithCollectionResolved[] = collections.map((collection, index) => ({
    ...collection,
    resolvedView: inferCollectionView(collection),
    renderKey: `${collection.id}-${collection.sourceView ?? collection.viewMode ?? 'legacy'}-${index}`
  }));

  const byBookCollections = collectionsWithView.filter((collection) => collection.resolvedView === 'by_book');
  const byChapterCollections = collectionsWithView.filter((collection) => collection.resolvedView === 'by_chapter');
  const legacyCollections = collectionsWithView.filter((collection) => collection.resolvedView === 'legacy');
  const activeCollections = activeView === 'by_chapter' ? byChapterCollections : byBookCollections;

  const visibleCollections =
    activeCollections.length > 0
      ? activeCollections
      : activeView === 'by_book'
        ? legacyCollections
        : [];

  const selectedCollection =
    visibleCollections.find((collection) => collection.id === selectedCollectionId) ??
    visibleCollections[0];

  const rawItems = selectedCollection
    ? ((await getHadithItems(selectedCollection.id, { source: contentSource })) as HadithItemWithCanonical[])
    : [];
  const items = dedupeHadithItems(rawItems);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Hadith"
        title="Read guidance from the Sunnah."
        subtitle="Browse Hadith by book or chapter, save what you want to return to, and use Hadith as practical guidance beside Quran reading."
      />

      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-link-card">
          <span className="noor-badge emerald">Hadith reader</span>
          <h2>Choose a collection, then read slowly</h2>
          <p className="noor-subtitle">
            The goal is not only to list narrations. The reader should help users discover, understand, save and practise reminders.
          </p>
          <div className="noor-card-actions">
            <Link className={`noor-button ${activeView === 'by_book' ? 'primary' : 'secondary'}`} href={buildCollectionHref('by_book')}>
              By book ({byBookCollections.length || legacyCollections.length})
            </Link>
            <Link className={`noor-button ${activeView === 'by_chapter' ? 'primary' : 'secondary'}`} href={buildCollectionHref('by_chapter')}>
              By chapter ({byChapterCollections.length})
            </Link>
          </div>
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">Selected collection</span>
          <h2>{selectedCollection?.name ?? 'No Hadith collection found'}</h2>
          <p className="noor-subtitle">
            Showing {items.length} item{items.length === 1 ? '' : 's'} from the current view.
          </p>
          <div className="noor-reader-facts">
            <span>{collections.length} collections</span>
            <span>{byBookCollections.length || legacyCollections.length} by book</span>
            <span>{byChapterCollections.length} by chapter</span>
          </div>
        </NoorCard>
      </section>

      {activeView === 'by_chapter' && byChapterCollections.length === 0 ? (
        <NoorCard>
          <span className="noor-badge">No chapter view yet</span>
          <p className="noor-subtitle">
            This content source does not currently expose chapter navigation. Use the book view for now.
          </p>
        </NoorCard>
      ) : null}

      <section className="noor-grid">
        {visibleCollections.map((collection) => (
          <NoorCard key={collection.renderKey} className="noor-link-card">
            <span className="noor-badge emerald">{collectionBadgeLabel(collection.resolvedView)}</span>
            <h2>{collection.name}</h2>
            <p className="noor-subtitle">{collection.description}</p>
            {collection.sourceScope ? <p className="noor-subtitle">Scope: {collection.sourceScope}</p> : null}
            {typeof collection.itemCount === 'number' ? <p className="noor-subtitle">Items: {collection.itemCount}</p> : null}
            <Link className="noor-button secondary" href={buildCollectionHref(activeView, collection.id)}>
              Open collection
            </Link>
          </NoorCard>
        ))}
      </section>

      <section className="noor-section-heading">
        <div>
          <span className="noor-kicker">Hadith reminders</span>
          <h2>{selectedCollection?.name ?? 'Reader'}</h2>
        </div>
        <Link className="noor-button secondary" href="/explore">Search by topic</Link>
      </section>

      <section className="noor-stack">
        {items.length === 0 ? (
          <NoorCard>
            <h2>No Hadith items found</h2>
            <p className="noor-subtitle">Try another collection or view.</p>
          </NoorCard>
        ) : null}

        {items.map((hadith, index) => (
          <HadithCard key={hadith.viewItemId ?? `${hadith.collectionId}-${hadith.id}-${index}`} hadith={hadith} />
        ))}
      </section>
    </main>
  );
}
