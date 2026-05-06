# scripts/apply-sprint28-6a2-quran-mode-topbar-final-fix.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$GlobalsPath = Join-Path $Root "apps\web\app\globals.css"
$PatchPath = Join-Path $Root "patches\sprint28-6a2-quran-mode-topbar-final-fix.css"
$AppShellPath = Join-Path $Root "packages\noor-ui\src\components\AppShell.tsx"
$QuranReaderPath = Join-Path $Root "apps\web\components\QuranReadingExperience.tsx"
$QuranReaderPatchPath = Join-Path $Root "patches\QuranReadingExperience.topbar-final.tsx"

if (!(Test-Path $GlobalsPath)) { throw "Cannot find apps\web\app\globals.css. Run this from the noor repo root." }
if (!(Test-Path $PatchPath)) { throw "Cannot find patches\sprint28-6a2-quran-mode-topbar-final-fix.css." }
if (!(Test-Path $AppShellPath)) { throw "Cannot find packages\noor-ui\src\components\AppShell.tsx." }
if (!(Test-Path $QuranReaderPath)) { throw "Cannot find apps\web\components\QuranReadingExperience.tsx." }
if (!(Test-Path $QuranReaderPatchPath)) { throw "Cannot find patches\QuranReadingExperience.topbar-final.tsx." }

$Start = "/* NOOR SPRINT 28.6A.2 FIX - QURAN MODE IN APP TOPBAR START"
$End = "/* NOOR SPRINT 28.6A.2 FIX - QURAN MODE IN APP TOPBAR END */"

$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Globals = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Write-Host "Replaced Quran mode topbar final CSS block."
} else {
  $Globals = $Globals + "`r`n`r`n" + $Patch
  Write-Host "Appended Quran mode topbar final CSS block."
}

$OldStart = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MODE TOPBAR SWITCHER START"
$OldEnd = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MODE TOPBAR SWITCHER END */"
$OldPattern = [regex]::Escape($OldStart) + ".*?" + [regex]::Escape($OldEnd)
if ($Globals -match $OldPattern) {
  $Globals = [regex]::Replace($Globals, $OldPattern, "", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Write-Host "Removed earlier conflicting Quran mode topbar CSS block."
}
Set-Content -Path $GlobalsPath -Value $Globals -Encoding UTF8

$AppShell = Get-Content $AppShellPath -Raw
if ($AppShell -notmatch 'id="noor-quran-reader-mode-slot"') {
  $AppShell = $AppShell.Replace(
'          <nav className="noor-topbar-actions" aria-label="Utility navigation">
            <a className="noor-badge" href="/settings">Settings</a>
          </nav>',
'          <nav className="noor-topbar-actions" aria-label="Utility navigation">
            <div id="noor-quran-reader-mode-slot" className="noor-topbar-mode-slot" />
            <a className="noor-badge" href="/settings">Settings</a>
          </nav>'
  )
}
if ($AppShell -notmatch 'id="noor-quran-reader-mode-slot"') {
  throw "Failed to add AppShell mode slot. Please paste packages\noor-ui\src\components\AppShell.tsx."
}
Set-Content -Path $AppShellPath -Value $AppShell -Encoding UTF8
Write-Host "Confirmed AppShell topbar slot before Settings."

Copy-Item -Path $QuranReaderPatchPath -Destination $QuranReaderPath -Force
Write-Host "Replaced QuranReadingExperience with topbar-only mode switcher."

Write-Host ""
Write-Host "Next:"
Write-Host "  node .\scripts\validate-sprint28-6a2-quran-mode-topbar-final-fix.mjs"
