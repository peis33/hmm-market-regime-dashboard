import { Allocation } from "@/lib/hmm";

type AllocationChartProps = {
  allocation: Allocation[];
};

const colors = ["bg-cyan", "bg-mint", "bg-gold"];

export function AllocationChart({ allocation }: AllocationChartProps) {
  return (
    <div className="space-y-4">
      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
        <div className="flex h-full">
          {allocation.map((item, index) => (
            <div
              key={item.name}
              className={colors[index] ?? "bg-coral"}
              style={{ width: `${item.value}%` }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {allocation.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${colors[index] ?? "bg-coral"}`}
              />
              <span className="text-sm font-medium text-ink">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
