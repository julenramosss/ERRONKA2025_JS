// src/lib/maps/maps.service.ts

import { directions_api_key } from "@/app/config/envConfig";
import { OptimizedRoute, RouteStop } from "./types";

const DIRECTIONS_BASE = "https://maps.googleapis.com/maps/api/directions/json";

export const mapsService = {
  async optimizeRoute(
    origin: { lat: number; lng: number },
    stops: RouteStop[]
  ): Promise<OptimizedRoute> {
    if (stops.length === 0) {
      return { orderedStops: [], totalDistanceKm: 0, totalDurationMin: 0 };
    }

    // Con 1 sola parada no hace falta optimizar
    if (stops.length === 1) {
      return {
        orderedStops: [
          { ...stops[0], order: 0, estimatedArrival: new Date().toISOString() },
        ],
        totalDistanceKm: 0,
        totalDurationMin: 0,
      };
    }

    const originStr = `${origin.lat},${origin.lng}`;

    // La última parada es el destination, el resto son waypoints
    const last = stops[stops.length - 1];
    const middle = stops.slice(0, -1);

    const waypointsStr =
      "optimize:true|" + middle.map((s) => `${s.lat},${s.lng}`).join("|");

    const url = new URL(DIRECTIONS_BASE);
    url.searchParams.set("origin", originStr);
    url.searchParams.set("destination", `${last.lat},${last.lng}`);
    url.searchParams.set("waypoints", waypointsStr);
    url.searchParams.set("departure_time", "now"); // tráfico en tiempo real
    url.searchParams.set("key", directions_api_key);

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Google Maps API HTTP error: ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "OK") {
      throw new Error(
        `Google Maps Directions error: ${data.status} — ${data.error_message ?? ""}`
      );
    }

    const route = data.routes[0];
    // waypoint_order solo aplica a los middle stops (sin origin ni destination)
    const optimizedOrder: number[] = route.waypoint_order;

    // Reconstruimos el orden final: middle reordenados + last al final
    const reorderedMiddle = optimizedOrder.map((i) => middle[i]);
    const finalStops = [...reorderedMiddle, last];

    // Calculamos tiempos acumulados desde ahora
    let accumulatedSeconds = 0;
    const now = Date.now();

    const orderedStops: OptimizedRoute["orderedStops"] = finalStops.map(
      (stop, idx) => {
        const leg = route.legs[idx];
        accumulatedSeconds +=
          leg.duration_in_traffic?.value ?? leg.duration.value;

        return {
          ...stop,
          order: idx,
          estimatedArrival: new Date(
            now + accumulatedSeconds * 1000
          ).toISOString(),
        };
      }
    );

    const totalDurationMin = Math.round(
      route.legs.reduce(
        (
          acc: number,
          leg: {
            duration_in_traffic?: { value: number };
            duration: { value: number };
          }
        ) => acc + (leg.duration_in_traffic?.value ?? leg.duration.value),
        0
      ) / 60
    );

    const totalDistanceKm = parseFloat(
      (
        route.legs.reduce(
          (acc: number, leg: { distance: { value: number } }) =>
            acc + leg.distance.value,
          0
        ) / 1000
      ).toFixed(2)
    );

    return { orderedStops, totalDistanceKm, totalDurationMin };
  },

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const GEOCODING_BASE = "https://maps.googleapis.com/maps/api/geocode/json";

    const url = new URL(GEOCODING_BASE);
    url.searchParams.set("address", address);
    url.searchParams.set("key", directions_api_key);

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Google Geocoding API HTTP error: ${res.status}`);
    }

    const data = await res.json();

    if (data.status === "ZERO_RESULTS") {
      throw new Error(`Dirección no encontrada: "${address}"`);
    }

    if (data.status !== "OK") {
      throw new Error(
        `Google Geocoding error: ${data.status} — ${data.error_message ?? ""}`
      );
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  },
};
