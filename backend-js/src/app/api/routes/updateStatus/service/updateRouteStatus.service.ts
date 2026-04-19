import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { AccessTokenPayload } from "@/app/lib/types";
import { USER_ROLES } from "@/app/types";
import {
  findRouteById,
  setRouteStatus,
} from "../repository/updateRouteStatus.repo";
import { RouteStatus, UpdateRouteStatusDto } from "../types";

const VALID_TRANSITIONS: Record<RouteStatus, RouteStatus | null> = {
  planned: "in_progress",
  in_progress: "completed",
  completed: null,
};

export async function updateRouteStatusService(
  dto: UpdateRouteStatusDto,
  caller: AccessTokenPayload
): Promise<void> {
  const route = await findRouteById(dto.routeId);
  if (!route) throw new NotFoundError("Route not found");

  if (caller.role === USER_ROLES.distributor && route.user_id !== caller.sub) {
    throw new ForbiddenError("You can only update your own routes");
  }

  const allowedNext = VALID_TRANSITIONS[route.status];
  if (dto.status !== allowedNext) {
    throw new ValidationError(
      `Cannot transition from '${route.status}' to '${dto.status}'. Expected '${allowedNext ?? "nothing (already completed)"}'`
    );
  }

  await setRouteStatus(dto.routeId, dto.status);
}
