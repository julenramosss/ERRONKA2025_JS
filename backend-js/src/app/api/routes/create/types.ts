export interface CreateRouteDto {
  user_id: number;
  date: string;
  package_ids: number[];
}

export interface PackageAddressRow {
  id: number;
  recipient_name: string;
  status: string;
  assigned_to: number;
  lat: number;
  lng: number;
  street: string;
  city: string;
}

export interface RouteResult {
  id: number;
  user_id: number;
  route_date: string;
  status: string;
  created_at: Date;
}

export interface StopResult {
  id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  package: {
    recipient_name: string;
    address: { street: string; city: string; lat: number; lng: number };
  };
}

export interface CreateRouteResult {
  route: RouteResult;
  stops: StopResult[];
  meta: { totalStops: number; totalDistanceKm: number; totalDurationMin: number };
}
