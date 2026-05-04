'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export type QuranNavigatorSurah = {
  number: number;
  nameTransliteration: string;
  nameEnglish: string;
  nameArabic: string;
  ayahCount: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function clampAyah(value: number, max: number) {
  return Math.min(Math.max(Number(value) || 1, 1), Math.max(max, 1));
}

export function FloatingQuranNavigator({
  surahs,
  currentSurah,
  currentAyah,
  totalAyahs,
  onJumpAyah,
  buttonLabel = 'Navigate Quran'
}: {
  surahs: QuranNavigatorSurah[];
  currentSurah: number;
  currentAyah: number;
  totalAyahs: number;
  onJumpAyah?: (ayah: number) => void;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(currentSurah || 1);
  const [selectedAyah, setSelectedAyah] = useState(currentAyah || 1);

  useEffect(() => {
    setSelectedSurah(currentSurah || 1);
    setSelectedAyah(currentAyah || 1);
  }, [currentSurah, currentAyah]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const selectedSurahInfo = useMemo(() => {
    return surahs.find((surah) => surah.number === selectedSurah) ?? surahs[0];
  }, [selectedSurah, surahs]);

  const currentSurahInfo = useMemo(() => {
    return surahs.find((surah) => surah.number === currentSurah) ?? selectedSurahInfo;
  }, [currentSurah, selectedSurahInfo, surahs]);

  const filteredSurahs = useMemo(() => {
    const term = normalize(search);
    if (!term) return surahs;

    return surahs.filter((surah) => {
      const haystack = [
        surah.number,
        surah.nameTransliteration,
        surah.nameEnglish,
        surah.nameArabic
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [search, surahs]);

  const selectedAyahCount = selectedSurahInfo?.ayahCount ?? totalAyahs ?? 1;
  const ayahOptions = Array.from({ length: selectedAyahCount }, (_, index) => index + 1);

  function changeSelectedSurah(nextSurah: number) {
    const nextSurahInfo = surahs.find((surah) => surah.number === nextSurah);
    setSelectedSurah(nextSurah);
    setSelectedAyah((value) => clampAyah(value, nextSurahInfo?.ayahCount ?? 1));
  }

  function goToSelectedReference() {
    const safeAyah = clampAyah(selectedAyah, selectedAyahCount);
    setSelectedAyah(safeAyah);
    setOpen(false);

    if (selectedSurah === currentSurah && onJumpAyah) {
      onJumpAyah(safeAyah);
      return;
    }

    router.push(`/learn/quran/${selectedSurah}#ayah-${safeAyah}`);
  }

  function goToSurah(nextSurah: number) {
    if (nextSurah < 1 || nextSurah > 114) return;
    setOpen(false);
    router.push(`/learn/quran/${nextSurah}`);
  }

  return (
    <div className="noor-quran-v2-float" data-open={open ? 'true' : 'false'}>
      {open ? (
        <div className="noor-quran-v2-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      ) : null}

      {open ? (
        <section className="noor-quran-v2-panel" role="dialog" aria-modal="true" aria-label="Surah and Ayah navigation">
          <header className="noor-quran-v2-panel-head">
            <div>
              <span className="noor-quran-v2-eyebrow">Quran navigation</span>
              <h2>Jump to Surah and Ayah</h2>
              <p>Choose the reference, then return directly to reading.</p>
            </div>
            <button type="button" className="noor-quran-v2-close" onClick={() => setOpen(false)} aria-label="Close navigator">
              ×
            </button>
          </header>

          <div className="noor-quran-v2-fields">
            <label>
              <span>Surah</span>
              <select value={selectedSurah} onChange={(event) => changeSelectedSurah(Number(event.target.value))}>
                {surahs.map((surah) => (
                  <option value={surah.number} key={surah.number}>
                    {surah.number}. {surah.nameTransliteration} — {surah.nameEnglish}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Ayah</span>
              <select value={selectedAyah} onChange={(event) => setSelectedAyah(Number(event.target.value))}>
                {ayahOptions.map((ayah) => (
                  <option value={ayah} key={ayah}>{ayah}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="noor-quran-v2-search">
            <span>Find Surah</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or number" />
          </label>

          <div className="noor-quran-v2-list" aria-label="Surah list">
            {filteredSurahs.slice(0, 18).map((surah) => (
              <button
                type="button"
                key={surah.number}
                data-active={surah.number === selectedSurah}
                onClick={() => changeSelectedSurah(surah.number)}
              >
                <span className="noor-quran-v2-surah-no">{String(surah.number).padStart(3, '0')}</span>
                <span className="noor-quran-v2-surah-name">
                  <strong>{surah.nameTransliteration}</strong>
                  <small>{surah.nameEnglish} · {surah.ayahCount} ayat</small>
                </span>
                <span className="noor-quran-v2-surah-arabic">{surah.nameArabic}</span>
              </button>
            ))}
          </div>

          <footer className="noor-quran-v2-panel-actions">
            <button type="button" className="noor-quran-v2-primary" onClick={goToSelectedReference}>
              Go to {selectedSurah}:{selectedAyah}
            </button>
            <div className="noor-quran-v2-secondary-actions">
              <button type="button" onClick={() => goToSurah(currentSurah - 1)} disabled={currentSurah <= 1}>Previous</button>
              <button type="button" onClick={() => goToSurah(currentSurah + 1)} disabled={currentSurah >= 114}>Next</button>
            </div>
          </footer>
        </section>
      ) : null}

      <button
        type="button"
        className="noor-quran-v2-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open Quran Surah and Ayah navigator"
      >
        <span>{buttonLabel}</span>
        <strong>{currentSurahInfo?.nameTransliteration ?? 'Quran'} · {currentSurah || 1}:{currentAyah || 1}</strong>
      </button>
    </div>
  );
}
