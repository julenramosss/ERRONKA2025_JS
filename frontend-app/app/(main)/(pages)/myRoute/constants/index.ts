import type { RouteStatus } from "../../../../utils/types/api/route.types";

export const TERMINAL_PACKAGE_STATUSES = ["delivered", "failed"] as const;

export const ROUTE_STATUS_LABEL: Record<RouteStatus, string> = {
  planned: "Planifikatuta",
  in_progress: "Martxan",
  completed: "Amaituta",
};

export function isTerminalPackageStatus(status: string): boolean {
  return status === "delivered" || status === "failed";
}
