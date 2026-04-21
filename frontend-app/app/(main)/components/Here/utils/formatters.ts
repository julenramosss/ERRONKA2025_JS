export function formatClock(date: Date): string {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSpeed(speedKmh: number | null): string {
  if (speedKmh == null) return "--";
  return `${Math.round(speedKmh)} km/h`;
}

export function formatAccuracy(accuracyMeters: number | null): string {
  if (accuracyMeters == null) return "--";
  return `+/- ${Math.round(accuracyMeters)} m`;
}

export function formatDistance(meters?: number | null): string {
  if (meters == null) return "--";
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}
