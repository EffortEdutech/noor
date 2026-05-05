# scripts/apply-sprint28-6a2-mojibake-quran-landing-fix.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$QuranLandingPath = Join-Path $Root "apps\web\components\QuranLastVisitLanding.tsx"

if (!(Test-Path $QuranLandingPath)) {
  throw "Cannot find apps\web\components\QuranLastVisitLanding.tsx. Run this from the noor repo root."
}

$Text = Get-Content $QuranLandingPath -Raw

$Text = $Text.Replace(" Â· Ayah ", " - Ayah ")
$Text = $Text.Replace(" Â· {activeSurah?.ayahCount ?? 7} ayat", " - {activeSurah?.ayahCount ?? 7} ayat")
$Text = $Text.Replace("Ø§Ù„ÙØ§ØªØ­Ø©", "Al-Fatihah")

Set-Content -Path $QuranLandingPath -Value $Text -Encoding UTF8

Write-Host "Fixed QuranLastVisitLanding mojibake separators and fallback text."
Write-Host "Next:"
Write-Host "  node .\scripts\scan-mojibake.mjs"
Write-Host "  node .\scripts\validate-sprint28-6a2-mojibake-quran-landing-fix.mjs"
