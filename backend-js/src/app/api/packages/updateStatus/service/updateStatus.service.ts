import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { PackageStatus, SendPackageTrackingEmailParams } from "@/app/types";
import {
  findPackageById,
  findPackagesByIds,
  insertStatusLog,
  insertStatusLogs,
  countBlockingPreviousStops,
  updatePackageStatus,
  updatePackagesStatus,
} from "../repository/updateStatus.repo";
import {
  getDistributorName,
  getTrackingTokenByPackageId,
} from "../../update/repository/updatePackage.repo";
import { PackageWithAddress, UpdateStatusDto } from "../types";
import { sendPackageTrackingEmail } from "@/app/lib/email/sendPackageTrackingEmail";
import { tracking_base_url } from "@/app/config/envConfig";

const VALID_TRANSITIONS: Record<PackageStatus, PackageStatus[]> = {
  assigned: ["in_transit"],
  in_transit: ["delivered", "failed"],
  pending: [],
  delivered: [],
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

  await assertRouteOrderAllowsStatus(packageId, newStatus, userId);

  await updatePackageStatus(packageId, newStatus);
  await insertStatusLog(packageId, pkg.status, newStatus, userId);

  await sendStatusEmail(pkg, newStatus, userId);

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

    await assertRouteOrderAllowsStatus(pkg.id, newStatus, userId);
  }

  await updatePackagesStatus(packageIds, newStatus);
  await insertStatusLogs(
    orderedPackages.map((pkg) => ({
      packageId: pkg.id,
      oldStatus: pkg.status,
      newStatus,
      changedBy: userId,
    }))
  );

  await Promise.all(
    orderedPackages.map((pkg) => sendStatusEmail(pkg, newStatus, userId))
  );

  const updated = await findPackagesByIds(packageIds);
  const updatedById = new Map(updated.map((pkg) => [pkg.id, pkg]));
  return packageIds.map((id) => updatedById.get(id)!);
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

async function sendStatusEmail(
  pkg: PackageWithAddress,
  newStatus: PackageStatus,
  userId: number
): Promise<void> {
  const trackingToken = await getTrackingTokenByPackageId(pkg.id);
  const distributorName = await getDistributorName(userId);
  const trackingUrl = trackingToken
    ? `${tracking_base_url}${trackingToken}`
    : "";

  const emailParams: SendPackageTrackingEmailParams = {
    recipientEmail: pkg.recipient_email,
    recipientName: pkg.recipient_name,
    trackingUrl,
    packageStatus: newStatus,
    distributorName: distributorName || undefined,
    estimatedDelivery: pkg.estimated_delivery || undefined,
    deliveredAt:
      newStatus === "delivered" ? new Date().toLocaleString("en-GB") : undefined,
  };
  await sendPackageTrackingEmail(emailParams);
}
