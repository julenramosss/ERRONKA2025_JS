import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { applyPackageStatusSideEffects } from "@/app/lib/packageStatus/packageStatusSideEffects.service";
import { PackageStatus } from "@/app/types";
import {
  countBlockingPreviousStops,
  findPackageById,
  findPackagesByIds,
  findRouteStatusByPackageId,
  updatePackageStatus,
  updatePackagesStatus,
} from "../repository/updateStatus.repo";
import { PackageWithAddress, UpdateStatusDto } from "../types";

const VALID_TRANSITIONS: Record<PackageStatus, PackageStatus[]> = {
  assigned: ["in_transit"],
  in_transit: ["delivered", "failed", "undelivered"],
  pending: [],
  delivered: [],
  undelivered: [],
  failed: [],
};

export async function updateStatusService(
  dto: UpdateStatusDto,
  userId: number
): Promise<PackageWithAddress | PackageWithAddress[]> {
  if (dto.package_ids) {
    return updateManyStatuses(dto.package_ids, dto.new_status, userId);
  }

  if (!dto.package_id) {
    throw new ValidationError("package_id must be a positive integer");
  }

  return updateOneStatus(dto.package_id, dto.new_status, userId);
}

async function updateOneStatus(
  packageId: number,
  newStatus: PackageStatus,
  userId: number
): Promise<PackageWithAddress> {
  const pkg = await findPackageById(packageId);
  if (!pkg) throw new NotFoundError("Package not found");

  if (pkg.assigned_to !== userId) throw new ForbiddenError("Access denied");

  const allowed = VALID_TRANSITIONS[pkg.status];
  if (!allowed.includes(newStatus)) {
    throw new ValidationError(
      `Invalid status transition from '${pkg.status}' to '${newStatus}'`
    );
  }

  await assertRouteIsInProgress(packageId, userId);
  await assertRouteOrderAllowsStatus(packageId, newStatus, userId);

  await updatePackageStatus(packageId, newStatus);
  await applyPackageStatusSideEffects(
    [{ packageId, oldStatus: pkg.status, newStatus }],
    userId
  );

  const updated = await findPackageById(packageId);
  return updated!;
}

async function updateManyStatuses(
  packageIds: number[],
  newStatus: PackageStatus,
  userId: number
): Promise<PackageWithAddress[]> {
  const packages = await findPackagesByIds(packageIds);
  if (packages.length !== packageIds.length) {
    throw new NotFoundError("One or more packages were not found");
  }

  const packageById = new Map(packages.map((pkg) => [pkg.id, pkg]));
  const orderedPackages = packageIds.map((id) => packageById.get(id)!);

  for (const pkg of orderedPackages) {
    if (pkg.assigned_to !== userId) throw new ForbiddenError("Access denied");

    const allowed = VALID_TRANSITIONS[pkg.status];
    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Invalid status transition from '${pkg.status}' to '${newStatus}'`
      );
    }

    await assertRouteIsInProgress(pkg.id, userId);
    await assertRouteOrderAllowsStatus(pkg.id, newStatus, userId);
  }

  await updatePackagesStatus(packageIds, newStatus);
  await applyPackageStatusSideEffects(
    orderedPackages.map((pkg) => ({
      packageId: pkg.id,
      oldStatus: pkg.status,
      newStatus,
    })),
    userId
  );

  const updated = await findPackagesByIds(packageIds);
  const updatedById = new Map(updated.map((pkg) => [pkg.id, pkg]));
  return packageIds.map((id) => updatedById.get(id)!);
}

async function assertRouteIsInProgress(
  packageId: number,
  userId: number
): Promise<void> {
  const routeStatus = await findRouteStatusByPackageId(packageId, userId);
  if (!routeStatus) {
    throw new ValidationError("Package is not attached to any route of yours");
  }
  if (routeStatus !== "in_progress") {
    throw new ValidationError(
      `Route must be in progress to update packages (current: '${routeStatus}')`
    );
  }
}

async function assertRouteOrderAllowsStatus(
  packageId: number,
  newStatus: PackageStatus,
  userId: number
): Promise<void> {
  if (newStatus !== "delivered" && newStatus !== "failed") return;

  const blockingStops = await countBlockingPreviousStops(packageId, userId);
  if (blockingStops > 0) {
    throw new ValidationError(
      "Previous route stops must be completed before updating this package"
    );
  }
}
