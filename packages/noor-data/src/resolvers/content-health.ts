import type { ContentDatasetManifest, ContentHealthReport } from '@noor/content';
import { buildDemoContentHealthReport, DEMO_CONTENT_MANIFEST } from '@noor/content';
import { getNoorDataConfig } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getContentManifest(): Promise<ContentDatasetManifest> {
  const config = getNoorDataConfig();

  return fetchJsonWithFallback<ContentDatasetManifest>(
    `${config.quranCdnBase}/manifest/noor-content-manifest.json`,
    DEMO_CONTENT_MANIFEST
  );
}

export async function getContentHealthReport(): Promise<ContentHealthReport> {
  const config = getNoorDataConfig();
  const fallback = buildDemoContentHealthReport();

  return fetchJsonWithFallback<ContentHealthReport>(
    `${config.quranCdnBase}/manifest/noor-content-health.json`,
    fallback
  );
}
