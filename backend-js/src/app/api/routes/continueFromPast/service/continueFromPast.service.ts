import { PACKAGE_STATUSES } from "@/app/types";
import { ConflictError, NotFoundError } from "@/app/lib/errors";
import { applyPackageStatusSideEffects } from "@/app/lib/packageStatus/packageStatusSideEffects.service";
import {
  migratePastPendingStopsIntoRoute,
  setRoutePendingPackagesInTransit,
} from "../../updateStatus/repository/updateRouteStatus.repo";
import {
  clearStopArrivalsForPendingPackages,
  findLatestPastPendingRoute,
  findTodayRoute,
  insertTodayRetryRoute,
  setRouteInProgress,
} from "../repository/continueFromPast.repo";
import { ContinueFromPastResult, PendingPastRouteRow } from "../types";

function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function findPendingPastRouteForUser(
  userId: number
): Promise<PendingPastRouteRow | null> {
  return findLatestPastPendingRoute(userId);
}

export async function continueFromPastService(
  userId: number
): Promise<ContinueFromPastResult> {
  const todayRoute = await findTodayRoute(userId);
  if (
    todayRoute?.status === "planned" ||
    todayRoute?.status === "in_progress"
  ) {
    throw new ConflictError("You already have an active route for today");
  }

  const past = await findLatestPastPendingRoute(userId);
  if (!past) {
    throw new NotFoundError("No past route with undelivered packages");
  }

  const routeId = todayRoute?.id ?? (await insertTodayRetryRoute(userId));

  if (todayRoute?.status === "completed") {
    await setRouteInProgress(routeId);
  }

  const migratedStops = await migratePastPendingStopsIntoRoute(userId, routeId);
  const inTransitChanges = await setRoutePendingPackagesInTransit(routeId);
  await applyPackageStatusSideEffects(
    inTransitChanges.map((pkg) => ({
      packageId: pkg.id,
      oldStatus: pkg.old_status,
      newStatus: PACKAGE_STATUSES.in_transit,
    })),
    userId
  );
  await clearStopArrivalsForPendingPackages(routeId);

  return {
    route_id: routeId,
    new_route_date: todayIso(),
    migrated_stops: migratedStops,
  };
}
