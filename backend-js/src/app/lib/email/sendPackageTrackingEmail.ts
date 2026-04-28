import { PACKAGE_STATUSES, SendPackageTrackingEmailParams } from '@/app/types';
import { emailService } from './email.service';

function formatEmailDateTime(date: Date): string {
  return new Intl.DateTimeFormat('eu-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

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
    failedAt,
    attemptedAt,
    reason,
  } = params;
  const nowLabel = formatEmailDateTime(new Date());

  if (packageStatus === PACKAGE_STATUSES.pending) {
    if (!trackingUrl) {
      throw new Error('Tracking URL is required for pending package emails');
    }

    await emailService.sendPendingEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl,
    });
    return;
  }

  if (packageStatus === PACKAGE_STATUSES.assigned) {
    if (!trackingUrl) {
      throw new Error('Tracking URL is required for assigned package emails');
    }

    await emailService.sendAssignedEmail({
      to: recipientEmail,
      recipientName,
      trackingUrl,
      estimatedDelivery,
    });
    return;
  }

  if (packageStatus === PACKAGE_STATUSES.in_transit) {
    await emailService.sendInTransitEmail({
      to: recipientEmail,
      recipientName,
      distributorName: distributorName ?? 'PakAG banatzailea',
      estimatedDelivery: estimatedDelivery ?? 'Seguraski gaur',
      trackingUrl,
    });
    return;
  }

  if (packageStatus === PACKAGE_STATUSES.delivered) {
    await emailService.sendDeliveredEmail({
      to: recipientEmail,
      recipientName,
      deliveredAt: deliveredAt ?? nowLabel,
      trackingUrl,
    });
    return;
  }

  if (packageStatus === PACKAGE_STATUSES.failed) {
    await emailService.sendFailedEmail({
      to: recipientEmail,
      recipientName,
      failedAt: failedAt ?? nowLabel,
      reason,
      trackingUrl,
    });
    return;
  }

  if (packageStatus === PACKAGE_STATUSES.undelivered) {
    await emailService.sendUndeliveredEmail({
      to: recipientEmail,
      recipientName,
      attemptedAt: attemptedAt ?? nowLabel,
      trackingUrl,
    });
    return;
  }
}
