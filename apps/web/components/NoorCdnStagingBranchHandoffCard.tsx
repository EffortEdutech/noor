import fs from "node:fs";
import path from "node:path";

const reportPath = path.join(
  process.cwd(),
  "content-pipeline",
  "review",
  "ilm-mate-v1",
  "noor-cdn-staging-branch",
  "noor-cdn-staging-branch-handoff.json"
);

type HandoffReport = {
  sprint: string;
  status: string;
  targetRepository: string;
  targetBranch: string;
  canPushNoorCdnStaging: boolean;
  canPushNoorCdnMain: boolean;
  productionApproved: boolean;
  canPromoteToProduction: boolean;
  files: number;
  jsonFiles: number;
  totalMegabytes: number;
};

function loadReport(): HandoffReport | null {
  try {
    if (!fs.existsSync(reportPath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(reportPath, "utf8")) as HandoffReport;
  } catch {
    return null;
  }
}

export function NoorCdnStagingBranchHandoffCard() {
  const report = loadReport();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sprint 27.8
        </p>
        <h2 className="text-xl font-semibold text-slate-950">
          noor-cdn staging branch handoff
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Prepares the controlled staging-branch handoff for migrated ilm-mate
          content. This does not approve production CDN publishing.
        </p>
      </div>

      {report ? (
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">Target</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {report.targetRepository}/{report.targetBranch}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="font-medium text-slate-500">Candidate size</dt>
            <dd className="mt-1 font-semibold text-slate-950">
              {report.files} files · {report.jsonFiles} JSON · {report.totalMegabytes} MB
            </dd>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <dt className="font-medium text-emerald-700">Staging push</dt>
            <dd className="mt-1 font-semibold text-emerald-950">
              {String(report.canPushNoorCdnStaging)}
            </dd>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <dt className="font-medium text-rose-700">Main / production push</dt>
            <dd className="mt-1 font-semibold text-rose-950">
              {String(report.canPushNoorCdnMain)} · promote {String(report.canPromoteToProduction)}
            </dd>
          </div>
        </dl>
      ) : (
        <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          Run <code>pnpm cdn:staging-handoff</code> to generate the Sprint
          27.8 handoff report.
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Allowed target is <strong>noor-cdn/staging-ilm-mate-v1</strong> only.
        Do not push <strong>noor-cdn/main</strong> in Sprint 27.8.
      </div>
    </section>
  );
}
