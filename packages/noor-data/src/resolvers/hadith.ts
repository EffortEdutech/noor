import type { HadithCollection, HadithItem } from '@noor/content';
import { DEMO_HADITH_COLLECTIONS, DEMO_HADITH_ITEMS } from '@noor/content';
import { getNoorDataConfig, joinNoorCdnPath, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getHadithCollections(
  options: NoorResolverOptions = {}
): Promise<HadithCollection[]> {
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<HadithCollection[]>(
    joinNoorCdnPath(config.hadithCdnBase, 'hadith/collections.json'),
    DEMO_HADITH_COLLECTIONS,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}

export async function getHadithItems(
  collectionId: string,
  options: NoorResolverOptions = {}
): Promise<HadithItem[]> {
  const config = getNoorDataConfig(options.source);
  const fallback = DEMO_HADITH_ITEMS[collectionId] ?? [];

  return fetchJsonWithFallback<HadithItem[]>(
    joinNoorCdnPath(config.hadithCdnBase, `hadith/${collectionId}/items.json`),
    fallback,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}
