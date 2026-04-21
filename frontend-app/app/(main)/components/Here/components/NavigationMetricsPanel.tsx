import { Icons } from "../../../../components/icons";
import type { NavigationMetricsPanelProps } from "../types";
import {
  formatAccuracy,
  formatClock,
  formatDistance,
  formatSpeed,
} from "../utils/formatters";
import { Metric } from "./Metric";
import { TurnIcon } from "./TurnIcon";

export function NavigationMetricsPanel({
  currentPosition,
  isRouteReady,
  metrics,
  navigating,
  nextAction,
  onStart,
  onStop,
  summary,
}: NavigationMetricsPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-bg-surface/95 p-4 text-text-primary shadow-2xl backdrop-blur-md sm:p-5">
      <div className="grid grid-cols-4 gap-3">
        <Metric
          icon={<Icons.Clock size={15} />}
          label="Iritsiera"
          value={metrics.eta ? formatClock(metrics.eta) : "--:--"}
        />
        <Metric
          icon={<Icons.Route size={15} />}
          label="Distantzia"
          value={formatDistance(metrics.remainingDistanceMeters ?? summary?.length)}
        />
        <Metric
          icon={<Icons.Gauge size={15} />}
          label="Abiadura"
          value={formatSpeed(metrics.speedKmh)}
        />
        <Metric
          icon={<Icons.MapPin size={15} />}
          label="Zehaztasuna"
          value={formatAccuracy(metrics.accuracyMeters)}
        />
      </div>

      {nextAction && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2">
          <TurnIcon
            action={nextAction.action}
            direction={nextAction.direction}
            compact
          />
          <p className="min-w-0 flex-1 truncate text-sm text-text-secondary">
            Ondoren: {nextAction.instruction}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-3">
        <div className="min-w-0 text-xs text-text-secondary">
          {currentPosition
            ? `GPS ${formatAccuracy(metrics.accuracyMeters)}`
            : "GPS seinalearen zain"}
        </div>

        {!navigating ? (
          <button
            type="button"
            onClick={onStart}
            disabled={!isRouteReady}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icons.Navigation size={17} />
            Hasi
          </button>
        ) : (
          <button
            type="button"
            onClick={onStop}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-bg-error px-5 py-3 text-sm font-bold text-white"
          >
            <Icons.X size={17} />
            Amaitu
          </button>
        )}
      </div>
    </div>
  );
}
