import type { NoorSearchIndexEntry } from '@noor/search';
import { getNoorDataConfig, joinNoorCdnPath, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getNoorSearchIndex(
  options: NoorResolverOptions = {}
): Promise<NoorSearchIndexEntry[]> {
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<NoorSearchIndexEntry[]>(
    joinNoorCdnPath(config.manifestCdnBase, 'search/search-index.json'),
    [],
    {
      mode: config.mode,
      allowFallback: options.allowFallback ?? false,
      timeoutMs: 5000,
      revalidateSeconds: 60 * 60
    }
  );
}
