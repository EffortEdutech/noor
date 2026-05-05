# scripts/apply-sprint28-6a2-quran-mobile-result-one-line-hotfix.ps1
$ErrorActionPreference = "Stop"

$GlobalsPath = Join-Path (Get-Location).Path "apps\web\app\globals.css"
$PatchPath = Join-Path (Get-Location).Path "patches\sprint28-6a2-quran-mobile-result-one-line-hotfix.css"

if (!(Test-Path $GlobalsPath)) { throw "Cannot find apps\web\app\globals.css. Run this from the noor repo root." }
if (!(Test-Path $PatchPath)) { throw "Cannot find patches\sprint28-6a2-quran-mobile-result-one-line-hotfix.css." }

$Start = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE RESULT ONE LINE START"
$End = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MOBILE RESULT ONE LINE END */"

$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Updated = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Set-Content -Path $GlobalsPath -Value $Updated -Encoding UTF8
  Write-Host "Replaced existing Quran mobile one-line result hotfix block."
} else {
  Add-Content -Path $GlobalsPath -Value "`r`n`r`n$Patch" -Encoding UTF8
  Write-Host "Appended Quran mobile one-line result hotfix block."
}
