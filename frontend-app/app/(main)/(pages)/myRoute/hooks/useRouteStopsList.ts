"use client";

import { useMemo, useState } from "react";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { useUpdateArrival } from "../../../../hooks/routes/useUpdateArrival";
import { useUpdatePackageStatus } from "../../../../hooks/packages/useUpdatePackageStatus";
import { useUpdateRouteStatus } from "../../../../hooks/routes/useUpdateRouteStatus";
import type { AppError } from "../../../../utils/types/api/common.types";
import type { PackageStatus } from "../../../../utils/types/api/package.types";
import type { RouteStop } from "../../../../utils/types/api/route.types";
import { isTerminalPackageStatus } from "../constants";
import { getActionErrorMessage } from "./routeUtils";
import { pointToString } from "../utils/utils";

type TerminalStatus = Extract<PackageStatus, "delivered" | "failed">;

const PAKAG_ORIGIN = { lat: 43.1253804, lng: -2.0619009 };
const originString = `${PAKAG_ORIGIN.lat},${PAKAG_ORIGIN.lng}`;

export function useRouteStopsList() {
  const routeQuery = useMyDailyRoute();
  const updatePackageStatus = useUpdatePackageStatus();
  const updateArrival = useUpdateArrival();
  const updateRouteStatus = useUpdateRouteStatus();

  const [actionError, setActionError] = useState<string | null>(null);

  const routeData = routeQuery.data ?? null;
  const stops = useMemo(
    () => [...(routeData?.stops ?? [])],
    [routeData?.stops]
  );

  const activeStop = useMemo(
    () =>
      stops.find((stop) => !isTerminalPackageStatus(stop.package.status)) ??
      null,
    [stops]
  );

  function canUpdateStop(stop: RouteStop): boolean {
    return (
      routeData?.route.status === "in_progress" &&
      activeStop?.id === stop.id &&
      stop.package.status === "in_transit"
    );
  }

  async function markStopStatus(
    stop: RouteStop,
    status: TerminalStatus
  ): Promise<void> {
    if (!canUpdateStop(stop)) return;

    setActionError(null);

    try {
      if (!stop.actual_arrival) {
        try {
          await updateArrival.mutateAsync({ stop_id: stop.id });
        } catch (error) {
          if ((error as AppError).status !== 409) throw error;
        }
      }

      await updatePackageStatus.mutateAsync({
        package_id: stop.package.id,
        new_status: status,
      });

      const openStops = stops.filter(
        (routeStop) => !isTerminalPackageStatus(routeStop.package.status)
      );

      if (
        openStops.length === 1 &&
        openStops[0]?.id === stop.id &&
        routeData?.route.status === "in_progress"
      ) {
        await updateRouteStatus.mutateAsync({
          routeId: routeData.route.id,
          payload: { status: "completed" },
        });
      }
    } catch (error) {
      setActionError(getActionErrorMessage(error));
    }
  }

  const base = "https://www.google.com/maps/dir/?api=1";
  const originParam = `origin=${encodeURIComponent(originString)}`;
  const travelModeParam = "travelmode=driving";

  const orderedStops = [...stops].sort((a, b) => a.stop_order - b.stop_order);

  const lastStop = orderedStops[orderedStops.length - 1];

  const destinationParam = `destination=${encodeURIComponent(
    lastStop ? pointToString(lastStop.package.address) : originString
  )}`;

  const intermediateStops = orderedStops.slice(0, -1);

  const waypointsParam =
    intermediateStops.length > 0
      ? `&waypoints=${encodeURIComponent(
          intermediateStops
            .map((stop) => pointToString(stop.package.address))
            .join("|")
        )}`
      : "";

  const googleMapsRouteUrl = `${base}&${originParam}&${destinationParam}${waypointsParam}&${travelModeParam}`;

  return {
    stops,
    activeStop,
    routeStatus: routeData?.route.status ?? ("planned" as const),
    isUpdatingStop:
      updatePackageStatus.isPending ||
      updateArrival.isPending ||
      updateRouteStatus.isPending,
    actionError,
    googleMapsRouteUrl,
    markStopStatus,
  };
}
