"use client";

import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { isTerminalPackageStatus } from "../constants";

export function useRouteProgress() {
  const routeQuery = useMyDailyRoute();
  const stops = routeQuery.data?.stops ?? [];

  const totalStops = stops.length;
  const completedStops = stops.filter((stop) =>
    isTerminalPackageStatus(stop.package.status)
  ).length;
  const activeStop =
    stops.find((stop) => !isTerminalPackageStatus(stop.package.status)) ?? null;

  return {
    totalStops,
    completedStops,
    activeStopOrder: activeStop?.stop_order ?? null,
  };
}
