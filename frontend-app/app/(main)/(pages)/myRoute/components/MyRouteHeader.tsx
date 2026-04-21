import { Icons } from "../../../../components/icons";
import type { MyRouteHeaderProps } from "../types";

export function MyRouteHeader({
  routeDateLabel,
  routeStatusLabel,
  totalStops,
  completedStops,
  isToday,
  isStartingRoute,
  canStartRoute,
  actionError,
  startButtonLabel,
  onStartRoute,
}: MyRouteHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-accent-light">
            <span>{isToday ? "Gaurko ruta" : "Hurrengo ruta"}</span>
            <span className="h-1 w-1 rounded-full bg-text-disabled" />
            <span>{routeDateLabel}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
            Nire ibilbidea
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {completedStops}/{totalStops} geldialdi osatuta - {routeStatusLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartRoute}
          disabled={!canStartRoute || isStartingRoute}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_4px] shadow-accent/30 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStartingRoute ? (
            <Icons.Loader size={16} className="animate-spin" />
          ) : (
            <Icons.Navigation size={16} />
          )}
          {startButtonLabel}
        </button>
      </div>

      {!isToday && (
        <div className="rounded-lg border border-border bg-bg-surface px-4 py-3 text-sm text-text-secondary">
          Ruta hau ez da gaurkoa; nabigazioa eta egoera-aldaketak desgaituta daude.
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--st-failed-fg)] bg-[var(--st-failed-bg)] px-4 py-3 text-sm text-[var(--st-failed-fg)]">
          <Icons.AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
}
