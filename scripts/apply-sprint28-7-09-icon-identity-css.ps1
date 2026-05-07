$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$globalsPath = Join-Path $root "apps\web\app\globals.css"
$patchPath = Join-Path $root "patches\sprint28-7-09-icon-identity.css"
$iconPath = Join-Path $root "apps\web\public\icons\09-spread-mark.png"

if (-not (Test-Path -LiteralPath $globalsPath)) {
  throw "Cannot find apps\web\app\globals.css. Run this from the NOOR repo root."
}

if (-not (Test-Path -LiteralPath $patchPath)) {
  throw "Cannot find patches\sprint28-7-09-icon-identity.css."
}

if (-not (Test-Path -LiteralPath $iconPath)) {
  throw "Cannot find apps\web\public\icons\09-spread-mark.png. Copy the icon into apps\web\public\icons first."
}

$startMarker = "/* NOOR SPRINT 28.7-09 - ICON IDENTITY AND FLOATING BUTTONS START"
$endMarker = "/* NOOR SPRINT 28.7-09 - ICON IDENTITY AND FLOATING BUTTONS END */"

$globals = Get-Content -LiteralPath $globalsPath -Raw
$patch = Get-Content -LiteralPath $patchPath -Raw

$pattern = [regex]::Escape($startMarker) + "[\s\S]*?" + [regex]::Escape($endMarker)

if ($globals -match $pattern) {
  $globals = [regex]::Replace($globals, $pattern, { param($match) $patch }, 1)
  Write-Host "Replaced existing Sprint 28.7-09 icon identity CSS block." -ForegroundColor Green
} else {
  $globals = $globals.TrimEnd() + "`r`n`r`n" + $patch.TrimEnd() + "`r`n"
  Write-Host "Appended Sprint 28.7-09 icon identity CSS block." -ForegroundColor Green
}

Set-Content -LiteralPath $globalsPath -Value $globals -Encoding UTF8

Write-Host ""
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  node .\scripts\validate-sprint28-7-09-icon-identity.mjs"
Write-Host "  pnpm --filter @noor/web build"
