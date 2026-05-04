$ErrorActionPreference = "Stop"

Write-Host "Applying Sprint 28.5K — Production Learning Theme Reset..." -ForegroundColor Cyan

$root = Get-Location
$patchRoot = Join-Path $root "_patch_sprint28_5k"

if (!(Test-Path $patchRoot)) {
  throw "Patch folder not found: $patchRoot"
}

$files = @(
  "apps/web/app/globals.css",
  "apps/web/app/today/page.tsx",
  "apps/web/app/explore/page.tsx",
  "apps/web/app/explore/[topic]/page.tsx",
  "apps/web/app/learn/page.tsx",
  "apps/web/app/learn/quran/page.tsx",
  "apps/web/app/learn/quran/[surah]/page.tsx",
  "apps/web/components/QuranReadingExperience.tsx",
  "apps/web/components/FloatingQuranNavigator.tsx",
  "packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx",
  "packages/noor-ui/src/index.ts"
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

Write-Host ""
Write-Host "Sprint 28.5K applied." -ForegroundColor Cyan
Write-Host "Run these commands next:"
Write-Host "pnpm typecheck"
Write-Host "pnpm build"
Write-Host "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
Write-Host "Remove-Item -Recurse -Force .\apps\web\.next -ErrorAction SilentlyContinue"
Write-Host "pnpm dev"
