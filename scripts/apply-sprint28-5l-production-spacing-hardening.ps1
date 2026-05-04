# Sprint 28.5L — Production spacing and readable section hardening
# Run from repo root: C:\Users\user\Documents\00 Combo3\Noor

$ErrorActionPreference = 'Stop'

$root = Get-Location
$patchRoot = Join-Path $root '_patch_sprint28_5l'

if (-not (Test-Path $patchRoot)) {
  throw "Patch folder not found: $patchRoot. Please Expand-Archive the ZIP into the repo root first."
}

$files = @(
  'apps/web/app/globals.css',
  'packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx'
)

foreach ($file in $files) {
  $source = Join-Path $patchRoot $file
  $destination = Join-Path $root $file

  if (-not (Test-Path $source)) {
    throw "Missing patch file: $source"
  }

  $destinationDir = Split-Path $destination -Parent
  if (-not (Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }

  Copy-Item -Path $source -Destination $destination -Force
  Write-Host "Updated $file"
}

Write-Host "Sprint 28.5L production spacing hardening applied."
Write-Host "Next: pnpm typecheck; pnpm build; then restart pnpm dev."
