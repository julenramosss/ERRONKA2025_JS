import { Icons } from "../../../../components/icons";
import type { RouteProgressProps } from "../types";

export function RouteProgress({
  totalStops,
  completedStops,
  activeStopOrder,
}: RouteProgressProps) {
  const value = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">Aurrerapena</p>
          <p className="text-xs text-text-secondary">
            Hurrengo geldialdia: {activeStopOrder ?? "--"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-accent-light">
          <Icons.Route size={17} />
          {value}%
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-bg-darkest">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
