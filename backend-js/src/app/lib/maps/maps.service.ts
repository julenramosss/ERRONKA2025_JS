// TODO: implementar con Google Maps Directions API

export interface RouteStop {
  packageId: number;
  lat: number;
  lng: number;
}

export interface OptimizedStop extends RouteStop {
  order: number;
  estimatedArrival: string;
}

export interface OptimizedRoute {
  orderedStops: OptimizedStop[];
  totalDistanceKm: number;
  totalDurationMin: number;
}

export const mapsService = {
  async optimizeRoute(
    origin: { lat: number; lng: number },
    stops: RouteStop[]
  ): Promise<OptimizedRoute> {
    // TODO: https://maps.googleapis.com/maps/api/directions/json con waypoints optimize:true
    console.log("[stub] optimizeRoute", { origin, stopsCount: stops.length });
    return {
      orderedStops: stops.map((s, i) => ({
        ...s,
        order: i,
        estimatedArrival: new Date().toISOString(),
      })),
      totalDistanceKm: 0,
      totalDurationMin: 0,
    };
  },
};