import { PageHeader } from '@noor/ui';
import { StudioShareComposer } from '../../components/StudioShareComposer';

export default function StudioPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Studio"
        title="Create shareable reminders."
        subtitle="Turn an ayah, hadith, bookmark or manual reminder into a beautiful NOOR share card and caption. Everything runs locally in the browser."
      />

      <StudioShareComposer />
    </main>
  );
}
