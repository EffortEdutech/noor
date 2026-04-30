import {
  getNoorDataConfig,
  joinNoorCdnPath,
  padSurah,
  type NoorDataConfig,
  type NoorDataMode,
  type NoorResolverOptions
} from '../config';

export type NoorResolverDiagnosticStatus = 'mock' | 'ok' | 'fallback' | 'error';

export type NoorResolverDiagnostic = {
  id: string;
  label: string;
  url: string;
  status: NoorResolverDiagnosticStatus;
  detail: string;
  required: boolean;
};

export type NoorResolverDiagnosticsReport = {
  source: NoorDataMode;
  config: NoorDataConfig;
  generatedAt: string;
  isHealthy: boolean;
  diagnostics: NoorResolverDiagnostic[];
};

type Endpoint = {
  id: string;
  label: string;
  url: string;
  required: boolean;
};

function buildEndpoints(config: NoorDataConfig): Endpoint[] {
  return [
    {
      id: 'manifest',
      label: 'Content manifest',
      url: joinNoorCdnPath(config.manifestCdnBase, 'manifest/noor-content-manifest.json'),
      required: true
    },
    {
      id: 'content-health',
      label: 'Content health report',
      url: joinNoorCdnPath(config.manifestCdnBase, 'manifest/noor-content-health.json'),
      required: true
    },
    {
      id: 'surah-index',
      label: 'Surah index',
      url: joinNoorCdnPath(config.quranCdnBase, 'metadata/surah-index.json'),
      required: true
    },
    {
      id: 'quran-001',
      label: 'Quran sample — Surah 001',
      url: joinNoorCdnPath(config.quranCdnBase, `quran/surahs/${padSurah(1)}.json`),
      required: true
    },
    {
      id: 'tafseer-001',
      label: 'Tafseer sample — demo-tafseer / Surah 001',
      url: joinNoorCdnPath(config.tafseerCdnBase, `tafseer/demo-tafseer/surahs/${padSurah(1)}.json`),
      required: true
    },
    {
      id: 'hadith-collections',
      label: 'Hadith collections',
      url: joinNoorCdnPath(config.hadithCdnBase, 'hadith/collections.json'),
      required: true
    }
  ];
}

async function checkEndpoint(endpoint: Endpoint, config: NoorDataConfig): Promise<NoorResolverDiagnostic> {
  if (config.mode === 'mock') {
    return {
      ...endpoint,
      status: 'mock',
      detail: 'Mock mode is active. NOOR will use bundled demo fallback content for this resolver.'
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2200);

  try {
    const response = await fetch(endpoint.url, {
      signal: controller.signal,
      cache: 'no-store'
    });

    if (response.ok) {
      return {
        ...endpoint,
        status: 'ok',
        detail: `Resolved successfully with HTTP ${response.status}.`
      };
    }

    return {
      ...endpoint,
      status: config.fallbackEnabled ? 'fallback' : 'error',
      detail: `Received HTTP ${response.status}. ${config.fallbackEnabled ? 'Bundled fallback will be used.' : 'Fallback is disabled.'}`
    };
  } catch (error) {
    return {
      ...endpoint,
      status: config.fallbackEnabled ? 'fallback' : 'error',
      detail: `${error instanceof Error ? error.message : 'Unknown fetch error'}. ${config.fallbackEnabled ? 'Bundled fallback will be used.' : 'Fallback is disabled.'}`
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getNoorResolverDiagnostics(
  options: NoorResolverOptions = {}
): Promise<NoorResolverDiagnosticsReport> {
  const config = getNoorDataConfig(options.source);
  const diagnostics = await Promise.all(
    buildEndpoints(config).map((endpoint) => checkEndpoint(endpoint, config))
  );

  return {
    source: config.mode,
    config,
    generatedAt: new Date().toISOString(),
    isHealthy: diagnostics.every((item) => item.status !== 'error'),
    diagnostics
  };
}
