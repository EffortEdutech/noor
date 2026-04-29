# Local Testing — Sprint 8

## Commands

```powershell
pnpm check:pack
pnpm check:content
pnpm typecheck
pnpm build
```

## Manual test

Run:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm that the Settings page shows:

- NOOR v0.8.0
- PWA status
- Content integrity card
- Surah content coverage
- Ayah records count
- Tafseer entry count
- Hadith item count
- Dataset notes

Open:

```text
http://localhost:3200/learn/quran
```

Confirm these surahs open:

```text
/learn/quran/1
/learn/quran/112
/learn/quran/113
/learn/quran/114
```

Open:

```text
http://localhost:3200/explore
```

Search:

```text
falaq
nas
refuge
whisper
protection
envy
```

Expected result:

- Al-Falaq and An-Nas ayat appear in search.
- Tafseer demo summaries for protection/refuge appear.
- Build and typecheck stay green.
