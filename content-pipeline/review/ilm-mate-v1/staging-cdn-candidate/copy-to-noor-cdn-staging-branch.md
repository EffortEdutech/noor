# NOOR Sprint 27.7 — Copy Candidate to noor-cdn Staging Branch

This file contains the exact staging-only workflow.

## 1. From NOOR repo, regenerate the candidate

```powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"

pnpm ilm:staging-cdn-candidate
pnpm check:ilm-staging-cdn-candidate
```

## 2. Go to local noor-cdn repo

```powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"

git fetch origin
git checkout -B staging-ilm-mate-v1
```

## 3. Copy candidate content

Copy everything inside:

```text
content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn
```

into your local noor-cdn repo root so the repo contains:

```text
noor-cdn/
```

PowerShell copy command:

```powershell
robocopy "C:\\Users\\user\\Documents\\00 Combo3\\Noor\\content-pipeline\\publish\\ilm-mate-v1-staging-cdn\\noor-cdn" "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn\\noor-cdn" /E
```

Robocopy may return exit code 1 when files copied successfully. That is normal.

## 4. Commit to staging branch only

```powershell
git status
git add .
git commit -m "Add ilm-mate v1 staging CDN candidate"
git push -u origin staging-ilm-mate-v1
```

## Forbidden in Sprint 27.7

```text
git checkout main
git push origin main
```

Do not update `noor-cdn/main` yet.
