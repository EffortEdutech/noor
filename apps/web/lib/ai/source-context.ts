import type { QuranAyah, TafseerEntry } from '@noor/content';
import type { AiRelatedAyah, AiRelatedHadith, AiSourceContext } from './types';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
const BISMILLAH_PATTERN = /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَـٰنِ\s+ٱلرَّحِيمِ\s*/u;

export const NOOR_SAFE_SEPARATOR = ' | ';

export function cleanNoorUiText(value: string | undefined | null) {
  return (value ?? '')
    .replace(/Â/g, '')
    .replace(/Ã/g, '')
    .replace(/âœ¦/g, '')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€"/g, '-')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€�/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripLeadingBismillah(arabic: string, surah: number, ayah: number) {
  if (surah === 1 && ayah === 1) return arabic;

  const trimmed = arabic.trimStart();
  if (trimmed.startsWith(BISMILLAH)) return trimmed.slice(BISMILLAH.length).trimStart();

  return trimmed.replace(BISMILLAH_PATTERN, '');
}

export function getArabicPassageForAi(ayahs: QuranAyah[]) {
  return ayahs
    .map((ayah) => stripLeadingBismillah(ayah.arabic, ayah.surah, ayah.ayah))
    .filter(Boolean)
    .join(' ');
}

export function getTranslationsForAi(ayahs: QuranAyah[]) {
  return ayahs.flatMap((ayah) => {
    const translations = [
      ayah.translations.en ? { language: `English ${ayah.key}`, text: cleanNoorUiText(ayah.translations.en) } : null,
      ayah.translations.ms ? { language: `Malay ${ayah.key}`, text: cleanNoorUiText(ayah.translations.ms) } : null,
      ayah.translations.id ? { language: `Indonesian ${ayah.key}`, text: cleanNoorUiText(ayah.translations.id) } : null
    ];

    return translations.filter((item): item is { language: string; text: string } => Boolean(item));
  });
}

export function getRangeTextForAi(surah: number, fromAyah: number, toAyah: number) {
  return fromAyah === toAyah ? `${surah}:${fromAyah}` : `${surah}:${fromAyah}-${toAyah}`;
}

export function getVerifiedRelatedAyatPlaceholder(): AiRelatedAyah[] {
  return [];
}

export function getVerifiedRelatedHadithPlaceholder(): AiRelatedHadith[] {
  return [];
}

function getMissingRelationshipNotes() {
  return [
    'NOOR did not supply verified related ayat for this passage yet. Do not invent related ayat.',
    'NOOR did not supply verified related hadith for this passage yet. Do not invent hadith.',
    'Only use related ayat or hadith when NOOR passes verified relationship data into this context.'
  ];
}

export function summarizeSourcesGathered(context: AiSourceContext) {
  return [
    `Quran ${context.reference}`,
    context.tafseer?.sourceLabel ? `Tafseer: ${cleanNoorUiText(context.tafseer.sourceLabel)}` : 'Tafseer: not supplied',
    (context.relatedAyat?.length ?? 0) > 0
      ? `Related ayat: ${context.relatedAyat?.length}`
      : 'Related ayat: not supplied',
    (context.relatedHadith?.length ?? 0) > 0
      ? `Related hadith: ${context.relatedHadith?.length}`
      : 'Related hadith: not supplied'
  ];
}

export function buildQuranAyahAiContext({
  ayah,
  displayArabic,
  tafseer
}: {
  ayah: QuranAyah;
  displayArabic: string;
  tafseer?: TafseerEntry;
}): AiSourceContext {
  const reference = ayah.key;
  const relatedAyat = getVerifiedRelatedAyatPlaceholder();
  const relatedHadith = getVerifiedRelatedHadithPlaceholder();

  return {
    surface: 'quran',
    reference,
    surah: ayah.surah,
    fromAyah: ayah.ayah,
    toAyah: ayah.ayah,
    arabic: displayArabic,
    translations: getTranslationsForAi([ayah]),
    tafseer: tafseer ? {
      sourceLabel: cleanNoorUiText(tafseer.sourceLabel),
      language: tafseer.language,
      title: cleanNoorUiText(tafseer.title),
      body: tafseer.body,
      reference: getRangeTextForAi(tafseer.surah, tafseer.fromAyah, tafseer.toAyah)
    } : undefined,
    relatedAyat,
    relatedHadith,
    notes: [
      'Talab an-Noor Quran reader context.',
      ...getMissingRelationshipNotes()
    ]
  };
}

export function buildTafseerAiContext({
  entry,
  ayahContext,
  quranPassage,
  rangeText,
  teachingQuote
}: {
  entry: TafseerEntry;
  ayahContext: QuranAyah[];
  quranPassage: string;
  rangeText: string;
  teachingQuote: string;
}): AiSourceContext {
  const relatedAyat = getVerifiedRelatedAyatPlaceholder();
  const relatedHadith = getVerifiedRelatedHadithPlaceholder();

  return {
    surface: 'tafseer',
    reference: rangeText,
    surah: entry.surah,
    fromAyah: entry.fromAyah,
    toAyah: entry.toAyah,
    arabic: quranPassage,
    translations: getTranslationsForAi(ayahContext),
    tafseer: {
      sourceLabel: cleanNoorUiText(entry.sourceLabel),
      language: entry.language,
      title: cleanNoorUiText(entry.title),
      body: entry.body,
      reference: rangeText
    },
    relatedAyat,
    relatedHadith,
    notes: [
      'Talab an-Noor tafseer context.',
      `Tafseer quote preview: ${cleanNoorUiText(teachingQuote)}`,
      ...getMissingRelationshipNotes()
    ]
  };
}

export function buildIshraqNoteText({
  reference,
  quranPassage,
  tafseerQuote
}: {
  reference: string;
  quranPassage: string;
  tafseerQuote: string;
}) {
  return [
    'Ishraq note',
    '',
    `Reference: ${cleanNoorUiText(reference)}`,
    '',
    'Quran passage:',
    quranPassage,
    '',
    'Tafseer quote:',
    cleanNoorUiText(tafseerQuote),
    '',
    'Source relationship status:',
    '- Related ayat: not supplied unless verified by NOOR.',
    '- Related hadith: not supplied unless verified by NOOR.'
  ].join('\n');
}
