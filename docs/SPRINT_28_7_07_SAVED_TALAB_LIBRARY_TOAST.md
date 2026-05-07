# Sprint 28.7-07 — Saved Talab Library and Save Toast

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-07

---

## 1. Problem

The `Save in browser` action saved data to browser local storage, but the user could not see a clear confirmation and could not find the saved item in Library.

This made the action feel like it did nothing.

---

## 2. Product Decision

`Save in browser` means:

```text
Save this Talab result into browser local storage so it appears in the NOOR Library on this device.
```

It is not the same as:

```text
Download .txt
```

That is why both buttons exist.

---

## 3. Patch Scope

This patch adds:

```text
- visible toast popup after Save in browser
- View in Library link inside the toast
- Saved Talab notes panel in /library
- copy saved Talab note
- download saved Talab note
- reopen saved source
- remove saved note
- clear saved Talab library
```

---

## 4. Storage

Saved Talab results use:

```text
noor.talab.results.v1
```

Update event:

```text
noor:talab-results-updated
```

New shared store:

```text
apps/web/lib/talab-store.ts
```

The store is capped at 50 items.

---

## 5. Library Placement

The Library page now includes:

```text
Reading progress
Saved Talab notes
Journey progress
Reflection notes
Bookmarks
```

This makes AI-assisted outputs part of the user learning archive.

---

## 6. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser:

```text
/learn/quran/112
/learn/tafseer?surah=112
/library
```

Check:

- Generate a Talab result.
- Click `Save in browser`.
- A toast popup appears.
- Toast includes `View in Library`.
- Open `/library`.
- Saved Talab notes panel shows the saved result.
- Copy works from Library.
- Download .txt works from Library.
- Reopen source works.
- Remove works.
- Clear saved Talab notes works.
