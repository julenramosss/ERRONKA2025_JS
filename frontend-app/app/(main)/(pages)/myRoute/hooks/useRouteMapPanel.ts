"use client";

import { useMemo } from "react";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import {
  normalizeDateKey,
  toLocalDateKey,
} from "../../../../utils/date.utils";
import { isTerminalPackageStatus } from "../constants";

export function useRouteMapPanel(selectedStopId: number | null) {
  const routeQuery = useMyDailyRoute();

  const routeData = routeQuery.data ?? null;
  const stops = routeData?.stops ?? [];

  const todayKey = toLocalDateKey();
  const routeDateKey = routeData
    ? normalizeDateKey(routeData.route.route_date)
    : null;
  const isToday = routeDateKey === todayKey;

  const activeStop = useMemo(
    () =>
      stops.find((stop) => !isTerminalPackageStatus(stop.package.status)) ??
      null,
    [stops]
  );

  const selectedStop = useMemo(
    () =>
      stops.find((stop) => stop.id === selectedStopId) ??
      activeStop ??
      stops[0] ??
      null,
    [stops, selectedStopId, activeStop]
  );

  return {
    selectedStop,
    activeStop,
    isToday,
  };
}
