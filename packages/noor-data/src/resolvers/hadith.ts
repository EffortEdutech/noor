import type { HadithCollection, HadithItem } from '@noor/content';
import { DEMO_HADITH_COLLECTIONS, DEMO_HADITH_ITEMS } from '@noor/content';
import { getNoorDataConfig } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getHadithCollections(): Promise<HadithCollection[]> {
  const config = getNoorDataConfig();
  return fetchJsonWithFallback<HadithCollection[]>(
    `${config.hadithCdnBase}/hadith/collections.json`,
    DEMO_HADITH_COLLECTIONS
  );
}

export async function getHadithItems(collectionId: string): Promise<HadithItem[]> {
  const config = getNoorDataConfig();
  const fallback = DEMO_HADITH_ITEMS[collectionId] ?? [];

  return fetchJsonWithFallback<HadithItem[]>(
    `${config.hadithCdnBase}/hadith/${collectionId}/items.json`,
    fallback
  );
}
