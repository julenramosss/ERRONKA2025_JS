import type { Coords, NavigationMetrics, NavigationPosition } from "../types";

export const ARRIVAL_RADIUS_M = 45;
export const ACTION_RADIUS_M = 35;

export function buildNavigationMetrics({
  destination,
  distanceToNextActionMeters,
  position,
  summary,
}: {
  destination: Coords;
  distanceToNextActionMeters: number | null;
  position: NavigationPosition;
  summary: { duration: number; length: number } | null;
}): NavigationMetrics {
  const remainingDistanceMeters = haversineDistanceMeters(
    position.coords,
    destination
  );
  const speedKmh =
    position.speed != null && position.speed >= 0
      ? position.speed * 3.6
      : null;
  const remainingDurationSeconds =
    summary && summary.length > 0
      ? summary.duration *
        Math.min(1, remainingDistanceMeters / summary.length)
      : null;

  return {
    remainingDistanceMeters,
    distanceToNextActionMeters,
    speedKmh,
    accuracyMeters: position.accuracy,
    eta:
      remainingDurationSeconds != null
        ? new Date(Date.now() + remainingDurationSeconds * 1000)
        : null,
  };
}

export function getNavigationZoom(speed: number | null): number {
  if (speed == null || speed < 0) return 17;
  if (speed > 16) return 15;
  if (speed > 5) return 16;
  return 17;
}

export function getGeolocationErrorMessage(
  error: GeolocationPositionError
): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "Permiso de ubicacion denegado.";
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return "No se ha podido obtener tu ubicacion.";
  }
  if (error.code === error.TIMEOUT) {
    return "La ubicacion esta tardando demasiado.";
  }
  return "Error de geolocalizacion.";
}

export function haversineDistanceMeters(a: Coords, b: Coords): number {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) *
      Math.cos(toRadians(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
