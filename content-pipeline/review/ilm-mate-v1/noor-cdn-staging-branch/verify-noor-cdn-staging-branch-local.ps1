# NOOR Sprint 27.8 local verification helper
$ErrorActionPreference = "Stop"

$CDN = "C:\Users\user\Documents\00 Combo3\noor-cdn"
Set-Location $CDN

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne "staging-ilm-mate-v1") {
  throw "Unsafe branch: $currentBranch. Expected staging-ilm-mate-v1."
}

$required = @(
  "noor-cdn\manifest\noor-content-manifest.json",
  "noor-cdn\manifest\noor-content-health.json",
  "noor-cdn\metadata\surah-index.json",
  "noor-cdn\quran\surahs\001.json",
  "noor-cdn\hadith\collections.json",
  "noor-cdn\search\search-index.json"
)

foreach ($file in $required) {
  if (!(Test-Path $file)) {
    throw "Missing required staging CDN file: $file"
  }
}

$files = Get-ChildItem "noor-cdn" -Recurse -File
$jsonFiles = $files | Where-Object { $_.Extension -eq ".json" }
$totalMB = [math]::Round((($files | Measure-Object -Property Length -Sum).Sum / 1MB), 2)

Write-Host "NOOR CDN staging branch local verification passed."
Write-Host "Branch: $currentBranch"
Write-Host "Files: $($files.Count)"
Write-Host "JSON files: $($jsonFiles.Count)"
Write-Host "Total size MB: $totalMB"
Write-Host "Allowed push: origin staging-ilm-mate-v1"
Write-Host "Blocked push: origin main"
