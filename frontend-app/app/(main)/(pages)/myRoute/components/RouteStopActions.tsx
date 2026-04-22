import { Icons } from "../../../../components/icons";
import type { MouseEvent } from "react";
import type { RouteStopActionsProps } from "../types";

type ButtonClickEvent = MouseEvent<HTMLButtonElement>;

export function RouteStopActions({
  stop,
  isActive,
  routeStatus,
  isUpdatingStop,
  onMarkStop,
}: RouteStopActionsProps) {
  const canUpdate =
    routeStatus === "in_progress" &&
    isActive &&
    stop.package.status === "in_transit";

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
        className="inline-flex items-center gap-1.5 rounded-md border border-text-error bg-bg-error px-3 py-1.5 text-xs font-semibold text-text-error transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
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
        className="inline-flex items-center gap-1.5 rounded-md border border-text-success bg-bg-success px-3 py-1.5 text-xs font-semibold text-text-success transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icons.Check size={13} />
        Entregatuta
      </button>
    </div>
  );
}
