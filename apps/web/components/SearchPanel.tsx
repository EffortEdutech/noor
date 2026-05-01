'use client';

import { NoorCard } from '@noor/ui';
import { NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY } from '../lib/runtime-content-source-constants';
import {
  getNoorSearchTypeLabel,
  getNoorSearchSuggestions,
  NOOR_SEARCH_TOPICS,
  NOOR_SEARCH_TYPES,
  searchNoorIndex,
  searchNoorLocal,
  type NoorSearchIndexEntry,
  type NoorSearchType
} from '@noor/search';
import { useEffect, useMemo, useState } from 'react';

const RECENT_SEARCHES_KEY = 'noor.search.recent.v1';

const activeButtonStyle = {
  borderColor: 'rgba(216, 183, 90, 0.42)',
  background: 'linear-gradient(135deg, rgba(216, 183, 90, 0.22), rgba(47, 191, 155, 0.11))',
  color: 'var(--noor-ink)'
};

const DEFAULT_EXTERNAL_CDN_BASE = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';

type RuntimeSearchSource = 'mock' | 'local-cdn' | 'cdn';

function normalizeRuntimeSearchSource(value: string | null | undefined): RuntimeSearchSource {
  if (value === 'cdn') return 'cdn';
  if (value === 'local-cdn' || value === 'local') return 'local-cdn';
  return 'mock';
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function readRuntimeSearchSource(): RuntimeSearchSource {
  try {
    const saved = localStorage.getItem(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY);
    if (saved) return normalizeRuntimeSearchSource(saved);
  } catch {
    // Ignore blocked localStorage and fall back to cookie/environment.
  }

  const cookieValue = readCookie(NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY);
  if (cookieValue) return normalizeRuntimeSearchSource(cookieValue);

  return normalizeRuntimeSearchSource(process.env.NEXT_PUBLIC_NOOR_DATA_MODE);
}

function trimBase(value: string) {
  return value.replace(/\/+$/, '');
}

function getSearchIndexEndpoint(source: RuntimeSearchSource) {
  if (source === 'mock') return null;

  if (source === 'local-cdn') {
    const localBase = process.env.NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE ?? '/noor-cdn';
    return `${trimBase(localBase)}/search/search-index.json`;
  }

  const externalBase = process.env.NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE ?? DEFAULT_EXTERNAL_CDN_BASE;
  return `${trimBase(externalBase)}/search/search-index.json`;
}

function getSourceLabel(source: RuntimeSearchSource) {
  if (source === 'cdn') return 'External CDN';
  if (source === 'local-cdn') return 'Local CDN';
  return 'Bundled demo content';
}

async function fetchSearchIndex(endpoint: string): Promise<NoorSearchIndexEntry[]> {
  const response = await fetch(endpoint, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load search index: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? (data as NoorSearchIndexEntry[]) : [];
}

function readRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(items: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(items.slice(0, 8)));
}

function SearchTypeToggle({
  type,
  active,
  onToggle
}: {
  type: NoorSearchType;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="noor-button secondary"
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      style={active ? activeButtonStyle : undefined}
      title={NOOR_SEARCH_TYPES.find((item) => item.id === type)?.description}
    >
      {getNoorSearchTypeLabel(type)}
    </button>
  );
}

export function SearchPanel() {
  const [query, setQuery] = useState('mercy');
  const [selectedTypes, setSelectedTypes] = useState<NoorSearchType[]>(
    NOOR_SEARCH_TYPES.map((item) => item.id)
  );
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('mercy');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [cdnSearchIndex, setCdnSearchIndex] = useState<NoorSearchIndexEntry[] | null>(null);
  const [searchSourceLabel, setSearchSourceLabel] = useState('Bundled demo content');

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const source = readRuntimeSearchSource();
    const sourceLabel = getSourceLabel(source);
    const endpoint = getSearchIndexEndpoint(source);

    if (!endpoint) {
      setCdnSearchIndex(null);
      setSearchSourceLabel('Bundled demo content');
      return;
    }

    setSearchSourceLabel(`${sourceLabel} search index loading…`);

    fetchSearchIndex(endpoint)
      .then((index) => {
        if (cancelled) return;
        if (index.length > 0) {
          setCdnSearchIndex(index);
          setSearchSourceLabel(`${sourceLabel} search index`);
        } else {
          setCdnSearchIndex(null);
          setSearchSourceLabel('Bundled demo content');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setCdnSearchIndex(null);
        setSearchSourceLabel('Bundled demo content fallback');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = useMemo(() => getNoorSearchSuggestions(query), [query]);
  const results = useMemo(() => {
    const options = { types: selectedTypes, topic: selectedTopic, limit: 24 };
    return cdnSearchIndex
      ? searchNoorIndex(query, cdnSearchIndex, options)
      : searchNoorLocal(query, options);
  }, [cdnSearchIndex, query, selectedTypes, selectedTopic]);

  function rememberSearch(value = query) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
    setRecentSearches(next.slice(0, 8));
    writeRecentSearches(next);
  }

  function toggleType(type: NoorSearchType) {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        const next = current.filter((item) => item !== type);
        return next.length > 0 ? next : current;
      }
      return [...current, type];
    });
  }

  function applyTopic(topicId: string, topicQuery: string) {
    setSelectedTopic((current) => (current === topicId ? undefined : topicId));
    setQuery(topicQuery);
    rememberSearch(topicQuery);
  }

  return (
    <div className="noor-stack">
      <NoorCard variant="soft">
        <div className="noor-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <span className="noor-badge emerald">Search source: {searchSourceLabel}</span>
          {cdnSearchIndex ? (
            <span className="noor-badge gold">{cdnSearchIndex.length} CDN entries</span>
          ) : (
            <span className="noor-badge">Fallback active</span>
          )}
        </div>

        <div className="noor-grid" style={{ alignItems: 'end' }}>
          <label className="noor-form-field">
            <span className="noor-kicker">Explore search</span>
            <input
              className="noor-input"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedTopic(undefined);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') rememberSearch();
              }}
              placeholder="Try mercy, guidance, ikhlas, intention, protection..."
            />
          </label>

          <button className="noor-button" type="button" onClick={() => rememberSearch()}>
            Search
          </button>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
          <span className="noor-kicker">Content filters</span>
          <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
            {NOOR_SEARCH_TYPES.map((item) => (
              <SearchTypeToggle
                key={item.id}
                type={item.id}
                active={selectedTypes.includes(item.id)}
                onToggle={() => toggleType(item.id)}
              />
            ))}
          </div>
        </div>

        <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
          <span className="noor-kicker">Quick topics</span>
          <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
            {NOOR_SEARCH_TOPICS.map((topic) => (
              <button
                key={topic.id}
                className="noor-button secondary"
                type="button"
                onClick={() => applyTopic(topic.id, topic.label)}
                style={selectedTopic === topic.id ? activeButtonStyle : undefined}
                title={topic.description}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {recentSearches.length > 0 ? (
          <div className="noor-stack" style={{ gap: 10, marginTop: 16 }}>
            <span className="noor-kicker">Recent searches</span>
            <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
              {recentSearches.map((item) => (
                <button
                  key={item}
                  className="noor-badge"
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    setSelectedTopic(undefined);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </NoorCard>

      <div className="noor-row">
        <div>
          <span className="noor-kicker">Results</span>
          <p className="noor-subtitle">
            {results.length > 0
              ? `${results.length} ranked result${results.length === 1 ? '' : 's'} from ${searchSourceLabel}.`
              : 'No result found for the current search and filters.'}
          </p>
        </div>
        {suggestions.length > 0 ? (
          <span className="noor-badge gold">
            Suggestions: {suggestions.map((item) => item.label).join(', ')}
          </span>
        ) : null}
      </div>

      <div className="noor-grid">
        {results.map((result) => (
          <NoorCard key={`${result.type}-${result.id}`} className="noor-link-card">
            <div className="noor-row">
              <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
              <span className="noor-reference">{result.reference}</span>
            </div>

            <div>
              <strong>{result.title}</strong>
              {result.sourceLabel ? <p className="noor-muted">{result.sourceLabel}</p> : null}
            </div>

            <p className="noor-subtitle">{result.excerpt}</p>

            <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
              <span className="noor-badge">Score {result.score}</span>
              {result.matchedFields.slice(0, 3).map((field) => (
                <span className="noor-badge" key={`${result.type}-${result.id}-${field}`}>
                  {field}
                </span>
              ))}
            </div>

            {result.tags.length > 0 ? (
              <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
                {Array.from(new Set(result.tags)).slice(0, 4).map((tag) => (
                  <span className="noor-badge" key={`${result.type}-${result.id}-${tag}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {result.href ? (
              <a className="noor-button secondary" href={result.href} onClick={() => rememberSearch()}>
                Open
              </a>
            ) : null}
          </NoorCard>
        ))}
      </div>

      {results.length === 0 ? (
        <NoorCard>
          <h3 style={{ marginTop: 0 }}>No matching content yet</h3>
          <p className="noor-subtitle">
            Try a broader search such as mercy, guidance, ikhlas, intention, refuge, straight path,
            Allah, Al-Fatihah, foundations, prayer, protection, or journey. Sprint 26 connects this
            same interface to the generated CDN search index when available.
          </p>
        </NoorCard>
      ) : null}
    </div>
  );
}
