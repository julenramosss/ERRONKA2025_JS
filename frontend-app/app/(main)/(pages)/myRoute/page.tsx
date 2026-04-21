"use client";

import { Skeleton } from "boneyard-js/react";
import { Icons } from "../../../components/icons";
import { EmptyRouteState } from "./components/EmptyRouteState";
import { MyRouteHeader } from "./components/MyRouteHeader";
import { NavigationModal } from "./components/NavigationModal";
import { RouteMapPanel } from "./components/RouteMapPanel";
import { RouteProgress } from "./components/RouteProgress";
import { RouteStopsList } from "./components/RouteStopsList";
import { MyRouteLoader } from "./components/loaders/MyRoute.loader";
import { useMyRoutePage } from "./hooks/useMyRoutePage";

export default function MyRoutePage() {
  const {
    routeData,
    stops,
    activeStop,
    selectedStop,
    selectedStopId,
    completedStops,
    routeDateLabel,
    routeStatusLabel,
    noRoute,
    isToday,
    isLoading,
    isError,
    isStartingRoute,
    isUpdatingStop,
    isOpeningNavigation,
    isNavigationOpen,
    mapPanelRef,
    navigationOrigin,
    navigationDestination,
    actionError,
    canStartRoute,
    startButtonLabel,
    selectStop,
    refetch,
    startRoute,
    openNavigationForActiveStop,
    closeNavigation,
    markStopStatus,
  } = useMyRoutePage();

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <Skeleton
        name="my-route"
        loading={isLoading}
        fallback={<MyRouteLoader />}
      >
        {noRoute ? (
          <EmptyRouteState />
        ) : isError || !routeData ? (
          <div className="flex min-h-105 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-bg-surface px-6 text-center">
            <Icons.AlertTriangle size={34} className="text-text-error" />
            <div>
              <p className="font-semibold text-text-primary">
                Ezin izan da ruta kargatu
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Saiatu berriro datuak eguneratzen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-focus"
            >
              <Icons.RefreshCw size={15} />
              Berriro saiatu
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <MyRouteHeader
              routeDateLabel={routeDateLabel}
              routeStatusLabel={routeStatusLabel}
              totalStops={stops.length}
              completedStops={completedStops}
              isToday={isToday}
              isStartingRoute={isStartingRoute}
              canStartRoute={canStartRoute}
              actionError={actionError}
              startButtonLabel={startButtonLabel}
              onStartRoute={startRoute}
            />

            <RouteProgress
              totalStops={stops.length}
              completedStops={completedStops}
              activeStopOrder={activeStop?.stop_order ?? null}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
              <RouteStopsList
                stops={stops}
                selectedStopId={selectedStopId}
                activeStopId={activeStop?.id ?? null}
                isToday={isToday}
                routeStatus={routeData.route.status}
                isUpdatingStop={isUpdatingStop}
                onSelectStop={selectStop}
                onMarkStop={markStopStatus}
              />

              <div ref={mapPanelRef}>
                <RouteMapPanel
                  selectedStop={selectedStop}
                  activeStop={activeStop}
                  isToday={isToday}
                  isOpeningNavigation={isOpeningNavigation}
                  onOpenNavigation={openNavigationForActiveStop}
                />
              </div>
            </div>
          </div>
        )}
      </Skeleton>

      {isNavigationOpen && (
        <NavigationModal
          origin={navigationOrigin}
          destination={navigationDestination}
          onClose={closeNavigation}
        />
      )}
    </div>
  );
}
