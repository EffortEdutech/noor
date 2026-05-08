'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './HadithNavigationControls.module.css';

type HadithViewMode = 'by_book' | 'by_chapter';
type HadithReaderMode = 'read' | 'reflect' | 'practice';

export type HadithNavigatorGroup = {
  key: string;
  label: string;
  collections: number;
  items: number;
};

export type HadithNavigatorCollection = {
  id: string;
  label: string;
  view: HadithViewMode;
  groupKey: string;
  groupLabel: string;
  itemCount?: number;
};

export type HadithNavigatorTopic = {
  topic: string;
  count: number;
};

const READER_MODES: Array<{ id: HadithReaderMode; label: string; helper: string }> = [
  { id: 'read', label: 'Read', helper: 'Read the narration with source context.' },
  { id: 'reflect', label: 'Reflect', helper: 'Pause for meaning, character and intention.' },
  { id: 'practice', label: 'Practise', helper: 'Turn one narration into one Sunnah action.' }
];

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
  return `/learn/hadith?${params.toString()}#hadith-reader`;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function ModeSwitcher({
  view,
  collectionId,
  group,
  topic,
  page,
  activeMode
}: {
  view: HadithViewMode;
  collectionId?: string;
  group?: string;
  topic?: string;
  page: number;
  activeMode: HadithReaderMode;
}) {
  return (
    <div className={styles.modeSwitcher} role="tablist" aria-label="Hadith reader mode">
      {READER_MODES.map((mode) => (
        <a
          key={mode.id}
          role="tab"
          data-active={activeMode === mode.id}
          aria-selected={activeMode === mode.id}
          title={mode.helper}
          href={buildHadithHref({ view, collectionId, group, topic, page, mode: mode.id })}
        >
          {mode.label}
        </a>
      ))}
    </div>
  );
}

