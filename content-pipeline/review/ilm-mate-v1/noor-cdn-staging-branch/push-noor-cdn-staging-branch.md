# Push noor-cdn Staging Branch

This guide is for Sprint 27.8 only.

Allowed branch:

```text
staging-ilm-mate-v1
```

Blocked branch:

```text
main
```

## 1. Confirm NOOR candidate exists

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Test-Path "content-pipeline\publish\ilm-mate-v1-staging-cdn\noor-cdn"
pnpm check:ilm-staging-cdn-candidate
pnpm check:cdn-staging-handoff
```

## 2. Prepare local noor-cdn repo

If the local repo already exists:

```powershell
cd "C:\Users\user\Documents\00 Combo3\noor-cdn"
git checkout main
git pull origin main
git checkout -B staging-ilm-mate-v1
```

If it does not exist:

```powershell
cd "C:\Users\user\Documents\00 Combo3"
git clone https://github.com/EffortEdutech/noor-cdn.git
cd "C:\Users\user\Documents\00 Combo3\noor-cdn"
git checkout -B staging-ilm-mate-v1
```

## 3. Copy candidate into noor-cdn staging branch

From the `noor-cdn` repo folder:

```powershell
$NOOR = "C:\Users\user\Documents\00 Combo3\Noor"
$CDN = "C:\Users\user\Documents\00 Combo3\noor-cdn"
$SRC = Join-Path $NOOR "content-pipeline\publish\ilm-mate-v1-staging-cdn\noor-cdn"
$DST = Join-Path $CDN "noor-cdn"

Test-Path $SRC
git branch --show-current

robocopy $SRC $DST /MIR
if ($LASTEXITCODE -le 7) { $global:LASTEXITCODE = 0 }

git status
```

Before pushing, confirm current branch says:

```text
staging-ilm-mate-v1
```

## 4. Safety size check

```powershell
Get-ChildItem "noor-cdn" -Recurse -File |
  Sort-Object Length -Descending |
  Select-Object -First 20 FullName, @{Name="MB";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

If any single file is close to or above 100 MB, stop and review before pushing.

## 5. Commit and push staging branch only

```powershell
git add .
git commit -m "Publish ilm-mate v1 staging CDN candidate"
git push -u origin staging-ilm-mate-v1
```

Do not push `main`.

## 6. Verify branch

After push:

```powershell
git status
git branch --show-current
```

Expected:

```text
staging-ilm-mate-v1
nothing to commit, working tree clean
```
