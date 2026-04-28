import { RouteStatus } from '../updateStatus/types';

export interface PendingPastRouteRow {
  id: number;
  user_id: number;
  route_date: string;
  status: RouteStatus;
  pending_count: number;
  route_count: number;
}

export interface ContinueFromPastResult {
  route_id: number;
  new_route_date: string;
  migrated_stops: number;
}
