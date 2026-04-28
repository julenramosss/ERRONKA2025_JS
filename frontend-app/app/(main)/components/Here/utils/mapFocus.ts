import type { AnimationFrameRef, Coordinates } from '../types';
import {
  MAP_FOCUS_ANIMATION_MS,
  MAP_FOCUS_OUT_PHASE,
  MAP_FOCUS_OUT_ZOOM,
  MAP_ZOOM,
} from './mapConstants';
import { easeInOutCubic, easeOutCubic, lerp } from './math';

export function focusMapOnCoordinates(
  map: HereMapsMap,
  coords: Coordinates,
  animate: boolean,
  zoom = MAP_ZOOM
) {
  map.getViewModel().setLookAtData(
    {
      position: coords,
      zoom,
      tilt: 0,
      heading: 0,
    },
    animate
  );

  if (typeof map.setRotation === 'function') {
    map.setRotation(0, false);
  }
}

export function animateMapToCoordinates(
  map: HereMapsMap,
  from: Coordinates,
  to: Coordinates,
  animationFrameRef: AnimationFrameRef,
  onComplete: () => void
) {
  if (animationFrameRef.current != null) {
    cancelAnimationFrame(animationFrameRef.current);
  }

  if (from.lat === to.lat && from.lng === to.lng) {
    focusMapOnCoordinates(map, to, false);
    animationFrameRef.current = null;
    onComplete();
    return;
  }

  const start = performance.now();

  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - start) / MAP_FOCUS_ANIMATION_MS, 1);
    const isFocusOut = progress < MAP_FOCUS_OUT_PHASE;
    const phaseProgress = isFocusOut
      ? progress / MAP_FOCUS_OUT_PHASE
      : (progress - MAP_FOCUS_OUT_PHASE) / (1 - MAP_FOCUS_OUT_PHASE);
    const easedProgress = isFocusOut
      ? easeOutCubic(phaseProgress)
      : easeInOutCubic(phaseProgress);
    const zoom = isFocusOut
      ? lerp(MAP_ZOOM, MAP_FOCUS_OUT_ZOOM, easedProgress)
      : lerp(MAP_FOCUS_OUT_ZOOM, MAP_ZOOM, easedProgress);
    const positionProgress = isFocusOut ? 0 : easedProgress;

    focusMapOnCoordinates(
      map,
      {
        lat: lerp(from.lat, to.lat, positionProgress),
        lng: lerp(from.lng, to.lng, positionProgress),
      },
      false,
      zoom
    );

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(step);
      return;
    }

    animationFrameRef.current = null;
    focusMapOnCoordinates(map, to, false);
    onComplete();
  };

  animationFrameRef.current = requestAnimationFrame(step);
}
