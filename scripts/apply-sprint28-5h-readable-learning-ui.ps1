$ErrorActionPreference = "Stop"

Write-Host "Applying Sprint 28.5H — Readable Learning UI + Quran Navigation..." -ForegroundColor Cyan

$root = Get-Location
$patchRoot = Join-Path $root "_patch_sprint28_5h"

if (!(Test-Path $patchRoot)) {
  throw "Patch folder not found: $patchRoot"
}

$files = @(
  "apps/web/app/learn/page.tsx",
  "apps/web/app/learn/quran/page.tsx",
  "apps/web/app/learn/quran/[surah]/page.tsx",
  "apps/web/components/QuranReadingExperience.tsx",
  "apps/web/components/FloatingQuranNavigator.tsx"
)

foreach ($file in $files) {
  $src = Join-Path $patchRoot $file
  $dest = Join-Path $root $file
  if (!(Test-Path $src)) {
    throw "Missing patch file: $src"
  }
  New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
  Copy-Item $src $dest -Force
  Write-Host "Updated $file" -ForegroundColor Green
}

$cssPath = Join-Path $root "apps/web/app/globals.css"
$cssPatch = Join-Path $root "patches/sprint28-5h-readable-learning-ui.css"
$marker = "/* Sprint 28.5H: Readable Learning UI + Quran Navigation */"

if (!(Test-Path $cssPatch)) {
  throw "Missing CSS patch: $cssPatch"
}

$existing = ""
if (Test-Path $cssPath) {
  $existing = Get-Content $cssPath -Raw
}

if ($existing -notmatch [regex]::Escape($marker)) {
  Add-Content -Path $cssPath -Value "`n"
  Add-Content -Path $cssPath -Value (Get-Content $cssPatch -Raw)
  Write-Host "Appended Sprint 28.5H CSS to apps/web/app/globals.css" -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5H CSS marker already exists; skipping CSS append." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Now run:" -ForegroundColor Cyan
Write-Host "pnpm typecheck"
Write-Host "pnpm build"
Write-Host "pnpm dev"
