import type { QuranAyah, SurahContent, SurahIndexEntry } from '@noor/content';

export const QURAN_BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

type SurahBismillahFields = {
  number: number;
  bismillah?: string;
  hasBismillahHeader?: boolean;
  bismillahIsAyah?: boolean;
};

type SurahBismillahSource = SurahContent | SurahIndexEntry | SurahBismillahFields;

const NON_FATIHAH_SURAH_WITHOUT_BISMILLAH = 9;

const BISMILLAH_PREFIXES = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'بسم الله الرحمن الرحيم'
];

function getSurahMetadata(source: SurahBismillahSource): SurahBismillahFields {
  if ('surah' in source) return source.surah as SurahBismillahFields;
  return source as SurahBismillahFields;
}

function isNonFatihahAyahOne(ayah: QuranAyah) {
  return ayah.surah !== 1 && ayah.ayah === 1;
}

function stripBismillahPrefix(arabic: string) {
  const trimmed = arabic.trimStart();

  for (const prefix of BISMILLAH_PREFIXES) {
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length).trimStart();
  }

  return arabic;
}

export function getDisplayArabicForAyah(ayah: QuranAyah) {
  if (!isNonFatihahAyahOne(ayah)) return ayah.arabic;
  return stripBismillahPrefix(ayah.arabic);
}

export function hasBismillahPrefix(arabic: string | undefined) {
  if (!arabic) return false;
  const trimmed = arabic.trimStart();
  return BISMILLAH_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function getSurahBismillahHeader(source: SurahBismillahSource, firstAyah?: QuranAyah) {
  const surah = getSurahMetadata(source);

  if (surah.number === 1) return null;
  if (surah.number === NON_FATIHAH_SURAH_WITHOUT_BISMILLAH) return null;
  if (surah.bismillahIsAyah) return null;

  if (surah.hasBismillahHeader) return surah.bismillah ?? QURAN_BISMILLAH;
  if (firstAyah && hasBismillahPrefix(firstAyah.arabic)) return QURAN_BISMILLAH;

  return null;
}
