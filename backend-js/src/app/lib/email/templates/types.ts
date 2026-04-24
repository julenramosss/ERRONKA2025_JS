export interface EmailInfoCard {
  label: string;
  value: string;
  accent?: string;
}

export interface EmailCta {
  label: string;
  url: string;
  fallbackHint?: string;
}

export interface EmailStatusBadge {
  label: string;
  fg: string;
  bg: string;
}

export interface EmailLayoutParams {
  title: string;
  preheader: string;
  statusBadge: EmailStatusBadge;
  greetingLabel?: string;
  greetingName: string;
  headline: string;
  paragraphs: string[];
  infoCards?: EmailInfoCard[];
  cta?: EmailCta;
  secondaryNote?: string;
  footerLines?: string[];
}

export interface PendingEmailTemplateParams {
  recipientName: string;
  trackingUrl: string;
}

export interface AssignedEmailTemplateParams {
  recipientName: string;
  trackingUrl: string;
  estimatedDelivery?: string;
}

export interface InTransitEmailTemplateParams {
  recipientName: string;
  distributorName: string;
  estimatedDelivery: string;
}

export interface DeliveredEmailTemplateParams {
  recipientName: string;
  deliveredAt: string;
}

export interface PackageFailedEmailTemplateParams {
  recipientName: string;
  failedAt: string;
  reason?: string;
}

export interface PackageUndeliveredEmailTemplateParams {
  recipientName: string;
  attemptedAt: string;
}

export interface PasswordChangeEmailTemplateParams {
  recipientName: string;
  changePasswordUrl: string;
}

export interface AccountActivationTemplateParams {
  recipientName: string;
  activationUrl: string;
}

export interface LoginNotificationTemplateParams {
  recipientName: string;
  loginAt: string;
  ipAddress: string;
  userAgent: string;
}
