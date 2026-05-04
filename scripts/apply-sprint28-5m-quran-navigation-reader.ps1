# Sprint 28.5M — Quran navigation and reading surface reset
# Run from repo root: C:\Users\user\Documents\00 Combo3\Noor

$ErrorActionPreference = 'Stop'

$root = Get-Location
$patchRoot = Join-Path $root '_patch_sprint28_5m'
$cssPatch = Join-Path $root 'patches\sprint28-5m-quran-navigation-reader.css'
$globalCss = Join-Path $root 'apps\web\app\globals.css'

if (-not (Test-Path $patchRoot)) {
  throw "Patch folder not found: $patchRoot. Please Expand-Archive the ZIP into the repo root first."
}

$files = @(
  'apps/web/app/learn/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'apps/web/components/QuranSurahNavigatorPanel.tsx',
  'apps/web/components/FloatingQuranNavigator.tsx',
  'apps/web/components/QuranReadingExperience.tsx'
)

foreach ($file in $files) {
  $source = Join-Path $patchRoot $file
  $destination = Join-Path $root $file

  if (-not (Test-Path $source)) {
    throw "Missing patch file: $source"
  }

  $destinationDir = Split-Path $destination -Parent
  if (-not (Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }

  Copy-Item -Path $source -Destination $destination -Force
  Write-Host "Updated $file"
}

if (-not (Test-Path $cssPatch)) {
  throw "Missing CSS patch: $cssPatch"
}

$marker = 'Sprint 28.5M — Quran navigation and reading surface reset'
$globalContent = if (Test-Path $globalCss) { Get-Content -Path $globalCss -Raw } else { '' }

if ($globalContent -notmatch [regex]::Escape($marker)) {
  Add-Content -Path $globalCss -Value "`n"
  Add-Content -Path $globalCss -Value (Get-Content -Path $cssPatch -Raw)
  Write-Host "Appended Quran navigation CSS to apps/web/app/globals.css"
} else {
  Write-Host "Quran navigation CSS already present in apps/web/app/globals.css"
}

Write-Host "Sprint 28.5M Quran navigation reset applied."
Write-Host "Next: pnpm typecheck; pnpm build; then restart pnpm dev."
