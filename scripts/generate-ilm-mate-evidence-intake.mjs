import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readinessPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'promotion-readiness', 'promotion-readiness-report.json');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-intake');
const templatesRoot = path.join(outputRoot, 'templates');
const VERSION = '0.26.9';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function titleCase(value) {
  return String(value)
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function domainLabel(domain) {
  if (domain === 'quran') return 'Quran';
  if (domain === 'tafseer') return 'Tafseer';
  if (domain === 'hadith') return 'Hadith';
  return titleCase(domain);
}

function sampleScope(domain, counts = {}) {
  if (domain === 'quran') return `114 surahs, ${counts.ayat ?? 'unknown'} ayat`;
  if (domain === 'tafseer') return `${counts.books ?? 'unknown'} tafseer books, ${counts.entries ?? 'unknown'} entries`;
  if (domain === 'hadith') return `${counts.collections ?? 'unknown'} collections, ${counts.items ?? 'unknown'} items`;
  return JSON.stringify(counts);
}

function evidenceInstructions(key, domain) {
  const label = domainLabel(domain);
  const map = {
    source_identity: `Identify the original upstream source for ${label}. Include repository/site name, URL, edition/book name, language, source maintainer and date accessed.`,
    license_or_permission: `Attach the license, public reuse terms, or written permission allowing NOOR to store and distribute the ${label} data.`,
    attribution_wording: `Provide exact public attribution wording to display in NOOR and CDN metadata for ${label}.`,
    checksum_integrity_plan: `Record checksum method, source file checksum, generated output checksum plan and how future changes will be detected for ${label}.`,
    scholarly_reviewer_signoff: `Capture sign-off from a qualified reviewer that the ${label} source and migration approach are acceptable for staging review.`,
    production_promotion_approval: `Leave blocked until a future production-promotion sprint. This item requires explicit final approval after all other evidence is complete.`
  };
  return map[key] || `Submit evidence for ${titleCase(key)} covering ${label}.`;
}

if (!fs.existsSync(readinessPath)) {
  throw new Error(`Sprint 26.8 promotion readiness report not found: ${path.relative(root, readinessPath)}. Run pnpm ilm:promotion-readiness first.`);
}

const readiness = readJson(readinessPath);
const domains = Array.isArray(readiness.domainReadiness) ? readiness.domainReadiness : [];
if (domains.length === 0) {
  throw new Error('Promotion readiness report has no domainReadiness entries.');
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(templatesRoot, { recursive: true });

const forms = [];
const domainTemplates = [];
for (const domainEntry of domains) {
  const domain = domainEntry.domain;
  const label = domainLabel(domain);
  const evidenceItems = Array.isArray(domainEntry.requiredEvidence) ? domainEntry.requiredEvidence : [];

  for (const item of evidenceItems) {
    forms.push({
      id: `ilm-mate-v1-${domain}-${item.key}-evidence-form`,
      domain,
      domainLabel: label,
      evidenceKey: item.key,
      evidenceLabel: item.label,
      required: true,
      currentStatus: item.status,
      submissionStatus: item.key === 'production_promotion_approval' ? 'blocked' : 'not-submitted',
      productionApproved: false,
      canApproveProduction: false,
      reviewerName: '',
      reviewerRole: '',
      evidenceReference: '',
      sourceUrlOrDocument: '',
      dateSubmitted: '',
      dateReviewed: '',
      reviewerDecision: 'pending',
      instructions: evidenceInstructions(item.key, domain),
      notes: item.notes || ''
    });
  }

  const templatePath = path.join(templatesRoot, `${domain}-evidence-submission-template.md`);
  const template = `# NOOR Sprint 26.9 — ${label} Evidence Submission Template\n\n` +
    `Status: **blocked / intake only**  \n` +
    `Production approved: **false**  \n` +
    `Domain scope: **${sampleScope(domain, domainEntry.counts)}**\n\n` +
    `## Reviewer details\n\n` +
    `- Reviewer name:\n- Reviewer role / qualification:\n- Organisation / affiliation:\n- Date submitted:\n- Contact reference:\n\n` +
    `## Source package reviewed\n\n` +
    `- Domain: ${label}\n- Migrated package: ilm-mate-v1\n- Staging output: content-pipeline/imported/ilm-mate-v1/noor-cdn\n- Review output: content-pipeline/review/ilm-mate-v1\n\n` +
    `## Evidence checklist\n\n` +
    evidenceItems.map((item, index) => {
      return `### ${index + 1}. ${item.label}\n\n` +
        `- Evidence key: \`${item.key}\`\n` +
        `- Current status: \`${item.status}\`\n` +
        `- Required: yes\n` +
        `- Evidence reference / URL / file:\n` +
        `- Reviewer notes:\n` +
        `- Decision: pending / accepted-for-staging / rejected / needs-more-information\n` +
        `- Instructions: ${evidenceInstructions(item.key, domain)}\n\n`;
    }).join('') +
    `## Declaration\n\n` +
    `I confirm that this submission is for staging review only. It does not approve production publication, CDN promotion, or public redistribution until a future explicit production-promotion sprint.\n\n` +
    `- Reviewer signature / name:\n- Date:\n`;
  writeText(templatePath, template);
  domainTemplates.push({ domain, domainLabel: label, path: path.relative(root, templatePath).replaceAll('\\\\', '/') });
}

const pack = {
  id: 'noor-ilm-mate-v1-evidence-intake-pack',
  version: VERSION,
  label: 'ilm-mate migrated content evidence intake pack',
  generatedAt: new Date().toISOString(),
  sourcePromotionReadinessReport: 'content-pipeline/review/ilm-mate-v1/promotion-readiness/promotion-readiness-report.json',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-intake',
  policy: {
    status: 'blocked',
    productionApproved: false,
    canPromoteToProduction: false,
    rule: 'Sprint 26.9 collects reviewer evidence templates only. It must not approve or publish migrated ilm-mate content to production CDN.'
  },
  summary: {
    domains: domains.length,
    evidenceForms: forms.length,
    domainTemplates: domainTemplates.length,
    missingEvidenceFromReadiness: readiness.summary?.missingEvidence ?? forms.length,
    completedEvidenceFromReadiness: readiness.summary?.completedEvidence ?? 0
  },
  domains: domains.map((entry) => ({
    domain: entry.domain,
    status: entry.status,
    productionApproved: false,
    canPromoteToProduction: false,
    readinessScore: entry.readinessScore ?? 0,
    requiredEvidenceCount: entry.requiredEvidenceCount ?? (entry.requiredEvidence || []).length,
    missingEvidenceCount: entry.missingEvidenceCount ?? (entry.requiredEvidence || []).length,
    counts: entry.counts || {}
  })),
  evidenceForms: forms,
  templates: domainTemplates,
  nextActions: [
    'Send the relevant domain template to a reviewer or source owner.',
    'Collect evidence references for source identity, licensing, attribution, checksum plan and scholarly sign-off.',
    'Keep production promotion approval blocked until all other evidence is accepted.',
    'Update a future evidence register from submitted templates before re-running promotion readiness.'
  ]
};

writeJson(path.join(outputRoot, 'evidence-intake-pack.json'), pack);
writeJson(path.join(outputRoot, 'reviewer-submission-forms.json'), forms);
writeText(path.join(outputRoot, 'reviewer-submission-forms.csv'), toCsv(forms, [
  'id',
  'domain',
  'evidenceKey',
  'evidenceLabel',
  'required',
  'currentStatus',
  'submissionStatus',
  'productionApproved',
  'canApproveProduction',
  'reviewerName',
  'reviewerRole',
  'evidenceReference',
  'sourceUrlOrDocument',
  'dateSubmitted',
  'dateReviewed',
  'reviewerDecision',
  'instructions',
  'notes'
]));

const md = `# NOOR Sprint 26.9 — ilm-mate Evidence Intake Pack\n\n` +
  `Generated: ${pack.generatedAt}\n\n` +
  `## Gate status\n\n` +
  `- Status: **${pack.policy.status}**\n` +
  `- Production approved: **${pack.policy.productionApproved}**\n` +
  `- Can promote to production: **${pack.policy.canPromoteToProduction}**\n` +
  `- Evidence forms: **${pack.summary.evidenceForms}**\n` +
  `- Domain templates: **${pack.summary.domainTemplates}**\n\n` +
  `## Domains\n\n` +
  pack.domains.map((domain) => {
    return `- **${domainLabel(domain.domain)}** — status: \`${domain.status}\`, missing evidence: ${domain.missingEvidenceCount}, production approved: ${domain.productionApproved}`;
  }).join('\n') +
  `\n\n## Reviewer templates\n\n` +
  domainTemplates.map((template) => `- ${template.domainLabel}: \`${template.path}\``).join('\n') +
  `\n\n## Policy\n\n${pack.policy.rule}\n\n` +
  `No file in this evidence intake pack may be treated as production approval.\n`;
writeText(path.join(outputRoot, 'evidence-intake-pack.md'), md);

const checklist = `# NOOR Sprint 26.9 — All Domains Evidence Checklist\n\n` +
  forms.map((form, index) => {
    return `- [ ] ${index + 1}. **${form.domainLabel}** — ${form.evidenceLabel} (\`${form.evidenceKey}\`)`;
  }).join('\n') +
  `\n\nProduction promotion approval remains blocked until a future explicit sprint.\n`;
writeText(path.join(templatesRoot, 'all-domains-evidence-checklist.md'), checklist);

console.log('NOOR Sprint 26.9 ilm-mate evidence intake pack generated.');
console.log(`Output: ${path.relative(root, outputRoot)}`);
console.log(`Domains: ${domains.map((entry) => entry.domain).join(', ')}`);
console.log(`Evidence forms: ${forms.length}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
