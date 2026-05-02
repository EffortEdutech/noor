import fs from 'node:fs';
import path from 'node:path';
import { NoorCard } from '@noor/ui';

type BrowserQaTask = {
  id: string;
  category: string;
  severity: string;
  status: 'pending' | 'pass' | 'fail' | 'accepted_with_note';
  title: string;
  url: string;
  notes?: string;
};

type BrowserQaReport = {
  sprint?: string;
  generatedAt?: string;
  status?: string;
  productionPromotion?: string;
  summary?: {
    totalTasks?: number;
    requiredTasks?: number;
    requiredPassed?: number;
    requiredPending?: number;
    requiredFailed?: number;
    recommendedPending?: number;
    recommendedFailed?: number;
  };
  tasks?: BrowserQaTask[];
};

function repoRoot() {
  const cwd = process.cwd();
  if (cwd.endsWith(path.join('apps', 'web'))) return path.resolve(cwd, '..', '..');
  return cwd;
}

function readReport(): BrowserQaReport | null {
  const file = path.join(repoRoot(), 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-browser-qa', 'staging-browser-qa-report.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as BrowserQaReport;
  } catch {
    return null;
  }
}

function badgeClass(status?: string) {
  if (status === 'accepted_for_staging_browser_qa') return 'noor-badge green';
  if (status === 'blocked') return 'noor-badge red';
  return 'noor-badge gold';
}

export function NoorStagingBrowserQaCard() {
  const report = readReport();

  if (!report) {
    return (
      <NoorCard>
        <span className="noor-badge gold">Sprint 27.11</span>
        <h2>Staging browser QA</h2>
        <p className="noor-subtitle">No browser QA checklist found yet.</p>
        <pre>pnpm qa:staging-browser</pre>
      </NoorCard>
    );
  }

  const summary = report.summary ?? {};
  const pendingRequired = summary.requiredPending ?? 0;
  const failedRequired = summary.requiredFailed ?? 0;
  const passedRequired = summary.requiredPassed ?? 0;
  const requiredTasks = summary.requiredTasks ?? 0;

  return (
    <NoorCard>
      <span className={badgeClass(report.status)}>Sprint 27.11</span>
      <h2>Staging browser QA</h2>
      <p className="noor-subtitle">
        Status: <strong>{report.status ?? 'unknown'}</strong>. Production CDN is still <strong>{report.productionPromotion ?? 'blocked'}</strong>.
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">Generated: {report.generatedAt ?? 'unknown'}</p>
      <p className="noor-subtitle">
        Required checks: {passedRequired}/{requiredTasks} passed · pending {pendingRequired} · failed {failedRequired}
      </p>
      <p className="noor-subtitle">
        Recommended pending: {summary.recommendedPending ?? 0} · recommended failed: {summary.recommendedFailed ?? 0}
      </p>
      <pre>pnpm check:qa-staging-browser</pre>
    </NoorCard>
  );
}
