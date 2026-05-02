import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const sprint = '27.15';
const outputRoot = 'content-pipeline/production-cdn/runtime-qa';
const reportJsonFile = path.join(outputRoot, 'production-browser-qa-report.json');
const reportMdFile = path.join(outputRoot, 'production-browser-qa-report.md');
const checklistCsvFile = path.join(outputRoot, 'production-browser-qa-checklist.csv');

const tasks = [
  ['settings-production-cdn', 'Settings page shows external CDN @main/noor-cdn or production runtime context', 'required'],
  ['quran-index-production', '/learn/quran loads from production CDN', 'required'],
  ['quran-surah-001-production', '/learn/quran/001 loads Al-Fatihah from production CDN', 'required'],
  ['quran-surah-114-production', '/learn/quran/114 loads An-Nas from production CDN', 'required'],
  ['tafseer-production-library', '/learn/tafseer shows production CDN tafseer library/index', 'required'],
  ['tafseer-production-reader', 'Tafseer sample reader opens a production CDN tafseer file', 'required'],
  ['hadith-production-library', '/learn/hadith shows production CDN hadith collections', 'required'],
  ['hadith-view-by-book-production', 'Hadith View by book has collections and opens items', 'required'],
  ['hadith-view-by-chapter-production', 'Hadith View by chapter behavior is checked and documented', 'required'],
  ['hadith-duplicate-key-production', 'Hadith page has no duplicate React key all console warning', 'required'],
  ['explore-production-search', '/explore uses External CDN search index from production CDN', 'required'],
  ['fallback-safe-production', 'Bundled fallback remains enabled if CDN fetch fails', 'required']
].map(([id, title, severity]) => ({ id, title, severity, status: 'pending', reviewer: '', reviewedAt: '', note: '' }));

const report = {
  sprint,
  title: 'Production Browser QA Checklist',
  generatedAt: new Date().toISOString(),
  status: 'pending_browser_qa',
  productionBranch: 'noor-cdn/main',
  localhost: 'http://localhost:3200',
  tasks,
  summary: {
    total: tasks.length,
    requiredTotal: tasks.filter((task) => task.severity === 'required').length,
    requiredPassed: 0,
    requiredFailed: 0,
    requiredPending: tasks.filter((task) => task.severity === 'required').length
  }
};

function toCsv(rows) {
  const header = ['id', 'title', 'severity', 'status', 'reviewer', 'reviewedAt', 'note'];
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [header.join(','), ...rows.map((row) => header.map((key) => escape(row[key])).join(','))].join('\n') + '\n';
}

mkdirSync(outputRoot, { recursive: true });
writeFileSync(reportJsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(checklistCsvFile, toCsv(tasks), 'utf8');
writeFileSync(reportMdFile, `# Sprint 27.15 — Production Browser QA\n\nStatus: ${report.status}\n\nProduction branch: ${report.productionBranch}\n\nOpen localhost: ${report.localhost}\n\n## Tasks\n\n${tasks.map((task) => `- [ ] ${task.id} — ${task.title}`).join('\n')}\n`, 'utf8');

console.log('NOOR Sprint 27.15 production browser QA checklist generated. Status: pending_browser_qa.');
console.log(`Checklist: ${checklistCsvFile}`);
