import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/app/lib/errors";
import { PackageStatus, SendPackageTrackingEmailParams } from "@/app/types";
import {
  findPackageById,
  insertStatusLog,
  updatePackageStatus,
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
): Promise<PackageWithAddress> {
  const pkg = await findPackageById(dto.package_id);
  if (!pkg) throw new NotFoundError("Package not found");

  if (pkg.assigned_to !== userId) throw new ForbiddenError("Access denied");

  const allowed = VALID_TRANSITIONS[pkg.status];
  if (!allowed.includes(dto.new_status)) {
    throw new ValidationError(
      `Invalid status transition from '${pkg.status}' to '${dto.new_status}'`
    );
  }

  await updatePackageStatus(dto.package_id, dto.new_status);
  await insertStatusLog(dto.package_id, pkg.status, dto.new_status, userId);

  const trackingToken = await getTrackingTokenByPackageId(dto.package_id);
  const distributorName = await getDistributorName(userId);
  const trackingUrl = trackingToken
    ? `${tracking_base_url}/${trackingToken}`
    : "";

  const emailParams: SendPackageTrackingEmailParams = {
    recipientEmail: pkg.recipient_email,
    recipientName: pkg.recipient_name,
    trackingUrl,
    packageStatus: dto.new_status,
    distributorName: distributorName || undefined,
    estimatedDelivery: pkg.estimated_delivery || undefined,
    deliveredAt:
      dto.new_status === "delivered"
        ? new Date().toLocaleString("en-GB")
        : undefined,
  };
  await sendPackageTrackingEmail(emailParams);

  const updated = await findPackageById(dto.package_id);
  return updated!;
}
