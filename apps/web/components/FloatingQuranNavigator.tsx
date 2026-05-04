'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export type QuranNavigatorSurah = {
  number: number;
  nameTransliteration: string;
  nameEnglish: string;
  nameArabic: string;
  ayahCount: number;
};

export function FloatingQuranNavigator({
  surahs,
  currentSurah,
  currentAyah,
  totalAyahs,
  onJumpAyah
}: {
  surahs: QuranNavigatorSurah[];
  currentSurah: number;
  currentAyah: number;
  totalAyahs: number;
  onJumpAyah: (ayah: number) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(currentSurah);
  const [selectedAyah, setSelectedAyah] = useState(currentAyah || 1);

  const selectedSurahInfo = useMemo(() => {
    return surahs.find((surah) => surah.number === selectedSurah) ?? surahs.find((surah) => surah.number === currentSurah);
  }, [currentSurah, selectedSurah, surahs]);

  const selectedAyahCount = selectedSurahInfo?.ayahCount ?? totalAyahs;
  const ayahOptions = Array.from({ length: selectedAyahCount }, (_, index) => index + 1);

  function goToSelectedReference() {
    const normalizedAyah = Math.min(Math.max(Number(selectedAyah) || 1, 1), selectedAyahCount);

    if (selectedSurah === currentSurah) {
      onJumpAyah(normalizedAyah);
      setSelectedAyah(normalizedAyah);
      setOpen(false);
      return;
    }

    router.push(`/learn/quran/${selectedSurah}#ayah-${normalizedAyah}`);
  }

  function goToAdjacentSurah(direction: 'previous' | 'next') {
    const nextSurah = direction === 'previous' ? currentSurah - 1 : currentSurah + 1;
    if (nextSurah < 1 || nextSurah > 114) return;
    router.push(`/learn/quran/${nextSurah}`);
  }

  return (
    <div className="noor-floating-quran-nav">
      {open ? (
        <div className="noor-floating-quran-panel" role="dialog" aria-label="Quran navigator">
          <div className="noor-floating-quran-head">
            <div>
              <strong>Quran Navigator</strong>
              <span>Jump by Surah and Ayah</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Quran navigator">✕</button>
          </div>

          <label className="noor-floating-field">
            <span>Surah</span>
            <select
              value={selectedSurah}
              onChange={(event) => {
                const nextSurah = Number(event.target.value);
                const nextSurahInfo = surahs.find((surah) => surah.number === nextSurah);
                setSelectedSurah(nextSurah);
                setSelectedAyah(Math.min(selectedAyah, nextSurahInfo?.ayahCount ?? 1));
              }}
            >
              {surahs.map((surah) => (
                <option value={surah.number} key={surah.number}>
                  {String(surah.number).padStart(3, '0')} · {surah.nameTransliteration}
                </option>
              ))}
            </select>
          </label>

          <label className="noor-floating-field">
            <span>Ayah</span>
            <select value={selectedAyah} onChange={(event) => setSelectedAyah(Number(event.target.value))}>
              {ayahOptions.map((ayah) => (
                <option value={ayah} key={ayah}>{ayah}</option>
              ))}
            </select>
          </label>

          <button type="button" className="noor-button primary noor-floating-go" onClick={goToSelectedReference}>
            Go to {selectedSurah}:{selectedAyah}
          </button>

          <div className="noor-floating-quran-actions">
            <button type="button" onClick={() => goToAdjacentSurah('previous')} disabled={currentSurah <= 1}>
              Previous Surah
            </button>
            <button type="button" onClick={() => goToAdjacentSurah('next')} disabled={currentSurah >= 114}>
              Next Surah
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="noor-floating-quran-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open Quran navigator"
      >
        <span>☰</span>
        <strong>{currentSurah}:{currentAyah || 1}</strong>
      </button>
    </div>
  );
}
