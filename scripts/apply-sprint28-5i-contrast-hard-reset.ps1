$ErrorActionPreference = "Stop"

Write-Host "Applying Sprint 28.5I — Contrast hard reset + serious learning rows..." -ForegroundColor Cyan

$root = Get-Location

$files = @(
  "packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx",
  "apps/web/app/explore/page.tsx"
)

foreach ($file in $files) {
  $src = Join-Path $root $file
  if (!(Test-Path $src)) {
    throw "Patch file not found after extraction: $src"
  }
  Write-Host "Ready: $file" -ForegroundColor DarkGray
}

# This patch is extracted directly into the repo, so files above are already overwritten.
# Ensure @noor/ui exports the component.
$index = Join-Path $root "packages/noor-ui/src/index.ts"
$exportLine = "export * from './components/KnowledgeSettingsPanel';"
if (!(Test-Path $index)) {
  throw "Missing UI index file: $index"
}
if (-not (Select-String -Path $index -SimpleMatch $exportLine -Quiet)) {
  Add-Content -Path $index -Value "`n$exportLine"
  Write-Host "Added KnowledgeSettingsPanel export" -ForegroundColor Green
} else {
  Write-Host "KnowledgeSettingsPanel export already exists" -ForegroundColor Yellow
}

# Append final contrast reset last so it wins over previous sprint CSS.
$cssPath = Join-Path $root "apps/web/app/globals.css"
$cssPatch = Join-Path $root "patches/sprint28-5i-contrast-hard-reset.css"
$marker = "/* Sprint 28.5I: Final contrast hard reset + serious learning rows */"

if (!(Test-Path $cssPath)) {
  throw "Missing globals.css: $cssPath"
}
if (!(Test-Path $cssPatch)) {
  throw "Missing CSS patch: $cssPatch"
}

$existing = Get-Content $cssPath -Raw
if ($existing -notmatch [regex]::Escape($marker)) {
  Add-Content -Path $cssPath -Value "`n"
  Add-Content -Path $cssPath -Value (Get-Content $cssPatch -Raw)
  Write-Host "Appended final contrast reset CSS to apps/web/app/globals.css" -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5I CSS marker already exists; skipping CSS append" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. Now run:" -ForegroundColor Cyan
Write-Host "pnpm typecheck"
Write-Host "pnpm build"
Write-Host "pnpm dev"
