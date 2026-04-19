export interface StopOrderItem {
  stop_id: number;
  order_index: number;
}

export interface ReorderDto {
  route_id: number;
  stops: StopOrderItem[];
}

export interface ReorderedStop {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: string | null;
  actual_arrival: string | null;
}
