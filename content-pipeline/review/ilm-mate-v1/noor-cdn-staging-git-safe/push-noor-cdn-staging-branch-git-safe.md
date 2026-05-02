# Push noor-cdn Staging Branch — Git-safe Route

Use this guide after running:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
pnpm cdn:staging-git-safe
pnpm check:cdn-staging-git-safe
```

## Important safety rule

Push only:

```text
noor-cdn/staging-ilm-mate-v1
```

Do not push:

```text
noor-cdn/main
```

## 1. Reset local noor-cdn staging branch if the previous attempt copied big files

```powershell
cd "C:\Users\user\Documents\00 Combo3\noor-cdn"

git status
git reset
git restore .
git clean -fd noor-cdn

git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1 main

git status
git branch --show-current
```

Expected branch:

```text
staging-ilm-mate-v1
```

## 2. Copy the git-safe pack

```powershell
$NOOR = "C:\Users\user\Documents\00 Combo3\Noor"
$CDN = "C:\Users\user\Documents\00 Combo3\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\publish\ilm-mate-v1-staging-cdn-git-safe\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

Test-Path $SRC
git branch --show-current

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }
```

## 3. Confirm no file is above 100 MB

```powershell
Get-ChildItem "noor-cdn" -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 20 FullName, @{Name="MB";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

Stop if any single file is near or above 100 MB.

## 4. Commit and push staging branch only

```powershell
git status
git add .
git commit -m "Publish ilm-mate v1 git-safe staging CDN candidate"
git push -u origin staging-ilm-mate-v1
git status
```

Do not push `main`.
