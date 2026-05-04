$ErrorActionPreference = "Stop"

Write-Host "Applying Sprint 28.5G Myexpensio-style accordion patch..." -ForegroundColor Cyan

$root = Get-Location
$index = Join-Path $root "packages\noor-ui\src\index.ts"
$cssSource = Join-Path $root "patches\sprint28-5g-myexpensio-style-accordion.css"
$globals = Join-Path $root "apps\web\app\globals.css"
$exportLine = "export * from './components/KnowledgeSettingsPanel';"

if (-not (Test-Path $index)) {
  throw "Missing packages\noor-ui\src\index.ts"
}

if (-not (Select-String -Path $index -SimpleMatch $exportLine -Quiet)) {
  Add-Content -Path $index -Value "`n$exportLine"
  Write-Host "Added KnowledgeSettingsPanel export." -ForegroundColor Green
} else {
  Write-Host "KnowledgeSettingsPanel export already exists." -ForegroundColor Yellow
}

if (-not (Test-Path $cssSource)) {
  throw "Missing patches\sprint28-5g-myexpensio-style-accordion.css"
}

$marker = "/* Sprint 28.5G: Myexpensio-style simple learning page reset */"
if (-not (Select-String -Path $globals -SimpleMatch $marker -Quiet)) {
  Add-Content -Path $globals -Value "`n"
  Get-Content -Path $cssSource | Add-Content -Path $globals
  Write-Host "Appended Sprint 28.5G CSS reset to apps\web\app\globals.css" -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5G CSS reset already exists in globals.css" -ForegroundColor Yellow
}

Write-Host "Done. Run: pnpm typecheck ; pnpm build" -ForegroundColor Cyan
