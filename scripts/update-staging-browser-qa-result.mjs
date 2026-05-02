import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-browser-qa');
const OUT_JSON = path.join(OUT_DIR, 'staging-browser-qa-report.json');
const GENERATOR = path.join(ROOT, 'scripts', 'generate-staging-browser-qa-checklist.mjs');
const ALLOWED = new Set(['pending', 'pass', 'fail', 'accepted_with_note']);

function parseArgs(argv) {
  const args = { ids: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--id') args.ids.push(argv[++i]);
    else if (token === '--all') args.all = true;
    else if (token === '--category') args.category = argv[++i];
    else if (token === '--status') args.status = argv[++i];
    else if (token === '--reviewer') args.reviewer = argv[++i];
    else if (token === '--note') args.note = argv[++i];
    else if (token === '--help' || token === '-h') args.help = true;
    else if (!args.status && ALLOWED.has(token)) args.status = token;
    else if (!token.startsWith('--')) args.ids.push(token);
  }
  return args;
}

function usage() {
  console.log(`NOOR Sprint 27.11 Browser QA result updater\n\nExamples:\n  pnpm qa:staging-browser:update -- --id quran-index-cdn --status pass --reviewer "Darya Malak" --note "Loaded from CDN"\n  pnpm qa:staging-browser:update -- --category quran --status pass --reviewer "Darya Malak"\n  pnpm qa:staging-browser:update -- --all --status pass --reviewer "Darya Malak" --note "Manual browser QA completed"\n\nAllowed statuses: pending, pass, fail, accepted_with_note`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  usage();
  process.exit(0);
}

if (!fs.existsSync(OUT_JSON)) {
  console.error('Browser QA report does not exist yet. Run: pnpm qa:staging-browser');
  process.exit(1);
}

if (!args.status || !ALLOWED.has(args.status)) {
  console.error('Please provide a valid --status: pending, pass, fail, or accepted_with_note');
  usage();
  process.exit(1);
}

const report = readJson(OUT_JSON);
const now = new Date().toISOString();
let updated = 0;

for (const item of report.tasks ?? []) {
  const matchAll = Boolean(args.all);
  const matchCategory = args.category && item.category === args.category;
  const matchId = args.ids.includes(item.id);
  if (!matchAll && !matchCategory && !matchId) continue;

  item.status = args.status;
  item.reviewer = args.reviewer ?? item.reviewer ?? '';
  item.reviewedAt = now;
  if (args.note) item.notes = args.note;
  updated += 1;
}

if (updated === 0) {
  console.error('No matching QA task was found. Use --id, --category, or --all.');
  console.log('Available IDs:');
  for (const item of report.tasks ?? []) console.log(`- ${item.id} (${item.category})`);
  process.exit(1);
}

writeJson(OUT_JSON, report);
console.log(`Updated ${updated} browser QA task(s).`);
console.log('Regenerating markdown/csv summary...');
execFileSync(process.execPath, [GENERATOR], { cwd: ROOT, stdio: 'inherit' });
