$ErrorActionPreference = "Stop"

$RepoRoot = (Get-Location).Path
$CssTarget = Join-Path $RepoRoot "apps\web\app\globals.css"
$CssPatch = Join-Path $RepoRoot "patches\sprint28-5a-uiux.css"
$Marker = "Sprint 28.5A: Knowledge Navigation UI/UX foundation"

if (!(Test-Path $CssTarget)) {
  throw "Cannot find apps\web\app\globals.css. Please run this from the NOOR repo root."
}

if (!(Test-Path $CssPatch)) {
  throw "Cannot find patches\sprint28-5a-uiux.css. Please extract the patch ZIP into the repo root first."
}

$CurrentCss = Get-Content $CssTarget -Raw

if ($CurrentCss -notmatch [regex]::Escape($Marker)) {
  Add-Content -Path $CssTarget -Value "`r`n"
  Add-Content -Path $CssTarget -Value (Get-Content $CssPatch -Raw)
  Write-Host "Appended Sprint 28.5A UI/UX CSS to apps\web\app\globals.css" -ForegroundColor Green
} else {
  Write-Host "Sprint 28.5A UI/UX CSS already exists in globals.css. Skipped append." -ForegroundColor Yellow
}

Write-Host "Patch files are installed. Suggested checks:" -ForegroundColor Cyan
Write-Host "pnpm typecheck"
Write-Host "pnpm build"
