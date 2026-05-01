# NOOR Sprint 26.9 — Evidence Intake Pack / Reviewer Submission Templates

## Purpose

Sprint 26.9 turns the blocked Sprint 26.8 readiness report into practical reviewer intake templates.
It prepares the forms needed to collect evidence for Quran, Tafseer and Hadith content migrated from ilm-mate.

## Non-goals

- Do not publish migrated ilm-mate content to `noor-cdn`.
- Do not mark production approval as true.
- Do not bypass the scholarly review or source licensing gate.
- Do not treat submitted templates as approval without a future validation sprint.

## Commands

```powershell
pnpm ilm:evidence-intake
pnpm check:ilm-evidence-intake
pnpm typecheck
pnpm build
```

## Output

```text
content-pipeline/review/ilm-mate-v1/evidence-intake/
├── evidence-intake-pack.json
├── evidence-intake-pack.md
├── reviewer-submission-forms.json
├── reviewer-submission-forms.csv
└── templates/
    ├── all-domains-evidence-checklist.md
    ├── quran-evidence-submission-template.md
    ├── tafseer-evidence-submission-template.md
    └── hadith-evidence-submission-template.md
```

## Evidence domains

Each domain has six required evidence items:

1. Source identity
2. License or written redistribution permission
3. Attribution wording
4. Checksum / integrity plan
5. Scholarly reviewer sign-off
6. Production promotion approval

With three domains, Sprint 26.9 generates 18 evidence intake forms.

## Gate status

The output must remain:

```text
status: blocked
productionApproved: false
canPromoteToProduction: false
```

Production CDN promotion remains blocked until a future explicit promotion sprint.
