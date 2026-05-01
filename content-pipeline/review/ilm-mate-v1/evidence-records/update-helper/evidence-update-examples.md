# Sprint 27.1 Update Examples

## List records

```powershell
pnpm ilm:evidence:list
pnpm ilm:evidence:list -- --domain=quran
```

## Mark submitted

```powershell
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=submitted --reviewer-name="Darya Malak" --reviewer-role="Founder" --evidence-reference="Source identity evidence received" --source-url-or-document="Local document / URL" --notes="Submitted for review"
```

## Mark under review

```powershell
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=under-review --reviewer-name="Reviewer Name" --reviewer-role="Content Reviewer" --notes="Review started"
```

## Accept for staging

```powershell
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Scholarly Reviewer" --evidence-reference="QUR-SRC-001" --date-reviewed=2026-05-02 --notes="Accepted for staging only"
```

## Request more information

```powershell
pnpm ilm:evidence:update -- --domain=hadith --evidence-key=license_or_permission --status=needs-more-information --reviewer-name="Reviewer Name" --rejection-reason="License wording unclear"
```

