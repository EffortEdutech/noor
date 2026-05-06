# scripts/apply-sprint28-6a2-quran-mode-topbar-switcher.ps1
$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$GlobalsPath = Join-Path $Root "apps\web\app\globals.css"
$PatchPath = Join-Path $Root "patches\sprint28-6a2-quran-mode-topbar-switcher.css"
$AppShellPath = Join-Path $Root "packages\noor-ui\src\components\AppShell.tsx"
$QuranReaderPath = Join-Path $Root "apps\web\components\QuranReadingExperience.tsx"

if (!(Test-Path $GlobalsPath)) { throw "Cannot find apps\web\app\globals.css. Run from repo root." }
if (!(Test-Path $PatchPath)) { throw "Cannot find patch CSS." }
if (!(Test-Path $AppShellPath)) { throw "Cannot find AppShell.tsx." }
if (!(Test-Path $QuranReaderPath)) { throw "Cannot find QuranReadingExperience.tsx." }

$Start = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MODE TOPBAR SWITCHER START"
$End = "/* NOOR SPRINT 28.6A.2 HOTFIX - QURAN MODE TOPBAR SWITCHER END */"
$Globals = Get-Content $GlobalsPath -Raw
$Patch = Get-Content $PatchPath -Raw
$Pattern = [regex]::Escape($Start) + ".*?" + [regex]::Escape($End)

if ($Globals -match $Pattern) {
  $Updated = [regex]::Replace($Globals, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Patch }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  Set-Content -Path $GlobalsPath -Value $Updated -Encoding UTF8
} else {
  Add-Content -Path $GlobalsPath -Value "`r`n`r`n$Patch" -Encoding UTF8
}

$AppShell = Get-Content $AppShellPath -Raw
if ($AppShell -notmatch 'noor-quran-reader-mode-slot') {
  $AppShell = $AppShell.Replace(
'          <nav className="noor-topbar-actions" aria-label="Utility navigation">
            <a className="noor-badge" href="/settings">Settings</a>
          </nav>',
'          <nav className="noor-topbar-actions" aria-label="Utility navigation">
            <div id="noor-quran-reader-mode-slot" className="noor-topbar-mode-slot" />
            <a className="noor-badge" href="/settings">Settings</a>
          </nav>'
  )
  Set-Content -Path $AppShellPath -Value $AppShell -Encoding UTF8
}

$Reader = Get-Content $QuranReaderPath -Raw

if ($Reader -notmatch "import \{ createPortal \} from 'react-dom';") {
  $Reader = $Reader.Replace(
"import { useEffect, useMemo, useState } from 'react';",
"import { useEffect, useMemo, useState } from 'react';`r`nimport { createPortal } from 'react-dom';"
  )
}

if ($Reader -notmatch 'function QuranReaderModeSwitcher') {
$Component = @'

function QuranReaderModeSwitcher({
  mode,
  onChange,
  variant = 'inline'
}: {
  mode: ReaderMode;
  onChange: (mode: ReaderMode) => void;
  variant?: 'inline' | 'topbar';
}) {
  return (
    <div className={`noor-quran-mode-switcher noor-quran-mode-switcher--${variant}`} role="tablist" aria-label="Quran reading mode">
      {READER_MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          data-active={mode === item.id}
          aria-selected={mode === item.id}
          aria-pressed={mode === item.id}
          title={item.helper}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

'@
  $Reader = $Reader.Replace("function getTafseerForAyah", $Component + "function getTafseerForAyah")
}

if ($Reader -notmatch 'const \[modeSlot, setModeSlot\]') {
  $Reader = $Reader.Replace(
"  const [mode, setMode] = useState<ReaderMode>('read');`r`n  const [currentAyah, setCurrentAyah] = useState(1);",
"  const [mode, setMode] = useState<ReaderMode>('read');`r`n  const [currentAyah, setCurrentAyah] = useState(1);`r`n  const [modeSlot, setModeSlot] = useState<HTMLElement | null>(null);"
  )
}

if ($Reader -notmatch "document.getElementById\('noor-quran-reader-mode-slot'\)") {
  $Reader = $Reader.Replace(
"  const tafseerCount = useMemo(() => {",
"  useEffect(() => {`r`n    setModeSlot(document.getElementById('noor-quran-reader-mode-slot'));`r`n    return () => setModeSlot(null);`r`n  }, []);`r`n`r`n  const tafseerCount = useMemo(() => {"
  )
}

$OldModes = @'
        <div className="noor-quran-v2-modes" role="tablist" aria-label="Reading mode">
          {READER_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              data-active={mode === item.id}
              aria-pressed={mode === item.id}
              onClick={() => updateMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
'@
$NewModes = @'
        <QuranReaderModeSwitcher mode={mode} onChange={updateMode} variant="inline" />
'@
if ($Reader.Contains($OldModes)) {
  $Reader = $Reader.Replace($OldModes, $NewModes)
}

if ($Reader -notmatch 'topbarModeControls') {
  $Reader = $Reader.Replace(
"  return (`r`n    <main className=`"noor-quran-v2-reader`" id=`"reader-top`">",
"  const topbarModeControls = modeSlot`r`n    ? createPortal(<QuranReaderModeSwitcher mode={mode} onChange={updateMode} variant=`"topbar`" />, modeSlot)`r`n    : null;`r`n`r`n  return (`r`n    <>`r`n      {topbarModeControls}`r`n      <main className=`"noor-quran-v2-reader`" id=`"reader-top`">"
  )
  $Reader = $Reader.Replace(
"      </main>`r`n  );",
"      </main>`r`n    </>`r`n  );"
  )
}

Set-Content -Path $QuranReaderPath -Value $Reader -Encoding UTF8

Write-Host "Applied Quran mode topbar switcher."
Write-Host "Next: node .\scripts\validate-sprint28-6a2-quran-mode-topbar-switcher.mjs"
