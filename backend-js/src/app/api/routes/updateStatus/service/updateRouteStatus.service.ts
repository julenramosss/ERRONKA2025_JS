import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { AccessTokenPayload } from "@/app/lib/types";
import { USER_ROLES } from "@/app/types";
import {
  checkPackageStatus,
  findRouteById,
  migratePastPendingStopsIntoRoute,
  setRoutePendingPackagesInTransit,
  setRouteStatus,
} from "../repository/updateRouteStatus.repo";
import { ROUTE_STATUSES, RouteStatus, UpdateRouteStatusDto } from "../types";

const VALID_TRANSITIONS: Record<RouteStatus, RouteStatus | null> = {
  planned: ROUTE_STATUSES.in_progress,
  in_progress: ROUTE_STATUSES.completed,
  completed: null,
};

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

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

  if (
    route.status === ROUTE_STATUSES.planned &&
    dto.status === ROUTE_STATUSES.in_progress &&
    route.route_date !== todayIso()
  ) {
    throw new ValidationError(
      `Route can only be started on its scheduled day (${route.route_date})`
    );
  }

  await setRouteStatus(dto.routeId, dto.status);

  if (
    route.status === ROUTE_STATUSES.planned &&
    dto.status === ROUTE_STATUSES.in_progress
  ) {
    await migratePastPendingStopsIntoRoute(route.user_id, route.id);
    await setRoutePendingPackagesInTransit(route.id);
  }

  if (dto.status === ROUTE_STATUSES.completed) {
    await checkPackageStatus(route.id);
  }
}
