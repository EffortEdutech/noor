$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$component = Join-Path $root "packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx"
$index = Join-Path $root "packages/noor-ui/src/index.ts"
$cssPatch = Join-Path $root "patches/sprint28-5f-serious-settings-accordion-ui.css"
$globals = Join-Path $root "apps/web/app/globals.css"
$exportLine = "export * from './components/KnowledgeSettingsPanel';"
$cssStart = "/* Sprint 28.5F: Serious settings-style learning UI reset */"

if (!(Test-Path $component)) {
  throw "Missing component file: $component"
}

if (!(Test-Path $index)) {
  throw "Missing UI index file: $index"
}

if (!(Select-String -Path $index -SimpleMatch $exportLine -Quiet)) {
  Add-Content -Path $index -Value "`n$exportLine"
  Write-Host "Added KnowledgeSettingsPanel export to packages/noor-ui/src/index.ts"
} else {
  Write-Host "KnowledgeSettingsPanel export already exists"
}

if (!(Test-Path $cssPatch)) {
  throw "Missing CSS patch file: $cssPatch"
}

if (!(Test-Path $globals)) {
  throw "Missing globals.css: $globals"
}

$globalsRaw = Get-Content -Raw -Path $globals
if ($globalsRaw.Contains($cssStart)) {
  Write-Host "Sprint 28.5F CSS already applied"
} else {
  Add-Content -Path $globals -Value "`n"
  Add-Content -Path $globals -Value (Get-Content -Raw -Path $cssPatch)
  Write-Host "Appended Sprint 28.5F serious settings accordion CSS to apps/web/app/globals.css"
}

Write-Host "Sprint 28.5F UI hotfix applied. Run: pnpm typecheck; pnpm build"
