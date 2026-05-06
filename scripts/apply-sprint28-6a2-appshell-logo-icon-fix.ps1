# scripts/apply-sprint28-6a2-appshell-logo-icon-fix.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$GlobalsPath = Join-Path $Root "apps\web\app\globals.css"
$PatchPath = Join-Path $Root "patches\sprint28-6a2-appshell-logo-icon-fix.css"
$AppShellPath = Join-Path $Root "packages\noor-ui\src\components\AppShell.tsx"

if (!(Test-Path $GlobalsPath)) { throw "Cannot find apps\web\app\globals.css. Run this from the noor repo root." }
if (!(Test-Path $PatchPath)) { throw "Cannot find patches\sprint28-6a2-appshell-logo-icon-fix.css." }
if (!(Test-Path $AppShellPath)) { throw "Cannot find packages\noor-ui\src\components\AppShell.tsx." }

# Verify the public icon exists.
$IconPath = Join-Path $Root "public\icon-192.png"
if (!(Test-Path $IconPath)) {
  throw "Cannot find public\icon-192.png. The AppShell logo expects this icon."
}

# 1) Add/replace CSS block.
$Start = "/* NOOR SPRINT 28.6A.2 HOTFIX - APPSHELL LOGO ICON FIX START"
$End = "/* NOOR SPRINT 28.6A.2 HOTFIX - APPSHELL LOGO ICON FIX END */"
$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Globals = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Write-Host "Replaced AppShell logo icon CSS block."
} else {
  $Globals = $Globals + "`r`n`r`n" + $Patch
  Write-Host "Appended AppShell logo icon CSS block."
}

Set-Content -Path $GlobalsPath -Value $Globals -Encoding UTF8

# 2) Replace text glyph/logo mark with real icon image.
$AppShell = Get-Content $AppShellPath -Raw

$NewLogo = @'
<div className="noor-mark" aria-hidden="true">
              <img className="noor-mark-img" src="/icon-192.png" alt="" width="42" height="42" />
            </div>
'@

# Replace any simple noor-mark div, whether it contains ✦, âœ¦, or anything else.
$LogoPattern = '<div\s+className="noor-mark"\s+aria-hidden="true">[\s\S]*?</div>'
if ($AppShell -match $LogoPattern) {
  $AppShell = [regex]::Replace($AppShell, $LogoPattern, $NewLogo, 1)
  Set-Content -Path $AppShellPath -Value $AppShell -Encoding UTF8
  Write-Host "Replaced AppShell text logo mark with /icon-192.png image."
} else {
  throw "Could not find <div className=`"noor-mark`" aria-hidden=`"true`">...</div> in AppShell. Please paste packages\noor-ui\src\components\AppShell.tsx."
}

Write-Host ""
Write-Host "Next:"
Write-Host "  node .\scripts\validate-sprint28-6a2-appshell-logo-icon-fix.mjs"
