# Sprint 28.5E — Clean Learning UI Reset
# Run from repo root: C:\Users\user\Documents\00 Combo3\Noor

$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$globalsPath = Join-Path $root "apps\web\app\globals.css"
$cssPatchPath = Join-Path $root "patches\sprint28-5e-clean-learning-ui.css"
$uiIndexPath = Join-Path $root "packages\noor-ui\src\index.ts"
$exportLine = "export * from './components/KnowledgeSettingsPanel';"

if (!(Test-Path $globalsPath)) {
  throw "Cannot find apps\web\app\globals.css. Run this script from the NOOR repo root."
}

if (!(Test-Path $cssPatchPath)) {
  throw "Cannot find patches\sprint28-5e-clean-learning-ui.css. Make sure the ZIP was extracted first."
}

if (!(Test-Path $uiIndexPath)) {
  throw "Cannot find packages\noor-ui\src\index.ts."
}

$indexContent = Get-Content $uiIndexPath -Raw
if ($indexContent -notlike "*$exportLine*") {
  Add-Content -Path $uiIndexPath -Value "`n$exportLine"
  Write-Host "Added KnowledgeSettingsPanel export to noor-ui index." -ForegroundColor Green
} else {
  Write-Host "KnowledgeSettingsPanel export already exists." -ForegroundColor Yellow
}

$globalsContent = Get-Content $globalsPath -Raw
if ($globalsContent -notlike "*Sprint 28.5E: Clean Learning UI Reset*") {
  Add-Content -Path $globalsPath -Value "`n"
  Add-Content -Path $globalsPath -Value (Get-Content $cssPatchPath -Raw)
  Write-Host "Appended Sprint 28.5E clean UI CSS override." -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5E CSS already appended." -ForegroundColor Yellow
}

Write-Host "Sprint 28.5E clean learning UI reset applied." -ForegroundColor Cyan
Write-Host "Next: pnpm typecheck; pnpm build; pnpm dev" -ForegroundColor Cyan
