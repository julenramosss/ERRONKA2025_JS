import { Icons } from "../../../../components/icons";
import type { MouseEvent } from "react";
import type { RouteStopActionsProps } from "../types";

type ButtonClickEvent = MouseEvent<HTMLButtonElement>;

export function RouteStopActions({
  stop,
  isActive,
  isToday,
  routeStatus,
  isUpdatingStop,
  onMarkStop,
}: RouteStopActionsProps) {
  const canUpdate =
    isToday &&
    isActive &&
    stop.package.status === "in_transit" &&
    routeStatus !== "completed";

  if (stop.package.status === "delivered" || stop.package.status === "failed") {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={(event: ButtonClickEvent) => {
          event.stopPropagation();
          onMarkStop(stop, "failed");
        }}
        disabled={!canUpdate || isUpdatingStop}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--st-failed-fg)] bg-[var(--st-failed-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--st-failed-fg)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icons.X size={13} />
        Huts markatu
      </button>
      <button
        type="button"
        onClick={(event: ButtonClickEvent) => {
          event.stopPropagation();
          onMarkStop(stop, "delivered");
        }}
        disabled={!canUpdate || isUpdatingStop}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--st-delivered-fg)] bg-[var(--st-delivered-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--st-delivered-fg)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icons.Check size={13} />
        Entregatuta
      </button>
    </div>
  );
}
