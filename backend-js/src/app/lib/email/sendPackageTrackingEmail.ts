import { PACKAGE_STATUSES, SendPackageTrackingEmailParams } from "@/app/types";
import { emailService } from "./email.service";

export async function sendPackageTrackingEmail(
  params: SendPackageTrackingEmailParams
): Promise<void> {
  const {
    recipientEmail,
    recipientName,
    trackingUrl,
    packageStatus,
    distributorName,
    estimatedDelivery,
    deliveredAt,
  } = params;

  if (packageStatus === PACKAGE_STATUSES.in_transit) {
    await emailService.sendInTransitEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl: trackingUrl ?? "",
      distributorName: distributorName ?? "our trusted carrier",
      estimatedDelivery: estimatedDelivery ?? "soon",
    });
  }

  if (packageStatus === PACKAGE_STATUSES.delivered) {
    await emailService.sendDeliveredEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl: trackingUrl ?? "",
      deliveredAt: deliveredAt ?? "recently",
    });
  }

  if (packageStatus === PACKAGE_STATUSES.assigned) {
    await emailService.sendAssignedEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl: trackingUrl ?? "",
    });
  }

  if (packageStatus === PACKAGE_STATUSES.failed) {
    await emailService.sendFailedEmail({
      to: recipientEmail,
      recipientName,
      failedAt: new Date().toISOString(),
      reason: "Unknown error",
    });
  }

  if (packageStatus === PACKAGE_STATUSES.pending) {
    await emailService.sendPendingEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl: trackingUrl ?? "",
    });
  }
}
