'use client';

import type { SurahIndexEntry } from '@noor/content';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type QuickReference = {
  label: string;
  href: string;
  helper: string;
};

const QUICK_REFERENCES: QuickReference[] = [
  { label: 'Al-Fatihah', href: '/learn/quran/1', helper: 'Begin with the opening Surah.' },
  { label: '32:15', href: '/learn/quran/32#ayah-15', helper: 'Jump directly to As-Sajdah 32:15.' },
  { label: '55:71', href: '/learn/quran/55#ayah-71', helper: 'Jump directly to Ar-Rahman 55:71.' }
];

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function QuranSurahNavigatorPanel({ surahs }: { surahs: SurahIndexEntry[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number>(surahs[0]?.number ?? 1);
  const selectedSurahInfo = surahs.find((surah) => surah.number === selectedSurah) ?? surahs[0];
  const [selectedAyah, setSelectedAyah] = useState(1);

  const filteredSurahs = useMemo(() => {
    const search = normalizeSearch(query);
    if (!search) return surahs;

    return surahs.filter((surah) => {
      const haystack = [
        String(surah.number),
        surah.slug,
        surah.nameArabic,
        surah.nameEnglish,
        surah.nameTransliteration,
        surah.revelation
      ].join(' ').toLowerCase();

      return haystack.includes(search);
    });
  }, [query, surahs]);

  const ayahCount = selectedSurahInfo?.ayahCount ?? 1;
  const ayahOptions = Array.from({ length: ayahCount }, (_, index) => index + 1);

  function changeSelectedSurah(nextSurah: number) {
    const next = surahs.find((surah) => surah.number === nextSurah);
    setSelectedSurah(nextSurah);
    setSelectedAyah((current) => Math.min(current, next?.ayahCount ?? 1));
  }

  function goToSelectedReference() {
    const safeAyah = Math.min(Math.max(Number(selectedAyah) || 1, 1), ayahCount);
    router.push(`/learn/quran/${selectedSurah}#ayah-${safeAyah}`);
  }

  return (
    <section className="noor-quran-index-shell" aria-label="Quran navigation">
      <div className="noor-quran-index-hero">
        <div>
          <span className="noor-kicker">Quran reader</span>
          <h1>Choose a Surah or jump to an ayah.</h1>
          <p>
            This page is for navigation only. Select a Surah, choose an ayah, then open the clean reader.
          </p>
        </div>
        <a className="noor-button primary" href="/learn/quran/1">Open Al-Fatihah</a>
      </div>

      <div className="noor-quran-index-grid">
        <div className="noor-quran-jump-card">
          <div>
            <span className="noor-badge emerald">Direct jump</span>
            <h2>Surah and Ayah</h2>
            <p>Use this when you already know the reference. It stays simple, like a reader control.</p>
          </div>

          <div className="noor-quran-jump-fields">
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

          {selectedSurahInfo ? (
            <div className="noor-quran-selected-preview">
              <strong>{selectedSurahInfo.nameTransliteration}</strong>
              <span>{selectedSurahInfo.nameEnglish} · {selectedSurahInfo.ayahCount} ayat · {selectedSurahInfo.revelation}</span>
              <span className="noor-quran-selected-arabic">{selectedSurahInfo.nameArabic}</span>
            </div>
          ) : null}

          <button className="noor-button primary" type="button" onClick={goToSelectedReference}>
            Open {selectedSurah}:{selectedAyah}
          </button>
        </div>

        <div className="noor-quran-quick-card">
          <span className="noor-badge gold">Quick references</span>
          <h2>Open common test points</h2>
          <div className="noor-quran-quick-list">
            {QUICK_REFERENCES.map((item) => (
              <a href={item.href} key={item.href}>
                <strong>{item.label}</strong>
                <span>{item.helper}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="noor-quran-surah-browser" aria-label="Browse Surahs">
        <div className="noor-quran-browser-head">
          <div>
            <span className="noor-badge emerald">Surah list</span>
            <h2>Browse without going back and forth</h2>
            <p>Search, scan the list, then open the reader. The reader also has a floating Surah/Ayah button.</p>
          </div>
          <label className="noor-quran-search-field">
            <span>Search Surah</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Fatihah, Rahman, 55, makki..."
            />
          </label>
        </div>

        <div className="noor-quran-surah-list" aria-live="polite">
          {filteredSurahs.map((surah) => (
            <a className="noor-quran-surah-row" href={`/learn/quran/${surah.number}`} key={surah.number}>
              <span className="noor-quran-surah-no">{String(surah.number).padStart(3, '0')}</span>
              <span className="noor-quran-surah-copy">
                <strong>{surah.nameTransliteration}</strong>
                <small>{surah.nameEnglish} · {surah.revelation} · {surah.ayahCount} ayat</small>
              </span>
              <span className="noor-quran-surah-arabic">{surah.nameArabic}</span>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
