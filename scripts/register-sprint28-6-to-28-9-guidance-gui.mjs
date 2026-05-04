import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const cssPath = path.join(root, 'apps/web/app/globals.css');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts ?? {};
pkg.scripts['check:guidance-gui-delivery'] = 'node scripts/check-sprint28-6-to-28-9-guidance-gui-delivery.mjs';
write(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);

const cssMarker = '/* Sprint 28.6-28.9: Guidance GUI Delivery */';
const cssBlock = `
${cssMarker}
.noor-topic-journey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.noor-topic-journey-card {
  display: grid;
  gap: 8px;
  min-height: 186px;
  border: 1px solid var(--noor-line);
  border-radius: 22px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.noor-topic-journey-card:hover {
  transform: translateY(-2px);
  border-color: rgba(216, 183, 90, 0.38);
  background: linear-gradient(145deg, rgba(216, 183, 90, 0.16), rgba(47, 191, 155, 0.1));
}

.noor-topic-journey-card strong { font-size: 18px; }
.noor-topic-journey-card span { line-height: 1.45; }
.noor-topic-journey-card small { color: var(--noor-muted); line-height: 1.45; }

.noor-guidance-topic-hero-grid,
.noor-dashboard-grid,
.noor-guidance-journey-client {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.92fr);
  gap: 14px;
  align-items: stretch;
}

.noor-guidance-topic-hero h2,
.noor-guidance-action-card h2,
.noor-guidance-save-card h2,
.noor-daily-session-card h2,
.noor-dashboard-main-card h2,
.noor-reflection-notes-panel h2 {
  margin: 10px 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(24px, 4vw, 38px);
}

.noor-guidance-path-flow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.noor-guidance-path-step,
.noor-daily-session-step {
  display: grid;
  gap: 7px;
  border: 1px solid var(--noor-line);
  border-radius: 20px;
  padding: 13px;
  background: rgba(255, 255, 255, 0.045);
}

.noor-guidance-path-step span,
.noor-daily-session-step span {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(216, 183, 90, 0.24);
  background: rgba(216, 183, 90, 0.12);
  color: #ffe8a6;
  font-weight: 900;
}

.noor-guidance-path-step small,
.noor-daily-session-step small {
  color: var(--noor-muted);
  line-height: 1.45;
}

.noor-guidance-save-card,
.noor-guidance-step-tracker,
.noor-reflection-composer { min-height: 100%; }
.noor-reflection-composer { grid-column: 1 / -1; display: grid; gap: 12px; }
.noor-reflection-composer h3 { margin: 0; font-size: clamp(21px, 3vw, 30px); }
.noor-reflection-textarea { min-height: 118px; resize: vertical; }

.noor-guidance-checklist {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.noor-guidance-check-item {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 4px 10px;
  text-align: left;
  border: 1px solid var(--noor-line);
  border-radius: 18px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.045);
  color: var(--noor-ink);
  cursor: pointer;
}

.noor-guidance-check-item span { grid-row: span 2; color: var(--noor-gold); font-weight: 900; }
.noor-guidance-check-item small { color: var(--noor-muted); line-height: 1.45; }
.noor-guidance-check-item[data-checked="true"] { border-color: rgba(47, 191, 155, 0.34); background: rgba(47, 191, 155, 0.1); }

.noor-daily-session-card { display: grid; gap: 12px; }
.noor-daily-session-steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }

.noor-dashboard-main-card { display: grid; gap: 12px; }
.noor-dashboard-stats-card,
.noor-dashboard-note-card { display: grid; gap: 12px; }
.noor-dashboard-note-card { grid-column: 1 / -1; }

.noor-progress-bar {
  width: 100%;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--noor-line);
}

.noor-progress-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(216, 183, 90, 0.86), rgba(47, 191, 155, 0.78));
}

.noor-reflection-note-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.noor-reflection-note-item {
  display: grid;
  gap: 9px;
  border: 1px solid var(--noor-line);
  border-radius: 18px;
  padding: 13px;
  background: rgba(255, 255, 255, 0.045);
}

.noor-reflection-note-item p { margin: 0; color: var(--noor-ink); line-height: 1.65; }
.noor-reflection-note-item small { color: var(--noor-muted); line-height: 1.45; }

@media (max-width: 900px) {
  .noor-guidance-path-flow,
  .noor-daily-session-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .noor-guidance-topic-hero-grid,
  .noor-dashboard-grid,
  .noor-guidance-journey-client,
  .noor-guidance-path-flow,
  .noor-daily-session-steps { grid-template-columns: 1fr; }
  .noor-reflection-composer,
  .noor-dashboard-note-card { grid-column: auto; }
}
`;

let css = read(cssPath);
if (!css.includes(cssMarker)) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
  write(cssPath, css);
}

console.log('Registered Sprint 28.6-28.9 Guidance GUI delivery script and styles.');
