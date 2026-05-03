import fs from 'node:fs';

const packagePath = 'package.json';
const cssPath = 'apps/web/app/globals.css';

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.scripts ??= {};
packageJson.scripts['check:hadith-reader-ux-v1'] = 'node scripts/check-sprint28-4-hadith-reader-ux-v1.mjs';
packageJson.scripts['check:sprint28-4'] = 'pnpm check:sprint28-3 && pnpm check:hadith-reader-ux-v1 && pnpm typecheck && pnpm build';
fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

const cssBlock = `

/* Sprint 28.4: Hadith Reader UX v1 */
.noor-hadith-hero-grid { align-items: stretch; }
.noor-hadith-reader-hero h2,
.noor-hadith-session-card h2 { margin: 10px 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(24px, 4vw, 38px); }
.noor-hadith-session-card { display: grid; gap: 12px; }
.noor-hadith-mode-tabs { margin-top: 14px; }
.noor-hadith-guidance-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 0.9fr); gap: 14px; }
.noor-hadith-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.noor-hadith-flow div { border: 1px solid var(--noor-line); border-radius: 18px; padding: 12px; background: rgba(255,255,255,0.045); }
.noor-hadith-flow strong { display: block; color: var(--noor-gold); font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; }
.noor-hadith-flow span { display: block; margin-top: 6px; color: var(--noor-muted); line-height: 1.45; font-size: 13px; }
.noor-topic-chip-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.noor-hadith-card-v1 { gap: 16px; }
.noor-hadith-reference-stack { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.noor-hadith-source-line { margin: -4px 0 0; }
.noor-hadith-primary-text { font-size: 16px; }
.noor-hadith-guidance-note { border: 1px solid rgba(47, 191, 155, 0.22); background: rgba(47, 191, 155, 0.08); border-radius: 18px; padding: 12px; }
.noor-hadith-guidance-note p { margin: 6px 0 0; color: var(--noor-muted); line-height: 1.6; }
.noor-hadith-actions { display: grid; gap: 8px; }

@media (max-width: 760px) {
  .noor-hadith-guidance-grid,
  .noor-hadith-flow { grid-template-columns: 1fr; }
}
`;

let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('Sprint 28.4: Hadith Reader UX v1')) {
  css = `${css.trimEnd()}${cssBlock}`;
  fs.writeFileSync(cssPath, css);
}

console.log('Registered Sprint 28.4 package scripts and CSS.');
