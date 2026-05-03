import Link from 'next/link';
import { getHadithCollections, getHadithItems } from '@noor/data';
import { HadithCard, NoorCard, PageHeader } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

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

function buildHadithHref({
  view,
  collectionId,
  mode,
  topic
}: {
  view: HadithViewMode;
  collectionId?: string;
  mode?: HadithReaderMode;
  topic?: string;
}) {
  const params = new URLSearchParams({ view });
  if (collectionId) params.set('collection', collectionId);
  if (mode && mode !== 'read') params.set('mode', mode);
  if (topic) params.set('topic', topic);
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

function modeCopy(mode: HadithReaderMode) {
  if (mode === 'reflect') {
    return {
      label: 'Reflect',
      title: 'Read with the heart awake',
      body: 'Pause after each narration. Ask what it teaches about intention, character, worship or dealing with people.',
      prompt: 'What quality does this Hadith ask me to strengthen today?'
    };
  }

  if (mode === 'practice') {
    return {
      label: 'Practise',
      title: 'Turn Sunnah into one small action',
      body: 'Choose one narration and convert it into a practical action you can try today.',
      prompt: 'What is one small action I can practise before the day ends?'
    };
  }

  return {
    label: 'Read',
    title: 'Read slowly and understand the reference',
    body: 'Browse a collection, read a few narrations, and save reminders you want to return to.',
    prompt: 'Which Hadith should I save and revisit later?'
  };
}

function collectTopics(items: HadithItemWithCanonical[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tag of item.tags ?? []) {
      const normalized = tag.trim().toLowerCase();
      if (!normalized) continue;
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
  const currentMode = modeCopy(activeMode);
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
  const topics = collectTopics(items);
  const visibleItems = filterItemsByTopic(items, selectedTopic);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Hadith"
        title="Read the Sunnah as guidance for today."
        subtitle="Browse Hadith by book or chapter with a Read → Reflect → Practise flow, then save reminders, copy references and turn what you read into action."
      />

      <section className="noor-hero-grid noor-hadith-hero-grid">
        <NoorCard variant="gold" className="noor-link-card noor-hadith-reader-hero">
          <span className="noor-badge emerald">Hadith reader</span>
          <h2>{currentMode.title}</h2>
          <p className="noor-subtitle">{currentMode.body}</p>
          <div className="noor-reader-mode-preview noor-hadith-mode-tabs">
            {(['read', 'reflect', 'practice'] as HadithReaderMode[]).map((mode) => (
              <Link
                key={mode}
                className={`noor-button ${activeMode === mode ? 'primary' : 'secondary'}`}
                href={buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode, topic: selectedTopic })}
              >
                {modeCopy(mode).label}
              </Link>
            ))}
          </div>
          <p className="noor-reflection-prompt">{currentMode.prompt}</p>
        </NoorCard>

        <NoorCard variant="soft" className="noor-hadith-session-card">
          <span className="noor-kicker">Selected collection</span>
          <h2>{selectedCollection?.name ?? 'No Hadith collection found'}</h2>
          <p className="noor-subtitle">
            Showing {visibleItems.length} of {items.length} item{items.length === 1 ? '' : 's'} from the current view.
          </p>
          <div className="noor-reader-facts">
            <span>{collections.length} collections</span>
            <span>{byBookCollections.length || legacyCollections.length} by book</span>
            <span>{byChapterCollections.length} by chapter</span>
          </div>
          <div className="noor-card-actions">
            <Link className={`noor-button ${activeView === 'by_book' ? 'primary' : 'secondary'}`} href={buildHadithHref({ view: 'by_book', mode: activeMode })}>
              By book
            </Link>
            <Link className={`noor-button ${activeView === 'by_chapter' ? 'primary' : 'secondary'}`} href={buildHadithHref({ view: 'by_chapter', mode: activeMode })}>
              By chapter
            </Link>
          </div>
        </NoorCard>
      </section>

      <section className="noor-hadith-guidance-grid">
        <NoorCard>
          <span className="noor-kicker">Reader flow</span>
          <div className="noor-hadith-flow">
            <div>
              <strong>Read</strong>
              <span>Know the source, narrator, book and chapter.</span>
            </div>
            <div>
              <strong>Reflect</strong>
              <span>Notice the value, warning or encouragement.</span>
            </div>
            <div>
              <strong>Practise</strong>
              <span>Choose one Sunnah action to live today.</span>
            </div>
          </div>
        </NoorCard>

        <NoorCard>
          <span className="noor-kicker">Topics in this collection</span>
          {topics.length > 0 ? (
            <div className="noor-topic-chip-row">
              <Link className={`noor-badge ${selectedTopic ? '' : 'gold'}`} href={buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode })}>
                All
              </Link>
              {topics.map(({ topic, count }) => (
                <Link
                  key={topic}
                  className={`noor-badge ${selectedTopic === topic ? 'gold' : 'emerald'}`}
                  href={buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode, topic })}
                >
                  #{topic} ({count})
                </Link>
              ))}
            </div>
          ) : (
            <p className="noor-subtitle">This collection does not expose topic tags yet.</p>
          )}
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

      <section className="noor-section-heading">
        <div>
          <span className="noor-kicker">Choose collection</span>
          <h2>{activeView === 'by_chapter' ? 'Browse by chapter' : 'Browse by book'}</h2>
        </div>
        <Link className="noor-button secondary" href="/explore">Search by topic</Link>
      </section>

      <section className="noor-grid">
        {visibleCollections.map((collection) => (
          <NoorCard key={collection.renderKey} className="noor-link-card">
            <span className="noor-badge emerald">{collectionBadgeLabel(collection.resolvedView)}</span>
            <h2>{collection.name}</h2>
            <p className="noor-subtitle">{collection.description}</p>
            {collection.sourceScope ? <p className="noor-subtitle">Scope: {collection.sourceScope}</p> : null}
            {typeof collection.itemCount === 'number' ? <p className="noor-subtitle">Items: {collection.itemCount}</p> : null}
            <Link className="noor-button secondary" href={buildHadithHref({ view: activeView, collectionId: collection.id, mode: activeMode })}>
              Open collection
            </Link>
          </NoorCard>
        ))}
      </section>

      <section className="noor-section-heading" id="hadith-reader">
        <div>
          <span className="noor-kicker">Hadith reminders</span>
          <h2>{selectedCollection?.name ?? 'Reader'}</h2>
        </div>
        {selectedTopic ? (
          <Link className="noor-button secondary" href={buildHadithHref({ view: activeView, collectionId: selectedCollection?.id, mode: activeMode })}>
            Clear topic #{selectedTopic}
          </Link>
        ) : null}
      </section>

      <section className="noor-stack">
        {visibleItems.length === 0 ? (
          <NoorCard>
            <h2>No Hadith items found</h2>
            <p className="noor-subtitle">Try another collection, view or topic.</p>
          </NoorCard>
        ) : null}

        {visibleItems.map((hadith, index) => (
          <HadithCard
            key={hadith.viewItemId ?? `${hadith.collectionId}-${hadith.id}-${index}`}
            hadith={hadith}
            mode={activeMode}
            index={index + 1}
          />
        ))}
      </section>
    </main>
  );
}
