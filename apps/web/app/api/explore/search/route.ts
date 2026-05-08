import { NextResponse, type NextRequest } from 'next/server';
import { searchNoorIndex, type NoorSearchIndexEntry, type NoorSearchType } from '@noor/search';

const DEFAULT_EXTERNAL_CDN_BASE = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';
const DEFAULT_RAW_CDN_BASE = 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn';
const SEARCH_TYPES: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];
const shardCache = new Map<string, Promise<NoorSearchIndexEntry[]>>();

type SearchIndexManifest = {
  shards?: Array<{ path: string; number?: number }>;
  compatibilityIndex?: { path: string };
};

function trimBase(value: string) {
  return value.replace(/\/+$/, '');
}

function getCdnBase() {
  return trimBase(process.env.NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE ?? DEFAULT_EXTERNAL_CDN_BASE);
}

function parseTypes(value: string | null): NoorSearchType[] {
  if (!value) return SEARCH_TYPES;
  const requested = value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is NoorSearchType => SEARCH_TYPES.includes(item as NoorSearchType));
  return requested.length > 0 ? requested : SEARCH_TYPES;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return (await response.json()) as T;
}

async function fetchSearchShard(base: string, path: string): Promise<NoorSearchIndexEntry[]> {
  const cached = shardCache.get(path);
  if (cached) return cached;

  const load = (async () => {
    if (path.startsWith('search/shards/')) {
      return fetchJson<NoorSearchIndexEntry[]>(`${DEFAULT_RAW_CDN_BASE}/${path}`);
    }

    return fetchJson<NoorSearchIndexEntry[]>(`${base}/${path}`);
  })();

  shardCache.set(path, load);
  return load;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('q')?.trim() ?? '';
  const topic = params.get('topic')?.trim() || undefined;
  const types = parseTypes(params.get('types'));
  const limit = Math.min(Math.max(Number.parseInt(params.get('limit') ?? '36', 10) || 36, 1), 60);

  if (!query) return NextResponse.json({ results: [] });

  try {
    const base = getCdnBase();
    const manifest = await fetchJson<SearchIndexManifest>(`${base}/manifest/search-index-manifest.json`);
    const shardPaths = manifest.shards?.map((shard) => shard.path).filter(Boolean) ?? [];
    const paths = shardPaths.length > 0
      ? shardPaths
      : [manifest.compatibilityIndex?.path ?? 'search/search-index.json'];

    const scoredResults = (
      await Promise.all(
        paths.map(async (path) => {
          const index = await fetchSearchShard(base, path);
          return types.flatMap((type) => searchNoorIndex(query, index, { types: [type], topic, limit }));
        })
      )
    )
      .flat()
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

    const seen = new Set<string>();
    const uniqueResults = scoredResults.filter((result) => {
      const key = `${result.type}:${result.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const perTypeLimit = Math.max(1, Math.ceil(limit / types.length));
    const balancedResults = types.flatMap((type) =>
      uniqueResults.filter((result) => result.type === type).slice(0, perTypeLimit)
    );
    const balancedKeys = new Set(balancedResults.map((result) => `${result.type}:${result.id}`));
    const fillResults = uniqueResults.filter((result) => !balancedKeys.has(`${result.type}:${result.id}`));
    const results = [...balancedResults, ...fillResults].slice(0, limit);

    return NextResponse.json({ results, source: 'cdn-shards', shardCount: paths.length });
  } catch (error) {
    return NextResponse.json(
      { results: [], error: error instanceof Error ? error.message : 'Search failed' },
      { status: 502 }
    );
  }
}
