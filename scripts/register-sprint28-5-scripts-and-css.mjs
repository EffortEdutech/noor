import fs from 'node:fs';

const packagePath = 'package.json';
const cssPath = 'apps/web/app/globals.css';

function read(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing required file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

const packageJson = JSON.parse(read(packagePath));
packageJson.scripts = packageJson.scripts ?? {};
packageJson.scripts['check:explore-guidance-discovery-ux'] =
  'node scripts/check-sprint28-5-explore-guidance-discovery-ux.mjs';
packageJson.scripts['check:sprint28-5'] =
  'pnpm check:sprint28-4 && pnpm check:explore-guidance-discovery-ux && pnpm typecheck && pnpm build';

fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const cssBlock = `
/* Sprint 28.5: Explore Guidance Discovery UX */
.noor-guidance-path-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
  gap: 14px;
  align-items: stretch;
}

.noor-explore-journey-card h2 {
  margin: 10px 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(24px, 4vw, 38px);
}

.noor-topic-prompt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.noor-topic-prompt-card {
  display: grid;
  gap: 7px;
  min-height: 166px;
  text-align: left;
  border: 1px solid var(--noor-line);
  border-radius: 20px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--noor-ink);
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.noor-topic-prompt-card:hover,
.noor-topic-prompt-card[data-active="true"] {
  transform: translateY(-2px);
  border-color: rgba(216, 183, 90, 0.38);
  background: linear-gradient(145deg, rgba(216, 183, 90, 0.16), rgba(47, 191, 155, 0.1));
}

.noor-topic-prompt-card strong {
  font-size: 17px;
}

.noor-topic-prompt-card span {
  color: var(--noor-ink);
  line-height: 1.4;
}

.noor-topic-prompt-card small {
  color: var(--noor-muted);
  line-height: 1.45;
}

.noor-topic-prompt-icon {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 15px;
  border: 1px solid rgba(216, 183, 90, 0.24);
  background: rgba(216, 183, 90, 0.12);
  color: #ffe8a6 !important;
  font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif;
  font-size: 18px;
  direction: rtl;
}

.noor-result-summary {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.noor-suggestion-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.noor-result-group {
  display: grid;
  gap: 12px;
}

.noor-result-group-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.noor-result-group-header h2 {
  margin: 8px 0 0;
  font-size: clamp(21px, 3vw, 30px);
}

.noor-explore-result-card {
  min-height: 260px;
}

.noor-result-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
}

.noor-result-card-actions .noor-button {
  min-height: 38px;
  padding: 8px 12px;
  font-size: 13px;
}

.noor-empty-guidance-card {
  display: grid;
  gap: 12px;
}

.noor-empty-guidance-card h3 {
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
}

@media (max-width: 760px) {
  .noor-guidance-path-grid {
    grid-template-columns: 1fr;
  }

  .noor-suggestion-row {
    justify-content: flex-start;
  }

  .noor-topic-prompt-card {
    min-height: 148px;
  }
}
`;

const css = read(cssPath);
if (!css.includes('Sprint 28.5: Explore Guidance Discovery UX')) {
  fs.writeFileSync(cssPath, `${css.trimEnd()}\n\n${cssBlock.trim()}\n`);
}

console.log('Registered Sprint 28.5 scripts and CSS.');
