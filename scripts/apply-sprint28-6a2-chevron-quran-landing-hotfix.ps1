# scripts/apply-sprint28-6a2-chevron-quran-landing-hotfix.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$GlobalsPath = Join-Path $Root "apps\web\app\globals.css"
$PatchPath = Join-Path $Root "patches\sprint28-6a2-chevron-quran-landing-hotfix.css"
$QuranLandingPath = Join-Path $Root "apps\web\components\QuranLastVisitLanding.tsx"

if (!(Test-Path $GlobalsPath)) { throw "Cannot find apps\web\app\globals.css. Run this from the noor repo root." }
if (!(Test-Path $PatchPath)) { throw "Cannot find patches\sprint28-6a2-chevron-quran-landing-hotfix.css." }
if (!(Test-Path $QuranLandingPath)) { throw "Cannot find apps\web\components\QuranLastVisitLanding.tsx." }

$Start = "/* NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON AND QURAN LANDING START"
$End = "/* NOOR SPRINT 28.6A.2 HOTFIX - CHEVRON AND QURAN LANDING END */"
$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Updated = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Set-Content -Path $GlobalsPath -Value $Updated -Encoding UTF8
  Write-Host "Replaced existing chevron/Quran landing CSS hotfix block."
} else {
  Add-Content -Path $GlobalsPath -Value "`r`n`r`n$Patch" -Encoding UTF8
  Write-Host "Appended chevron/Quran landing CSS hotfix block."
}

$Quran = Get-Content $QuranLandingPath -Raw

$OldBlock = @'
      <section className="noor-quran-v2-note" aria-label="How Quran navigation works">
        <h2>No Surah list blocking the page.</h2>
        <p>
          Tap the floating Quran navigator to choose Surah and Ayah. The dropdown appears only when needed, then returns you to reading.
        </p>
      </section>
'@

$NewBlock = @'
      <section className="noor-quran-v2-note" aria-label="Quran reading continuation">
        <h2>{hasLastVisit ? 'Last viewed Quran page' : 'Start from Al-Fatihah'}</h2>
        <p>
          {hasLastVisit
            ? `Continue from ${activeSurah?.nameTransliteration ?? 'Quran'} ayah ${activeAyah}.`
            : 'No previous Quran reading was found. NOOR will open Surah 1, Al-Fatihah, ayah 1.'}
        </p>
        <a className="noor-button secondary" href={readerHref}>
          {hasLastVisit ? 'Open last viewed reading' : 'Open Al-Fatihah'}
        </a>
      </section>
'@

if ($Quran.Contains($OldBlock)) {
  $Quran = $Quran.Replace($OldBlock, $NewBlock)
  Set-Content -Path $QuranLandingPath -Value $Quran -Encoding UTF8
  Write-Host "Updated Quran landing note to last-viewed/fallback continuation."
} elseif ($Quran.Contains("No Surah list blocking the page.")) {
  throw "Quran landing still contains the old text, but the expected block shape has changed. Please paste apps\web\components\QuranLastVisitLanding.tsx."
} else {
  Write-Host "Quran landing old note text is already removed."
}
