$ErrorActionPreference = "Stop"

$root = "C:\Users\user\Documents\00 Combo3\Noor"

$quranFile = Join-Path $root "apps\web\components\QuranReadingExperience.tsx"
$tafseerFile = Join-Path $root "apps\web\app\learn\tafseer\page.tsx"
$tafseerCss = Join-Path $root "apps\web\app\learn\tafseer\TafseerPage.module.css"

if (-not (Test-Path $quranFile)) { throw "Cannot find $quranFile" }
if (-not (Test-Path $tafseerFile)) { throw "Cannot find $tafseerFile" }
if (-not (Test-Path $tafseerCss)) { throw "Cannot find $tafseerCss" }

$quran = Get-Content -Path $quranFile -Raw
$quran = $quran.Replace(
  "import { getDisplayArabicForAyah, getSurahBismillahHeader } from '../lib/quran-bismillah';",
  "import { getDisplayArabicForAyah } from '../lib/quran-bismillah';"
)
$quran = $quran.Replace(
"  const bismillahHeader = getSurahBismillahHeader(content, content.ayahs[0]);

",
""
)
$quran = $quran.Replace(
"        {bismillahHeader ? (
          <div className=""noor-quran-v2-bismillah"" lang=""ar"" dir=""rtl"">
            {bismillahHeader}
          </div>
        ) : null}

",
""
)
Set-Content -Path $quranFile -Value $quran -Encoding utf8

$tafseer = Get-Content -Path $tafseerFile -Raw
$tafseer = $tafseer.Replace(
  "import { getDisplayArabicForAyah, getSurahBismillahHeader } from '../../../lib/quran-bismillah';",
  "import { getDisplayArabicForAyah } from '../../../lib/quran-bismillah';"
)
$tafseer = $tafseer.Replace(
"          const bismillahHeader = selectedSurahContent
            ? getSurahBismillahHeader(selectedSurahContent, selectedSurahContent.ayahs[0])
            : null;
          const shouldShowBismillahHeader = Boolean(bismillahHeader && previewAyahs.some((ayah) => ayah.ayah === 1));

",
""
)
$tafseer = $tafseer.Replace(
"                  {shouldShowBismillahHeader ? (
                    <p className={styles.bismillahLine} lang=""ar"" dir=""rtl"">
                      {bismillahHeader}
                    </p>
                  ) : null}

",
""
)
Set-Content -Path $tafseerFile -Value $tafseer -Encoding utf8

$css = Get-Content -Path $tafseerCss -Raw
$css = [regex]::Replace(
  $css,
  "\r?\n\.bismillahLine\s*\{[\s\S]*?\}\r?\n(?=\s*\.arabicLine)",
  "`r`n"
)
Set-Content -Path $tafseerCss -Value $css -Encoding utf8

Write-Host "Bismillah display hotfix applied."
Write-Host "Surah metadata Bismillah is no longer rendered inside ayah or Tafseer passage surfaces."
