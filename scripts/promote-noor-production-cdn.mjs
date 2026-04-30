import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const VERSION = '0.25.0';
const outputRoot = 'content-pipeline/production-cdn';
const promotionJsonFile = path.join(outputRoot, 'noor-production-cdn-promotion.json');
const promotionMdFile = path.join(outputRoot, 'noor-production-cdn-promotion.md');
const envFile = path.join(outputRoot, '.env.noor-production-cdn.example');

const reviewFile = 'content-pipeline/review/noor-scholarly-review-console.json';
const quranReportFile = 'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json';
const tafseerReportFile = 'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json';
const hadithReportFile = 'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}
function isReportApproved(report) {
  return report?.productionGate?.status === 'approved' || report?.productionGate?.approvedForProduction === true;
}

const review = readJson(reviewFile);
const quranReport = readJson(quranReportFile);
const tafseerReport = readJson(tafseerReportFile);
const hadithReport = readJson(hadithReportFile);

const reviewCases = Array.isArray(review.reviewCases) ? review.reviewCases : [];
const approvedReviewCases = reviewCases.filter((item) => item.approvalStatus === 'approved');
const allReviewCasesApproved = reviewCases.length === 3 && approvedReviewCases.length === reviewCases.length;
const allImportReportsApproved = [quranReport, tafseerReport, hadithReport].every(isReportApproved);
const productionPromotionAllowed = allReviewCasesApproved && allImportReportsApproved && review.summary?.productionPromotionAllowed === true;

const blockedReasons = [];
if (!allReviewCasesApproved) blockedReasons.push('Scholarly review cases are not fully approved.');
if (!allImportReportsApproved) blockedReasons.push('Imported Quran, tafseer and hadith reports are not approved for production.');
if (review.summary?.productionPromotionAllowed !== true) blockedReasons.push('Review console summary does not allow production promotion.');

const promotion = {
  version: VERSION,
  promotionId: 'noor-production-cdn-v1-promotion',
  generatedAt: new Date().toISOString(),
  generatedBy: 'Sprint 25 — Production CDN v1 promotion',
  status: productionPromotionAllowed ? 'ready-for-manual-promotion' : 'blocked',
  productionPromotionAllowed,
  runtimeDefault: productionPromotionAllowed ? 'cdn' : 'bundled',
  promotionMode: productionPromotionAllowed ? 'manual-external-cdn' : 'metadata-only-blocked-candidate',
  preferredExternalBase: 'https://effortedutech.github.io/noor-cdn',
  fallbackExternalBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main',
  sourceArtifacts: { reviewConsole: reviewFile, quranImportReport: quranReportFile, tafseerImportReport: tafseerReportFile, hadithImportReport: hadithReportFile },
  gates: {
    reviewConsole: {
      version: review.version,
      status: review.status,
      totalReviewCases: review.summary?.totalReviewCases ?? reviewCases.length,
      approvedReviewCases: review.summary?.approvedReviewCases ?? approvedReviewCases.length,
      productionPromotionAllowed: review.summary?.productionPromotionAllowed === true
    },
    quran: { version: quranReport.version, status: quranReport.productionGate?.status ?? 'unknown', approved: isReportApproved(quranReport) },
    tafseer: { version: tafseerReport.version, status: tafseerReport.productionGate?.status ?? 'unknown', approved: isReportApproved(tafseerReport) },
    hadith: { version: hadithReport.version, status: hadithReport.productionGate?.status ?? 'unknown', approved: isReportApproved(hadithReport) }
  },
  envPreview: productionPromotionAllowed
    ? {
        NEXT_PUBLIC_NOOR_CONTENT_SOURCE: 'cdn',
        NEXT_PUBLIC_NOOR_QURAN_CDN_BASE: 'https://effortedutech.github.io/noor-cdn',
        NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE: 'https://effortedutech.github.io/noor-cdn',
        NEXT_PUBLIC_NOOR_HADITH_CDN_BASE: 'https://effortedutech.github.io/noor-cdn',
        NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE: 'https://effortedutech.github.io/noor-cdn'
      }
    : {
        NEXT_PUBLIC_NOOR_CONTENT_SOURCE: 'bundled',
        NEXT_PUBLIC_NOOR_QURAN_CDN_BASE: '',
        NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE: '',
        NEXT_PUBLIC_NOOR_HADITH_CDN_BASE: '',
        NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE: ''
      },
  blockedReasons,
  manualReleaseChecklist: [
    'Run pnpm review:console and confirm all review cases are approved by named reviewers.',
    'Run importers using approved sources only.',
    'Run pnpm cdn:pack, pnpm cdn:verify and pnpm cdn:smoke against the final publish folder.',
    'Only then apply the CDN environment variables in Vercel or local .env.'
  ]
};

mkdirSync(outputRoot, { recursive: true });
writeFileSync(promotionJsonFile, `${JSON.stringify(promotion, null, 2)}\n`, 'utf8');

writeFileSync(promotionMdFile, `# NOOR Production CDN v1 Promotion

Version: ${promotion.version}
Status: ${promotion.status}
Production promotion allowed: ${promotion.productionPromotionAllowed}
Runtime default: ${promotion.runtimeDefault}

## Gate summary

- Review console: ${promotion.gates.reviewConsole.status}; approved cases ${promotion.gates.reviewConsole.approvedReviewCases}/${promotion.gates.reviewConsole.totalReviewCases}
- Quran import: ${promotion.gates.quran.status}
- Tafseer import: ${promotion.gates.tafseer.status}
- Hadith import: ${promotion.gates.hadith.status}

## Blocked reasons

${promotion.blockedReasons.length > 0 ? promotion.blockedReasons.map((reason) => `- ${reason}`).join('\n') : '- None'}

## Environment preview

\`\`\`env
${Object.entries(promotion.envPreview).map(([key, value]) => `${key}=${value}`).join('\n')}
\`\`\`

Sprint 25 does not silently switch NOOR to external CDN mode.
`, 'utf8');

writeFileSync(envFile, `# NOOR Sprint 25 production CDN promotion preview
# Status: ${promotion.status}

NEXT_PUBLIC_NOOR_CONTENT_SOURCE=${promotion.envPreview.NEXT_PUBLIC_NOOR_CONTENT_SOURCE}
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${promotion.envPreview.NEXT_PUBLIC_NOOR_QURAN_CDN_BASE}
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${promotion.envPreview.NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE}
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${promotion.envPreview.NEXT_PUBLIC_NOOR_HADITH_CDN_BASE}
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${promotion.envPreview.NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE}

# External CDN candidate, do not enable until all gates are approved:
# NEXT_PUBLIC_NOOR_CONTENT_SOURCE=cdn
# NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${promotion.preferredExternalBase}
# NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${promotion.preferredExternalBase}
# NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${promotion.preferredExternalBase}
# NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${promotion.preferredExternalBase}
`, 'utf8');

console.log(`NOOR Sprint 25 production CDN promotion generated. Status: ${promotion.status}.`);
