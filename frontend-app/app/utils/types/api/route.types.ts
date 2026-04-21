import type { ApiDateString, ApiTimeString } from "./common.types";
import type { PackageStatus } from "./package.types";

export type RouteStatus = "planned" | "in_progress" | "completed";
export type UpdatableRouteStatus = Extract<
  RouteStatus,
  "in_progress" | "completed"
>;

export interface RouteSummary {
  id: number;
  route_date: ApiDateString;
  status: RouteStatus;
}

export interface RouteStopPackageAddress {
  street: string;
  city: string;
  lat: number;
  lng: number;
}

export interface RouteStopPackage {
  id: number;
  recipient_name: string;
  status: PackageStatus;
  address: RouteStopPackageAddress;
}

export interface RouteStop {
  id: number;
  stop_order: number;
  estimated_arrival: ApiTimeString | null;
  actual_arrival: ApiTimeString | null;
  package: RouteStopPackage;
}

export interface GetMyDailyRouteResponse {
  route: RouteSummary;
  stops: RouteStop[];
}

export interface UpdateRouteStatusRequest {
  status: UpdatableRouteStatus;
}

export interface UpdateRouteStatusResponse {
  message: string;
}

export interface UpdateArrivalRequest {
  stop_id: number;
}

export interface UpdateArrivalResponse {
  id: number;
  route_id: number;
  package_id: number;
  stop_order: number;
  estimated_arrival: ApiTimeString | null;
  actual_arrival: ApiTimeString | null;
}
