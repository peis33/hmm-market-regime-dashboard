type MetricBadgeProps = {
  label: string;
  value: string;
};

export function MetricBadge({ label, value }: MetricBadgeProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
