import { ValidationError } from "@/app/lib/errors";
import { RouteStatus, UpdateRouteStatusDto } from "../types";
import { isValidRoute } from "../../../../lib/dto";
import { AccessTokenPayload } from "../../../../lib/types";

const ALLOWED_STATUSES: RouteStatus[] = ["in_progress", "completed"];

export async function updateRouteStatusDto(
  routeIdRaw: string,
  caller: AccessTokenPayload,
  body: unknown
): Promise<UpdateRouteStatusDto> {
  const routeId = parseInt(routeIdRaw, 10);
  if (isNaN(routeId) || routeId < 1) {
    throw new ValidationError("routeId must be a positive integer");
  }

  if (!(await isValidRoute(routeId, caller))) {
    throw new ValidationError(
      "routeId does not correspond to an existing route"
    );
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
