"use client";

import { useMemo, useRef, useState } from "react";
import { useMyDailyRoute } from "../../../../hooks/routes/useMyDailyRoute";
import { useUpdateArrival } from "../../../../hooks/routes/useUpdateArrival";
import { useUpdateRouteStatus } from "../../../../hooks/routes/useUpdateRouteStatus";
import { useUpdatePackageStatus } from "../../../../hooks/packages/useUpdatePackageStatus";
import type { AppError } from "../../../../utils/types/api/common.types";
import type { PackageStatus } from "../../../../utils/types/api/package.types";
import type { RouteStop } from "../../../../utils/types/api/route.types";
import type { Coords } from "../../../components/Here/types";
import {
  formatRouteDate,
  isTerminalPackageStatus,
  normalizeDateKey,
  ROUTE_STATUS_LABEL,
  toLocalDateKey,
} from "../constants";

type TerminalStatus = Extract<PackageStatus, "delivered" | "failed">;

export function useMyRoutePage() {
  const routeQuery = useMyDailyRoute();
  const updatePackageStatus = useUpdatePackageStatus();
  const updateRouteStatus = useUpdateRouteStatus();
  const updateArrival = useUpdateArrival();
  const mapPanelRef = useRef<HTMLDivElement>(null);

  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [navigationOrigin, setNavigationOrigin] = useState<Coords | null>(null);
  const [navigationDestination, setNavigationDestination] =
    useState<Coords | null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isStartingRoute, setIsStartingRoute] = useState(false);
  const [isOpeningNavigation, setIsOpeningNavigation] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const routeData = routeQuery.data ?? null;
  const stops = useMemo(
    () =>
      [...(routeData?.stops ?? [])].sort(
        (a, b) => a.stop_order - b.stop_order
      ),
    [routeData?.stops]
  );

  const todayKey = toLocalDateKey();
  const routeDateKey = routeData
    ? normalizeDateKey(routeData.route.route_date)
    : null;
  const isToday = routeDateKey === todayKey;
  const isFutureRoute = routeDateKey != null && routeDateKey > todayKey;
  const noRoute = routeQuery.isError && getErrorStatus(routeQuery.error) === 404;

  const activeStop = useMemo(
    () =>
      stops.find((stop) => !isTerminalPackageStatus(stop.package.status)) ??
      null,
    [stops]
  );

  const selectedStop =
    stops.find((stop) => stop.id === selectedStopId) ?? activeStop ?? stops[0] ?? null;

  const completedStops = stops.filter((stop) =>
    isTerminalPackageStatus(stop.package.status)
  ).length;

  const assignedPackageIds = stops
    .filter((stop) => stop.package.status === "assigned")
    .map((stop) => stop.package.id);

  const canStartRoute =
    Boolean(routeData && isToday && activeStop) &&
    routeData?.route.status !== "completed";
  const startButtonLabel =
    assignedPackageIds.length > 0 ? "Ibilbidea hasi" : "Nabigazioa ireki";
  const routeStatusLabel = routeData
    ? ROUTE_STATUS_LABEL[routeData.route.status]
    : "--";
  const routeDateLabel = routeData
    ? formatRouteDate(routeData.route.route_date)
    : "--";

  async function startRoute(): Promise<void> {
    if (!routeData || !activeStop || !canStartRoute) return;

    setActionError(null);
    setIsStartingRoute(true);

    try {
      const origin = await requestBrowserPosition();

      if (assignedPackageIds.length > 0) {
        await updatePackageStatus.mutateAsync({
          package_ids: assignedPackageIds,
          new_status: "in_transit",
        });
      }

      if (routeData.route.status === "planned") {
        await updateRouteStatus.mutateAsync({
          routeId: routeData.route.id,
          payload: { status: "in_progress" },
        });
      }

      openNavigation(origin, stopToCoords(activeStop));
    } catch (error) {
      setActionError(getActionErrorMessage(error));
    } finally {
      setIsStartingRoute(false);
    }
  }

  async function openNavigationForActiveStop(): Promise<void> {
    if (!isToday || !activeStop) return;

    setActionError(null);
    setIsOpeningNavigation(true);

    try {
      const origin = await requestBrowserPosition();
      openNavigation(origin, stopToCoords(activeStop));
    } catch (error) {
      setActionError(getActionErrorMessage(error));
    } finally {
      setIsOpeningNavigation(false);
    }
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

  function canUpdateStop(stop: RouteStop): boolean {
    return (
      isToday &&
      activeStop?.id === stop.id &&
      stop.package.status === "in_transit" &&
      routeData?.route.status !== "completed"
    );
  }

  function openNavigation(origin: Coords, destination: Coords): void {
    setNavigationOrigin(origin);
    setNavigationDestination(destination);
    setIsNavigationOpen(true);
  }

  function closeNavigation(): void {
    setIsNavigationOpen(false);
  }

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
    stops,
    activeStop,
    selectedStop,
    selectedStopId: selectedStop?.id ?? null,
    completedStops,
    routeDateLabel,
    routeStatusLabel,
    noRoute,
    isToday,
    isFutureRoute,
    isLoading: routeQuery.isLoading,
    isError: routeQuery.isError && !noRoute,
    isStartingRoute:
      isStartingRoute ||
      updatePackageStatus.isPending ||
      updateRouteStatus.isPending,
    isUpdatingStop:
      updatePackageStatus.isPending ||
      updateArrival.isPending ||
      updateRouteStatus.isPending,
    isOpeningNavigation,
    isNavigationOpen,
    navigationOrigin,
    navigationDestination,
    actionError,
    canStartRoute,
    startButtonLabel,
    selectStop,
    refetch: routeQuery.refetch,
    startRoute,
    openNavigationForActiveStop,
    closeNavigation,
    markStopStatus,
  };
}

function stopToCoords(stop: RouteStop): Coords {
  return {
    lat: stop.package.address.lat,
    lng: stop.package.address.lng,
  };
}

function requestBrowserPosition(): Promise<Coords> {
  if (!("geolocation" in navigator)) {
    return Promise.reject(new Error("Nabigatzaileak ez du GPSa onartzen."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  });
}

function getActionErrorMessage(error: unknown): string {
  if (isGeolocationError(error)) {
    if (error.code === error.PERMISSION_DENIED) {
      return "GPS baimena ukatu da.";
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      return "Ezin izan da kokapena lortu.";
    }
    if (error.code === error.TIMEOUT) {
      return "Kokapena lortzea gehiegi luzatu da.";
    }
  }

  const appError = error as AppError;
  if (appError?.message) return appError.message;

  if (error instanceof Error) return error.message;
  return "Ekintza ezin izan da osatu.";
}

function getErrorStatus(error: unknown): number | undefined {
  return (error as AppError | null)?.status;
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
