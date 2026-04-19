export interface TrackingEmailParams {
  to: string;
  recipientName: string;
  trackingUrl: string;
}

export interface InTransitEmailParams {
  to: string;
  recipientName: string;
  trackingUrl: string;
  distributorName: string;
  estimatedDelivery: string;
}

export interface DeliveredEmailParams {
  to: string;
  recipientName: string;
  trackingUrl: string;
  deliveredAt: string;
}

export interface FailedEmailParams {
  to: string;
  recipientName: string;
  failedAt: string;
  reason?: string;
}

export interface PendingEmailParams {
  to: string;
  recipientName: string;
  trackingUrl: string;
}

export interface ResetPasswordEmailParams {
  to: string;
  recipientName: string;
  resetUrl: string;
}
