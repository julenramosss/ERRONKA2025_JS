import { Icons } from "../../../../components/icons";
import type { NavigationMetricsPanelProps } from "../types";
import {
  formatClock,
  formatDistance,
  formatSpeed,
} from "../utils/formatters";

export function NavigationMetricsPanel({
  metrics,
  gpsStatus,
  summary,
}: NavigationMetricsPanelProps) {
  const isActive = gpsStatus === "granted";
  const isDenied = gpsStatus === "denied" || gpsStatus === "unavailable";
  const isArrived = gpsStatus === "arrived";

  if (isArrived) {
    return (
      <div className="absolute inset-x-0 bottom-0 z-30 px-3 pb-3">
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-bg-surface/96 px-5 py-4 shadow-2xl backdrop-blur-md border border-border">
          <Icons.Check size={22} className="text-green-400 shrink-0" />
          <span className="text-base font-bold text-text-primary">
            Helmugara iritsi zara!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-3 pb-3 flex flex-col gap-2">
      {isDenied && (
        <div className="flex items-center gap-2 self-center rounded-full bg-bg-surface/90 px-4 py-2 shadow-lg backdrop-blur-md border border-border text-xs text-text-secondary">
          <Icons.WifiOff size={13} className="shrink-0" />
          GPS gabe — ibilbidea soilik
        </div>
      )}

      {isActive && (
        <div className="flex items-start gap-4 rounded-2xl bg-bg-surface/96 px-5 py-4 shadow-2xl backdrop-blur-md border border-border">
          {/* Speed — large and prominent */}
          <div className="flex flex-col items-center shrink-0 min-w-13">
            <span className="text-3xl font-extrabold tabular-nums leading-none text-text-primary">
              {metrics.speedKmh != null
                ? Math.round(metrics.speedKmh)
                : "--"}
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-text-disabled">
              km/h
            </span>
          </div>

          {/* Divider */}
          <div className="self-stretch w-px bg-border shrink-0" />

          {/* ETA + distance */}
          <div className="flex flex-1 flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Icons.Clock size={13} className="shrink-0 text-text-disabled" />
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                {metrics.eta ? formatClock(metrics.eta) : "--:--"}
              </span>
              <span className="text-xs text-text-secondary">iritsiera</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Route size={13} className="shrink-0 text-text-disabled" />
              <span className="text-sm font-semibold text-text-primary">
                {formatDistance(
                  metrics.remainingDistanceMeters ?? summary?.length
                )}
              </span>
              <span className="text-xs text-text-secondary">geratzen</span>
            </div>
          </div>
        </div>
      )}

      {!isActive && !isDenied && (
        <div className="flex items-center gap-2 self-center rounded-full bg-bg-surface/90 px-4 py-2.5 shadow-lg backdrop-blur-md border border-border">
          <Icons.Loader size={13} className="animate-spin shrink-0 text-accent-light" />
          <span className="text-xs text-text-secondary">GPS seinalearen zain...</span>
        </div>
      )}
    </div>
  );
}
