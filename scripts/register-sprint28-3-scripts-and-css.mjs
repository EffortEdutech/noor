import fs from 'node:fs';

const pkgPath = 'package.json';
const globalsPath = 'apps/web/app/globals.css';

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'check:tafseer-understanding-panel': 'node scripts/check-sprint28-3-tafseer-understanding-panel.mjs',
  'check:sprint28-3': 'pnpm check:sprint28-2 && pnpm check:tafseer-understanding-panel && pnpm typecheck && pnpm build'
};

fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const cssMarker = '/* Sprint 28.3: Tafseer Understanding Panel */';
const cssBlock = `
${cssMarker}
.noor-tafseer-understanding-panel { display: grid; gap: 14px; margin-top: 14px; border-color: rgba(47, 191, 155, 0.2); }
.noor-tafseer-understanding-panel h3 { margin: 10px 0 0; font-size: clamp(20px, 3vw, 28px); }
.noor-tafseer-body { margin: 0; color: var(--noor-ink); line-height: 1.78; }
.noor-understanding-flow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.noor-understanding-flow div { border: 1px solid var(--noor-line); border-radius: 18px; padding: 12px; background: rgba(255,255,255,0.045); }
.noor-understanding-flow strong { display: block; color: var(--noor-gold); font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; }
.noor-understanding-flow span { display: block; margin-top: 6px; color: var(--noor-muted); line-height: 1.45; font-size: 13px; }
.noor-tafseer-workflow-card h2 { margin: 10px 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(24px, 4vw, 36px); }

@media (max-width: 760px) {
  .noor-understanding-flow { grid-template-columns: 1fr; }
}
`;

const globals = fs.readFileSync(globalsPath, 'utf8');
if (!globals.includes(cssMarker)) {
  fs.writeFileSync(globalsPath, `${globals.trimEnd()}\n\n${cssBlock.trim()}\n`);
}

console.log('Registered Sprint 28.3 package scripts and CSS.');
