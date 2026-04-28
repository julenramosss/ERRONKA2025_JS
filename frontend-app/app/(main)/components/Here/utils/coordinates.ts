import type { CoordinateValue, Coordinates } from '../types';

export function normalizeCoordinates(
  latInput: CoordinateValue,
  lngInput: CoordinateValue
): Coordinates | null {
  const lat = Number(latInput);
  const lng = Number(lngInput);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}
