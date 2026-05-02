# NOOR Sprint 27.6 — Future noor-cdn staging branch step

Sprint 27.6 allows the **future staging branch candidate workflow** only after this report and the staging CDN pack both pass.

## Current gate

- Can push noor-cdn staging branch: true
- Can push noor-cdn main: false
- Production approved: false

## Next safe sprint

Sprint 27.7 should generate a staging CDN candidate package and guide copying it into a **staging branch** of the separate `noor-cdn` repository.

Do not push `noor-cdn/main` yet. Production promotion remains blocked until production approval records are explicitly unlocked in a later sprint.
