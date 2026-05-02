# NOOR Sprint 27.8 helper
# This mirrors the staging candidate into the local noor-cdn repo on branch staging-ilm-mate-v1.
# It does not push main.

$ErrorActionPreference = "Stop"

$NOOR = "C:\Users\user\Documents\00 Combo3\Noor"
$CDN = "C:\Users\user\Documents\00 Combo3\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\publish\ilm-mate-v1-staging-cdn\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

if (!(Test-Path $SRC)) {
  throw "NOOR staging candidate folder not found: $SRC"
}

if (!(Test-Path $CDN)) {
  throw "Local noor-cdn repo not found: $CDN"
}

Set-Location $CDN
git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne "staging-ilm-mate-v1") {
  throw "Unsafe branch: $currentBranch. Expected staging-ilm-mate-v1."
}

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }

git status

Write-Host ""
Write-Host "Ready to review and then run:"
Write-Host "git add ."
Write-Host "git commit -m 'Publish ilm-mate v1 staging CDN candidate'"
Write-Host "git push -u origin staging-ilm-mate-v1"
