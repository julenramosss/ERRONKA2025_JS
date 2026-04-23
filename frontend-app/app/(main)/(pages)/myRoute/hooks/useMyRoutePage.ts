"use client";

import { useRef, useState } from "react";
import { usePreferences } from "../../../../hooks/usePreferences";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { ROUTE_STATUSES } from "../../../../utils/types";
import { getErrorStatus } from "./routeUtils";

export function useMyRoutePage() {
  const routeQuery = useMyDailyRoute();
  const mapPanelRef = useRef<HTMLDivElement>(null);
  const { animations } = usePreferences();

  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);

  const routeData = routeQuery.data ?? null;
  const noRoute =
    routeQuery.isError && getErrorStatus(routeQuery.error) === 404;
  const noPendingRoute =
    noRoute || routeData?.route.status === ROUTE_STATUSES.completed;

  function selectStop(stopId: number): void {
    setSelectedStopId(stopId);
    requestAnimationFrame(() => {
      if (!mapPanelRef.current) return;
      const mapRect = mapPanelRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + mapRect.top - 96;
      window.scrollTo({
        top: scrollTop,
        behavior: animations === "off" ? "auto" : "smooth",
      });
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
