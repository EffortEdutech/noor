# scripts/apply-sprint28-6a2-gui-theme-unification.ps1
# Applies Sprint 28.6A.2 GUI Theme Unification to apps/web/app/globals.css.
# Idempotent: replaces the old Sprint 28.6A.2 block if it already exists.

$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$GlobalsPath = Join-Path $Root "apps\web\app\globals.css"
$PatchPath = Join-Path $Root "patches\sprint28-6a2-gui-theme-unification.css"

if (!(Test-Path $GlobalsPath)) {
  throw "Cannot find apps\web\app\globals.css. Run this from the noor repo root."
}

if (!(Test-Path $PatchPath)) {
  throw "Cannot find patches\sprint28-6a2-gui-theme-unification.css. Extract the patch pack into the noor repo root first."
}

$Start = "/* NOOR SPRINT 28.6A.2 GUI THEME UNIFICATION START"
$End = "/* NOOR SPRINT 28.6A.2 GUI THEME UNIFICATION END */"

$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Updated = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Set-Content -Path $GlobalsPath -Value $Updated -Encoding UTF8
  Write-Host "✓ Replaced existing Sprint 28.6A.2 theme block in apps\web\app\globals.css"
} else {
  Add-Content -Path $GlobalsPath -Value "`n`n$Patch" -Encoding UTF8
  Write-Host "✓ Appended Sprint 28.6A.2 theme block to apps\web\app\globals.css"
}

Write-Host ""
Write-Host "Next:"
Write-Host "  node .\scripts\validate-sprint28-6a2-gui-theme-unification.mjs"
