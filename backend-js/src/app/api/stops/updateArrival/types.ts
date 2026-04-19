export interface UpdateArrivalDto {
  stop_id: number;
}

export interface StopWithRoute {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  route_user_id: number;
}

export interface UpdatedStop {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
}
