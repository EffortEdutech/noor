import type { ContentDatasetManifest, ContentHealthReport } from '@noor/content';
import { buildDemoContentHealthReport, DEMO_CONTENT_MANIFEST } from '@noor/content';
import { getNoorDataConfig, joinNoorCdnPath, type NoorResolverOptions } from '../config';
import { fetchJsonWithFallback } from '../fetch-json';

export async function getContentManifest(
  options: NoorResolverOptions = {}
): Promise<ContentDatasetManifest> {
  const config = getNoorDataConfig(options.source);

  return fetchJsonWithFallback<ContentDatasetManifest>(
    joinNoorCdnPath(config.manifestCdnBase, 'manifest/noor-content-manifest.json'),
    DEMO_CONTENT_MANIFEST,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}

export async function getContentHealthReport(
  options: NoorResolverOptions = {}
): Promise<ContentHealthReport> {
  const config = getNoorDataConfig(options.source);
  const fallback = buildDemoContentHealthReport();

  return fetchJsonWithFallback<ContentHealthReport>(
    joinNoorCdnPath(config.manifestCdnBase, 'manifest/noor-content-health.json'),
    fallback,
    { mode: config.mode, allowFallback: options.allowFallback }
  );
}
