$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..")
$PatchRoot = Join-Path $RepoRoot "_patch_sprint28_5n"
$CssPatch = Join-Path $RepoRoot "patches\sprint28-5n-quran-clean-reader-navigation.css"
$Globals = Join-Path $RepoRoot "apps\web\app\globals.css"
$Sentinel = "Sprint 28.5N — Quran Clean Reader Navigation"

if (-not (Test-Path $PatchRoot)) {
  throw "Patch folder not found: $PatchRoot"
}

Copy-Item -Path (Join-Path $PatchRoot "apps") -Destination $RepoRoot -Recurse -Force

if (-not (Test-Path $Globals)) {
  throw "globals.css not found: $Globals"
}

$existing = Get-Content -Path $Globals -Raw
$patchCss = Get-Content -Path $CssPatch -Raw

if ($existing -notlike "*$Sentinel*") {
  Add-Content -Path $Globals -Value "`n`n$patchCss"
  Write-Host "Appended Sprint 28.5N Quran CSS to globals.css"
} else {
  Write-Host "Sprint 28.5N Quran CSS already exists in globals.css; skipped append"
}

Write-Host "Sprint 28.5N Quran clean reader navigation patch applied."
