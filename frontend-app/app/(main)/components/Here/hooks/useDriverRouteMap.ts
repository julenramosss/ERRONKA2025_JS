import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MapInstanceRef,
  NavigationAction,
  RouteSummary,
  UseDriverRouteMapOptions,
} from "../types";
import { createRasterHereMap, enableMapBehavior } from "../utils/hereMapFactory";
import {
  addDriverMarkers,
  addRoutePolyline,
} from "../utils/navigationMap";
import { calculateNavigationRoute } from "../utils/navigationRoute";

export function useDriverRouteMap({
  destination,
  hereApiKey,
  loaded,
  origin,
  stopWatchingPosition,
}: UseDriverRouteMapOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapInstanceRef | null>(null);
  const actionsRef = useRef<NavigationAction[]>([]);
  const currentActionIndexRef = useRef(0);
  const summaryRef = useRef<RouteSummary | null>(null);

  const [routeLoading, setRouteLoading] = useState(true);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [actions, setActions] = useState<NavigationAction[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const { lat: originLat, lng: originLng } = origin;
  const { lat: destinationLat, lng: destinationLng } = destination;

  const clearRouteRefs = useCallback(() => {
    actionsRef.current = [];
    summaryRef.current = null;
    currentActionIndexRef.current = 0;
  }, []);

  const resetRouteState = useCallback(() => {
    setRouteLoading(true);
    setNavigationError(null);
    setActions([]);
    setCurrentActionIndex(0);
    setSummary(null);
    clearRouteRefs();
  }, [clearRouteRefs]);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    resetRouteState();
    if (!hereApiKey) {
      return;
    }

    const routeOrigin = { lat: originLat, lng: originLng };
    const routeDestination = { lat: destinationLat, lng: destinationLng };
    const instance = createRasterHereMap({
      apiKey: hereApiKey,
      center: routeOrigin,
      container: mapRef.current,
      zoom: 15,
    });

    if (!instance) {
      Promise.resolve().then(() => {
        setNavigationError("HERE mapa ezin izan da kargatu.");
        setRouteLoading(false);
      });
      return;
    }

    let disposed = false;
    const { map, platform } = instance;
    enableMapBehavior(map);

    const driverMarker = addDriverMarkers({
      destination: routeDestination,
      map,
      origin: routeOrigin,
    });
    const resizeObserver = new ResizeObserver(() => map.getViewPort().resize());
    resizeObserver.observe(mapRef.current);
    mapInstance.current = { map, driverMarker, resizeObserver };

    calculateNavigationRoute({
      destination: routeDestination,
      origin: routeOrigin,
      platform,
    })
      .then((route) => {
        if (disposed) return;
        actionsRef.current = route.actions;
        summaryRef.current = route.summary;
        setActions(route.actions);
        setSummary(route.summary);
        setRouteLoading(false);
        addRoutePolyline(map, route.lineString);
      })
      .catch(() => {
        if (disposed) return;
        setNavigationError("No se ha podido calcular la ruta.");
        setRouteLoading(false);
      });

    return () => {
      disposed = true;
      stopWatchingPosition();
      resizeObserver.disconnect();
      map.dispose();
      clearRouteRefs();
      mapInstance.current = null;
    };
  }, [
    clearRouteRefs,
    destinationLat,
    destinationLng,
    hereApiKey,
    loaded,
    originLat,
    originLng,
    resetRouteState,
    stopWatchingPosition,
  ]);

  return {
    actions,
    actionsRef,
    currentActionIndex,
    currentActionIndexRef,
    mapInstance,
    mapRef,
    navigationError,
    routeLoading,
    setCurrentActionIndex,
    setNavigationError,
    summary,
    summaryRef,
  };
}
