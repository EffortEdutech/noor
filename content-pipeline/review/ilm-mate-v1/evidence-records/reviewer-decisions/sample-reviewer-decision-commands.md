# Sprint 27.3 sample reviewer decision commands

Run the full trial:

```powershell
pnpm ilm:reviewer-decision-trial
pnpm check:ilm-reviewer-decision-trial
pnpm ilm:evidence:list -- --status=accepted-for-staging
```

Manual equivalent commands for future reviewer decisions:

```powershell
pnpm ilm:evidence:update -- --id=ilm-mate-v1-quran-source_identity-evidence-record --status=accepted-for-staging --reviewer-decision=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Reviewer Role" --reviewer-organisation="Organisation" --notes="Accepted for staging only; not production approval."
```
```powershell
pnpm ilm:evidence:update -- --id=ilm-mate-v1-tafseer-source_identity-evidence-record --status=accepted-for-staging --reviewer-decision=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Reviewer Role" --reviewer-organisation="Organisation" --notes="Accepted for staging only; not production approval."
```
```powershell
pnpm ilm:evidence:update -- --id=ilm-mate-v1-hadith-source_identity-evidence-record --status=accepted-for-staging --reviewer-decision=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Reviewer Role" --reviewer-organisation="Organisation" --notes="Accepted for staging only; not production approval."
```