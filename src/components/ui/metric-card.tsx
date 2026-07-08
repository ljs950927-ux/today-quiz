type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-app-line bg-white p-4">
      <p className="text-sm font-medium text-app-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-normal text-app-ink">{value}</p>
      <p className="mt-1 text-sm text-app-muted">{helper}</p>
    </section>
  );
}
