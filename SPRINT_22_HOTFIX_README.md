# Sprint 22 Hotfix — Release Notes + Quran Gate Checker

Fixes two validation-only issues found after Sprint 22:

1. `RELEASE_NOTES.md` now includes the exact phrase `Tafseer importer adapter v1` required by `check:release`.
2. `check-noor-quran-source-gate.mjs` now treats the Sprint 21 Quran source gate as a persistent gate and allows later NOOR app versions such as `0.22.0`, while keeping the gate artifact itself at `0.21.0`.
