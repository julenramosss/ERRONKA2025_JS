import {
  findPackagesByIds,
  insertStatusLogs,
} from '@/app/api/packages/updateStatus/repository/updateStatus.repo';
import {
  getDistributorName,
  getTrackingTokenByPackageId,
} from '@/app/api/packages/update/repository/updatePackage.repo';
import { NotFoundError } from '@/app/lib/errors';
import { sendPackageTrackingEmail } from '@/app/lib/email/sendPackageTrackingEmail';
import { tracking_base_url } from '@/app/config/envConfig';
import type { PackageStatusChange } from './types';

export async function applyPackageStatusSideEffects(
  changes: PackageStatusChange[],
  changedBy: number
): Promise<void> {
  if (changes.length === 0) return;

  await insertStatusLogs(
    [...changes].map((change) => ({
      changedBy,
      ...change,
    }))
  );

  const packageIds = [...new Set(changes.map((change) => change.packageId))];
  const packages = await findPackagesByIds(packageIds);
  if (packages.length !== packageIds.length) {
    throw new NotFoundError('One or more packages were not found');
  }

  const packagesById = new Map(packages.map((pkg) => [pkg.id, pkg]));

  const trackingEntries = await Promise.all(
    packageIds.map(
      async (packageId) =>
        [packageId, await getTrackingTokenByPackageId(packageId)] as const
    )
  );
  const trackingTokensById = new Map(trackingEntries);

  const distributorIds = [
    ...new Set(
      changes
        .map((change) => {
          const pkg = packagesById.get(change.packageId);
          return pkg?.assigned_to ?? null;
        })
        .filter((value): value is number => value !== null)
    ),
  ];

  const distributorEntries = await Promise.all(
    distributorIds.map(
      async (distributorId) =>
        [distributorId, await getDistributorName(distributorId)] as const
    )
  );
  const distributorNamesById = new Map(distributorEntries);

  await Promise.all(
    changes.map(async (change) => {
      const pkg = packagesById.get(change.packageId);
      if (!pkg) {
        throw new NotFoundError(`Package ${change.packageId} not found`);
      }

      const distributorId = pkg.assigned_to;
      const trackingToken = trackingTokensById.get(change.packageId);

      const rawDelivery = pkg.estimated_delivery as unknown;
      const estimatedDelivery =
        rawDelivery != null
          ? new Intl.DateTimeFormat('eu-ES', { dateStyle: 'medium' }).format(
              rawDelivery instanceof Date
                ? rawDelivery
                : new Date(rawDelivery as string)
            )
          : undefined;

      await sendPackageTrackingEmail({
        recipientEmail: pkg.recipient_email,
        recipientName: pkg.recipient_name,
        trackingUrl: trackingToken
          ? `${tracking_base_url}${trackingToken}`
          : undefined,
        packageStatus: change.newStatus,
        distributorName:
          distributorId != undefined
            ? (distributorNamesById.get(distributorId) ?? undefined)
            : undefined,
        estimatedDelivery,
      });
    })
  );
}
