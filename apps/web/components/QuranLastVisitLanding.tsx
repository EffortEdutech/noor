'use client';

import type { SurahIndexEntry } from '@noor/content';
import { useEffect, useMemo, useState } from 'react';
import { FloatingQuranNavigator } from './FloatingQuranNavigator';

export const QURAN_LAST_VISIT_KEY = 'noor.quran.lastVisit.v1';

type LastVisit = {
  surah: number;
  ayah: number;
  surahName?: string;
  surahEnglish?: string;
  updatedAt?: string;
};

function safeParseLastVisit(value: string | null): LastVisit | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<LastVisit>;
    if (!parsed || typeof parsed.surah !== 'number') return null;

    return {
      surah: parsed.surah,
      ayah: typeof parsed.ayah === 'number' ? parsed.ayah : 1,
      surahName: parsed.surahName,
      surahEnglish: parsed.surahEnglish,
      updatedAt: parsed.updatedAt
    };
  } catch {
    return null;
  }
}

export function QuranLastVisitLanding({ surahs }: { surahs: SurahIndexEntry[] }) {
  const firstSurah = surahs[0];
  const [lastVisit, setLastVisit] = useState<LastVisit | null>(null);

  useEffect(() => {
    try {
      setLastVisit(safeParseLastVisit(window.localStorage.getItem(QURAN_LAST_VISIT_KEY)));
    } catch {
      setLastVisit(null);
    }
  }, []);

  const activeSurah = useMemo(() => {
    return surahs.find((surah) => surah.number === lastVisit?.surah) ?? firstSurah;
  }, [firstSurah, lastVisit?.surah, surahs]);

  const activeAyah = Math.min(Math.max(lastVisit?.ayah ?? 1, 1), activeSurah?.ayahCount ?? 1);
  const readerHref = `/learn/quran/${activeSurah?.number ?? 1}#ayah-${activeAyah}`;
  const hasLastVisit = Boolean(lastVisit && activeSurah);

  return (
    <main className="noor-page noor-quran-v2-page">
      <section className="noor-quran-v2-landing" aria-label="Quran reader landing">
        <div className="noor-quran-v2-landing-copy">
          <span className="noor-quran-v2-eyebrow">Quran reader</span>
          <h1>{hasLastVisit ? 'Continue your last reading.' : 'Begin with Al-Fatihah.'}</h1>
          <p>
            The reader opens one Surah at a time. Surah and Ayah controls stay hidden until you tap the floating navigator.
          </p>
        </div>

        <a className="noor-quran-v2-continue" href={readerHref}>
          <span>{hasLastVisit ? 'Last visited' : 'Recommended start'}</span>
          <strong>{activeSurah?.nameTransliteration ?? 'Al-Fatihah'} · Ayah {activeAyah}</strong>
          <small>{activeSurah?.nameEnglish ?? 'The Opening'} · {activeSurah?.ayahCount ?? 7} ayat</small>
          <em>{activeSurah?.nameArabic ?? 'الفاتحة'}</em>
        </a>
      </section>

      <section className="noor-quran-v2-note" aria-label="How Quran navigation works">
        <h2>No Surah list blocking the page.</h2>
        <p>
          Tap the floating Quran navigator to choose Surah and Ayah. The dropdown appears only when needed, then returns you to reading.
        </p>
      </section>

      <FloatingQuranNavigator
        surahs={surahs}
        currentSurah={activeSurah?.number ?? 1}
        currentAyah={activeAyah}
        totalAyahs={activeSurah?.ayahCount ?? 7}
        buttonLabel="Choose Surah / Ayah"
      />
    </main>
  );
}
