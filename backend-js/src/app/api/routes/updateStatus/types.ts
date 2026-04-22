export interface UpdateRouteStatusDto {
  routeId: number;
  status: RouteStatus;
}

export interface RouteRow {
  id: number;
  user_id: number;
  status: RouteStatus;
  route_date: string;
}

export const ROUTE_STATUSES = {
  planned: "planned",
  in_progress: "in_progress",
  completed: "completed",
} as const;
export type RouteStatus = (typeof ROUTE_STATUSES)[keyof typeof ROUTE_STATUSES];
