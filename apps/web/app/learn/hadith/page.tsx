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
  return 'Legacy';
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

  const hasViewMetadata = byBookCollections.length > 0 || byChapterCollections.length > 0;

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Hadith"
        title="Hadith library"
        subtitle={`Read Hadith by book or by chapter. Runtime content source: ${contentSource}.`}
      />

      <section className="noor-card noor-stack">
        <div className="noor-row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span className="noor-badge emerald">Sprint 27.9.3</span>
            <h2>Hadith navigation view</h2>
            <p className="noor-subtitle">
              by_book and by_chapter are separate navigation views. The same canonical hadith may exist in both source structures, but the reader displays one selected view at a time.
            </p>
          </div>
          <div className="noor-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link className={`noor-button ${activeView === 'by_book' ? 'primary' : 'secondary'}`} href={buildCollectionHref('by_book')}>
              View by book ({byBookCollections.length})
            </Link>
            <Link className={`noor-button ${activeView === 'by_chapter' ? 'primary' : 'secondary'}`} href={buildCollectionHref('by_chapter')}>
              View by chapter ({byChapterCollections.length})
            </Link>
          </div>
        </div>

        <div className="noor-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="noor-badge">Total collections: {collections.length}</span>
          <span className="noor-badge emerald">By book: {byBookCollections.length}</span>
          <span className="noor-badge gold">By chapter: {byChapterCollections.length}</span>
          {legacyCollections.length > 0 ? <span className="noor-badge">Legacy: {legacyCollections.length}</span> : null}
        </div>

        {!hasViewMetadata ? (
          <p className="noor-subtitle">
            This Hadith collection index does not expose by_book/by_chapter metadata yet. If you expected the staging CDN data, restart the dev server and make sure .env.local uses the raw GitHub staging URL, not a stale cached CDN URL.
          </p>
        ) : null}

        {activeView === 'by_chapter' && byChapterCollections.length === 0 ? (
          <p className="noor-subtitle">
            No by_chapter collections were found in the active runtime source. This usually means the app is reading an older/stale hadith/collections.json file.
          </p>
        ) : null}
      </section>

      <section className="noor-grid">
        {visibleCollections.map((collection) => (
          <NoorCard key={collection.renderKey}>
            <span className="noor-badge emerald">{collectionBadgeLabel(collection.resolvedView)}</span>
            <h2>{collection.name}</h2>
            <p className="noor-subtitle">{collection.description}</p>
            <p className="noor-subtitle">Language: {collection.language}</p>
            {collection.sourceScope ? <p className="noor-subtitle">Scope: {collection.sourceScope}</p> : null}
            {typeof collection.itemCount === 'number' ? <p className="noor-subtitle">Items: {collection.itemCount}</p> : null}
            <Link className="noor-button secondary" href={buildCollectionHref(activeView, collection.id)}>
              Open collection
            </Link>
          </NoorCard>
        ))}
      </section>

      <section className="noor-stack">
        <NoorCard>
          <span className="noor-badge emerald">Selected collection</span>
          <h2>{selectedCollection?.name ?? 'No Hadith collection found'}</h2>
          <p className="noor-subtitle">
            Showing {items.length} item(s){rawItems.length !== items.length ? ` after removing ${rawItems.length - items.length} duplicate canonical view item(s)` : ''}.
          </p>
        </NoorCard>

        {items.map((hadith, index) => (
          <HadithCard key={hadith.viewItemId ?? `${hadith.collectionId}-${hadith.id}-${index}`} hadith={hadith} />
        ))}
      </section>
    </main>
  );
}
