# Sprint 28.5C — In-Page Knowledge Navigation & Dopamine UX
# Run from repo root:
# powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5c-in-page-navigation.ps1

$ErrorActionPreference = "Stop"

$repoRoot = (Get-Location).Path
$globalsPath = Join-Path $repoRoot "apps\web\app\globals.css"
$cssPatchPath = Join-Path $repoRoot "patches\sprint28-5c-in-page-navigation.css"
$marker = "/* Sprint 28.5C: In-page Knowledge Navigation & Dopamine UX */"

if (!(Test-Path $globalsPath)) {
  throw "Cannot find apps\web\app\globals.css. Please run this script from the NOOR repo root."
}

if (!(Test-Path $cssPatchPath)) {
  throw "Cannot find patches\sprint28-5c-in-page-navigation.css. Make sure the patch zip was extracted first."
}

$globalsContent = Get-Content $globalsPath -Raw
if ($globalsContent -notlike "*$marker*") {
  Add-Content -Path $globalsPath -Value "`r`n"
  Add-Content -Path $globalsPath -Value (Get-Content $cssPatchPath -Raw)
  Write-Host "Sprint 28.5C CSS appended to apps\web\app\globals.css" -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5C CSS already exists in apps\web\app\globals.css; skipping append." -ForegroundColor Yellow
}

$tsBuildInfo = Join-Path $repoRoot "apps\web\tsconfig.tsbuildinfo"
if (Test-Path $tsBuildInfo) {
  Remove-Item $tsBuildInfo -Force
  Write-Host "Removed apps\web\tsconfig.tsbuildinfo to avoid stale type cache." -ForegroundColor Green
}

Write-Host ""
Write-Host "Sprint 28.5C patch files are in place." -ForegroundColor Cyan
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "pnpm typecheck"
Write-Host "pnpm build"
Write-Host "pnpm dev"