export function HadithNavigationControls({
  groups,
  collections,
  topics,
  currentView,
  currentMode,
  currentGroup,
  currentCollectionId,
  currentTopic,
  currentPage,
  totalPages,
  selectedCollectionLabel,
  selectedGroupLabel
}: {
  groups: HadithNavigatorGroup[];
  collections: HadithNavigatorCollection[];
  topics: HadithNavigatorTopic[];
  currentView: HadithViewMode;
  currentMode: HadithReaderMode;
  currentGroup?: string;
  currentCollectionId?: string;
  currentTopic?: string;
  currentPage: number;
  totalPages: number;
  selectedCollectionLabel: string;
  selectedGroupLabel: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [modeSlot, setModeSlot] = useState<HTMLElement | null>(null);
  const [selectedView, setSelectedView] = useState<HadithViewMode>(currentView);
  const [selectedGroup, setSelectedGroup] = useState(currentGroup ?? '');
  const [selectedCollectionId, setSelectedCollectionId] = useState(currentCollectionId ?? '');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setModeSlot(document.getElementById('noor-quran-reader-mode-slot'));
    return () => setModeSlot(null);
  }, []);

  useEffect(() => {
    setSelectedView(currentView);
    setSelectedGroup(currentGroup ?? '');
    setSelectedCollectionId(currentCollectionId ?? '');
  }, [currentView, currentGroup, currentCollectionId]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const groupsForView = useMemo(() => {
    const collectionGroups = new Set(collections.filter((collection) => collection.view === selectedView).map((collection) => collection.groupKey));
    return groups.filter((group) => collectionGroups.has(group.key));
  }, [collections, groups, selectedView]);

  const safeGroup = groupsForView.some((group) => group.key === selectedGroup)
    ? selectedGroup
    : groupsForView[0]?.key ?? '';

  const collectionsForSelection = useMemo(() => {
    const term = normalize(search);
    return collections
      .filter((collection) => collection.view === selectedView && (!safeGroup || collection.groupKey === safeGroup))
      .filter((collection) => {
        if (!term) return true;
        return `${collection.label} ${collection.groupLabel}`.toLowerCase().includes(term);
      });
  }, [collections, safeGroup, search, selectedView]);

  const safeCollectionId = collectionsForSelection.some((collection) => collection.id === selectedCollectionId)
    ? selectedCollectionId
    : collectionsForSelection[0]?.id ?? '';

  function pushSelection({
    view = selectedView,
    group = safeGroup,
    collectionId = safeCollectionId,
    topic = currentTopic,
    page = 1
  }: {
    view?: HadithViewMode;
    group?: string;
    collectionId?: string;
    topic?: string;
    page?: number;
  } = {}) {
    setOpen(false);
    router.push(buildHadithHref({ view, collectionId, mode: currentMode, group, topic, page }));
  }

  function changeView(view: HadithViewMode) {
    setSelectedView(view);
    const nextGroup = groups.find((group) => collections.some((collection) => collection.view === view && collection.groupKey === group.key))?.key ?? '';
    const nextCollection = collections.find((collection) => collection.view === view && (!nextGroup || collection.groupKey === nextGroup));
    setSelectedGroup(nextGroup);
    setSelectedCollectionId(nextCollection?.id ?? '');
  }

  const topbarModeControls = modeSlot
    ? createPortal(
        <ModeSwitcher
          view={currentView}
          collectionId={currentCollectionId}
          group={currentGroup}
          topic={currentTopic}
          page={currentPage}
          activeMode={currentMode}
        />,
        modeSlot
      )
    : null;

  return (
    <>
      {topbarModeControls}

      <div className={styles.float} data-open={open ? 'true' : 'false'}>
        {open ? <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" /> : null}

        {open ? (
          <section className={styles.panel} role="dialog" aria-modal="true" aria-label="Hadith navigation">
            <header className={styles.panelHead}>
              <div>
                <span>Hadith navigator</span>
                <h2>Choose source, book, chapter or page</h2>
                <p>Keep navigation here so the Hadith page stays focused on knowledge.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close Hadith navigator">
                Close
              </button>
            </header>

            <div className={styles.panelBody}>
              <div className={styles.structureTabs} role="tablist" aria-label="Hadith structure">
                <button type="button" data-active={selectedView === 'by_book'} onClick={() => changeView('by_book')}>
                  By book
                </button>
                <button type="button" data-active={selectedView === 'by_chapter'} onClick={() => changeView('by_chapter')}>
                  By chapter
                </button>
              </div>

              <div className={styles.fields}>
                <label>
                  <span>{selectedView === 'by_chapter' ? 'Book' : 'Family'}</span>
                  <select value={safeGroup} onChange={(event) => setSelectedGroup(event.target.value)}>
                    {groupsForView.map((group) => (
                      <option value={group.key} key={group.key}>
                        {group.label} - {group.collections} collections
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>{selectedView === 'by_chapter' ? 'Chapter' : 'Book'}</span>
                  <select value={safeCollectionId} onChange={(event) => setSelectedCollectionId(event.target.value)}>
                    {collectionsForSelection.map((collection) => (
                      <option value={collection.id} key={collection.id}>
                        {collection.label}{typeof collection.itemCount === 'number' ? ` - ${collection.itemCount} items` : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={styles.search}>
                <span>Find within this source</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search book or chapter" />
              </label>

              <div className={styles.summary}>
                <span>Current reading</span>
                <strong>{selectedCollectionLabel}</strong>
                <p>{selectedGroupLabel} / Hadith {currentPage} of {totalPages}</p>
              </div>

              <div className={styles.collectionMap} aria-label="Visible Hadith source structure">
                <div className={styles.mapHead}>
                  <strong>{selectedView === 'by_chapter' ? 'Chapters' : 'Books'}</strong>
                  <span>{collectionsForSelection.length} shown</span>
                </div>

                {collectionsForSelection.slice(0, 36).map((collection) => (
                  <button
                    type="button"
                    key={collection.id}
                    data-active={collection.id === safeCollectionId}
                    onClick={() => {
                      setSelectedCollectionId(collection.id);
                      pushSelection({ view: selectedView, group: collection.groupKey, collectionId: collection.id, topic: '', page: 1 });
                    }}
                  >
                    <strong>{collection.label}</strong>
                    <span>{collection.groupLabel}{typeof collection.itemCount === 'number' ? ` / ${collection.itemCount} items` : ''}</span>
                  </button>
                ))}
              </div>

              {topics.length > 0 ? (
                <div className={styles.topicMap} aria-label="Hadith topics">
                  <div className={styles.mapHead}>
                    <strong>Topics</strong>
                    <span>{topics.length} available</span>
                  </div>
                  <button
                    type="button"
                    data-active={!currentTopic}
                    onClick={() => pushSelection({ topic: '', page: 1 })}
                  >
                    All topics
                  </button>
                  {topics.map((topic) => (
                    <button
                      type="button"
                      key={topic.topic}
                      data-active={currentTopic === topic.topic}
                      onClick={() => pushSelection({ topic: topic.topic, page: 1 })}
                    >
                      #{topic.topic} ({topic.count})
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <footer className={styles.actions}>
              <button type="button" onClick={() => pushSelection()}>
                Open selection
              </button>
              <div>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => pushSelection({ view: currentView, group: currentGroup, collectionId: currentCollectionId, page: currentPage - 1 })}
                >
                  Previous Hadith
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => pushSelection({ view: currentView, group: currentGroup, collectionId: currentCollectionId, page: currentPage + 1 })}
                >
                  Next Hadith
                </button>
              </div>
            </footer>
          </section>
        ) : null}

        <button
          type="button"
          className={styles.floatButton}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Open Hadith navigator"
        >
          <span aria-hidden="true">
            <img src="/icons/09-spread-mark.png?v=noor-floating-hadith" alt="" width="44" height="44" />
          </span>
        </button>
      </div>
    </>
  );
}
