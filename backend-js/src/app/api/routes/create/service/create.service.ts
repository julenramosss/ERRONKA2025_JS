import { mapsService } from "@/app/lib/maps/maps.service";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { CreateRouteDto, CreateRouteResult } from "../types";
import {
  findUserById,
  findRouteByUserAndDate,
  findPackagesWithAddresses,
  findCarryoverPackagesByUser,
  updatePackagesStatusToAssigned,
  insertRoute,
  insertRouteStops,
  findRouteById,
  findStopsByRouteId,
  updatePackagesEstimatedDelivery,
} from "../repository/create.repository";

const PAKAG_ORIGIN = { lat: 43.2691, lng: -2.0 };

export async function createRouteService(
  dto: CreateRouteDto
): Promise<CreateRouteResult> {
  const user = await findUserById(dto.user_id);
  if (!user) throw new NotFoundError(`User ${dto.user_id} not found`);
  if (user.role !== "distributor") {
    throw new ValidationError("user_id must belong to a distributor");
  }

  const existing = await findRouteByUserAndDate(dto.user_id, dto.date);
  if (existing) {
    throw new ConflictError(
      `Route already exists for user ${dto.user_id} on ${dto.date}`
    );
  }

  const carryoverPackages = await findCarryoverPackagesByUser(
    dto.user_id,
    dto.date
  );
  const carryoverIds = carryoverPackages.map((p) => p.id);
  const allPackageIds = [...new Set([...dto.package_ids, ...carryoverIds])];

  if (carryoverIds.length > 0) {
    await updatePackagesStatusToAssigned(carryoverIds);
  }

  const packages = await findPackagesWithAddresses(allPackageIds);

  if (packages.length !== allPackageIds.length) {
    throw new NotFoundError("One or more package_ids do not exist");
  }

  for (const pkg of packages) {
    if (pkg.status !== "assigned") {
      throw new ValidationError(
        `Package ${pkg.id} is not in 'assigned' status`
      );
    }
    if (pkg.assigned_to !== dto.user_id) {
      throw new ValidationError(
        `Package ${pkg.id} is not assigned to user ${dto.user_id}`
      );
    }
  }

  const routeStops = packages.map((pkg) => ({
    packageId: pkg.id,
    lat: Number(pkg.lat),
    lng: Number(pkg.lng),
  }));

  const optimized = await mapsService.optimizeRoute(PAKAG_ORIGIN, routeStops);

  const routeId = await insertRoute(dto.user_id, dto.date);

  const stopsToInsert = optimized.orderedStops.map((s) => ({
    packageId: s.packageId,
    stopOrder: s.order + 1,
    estimatedArrival: new Date(s.estimatedArrival).toISOString().slice(11, 19),
  }));

  await insertRouteStops(routeId, stopsToInsert, {
    movePackageIds: carryoverIds,
    routeDate: dto.date,
  });

  const deliveryUpdates = optimized.orderedStops.map((s) => ({
    packageId: s.packageId,
    estimatedDelivery: new Date(s.estimatedArrival).toISOString().slice(0, 10),
  }));
  await updatePackagesEstimatedDelivery(deliveryUpdates);

  const route = await findRouteById(routeId);
  const stopDetails = await findStopsByRouteId(routeId);

  const stops = stopDetails.map((s) => ({
    id: s.id,
    package_id: s.package_id,
    stop_order: s.stop_order,
    estimated_arrival: s.estimated_arrival,
    package: {
      recipient_name: s.recipient_name,
      address: {
        street: s.street,
        city: s.city,
        lat: Number(s.lat),
        lng: Number(s.lng),
      },
    },
  }));

  return {
    route: route!,
    stops,
    meta: {
      totalStops: stops.length,
      totalDistanceKm: optimized.totalDistanceKm,
      totalDurationMin: optimized.totalDurationMin,
    },
  };
}
