export function PageHeader({
  kicker,
  title,
  subtitle
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="noor-page-header">
      <span className="noor-kicker">{kicker}</span>
      <h1 className="noor-title">{title}</h1>
      <p className="noor-subtitle">{subtitle}</p>
    </header>
  );
}
