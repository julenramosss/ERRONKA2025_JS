export type RouteStatus = "planned" | "in_progress" | "completed";

export interface UpdateRouteStatusDto {
  routeId: number;
  status: RouteStatus;
}

export interface RouteRow {
  id: number;
  user_id: number;
  status: RouteStatus;
}
