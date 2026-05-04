# Local Testing — Sprint 28.5B Topic Page v1

## Install patch

From repo root:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5b-topic-page-v1-patch.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5b-topic-page-v1.ps1
```

## Clean dev cache if needed

If the browser shows a stale webpack/runtime error after patching:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\apps\web\.next -ErrorAction SilentlyContinue
pnpm dev
```

## Check build

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

## Open topic pages

```text
http://localhost:3200/explore/patience
http://localhost:3200/explore/mercy
http://localhost:3200/explore/rizq
http://localhost:3200/explore/intention
http://localhost:3200/explore/protection
http://localhost:3200/explore/prayer
http://localhost:3200/explore/repentance
```

## UI checklist

```text
[ ] Topic page shows Universal Knowledge Bar
[ ] Topic hero shows Arabic keyword, prompt, description and intention
[ ] Today’s response card is visible
[ ] Topic Connections panel is visible
[ ] Step path shows Read Quran → Understand Tafseer → Reflect with Hadith → Respond
[ ] Knowledge Stack separates Quran, Tafseer and Hadith
[ ] Each source section has a clear action button
[ ] Empty states are helpful when linked content is missing
[ ] Reflection tracker still saves progress
[ ] Related topics appear at the bottom
```
