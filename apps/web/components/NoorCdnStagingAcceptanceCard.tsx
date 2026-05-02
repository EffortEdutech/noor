import fs from 'node:fs';
import path from 'node:path';
import { NoorCard } from '@noor/ui';

type AcceptanceCheck = {
  id: string;
  title: string;
  severity: string;
  status: 'pass' | 'fail';
};

type AcceptanceReport = {
  generatedAt?: string;
  acceptedForStaging?: boolean;
  productionPromotion?: string;
  selectedCdnRoot?: string | null;
  requiredFailures?: string[];
  recommendedFailures?: string[];
  quran?: { surahIndexCount?: number; surahFiles?: number; ayat?: number };
  tafseer?: { indexExists?: boolean; indexEntries?: number; tafseerFiles?: number; sampledEntryCount?: number };
  hadith?: { collections?: number; byBook?: number; byChapter?: number; duplicateCollectionIds?: unknown[] };
  search?: { exists?: boolean; entries?: number; sourceTypes?: string[] };
  checks?: AcceptanceCheck[];
};

function repoRoot() {
  const cwd = process.cwd();
  if (cwd.endsWith(path.join('apps', 'web'))) return path.resolve(cwd, '..', '..');
  return cwd;
}

function readReport(): AcceptanceReport | null {
  const file = path.join(repoRoot(), 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-acceptance', 'staging-cdn-acceptance-report.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as AcceptanceReport;
  } catch {
    return null;
  }
}

export function NoorCdnStagingAcceptanceCard() {
  const report = readReport();

  if (!report) {
    return (
      <NoorCard>
        <span className="noor-badge">Sprint 27.10</span>
        <h2>Staging CDN acceptance</h2>
        <p className="noor-subtitle">No acceptance report found yet.</p>
        <pre>pnpm cdn:staging-acceptance</pre>
      </NoorCard>
    );
  }

  const requiredFailures = report.requiredFailures?.length ?? 0;
  const statusLabel = report.acceptedForStaging ? 'Accepted for staging' : 'Blocked';

  return (
    <NoorCard>
      <span className={report.acceptedForStaging ? 'noor-badge green' : 'noor-badge red'}>Sprint 27.10</span>
      <h2>Staging CDN acceptance</h2>
      <p className="noor-subtitle">
        {statusLabel}. Production CDN is still <strong>{report.productionPromotion ?? 'blocked'}</strong>.
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">Generated: {report.generatedAt ?? 'unknown'}</p>
      <p className="noor-subtitle">CDN root: {report.selectedCdnRoot ?? 'not selected'}</p>
      <p className="noor-subtitle">
        Quran: {report.quran?.surahFiles ?? 0} surahs · {report.quran?.ayat ?? 0} ayat
      </p>
      <p className="noor-subtitle">
        Tafseer: {report.tafseer?.indexEntries ?? 0} indexed source(s) · {report.tafseer?.tafseerFiles ?? 0} file(s)
      </p>
      <p className="noor-subtitle">
        Hadith: {report.hadith?.collections ?? 0} collections · by book {report.hadith?.byBook ?? 0} · by chapter {report.hadith?.byChapter ?? 0}
      </p>
      <p className="noor-subtitle">Search: {report.search?.entries ?? 0} indexed entries</p>
      <p className="noor-subtitle">Required failures: {requiredFailures}</p>
      <pre>pnpm check:cdn-staging-acceptance</pre>
    </NoorCard>
  );
}
