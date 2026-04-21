import { Icons } from "../../../../components/icons";
import type { NavigationStatusPanelProps } from "../types";
import { formatDistance } from "../utils/formatters";
import { TurnIcon } from "./TurnIcon";

export function NavigationStatusPanel({
  currentAction,
  maneuverDistance,
  navigationError,
  routeLoading,
  show,
}: NavigationStatusPanelProps) {
  const shouldRender = routeLoading || !!navigationError || show;
  if (!shouldRender) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3">
      <div className="pointer-events-auto rounded-2xl bg-bg-surface/96 shadow-2xl backdrop-blur-md border border-border">
        {routeLoading ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <Icons.Loader size={20} className="animate-spin shrink-0 text-accent-light" />
            <span className="text-sm font-medium text-text-primary">
              Ibilbidea kalkulatzen...
            </span>
          </div>
        ) : navigationError ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <Icons.AlertTriangle size={20} className="shrink-0 text-text-error" />
            <span className="text-sm font-medium text-text-primary">{navigationError}</span>
          </div>
        ) : currentAction ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <TurnIcon action={currentAction.action} direction={currentAction.direction} />
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-tight text-text-primary">
                {currentAction.instruction}
              </p>
              {maneuverDistance != null && (
                <p className="mt-0.5 text-xs font-medium text-accent-light">
                  {formatDistance(maneuverDistance)} barru
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
