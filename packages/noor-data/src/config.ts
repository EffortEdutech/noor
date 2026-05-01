export type NoorDataMode = 'mock' | 'local-cdn' | 'cdn';

export type NoorDataConfig = {
  mode: NoorDataMode;
  sourceLabel: string;
  sourceDescription: string;
  quranCdnBase: string;
  tafseerCdnBase: string;
  hadithCdnBase: string;
  manifestCdnBase: string;
  usesNetwork: boolean;
  fallbackEnabled: boolean;
};

export type NoorResolverOptions = {
  source?: NoorDataMode | string | null;
  allowFallback?: boolean;
};

export type NoorDataSourceOption = {
  id: NoorDataMode;
  label: string;
  description: string;
  badge: string;
};

export const NOOR_DATA_SOURCE_OPTIONS: NoorDataSourceOption[] = [
  {
    id: 'mock',
    label: 'Mock fallback',
    badge: 'Offline-safe',
    description: 'Uses bundled demo content only. Best for guaranteed offline/local testing.'
  },
  {
    id: 'local-cdn',
    label: 'Local CDN',
    badge: 'Runtime test',
    description: 'Loads prepared files from /noor-cdn after running pnpm content:prepare and pnpm dev.'
  },
  {
    id: 'cdn',
    label: 'External CDN',
    badge: 'Future production',
    description: 'Loads data from configured external CDN bases, with fallback to bundled demo content.'
  }
];

const DEFAULT_NOOR_CDN_BASE = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';

function env(name: string, fallback: string): string {
  return typeof process !== 'undefined' && process.env?.[name]
    ? String(process.env[name])
    : fallback;
}

function trimBase(value: string): string {
  return value.replace(/\/+$/, '');
}

export function normalizeNoorDataMode(value?: string | null): NoorDataMode {
  if (value === 'cdn') return 'cdn';
  if (value === 'local-cdn' || value === 'local') return 'local-cdn';
  return 'mock';
}

export function joinNoorCdnPath(base: string, path: string): string {
  const cleanBase = trimBase(base);
  const cleanPath = path.replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
}

export function getNoorDataConfig(sourceOverride?: NoorDataMode | string | null): NoorDataConfig {
  const mode = normalizeNoorDataMode(
    sourceOverride ?? env('NEXT_PUBLIC_NOOR_DATA_MODE', 'mock')
  );

  if (mode === 'local-cdn') {
    const localBase = trimBase(
      env('NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE', 'http://localhost:3200/noor-cdn')
    );

    return {
      mode,
      sourceLabel: 'Local CDN',
      sourceDescription: 'Runtime source using prepared JSON files served by the local Next.js public folder.',
      quranCdnBase: localBase,
      tafseerCdnBase: localBase,
      hadithCdnBase: localBase,
      manifestCdnBase: localBase,
      usesNetwork: true,
      fallbackEnabled: true
    };
  }

  if (mode === 'cdn') {
    const quranCdnBase = trimBase(
      env('NEXT_PUBLIC_NOOR_QURAN_CDN_BASE', DEFAULT_NOOR_CDN_BASE)
    );
    const tafseerCdnBase = trimBase(
      env('NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE', DEFAULT_NOOR_CDN_BASE)
    );
    const hadithCdnBase = trimBase(
      env('NEXT_PUBLIC_NOOR_HADITH_CDN_BASE', DEFAULT_NOOR_CDN_BASE)
    );
    const manifestCdnBase = trimBase(
      env('NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE', DEFAULT_NOOR_CDN_BASE)
    );

    return {
      mode,
      sourceLabel: 'External CDN',
      sourceDescription: 'Runtime source using configured external CDN bases.',
      quranCdnBase,
      tafseerCdnBase,
      hadithCdnBase,
      manifestCdnBase,
      usesNetwork: true,
      fallbackEnabled: true
    };
  }

  return {
    mode: 'mock',
    sourceLabel: 'Mock fallback',
    sourceDescription: 'Bundled demo content. No network request is required.',
    quranCdnBase: 'mock://noor-demo',
    tafseerCdnBase: 'mock://noor-demo',
    hadithCdnBase: 'mock://noor-demo',
    manifestCdnBase: 'mock://noor-demo',
    usesNetwork: false,
    fallbackEnabled: true
  };
}

export function padSurah(surah: number): string {
  return String(surah).padStart(3, '0');
}
