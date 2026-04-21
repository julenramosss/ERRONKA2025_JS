import type { MetricProps } from "../types";

export function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-bg-elevated px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] text-text-disabled">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="truncate text-sm font-bold">{value}</div>
    </div>
  );
}
