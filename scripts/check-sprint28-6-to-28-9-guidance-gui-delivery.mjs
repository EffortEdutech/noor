import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failed = false;

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failed = true;
    console.error(`Missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function expectIncludes(relativePath, needles) {
  const content = read(relativePath);
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failed = true;
      console.error(`Expected ${relativePath} to include: ${needle}`);
    }
  }
}

expectIncludes('apps/web/lib/guidance-topics.ts', [
  'GUIDANCE_TOPIC_DETAILS',
  "id: 'mercy'",
  "id: 'patience'",
  "id: 'rizq'",
  "id: 'intention'",
  "id: 'protection'",
  "id: 'prayer'",
  "id: 'repentance'",
  'Read Quran',
  'Understand Tafseer',
  'Reflect with Hadith',
  'Respond today'
]);

expectIncludes('apps/web/app/explore/page.tsx', [
  'Guided topic journeys',
  'noor-topic-journey-grid',
  'GUIDANCE_TOPIC_DETAILS',
  'topic.exploreHref'
]);

expectIncludes('apps/web/app/explore/[topic]/page.tsx', [
  'generateStaticParams',
  'GuidanceTopicJourneyClient',
  'searchNoorLocal',
  'Connected guidance',
  'noor-guidance-path-flow'
]);

expectIncludes('apps/web/components/GuidanceTopicJourneyClient.tsx', [
  'saveReflectionNote',
  'saveGuidancePathProgress',
  'Journey progress saved',
  'Reflection saved to your Library'
]);

expectIncludes('apps/web/components/DailyGuidedSessionCard.tsx', [
  'Daily guided session',
  'getDailyGuidanceTopic',
  'Save as current path'
]);

expectIncludes('apps/web/components/ContinueGuidancePathCard.tsx', [
  'Continue Guidance',
  'getLatestGuidancePath',
  'Resume path'
]);

expectIncludes('apps/web/components/NoorHomeDashboard.tsx', [
  'Continue my journey',
  'getNoorLightStats',
  'Latest reflection'
]);

expectIncludes('apps/web/components/ReflectionNotesPanel.tsx', [
  'Reflection notes',
  'deleteReflectionNote',
  'Reopen path'
]);

expectIncludes('apps/web/lib/local-store.ts', [
  'NOOR_REFLECTION_NOTES_KEY',
  'NOOR_GUIDANCE_PATHS_KEY',
  'saveReflectionNote',
  'saveGuidancePathProgress',
  'getLatestGuidancePath'
]);

expectIncludes('apps/web/app/today/page.tsx', [
  'NoorHomeDashboard',
  'DailyGuidedSessionCard',
  'ContinueGuidancePathCard',
  'ReflectionNotesPanel'
]);

expectIncludes('apps/web/app/library/page.tsx', [
  'ReflectionNotesPanel',
  'reflections, guidance paths'
]);

expectIncludes('apps/web/app/globals.css', [
  'Sprint 28.6-28.9: Guidance GUI Delivery',
  'noor-topic-journey-grid',
  'noor-guidance-path-flow',
  'noor-dashboard-grid',
  'noor-reflection-note-list'
]);

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:guidance-gui-delivery'] !== 'node scripts/check-sprint28-6-to-28-9-guidance-gui-delivery.mjs') {
  failed = true;
  console.error('Missing package script: check:guidance-gui-delivery');
}

if (failed) {
  console.error('Sprint 28.6-28.9 Guidance GUI delivery check failed.');
  process.exit(1);
}

console.log('Sprint 28.6-28.9 Guidance GUI delivery check passed.');
