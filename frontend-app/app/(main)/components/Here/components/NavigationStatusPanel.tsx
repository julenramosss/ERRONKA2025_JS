import { Icons } from "../../../../components/icons";
import type { NavigationStatusPanelProps } from "../types";
import { formatDistance } from "../utils/formatters";
import { StatusRow } from "./StatusRow";
import { TurnIcon } from "./TurnIcon";

export function NavigationStatusPanel({
  currentAction,
  maneuverDistance,
  navigationError,
  routeLoading,
}: NavigationStatusPanelProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
      <div className="pointer-events-auto rounded-xl border border-border bg-bg-surface/95 p-4 text-text-primary shadow-2xl backdrop-blur-md">
        {routeLoading ? (
          <StatusRow icon={<Icons.Loader size={22} className="animate-spin" />}>
            Kalkulatzen...
          </StatusRow>
        ) : navigationError ? (
          <StatusRow icon={<Icons.AlertTriangle size={22} />}>
            {navigationError}
          </StatusRow>
        ) : currentAction ? (
          <div className="flex items-center gap-4">
            <TurnIcon
              action={currentAction.action}
              direction={currentAction.direction}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold leading-tight sm:text-2xl">
                {currentAction.instruction}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {maneuverDistance != null
                  ? `${formatDistance(maneuverDistance)} barru`
                  : "Jarraitu ibilbidean"}
              </p>
            </div>
          </div>
        ) : (
          <StatusRow icon={<Icons.Route size={22} />}>Ibilbidea prest</StatusRow>
        )}
      </div>
    </div>
  );
}
