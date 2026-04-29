# NOOR Sprint 10 — Local Backup Restore and Reset Center

## Objective

Sprint 10 protects the user's local NOOR data before the app grows further. Since NOOR currently stores bookmarks, reading progress, journey progress, reader preferences and recent searches in browser localStorage, users need a simple way to export, import and reset that data.

## Added

1. Local backup schema: `noor.local-backup.v1`
2. Backup export as JSON file
3. Backup copy to clipboard
4. Backup import from JSON file
5. Local data reset button
6. Local data summary stats in Settings
7. App version updated to `NOOR v0.10.0`

## Included local data keys

- `noor.bookmarks.v1`
- `noor.readingProgress.v1`
- `noor.readingHistory.v1`
- `noor.journeyProgress.v1`
- `noor.readerPreferences.v1`
- `noor.search.recent.v1`

## User flow

1. Open `/settings`
2. Review local data summary
3. Click **Download backup**
4. Clear local data or use another browser
5. Click **Import backup**
6. Confirm bookmarks, progress, journey state and preferences return

## Notes

This is a browser-local backup only. It does not upload user data anywhere. Future authenticated sync can reuse the same schema as an import/export contract.
