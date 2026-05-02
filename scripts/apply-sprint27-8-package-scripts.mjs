import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packagePath = path.join(root, "package.json");
const settingsPath = path.join(root, "apps", "web", "app", "settings", "page.tsx");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, value) {
  fs.writeFileSync(filePath, value, "utf8");
}

function updatePackageJson() {
  const pkg = JSON.parse(readText(packagePath));
  pkg.scripts = pkg.scripts || {};

  pkg.scripts["cdn:staging-handoff"] = "node scripts/generate-noor-cdn-staging-branch-handoff.mjs";
  pkg.scripts["check:cdn-staging-handoff"] = "node scripts/check-noor-cdn-staging-branch-handoff.mjs";

  writeText(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateSettingsPage() {
  if (!fs.existsSync(settingsPath)) {
    console.warn("Settings page not found. Skipping Settings card insertion.");
    return;
  }

  let text = readText(settingsPath);
  const importLine = 'import { NoorCdnStagingBranchHandoffCard } from "@/components/NoorCdnStagingBranchHandoffCard";\n';

  if (!text.includes("NoorCdnStagingBranchHandoffCard")) {
    const importMatches = [...text.matchAll(/^import .*;$/gm)];
    if (importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const insertAt = lastImport.index + lastImport[0].length + 1;
      text = `${text.slice(0, insertAt)}${importLine}${text.slice(insertAt)}`;
    } else {
      text = `${importLine}${text}`;
    }
  }

  if (!text.includes("<NoorCdnStagingBranchHandoffCard />")) {
    const preferredMarkers = [
      "<IlmMateStagingCdnCandidateCard />",
      "<IlmMateRequiredEvidenceAcceptanceCard />",
      "<IlmMateStagingCdnPackCard />"
    ];

    let inserted = false;

    for (const marker of preferredMarkers) {
      const idx = text.indexOf(marker);
      if (idx !== -1) {
        const end = idx + marker.length;
        text = `${text.slice(0, end)}\n          <NoorCdnStagingBranchHandoffCard />${text.slice(end)}`;
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      const sectionClose = text.lastIndexOf("</section>");
      if (sectionClose !== -1) {
        text = `${text.slice(0, sectionClose)}          <NoorCdnStagingBranchHandoffCard />\n${text.slice(sectionClose)}`;
      } else {
        console.warn("Could not find Settings card insertion point. Import was added, but JSX card was not inserted.");
      }
    }
  }

  writeText(settingsPath, text);
}

updatePackageJson();
updateSettingsPage();

console.log("Sprint 27.8 package scripts added and Settings card registered.");
