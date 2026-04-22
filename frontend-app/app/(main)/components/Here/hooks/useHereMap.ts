import { useEffect, useMemo, useRef } from "react";
import { Coordinates, HereMarker, UseHereMapOptions } from "../types";
import { useHereMaps } from "../../../hooks/useHereMaps";
import { MAP_ZOOM, PURPLE_PIN_SVG } from "../utils/mapConstants";
import { normalizeCoordinates } from "../utils/coordinates";
import {
  animateMapToCoordinates,
  focusMapOnCoordinates,
} from "../utils/mapFocus";
import {
  createRasterHereMap,
  enableMapBehavior,
} from "../utils/hereMapFactory";
import { HERE_API_KEY } from "../../../../config/envConfig";

export function useHereMap({ center }: UseHereMapOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<HereMapsMap | null>(null);
  const markerRef = useRef<HereMarker | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFocusedCoordsRef = useRef<Coordinates | null>(null);
  const { loaded } = useHereMaps();

  const coords = useMemo(
    () => normalizeCoordinates(center.lat, center.lng),
    [center.lat, center.lng]
  );
  const coordsRef = useRef<Coordinates | null>(null);

  const hasValidCoords = coords !== null;

  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    const initialCoords = coords;
    if (!loaded || !mapRef.current || !initialCoords || !HERE_API_KEY) return;

    const H = window.H as HereMapsNamespace | undefined;
    if (!H?.map) return;

    let disposed = false;

    const instance = createRasterHereMap({
      apiKey: HERE_API_KEY,
      center: initialCoords,
      container: mapRef.current,
      zoom: MAP_ZOOM,
    });
    if (!instance) return;

    const { map } = instance;
    enableMapBehavior(map);

    const icon = new H.map.Icon(PURPLE_PIN_SVG, {
      size: { w: 32, h: 40 },
      anchor: { x: 16, y: 40 },
    });

    const marker = new H.map.Marker(initialCoords, { icon });
    map.addObject(marker);

    mapInstanceRef.current = map;
    markerRef.current = marker;

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      map.getViewPort().resize();
      const latestCoords = coordsRef.current;
      if (latestCoords) focusMapOnCoordinates(map, latestCoords, false);
    });

    resizeObserver.observe(mapRef.current);
    resizeObserverRef.current = resizeObserver;

    requestAnimationFrame(() => {
      if (disposed) return;
      map.getViewPort().resize();
      focusMapOnCoordinates(map, initialCoords, false);
      lastFocusedCoordsRef.current = initialCoords;
    });

    return () => {
      disposed = true;
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      markerRef.current = null;
      mapInstanceRef.current = null;
      lastFocusedCoordsRef.current = null;
      map.dispose();
    };
  }, [HERE_API_KEY, loaded, hasValidCoords]);

  useEffect(() => {
    if (!coords || !mapInstanceRef.current || !markerRef.current) return;

    mapInstanceRef.current.getViewPort().resize();
    markerRef.current.setGeometry(coords);
    animateMapToCoordinates(
      mapInstanceRef.current,
      lastFocusedCoordsRef.current ?? coords,
      coords,
      animationFrameRef,
      () => {
        lastFocusedCoordsRef.current = coords;
      }
    );

    requestAnimationFrame(() => {
      mapInstanceRef.current?.getViewPort().resize();
    });
  }, [coords]);

  return {
    mapRef,
    loaded,
    hasValidCoords,
  };
}
