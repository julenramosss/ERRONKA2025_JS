import { ValidationError } from "@/app/lib/errors";
import { RouteStatus, UpdateRouteStatusDto } from "../types";

const ALLOWED_STATUSES: RouteStatus[] = ["in_progress", "completed"];

export function updateRouteStatusDto(
  routeIdRaw: string,
  body: unknown
): UpdateRouteStatusDto {
  const routeId = parseInt(routeIdRaw, 10);
  if (isNaN(routeId) || routeId < 1) {
    throw new ValidationError("routeId must be a positive integer");
  }

  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request body");
  }

  const { status } = body as Record<string, unknown>;

  if (
    typeof status !== "string" ||
    !ALLOWED_STATUSES.includes(status as RouteStatus)
  ) {
    throw new ValidationError("status must be 'in_progress' or 'completed'");
  }

  return { routeId, status: status as RouteStatus };
}
