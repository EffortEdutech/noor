# Sprint 27.14 — Promote noor-cdn staging to production main

## Status

Manual production promotion sprint.

## Purpose

Sprint 27.14 promotes the reviewed and browser-tested staging CDN branch into the production CDN branch.

Source branch:

noor-cdn/staging-ilm-mate-v1

Target branch:

noor-cdn/main

## Required preconditions

- Sprint 27.10 staging CDN acceptance passed.
- Sprint 27.11 staging browser QA passed.
- Sprint 27.13 production approval gate is approved for promotion.
- noor-cdn/staging-ilm-mate-v1 is clean and pushed.
- noor-cdn/main is not ahead of staging.

## NOOR commands

Generate and check the promotion plan:

pnpm production:cdn-promotion-plan
pnpm check:production-cdn-promotion-plan

After noor-cdn/main has been pushed, record the execution:

pnpm production:cdn-record-promotion
pnpm check:production-cdn-promoted
pnpm check:sprint27-14

## noor-cdn promotion commands

Run these in the noor-cdn repository only after the plan check passes:

git checkout staging-ilm-mate-v1
git pull origin staging-ilm-mate-v1
git status
git checkout main
git pull origin main
git merge staging-ilm-mate-v1
git status
git push origin main

## Safety rule

Do not force push noor-cdn/main. Use normal merge/fast-forward only.

## Production base after promotion

https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn

## Outcome

Sprint 27.14 is complete only after NOOR records the promotion execution report and check:sprint27-14 passes.
