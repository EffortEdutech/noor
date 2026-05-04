# Local Testing — Sprint 28.5A Knowledge Navigation UI/UX

## Install patch

From repo root:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5a-knowledge-navigation-uiux-patch.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5a-uiux.ps1
```

## Run app

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/learn/quran/1
http://localhost:3200/learn/tafseer
http://localhost:3200/learn/hadith
```

## UI checklist

```text
[ ] /today shows Universal Knowledge Bar
[ ] /explore shows Universal Knowledge Bar before search panel
[ ] Entering 2:255 routes to /learn/quran/2#ayah-255
[ ] Entering patience routes to /explore?topic=patience
[ ] Ayah cards show Connections
[ ] Tafseer entries show Connections
[ ] Hadith cards show Connections
[ ] Connections are not plain boxes; they guide next source relationship
```

## Build checks

```powershell
pnpm typecheck
pnpm build
```

Optional existing sprint check:

```powershell
pnpm check:sprint28-5
```

## UX acceptance

```text
A user should be able to begin from:
- a feeling or need
- a topic
- a Quran reference
- a Hadith topic
- a Tafseer doorway

and always see where to continue next.
```
