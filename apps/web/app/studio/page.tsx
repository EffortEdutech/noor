import { NoorCard, PageHeader } from '@noor/ui';

export default function StudioPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Studio"
        title="Share beautiful reminders."
        subtitle="Studio is reserved for the share card/export system. Sprint 0–2 only places the route and shell."
      />
      <NoorCard>
        <span className="noor-badge gold">Coming next</span>
        <h2>Export Studio</h2>
        <p className="noor-subtitle">
          Future flow: choose ayah or hadith → select template → generate caption → preview → share to WhatsApp, Instagram, Telegram, TikTok or Facebook.
        </p>
      </NoorCard>
    </main>
  );
}
