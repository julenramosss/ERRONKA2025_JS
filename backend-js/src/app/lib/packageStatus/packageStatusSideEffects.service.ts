import {
  findPackagesByIds,
  insertStatusLogs,
} from "@/app/api/packages/updateStatus/repository/updateStatus.repo";
import {
  getDistributorName,
  getTrackingTokenByPackageId,
} from "@/app/api/packages/update/repository/updatePackage.repo";
import { NotFoundError } from "@/app/lib/errors";
import { sendPackageTrackingEmail } from "@/app/lib/email/sendPackageTrackingEmail";
import { tracking_base_url } from "@/app/config/envConfig";
import type {
  ApplyPackageStatusSideEffectsOptions,
  PackageStatusChange,
} from "./types";

export async function applyPackageStatusSideEffects(
  changes: PackageStatusChange[],
  changedBy: number,
  options: ApplyPackageStatusSideEffectsOptions = {}
): Promise<void> {
  if (changes.length === 0) return;

  await insertStatusLogs(
    changes.map((change) => ({
      packageId: change.packageId,
      oldStatus: change.oldStatus,
      newStatus: change.newStatus,
      changedBy,
    }))
  );

  const packageIds = [...new Set(changes.map((change) => change.packageId))];
  const packages = await findPackagesByIds(packageIds);
  if (packages.length !== packageIds.length) {
    throw new NotFoundError("One or more packages were not found");
  }

  const packagesById = new Map(packages.map((pkg) => [pkg.id, pkg]));

  const trackingEntries = await Promise.all(
    packageIds.map(async (packageId) => [
      packageId,
      await getTrackingTokenByPackageId(packageId),
    ] as const)
  );
  const trackingTokensById = new Map(trackingEntries);

  const distributorIds = [
    ...new Set(
      changes
        .map((change) => {
          const pkg = packagesById.get(change.packageId);
          return pkg?.assigned_to ?? options.defaultDistributorId ?? null;
        })
        .filter((value): value is number => value !== null)
    ),
  ];

  const distributorEntries = await Promise.all(
    distributorIds.map(async (distributorId) => [
      distributorId,
      await getDistributorName(distributorId),
    ] as const)
  );
  const distributorNamesById = new Map(distributorEntries);

  await Promise.all(
    changes.map(async (change) => {
      const pkg = packagesById.get(change.packageId);
      if (!pkg) {
        throw new NotFoundError(`Package ${change.packageId} not found`);
      }

      const distributorId = pkg.assigned_to ?? options.defaultDistributorId;
      const trackingToken = trackingTokensById.get(change.packageId);

      await sendPackageTrackingEmail({
        recipientEmail: pkg.recipient_email,
        recipientName: pkg.recipient_name,
        trackingUrl: trackingToken
          ? `${tracking_base_url}${trackingToken}`
          : undefined,
        packageStatus: change.newStatus,
        distributorName:
          distributorId !== null && distributorId !== undefined
            ? distributorNamesById.get(distributorId) ?? undefined
            : undefined,
        estimatedDelivery: pkg.estimated_delivery ?? undefined,
      });
    })
  );
}
