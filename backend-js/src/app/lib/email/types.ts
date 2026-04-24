export interface AssignedEmailParams {
  to: string;
  recipientName: string;
  trackingUrl: string;
  estimatedDelivery?: string;
}

export interface InTransitEmailParams {
  to: string;
  recipientName: string;
  distributorName: string;
  estimatedDelivery: string;
}

export interface DeliveredEmailParams {
  to: string;
  recipientName: string;
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

export interface ActivationEmailParams {
  to: string;
  recipientName: string;
  activationUrl: string;
}

export interface UndeliveredEmailParams {
  to: string;
  recipientName: string;
  attemptedAt: string;
}

export interface LoginNotificationEmailParams {
  to: string;
  recipientName: string;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
}
