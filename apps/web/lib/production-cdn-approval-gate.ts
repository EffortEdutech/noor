export type NoorProductionCdnApprovalGateStep = {
  id: string;
  label: string;
  status: 'passed' | 'approved' | 'blocked' | 'next';
  note: string;
};

export const NOOR_PRODUCTION_CDN_APPROVAL_GATE = {
  version: '0.27.13',
  sprint: 'Sprint 27.13',
  label: 'Production CDN approval gate',
  approvalReport: 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json',
  approvalMarkdown: 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md',
  sourceBranch: 'noor-cdn/staging-ilm-mate-v1',
  targetBranch: 'noor-cdn/main',
  productionPromotionExecuted: false,
  commands: [
    'pnpm production:approval-gate -- --approve --approver "Darya Malak"',
    'pnpm check:production-approval-gate',
    'pnpm check:sprint27-13'
  ],
  steps: [
    {
      id: 'staging-accepted',
      label: 'Staging CDN accepted',
      status: 'passed',
      note: 'Sprint 27.10 accepted Quran, Tafseer, Hadith and search staging CDN for reviewer/runtime testing.'
    },
    {
      id: 'browser-qa',
      label: 'Browser QA accepted',
      status: 'passed',
      note: 'Sprint 27.11 accepted browser QA for Settings, Quran, Tafseer, Hadith and Explore.'
    },
    {
      id: 'approval-record',
      label: 'Founder approval record',
      status: 'approved',
      note: 'Sprint 27.13 records explicit approval for the next promotion sprint.'
    },
    {
      id: 'production-promotion',
      label: 'Production promotion',
      status: 'next',
      note: 'Sprint 27.13 does not touch noor-cdn/main. Actual promotion is reserved for Sprint 27.14.'
    }
  ] satisfies NoorProductionCdnApprovalGateStep[]
};
