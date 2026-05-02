# Sprint 27.14 — Production CDN Promotion Plan

Status: ready_for_manual_noor_cdn_main_promotion

Production promotion allowed: true

Source: noor-cdn/staging-ilm-mate-v1
Target: noor-cdn/main

## Gates

- PASS — Sprint 27.13 approval gate allows Sprint 27.14 promotion
- PASS — Sprint 27.10 staging CDN acceptance passed
- PASS — Sprint 27.11 staging browser QA passed
- PASS — Local noor-cdn working tree is clean
- PASS — noor-cdn staging has reviewed content not yet on main
- PASS — noor-cdn/main is not ahead of staging

## Required failures

- None

## Promotion commands

Run these only after this plan passes.

1. Open noor-cdn repo.
2. Merge staging-ilm-mate-v1 into main.
3. Push noor-cdn/main.
4. Return to NOOR and record promotion.

Production base after promotion: https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
