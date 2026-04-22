"use client";

import { useRef, useState } from "react";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { ROUTE_STATUSES } from "../../../../utils/types";
import { normalizeDateKey, toLocalDateKey } from "../constants";
import { getErrorStatus } from "./routeUtils";

export function useMyRoutePage() {
  const routeQuery = useMyDailyRoute();
  const mapPanelRef = useRef<HTMLDivElement>(null);

  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);

  const routeData = routeQuery.data ?? null;
  const routeDateKey = routeData
    ? normalizeDateKey(routeData.route.route_date)
    : null;
  const isToday = routeDateKey === toLocalDateKey();
  const noRoute =
    routeQuery.isError && getErrorStatus(routeQuery.error) === 404;
  const noPendingRoute =
    noRoute ||
    routeData?.route.status === ROUTE_STATUSES.completed ||
    (routeData?.route.status === ROUTE_STATUSES.planned && !isToday);

  function selectStop(stopId: number): void {
    setSelectedStopId(stopId);
    requestAnimationFrame(() => {
      if (!mapPanelRef.current) return;
      const mapRect = mapPanelRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + mapRect.top - 96;
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    });
  }

  return {
    mapPanelRef,
    routeData,
    noRoute,
    noPendingRoute,
    isLoading: routeQuery.isLoading,
    isError: routeQuery.isError && !noRoute,
    selectedStopId,
    selectStop,
  };
}
