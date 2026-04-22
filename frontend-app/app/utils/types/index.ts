export const USER_ROLES = {
  admin: "admin",
  distributor: "distributor",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const STATUS_LABEL: Record<PackageStatus, string> = {
  pending: "Zain",
  assigned: "Esleituta",
  in_transit: "Garraioan",
  delivered: "Entregatuta",
  undelivered: "Ez entregatua",
  failed: "Huts",
};

export const PACKAGE_STATUSES = {
  pending: "pending",
  assigned: "assigned",
  in_transit: "in_transit",
  delivered: "delivered",
  undelivered: "undelivered",
  failed: "failed",
} as const;
export type PackageStatus =
  (typeof PACKAGE_STATUSES)[keyof typeof PACKAGE_STATUSES];

export interface RouteRow {
  id: number;
  user_id: number;
  status: RouteStatus;
}

export const ROUTE_STATUSES = {
  planned: "planned",
  in_progress: "in_progress",
  completed: "completed",
} as const;
export type RouteStatus = (typeof ROUTE_STATUSES)[keyof typeof ROUTE_STATUSES];
