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

export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDateKey(value: string): string {
  return value.slice(0, 10);
}

export function formatRouteDate(value: string): string {
  return new Date(normalizeDateKey(value)).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatStopTime(value: string | null): string {
  if (!value) return "--:--";
  return value.slice(0, 5);
}
