import { useCallback, useRef, useState } from "react";
import { useHereMaps } from "../../../hooks/useHereMaps";
import type {
  DriverNavigationProps,
  NavigationMetrics,
  NavigationPosition,
} from "../types";
import {
  ACTION_RADIUS_M,
  ARRIVAL_RADIUS_M,
  buildNavigationMetrics,
  getGeolocationErrorMessage,
  haversineDistanceMeters,
} from "../utils/navigationMetrics";
import { focusMapOnPosition } from "../utils/navigationMap";
import { useDriverRouteMap } from "./useDriverRouteMap";
import { useNavigationVoice } from "./useNavigationVoice";

const EMPTY_METRICS: NavigationMetrics = {
  remainingDistanceMeters: null,
  distanceToNextActionMeters: null,
  speedKmh: null,
  accuracyMeters: null,
  eta: null,
};

export function useDriverNavigation({
  origin,
  destination,
}: DriverNavigationProps) {
  const { loaded, error: hereMapsError } = useHereMaps();
  const watchRef = useRef<number | null>(null);
  const currentPositionRef = useRef<NavigationPosition | null>(null);
  const { speak, toggleVoice, voiceEnabled } = useNavigationVoice();

  const [navigating, setNavigating] = useState(false);
  const [currentPosition, setCurrentPosition] =
    useState<NavigationPosition | null>(null);
  const [metrics, setMetrics] = useState<NavigationMetrics>(EMPTY_METRICS);

  const hereApiKey = process.env.NEXT_PUBLIC_HERE_API_KEY ?? "";
  const setupError = !hereApiKey
    ? "HERE API key ez dago konfiguratuta."
    : hereMapsError
      ? "HERE mapa ezin izan da kargatu."
      : null;

  const stopWatchingPosition = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  }, []);

  const {
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
  } = useDriverRouteMap({
    destination,
    hereApiKey,
    loaded,
    origin,
    stopWatchingPosition,
  });

  const currentAction = actions[currentActionIndex] ?? null;
  const nextAction = actions[currentActionIndex + 1] ?? null;
  const displayedRouteLoading = setupError ? false : routeLoading;
  const displayedNavigationError = setupError ?? navigationError;
  const isRouteReady =
    !setupError && actions.length > 0 && summary != null && !routeLoading;

  function startNavigation(): void {
    if (!("geolocation" in navigator)) {
      setNavigationError("Este navegador no soporta geolocalizacion.");
      return;
    }
    if (actionsRef.current.length === 0) return;

    setNavigationError(null);
    setNavigating(true);
    setCurrentActionIndexSafe(0, false);
    speak(actionsRef.current[0].instruction);

    stopWatchingPosition();
    watchRef.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (error) => setNavigationError(getGeolocationErrorMessage(error)),
      { enableHighAccuracy: true, maximumAge: 500, timeout: 8000 }
    );
  }

  function stopNavigation(): void {
    setNavigating(false);
    stopWatchingPosition();
  }

  function recenter(): void {
    const position = currentPositionRef.current;
    if (!position || !mapInstance.current) return;
    focusMapOnPosition(mapInstance.current.map, position, true);
  }

  function handlePositionUpdate(pos: GeolocationPosition): void {
    const { latitude: lat, longitude: lng, heading, speed, accuracy } =
      pos.coords;
    const position: NavigationPosition = {
      coords: { lat, lng },
      accuracy: accuracy ?? null,
      heading: heading ?? null,
      speed: speed ?? null,
      timestamp: pos.timestamp,
    };

    currentPositionRef.current = position;
    setCurrentPosition(position);
    updateNavigationMetrics(position);
    updateCurrentAction(position.coords);

    if (!mapInstance.current) return;
    mapInstance.current.driverMarker.setGeometry(position.coords);
    focusMapOnPosition(mapInstance.current.map, position, true);
  }

  function updateNavigationMetrics(position: NavigationPosition): void {
    const current = actionsRef.current[currentActionIndexRef.current];
    const distanceToNextActionMeters = current?.coords
      ? haversineDistanceMeters(position.coords, current.coords)
      : null;

    setMetrics(
      buildNavigationMetrics({
        destination,
        distanceToNextActionMeters,
        position,
        summary: summaryRef.current,
      })
    );
  }

  function updateCurrentAction(coords: NavigationPosition["coords"]): void {
    const routeActions = actionsRef.current;
    if (routeActions.length === 0) return;

    if (haversineDistanceMeters(coords, destination) <= ARRIVAL_RADIUS_M) {
      setCurrentActionIndexSafe(routeActions.length - 1, true);
      stopNavigation();
      return;
    }

    const currentIndex = currentActionIndexRef.current;
    const current = routeActions[currentIndex];
    if (!current?.coords || currentIndex >= routeActions.length - 1) return;

    if (haversineDistanceMeters(coords, current.coords) <= ACTION_RADIUS_M) {
      setCurrentActionIndexSafe(currentIndex + 1, true);
    }
  }

  function setCurrentActionIndexSafe(index: number, shouldSpeak: boolean): void {
    const maxIndex = actionsRef.current.length - 1;
    const nextIndex = Math.max(0, Math.min(index, maxIndex));
    if (nextIndex === currentActionIndexRef.current && index !== 0) return;

    currentActionIndexRef.current = nextIndex;
    setCurrentActionIndex(nextIndex);

    const action = actionsRef.current[nextIndex];
    if (shouldSpeak && action) speak(action.instruction);
  }

  return {
    mapRef,
    navigating,
    routeLoading: displayedRouteLoading,
    navigationError: displayedNavigationError,
    currentAction,
    nextAction,
    summary,
    metrics,
    currentPosition,
    voiceEnabled,
    isRouteReady,
    startNavigation,
    stopNavigation,
    toggleVoice,
    recenter,
  };
}
