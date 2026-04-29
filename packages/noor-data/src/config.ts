export type NoorDataMode = 'mock' | 'cdn';

function env(name: string, fallback: string): string {
  return typeof process !== 'undefined' && process.env?.[name]
    ? String(process.env[name])
    : fallback;
}

export function getNoorDataConfig() {
  const modeValue = env('NEXT_PUBLIC_NOOR_DATA_MODE', 'mock');
  const mode: NoorDataMode = modeValue === 'cdn' ? 'cdn' : 'mock';

  return {
    mode,
    quranCdnBase: env(
      'NEXT_PUBLIC_NOOR_QURAN_CDN_BASE',
      'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-quran-data@main'
    ),
    tafseerCdnBase: env(
      'NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE',
      'https://huggingface.co/datasets/EffortEdutech/noor-tafseer-data/resolve/main'
    ),
    hadithCdnBase: env('NEXT_PUBLIC_NOOR_HADITH_CDN_BASE', 'https://data.noor.app')
  };
}

export function padSurah(surah: number): string {
  return String(surah).padStart(3, '0');
}
