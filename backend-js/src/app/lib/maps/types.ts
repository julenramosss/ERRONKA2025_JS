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
