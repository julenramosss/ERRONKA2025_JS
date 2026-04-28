'use client';

import { Skeleton } from 'boneyard-js/react';
import { EmptyRouteState } from './components/EmptyRouteState';
import { MyRouteHeader } from './components/MyRouteHeader';
import { RouteMapPanel } from './components/RouteMapPanel';
import { RouteProgress } from './components/RouteProgress';
import { RouteStopsList } from './components/RouteStopsList';
import { MyRouteLoader } from './components/loaders/MyRoute.loader';
import { useMyRoutePage } from './hooks/useMyRoutePage';
import { NotRouteFound } from './components/NotRouteFound';

export default function MyRoutePage() {
  const {
    routeData,
    noPendingRoute,
    isLoading,
    isError,
    selectedStopId,
    mapPanelRef,
    selectStop,
  } = useMyRoutePage();

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <Skeleton
        name="my-route"
        loading={isLoading}
        fallback={<MyRouteLoader />}
      >
        {noPendingRoute ? (
          <EmptyRouteState />
        ) : isError || !routeData ? (
          <NotRouteFound />
        ) : (
          <div className="flex flex-col gap-6">
            <MyRouteHeader />

            <RouteProgress />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
              <RouteStopsList
                selectedStopId={selectedStopId}
                onSelectStop={selectStop}
              />

              <div ref={mapPanelRef}>
                <RouteMapPanel selectedStopId={selectedStopId} />
              </div>
            </div>
          </div>
        )}
      </Skeleton>
    </div>
  );
}
