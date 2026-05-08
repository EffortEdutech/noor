import { getHadithCollections, getHadithItems } from '@noor/data';
import { HadithCard, NoorCard } from '@noor/ui';
import { HadithNavigationControls } from '../../../components/HadithNavigationControls';
import { HadithSingleReader } from '../../../components/HadithSingleReader';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';
import styles from './HadithPage.module.css';

export const dynamic = 'force-dynamic';

type HadithViewMode = 'by_book' | 'by_chapter';
type HadithReaderMode = 'read' | 'reflect' | 'practice';

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

function normalizeMode(value: SearchParamValue): HadithReaderMode {
  const mode = firstValue(value);
  if (mode === 'reflect' || mode === 'practice') return mode;
  return 'read';
}

function normalizeTopic(value: SearchParamValue) {
  return firstValue(value)?.trim().toLowerCase();
}

function parsePage(value: SearchParamValue) {
  const parsed = Number.parseInt(firstValue(value) ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function prettifySegment(value: string | undefined) {
  if (!value) return 'Collection';
  return value
    .replace(/^by-(book|chapter)__/u, '')
    .replace(/__/gu, ' / ')
    .replace(/[-_]+/gu, ' ')
    .replace(/\b\w/gu, (character) => character.toUpperCase());
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

function getGroupKey(collection: HadithCollectionResolved, view: HadithViewMode) {
  if (view === 'by_chapter') {
    return collection.sourceBook ?? collection.sourceScope ?? collection.id.split('__')[1] ?? 'chapters';
  }

  return collection.sourceScope ?? collection.sourceBook ?? collection.id.split('__')[1] ?? 'books';
}

function getCollectionLabel(collection: HadithCollectionResolved, view: HadithViewMode) {
  const lastSegment = collection.id.split('__').at(-1);
  if (view === 'by_chapter') return lastSegment ? `Chapter ${prettifySegment(lastSegment)}` : collection.name;
  return lastSegment ? prettifySegment(lastSegment) : collection.name;
}

function buildHadithHref({
  view,
  collectionId,
  mode,
  topic,
  group,
  page
}: {
  view: HadithViewMode;
  collectionId?: string;
  mode?: HadithReaderMode;
  topic?: string;
  group?: string;
  page?: number;
}) {
  const params = new URLSearchParams({ view });
  if (collectionId) params.set('collection', collectionId);
  if (mode && mode !== 'read') params.set('mode', mode);
  if (topic) params.set('topic', topic);
  if (group) params.set('group', group);
  if (page && page > 1) params.set('page', String(page));
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

function collectTopics(items: HadithItemWithCanonical[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim().toLowerCase();
      if (
        !normalized ||
        ['ar', 'en', 'ms', 'id', 'ur', 'zh', 'ta'].includes(normalized) ||
        normalized.startsWith('by_') ||
        normalized.includes('__') ||
        /^[a-z0-9-]+:\d+$/u.test(normalized)
      ) {
        continue;
      }
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([topic, count]) => ({ topic, count }));
}

function filterItemsByTopic(items: HadithItemWithCanonical[], topic?: string) {
  if (!topic) return items;
  return items.filter((item) => item.tags?.some((tag) => tag.toLowerCase() === topic));
}

export default async function HadithPage({ searchParams }: HadithPageProps) {
  const params = (await searchParams) ?? {};
  const activeView = normalizeView(params.view);
  const activeMode = normalizeMode(params.mode);
  const selectedTopic = normalizeTopic(params.topic);
  const selectedCollectionId = firstValue(params.collection);
  const requestedGroup = firstValue(params.group);
  const currentPage = parsePage(params.page);
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
  const visibleCollections = activeCollections.length > 0 ? activeCollections : activeView === 'by_book' ? legacyCollections : [];
  const navigationCollections = [
    ...byBookCollections,
    ...legacyCollections.map((collection) => ({ ...collection, resolvedView: 'by_book' as const })),
    ...byChapterCollections
  ];

  const navigationGroupSummaries = [
    ...navigationCollections
      .reduce((groups, collection) => {
        const view = collection.resolvedView === 'by_chapter' ? 'by_chapter' : 'by_book';
        const key = getGroupKey(collection, view);
        const existing = groups.get(key);

        if (existing) {
          existing.collections += 1;
          existing.items += collection.itemCount ?? 0;
          return groups;
        }

        groups.set(key, {
          key,
          label: prettifySegment(key),
          collections: 1,
          items: collection.itemCount ?? 0,
          sortView: view
        });
        return groups;
      }, new Map<string, { key: string; label: string; collections: number; items: number; sortView: HadithViewMode }>())
      .values()
  ].sort((a, b) => b.items - a.items || a.label.localeCompare(b.label));
  const groupSummaries = navigationGroupSummaries.filter((group) => group.sortView === activeView);

  const activeGroup = groupSummaries.some((group) => group.key === requestedGroup) ? requestedGroup : groupSummaries[0]?.key;
  const groupedCollections = activeGroup
    ? visibleCollections.filter((collection) => getGroupKey(collection, activeView) === activeGroup)
    : visibleCollections;
  const selectedCollection =
    groupedCollections.find((collection) => collection.id === selectedCollectionId) ?? groupedCollections[0] ?? visibleCollections[0];

  const rawItems = selectedCollection
    ? ((await getHadithItems(selectedCollection.id, { source: contentSource })) as HadithItemWithCanonical[])
    : [];
  const items = dedupeHadithItems(rawItems);
  const topics = collectTopics(items);
  const visibleItems = filterItemsByTopic(items, selectedTopic);
  const itemsPerPage = 1;
  const totalPages = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * itemsPerPage;
  const pageItems = visibleItems.slice(pageStart, pageStart + itemsPerPage);
  const currentHadith = pageItems[0];
  const selectedGroupLabel = activeGroup ? prettifySegment(activeGroup) : 'Collections';
  const selectedCollectionLabel = selectedCollection ? getCollectionLabel(selectedCollection, activeView) : 'Reader';
  const previousHref = safePage > 1
    ? buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode, topic: selectedTopic, group: activeGroup, page: safePage - 1 })
    : undefined;
  const nextHref = safePage < totalPages
    ? buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode, topic: selectedTopic, group: activeGroup, page: safePage + 1 })
    : undefined;
  const navigatorCollections = navigationCollections.map((collection) => {
    const view: HadithViewMode = collection.resolvedView === 'by_chapter' ? 'by_chapter' : 'by_book';
    const groupKey = getGroupKey(collection, view);

    return {
      id: collection.id,
      label: getCollectionLabel(collection, view),
      view,
      groupKey,
      groupLabel: prettifySegment(groupKey),
      itemCount: collection.itemCount
    };
  });

  return (
    <main className={`noor-page ${styles.page}`} id="hadith-top">
      <HadithNavigationControls
        groups={navigationGroupSummaries.map(({ sortView, ...group }) => group)}
        collections={navigatorCollections}
        topics={topics}
        currentView={activeView}
        currentMode={activeMode}
        currentGroup={activeGroup}
        currentCollectionId={selectedCollection?.id}
        currentTopic={selectedTopic}
        currentPage={safePage}
        totalPages={totalPages}
        selectedCollectionLabel={selectedCollectionLabel}
        selectedGroupLabel={selectedGroupLabel}
      />

      <section className={styles.readerMain} aria-label="Hadith reading surface">
          {activeView === 'by_chapter' && byChapterCollections.length === 0 ? (
            <NoorCard>
              <span className="noor-badge">No chapter view yet</span>
              <p className="noor-subtitle">This content source does not currently expose chapter navigation. Use the book view for now.</p>
            </NoorCard>
          ) : null}

          <section className={styles.singleStack} id="hadith-reader">
            {visibleItems.length === 0 ? (
              <NoorCard>
                <h2>No Hadith items found</h2>
                <p className="noor-subtitle">Try another collection, view or topic.</p>
              </NoorCard>
            ) : null}

            {currentHadith ? (
              <HadithSingleReader
                lastVisit={{
                  href: buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode, topic: selectedTopic, group: activeGroup, page: safePage }),
                  title: `Hadith ${currentHadith.number}`,
                  subtitle: selectedCollectionLabel
                }}
                previousHref={previousHref}
                nextHref={nextHref}
                position={safePage}
                total={visibleItems.length}
              >
                <HadithCard
                  key={currentHadith.viewItemId ?? `${currentHadith.collectionId}-${currentHadith.id}`}
                  hadith={currentHadith}
                  mode={activeMode}
                  index={pageStart + 1}
                />
              </HadithSingleReader>
            ) : null}
          </section>

      </section>
    </main>
  );
}
