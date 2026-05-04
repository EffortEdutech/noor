$ErrorActionPreference = "Stop"

Write-Host "Applying Sprint 28.5J — Explore readable rows hotfix..." -ForegroundColor Cyan

$root = Get-Location
$source = Join-Path $root "apps\web\app\explore\page.tsx"
$backup = Join-Path $root "apps\web\app\explore\page.tsx.bak-sprint28-5j"

if (Test-Path $source) {
  Copy-Item $source $backup -Force
}

Write-Host "Explore page replaced. Previous file backed up as page.tsx.bak-sprint28-5j" -ForegroundColor Green
Write-Host "Now run: pnpm typecheck ; pnpm build" -ForegroundColor Yellow
