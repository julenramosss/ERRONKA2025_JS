import { RecentActivityProps } from "../types";
import type { PackageStatus } from "../../../../utils/types/api/package.types";

const STATUS_TEXT: Record<PackageStatus, string> = {
  pending: "Zain dago",
  assigned: "Esleituta",
  in_transit: "Garraioan dago",
  delivered: "Entregatuta",
  failed: "Entrega huts egin du",
};

const STATUS_DOT: Record<PackageStatus, string> = {
  pending: "var(--st-pending-fg)",
  assigned: "var(--st-assigned-fg)",
  in_transit: "var(--st-transit-fg)",
  delivered: "var(--st-delivered-fg)",
  failed: "var(--st-failed-fg)",
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function RecentActivity({ packages }: RecentActivityProps) {
  const recent = [...packages]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 6);

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold">Azken jarduera</p>
        <p className="text-xs text-text-secondary mt-0.5">
          Azken egoera eguneraketak
        </p>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-text-disabled text-sm">
          Ez dago jarduerarik
        </div>
      ) : (
        <div className="px-5 py-4 relative flex flex-col gap-0">
          {/* vertical line */}
          <div
            className="absolute left-6.75 top-7 bottom-7 w-px"
            style={{ background: "var(--border-normal)" }}
          />

          {recent.map((pkg) => {
            const color = STATUS_DOT[pkg.status];
            return (
              <div
                key={pkg.id}
                className="flex items-start gap-4 py-3 relative"
              >
                {/* dot */}
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10"
                  style={{
                    background: color,
                    boxShadow: `0 0 0 3px var(--bg-surface), 0 0 10px ${color}66`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium leading-tight">
                    {STATUS_TEXT[pkg.status]}:{" "}
                    <span className="text-text-secondary">
                      {pkg.recipient_name}
                    </span>
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">
                    {pkg.tracking_code} · {pkg.city}
                  </p>
                </div>
                <span className="text-[11px] text-text-disabled font-mono shrink-0">
                  {formatTime(pkg.updated_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
