$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

$include = @(
  "*.tsx",
  "*.ts",
  "*.css",
  "*.md",
  "*.txt"
)

$excludeDirs = @(
  "\.git\",
  "\node_modules\",
  "\.next\",
  "\dist\",
  "\build\",
  "\apps\web\public\noor-cdn\"
)

$replacements = @(
  @("Majlis Noor", "Talab an-Noor"),
  @("MAJLIS NOOR", "TALAB AN-NOOR"),
  @("Majlis", "Talab"),
  @("majlis", "talab"),

  @("Open Talab Noor", "Open Talab an-Noor"),
  @("Open Talab an-Noor for this ayah", "Open Talab an-Noor for this ayah"),

  @("Teaching prep", "Ishraq"),
  @("Teaching Prep", "Ishraq"),
  @("teaching prep", "Ishraq"),
  @("Teaching preparation", "Ishraq preparation"),
  @("teaching preparation", "Ishraq preparation"),

  @("Copy teaching note", "Copy Ishraq note"),
  @("Copy Teaching Note", "Copy Ishraq Note"),
  @("Copy teaching notes", "Copy Ishraq notes"),

  @("Teaching note", "Ishraq note"),
  @("Teaching Note", "Ishraq Note"),
  @("teaching note", "Ishraq note")
)

$files = Get-ChildItem -Path $root -Recurse -File -Include $include | Where-Object {
  $path = $_.FullName
  foreach ($dir in $excludeDirs) {
    if ($path -match [regex]::Escape($dir)) {
      return $false
    }
  }
  return $true
}

$changed = 0

foreach ($file in $files) {
  $original = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction SilentlyContinue
  if ($null -eq $original) {
    continue
  }

  $updated = $original

  foreach ($pair in $replacements) {
    $updated = $updated.Replace($pair[0], $pair[1])
  }

  if ($updated -ne $original) {
    Set-Content -LiteralPath $file.FullName -Value $updated -Encoding utf8
    Write-Host "Updated:" $file.FullName
    $changed++
  }
}

Write-Host ""
Write-Host "Talab an-Noor rename complete. Files changed:" $changed
